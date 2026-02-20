# SmartPMO.ai Website — Status Log

---

## Current Status: 🔴 SITE DOWN — ZERO CSS LOADING

**Spec ready for Claude Code:** `SPEC-SITE-RECOVERY-v1.md`

---

## Active Issues

| # | Severity | Status | Description |
|---|----------|--------|-------------|
| 1 | CATASTROPHIC | 🔴 Spec ready | All 6 CSS hrefs corrupted to `href="=679d476"` — zero styles load on any device |
| 2 | HIGH | 🔴 Spec ready | `push-bust.ps1` regex will re-corrupt hrefs on every future run |
| 3 | MEDIUM | ✅ Already clean | `mobile-fixes.css` has no `display: grid !important` — no action needed |
| 4 | HIGH | ⏳ Post-recovery | Mobile horizontal overflow — hero Y-axis left:-95px overflows on phones ≤430px |

---

## Issue Detail

### Issue 1 — CSS hrefs destroyed

`push-bust.ps1` two-pass regex consumed the CSS filenames, leaving only `=679d476` in each href. Browser requests that as a relative URL — 404s — so zero styles load.

Committed state of `index.html`:
```html
<link rel="stylesheet" href="=679d476">   ← was styles-v2.css
<link rel="stylesheet" href="=679d476">   ← was hero.css
<link rel="stylesheet" href="=679d476">   ← was header-styles.css
<link rel="stylesheet" href="=679d476">   ← was assessment-flow.css
<link rel="stylesheet" href="=679d476">   ← was section-votes.css
<link rel="stylesheet" href="=679d476">   ← was mobile-fixes.css
```

### Issue 2 — push-bust.ps1 fragile regex

Two-pass approach: first pass targets `filename?v=existing`, second pass targets bare `filename`. On the previous run, the second pass matched `filename` inside an already-versioned href and stripped the filename, leaving `=SHA`. Cannot self-heal once corrupted.

### Issue 3 — Skeleton loader (resolved)

`mobile-fixes.css` no longer contains `display: grid !important`. No action required.

### Issue 4 — Mobile horizontal overflow (pending)

`hero.css` positions `.hero-y-axis` at `left: -95px` on mobile. On a 390px viewport this pushes ~71px past the left edge. `mobile-fixes.css` contains overrides (`display: none` on axes, constrained quadrant grid) but cannot be verified until Issue 1 is resolved and CSS is actually loading.

---

## Deployment History

| Date | Description | Result |
|------|-------------|--------|
| 2026-02-20 | Direct edits to `styles-v2.css` | ❌ No effect — cache not busted |
| 2026-02-20 | Created `mobile-fixes.css`, updated `push-bust.ps1` | ❌ Regression — hrefs corrupted, skeleton stuck |
| PENDING | `SPEC-SITE-RECOVERY-v1.md` | ⏳ Awaiting Claude Code implementation |

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

## Pending Post-Recovery

- [ ] Verify mobile overflow resolved once CSS loads
- [ ] Create `og-image.png` (1200×630) and re-add og:image meta tags
