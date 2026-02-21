# Cards Against Reality — Pack Design Studio Beta

This prototype is now **studio-first** (not live multiplayer-first).

## What it does
- Helps a solo creator define a custom pack brief
- Generates 3 theme directions
- Generates prompt cards (black) + response cards (white)
- Supports pack sizing:
  - Mini: 20 + 60
  - Standard: 30 + 90
  - Deluxe: 40 + 120
- Exports pack as JSON (print/PDF export next)

## Run
```bash
cd app
python3 -m http.server 8080
```
Open: http://localhost:8080

## Notes
- No chat-message permissions required
- Built for offline gift reveal workflows
- Online play is a secondary feature track
