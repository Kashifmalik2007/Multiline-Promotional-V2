import express from "express";
import multer from "multer";
import pg from "pg";
const { Pool } = pg;
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT || 3001);

// Hostinger shared hosting sits behind a reverse proxy (LiteSpeed/Passenger).
// Trusting the proxy lets req.secure / rate limiting / logging behave correctly.
app.set("trust proxy", 1);

// UPLOAD_DIR lets you point uploads at a persistent path outside the app's
// deploy folder if desired. Defaults to ./uploads next to server.js.
const uploadDir = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(__dirname, "uploads");
const uploadBaseUrl = (process.env.UPLOAD_BASE_URL || process.env.APP_URL || `http://localhost:${port}`).replace(/\/+$/, "");

// Built frontend output (vite build -> dist/) served by this same Express
// process, since Hostinger Business Shared Hosting only allows a single
// Node.js application per (sub)domain.
const distDir = path.join(__dirname, "dist");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!process.env.DATABASE_URL && isProduction) {
  console.warn("[WARN] No DATABASE_URL set. Set your Render/Postgres credentials before going live.");
}

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      max: 10,
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
      max: 10,
    });
// Verify DB connectivity at boot. This is intentionally NON-FATAL — the
// HTTP server still starts and serves the frontend even if MySQL is
// temporarily unreachable, so the whole app doesn't "exit early" over a
// transient database hiccup. Every request that actually needs the DB will
// still fail with a clear 500 + logged error until connectivity returns.
pool
  .connect()
  .then((client) => {
    client.release();
    console.log("[DB] PostgreSQL connection verified.");
  })
  .catch((err) => {
    console.error("[DB] Could not connect to PostgreSQL at boot:", err.message);
    console.error("[DB] Check DATABASE_URL / DB_HOST / DB_USER / DB_PASSWORD / DB_NAME and DB_SSL.");
  });

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, "");
    const safeBase = path.basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9-_]+/g, "-")
      .slice(0, 60);
    cb(null, `${Date.now()}-${safeBase || "upload"}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    // Previously ANY file type was accepted (arbitrary file upload risk).
    // Only allow actual image mime types now.
    if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
      return cb(new Error("Only image files (jpg, png, webp, gif, svg) are allowed."));
    }
    cb(null, true);
  }
});

// CORS is now restricted to configured origin(s) instead of "*".
// Set ALLOWED_ORIGIN in .env to your real domain(s), comma separated.
const allowedOrigins = (process.env.ALLOWED_ORIGIN || "*")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes("*") || !origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(
  helmet({
    // Disable CSP by default; the SPA is served from this same origin and a
    // strict default CSP tends to block Vite's built assets/fonts. Tighten
    // this once you finalize your asset/CDN origins.
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(uploadDir, { maxAge: "7d" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, uploadDir, env: process.env.NODE_ENV || "development" });
});

app.get("/api/db-test", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");
    res.json({ success: true, database: "postgresql", current_time: result.rows[0].current_time });
  } catch (err) {
    res.status(500).json({ success: false, error: "Database test failed" });
  }
});

app.post("/api/uploads", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      // multer/fileFilter errors (bad type, too large, etc.) land here instead
      // of crashing the process or falling through as an unhandled rejection.
      return res.status(400).json({ error: err.message || "Upload failed." });
    }
    next();
  });
}, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file was provided." });
  }

  const uploadedUrl = `${uploadBaseUrl}/uploads/${req.file.filename}`;
  return res.json({
    success: true,
    url: uploadedUrl,
    fileName: req.file.filename,
    mimeType: req.file.mimetype,
  });
});

const sendError = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({ error: message });
};

app.get("/api/categories", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY sort_order, title");
    res.json(result.rows);
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to load categories");
  }
});

app.post("/api/categories", async (req, res) => {
  try {
    const { id, title, slug, tagline, description, bannerImage, featuredImage, iconName, status, featuredOnHomepage, sortOrder } = req.body;
    const categoryId = id || title;
    const categorySlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await pool.query(
      `INSERT INTO categories (id, title, slug, tagline, description, banner_image, featured_image, icon_name, status, featured_on_homepage, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         slug = EXCLUDED.slug,
         tagline = EXCLUDED.tagline,
         description = EXCLUDED.description,
         banner_image = EXCLUDED.banner_image,
         featured_image = EXCLUDED.featured_image,
         icon_name = EXCLUDED.icon_name,
         status = EXCLUDED.status,
         featured_on_homepage = EXCLUDED.featured_on_homepage,
         sort_order = EXCLUDED.sort_order`,
      [categoryId, title, categorySlug, tagline || null, description, bannerImage || null, featuredImage || null, iconName || null, status || "Active", featuredOnHomepage !== false, sortOrder || 1]
    );
    const result = await pool.query("SELECT * FROM categories WHERE id = $1", [categoryId]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to create category");
  }
});

app.put("/api/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, tagline, description, bannerImage, featuredImage, iconName, status, featuredOnHomepage, sortOrder } = req.body;
    await pool.query(
      `UPDATE categories SET title = $1, slug = $2, tagline = $3, description = $4, banner_image = $5, featured_image = $6, icon_name = $7, status = $8, featured_on_homepage = $9, sort_order = $10, updated_at = NOW() WHERE id = $11`,
      [title, slug, tagline || null, description, bannerImage || null, featuredImage || null, iconName || null, status || "Active", featuredOnHomepage !== false, sortOrder || 1, id]
    );
    const result = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);
    res.json(result.rows[0]);
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to update category");
  }
});

app.delete("/api/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM categories WHERE id = $1", [id]);
    res.json({ success: true, id });
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to delete category");
  }
});

app.get("/api/products", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    const normalized = result.rows.map((row) => ({
      ...row,
      category: row.category_id,
      longDescription: row.long_description,
      images: Array.isArray(row.images) ? row.images : (row.images ? JSON.parse(row.images) : []),
      isFeatured: Boolean(row.is_featured),
      minOrder: Number(row.min_order),
      specs: Array.isArray(row.specs) ? row.specs : (row.specs ? JSON.parse(row.specs) : []),
      seoTitle: row.seo_title,
      seoDescription: row.seo_description,
      createdDate: row.created_date,
      updatedDate: row.updated_date,
      image: row.image || row.id,
    }));
    res.json(normalized);
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to load products");
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const { id, title, slug, category, description, longDescription, image, images, isFeatured, status, minOrder, specs, priceInquiryNote, seoTitle, seoDescription, createdDate, updatedDate } = req.body;
    const productId = id || `prod-${Date.now()}`;
    const productSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await pool.query(
      `INSERT INTO products (id, title, slug, category_id, description, long_description, image, images, is_featured, status, min_order, specs, price_inquiry_note, seo_title, seo_description, created_date, updated_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         slug = EXCLUDED.slug,
         category_id = EXCLUDED.category_id,
         description = EXCLUDED.description,
         long_description = EXCLUDED.long_description,
         image = EXCLUDED.image,
         images = EXCLUDED.images,
         is_featured = EXCLUDED.is_featured,
         status = EXCLUDED.status,
         min_order = EXCLUDED.min_order,
         specs = EXCLUDED.specs,
         price_inquiry_note = EXCLUDED.price_inquiry_note,
         seo_title = EXCLUDED.seo_title,
         seo_description = EXCLUDED.seo_description,
         created_date = EXCLUDED.created_date,
         updated_date = EXCLUDED.updated_date`,
      [productId, title, productSlug, category, description, longDescription || null, image || null, images || [], Boolean(isFeatured), status || "Active", Number(minOrder) || 1, specs || [], priceInquiryNote || null, seoTitle || null, seoDescription || null, createdDate || null, updatedDate || null]
    );
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [productId]);
    const row = result.rows[0];
    res.status(201).json({
      ...row,
      category: row.category_id,
      longDescription: row.long_description,
      images: Array.isArray(row.images) ? row.images : (row.images ? JSON.parse(row.images) : []),
      isFeatured: Boolean(row.is_featured),
      minOrder: Number(row.min_order),
      specs: Array.isArray(row.specs) ? row.specs : (row.specs ? JSON.parse(row.specs) : []),
      seoTitle: row.seo_title,
      seoDescription: row.seo_description,
      createdDate: row.created_date,
      updatedDate: row.updated_date,
      image: row.image || row.id,
    });
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to create product");
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, category, description, longDescription, image, images, isFeatured, status, minOrder, specs, priceInquiryNote, seoTitle, seoDescription, createdDate, updatedDate } = req.body;
    await pool.query(
      `UPDATE products SET title = $1, slug = $2, category_id = $3, description = $4, long_description = $5, image = $6, images = $7, is_featured = $8, status = $9, min_order = $10, specs = $11, price_inquiry_note = $12, seo_title = $13, seo_description = $14, created_date = $15, updated_date = $16, updated_at = NOW() WHERE id = $17`,
      [title, slug, category, description, longDescription || null, image || null, images || [], Boolean(isFeatured), status || "Active", Number(minOrder) || 1, specs || [], priceInquiryNote || null, seoTitle || null, seoDescription || null, createdDate || null, updatedDate || null, id]
    );
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    const row = result.rows[0];
    res.json({
      ...row,
      category: row.category_id,
      longDescription: row.long_description,
      images: Array.isArray(row.images) ? row.images : (row.images ? JSON.parse(row.images) : []),
      isFeatured: Boolean(row.is_featured),
      minOrder: Number(row.min_order),
      specs: Array.isArray(row.specs) ? row.specs : (row.specs ? JSON.parse(row.specs) : []),
      seoTitle: row.seo_title,
      seoDescription: row.seo_description,
      createdDate: row.created_date,
      updatedDate: row.updated_date,
      image: row.image || row.id,
    });
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to update product");
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.json({ success: true, id });
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to delete product");
  }
});

app.get("/api/quotes", async (_req, res) => {
  try {
    const quoteRes = await pool.query("SELECT * FROM quotes ORDER BY created_at DESC");
    const itemRes = await pool.query("SELECT * FROM quote_items ORDER BY id");
    const quoteRows = quoteRes.rows;
    const itemRows = itemRes.rows;
    const itemMap = new Map();
    for (const item of itemRows) {
      itemMap.set(item.quote_id, [...(itemMap.get(item.quote_id) || []), item]);
    }
    const normalized = quoteRows.map((row) => ({
      ...row,
      date: row.quote_date,
      items: (itemMap.get(row.id) || []).map((item) => ({
        product: item.product_snapshot ? (typeof item.product_snapshot === 'string' ? JSON.parse(item.product_snapshot) : item.product_snapshot) : null,
        quantity: Number(item.quantity),
        customizationNotes: item.customization_notes,
      }))
    }));
    res.json(normalized);
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to load quotes");
  }
});

app.post("/api/quotes", async (req, res) => {
  try {
    const { id, date, name, phone, email, org, dateNeeded, city, commPref, extraDetails, status, items } = req.body;
    const quoteId = id || `QT-${Date.now()}`;
    await pool.query(
      `INSERT INTO quotes (id, quote_date, name, phone, email, org, date_needed, city, comm_pref, extra_details, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [quoteId, date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), name, phone, email, org || null, dateNeeded || null, city || null, commPref, extraDetails || null, status || "Pending"]
    );
    if (Array.isArray(items)) {
      for (const item of items) {
        const productSnapshot = item.product || null;
        await pool.query(
          `INSERT INTO quote_items (quote_id, product_id, quantity, customization_notes, product_snapshot) VALUES ($1, $2, $3, $4, $5)`,
          [quoteId, item.product?.id || null, Number(item.quantity) || 1, item.customizationNotes || null, productSnapshot]
        );
      }
    }
    const result = await pool.query("SELECT * FROM quotes WHERE id = $1", [quoteId]);
    res.status(201).json({
      ...result.rows[0],
      date: result.rows[0].quote_date,
      items: Array.isArray(items) ? items.map((item) => ({
        product: item.product || null,
        quantity: Number(item.quantity) || 1,
        customizationNotes: item.customizationNotes || null,
      })) : []
    });
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to create quote");
  }
});

