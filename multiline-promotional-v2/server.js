import express from "express";
import multer from "multer";
import mysql from "mysql2/promise";
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

if (!process.env.DB_PASSWORD && !process.env.DATABASE_URL && !process.env.MYSQL_URL && isProduction) {
  console.warn("[WARN] No DB_PASSWORD / DATABASE_URL / MYSQL_URL set. Set your Railway MySQL credentials before going live.");
}

// Railway's MySQL plugin exposes a full connection string (DATABASE_URL or
// MYSQL_URL, e.g. "mysql://user:pass@host:port/db"). If present, prefer it
// over the individual DB_* vars — this is the value you'll actually copy
// from the Railway dashboard. DB_SSL=true enables TLS for hosts that
// require it (Railway's public proxy endpoint does; its private network
// endpoint usually doesn't).
const connectionString =
  process.env.DATABASE_URL ||
  process.env.MYSQL_URL ||
  process.env.MYSQL_PUBLIC_URL;

const sslConfig =
  process.env.DB_SSL === "true"
    ? {
        rejectUnauthorized: false,
      }
    : undefined;

const pool = connectionString
  ? mysql.createPool({
      uri: connectionString,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: "utf8mb4",
      ssl: sslConfig,
    })
  : mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "Kashifmalik@2007",
      database: process.env.DB_NAME || "railway",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: "utf8mb4",
      ssl: sslConfig,
    });
// Verify DB connectivity at boot. This is intentionally NON-FATAL — the
// HTTP server still starts and serves the frontend even if MySQL is
// temporarily unreachable, so the whole app doesn't "exit early" over a
// transient database hiccup. Every request that actually needs the DB will
// still fail with a clear 500 + logged error until connectivity returns.
pool
  .getConnection()
  .then((conn) => {
    conn.release();
    console.log("[DB] MySQL connection verified.");
  })
  .catch((err) => {
    console.error("[DB] Could not connect to MySQL at boot:", err.message);
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
    const [rows] = await pool.query("SELECT * FROM categories ORDER BY sort_order, title");
    res.json(rows);
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
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         slug = VALUES(slug),
         tagline = VALUES(tagline),
         description = VALUES(description),
         banner_image = VALUES(banner_image),
         featured_image = VALUES(featured_image),
         icon_name = VALUES(icon_name),
         status = VALUES(status),
         featured_on_homepage = VALUES(featured_on_homepage),
         sort_order = VALUES(sort_order)`,
      [categoryId, title, categorySlug, tagline || null, description, bannerImage || null, featuredImage || null, iconName || null, status || "Active", featuredOnHomepage !== false, sortOrder || 1]
    );
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [categoryId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to create category");
  }
});

app.put("/api/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, tagline, description, bannerImage, featuredImage, iconName, status, featuredOnHomepage, sortOrder } = req.body;
    await pool.query(
      `UPDATE categories SET title = ?, slug = ?, tagline = ?, description = ?, banner_image = ?, featured_image = ?, icon_name = ?, status = ?, featured_on_homepage = ?, sort_order = ? WHERE id = ?`,
      [title, slug, tagline || null, description, bannerImage || null, featuredImage || null, iconName || null, status || "Active", featuredOnHomepage !== false, sortOrder || 1, id]
    );
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to update category");
  }
});

app.delete("/api/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    res.json({ success: true, id });
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to delete category");
  }
});

app.get("/api/products", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    const normalized = rows.map((row) => ({
      ...row,
      category: row.category_id,
      longDescription: row.long_description,
      images: row.images ? JSON.parse(row.images) : [],
      isFeatured: Boolean(row.is_featured),
      minOrder: Number(row.min_order),
      specs: row.specs ? JSON.parse(row.specs) : [],
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
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         slug = VALUES(slug),
         category_id = VALUES(category_id),
         description = VALUES(description),
         long_description = VALUES(long_description),
         image = VALUES(image),
         images = VALUES(images),
         is_featured = VALUES(is_featured),
         status = VALUES(status),
         min_order = VALUES(min_order),
         specs = VALUES(specs),
         price_inquiry_note = VALUES(price_inquiry_note),
         seo_title = VALUES(seo_title),
         seo_description = VALUES(seo_description),
         created_date = VALUES(created_date),
         updated_date = VALUES(updated_date)`,
      [productId, title, productSlug, category, description, longDescription || null, image || null, JSON.stringify(images || []), Boolean(isFeatured), status || "Active", Number(minOrder) || 1, JSON.stringify(specs || []), priceInquiryNote || null, seoTitle || null, seoDescription || null, createdDate || null, updatedDate || null]
    );
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [productId]);
    const row = rows[0];
    res.status(201).json({
      ...row,
      category: row.category_id,
      longDescription: row.long_description,
      images: row.images ? JSON.parse(row.images) : [],
      isFeatured: Boolean(row.is_featured),
      minOrder: Number(row.min_order),
      specs: row.specs ? JSON.parse(row.specs) : [],
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
      `UPDATE products SET title = ?, slug = ?, category_id = ?, description = ?, long_description = ?, image = ?, images = ?, is_featured = ?, status = ?, min_order = ?, specs = ?, price_inquiry_note = ?, seo_title = ?, seo_description = ?, created_date = ?, updated_date = ? WHERE id = ?`,
      [title, slug, category, description, longDescription || null, image || null, JSON.stringify(images || []), Boolean(isFeatured), status || "Active", Number(minOrder) || 1, JSON.stringify(specs || []), priceInquiryNote || null, seoTitle || null, seoDescription || null, createdDate || null, updatedDate || null, id]
    );
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
    const row = rows[0];
    res.json({
      ...row,
      category: row.category_id,
      longDescription: row.long_description,
      images: row.images ? JSON.parse(row.images) : [],
      isFeatured: Boolean(row.is_featured),
      minOrder: Number(row.min_order),
      specs: row.specs ? JSON.parse(row.specs) : [],
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
    await pool.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ success: true, id });
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to delete product");
  }
});

