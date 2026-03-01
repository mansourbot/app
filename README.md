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

## Notes
- Data stored in `data/decks.json` in this phase
- This is the migration checkpoint before Stripe integration
- Next: deploy this Node app (Render/Fly/Railway/Vercel server) and then wire Stripe test mode
