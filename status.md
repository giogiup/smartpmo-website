# SmartPMO.ai Website — Status Log

---

## Current Status: ⚠️ DESKTOP OK — MOBILE VOTES BROKEN

---

## Active Issues

| # | Severity | Status | Description |
|---|----------|--------|-------------|
| 1 | HIGH | 🔴 Spec ready | Mobile vote counts show 0 — votes API on localhost:3334 unreachable from mobile |
| 2 | HIGH | 🔴 Spec ready | Mobile card footer invisible — votes + share buttons not rendering |
| 3 | HIGH | 🔴 Spec ready | Mobile hero not stacking — `.hero-content` not collapsing to column |
| 4 | LOW  | ✅ Done | Maintenance banner — live on site |
| 5 | HIGH | ⏳ Pending | `og-image.png` not created — og:image meta tags commented out |

---

## Issue 1 — Votes API: localhost cannot be reached from mobile

**Root cause:** `API_BASE = 'http://localhost:3334'` only works when the votes server is running on the user's PC. Mobile devices on any network cannot reach localhost.

**Fix:** Deploy votes API to Cloudflare Workers + D1 (free, never sleeps, globally fast).
- Spec: `SPEC-VOTES-CLOUDFLARE-WORKER.md`
- Cloudflare account: Ggpera@gmail.com (already managing smartpmo.ai)
- 23 existing votes included in migration SQL in spec
- After deploy: change one line in index.html — `API_BASE = 'https://smartpmo-votes.ACCOUNT.workers.dev'`
- Free tier: 100k requests/day, 5GB D1 storage, no credit card, no expiry

**Steps for Claude Code:**
1. `npm install -g wrangler && wrangler login` (user must authenticate in browser)
2. Follow SPEC-VOTES-CLOUDFLARE-WORKER.md steps 1–11

## Issue 2 — Card footer invisible on mobile (votes + share)

**Root cause:** `VotesModule.hideVoteBar()` was hiding entire `.card-footer-a`. Fixed in deployed code — now hides only `.footer-votes` and `.footer-divider`.
**Remaining:** Mobile CSS may still need `SPEC-MOBILE-FIX-v3.md` Change 3 applied.

## Issue 3 — Mobile hero not stacking

**Fix:** `SPEC-MOBILE-FIX-v3.md` Change 3 — append to `mobile-fixes.css`.
**Status:** Not yet confirmed applied.

---

## Deployment History

| Date | Description | Result |
|------|-------------|--------|
| 2026-02-20 | Direct edits to `styles-v2.css` | ❌ No effect — cache not busted |
| 2026-02-20 | Created `mobile-fixes.css`, updated `push-bust.ps1` | ❌ Regression — hrefs corrupted |
| 2026-02-20 | `SPEC-SITE-RECOVERY-v1.md` implemented | ✅ Desktop restored — all 6 CSS hrefs loading |
| 2026-02-20 | Maintenance banner + `hideVoteBar` fix | ✅ Banner live, share buttons visible on mobile |
| PENDING | `SPEC-VOTES-CLOUDFLARE-WORKER.md` | ⏳ Awaiting Claude Code + wrangler login |
| PENDING | `SPEC-MOBILE-FIX-v3.md` Change 3 (hero stack) | ⏳ Awaiting Claude Code |

---

## CSS Architecture

| File | Purpose | Edit policy |
|------|---------|-------------|
| `styles-v2.css` | Main site styles | Do not edit |
| `hero.css` | Hero section | Do not edit |
| `header-styles.css` | Header | Do not edit |
| `assessment-flow.css` | Modals | Do not edit |
| `section-votes.css` | Vote buttons | Do not edit |
| `mobile-fixes.css` | All mobile overrides | Edit here only |

**Rule:** Never use `display !important` on any class JS also controls via inline `style`.

---

## Votes Architecture (target state after Worker deploy)

| Component | Location | Notes |
|-----------|----------|-------|
| Votes API | Cloudflare Worker `smartpmo-votes` | Replaces localhost:3334 |
| Votes DB | Cloudflare D1 `smartpmo-votes-db` | Replaces local SQLite |
| Local votes.js | `Automation/api/votes.js` | Deprecated — stop running start-votes-api.bat |
| API_BASE in index.html | `https://smartpmo-votes.ACCOUNT.workers.dev` | Update after deploy |

---

## Immutable Protocol

- **Status.md must be updated after every action** — by both Claude Chat (specs, analysis) and Claude Code (implementations, deployments).
- **Status.md must be read at the start of every new interaction.**
- This rule is non-negotiable.

---

## Pending Post-Fix

- [ ] Create `og-image.png` (1200×630) and re-add og:image meta tags
