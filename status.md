# SmartPMO.ai Website — Status Log

---

## Current Status: ⚠️ REGRESSION DEPLOYED — SPEC READY

**Live bug:** Skeleton + real cards both visible (desktop and mobile)  
**Spec to fix:** `SPEC-MOBILE-FIX-v2.md`  
**Action required:** Claude Code to implement spec and deploy

---

## Active Issues

| # | Severity | Status | Description |
|---|----------|--------|-------------|
| 1 | CRITICAL | ⚠️ Spec written | Skeleton loader + real cards both visible — `display:grid !important` prevents JS from hiding either grid |
| 2 | HIGH | ⚠️ Spec written | Mobile horizontal overflow — hero Y-axis, grid columns (v1 fix deployed but masked by issue 1) |

---

## Issue History

### Issue 1 — Skeleton cards visible with real cards (REGRESSION, introduced v1)

**Spec:** `SPEC-MOBILE-FIX-v2.md`  
**Root cause:** `mobile-fixes.css` uses `display: grid !important` on `.insights-grid`. CSS `!important` in stylesheets overrides inline `style` attributes. JS sets `element.style.display = 'none'` (inline) to hide/show skeleton vs real cards — `!important` defeats this. Both skeleton and real-cards divs share `.insights-grid` class and both render simultaneously.  
**Fix required:** Remove `display: grid !important` from all three breakpoint blocks in `mobile-fixes.css`. Base `display: grid` without `!important` already exists in `styles-v2.css`.

### Issue 2 — Mobile horizontal overflow (original bug)

**Spec:** `SPEC-MOBILE-FIX-v1.md` (partially deployed)  
**Root cause:** `hero.css` `.hero-y-axis { left: -95px }` overflows viewport on phones ≤430px. Multiple conflicting `minmax()` grid rules in `styles-v2.css`. Cache-busting regex in push script didn't match plain CSS hrefs.  
**Fix deployed:** `mobile-fixes.css` created, `push-bust.ps1` updated. Effectiveness masked by Issue 1 regression.

---

## Deployment History

| Date | Commit | Spec | Description | Result |
|------|--------|------|-------------|--------|
| 2026-02-20 | 47e49c8 | — | styles-v2.css mobile CSS edits | ❌ No effect — cache not busted |
| 2026-02-20 | TBD | v1 | mobile-fixes.css created, push-bust.ps1 fixed | ❌ Regression: skeleton visible on all viewports |
| PENDING | — | v2 | Remove display:grid !important from mobile-fixes.css | ⏳ Spec ready, not implemented |

---

## CSS Architecture

| File | Purpose | Edit policy |
|------|---------|-------------|
| `styles-v2.css` | Main site styles | Do not edit |
| `hero.css` | Hero section | Do not edit |
| `header-styles.css` | Header | Do not edit |
| `assessment-flow.css` | Modals | Do not edit |
| `section-votes.css` | Vote buttons | Do not edit |
| `mobile-fixes.css` | **All mobile overrides** | Edit here only |

**Rule:** Never use `display !important` on any class that JS also controls via inline `style`. JS inline style cannot override `!important`.

---

## Pending (Post-fix)

- [ ] Create `og-image.png` (1200×630) and re-add og:image meta tags
