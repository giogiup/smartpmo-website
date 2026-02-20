# SPEC: Votes API — Cloudflare Worker + D1
**For Claude Code implementation only.**
**Status:** READY
**Outcome:** Votes work identically on desktop and mobile, globally, free forever.

---

## Why this works

Cloudflare Workers run on Cloudflare's edge network — same account already managing smartpmo.ai.
D1 is Cloudflare's SQLite database. Free tier: 100,000 requests/day, 5GB storage, never sleeps.
The existing `votes.js` logic ports almost line-for-line. No new dependencies.

---

## Prerequisites (Claude Code must verify before starting)

Run these once in any terminal — if already installed, skip:
```
node --version       # must be 18+
npm install -g wrangler
wrangler --version   # confirm installed
```

Then authenticate (opens browser — user must log in with Ggpera@gmail.com):
```
wrangler login
```

---

## Step 1 — Create Worker project directory

```
mkdir D:\PMO-Brain-2.0-Modular\cloudflare-votes-worker
cd D:\PMO-Brain-2.0-Modular\cloudflare-votes-worker
```

---

## Step 2 — Create `wrangler.toml`

Create file: `D:\PMO-Brain-2.0-Modular\cloudflare-votes-worker\wrangler.toml`

```toml
name = "smartpmo-votes"
main = "src/index.js"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "smartpmo-votes-db"
database_id = "REPLACE_AFTER_D1_CREATE"
```

**Note:** `database_id` will be filled in after Step 4.

---

## Step 3 — Create `package.json`

Create file: `D:\PMO-Brain-2.0-Modular\cloudflare-votes-worker\package.json`

```json
{
  "name": "smartpmo-votes-worker",
  "version": "1.0.0",
  "private": true
}
```

---

## Step 4 — Create D1 database

Run:
```
cd D:\PMO-Brain-2.0-Modular\cloudflare-votes-worker
wrangler d1 create smartpmo-votes-db
```

This outputs something like:
```
✅ Successfully created DB 'smartpmo-votes-db'
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Copy the `database_id` value and replace `REPLACE_AFTER_D1_CREATE` in `wrangler.toml`.**

---

## Step 5 — Create D1 schema

Create file: `D:\PMO-Brain-2.0-Modular\cloudflare-votes-worker\schema.sql`

```sql
CREATE TABLE IF NOT EXISTS article_votes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  article_id INTEGER NOT NULL,
  vote       TEXT    NOT NULL CHECK(vote IN ('up', 'down')),
  voter_hash TEXT    NOT NULL,
  voted_at   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  UNIQUE(article_id, voter_hash)
);

