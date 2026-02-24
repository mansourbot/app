# Cards Against Reality — Pack Design Studio Beta

Studio-first prototype for creating custom offline gift packs.

## Current capabilities (money-critical step)
- Solo pack creation flow (occasion, tone, size, lore)
- AI-style theme suggestion (3 options)
- Card generation for:
  - Mini: 20 black + 60 white
  - Standard: 30 black + 90 white
  - Deluxe: 40 black + 120 white
- Card editor tools:
  - Rewrite funnier
  - Make savage
  - Soften
  - Shorten
- Quality checks:
  - Duplicate-like detection
  - Too-mean keyword warnings
  - Too-obscure/long warning
- Pricing/bundle selection:
  - 1 pack
  - 3-pack (~15% off)
  - 5-pack (~25% off)
- Export options:
  - JSON export
  - Print/PDF view (browser print)
- Basic event tracking in-browser console + export payload

## Run
```bash
cd app
python3 -m http.server 8080
```
Open: http://localhost:8080

## Notes
- No chat-message permissions required
- Built for offline gift reveal workflows
- Checkout integration is the next step
