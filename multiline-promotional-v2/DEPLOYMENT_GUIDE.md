# Deployment Guide — Multiline Promotional V2

One Express process serves **both** the REST API (`/api/...`) and the
built React frontend (everything else) from a single port. That's what
makes this one deployable application instead of two, and it's the model
used identically on **Render** (current) and **Hostinger Business Shared
Hosting** (final target) — only the hosting steps differ.

```
Browser → Express (server.js) ─┬─ /api/*      → MySQL (Railway)
                                ├─ /uploads/*  → local disk (multer)
                                └─ everything else → dist/index.html (React SPA)
```

---

## Part A — Railway (MySQL database)

This is your database host regardless of whether the app itself runs on
Render or Hostinger.

1. [railway.app](https://railway.app) → **New Project → Provision MySQL**.
2. Once created, open the MySQL service → **Variables** (or **Connect**)
   tab. Copy the connection string — it looks like:
   ```
   mysql://root:PASSWORD@containers-us-west-1.railway.app:6543/railway
   ```
   That full string is your `DATABASE_URL`.
3. Import the schema. Easiest path: Railway's MySQL service → **Data** tab
   → **Query** → paste the contents of `db/schema.sql` → run it. (Or
   connect with any MySQL client / the `mysql` CLI using the connection
   string and pipe the file in: `mysql <connection args> < db/schema.sql`.)
4. Confirm `categories`, `products`, `quotes`, `quote_items`, and
   `messages` tables exist, and `categories` has 4 seeded rows.
5. If your backend connects over Railway's **public** network (i.e. it's
   NOT also hosted on Railway, which is our case — it's on Render), you
   may need `DB_SSL=true`. Try `false` first; only flip it if the app logs
   a TLS/handshake error at boot.
6. Keep this `DATABASE_URL` handy — it goes into Render's environment
   variables in Part B, step 4.

---

## Part B — Render (current hosting)

### 1. Push the project to a Git repository
Render deploys from GitHub/GitLab. Commit this project (`.env` is already
git-ignored — never commit real credentials).

### 2. Create the Web Service
In the Render dashboard: **New + → Web Service** → connect your repo.

- **Runtime**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Health Check Path**: `/health`

(Or skip the manual form entirely and use **New + → Blueprint**, pointing
at this repo — it will read `render.yaml` and set all of the above
automatically.)

### 3. Add a persistent disk (important)
Render's filesystem is **ephemeral** — every deploy/restart wipes it. If
you skip this, admin-uploaded product images will vanish on the next
deploy. Under the service → **Disks** → **Add Disk**:
- Mount path: `/var/data/uploads`
- Size: 1 GB is plenty to start

(This requires a paid Render plan — persistent disks aren't available on
the free tier. `render.yaml` already declares this disk if you deployed
via Blueprint.)

### 4. Environment variables
Service → **Environment**:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | the Railway connection string from Part A |
| `DB_SSL` | `false` (flip to `true` only if MySQL connection errors mention TLS) |
| `APP_URL` | `https://your-app.onrender.com` (your actual Render URL) |
| `UPLOAD_BASE_URL` | same as `APP_URL` |
| `ALLOWED_ORIGIN` | same as `APP_URL` (or `*` while testing) |
| `UPLOAD_DIR` | `/var/data/uploads` (matches the disk mount path from step 3) |

Do **not** set `PORT` — Render injects it automatically and `server.js`
already reads `process.env.PORT`.

### 5. Deploy
Click **Create Web Service** (or **Deploy** if editing). Watch the logs —
you should see:
```
[DB] MySQL connection verified.
Multiline Promotional server listening on http://0.0.0.0:XXXX
Environment: production
```
If it crashes, the new process-level error handlers in `server.js` will
print the real error (previously Render just said "Application exited
early" with no explanation).

### 6. Verify
```
curl https://your-app.onrender.com/health
curl https://your-app.onrender.com/api/categories
```
Then open the URL in a browser, click through Home → Catalog → Admin
Portal, and confirm the admin login + product CRUD + image upload all
work end to end.

---

## Part C — Hostinger Business Shared Hosting (final production target)

Migrating later requires **no code changes** — only redeployment steps,
because the app was built single-process from the start.

### 1. Create the MySQL database (only if moving off Railway)
If you're keeping Railway MySQL, skip to step 3 and just reuse the same
`DATABASE_URL`. To move the database to Hostinger instead:
- hPanel → **Databases → MySQL Databases** → create a database + user.
- hPanel → **phpMyAdmin** → open the new database → **Import** →
  `db/schema.sql`.
- Export your Railway data first (`mysqldump` or phpMyAdmin **Export**)
  and import it into the new Hostinger database if you have existing data.

### 2. Upload the project
Via Hostinger **File Manager**, FTP/SFTP, or Git deployment — upload the
whole project folder (excluding `node_modules/` and `dist/`, which you'll
rebuild on the server) to your domain's root, e.g.
`/home/USERNAME/domains/yourdomain.com/public_html`.

### 3. Configure `.env`
Copy `.env.example` to `.env` and fill in:
- `DATABASE_URL` (Railway string, or the new Hostinger `DB_HOST` /
  `DB_USER` / `DB_PASSWORD` / `DB_NAME` if you migrated the DB)
- `APP_URL`, `UPLOAD_BASE_URL`, `ALLOWED_ORIGIN` → `https://www.yourdomain.com`
- `UPLOAD_DIR` → an absolute path outside the deploy folder if you want
  uploads to survive future redeploys, e.g. `/home/USERNAME/persistent-uploads`

### 4. Install, build, and configure the Node.js app
hPanel → **Advanced → Node.js** → create an application:
- Node.js version: 18.x or newer
- Application root: the folder you uploaded to
- Application startup file: `server.js`
- Use the panel's built-in terminal (or SSH) to run:
  ```bash
  npm install
  npm run build
  ```
- Click **Restart** after every future code update.

### 5. `.htaccess`
Hostinger auto-generates a Passenger block at the top of `.htaccess` when
you create the Node.js app — leave it in place. This project's own rules
(HTTPS redirect, dotfile blocking, security headers) live below it and
are preserved.

### 6. SSL
hPanel → **SSL** → issue a free Let's Encrypt certificate. Confirm
`https://yourdomain.com` loads without warnings.

### 7. Verify
Same checks as Render Part B step 6, against your Hostinger domain.

---

## Complete list of modified/added files

| File | What changed |
|---|---|
| `server.js` | Serves `dist/`, real CORS allowlist, image-only upload validation, `helmet`/`compression`, Railway `DATABASE_URL`/SSL support, non-fatal DB boot check, process-level crash logging, graceful shutdown |
| `package.json` | Fixed `clean` script (previously deleted `server.js`), removed dead deps (`@google/genai`, `motion`), added single-command `npm run dev` (via `concurrently`), `npm run build`, `npm start` exactly as required |
| `src/config/api.ts` | **New.** Centralized API base URL / upload endpoint / fetch helper — the single place dev-vs-production URL switching happens |
| `src/context/ProductContext.tsx` | Now uses `src/config/api.ts` instead of a duplicated fetch helper; `resetAllCatalogs` now actually deletes from MySQL |
| `src/context/QuoteListContext.tsx` | Added missing `updateQuoteItem` method (was called by `QuoteRequestPage` but never existed) |
| `src/components/AdminPanel.tsx` | Now uses `src/config/api.ts` for the upload endpoint instead of a hardcoded `localhost:3001` fallback |
| `src/components/CatalogPage.tsx`, `src/components/HomeSections.tsx` | Categories now come from the MySQL-backed `useProducts().categories` instead of a hardcoded local array |
| `src/components/ProductImageRenderer.tsx` | Fixed fallback label only replacing the first hyphen |
| `src/data/products.ts` | Removed dead hardcoded `CATEGORIES` export |
| `src/data/contact.ts` | Recreated (was imported everywhere but missing on disk) |
| `vite.config.ts` | Added `/api` + `/uploads` dev proxy, vendor chunk splitting, removed AI-Studio-specific HMR hacks |
| `tsconfig.json` | Path alias + `include` updated for the `src/` layout |
| `db/schema.sql` | **New.** Full schema + seeded categories |
| `.env.example` | **New/updated.** Railway `DATABASE_URL`, Render/Hostinger URL vars, Vite build-time vars |
| `.htaccess` | **New.** Hostinger hardening rules |
| `render.yaml` | **New.** Optional Render Blueprint (build/start commands, persistent disk, env var placeholders) |
| `.gitignore` | Added `uploads/*` (kept via `.gitkeep`), confirmed `.env` is ignored |
| `README.md` | **New.** Project overview + full changelog |
| `src/assets/**` | Generated placeholders (logo, hero, product photos) — the originals never existed on disk; replace with real photography before launch |

## Deployment checklist

- [ ] Railway MySQL provisioned, `db/schema.sql` imported, `DATABASE_URL` copied
- [ ] `npm install && npm run build` runs cleanly with no errors
- [ ] `npm start` boots and logs `[DB] MySQL connection verified.`
- [ ] `GET /health` returns `{"ok":true,...}`
- [ ] `GET /api/categories` returns the 4 seeded categories
- [ ] Admin login works; default password changed immediately
- [ ] Create/edit/delete product, category, quote, message all persist after refresh
- [ ] Image upload works and the returned URL uses your real domain, not `localhost`
- [ ] Hard-refreshing any page (not just Home) does not 404 (SPA fallback working)
- [ ] `ALLOWED_ORIGIN` set to your real domain, not left as `*`
- [ ] Render persistent disk attached (or Hostinger `UPLOAD_DIR` set) so uploads survive redeploys
- [ ] `.env` never committed to git

---

## Final folder structure

```
multiline-promotional-v2/
├── .env.example
├── .gitignore
├── .htaccess
├── README.md
├── DEPLOYMENT_GUIDE.md
├── render.yaml
├── package.json
├── server.js                 ← single entry point: API + static frontend
├── tsconfig.json
├── vite.config.ts
├── index.html
├── metadata.json
├── db/
│   └── schema.sql
├── uploads/                   ← multer output, served at /uploads/*
│   └── .gitkeep
├── dist/                       ← generated by `npm run build` (git-ignored)
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── types.ts
    ├── index.css
    ├── vite-env.d.ts
    ├── config/
    │   └── api.ts               ← centralized API base URL / fetch helper
    ├── context/
    │   ├── ProductContext.tsx    ← MySQL-backed (products/categories/quotes/messages)
    │   └── QuoteListContext.tsx  ← localStorage-backed shopping cart
    ├── data/
    │   ├── contact.ts
    │   └── products.ts           ← only static marketing copy (client reviews) now
    ├── components/
    │   └── ... (unchanged UI, 13 components)
    └── assets/
        ├── logo/, ui/, products/  ← placeholder images, replace before launch
```

---

## Local development

```bash
npm install
cp .env.example .env       # fill in DATABASE_URL (Railway) for local testing
npm run dev                 # runs Vite (:3000) + Express (:3001) together
```
Open `http://localhost:3000` — the Vite dev server proxies `/api` and
`/uploads` to Express on `:3001` automatically (see `vite.config.ts`), so
no env var changes are needed for local dev.