CREATE INDEX IF NOT EXISTS idx_votes_article ON article_votes(article_id);
```

Apply to D1:
```
wrangler d1 execute smartpmo-votes-db --file=schema.sql
```

---

## Step 6 — Migrate existing 23 votes

Create file: `D:\PMO-Brain-2.0-Modular\cloudflare-votes-worker\migrate-votes.sql`

```sql
INSERT OR IGNORE INTO article_votes (article_id, vote, voter_hash, voted_at) VALUES
(1,     'up',   '08fb9a94f7bde6edb9143c34ea14d47353a780475f3c6ace728fe9818118f5ed', '2026-02-19T17:08:47Z'),
(1,     'up',   'b3d84b5e55d25a54334e326eaa8585d0eb491f6115975e27b8c9195c731e3374', '2026-02-19T17:08:57Z'),
(99,    'up',   'a4bd6259957ff281313558138ee7ab761e41ba4f9c1cb968e7a7160e94299fa4', '2026-02-19T17:09:06Z'),
(68216, 'up',   '921ebbf65402683b557c1495090772d9f56618a8e9af3d2ce2eb2ac58e6821b5', '2026-02-19T17:21:36Z'),
(67995, 'up',   '921ebbf65402683b557c1495090772d9f56618a8e9af3d2ce2eb2ac58e6821b5', '2026-02-19T17:21:39Z'),
(67971, 'down', '921ebbf65402683b557c1495090772d9f56618a8e9af3d2ce2eb2ac58e6821b5', '2026-02-19T17:21:43Z'),
(500,   'up',   'a4bfe9e7ddf6bcf22a358a709c955d2ea2bf4f835a1305c88dd595a629394285', '2026-02-19T17:42:27Z'),
(501,   'up',   'fe19cf16c72ae952d8c010d98405e7da70ccecb85d55e208fb4f3118078c37d1', '2026-02-19T17:43:19Z'),
(68054, 'up',   '921ebbf65402683b557c1495090772d9f56618a8e9af3d2ce2eb2ac58e6821b5', '2026-02-19T17:49:23Z'),
(67965, 'down', '921ebbf65402683b557c1495090772d9f56618a8e9af3d2ce2eb2ac58e6821b5', '2026-02-19T17:51:35Z'),
(67889, 'up',   '921ebbf65402683b557c1495090772d9f56618a8e9af3d2ce2eb2ac58e6821b5', '2026-02-19T17:51:41Z'),
(68031, 'down', '921ebbf65402683b557c1495090772d9f56618a8e9af3d2ce2eb2ac58e6821b5', '2026-02-19T17:51:46Z'),
(67105, 'up',   '921ebbf65402683b557c1495090772d9f56618a8e9af3d2ce2eb2ac58e6821b5', '2026-02-19T17:51:47Z'),
(67514, 'down', '921ebbf65402683b557c1495090772d9f56618a8e9af3d2ce2eb2ac58e6821b5', '2026-02-19T17:51:48Z'),
(67501, 'up',   '921ebbf65402683b557c1495090772d9f56618a8e9af3d2ce2eb2ac58e6821b5', '2026-02-19T17:51:55Z'),
(9991,  'up',   'b3d84b5e55d25a54334e326eaa8585d0eb491f6115975e27b8c9195c731e3374', '2026-02-19T17:55:04Z'),
(67122, 'down', '921ebbf65402683b557c1495090772d9f56618a8e9af3d2ce2eb2ac58e6821b5', '2026-02-19T17:55:33Z'),
(67110, 'down', '921ebbf65402683b557c1495090772d9f56618a8e9af3d2ce2eb2ac58e6821b5', '2026-02-19T17:55:35Z'),
(68477, 'up',   '91f59cfe37a8c382b62d905c9cd01a53c2ba92aff1d79abc21bab2228c339930', '2026-02-20T08:15:02Z'),
(69225, 'up',   '91f59cfe37a8c382b62d905c9cd01a53c2ba92aff1d79abc21bab2228c339930', '2026-02-20T08:15:03Z'),
(68054, 'up',   '91f59cfe37a8c382b62d905c9cd01a53c2ba92aff1d79abc21bab2228c339930', '2026-02-20T08:15:15Z'),
(68216, 'down', '91f59cfe37a8c382b62d905c9cd01a53c2ba92aff1d79abc21bab2228c339930', '2026-02-20T08:15:21Z'),
(4,     'up',   '91f59cfe37a8c382b62d905c9cd01a53c2ba92aff1d79abc21bab2228c339930', '2026-02-20T11:13:22Z');
```

Apply:
```
wrangler d1 execute smartpmo-votes-db --file=migrate-votes.sql
```

---

## Step 7 — Create Worker source

Create file: `D:\PMO-Brain-2.0-Modular\cloudflare-votes-worker\src\index.js`

```javascript
'use strict';

const ALLOWED_ORIGINS = ['https://smartpmo.ai', 'http://localhost:3000', 'http://localhost:5500'];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : 'https://smartpmo.ai';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function voterHash(request) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const ua = request.headers.get('User-Agent') || 'unknown';
  const day = new Date().toISOString().slice(0, 10);
  const encoder = new TextEncoder();
  // Use SubtleCrypto for SHA-256
  return crypto.subtle.digest('SHA-256', encoder.encode(ip + ua + day))
    .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''));
}

async function handleHealth(env) {
  try {
    await env.DB.prepare('SELECT 1').first();
    return Response.json({ status: 'healthy', db: 'connected' });
  } catch (e) {
    return Response.json({ status: 'unhealthy', error: e.message }, { status: 500 });
  }
}

async function handleGetVotes(articleId, request, env) {
  const hash = await voterHash(request);
  const counts = await env.DB.prepare(
    `SELECT SUM(CASE WHEN vote='up' THEN 1 ELSE 0 END) AS upvotes,
            SUM(CASE WHEN vote='down' THEN 1 ELSE 0 END) AS downvotes
     FROM article_votes WHERE article_id = ?`
  ).bind(articleId).first();

  const existing = await env.DB.prepare(
    `SELECT vote FROM article_votes WHERE article_id = ? AND voter_hash = ?`
  ).bind(articleId, hash).first();

  return Response.json({
    article_id: articleId,
    upvotes:    counts?.upvotes   || 0,
    downvotes:  counts?.downvotes || 0,
    userVote:   existing?.vote    || null
  });
}