app.put("/api/quotes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { date, name, phone, email, org, dateNeeded, city, commPref, extraDetails, status, items } = req.body;
    await pool.query(
      `UPDATE quotes SET quote_date = $1, name = $2, phone = $3, email = $4, org = $5, date_needed = $6, city = $7, comm_pref = $8, extra_details = $9, status = $10, updated_at = NOW() WHERE id = $11`,
      [date || new Date().toLocaleDateString("en-US"), name, phone, email, org || null, dateNeeded || null, city || null, commPref, extraDetails || null, status || "Pending", id]
    );
    await pool.query("DELETE FROM quote_items WHERE quote_id = $1", [id]);
    if (Array.isArray(items)) {
      for (const item of items) {
        const productSnapshot = item.product || null;
        await pool.query(
          `INSERT INTO quote_items (quote_id, product_id, quantity, customization_notes, product_snapshot) VALUES ($1, $2, $3, $4, $5)`,
          [id, item.product?.id || null, Number(item.quantity) || 1, item.customizationNotes || null, productSnapshot]
        );
      }
    }
    const result = await pool.query("SELECT * FROM quotes WHERE id = $1", [id]);
    res.json({
      ...result.rows[0],
      date: result.rows[0].quote_date,
      items: Array.isArray(items) ? items.map((item) => ({
        product: item.product || null,
        quantity: Number(item.quantity) || 1,
        customizationNotes: item.customizationNotes || null,
      })) : []
    });
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to update quote");
  }
});

