/**
 * HERO ASSESSMENT - MODULAR JAVASCRIPT
 * Version: 3.0 - Production Ready
 *
 * Namespace: HeroAssessment
 * All functions scoped to prevent conflicts with other scripts
 *
 * Features:
 * - 3-question PMO AI assessment
 * - Desktop: Modal → Grid highlight → Hover tooltip
 * - Mobile: Modal → Full-screen result → Grid with tap indicator → Bottom sheet
 * - Quadrant mapping: Q1=Prompt Whisperers, Q2=Zen PMO, Q3=Spreadsheet Nation, Q4=ChatGPT Fan Club
 */

const HeroAssessment = (() => {
  let currentQuestion = 0;
  let answers = { adoption: 0, value: 0 };
  let resultQuadrant = null;
  const isMobile = window.innerWidth <= 768;

  // 3 Assessment Questions
  const questions = [
    {
      question: "How widespread is AI adoption in your PMO?",
      options: [
        { text: "Almost nobody uses AI tools", adoption: 0, value: 0 },
        { text: "A few people experiment with AI", adoption: 2, value: 0 },
        { text: "Most of the team uses AI tools", adoption: 4, value: 0 },
        { text: "Everyone has AI in their workflow", adoption: 4, value: 2 }
      ]
    },
    {
      question: "What measurable results has AI delivered to your PMO?",
      options: [
        { text: "No measurable results yet", adoption: 0, value: 0 },
        { text: "Some productivity gains, unclear ROI", adoption: 0, value: 1 },
        { text: "Clear ROI in targeted areas", adoption: 0, value: 3 },
        { text: "Major business transformation", adoption: 0, value: 4 }
      ]
    },
    {
      question: "How would you describe your AI approach?",
      options: [
        { text: "No real approach - ad-hoc usage", adoption: 0, value: 0 },
        { text: "Running multiple pilots and experiments", adoption: 3, value: 0 },
        { text: "Strategic focus on high-value use cases", adoption: 0, value: 3 },
        { text: "AI is central to how we operate", adoption: 0, value: 4 }
      ]
    }
  ];

  // Quadrant Data (4 personas)
  const quadrantData = {
    q1: {
      name: "Prompt Whisperers",
      percentage: "28%",
      description: "Strategic AI users who pick high-value use cases and deploy thoughtfully.",
      whatItMeans: [
        "Deliberate selection of AI use cases",
        "Focus on measurable business value",
        "Limited but highly effective deployment"
      ],
      nextSteps: [
        "Scale successful use cases",
        "Document best practices",
        "Build internal expertise"
      ],
      icon: '<circle cx="20" cy="20" r="8"/><path d="M12 36 Q12 28, 20 28 Q28 28, 28 36"/><circle cx="36" cy="18" r="6" fill="none"/><path d="M36 24 L34 28 L32 26"/><circle cx="46" cy="26" r="6" fill="none"/><path d="M46 32 L44 36 L42 34"/><circle cx="56" cy="34" r="6" fill="none"/><path d="M56 40 L54 44 L52 42"/>'
    },
    q2: {
      name: "Zen PMO",
      percentage: "6%",
      description: "AI is deeply embedded across the entire PMO - it's the operating system.",
      whatItMeans: [
        "AI integrated into core workflows",
        "Organization-wide adoption",
        "Continuous optimization mindset"
      ],
      nextSteps: [
        "Share learnings externally",
        "Mentor other PMOs",
        "Push boundaries further"
      ],
      icon: '<circle cx="32" cy="32" r="20"/><path d="M32 12 Q32 22, 32 32 Q32 42, 32 52" stroke-width="2.5"/><path d="M32 12 Q42 22, 32 32 Q22 42, 32 52" fill="currentColor" opacity="0.2"/><circle cx="32" cy="22" r="3" fill="currentColor"/><circle cx="32" cy="42" r="3" stroke="currentColor" fill="none"/>'
    },
    q3: {
      name: "Spreadsheet Nation",
      percentage: "10%",
      description: "Still relying on traditional tools and processes without systematic AI use.",
      whatItMeans: [
        "Traditional approaches dominate",
        "Limited AI experimentation",
        "Risk of falling behind"
      ],
      nextSteps: [
        "Start with low-risk pilots",
        "Build internal awareness",
        "Identify quick wins"
      ],
      icon: '<rect x="12" y="12" width="40" height="40" rx="3"/><line x1="26" y1="12" x2="26" y2="52"/><line x1="40" y1="12" x2="40" y2="52"/><line x1="12" y1="24" x2="52" y2="24"/><line x1="12" y1="36" x2="52" y2="36"/><rect x="15" y="38" width="7" height="12" fill="currentColor" opacity="0.6"/><rect x="29" y="30" width="7" height="20" fill="currentColor" opacity="0.6"/><rect x="43" y="26" width="7" height="24" fill="currentColor" opacity="0.6"/>'
    },
    q4: {
      name: "ChatGPT Fan Club",
      percentage: "52%",
      description: "High AI usage but scattered pilots without clear value or strategic direction.",
      whatItMeans: [
        "Multiple tools and experiments",
        "Unclear ROI and governance",
        "Difficult to scale effectively"
      ],
      nextSteps: [
        "Consolidate and focus efforts",
        "Establish governance framework",
        "Measure value systematically"
      ],
      icon: '<circle cx="18" cy="24" r="6"/><path d="M12 38 Q12 32, 18 32 Q24 32, 24 38"/><circle cx="32" cy="22" r="7"/><path d="M25 38 Q25 30, 32 30 Q39 30, 39 38"/><circle cx="46" cy="24" r="6"/><path d="M40 38 Q40 32, 46 32 Q52 32, 52 38"/><rect x="26" y="44" width="22" height="14" rx="3"/><path d="M32 58 L32 60 L34 58"/><circle cx="32" cy="51" r="1.2" fill="currentColor"/><circle cx="38" cy="51" r="1.2" fill="currentColor"/><circle cx="44" cy="51" r="1.2" fill="currentColor"/>'
    }
  };

  // Open Modal
  function openModal() {
    // Reset all quadrant states
    document.querySelectorAll('.hero-quad').forEach(q => {
      q.classList.remove('hero-highlighted', 'hero-dimmed');
    });
    document.querySelectorAll('.hero-hover-hint, .hero-tap-indicator').forEach(h => {
      h.classList.remove('hero-active');
    });
    document.querySelectorAll('.hero-tooltip').forEach(t => {
      t.classList.remove('hero-active');
    });

    // Reset quiz state
    currentQuestion = 0;
    answers = { adoption: 0, value: 0 };
    resultQuadrant = null;

    // Show modal
    document.getElementById('heroModalOverlay').classList.add('hero-active');
    showQuestion();
  }

  // Close Modal
  function closeModal() {
    document.getElementById('heroModalOverlay').classList.remove('hero-active');
  }

  // Close modal if clicking outside
  function closeModalIfClickOutside(event) {
    if (event.target.id === 'heroModalOverlay') {
      closeModal();
    }
  }

  // Show current question
  function showQuestion() {
    const q = questions[currentQuestion];
    const container = document.getElementById('heroQuestionContainer');

    let html = `
      <div class="hero-question">
        <div class="hero-question-text">
          <span class="hero-question-number">Q${currentQuestion + 1}.</span> ${q.question}
        </div>
        <div class="hero-options">
    `;

    q.options.forEach((opt, idx) => {
      html += `<button class="hero-option-btn" onclick="HeroAssessment.selectAnswer(${idx})">${opt.text}</button>`;
    });

    html += `</div></div>`;
    container.innerHTML = html;
  }

  // Select answer and move to next question
  function selectAnswer(optionIndex) {
    const q = questions[currentQuestion];
    const selected = q.options[optionIndex];

    answers.adoption += selected.adoption;
    answers.value += selected.value;

    currentQuestion++;

    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      finishAssessment();
    }
  }

  // Finish assessment and calculate result
  function finishAssessment() {
    closeModal();

    // Assessment Logic (LOCKED)
    const adoptionLow = answers.adoption <= 3;
    const valueLow = answers.value <= 3;

    if (adoptionLow && valueLow) {
      resultQuadrant = 'q3'; // Spreadsheet Nation
    } else if (!adoptionLow && valueLow) {
      resultQuadrant = 'q4'; // ChatGPT Fan Club (52% majority)
    } else if (adoptionLow && !valueLow) {
      resultQuadrant = 'q1'; // Prompt Whisperers
    } else {
      resultQuadrant = 'q2'; // Zen PMO (elite 6%)
    }

    console.log('Adoption:', answers.adoption, 'Value:', answers.value, 'Quadrant:', resultQuadrant);

    if (isMobile) {
      showResultModal();
    } else {
      highlightQuadrant();
    }

    // Show result popup (V4) - after grid highlights
    setTimeout(() => {
      AssessmentFlow.showResultPopup(resultQuadrant);
    }, 500);
  }

  // Show full-screen result modal (mobile only)
  function showResultModal() {
    const data = quadrantData[resultQuadrant];
    const modal = document.getElementById('heroResultModal');

    modal.className = 'hero-result-modal ' + resultQuadrant + ' hero-active';
    document.getElementById('heroResultIconLarge').innerHTML = data.icon;
    document.getElementById('heroResultTitle').textContent = data.name;
    document.getElementById('heroResultPercentage').textContent = `You're in the ${data.percentage}`;
    document.getElementById('heroResultDescription').textContent = data.description;
  }

  // Close result modal
  function closeResultModal() {
    document.getElementById('heroResultModal').classList.remove('hero-active');
    highlightQuadrant();
  }

  // Highlight quadrant on grid
  function highlightQuadrant() {
    setTimeout(() => {
      const allQuads = document.querySelectorAll('.hero-quad');
      allQuads.forEach(q => {
        if (q.dataset.quad === resultQuadrant) {
          q.classList.add('hero-highlighted');

          if (isMobile) {
            q.querySelector('.hero-tap-indicator').classList.add('hero-active');
          } else {
            q.querySelector('.hero-hover-hint').classList.add('hero-active');
          }
        } else {
          q.classList.add('hero-dimmed');
        }
      });

      const quadEl = document.querySelector(`.hero-quad[data-quad="${resultQuadrant}"]`);
      quadEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }

  // Show tooltip on hover (desktop only)
  function showTooltip(quadrant) {
    if (!isMobile) {
      const quad = document.querySelector(`.hero-quad[data-quad="${quadrant}"]`);
      if (quad.classList.contains('hero-highlighted')) {
        const tooltip = quad.querySelector('.hero-tooltip');
        tooltip.classList.add('hero-active');
      }
    }
  }

  // Hide tooltip
  function hideTooltip(quadrant) {
    if (!isMobile) {
      const tooltip = document.querySelector(`.hero-tooltip.hero-${quadrant}`);
      if (tooltip) {
        tooltip.classList.remove('hero-active');
      }
    }
  }

  // Handle quadrant click (mobile only)
  function handleQuadrantClick(quadrant) {
    if (isMobile) {
      const quad = document.querySelector(`.hero-quad[data-quad="${quadrant}"]`);
      if (quad.classList.contains('hero-highlighted')) {
        showBottomSheet(quadrant);
      }
    }
  }

  // Show bottom sheet (mobile only)
  function showBottomSheet(quadrant) {
    const data = quadrantData[quadrant];
    const content = `
      <h2 class="hero-bottom-sheet-title">${data.name}</h2>
      <p class="hero-bottom-sheet-description">${data.description}</p>

      <div class="hero-bottom-sheet-section">
        <h3>What This Means:</h3>
        <ul>
          ${data.whatItMeans.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>

      <div class="hero-bottom-sheet-section">
        <h3>Next Steps:</h3>
        <ul>
          ${data.nextSteps.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `;

    document.getElementById('heroBottomSheetContent').innerHTML = content;
    document.getElementById('heroBottomSheet').classList.add('hero-active');
  }

  // Close bottom sheet
  function closeBottomSheet() {
    document.getElementById('heroBottomSheet').classList.remove('hero-active');
  }

  // Public API
  return {
    openModal,
    closeModal,
    closeModalIfClickOutside,
    showQuestion,
    selectAnswer,
    finishAssessment,
    showResultModal,
    closeResultModal,
    highlightQuadrant,
    showTooltip,
    hideTooltip,
    handleQuadrantClick,
    showBottomSheet,
    closeBottomSheet
  };
})();
