# SPEC-SITE-RECOVERY-v1.md
## SmartPMO.ai — Full Site Recovery
**Status:** Spec complete — for Claude Code implementation only  
**Priority:** CRITICAL — site has zero CSS loading

---

## Overview

Two files require changes. `mobile-fixes.css` requires no changes.

---

## Change 1 — `website/index.html`

Restore the 6 corrupted CSS `<link>` tags.

**Find:**
```html
  <link rel="stylesheet" href="=679d476">
  <link rel="stylesheet" href="=679d476">
  <link rel="stylesheet" href="=679d476">
  <link rel="stylesheet" href="=679d476">
  <link rel="stylesheet" href="=679d476">
  <link rel="stylesheet" href="=679d476">
```

**Replace with:**
```html
  <link rel="stylesheet" href="styles-v2.css">
  <link rel="stylesheet" href="hero.css">
  <link rel="stylesheet" href="header-styles.css">
  <link rel="stylesheet" href="assessment-flow.css">
  <link rel="stylesheet" href="section-votes.css">
  <link rel="stylesheet" href="mobile-fixes.css">
```

No other changes to `index.html`.

---

## Change 2 — `website/push-bust.ps1`

Replace the entire file with the following:

```powershell
param(
    [string]$msg = "deploy"
)

# Stage and commit everything
git add .
git commit -m $msg

# Get short SHA
$sha = (git rev-parse --short HEAD)

# Robust single-pass cache-busting.
# Pattern matches the entire href="..." value containing the filename.
# Safe against bare filenames, already-versioned hrefs, and previously corrupted hrefs.
$html = Get-Content index.html -Raw -Encoding UTF8

$cssFiles = @(
    'styles-v2.css',
    'hero.css',
    'header-styles.css',
    'assessment-flow.css',
    'section-votes.css',
    'mobile-fixes.css'
)

foreach ($css in $cssFiles) {
    $escapedCss = [regex]::Escape($css)
    $html = $html -replace ('href="[^"]*' + $escapedCss + '[^"]*"'), ('href="' + $css + '?v=' + $sha + '"')
}

$html | Set-Content index.html -Encoding UTF8

# Amend commit with updated index.html
git add index.html
git commit --amend --no-edit

# Push
git push
```

---

## Deploy Command

```
cd D:\PMO-Brain-2.0-Modular\website
.\push-bust.ps1 -msg "fix: restore CSS hrefs, robust single-pass cache-bust"
```

---

## Verification

- [ ] Page loads with full styling on desktop
- [ ] Skeleton loaders appear briefly, then replaced by real article cards
- [ ] No skeleton visible after data loads
- [ ] Desktop (≥1024px): 3-column card grid
- [ ] Tablet (640–1023px): 2-column card grid
- [ ] Mobile (≤639px): 1-column card grid, no horizontal scroll
- [ ] Hero fits within viewport on 390px — no horizontal scroll
- [ ] CSS hrefs in deployed `index.html` read `filename.css?v=SHA` (not `=SHA`)