app.delete("/api/quotes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM quotes WHERE id = $1", [id]);
    res.json({ success: true, id });
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to delete quote");
  }
});

app.get("/api/messages", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM messages ORDER BY created_at DESC");
    const normalized = result.rows.map((row) => ({
      ...row,
      date: row.message_date,
    }));
    res.json(normalized);
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to load messages");
  }
});

app.post("/api/messages", async (req, res) => {
  try {
    const { id, date, name, email, subject, message, status } = req.body;
    const messageId = id || `MSG-${Date.now()}`;
    await pool.query(
      `INSERT INTO messages (id, message_date, name, email, subject, message, status) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [messageId, date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), name, email, subject || null, message, status || "Unread"]
    );
    const result = await pool.query("SELECT * FROM messages WHERE id = $1", [messageId]);
    res.status(201).json({ ...result.rows[0], date: result.rows[0].message_date });
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to create message");
  }
});

app.put("/api/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { date, name, email, subject, message, status } = req.body;
    await pool.query(
      `UPDATE messages SET message_date = $1, name = $2, email = $3, subject = $4, message = $5, status = $6, updated_at = NOW() WHERE id = $7`,
      [date || new Date().toLocaleDateString("en-US"), name, email, subject || null, message, status || "Unread", id]
    );
    const result = await pool.query("SELECT * FROM messages WHERE id = $1", [id]);
    res.json({ ...result.rows[0], date: result.rows[0].message_date });
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to update message");
  }
});

app.delete("/api/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM messages WHERE id = $1", [id]);
    res.json({ success: true, id });
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to delete message");
  }
});

// Serve the built React app (npm run build -> dist/) from the same Node
// process. Hostinger Business Shared Hosting exposes one Node.js app per
// domain/subdomain, so the API and the static frontend must share a port.
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir, { maxAge: isProduction ? "1d" : 0 }));
  // SPA fallback: any non-/api, non-/uploads route returns index.html so
  // client-side routing (React state-based navigation) keeps working on
  // hard refreshes / deep links.
  app.get(/^(?!\/api|\/uploads|\/health).*/, (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
} else {
  console.warn(`[WARN] ${distDir} not found. Run "npm run build" before starting in production.`);
}

// 404 for unmatched API routes
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Centralized error handler — keeps stack traces out of API responses.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: isProduction ? "Internal server error" : err.message });
});

// These two handlers are the actual fix for Render's opaque "Application
// exited early" message: previously an uncaught error anywhere (e.g. a
// bad env var, a bug in a route) would kill the process with no log line
// explaining why. Now every crash is logged with a full stack trace before
// the process exits, so the Render/Hostinger logs tell you exactly what
// broke.
process.on("unhandledRejection", (reason) => {
  console.error("[FATAL] Unhandled promise rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught exception:", err);
  process.exit(1);
});

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Multiline Promotional server listening on http://0.0.0.0:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`[FATAL] Port ${port} is already in use. Set a different PORT env var.`);
  } else {
    console.error("[FATAL] Server failed to start:", err);
  }
  process.exit(1);
});

// Graceful shutdown on Render/Hostinger deploy restarts.
process.on("SIGTERM", () => {
  console.log("[INFO] SIGTERM received, shutting down gracefully.");
  server.close(() => pool.end().finally(() => process.exit(0)));
});
