# Deploying to Railway

This app uses a **custom Node server** (`server.js`) for Socket.IO live radio, so it
must run as a long-lived process. Railway is a good fit (Vercel is not, because it
can't run a persistent WebSocket server).

## 1. Create the project

1. Push this repo to GitHub.
2. In Railway: **New Project -> Deploy from GitHub repo** and pick this repo.
3. Railway auto-detects Node and uses `railway.json`:
   - Build: `npm run build` (`prisma generate && next build`)
   - Start: `npm run start` (`NODE_ENV=production node server.js`)

## 2. Set environment variables

In the Railway service **Variables** tab, add everything from `.env.example`.
Required:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
POSTGRES_PRISMA_URL          # pooled connection
POSTGRES_URL_NON_POOLING     # direct connection (used by Prisma + build prerender)
NEXT_PUBLIC_APP_URL          # set to your Railway public URL, e.g. https://xxx.up.railway.app
CRON_SECRET                  # strong random string
```

Optional (enable the matching feature): `CLOUDINARY_*`, `RESEND_API_KEY`,
`ANTHROPIC_API_KEY`, `TELEGRAM_*`, `WHATSAPP_*`, VAPID keys, `NEXT_PUBLIC_SENTRY_DSN`.

> The build prerenders public pages (home, learn, published sermons) via ISR, so the
> Supabase/Postgres vars must be present at **build time**, not just runtime.

## 3. Networking

- Railway injects `PORT`; `server.js` already reads `process.env.PORT`.
- Generate a public domain in **Settings -> Networking -> Generate Domain**.
- Put that domain in `NEXT_PUBLIC_APP_URL` and redeploy (it's used for share links
  and the Socket.IO CORS origin in `server.js`).

## 4. Supabase one-time SQL

Run these in the Supabase SQL editor if not already applied:

- `supabase/migration-increment-sermon-view.sql` (atomic view counts)

## 5. Cron (social posts)

`vercel.json` defines a weekly cron; on Railway use a **Railway Cron** service (or an
external scheduler) hitting:

```
GET https://<your-domain>/api/cron/social-posts
Authorization: Bearer <CRON_SECRET>
```

## 6. Verify after deploy

- Home / learn / sermon pages load fast (prerendered).
- Sign in, confirm the header avatar + bookmarks/comments resolve.
- Open `/radio`, start a session, confirm Socket.IO connects (check logs for
  `Socket.IO running on /api/socket`).
- HTTPS is automatic on Railway, so mic capture for live radio works.
