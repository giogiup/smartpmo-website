# SPEC-MOBILE-FIX-v2.md
## SmartPMO.ai — Mobile Fix Regression Patch
**Status:** Spec complete — Claude Code to implement and deploy  
**Supersedes:** SPEC-MOBILE-FIX-v1.md

---

## Symptoms

**Desktop:** Skeleton loader cards and real article cards both visible simultaneously (screenshot provided 2026-02-20).

**Mobile:** Horizontal overflow persists (original bug, unresolved).

---

## Root Cause Analysis

### Desktop regression — skeleton cards not hiding

**Cause:** `mobile-fixes.css` uses `display: grid !important` on `.insights-grid` in all three breakpoint blocks (mobile, tablet, desktop).

`!important` in a stylesheet overrides inline `style` attributes on elements. JavaScript controls skeleton visibility via `element.style.display = 'none'` (inline). The `!important` wins, preventing JS from hiding either grid div.

Both skeleton and real-cards divs share the class `.insights-grid`:

```html
<!-- JS sets style="display:none" once data loads -->
<div id="skeleton-loaders" class="insights-grid">...</div>

<!-- Starts as style="display:none;", JS sets to "grid" after fetch -->
<div class="insights-grid" id="auto-articles-grid" style="display:none;"></div>
```

`display: grid !important` forces both to grid at all times — JS cannot override it.

### Mobile overflow — pre-existing, partially addressed

`hero.css` positions `.hero-y-axis` at `left: -95px`, extending past the viewport on phones ≤430px. Grid `minmax()` values in `styles-v2.css` can also exceed phone viewport width. The `mobile-fixes.css` from v1 addresses these but the display regression masks whether they worked.

---

## Required Changes

### Change 1 — `website/mobile-fixes.css`

**Remove `display` property from all three `.insights-grid` media query blocks.**

In the mobile block (`@media (max-width: 639px)`), remove:
```css
display: grid !important;
```

In the tablet block (`@media (min-width: 640px) and (max-width: 1023px)`), remove:
```css
display: grid !important;
```

In the desktop block (`@media (min-width: 1024px)`), remove:
```css
display: grid !important;
```

The base `display: grid` without `!important` is already set in `styles-v2.css` — that remains. Only the `!important` version here is the problem.

**Result after change — mobile block should read:**
```css
@media (max-width: 639px) {
  .insights-grid {
    grid-template-columns: 1fr !important;
    gap: 1rem !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
}
```

**Tablet block:**
```css
@media (min-width: 640px) and (max-width: 1023px) {
  .insights-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 1.25rem !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
}
```

**Desktop block:**
```css
@media (min-width: 1024px) {
  .insights-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 1.5rem !important;
  }
}
```

No other changes to `mobile-fixes.css`.

---

### Change 2 — Deploy

Run push script after file edit:
```
cd D:\PMO-Brain-2.0-Modular\website
.\push-bust.ps1 -msg "fix: skeleton loader regression — remove display:grid !important from mobile-fixes.css"
```

---

## Verification Checklist

- [ ] Desktop: skeleton cards show briefly, then disappear — replaced by real cards in 3-column layout
- [ ] No skeleton visible after data loads on any viewport
- [ ] Mobile (≤639px): 1-column card layout, no horizontal scroll
- [ ] Tablet (640–1023px): 2-column card layout
- [ ] Desktop (≥1024px): 3-column card layout
- [ ] Hero section: no horizontal scroll on 390px viewport
