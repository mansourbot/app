const express = require('express');
const fs = require('fs');
const path = require('path');

const Stripe = require('stripe');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'decks.json');
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

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

app.post('/api/checkout/session', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(400).json({ error: 'Stripe not configured on server' });
    }

    const { packageId, packageName, amountUsd, email } = req.body || {};
    if (!packageId || !packageName || !amountUsd) {
      return res.status(400).json({ error: 'packageId, packageName, amountUsd are required' });
    }

    const amount = Number(amountUsd);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: 'invalid amountUsd' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Cards Against Reality — ${packageName}`
            },
            unit_amount: Math.round(amount * 100)
          }
        }
      ],
      metadata: {
        packageId,
        packageName
      },
      success_url: `${APP_URL}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/?checkout=cancelled`
    });

    res.json({ url: session.url, id: session.id });
  } catch (err) {
    console.error('checkout_session_error', err);
    res.status(500).json({ error: 'could_not_create_checkout_session' });
  }
});

app.get('/api/checkout/verify', async (req, res) => {
  try {
    if (!stripe) return res.status(400).json({ error: 'Stripe not configured on server' });
    const sessionId = req.query.session_id;
    if (!sessionId) return res.status(400).json({ error: 'session_id required' });

    const session = await stripe.checkout.sessions.retrieve(String(sessionId));
    const paid = session.payment_status === 'paid';
    res.json({ paid, sessionId: session.id, email: session.customer_details?.email || null });
  } catch (err) {
    console.error('checkout_verify_error', err);
    res.status(500).json({ error: 'could_not_verify_checkout' });
  }
});

app.post('/api/generate', (req, res) => {
  const { themeName, lore = '', counts = { b: 30, w: 90 } } = req.body || {};
  const loreWords = String(lore)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(w => w.length > 3)
    .slice(0, 20);

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const inject = () => loreWords.length ? pick(loreWords) : 'inside-joke';

  const blackTemplates = [
    'At this party, someone brought ____.',
    'The gift reveal was perfect until ____.',
    'Our group lore can be summarized by ____.',
    'No one talks about ____ anymore.',
    'This deck exists because of ____.'
  ];

  const whiteTemplates = [
    'a suspiciously specific callback to {x}',
    '{x}, but somehow legal',
    'an emergency meeting about {x}',
    'the forbidden story about {x}',
    'weaponized {x}'
  ];

  const b = Math.max(1, Number(counts.b || 30));
  const w = Math.max(1, Number(counts.w || 90));

  const black = Array.from({ length: b }, (_, i) => `${pick(blackTemplates)} (${themeName || 'Theme'} ${i + 1}: ${inject()})`);
  const white = Array.from({ length: w }, () => pick(whiteTemplates).replaceAll('{x}', inject()));

  res.json({ black, white });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  ensureDb();
  console.log(`CAR app running on http://localhost:${PORT}`);
});
