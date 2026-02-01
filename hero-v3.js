// ================================
// HERO V3 - WORLD CLASS INTERACTIONS
// 3D Quadrant + Animated Bars + Modal Quiz
// IIFE Pattern for proper encapsulation (Phase 7.3)
// ================================

const HeroV3Module = (() => {
  'use strict';

  // Private data
  const QUADRANT_DATA = {
    spreadsheet: {
      name: "Spreadsheet Nation",
      distribution: "10%",
      color: "#6B7280",
      insight: "You're in the 10% not yet using AI systematically. Skip the 52%'s mistakes—go straight to disciplined deployment.",
      challenge: "Getting started with first AI use case"
    },
    chatgpt: {
      name: "ChatGPT Fan Club",
      distribution: "52%",
      color: "#F59E0B",
      insight: "High adoption, low ROI. Focus: pick 2 use cases, measure ruthlessly, redesign workflows.",
      challenge: "Turning activity into measurable impact"
    },
    prompt: {
      name: "Prompt Whisperers",
      distribution: "28%",
      color: "#06B6D4",
      insight: "Selective, high-ROI deployments with clear governance. Next unlock: strategic transformation.",
      challenge: "Scaling from tactical wins to strategic transformation"
    },
    zen: {
      name: "Zen PMO",
      distribution: "6%",
      color: "#8B5CF6",
      insight: "AI isn't a project—it's your operating system. You're the proof case.",
      challenge: "Maintaining competitive edge and proving board-level impact"
    }
  };

  const QUIZ_QUESTIONS = [
    {
      id: 'q1',
      number: 1,
      text: 'How is your PMO currently using AI tools?',
      options: [
        { value: 0, label: 'Not using AI yet' },
        { value: 40, label: 'Experimenting with ChatGPT or similar tools' },
        { value: 70, label: 'Using AI for 3+ specific PMO workflows' },
        { value: 100, label: 'AI embedded across most PMO processes' }
      ]
    },
    {
      id: 'q2',
      number: 2,
      text: 'Can you measure AI\'s impact on your PMO outcomes?',
      options: [
        { value: 0, label: 'We don\'t measure PMO value yet' },
        { value: 30, label: 'We track some metrics but can\'t isolate AI\'s contribution' },
        { value: 70, label: 'We have clear ROI on 2-3 AI use cases' },
        { value: 100, label: 'AI contributes 20%+ to measurable business outcomes' }
      ]
    },
    {
      id: 'q3',
      number: 3,
      text: 'How does your organization approach AI adoption?',
      options: [
        { value: 0, label: 'No formal AI strategy yet' },
        { value: 30, label: 'Everyone uses tools, but no coordinated approach' },
        { value: 70, label: 'Clear governance, selective high-value deployments' },
        { value: 100, label: 'AI is integral to our business operating model' }
      ]
    }
  ];

  // Private state
  const state = {
    currentQuestion: 1,
    answers: { q1: null, q2: null, q3: null },
    isComplete: false,
    result: null
  };

  let quizStylesInjected = false;

  // Private functions
  function animateBars() {
    setTimeout(() => {
      const bars = document.querySelectorAll('.bar');
      bars.forEach((bar, index) => {
        setTimeout(() => {
          bar.classList.add('animated');
        }, index * 150);
      });
    }, 500);
  }

  function animateStats() {
    const discovered = document.getElementById('stat-discovered');
    const insights = document.getElementById('stat-insights');

    if (discovered && insights) {
      animateValue(discovered, 0, 312, 2000);
      animateValue(insights, 0, 18, 2000);
    }
  }

  function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  }

  function setupQuadrantInteractions() {
    const quadrants = document.querySelectorAll('.quadrant-3d');

    quadrants.forEach(quad => {
      quad.addEventListener('click', () => {
        openAssessmentModal();
      });

      quad.addEventListener('mouseenter', (e) => {
        const quadName = e.currentTarget.dataset.quadrant;
        const data = QUADRANT_DATA[quadName];

        // Dim other quadrants
        quadrants.forEach(q => {
          if (q !== e.currentTarget) {
            q.style.opacity = '0.4';
          }
        });

        console.log(`Hovered: ${data.name}`);
      });

      quad.addEventListener('mouseleave', () => {
        // Restore opacity
        quadrants.forEach(q => {
          q.style.opacity = '';
        });
      });
    });
  }

  function openAssessmentModal() {
    const modal = document.getElementById('assessment-modal');
    if (!modal) return;

    // Reset quiz state
    state.currentQuestion = 1;
    state.answers = { q1: null, q2: null, q3: null };
    state.isComplete = false;

    // Render first question
    renderQuestion(state.currentQuestion);

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAssessmentModal() {
    const modal = document.getElementById('assessment-modal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function injectQuizStyles() {
    if (quizStylesInjected) return;

    const style = document.createElement('style');
    style.textContent = `
      .quiz-question {
        padding: var(--space-lg);
      }
      .quiz-question-text {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-text-primary);
        margin-bottom: var(--space-lg);
        line-height: 1.3;
      }
      .quiz-options {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: var(--space-xl);
      }
      .quiz-option {
        cursor: pointer;
        display: block;
      }
      .quiz-option input[type="radio"] {
        display: none;
      }
      .quiz-option-content {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1rem 1.25rem;
        background: rgba(255, 255, 255, 0.03);
        border: 2px solid rgba(255, 255, 255, 0.06);
        border-radius: 10px;
        transition: all 0.2s ease;
      }
      .quiz-option:hover .quiz-option-content {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(6, 182, 212, 0.3);
      }
      .quiz-option input:checked + .quiz-option-content {
        background: rgba(6, 182, 212, 0.1);
        border-color: var(--color-cyan);
      }
      .quiz-option-radio {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        flex-shrink: 0;
        position: relative;
        margin-top: 2px;
        transition: all 0.2s ease;
      }
      .quiz-option input:checked + .quiz-option-content .quiz-option-radio {
        border-color: var(--color-cyan);
      }
      .quiz-option input:checked + .quiz-option-content .quiz-option-radio::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 10px;
        height: 10px;
        background: var(--color-cyan);
        border-radius: 50%;
      }
      .quiz-option-text {
        color: var(--color-text-secondary);
        font-size: 0.95rem;
        line-height: 1.4;
      }
      .quiz-actions {
        display: flex;
        gap: 1rem;
        justify-content: space-between;
      }
      .btn-quiz {
        flex: 1;
        padding: 0.875rem 1.5rem;
        font-size: 0.95rem;
        font-weight: 600;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: var(--font-display);
      }
      .btn-back {
        background: rgba(255, 255, 255, 0.05);
        color: var(--color-text-muted);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .btn-back:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.08);
      }
      .btn-back:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
      .btn-next {
        background: linear-gradient(135deg, var(--color-cyan), var(--color-purple));
        color: white;
        box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
      }
      .btn-next:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4);
      }
      .btn-next:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(style);
    quizStylesInjected = true;
  }

  function renderQuestion(questionNum) {
    const question = QUIZ_QUESTIONS[questionNum - 1];
    const modalBody = document.getElementById('modal-body');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    if (!modalBody || !progressBar || !progressText) return;

    // Inject styles once
    injectQuizStyles();

    // Update progress
    const progressPercent = (questionNum / QUIZ_QUESTIONS.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
    progressText.textContent = `Question ${questionNum}/${QUIZ_QUESTIONS.length}`;

    // Render question
    const optionsHTML = question.options.map(option => `
      <label class="quiz-option">
        <input type="radio" name="quiz-answer" value="${option.value}">
        <span class="quiz-option-content">
          <span class="quiz-option-radio"></span>
          <span class="quiz-option-text">${option.label}</span>
        </span>
      </label>
    `).join('');

    modalBody.innerHTML = `
      <div class="quiz-question">
        <h3 class="quiz-question-text">${question.text}</h3>
        <div class="quiz-options" id="quiz-options">
          ${optionsHTML}
        </div>
        <div class="quiz-actions">
          <button class="btn-quiz btn-back" id="btn-back" ${questionNum === 1 ? 'disabled' : ''}>
            ← Back
          </button>
          <button class="btn-quiz btn-next" id="btn-next" disabled>
            ${questionNum === QUIZ_QUESTIONS.length ? 'See Results' : 'Next Question'} →
          </button>
        </div>
      </div>
    `;

    // Event listeners
    const btnNext = document.getElementById('btn-next');
    const btnBack = document.getElementById('btn-back');
    const options = document.getElementById('quiz-options');

    if (options) {
      options.addEventListener('change', (e) => {
        if (e.target.type === 'radio') {
          const questionId = question.id;
          state.answers[questionId] = parseInt(e.target.value);
          if (btnNext) btnNext.disabled = false;
        }
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', handleNext);
    }

    if (btnBack) {
      btnBack.addEventListener('click', handleBack);
    }

    // Restore previous answer if exists
    const savedAnswer = state.answers[question.id];
    if (savedAnswer !== null) {
      const radio = modalBody.querySelector(`input[value="${savedAnswer}"]`);
      if (radio) {
        radio.checked = true;
        if (btnNext) btnNext.disabled = false;
      }
    }
  }

  function handleNext() {
    if (state.currentQuestion < QUIZ_QUESTIONS.length) {
      state.currentQuestion++;
      renderQuestion(state.currentQuestion);
    } else {
      completeQuiz();
    }
  }

  function handleBack() {
    if (state.currentQuestion > 1) {
      state.currentQuestion--;
      renderQuestion(state.currentQuestion);
    }
  }

  function determineQuadrant(x, y) {
    if (x <= 50 && y <= 50) {
      return QUADRANT_DATA.spreadsheet;
    } else if (x > 50 && y <= 50) {
      return QUADRANT_DATA.chatgpt;
    } else if (x >= 85 && y >= 75) {
      return QUADRANT_DATA.zen;
    } else {
      return QUADRANT_DATA.prompt;
    }
  }

  function completeQuiz() {
    // Calculate scores
    const xScore = state.answers.q1; // AI Adoption
    const yScore = (state.answers.q2 * 0.6) + (state.answers.q3 * 0.4); // Value

    // Determine quadrant
    const quadrant = determineQuadrant(xScore, yScore);

    state.result = {
      x: xScore,
      y: yScore,
      quadrant: quadrant,
      timestamp: Date.now()
    };

    state.isComplete = true;

    // Save to localStorage
    localStorage.setItem('pmoQuizResult', JSON.stringify(state.result));

    // Show result
    showResult();
  }

  function showResult() {
    const modalBody = document.getElementById('modal-body');
    const result = state.result;
    const q = result.quadrant;

    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="quiz-result" style="text-align: center; padding: var(--space-xl);">
        <div class="result-badge" style="display: inline-block; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, ${q.color}33, ${q.color}11); border: 2px solid ${q.color}; border-radius: 100px; margin-bottom: var(--space-lg);">
          <span style="font-size: 1.5rem; font-weight: 800; color: ${q.color};">
            ${q.name}
          </span>
        </div>

        <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: var(--space-md);">
          ${q.distribution} of PMOs
        </p>

        <p style="font-size: 1.125rem; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: var(--space-xl); max-width: 500px; margin-left: auto; margin-right: auto;">
          ${q.insight}
        </p>

        <div style="background: rgba(255, 255, 255, 0.03); padding: var(--space-lg); border-radius: 12px; margin-bottom: var(--space-xl);">
          <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 0.5rem;">
            <strong style="color: ${q.color};">Typical Challenge:</strong>
          </p>
          <p style="color: var(--color-text-secondary); margin-bottom: 0;">
            ${q.challenge}
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 400px; margin: 0 auto;">
          <a href="https://forms.gle/YOUR_GOOGLE_FORM_ID"
             target="_blank"
             style="display: block; padding: 1rem 2rem; background: linear-gradient(135deg, var(--color-cyan), var(--color-purple)); color: white; text-decoration: none; border-radius: 8px; font-weight: 700;">
            Get Full Assessment (PDF) →
          </a>

          <button id="btn-close-result"
                  style="padding: 0.875rem 2rem; background: rgba(255, 255, 255, 0.05); color: var(--color-text-muted); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; cursor: pointer; font-weight: 600;">
            Close
          </button>
        </div>
      </div>
    `;

    // Add close button listener
    const btnClose = document.getElementById('btn-close-result');
    if (btnClose) {
      btnClose.addEventListener('click', closeAssessmentModal);
    }
  }

  // Public API
  return {
    init() {
      animateBars();
      animateStats();
      setupQuadrantInteractions();

      const btnStart = document.getElementById('btn-start');
      if (btnStart) {
        btnStart.addEventListener('click', openAssessmentModal);
      }

      const modalClose = document.getElementById('modal-close');
      const modalOverlay = document.getElementById('modal-overlay');

      if (modalClose) {
        modalClose.addEventListener('click', closeAssessmentModal);
      }

      if (modalOverlay) {
        modalOverlay.addEventListener('click', closeAssessmentModal);
      }
    },

    openModal: openAssessmentModal,
    closeModal: closeAssessmentModal,

    getState() {
      return { ...state };
    },

    getResult() {
      return state.result ? { ...state.result } : null;
    }
  };
})();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  HeroV3Module.init();
});

// Expose closeAssessmentModal globally for legacy onclick handlers
window.closeAssessmentModal = HeroV3Module.closeModal;