async function handlePostVote(request, env) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 }); }

  const { article_id, vote } = body || {};
  const articleId = parseInt(article_id, 10);

  if (isNaN(articleId)) return Response.json({ ok: false, error: 'Invalid article_id' }, { status: 400 });
  if (!['up', 'down'].includes(vote)) return Response.json({ ok: false, error: 'Invalid vote' }, { status: 400 });

  const hash = await voterHash(request);

  const existing = await env.DB.prepare(
    `SELECT vote FROM article_votes WHERE article_id = ? AND voter_hash = ?`
  ).bind(articleId, hash).first();

  if (!existing) {
    await env.DB.prepare(
      `INSERT INTO article_votes (article_id, vote, voter_hash) VALUES (?, ?, ?)`
    ).bind(articleId, vote, hash).run();
  } else if (existing.vote === vote) {
    const counts = await env.DB.prepare(
      `SELECT SUM(CASE WHEN vote='up' THEN 1 ELSE 0 END) AS upvotes,
              SUM(CASE WHEN vote='down' THEN 1 ELSE 0 END) AS downvotes
       FROM article_votes WHERE article_id = ?`
    ).bind(articleId).first();
    return Response.json({ ok: false, error: 'Already voted', userVote: existing.vote,
      upvotes: counts?.upvotes || 0, downvotes: counts?.downvotes || 0 }, { status: 409 });
  } else {
    await env.DB.prepare(
      `UPDATE article_votes SET vote = ?, voted_at = strftime('%Y-%m-%dT%H:%M:%SZ','now')
       WHERE article_id = ? AND voter_hash = ?`
    ).bind(vote, articleId, hash).run();
  }

  const counts = await env.DB.prepare(
    `SELECT SUM(CASE WHEN vote='up' THEN 1 ELSE 0 END) AS upvotes,
            SUM(CASE WHEN vote='down' THEN 1 ELSE 0 END) AS downvotes
     FROM article_votes WHERE article_id = ?`
  ).bind(articleId).first();

  return Response.json({ ok: true, userVote: vote,
    upvotes: counts?.upvotes || 0, downvotes: counts?.downvotes || 0 });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    let response;
    try {
      if (url.pathname === '/health' && request.method === 'GET') {
        response = await handleHealth(env);
      } else if (url.pathname.startsWith('/votes/') && request.method === 'GET') {
        const articleId = parseInt(url.pathname.split('/votes/')[1], 10);
        if (isNaN(articleId)) response = Response.json({ ok: false, error: 'Invalid id' }, { status: 400 });
        else response = await handleGetVotes(articleId, request, env);
      } else if (url.pathname === '/vote' && request.method === 'POST') {
        response = await handlePostVote(request, env);
      } else {
        response = Response.json({ ok: false, error: 'Not found' }, { status: 404 });
      }
    } catch (e) {
      response = Response.json({ ok: false, error: e.message }, { status: 500 });
    }

    // Attach CORS headers to every response
    const newHeaders = new Headers(response.headers);
    Object.entries(headers).forEach(([k, v]) => newHeaders.set(k, v));
    return new Response(response.body, { status: response.status, headers: newHeaders });
  }
};
```

---

## Step 8 — Deploy Worker

```
cd D:\PMO-Brain-2.0-Modular\cloudflare-votes-worker
wrangler deploy
```

Output will include the Worker URL:
```
https://smartpmo-votes.ACCOUNTNAME.workers.dev
```

**Note this URL.**

---

## Step 9 — Verify Worker is live

```
curl https://smartpmo-votes.ACCOUNTNAME.workers.dev/health
```

Expected response: `{"status":"healthy","db":"connected"}`

Also verify votes migrated:
```
curl https://smartpmo-votes.ACCOUNTNAME.workers.dev/votes/68054
```

Expected: `{"article_id":68054,"upvotes":2,"downvotes":0,"userVote":null}`

---

## Step 10 — Update `index.html`

In `D:\PMO-Brain-2.0-Modular\website\index.html`, find:

```javascript
const API_BASE = 'http://localhost:3334';
```

Replace with:

```javascript
const API_BASE = 'https://smartpmo-votes.ACCOUNTNAME.workers.dev';
```

(Use the actual URL from Step 8 output.)

---

## Step 11 — Deploy site

```
cd D:\PMO-Brain-2.0-Modular\website
.\push-bust.ps1 -msg "feat: votes API on Cloudflare Worker — mobile votes now live"
```

---

## Verification checklist

- [ ] `curl /health` returns `healthy`
- [ ] `curl /votes/68054` returns upvotes: 2
- [ ] Desktop: vote counts visible and correct
- [ ] Mobile: vote counts visible and match desktop
- [ ] Voting on mobile increments count
- [ ] Vote switching works (up → down changes both counts)
- [ ] Share buttons unaffected

---

## Ongoing: keeping local SQLite in sync

The Worker writes to D1 (cloud). The local `votes.js` still writes to `pmo_insights.db`.
These are now separate — **local votes.js is no longer the source of truth**.
Stop running `start-votes-api.bat` — the Worker replaces it entirely.
Future votes will accumulate in D1 only.

---

## Free tier limits (Cloudflare Workers + D1)

| Resource | Free limit | SmartPMO expected usage |
|----------|-----------|------------------------|
| Worker requests | 100,000/day | ~50-200/day |
| D1 reads | 5M/day | ~200/day |
| D1 writes | 100k/day | ~20/day |
| D1 storage | 5GB | <1MB |

No credit card required. No expiry.
