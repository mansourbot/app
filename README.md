# Cards Against Reality — Pack Design Studio

Now migrated to a lightweight full-stack setup (frontend + backend API).

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

## Render deployment (recommended)
- This repo includes `render.yaml` for one-click blueprint deploy on Render.
- In Render: New + → Blueprint → select this repo.
- Render will build and run with:
  - Build: `npm install`
  - Start: `npm start`
  - Health: `/api/health`

## Notes
- Data stored in `data/decks.json` in this phase (ephemeral on free instances)
- This is the migration checkpoint before Stripe integration
- Next: deploy on Render, then wire Stripe test mode
