# Cards Against Reality — Beta v0.1

First playable single-device beta for validating game loop and humor quality.

## Run

No build tools required.

- Option 1: Open `index.html` directly in browser.
- Option 2 (recommended):
  ```bash
  cd cards-against-reality-beta
  python3 -m http.server 8080
  ```
  Then open `http://localhost:8080`

## What's in v0.1

- 3+ players, one rotating judge
- Black prompt + white card rounds
- Vibe prompt to inject inside-joke flavored card variants
- Scoreboard + first to N points
- Single-device pass-and-play mode

## What's intentionally missing

- Real multiplayer sync
- Accounts
- Persistent decks/history
- Moderation/guardrails
- Payments

This build exists to test: "Do people laugh enough to play multiple rounds back-to-back?"
