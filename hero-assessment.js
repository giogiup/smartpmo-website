/**
 * HERO ASSESSMENT - Quadrant Tooltip Interactions
 * Version: 5.0 - Grid-level tooltip (desktop) + accordion (mobile)
 *
 * Namespace: HeroAssessment
 * Desktop: hover shows shared tooltip overlay centred on quadrant grid
 * Mobile: tap to expand accordion below quadrant grid (unchanged)
 */

const HeroAssessment = (() => {
  'use strict';

  const isMobile = () => window.innerWidth <= 768;

  const tooltipText = {
    q1: "You haven\u2019t rolled AI out widely, but the use cases you\u2019ve chosen are delivering measurable results. You\u2019re strategic and selective \u2014 picking high-value applications and proving ROI before scaling. The risk now is staying small when you\u2019ve already proven the model works.",
    q2: "AI is woven into how your PMO plans, executes, monitors, and reports. You have governance, metrics, and leadership sees the PMO as a strategic partner. Only 6% of PMOs reach this level. Your challenge is staying ahead as the landscape shifts monthly.",
    q3: "Your PMO runs on manual processes, spreadsheets, and established routines. AI hasn\u2019t entered the picture in any meaningful way yet. You\u2019re not behind \u2014 most PMOs were here 18 months ago. But the gap between AI-enabled PMOs and traditional ones is widening fast.",
    q4: "Your team has jumped into AI \u2014 ChatGPT, Copilot, transcription tools \u2014 but it\u2019s scattered experimentation. Individual productivity improves, but leadership can\u2019t see the impact. You\u2019re in pilot purgatory: lots of activity, no proven business value. 52% of PMOs are stuck here."
  };

  const quadrantNames = {
    q1: 'Prompt Whisperers',
    q2: 'Zen PMO',
    q3: 'Spreadsheet Nation',
    q4: 'ChatGPT Fan Club'
  };

  let expandedQuadrant = null;

  // Desktop: show shared grid-level tooltip
  function showTooltip(quadrant) {
    if (isMobile()) return;
    const tooltip = document.getElementById('heroGridTooltip');
    if (!tooltip) return;
    tooltip.setAttribute('data-quad', quadrant);
    tooltip.innerHTML = '<span class="tooltip-title">' + quadrantNames[quadrant] + '</span>' + tooltipText[quadrant];
    tooltip.classList.add('hero-active');
  }

  // Desktop: hide shared grid-level tooltip
  function hideTooltip(quadrant) {
    if (isMobile()) return;
    const tooltip = document.getElementById('heroGridTooltip');
    if (!tooltip) return;
    tooltip.classList.remove('hero-active');
  }

  // Mobile: tap-to-expand accordion (UNCHANGED from v4.0)
  function handleQuadrantClick(quadrant) {
    if (!isMobile()) return;

    let accordion = document.getElementById('heroAccordion');
    if (!accordion) {
      accordion = document.createElement('div');
      accordion.id = 'heroAccordion';
      accordion.className = 'hero-tooltip-accordion';
      const wrapper = document.querySelector('.hero-visual-wrapper');
      if (wrapper) {
        wrapper.parentNode.insertBefore(accordion, wrapper.nextSibling);
      }
    }

    if (expandedQuadrant === quadrant) {
      accordion.classList.remove('hero-active');
      expandedQuadrant = null;
      return;
    }

    expandedQuadrant = quadrant;
    accordion.innerHTML = '<strong>' + quadrantNames[quadrant] + '</strong><br>' + tooltipText[quadrant];
    accordion.classList.add('hero-active');
    accordion.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  return {
    showTooltip,
    hideTooltip,
    handleQuadrantClick
  };
})();
