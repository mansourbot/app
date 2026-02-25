# Cards Against Reality — Pack Design Studio Beta

Final static sprint build before backend migration.

## Included in this sprint
- Step-based studio flow: Brief → Theme → Cards → Review → Export
- Local draft save/load via browser storage
- Theme generation + selection
- Card generation with separate bulk regenerate for black/white cards
- Card editor actions: funnier / savage / soften / shorten
- Quality checks:
  - duplicate-like detection
  - too-mean keyword flags
  - too-obscure/long card warnings
- Pricing UX with bundle highlighting:
  - 1 pack
  - 3-pack (best value)
  - 5-pack
- Purchase intent capture (email + selected package)
- Deck Library home section:
  - Save current deck
  - View all saved decks
  - Load / JSON export / PDF export per deck
  - Trigger sales flow from saved deck
- Export options:
  - JSON pack export
  - Print/PDF view with gift cover + cut-mark style guides
  - Session summary export (funnel signals)

## Run
```bash
cd app
python3 -m http.server 8080
```
Open: http://localhost:8080

## Next (backend migration)
- Real auth/session storage
- Checkout integration (Stripe)
- Webhooks/order fulfillment
- Production analytics sink
