# SPEC-MOBILE-FIX-v1.md
## SmartPMO.ai — Mobile Layout Fix
**Status:** Ready for implementation  
**Priority:** CRITICAL  
**Method:** Create `mobile-fixes.css` loaded last + fix cache busting for all CSS files

---

## Root Cause Analysis

### Why previous fixes failed
`push-bust.ps1` only injects a SHA into `styles-v2.css?v=...` — but the HTML link tag is `href="styles-v2.css"` with no `?v=` parameter, so the regex never matches and no cache busting occurs. The browser serves the old cached CSS.

### Three actual bugs

**Bug 1 — Hero Y-axis overflow (hero.css)**
`.hero-y-axis` is absolutely positioned at `left: -180px` (desktop) and `left: -95px` (mobile). On a 390px phone with 24px padding = 342px content width, the 340px grid plus the -95px axis label extends ~71px past the viewport edge. This causes horizontal scroll.

**Bug 2 — Article grid multi-column on mobile (styles-v2.css)**
Multiple conflicting `.insights-grid` definitions cascade through the file. The effective final rule on mobile still produces multi-column layout because `minmax(300–340px, 1fr)` values exceed phone viewport width.

**Bug 3 — Section title overflow (styles-v2.css)**
`.section-title--auto` and `.section-title--curated` use `display: flex` without `flex-wrap: wrap`. The subtitle span pushes the element wider than the viewport on narrow screens.

---

## Implementation Instructions

### Step 1 — Create `website/mobile-fixes.css`

Create the file `D:\PMO-Brain-2.0-Modular\website\mobile-fixes.css` with the following content **exactly**:

```css
/*
 * mobile-fixes.css — Loaded LAST, overrides all other CSS for mobile layout
 * DO NOT EDIT other CSS files. All mobile overrides live here.
 * SPEC: SPEC-MOBILE-FIX-v1.md
 */

/* ── Prevent all horizontal overflow ── */
html, body {
  overflow-x: hidden !important;
  max-width: 100vw !important;
}

/* ── Insights section: full width, no overflow ── */
.insights-section {
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  padding-left: 1rem !important;
  padding-right: 1rem !important;
  overflow: hidden !important;
}

/* ── Article grid: single column on mobile ── */
@media (max-width: 639px) {
  .insights-grid {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 1rem !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
}

/* ── Article grid: two columns on tablet ── */
@media (min-width: 640px) and (max-width: 1023px) {
  .insights-grid {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 1.25rem !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }
}

/* ── Article grid: three columns on desktop ── */
@media (min-width: 1024px) {
  .insights-grid {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 1.5rem !important;
  }
}

/* ── Section title: wrap subtitle on narrow screens ── */
.section-title--auto,
.section-title--curated {
  flex-wrap: wrap !important;
  max-width: 100% !important;
}

@media (max-width: 639px) {
  .section-title--auto,
  .section-title--curated {
    flex-direction: column !important;
    align-items: flex-start !important;
    font-size: 1.4rem !important;
  }

  .section-subtitle {
    margin-left: 0 !important;
    margin-top: 0.25rem !important;
    font-size: 0.8rem !important;
  }
}

/* ── Hero section: fix Y-axis overflow on mobile ── */
@media (max-width: 768px) {
  /* Clip the visual wrapper so axis labels don't escape */
  .hero-visual-wrapper {
    overflow: hidden !important;
    padding: 20px 12px !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }

  /* Scale down quadrant grid to fit inside padded container */
  .hero-quadrant-grid {
    width: min(320px, calc(100vw - 72px)) !important;
    height: min(320px, calc(100vw - 72px)) !important;
    margin: 0 auto !important;
  }

  /* Hide axis labels on mobile — too cramped, cause overflow */
  .hero-y-axis,
  .hero-x-axis {
    display: none !important;
  }

  /* Hero content padding */
  .hero-content {
    padding: 0 1rem !important;
    box-sizing: border-box !important;
  }

  /* Hero section itself */
  .hero-section {
    overflow: hidden !important;
  }
}

@media (max-width: 375px) {
  .hero-quadrant-grid {
    width: min(280px, calc(100vw - 48px)) !important;
    height: min(280px, calc(100vw - 48px)) !important;
  }
}

/* ── Article cards: prevent internal overflow ── */
.article-card,
.insight-card,
.insight-card--auto,
.insight-card--curated {
  box-sizing: border-box !important;
  max-width: 100% !important;
  word-break: break-word !important;
  overflow-wrap: anywhere !important;
}

/* ── Card title: tighter on mobile ── */
@media (max-width: 639px) {
  .card-title {
    font-size: 16px !important;
    line-height: 1.35 !important;
  }
}

/* ── Footer share buttons: wrap on very small screens ── */
@media (max-width: 400px) {
  .card-footer-a {
    flex-wrap: wrap !important;
    gap: 6px !important;
  }

  .footer-share {
    flex-wrap: wrap !important;
  }
}
```

