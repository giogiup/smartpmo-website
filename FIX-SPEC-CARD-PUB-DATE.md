# FIX-SPEC: Published Date on Article Cards — Option A (Footer Centre)
**Status:** READY FOR IMPLEMENTATION
**Created:** 2026-02-21
**Assigned to:** Claude Code
**File to edit:** `website/index.html` only
**Risk:** Low — additive HTML + one new CSS rule + one new JS function

---

## Layout Target

Current footer row:
```
[👍 0]  [👎 0]  |  [LinkedIn][X][✉][⧉][WhatsApp]
```

After fix:
```
[👍 0]  [👎 0]  |  25 Feb 26  |  [LinkedIn][X][✉][⧉][WhatsApp]
```

Date sits centred between the two dividers using `flex: 1; text-align: center`.

---

## Change 1 — New date format function

`formatDate()` currently outputs "Jan 16, 2025". Add a second function `formatCardDate()` for the compact card format "25 Feb 26".

Add this function immediately after the existing `formatDate()` function:

```javascript
// Compact card date format: "25 Feb 26"
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

## Change 2 — Update `renderCards()` footer HTML

In `renderCards()`, locate the `.card-footer-a` block. It currently reads:

```html
<div class="card-footer-a" data-article-id="${normalizedCard.id}">
  <div class="footer-votes">
    ...
  </div>
  <div class="footer-divider"></div>
  <div class="footer-share">
    ...
  </div>
</div>
```

Replace with (insert date span + second divider between the existing divider and footer-share):

```html
<div class="card-footer-a" data-article-id="${normalizedCard.id}">
  <div class="footer-votes">
    <button class="vote-btn vote-btn--up" aria-label="Useful" aria-pressed="false">
      <span class="vote-icon">👍</span>
      <span class="vote-count vote-count--up">0</span>
    </button>
    <button class="vote-btn vote-btn--down" aria-label="Not useful" aria-pressed="false">
      <span class="vote-icon">👎</span>
      <span class="vote-count vote-count--down">0</span>
    </button>
  </div>
  <div class="footer-divider"></div>
  ${normalizedCard.date ? `<span class="footer-date">${formatCardDate(normalizedCard.date)}</span>` : ''}
  <div class="footer-divider"></div>
  <div class="footer-share">
    ... (share buttons unchanged)
  </div>
</div>
```

**Note:** If `normalizedCard.date` is falsy, the date span is omitted entirely. The second divider renders regardless (share icons still need a left border). This is acceptable — an empty centre zone is invisible.

**Alternative if second divider looks odd without date:** Wrap both in a conditional:
```javascript
${normalizedCard.date ? `<span class="footer-date">${formatCardDate(normalizedCard.date)}</span><div class="footer-divider"></div>` : ''}
```
This removes the second divider entirely when there is no date. **Preferred approach.**

---

## Change 3 — CSS for `.footer-date`

Append to `website/mobile-fixes.css`:

```css
/* Footer centre date — Option A */
.footer-date {
  flex: 1;
  text-align: center;
  font-size: 0.7rem;
  color: var(--color-text-muted, rgba(176, 196, 222, 0.6));
  font-style: italic;
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
}
```

`flex: 1` pushes vote buttons left and share buttons right while keeping the date centred. `white-space: nowrap` prevents wrapping on narrow cards. `pointer-events: none` prevents accidental interaction.

---

## Change 4 — `createArticleCard()` (curated section)

`createArticleCard()` already calls `formatDate(article.publishedDate)` and renders it in `.card-meta`. The curated section uses a different card structure — **do not add the footer date to curated cards**. Leave `createArticleCard()` unchanged.

---

## Deploy

```powershell
cd D:\PMO-Brain-2.0-Modular\website
.\push-bust.ps1 -msg "fix: published date in card footer (Option A)"
```

---

## Verification

1. Open smartpmo.ai — Latest Intelligence cards show date centred in footer row e.g. `25 Feb 26`
2. Date is between vote counts and share icons, separated by dividers
3. No layout break on narrow viewport (date wraps to nothing before buttons overlap — `white-space: nowrap` + `flex: 1` handles this)
4. If date field missing from a card, footer renders normally with no gap artefact
5. Zero console errors
6. Votes and share buttons still function correctly

---

## status.md update required after deploy
