# SmartPMO.ai Website — Status Log

---

## Current Status: ⚠️ DESKTOP OK — MOBILE BROKEN

**Spec ready for Claude Code:** `SPEC-MOBILE-FIX-v3.md`

---

## Active Issues

| # | Severity | Status | Description |
|---|----------|--------|-------------|
| 1 | HIGH | 🔴 Spec ready | Mobile card footer invisible — votes + share buttons not rendering |
| 2 | HIGH | 🔴 Spec ready | Mobile hero not stacking — `.hero-content` not collapsing to column |
| 3 | LOW | 🔴 Spec ready | No maintenance banner on site |
| 4 | HIGH | ⏳ Pending | `og-image.png` not created — og:image meta tags commented out |

---

## Issue Detail

### Issue 1 — Card footer invisible on mobile (votes + share)

**Root cause:** `VotesModule.hideVoteBar()` sets `voteBar.style.display = 'none'` on the entire `.card-footer-a` element. `API_BASE = 'http://localhost:3334'` always fails in production, so the health check fails on every load and hides the whole footer row — including share buttons.

**Fix:** Change `hideVoteBar()` to hide only `.footer-votes` and `.footer-divider`, leaving the share buttons visible. Add mobile-specific CSS to ensure footer row is always visible with adequate tap targets (34px min).

### Issue 2 — Mobile hero not stacking

**Root cause:** `styles-v2.css` sets `.hero-content` to a two-column layout but `mobile-fixes.css` does not force `flex-direction: column` on the hero layout. On mobile the grid does not collapse.

**Fix:** Add `@media (max-width: 767px)` rule to `mobile-fixes.css` forcing `.hero-content` to `display: flex; flex-direction: column`.

### Issue 3 — No maintenance banner

**Fix:** Add fixed amber banner in `index.html` immediately after `<body>`. Push `.site-header` and `body` padding-top down to account for banner height. Dismissable via `×` button.

---

## Deployment History

| Date | Description | Result |
|------|-------------|--------|
| 2026-02-20 | Direct edits to `styles-v2.css` | ❌ No effect — cache not busted |
| 2026-02-20 | Created `mobile-fixes.css`, updated `push-bust.ps1` | ❌ Regression — hrefs corrupted, skeleton stuck |
| 2026-02-20 | `SPEC-SITE-RECOVERY-v1.md` implemented by Claude Code | ✅ Desktop restored — all 6 CSS hrefs loading, `push-bust.ps1` robust |
| PENDING | `SPEC-MOBILE-FIX-v3.md` | ⏳ Awaiting Claude Code |

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

## Immutable Protocol

- **Status.md must be updated after every action** — by both Claude Chat (specs, analysis) and Claude Code (implementations, deployments).
- **Status.md must be read at the start of every new interaction.**
- This rule is non-negotiable.

---

## Pending Post-Fix

- [ ] Create `og-image.png` (1200×630) and re-add og:image meta tags