---

### Step 2 — Add `mobile-fixes.css` to `index.html`

In `website/index.html`, find the block of stylesheet `<link>` tags:

```html
  <link rel="stylesheet" href="styles-v2.css">
  <link rel="stylesheet" href="hero.css">
  <link rel="stylesheet" href="header-styles.css">
  <link rel="stylesheet" href="assessment-flow.css">
  <link rel="stylesheet" href="section-votes.css">
```

Replace with (adds version params to all files AND adds mobile-fixes.css last):

```html
  <link rel="stylesheet" href="styles-v2.css?v=2">
  <link rel="stylesheet" href="hero.css?v=2">
  <link rel="stylesheet" href="header-styles.css?v=2">
  <link rel="stylesheet" href="assessment-flow.css?v=2">
  <link rel="stylesheet" href="section-votes.css?v=2">
  <link rel="stylesheet" href="mobile-fixes.css?v=2">
```

---

### Step 3 — Update `push-bust.ps1` to version-bust all CSS files

In `website/push-bust.ps1`, replace the entire file contents with:

```powershell
param(
    [string]$msg = "deploy"
)

# stage everything
git add .

# commit
git commit -m $msg

# grab short SHA
$sha = (git rev-parse --short HEAD)

# bust ALL css file references (with or without existing ?v= param)
$html = Get-Content index.html -Raw
$cssFiles = @('styles-v2.css', 'hero.css', 'header-styles.css', 'assessment-flow.css', 'section-votes.css', 'mobile-fixes.css')
foreach ($css in $cssFiles) {
    $escaped = [regex]::Escape($css)
    $html = $html -replace "${escaped}\?v=[^""]*", "$css?v=$sha"
    $html = $html -replace "${escaped}(?!\?v=)", "$css?v=$sha"
}
$html | Set-Content index.html

# amend commit with updated HTML
git add index.html
git commit --amend --no-edit

# push
git push
```

---

## Verification Checklist (after deploy)

- [ ] On 390px viewport: hero quadrant fits inside screen, no horizontal scroll
- [ ] On 390px viewport: Latest Intelligence section shows 1 column of cards
- [ ] On 390px viewport: "Strategic Insights" title does not exceed screen width
- [ ] On 768px viewport: 2-column card grid
- [ ] On 1200px viewport: 3-column card grid
- [ ] All cards display complete (no bottom cut-off)
- [ ] No horizontal scrollbar on any mobile device

---

## Files Modified

| File | Action |
|------|--------|
| `website/mobile-fixes.css` | CREATE (new file) |
| `website/index.html` | ADD `?v=2` to all CSS links + add `mobile-fixes.css` link |
| `website/push-bust.ps1` | UPDATE to bust all CSS files |

---

## Notes

- Do NOT edit `hero.css` or `styles-v2.css` — the `mobile-fixes.css` overrides take precedence by load order + `!important`
- The Y-axis and X-axis labels are hidden on mobile (≤768px) — they are too cramped on small screens and the primary cause of horizontal overflow in the hero
- The quadrant grid uses `min()` to be responsive: never exceeds viewport minus padding
