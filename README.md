# Cards Against Reality — Pack Design Studio

Now migrated to a lightweight full-stack setup (frontend + backend API), with Vercel + Supabase path scaffolded.

## What changed in this step
- Added Express backend (`server.js`)
- Added Deck API:
  - `GET /api/health`
  - `GET /api/decks`
  - `POST /api/decks`
  - `DELETE /api/decks/:id`
- Deck Library now attempts API storage first, with localStorage fallback
- Added owner scoping via `x-owner-id` header from browser-local id

## Local run
```bash
cd app
npm install
npm start
```
Open: `http://localhost:3000`

## Vercel deployment (preferred)
- `vercel.json` is included for Node deployment.
- In Vercel: import repo and deploy.
- Runtime entrypoint: `server.js`.

### Required env vars
- `APP_URL` = your deployed app URL
- `STRIPE_SECRET_KEY` = Stripe test secret key (`sk_test_...`)

## Supabase setup (next)
- SQL scaffold is in `docs/supabase-schema.sql`.
- Apply that schema in Supabase SQL editor.
- Then we can switch file storage (`data/decks.json`) to Supabase.

## Notes
- Exports are now payment-gated: JSON/PDF unlock only after verified Stripe checkout.
- Deck generation now calls `/api/generate` and uses user lore/theme input directly.
