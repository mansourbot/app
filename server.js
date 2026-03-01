const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'decks.json');

app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ decks: [] }, null, 2));
  }
}

function readDb() {
  ensureDb();
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    return { decks: [] };
  }
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function getOwner(req) {
  return (req.header('x-owner-id') || req.query.owner || 'anonymous').toString().slice(0, 120);
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'cards-against-reality-api' });
});

app.get('/api/decks', (req, res) => {
  const owner = getOwner(req);
  const db = readDb();
  const decks = db.decks.filter(d => d.owner === owner);
  res.json({ decks });
});

app.post('/api/decks', (req, res) => {
  const owner = getOwner(req);
  const payload = req.body || {};

  if (!payload.meta || !payload.cards) {
    return res.status(400).json({ error: 'meta and cards are required' });
  }

  const db = readDb();
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const deck = {
    id,
    owner,
    meta: payload.meta,
    cards: payload.cards,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.decks.unshift(deck);
  db.decks = db.decks.slice(0, 2000);
  writeDb(db);

  res.status(201).json({ deck });
});

app.delete('/api/decks/:id', (req, res) => {
  const owner = getOwner(req);
  const id = req.params.id;
  const db = readDb();
  const before = db.decks.length;
  db.decks = db.decks.filter(d => !(d.id === id && d.owner === owner));

  if (db.decks.length === before) {
    return res.status(404).json({ error: 'deck not found' });
  }

  writeDb(db);
  res.json({ ok: true });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  ensureDb();
  console.log(`CAR app running on http://localhost:${PORT}`);
});
