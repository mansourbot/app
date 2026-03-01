# MVP Blueprint — Custom Deck Builder

## Product goal
Build an engaging web app where users can generate, customize, and share custom decks quickly.

## Core user flow
1. Create deck from prompt/brief
2. AI generates draft content + structure
3. User edits cards/slides with live preview
4. User applies theme/brand and refines tone
5. User exports/shares final deck

## Scope for MVP
- Auth (email/password or magic link)
- Deck CRUD
- Card/slide CRUD + reorder
- AI generation + rewrite tools
- Theme/brand controls
- Export (JSON + print/PDF)
- Shareable read-only link

## Out of scope (post-MVP)
- Payments/Stripe
- Team workspaces + RBAC
- Template marketplace
- Advanced analytics and A/B testing

---

## Data schema (Postgres)

### users
- id (uuid, pk)
- email (text, unique, not null)
- name (text)
- created_at (timestamptz, default now)

### decks
- id (uuid, pk)
- owner_id (uuid, fk users.id)
- title (text, not null)
- brief (text)
- theme_id (uuid, fk themes.id, nullable)
- status (text: draft|ready|archived)
- created_at (timestamptz)
- updated_at (timestamptz)

### deck_items
- id (uuid, pk)
- deck_id (uuid, fk decks.id)
- position (int, not null)
- type (text: title|content|comparison|timeline|quote|cta)
- content_json (jsonb, not null)
- created_at (timestamptz)
- updated_at (timestamptz)

### themes
- id (uuid, pk)
- owner_id (uuid, fk users.id, nullable for system themes)
- name (text, not null)
- palette_json (jsonb)
- typography_json (jsonb)
- logo_url (text)
- created_at (timestamptz)

### assets
- id (uuid, pk)
- owner_id (uuid, fk users.id)
- deck_id (uuid, fk decks.id, nullable)
- kind (text: image|icon|chart)
- storage_url (text)
- meta_json (jsonb)
- created_at (timestamptz)

### share_links
- id (uuid, pk)
- deck_id (uuid, fk decks.id)
- token (text, unique, not null)
- expires_at (timestamptz, nullable)
- created_at (timestamptz)

### changelog_entries
- id (uuid, pk)
- deck_id (uuid, fk decks.id, nullable)
- title (text, not null)
- body (text)
- category (text: product|content|theme|ops)
- created_by (uuid, fk users.id)
- created_at (timestamptz)

---

## Suggested repo structure

```text
app/
  src/
    app/
      (auth)/
      dashboard/
      deck/[deckId]/
      api/
        auth/
        decks/
        deck-items/
        ai/
        themes/
        exports/
        share/
    components/
      editor/
      deck/
      theme/
      ai/
      ui/
    lib/
      db/
      auth/
      ai/
      validation/
    styles/
  prisma/ (or db/migrations)
  public/
  docs/
    MVP_BLUEPRINT.md
    TICKETS.md
```

---

## API surface (MVP)
- `POST /api/decks` create deck
- `GET /api/decks` list my decks
- `GET /api/decks/:id` get deck
- `PATCH /api/decks/:id` update metadata
- `POST /api/deck-items` create item
- `PATCH /api/deck-items/:id` update item
- `POST /api/deck-items/reorder` reorder items
- `POST /api/ai/generate-outline` brief -> outline
- `POST /api/ai/rewrite` tone/length rewrite
- `POST /api/themes/apply` apply theme to deck
- `POST /api/exports/pdf` generate pdf
- `POST /api/share-links` create read-only link

---

## First 10 tickets
See `docs/TICKETS.md` and linked GitHub Issues + Project.
