# Multiline Promotional V2

Production-ready React 19 + Vite + TypeScript frontend, backed by an
Express + MySQL API, packaged for deployment on **Hostinger Business
Shared Hosting** (single Node.js app, no VPS/Docker/PM2 required).

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for the full
step-by-step Hostinger deployment walkthrough.

## Quick start (local development)

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL (Railway) or local MySQL credentials
npm run dev                # single command: Vite (:3000) + Express (:3001) together
```

All frontend API calls go through `src/config/api.ts` — the one place that
decides whether to call a relative `/api` path (dev via the Vite proxy,
Render, Hostinger — same-origin everywhere) or an explicit
`VITE_API_BASE_URL` if you ever split frontend/backend across hosts.

## Production build & run

```bash
npm run build   # compiles the React app into dist/
npm start        # node server.js — serves the API AND dist/ from one process
```

## Project structure

```
├── db/schema.sql          MySQL schema + seed categories
├── server.js              Express API + static frontend server (Render/Hostinger entry point)
├── render.yaml             Optional Render Blueprint (build/start commands, persistent disk)
├── src/
│   ├── main.tsx            Vite entry point
│   ├── App.tsx              Router / page switcher
│   ├── config/api.ts         Centralized API base URL + fetch helper (dev/prod switching)
│   ├── components/          All React components (Navbar, AdminPanel, CatalogPage, ...)
│   ├── context/               ProductContext (MySQL-backed) + QuoteListContext (localStorage cart)
│   ├── data/                   Static marketing copy that isn't in the database (client reviews)
│   └── assets/                  Logo / hero / product placeholder images — replace with real photography
├── uploads/                 Admin-uploaded product images (persisted on disk, served at /uploads/*)
├── .env.example             Copy to .env and fill in real values
└── .htaccess                 Hostinger hardening rules (HTTPS redirect, dotfile blocking, security headers)
```

## What was fixed vs. the original project

This project as originally supplied would **not build or run** — `index.html`
pointed at `/src/main.tsx`, but no `src/` folder existed anywhere on disk,
and several files it depended on (`data/products.ts`, `data/contact.ts`,
all image assets) didn't exist at all. Beyond restructuring the project
into a real, buildable layout, the following concrete bugs were fixed:

| # | Issue | File(s) | Fix |
|---|-------|---------|-----|
| 1 | App didn't build: source files were flat at repo root but `index.html` expects `/src/*` | whole project | Moved everything into `src/components`, `src/context`, `src/data` |
| 2 | `data/products.ts` and `data/contact.ts` were imported everywhere but never existed | 7+ components | Recreated both files |
| 3 | All image assets (`logo.png`, `ceo.jpg`, hero image, 20 product photos) were missing | `src/assets/**` | Generated placeholders so the build succeeds — **replace with real photography before launch** |
| 4 | `npm run clean` deleted `server.js` (`rm -rf dist server.js`) | `package.json` | Now only removes `dist/` |
| 5 | Two unused/dead dependencies bloating the bundle & attack surface | `package.json` | Removed `@google/genai`, `motion` |
| 6 | `QuoteRequestPage` called `updateQuoteItem(id, qty, notes)` which never existed on the context (only `updateQuantity(id, qty)`) — editing quantity/notes in the quote workspace silently failed | `src/context/QuoteListContext.tsx` | Added `updateQuoteItem` |
| 7 | Admin "Reset Catalog Defaults" only cleared local React state — MySQL was untouched, misleading the admin | `src/context/ProductContext.tsx` | Now deletes every row via the existing REST endpoints |
| 8 | Categories were hardcoded in the frontend instead of coming from MySQL, so admin-created categories never appeared on the public site | `CatalogPage.tsx`, `HomeSections.tsx` | Now sourced from `useProducts().categories` |
| 9 | CORS wildcard (`*`) accepted requests from any origin | `server.js` | Configurable allowlist via `ALLOWED_ORIGIN` |
| 10 | Image upload endpoint accepted **any** file type (arbitrary file upload risk) | `server.js` | `multer` `fileFilter` now only allows jpg/png/webp/gif/svg |
| 11 | Multer/file-filter errors were unhandled and could crash the request | `server.js` | Wrapped in explicit error handling |
| 12 | No security headers, no gzip/br compression | `server.js` | Added `helmet` + `compression` |
| 13 | Admin image uploads hardcoded `http://localhost:3001/api/uploads` | `AdminPanel.tsx` | Defaults to a same-origin relative `/api/uploads` |
| 14 | No way to run API + frontend as a single process (required by Hostinger shared hosting, which allows one Node app per domain) | `server.js` | Now serves `dist/` with SPA fallback |
| 15 | `ProductImageRenderer`'s fallback label only replaced the *first* hyphen (`"wooden-shield-plaque"` → `"WOODEN SHIELD-PLAQUE"`) | `ProductImageRenderer.tsx` | `.replace(/-/g, " ")` |
| 16 | No `.env.example`, no `db/schema.sql`, no `.htaccess` shipped with the project | — | All added |
| 17 | `vite.config.ts` still contained AI-Studio-specific `DISABLE_HMR` hacks and no dev proxy to the API | `vite.config.ts` | Cleaned up, added `/api` + `/uploads` dev proxy, vendor chunk splitting |
| 18 | API/upload URL logic was duplicated (and inconsistent) across multiple components | `src/config/api.ts` (new) | Centralized — every fetch call now goes through one file |
| 19 | Render showed "Application exited early" with no explanation | `server.js` | Added process-level `uncaughtException`/`unhandledRejection` logging, safe `listen` error handling, and a non-fatal DB boot check so a real error is always logged before exit |
| 20 | No support for Railway's MySQL connection-string format | `server.js`, `.env.example` | Added `DATABASE_URL`/`MYSQL_URL` + optional `DB_SSL` support alongside the individual `DB_*` vars |
| 21 | `npm run dev` only started the frontend, not the API | `package.json` | Single `npm run dev` now runs Vite + Express together via `concurrently` |
| 22 | Render's ephemeral filesystem would silently wipe uploaded images on every redeploy | `render.yaml` (new) | Documented + configured a persistent disk mounted at `UPLOAD_DIR` |

## Known follow-ups for you

- **Replace placeholder images** in `src/assets/` with real branding photography before going live.
- Change the demo admin credentials shown on the Admin Portal login screen immediately after your first production login.
- Set `ALLOWED_ORIGIN` in `.env` to your real domain before deploying — never leave it as `*` in production.
