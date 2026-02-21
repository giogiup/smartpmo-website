# FIX-SPEC: Share Buttons Disappearing After Pub Date Fix
**Status:** READY FOR IMPLEMENTATION
**Created:** 2026-02-21
**Assigned to:** Claude Code
**Risk:** Low — CSS + HTML template only, no JS logic changes

---

## Root Cause

The pub date fix used `margin-left: auto` on `.footer-share` to push share buttons right. The card has `overflow: hidden` — share buttons get clipped beyond the card boundary.

---

## Solution: Left/Right Group Layout

Replace single-row flex footer with two named groups: `.footer-left` (votes + date) and `.footer-right` (share icons). `justify-content: space-between` handles spacing. No `margin-left: auto` required.

Final layout:
```
[👍 0] [👎 0]  |  20 Feb 26          [LinkedIn][X][✉][⧉][WhatsApp]
```

---

## Change 1 — `website/mobile-fixes.css`

Remove any existing `.footer-date`, `.footer-share`, `.card-footer-a` overrides from previous fix attempts. Add:

```css
/* FIX-SPEC-CARD-FOOTER-SHARE-BUTTONS */
.card-footer-a {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  flex-wrap: nowrap !important;
  overflow: visible !important;
}
.card-footer-a .footer-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.card-footer-a .footer-right {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.footer-date {
  font-size: 0.7rem;
  color: rgba(176, 196, 222, 0.6);
  font-style: italic;
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
}
```

---

## Change 2 — `website/index.html` — `renderCards()` footer block

Replace the entire `.card-footer-a` block in the `renderCards()` template.

New structure — wrap votes + divider + date in `<div class="footer-left">`, wrap all 5 share buttons in `<div class="footer-right">`:

```html
<div class="card-footer-a" data-article-id="${normalizedCard.id}">
  <div class="footer-left">
    <button class="vote-btn vote-btn--up" aria-label="Useful" aria-pressed="false">
      <span class="vote-icon">👍</span>
      <span class="vote-count vote-count--up">0</span>
    </button>
    <button class="vote-btn vote-btn--down" aria-label="Not useful" aria-pressed="false">
      <span class="vote-icon">👎</span>
      <span class="vote-count vote-count--down">0</span>
    </button>
    <div class="footer-divider"></div>
    ${normalizedCard.date ? `<span class="footer-date">${formatCardDate(normalizedCard.date)}</span>` : ''}
  </div>
  <div class="footer-right">
    [ALL 5 SHARE BUTTONS — copy exactly from current index.html, preserve all onclick handlers and SVGs]
  </div>
</div>
```

---

## Change 3 — Confirm `formatCardDate()` exists in `index.html`

If missing, add after the existing `formatDate()` function:

```javascript
function formatCardDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const day = date.getDate();
  const month = date.toLocaleDateString('en-GB', { month: 'short' });
  const year = String(date.getFullYear()).slice(-2);
  return `${day} ${month} ${year}`;
}
```

---

## Do NOT change

- `createArticleCard()` — curated section unchanged
- VotesModule JS — no changes
- Any other CSS files

---

## Deploy

```powershell
cd D:\PMO-Brain-2.0-Modular\website
.\push-bust.ps1 -msg "fix: footer left/right groups, share buttons restored"
```

---

## Verification

1. Desktop: votes + date left, all 5 share icons visible right — single row
2. Mobile: same — no wrapping, no clipped icons
3. Vote buttons functional
4. Zero console errors

---

## STATUS.md update after deploy

Add as Fix #46.
