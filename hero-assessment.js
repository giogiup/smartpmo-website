/**
 * HERO ASSESSMENT - Quadrant Tooltip Interactions
 * Version: 4.0 - Layout B (tooltips only, assessment moved to /assessment)
 *
 * Namespace: HeroAssessment
 * Desktop: hover to show tooltip overlay
 * Mobile: tap to expand accordion below quadrant grid
 */

const HeroAssessment = (() => {
  'use strict';

  const isMobile = () => window.innerWidth <= 768;

  // Tooltip text for each quadrant (matches hero HTML data)
  const tooltipText = {
    q1: "You haven\u2019t rolled AI out widely, but the use cases you\u2019ve chosen are delivering measurable results. You\u2019re strategic and selective \u2014 picking high-value applications and proving ROI before scaling. The risk now is staying small when you\u2019ve already proven the model works.",
    q2: "AI is woven into how your PMO plans, executes, monitors, and reports. You have governance, metrics, and leadership sees the PMO as a strategic partner. Only 6% of PMOs reach this level. Your challenge is staying ahead as the landscape shifts monthly.",
    q3: "Your PMO runs on manual processes, spreadsheets, and established routines. AI hasn\u2019t entered the picture in any meaningful way yet. You\u2019re not behind \u2014 most PMOs were here 18 months ago. But the gap between AI-enabled PMOs and traditional ones is widening fast.",
    q4: "Your team has jumped into AI \u2014 ChatGPT, Copilot, transcription tools \u2014 but it\u2019s scattered experimentation. Individual productivity improves, but leadership can\u2019t see the impact. You\u2019re in pilot purgatory: lots of activity, no proven business value. 52% of PMOs are stuck here."
  };

  // Quadrant names for accordion
  const quadrantNames = {
    q1: 'Prompt Whisperers',
    q2: 'Zen PMO',
    q3: 'Spreadsheet Nation',
    q4: 'ChatGPT Fan Club'
  };

  // Currently expanded accordion (mobile only)
  let expandedQuadrant = null;

  // Show tooltip on hover (desktop only)
  function showTooltip(quadrant) {
    if (isMobile()) return;
    const quad = document.querySelector(`.hero-quad[data-quad="${quadrant}"]`);
    if (!quad) return;
    const tooltip = quad.querySelector('.hero-tooltip');
    if (tooltip) tooltip.classList.add('hero-active');
  }

  // Hide tooltip on mouse leave (desktop only)
  function hideTooltip(quadrant) {
    if (isMobile()) return;
    const quad = document.querySelector(`.hero-quad[data-quad="${quadrant}"]`);
    if (!quad) return;
    const tooltip = quad.querySelector('.hero-tooltip');
    if (tooltip) tooltip.classList.remove('hero-active');
  }

  // Handle quadrant click — mobile tap-to-expand accordion
  function handleQuadrantClick(quadrant) {
    if (!isMobile()) return;

    // Find or create accordion container below the grid
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

    // Toggle: if same quadrant tapped, collapse
    if (expandedQuadrant === quadrant) {
      accordion.classList.remove('hero-active');
      expandedQuadrant = null;
      return;
    }

    // Expand with new content
    expandedQuadrant = quadrant;
    accordion.innerHTML = `<strong>${quadrantNames[quadrant]}</strong><br>${tooltipText[quadrant]}`;
    accordion.classList.add('hero-active');

    // Scroll into view
    accordion.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Public API — only tooltip functions exposed
  return {
    showTooltip,
    hideTooltip,
    handleQuadrantClick
  };
})();