app.get("/api/quotes", async (_req, res) => {
  try {
    const [quoteRows] = await pool.query("SELECT * FROM quotes ORDER BY created_at DESC");
    const [itemRows] = await pool.query("SELECT * FROM quote_items ORDER BY id");
    const itemMap = new Map();
    for (const item of itemRows) {
      itemMap.set(item.quote_id, [...(itemMap.get(item.quote_id) || []), item]);
    }
    const normalized = quoteRows.map((row) => ({
      ...row,
      date: row.quote_date,
      items: (itemMap.get(row.id) || []).map((item) => ({
        product: item.product_snapshot ? JSON.parse(item.product_snapshot) : null,
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
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [quoteId, date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), name, phone, email, org || null, dateNeeded || null, city || null, commPref, extraDetails || null, status || "Pending"]
    );
    if (Array.isArray(items)) {
      for (const item of items) {
        const productSnapshot = item.product ? JSON.stringify(item.product) : null;
        await pool.query(
          `INSERT INTO quote_items (quote_id, product_id, quantity, customization_notes, product_snapshot) VALUES (?, ?, ?, ?, ?)`,
          [quoteId, item.product?.id || null, Number(item.quantity) || 1, item.customizationNotes || null, productSnapshot]
        );
      }
    }
    const [rows] = await pool.query("SELECT * FROM quotes WHERE id = ?", [quoteId]);
    res.status(201).json({
      ...rows[0],
      date: rows[0].quote_date,
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
      `UPDATE quotes SET quote_date = ?, name = ?, phone = ?, email = ?, org = ?, date_needed = ?, city = ?, comm_pref = ?, extra_details = ?, status = ? WHERE id = ?`,
      [date || new Date().toLocaleDateString("en-US"), name, phone, email, org || null, dateNeeded || null, city || null, commPref, extraDetails || null, status || "Pending", id]
    );
    await pool.query("DELETE FROM quote_items WHERE quote_id = ?", [id]);
    if (Array.isArray(items)) {
      for (const item of items) {
        const productSnapshot = item.product ? JSON.stringify(item.product) : null;
        await pool.query(
          `INSERT INTO quote_items (quote_id, product_id, quantity, customization_notes, product_snapshot) VALUES (?, ?, ?, ?, ?)`,
          [id, item.product?.id || null, Number(item.quantity) || 1, item.customizationNotes || null, productSnapshot]
        );
      }
    }
    const [rows] = await pool.query("SELECT * FROM quotes WHERE id = ?", [id]);
    res.json({
      ...rows[0],
      date: rows[0].quote_date,
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
    await pool.query("DELETE FROM quotes WHERE id = ?", [id]);
    res.json({ success: true, id });
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to delete quote");
  }
});

app.get("/api/messages", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM messages ORDER BY created_at DESC");
    const normalized = rows.map((row) => ({
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
      `INSERT INTO messages (id, message_date, name, email, subject, message, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [messageId, date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), name, email, subject || null, message, status || "Unread"]
    );
    const [rows] = await pool.query("SELECT * FROM messages WHERE id = ?", [messageId]);
    res.status(201).json({ ...rows[0], date: rows[0].message_date });
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to create message");
  }
});

app.put("/api/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { date, name, email, subject, message, status } = req.body;
    await pool.query(
      `UPDATE messages SET message_date = ?, name = ?, email = ?, subject = ?, message = ?, status = ? WHERE id = ?`,
      [date || new Date().toLocaleDateString("en-US"), name, email, subject || null, message, status || "Unread", id]
    );
    const [rows] = await pool.query("SELECT * FROM messages WHERE id = ?", [id]);
    res.json({ ...rows[0], date: rows[0].message_date });
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : "Failed to update message");
  }
});

app.delete("/api/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM messages WHERE id = ?", [id]);
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
