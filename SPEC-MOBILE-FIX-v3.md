# SPEC-MOBILE-FIX-v3.md
## SmartPMO.ai — Mobile Layout + Footer Visibility + Maintenance Banner
**For Claude Code implementation only. No other tool should touch files.**
**Files to change: `index.html`, `mobile-fixes.css`**

---

## Change 1 — `index.html`: Maintenance banner HTML

Insert the following immediately after the opening `<body>` tag, before the `<header>` element:

```html
<!-- ── Maintenance Banner ── -->
<div id="maintenance-banner" style="
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #1a1a1a;
  text-align: center;
  padding: 0.6rem 3rem 0.6rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  box-sizing: border-box;
">
  🔧 We're making improvements — some features may be temporarily unavailable. Thanks for your patience.
  <button onclick="document.getElementById('maintenance-banner').style.display='none'" style="
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: #1a1a1a;
    line-height: 1;
    padding: 0.25rem;
  " aria-label="Dismiss">×</button>
</div>
```

Then, immediately after this banner insertion, add a small `<style>` block to push the header and body down to account for the banner height (so the fixed header doesn't overlap page content):

```html
<style>
  /* Banner offset: push fixed header below banner */
  .site-header { top: 38px !important; }
  body { padding-top: calc(70px + 38px) !important; }
  @media (max-width: 639px) {
    .site-header { top: 52px !important; }
    body { padding-top: calc(70px + 52px) !important; }
    #maintenance-banner { font-size: 0.8rem !important; padding: 0.75rem 3rem 0.75rem 0.75rem !important; }
  }
</style>
```

---

## Change 2 — `index.html`: Fix VotesModule hiding share buttons

**Root cause:** `hideVoteBar(voteBar)` calls `voteBar.style.display = 'none'` on the entire `.card-footer-a` element. When the API is unreachable (always, in production — `localhost:3334`), this hides not only vote buttons but also all share buttons.

**Find** this function in the `<script>` block (VotesModule section):

```javascript
    function hideVoteBar(voteBar) {
      voteBar.style.display = 'none';
    }
```

**Replace with:**

```javascript
    function hideVoteBar(voteBar) {
      // Only hide the vote buttons — keep the footer and share buttons visible
      const votesEl = voteBar.querySelector('.footer-votes');
      const dividerEl = voteBar.querySelector('.footer-divider');
      if (votesEl) votesEl.style.display = 'none';
      if (dividerEl) dividerEl.style.display = 'none';
    }
```

---

## Change 3 — `mobile-fixes.css`: Mobile layout fixes

Append the following to the **end** of `mobile-fixes.css`:

```css
/* ── Maintenance banner: body offset already handled inline in index.html ── */

/* ── Hero: stack vertically on mobile ── */
@media (max-width: 767px) {
  .hero-section {
    overflow: hidden !important;
  }

  .hero-content {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 1.5rem !important;
    padding: 0 1rem !important;
    box-sizing: border-box !important;
  }

  .hero-copy {
    order: 1 !important;
    width: 100% !important;
  }

  .hero-visual-wrapper {
    order: 2 !important;
    width: 100% !important;
  }
}

/* ── Card footer: always visible on mobile, flex wrap if needed ── */
@media (max-width: 767px) {
  .card-footer-a {
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center !important;
    gap: 6px !important;
    padding: 10px 12px !important;
    min-height: 48px !important;
  }

  .footer-votes {
    display: flex !important;
    gap: 5px !important;
    flex-shrink: 0 !important;
  }

  .footer-share {
    display: flex !important;
    gap: 4px !important;
    flex-shrink: 0 !important;
    margin-left: auto !important;
  }

  /* Share buttons: ensure minimum tappable size on mobile */
  .card-footer-a .share-btn {
    width: 34px !important;
    height: 34px !important;
    min-width: 34px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
  }

  /* Vote buttons: minimum tappable size */
  .card-footer-a .vote-btn {
    min-height: 34px !important;
    padding: 0 8px !important;
  }
}
```

---

## Deploy Command

```
cd D:\PMO-Brain-2.0-Modular\website
.\push-bust.ps1 -msg "fix: maintenance banner, card footer visibility, mobile hero stack"
```

---

## Verification Checklist

**Banner:**
- [ ] Amber banner visible at top on both desktop and mobile
- [ ] Header sits below banner, not overlapping
- [ ] Page content not covered by header + banner
- [ ] Dismiss button (×) closes the banner
- [ ] Banner text wraps cleanly on narrow mobile screens

**Card footer:**
- [ ] Vote buttons and share buttons visible on mobile cards
- [ ] Share buttons tappable (min 34px)
- [ ] If API unreachable, only vote buttons disappear — share buttons remain
- [ ] Footer not clipped or hidden by any overflow on mobile

**Mobile hero:**
- [ ] Hero copy stacks above quadrant grid on phones
- [ ] No horizontal overflow on 390px viewport
- [ ] Quadrant grid fits within viewport

**Desktop (must not break):**
- [ ] 3-column card grid unchanged
- [ ] Hero layout unchanged
- [ ] No banner offset issues on desktop
- [ ] Footer row visible on desktop cards
