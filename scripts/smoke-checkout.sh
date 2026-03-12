#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/smoke-checkout.sh https://your-app.vercel.app
#
# Optional env:
#   PKG_ID=beta_creator
#   PKG_NAME=Creator
#   AMOUNT_USD=19

BASE_URL="${1:-}"
if [[ -z "$BASE_URL" ]]; then
  echo "Usage: $0 <base-url>" >&2
  exit 1
fi

PKG_ID="${PKG_ID:-beta_creator}"
PKG_NAME="${PKG_NAME:-Creator}"
AMOUNT_USD="${AMOUNT_USD:-19}"

echo "== Health check =="
curl -fsS "$BASE_URL/api/health" | sed 's/.*/  &/'

echo "== Create checkout session =="
RESP="$(curl -fsS -X POST "$BASE_URL/api/checkout/session" \
  -H 'content-type: application/json' \
  -d "{\"packageId\":\"$PKG_ID\",\"packageName\":\"$PKG_NAME\",\"amountUsd\":$AMOUNT_USD}")"
echo "$RESP" | sed 's/.*/  &/'

SESSION_ID="$(printf '%s' "$RESP" | python3 -c 'import sys, json; print(json.load(sys.stdin).get("id",""))')"
CHECKOUT_URL="$(printf '%s' "$RESP" | python3 -c 'import sys, json; print(json.load(sys.stdin).get("url",""))')"

if [[ -z "$SESSION_ID" || -z "$CHECKOUT_URL" ]]; then
  echo "Failed: checkout session response missing id/url" >&2
  exit 2
fi

echo
echo "Open this checkout URL in browser to complete payment test:"
echo "  $CHECKOUT_URL"
echo
echo "After payment, verify with:"
echo "  curl -fsS '$BASE_URL/api/checkout/verify?session_id=$SESSION_ID'"
