// ============================================================================
// PMO AI ASSESSMENT QUIZ - Progressive Reveal Version
// Based on HERO-REDESIGNSPEC-v2.0
// IIFE Pattern for proper encapsulation (Phase 7.3)
// ============================================================================

const QuizModule = (() => {
    'use strict';

    // Private state
    const state = {
        currentQuestion: 1,
        answers: { q1: null, q2: null, q3: null },
        isComplete: false,
        result: null
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

    // CORRECTED QUADRANT DEFINITIONS (Zen PMO = Top-Right)
    const QUADRANTS = {
        "Spreadsheet Nation": {
            name: "Spreadsheet Nation",
            color: "#6B7280",
            icon: "📊",
            distribution: "10%",
            insight: "You're in the 10% not yet using AI systematically. The good news: you can learn from the 52% stuck in pilot purgatory and skip straight to disciplined deployment. Start with one high-impact use case—schedule optimization or meeting transcription—and measure rigorously.",
            challenge: "Getting started with first AI use case",
            nextSteps: "Start with one high-impact use case (meeting transcription or schedule optimization), measure time saved rigorously, and document the workflow change."
        },
        "ChatGPT Fan Club": {
            name: "ChatGPT Fan Club",
            color: "#F59E0B",
            icon: "💬",
            distribution: "52%",
            insight: "You're experimenting—welcome to the 52%. The gap: your team uses tools, but value isn't landing. Focus on 3 things: (1) Pick 2-3 use cases and go deep, (2) Measure ROI ruthlessly, (3) Redesign workflows, not just add AI to broken processes.",
            challenge: "Turning activity into measurable impact",
            nextSteps: "Choose your top 2 AI use cases, establish baseline metrics, and commit to 90-day ROI measurement. Stop spreading effort thin."
        },
        "Prompt Whisperers": {
            name: "Prompt Whisperers",
            color: "#06B6D4",
            icon: "🎯",
            distribution: "28%",
            insight: "You're in the disciplined 28%. You've cracked the code: selective, high-ROI deployments with clear governance. Your next unlock: embed AI deeper into your operating model. Move from 'AI for tasks' to 'AI for strategy.'",
            challenge: "Scaling from tactical wins to strategic transformation",
            nextSteps: "Identify 3 strategic workflows (portfolio prioritization, resource forecasting, stakeholder analysis) where AI can shift from automation to intelligence."
        },
        "Zen PMO": {
            name: "Zen PMO",
            color: "#8B5CF6",
            icon: "🧘",
            distribution: "6%",
            insight: "You're in the transformational 6%. AI isn't a project—it's your operating system. Your challenge: sustain this edge. Focus on change management, continuous learning, and demonstrating EBIT impact to the board.",
            challenge: "Maintaining competitive edge and proving board-level impact",
            nextSteps: "Document your AI operating model, quantify EBIT contribution, and evangelize your approach to other business units. You're the proof case."
        }
    };

    // Private functions
    function renderQuestion(questionNum) {
        const question = QUIZ_QUESTIONS[questionNum - 1];

        // Update progress
        const progressPercent = (questionNum / QUIZ_QUESTIONS.length) * 100;
        document.getElementById('quiz-progress-bar').style.width = `${progressPercent}%`;
        document.getElementById('quiz-progress-text').textContent = `Question ${questionNum}/${QUIZ_QUESTIONS.length}`;

        // Update content
        document.getElementById('question-num').textContent = questionNum;
        document.getElementById('question-text').textContent = question.text;

        // Render options
        const optionsHTML = question.options.map(option => `
            <label class="quiz-option">
                <input type="radio" name="quiz-answer" value="${option.value}">
                <span class="quiz-option-content">
                    <span class="quiz-option-radio"></span>
                    <span class="quiz-option-text">${option.label}</span>
                </span>
            </label>
        `).join('');

        document.getElementById('quiz-options').innerHTML = optionsHTML;

        // Restore answer if exists
        const savedAnswer = state.answers[question.id];
        if (savedAnswer !== null) {
            const radio = document.querySelector(`input[value="${savedAnswer}"]`);
            if (radio) {
                radio.checked = true;
                document.getElementById('btn-next').disabled = false;
            }
        } else {
            document.getElementById('btn-next').disabled = true;
        }

        // Update button states
        document.getElementById('btn-back').disabled = questionNum === 1;

        // Change button text on last question
        if (questionNum === QUIZ_QUESTIONS.length) {
            document.getElementById('btn-next').innerHTML = 'See My Position →';
        } else {
            document.getElementById('btn-next').innerHTML = 'Next Question →';
        }

        // Animate card
        const card = document.getElementById('quiz-card');
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = 'fadeSlideIn 0.4s ease-out';
        }, 10);
    }

    function handleAnswerSelect(e) {
        if (e.target.type === 'radio') {
            const questionId = QUIZ_QUESTIONS[state.currentQuestion - 1].id;
            state.answers[questionId] = parseInt(e.target.value);
            document.getElementById('btn-next').disabled = false;
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
        // CORRECTED LOGIC (Zen PMO = Top-Right)
        if (x <= 50 && y <= 50) {
            return QUADRANTS["Spreadsheet Nation"]; // Bottom-Left
        } else if (x > 50 && y <= 50) {
            return QUADRANTS["ChatGPT Fan Club"]; // Bottom-Right
        } else if (x >= 85 && y >= 75) {
            return QUADRANTS["Zen PMO"]; // Top-Right (extreme high AI + high value)
        } else {
            return QUADRANTS["Prompt Whisperers"]; // Top-Left/Center (high value, moderate-high AI)
        }
    }

    function completeQuiz() {
        // Calculate scores
        const xScore = state.answers.q1; // AI Adoption (Q1: 100% weight)
        const yScore = (state.answers.q2 * 0.6) + (state.answers.q3 * 0.4); // Value (Q2: 60%, Q3: 40%)

        // Determine quadrant (CORRECTED)
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

        // PROGRESSIVE REVEAL: Hide quiz, show result
        hideQuizShowResult();
    }

    function hideQuizShowResult() {
        const quizContainer = document.getElementById('quiz-container');
        const resultSection = document.getElementById('result-section');

        // Fade out quiz
        quizContainer.classList.add('hiding');

        setTimeout(() => {
            quizContainer.style.display = 'none';
            resultSection.style.display = 'block';
            resultSection.innerHTML = renderResultHTML(state.result);

            // Smooth scroll to result
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Animate quadrant plotting
            setTimeout(() => {
                plotQuadrantPosition(state.result.x, state.result.y, state.result.quadrant.name);
            }, 600);
        }, 400);
    }

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
    }

    function renderResultHTML(result) {
        const q = result.quadrant;
        const colorRgb = hexToRgb(q.color);

        return `
            <div class="result-container" style="--quadrant-color: ${q.color}; --quadrant-color-rgb: ${colorRgb}">
                <div class="result-grid">

                    <!-- Left: Quadrant Visual -->
                    <div class="result-visual">
                        ${generateQuadrantSVG()}
                    </div>

                    <!-- Right: Result Details -->
                    <div class="result-details">
                        <div class="result-quadrant-badge">
                            <span class="result-icon">${q.icon}</span>
                            <span class="result-quadrant-name">${q.name}</span>
                            <span class="result-distribution">${q.distribution} of PMOs</span>
                        </div>

                        <p class="result-insight">${q.insight}</p>

                        <div class="result-stats">
                            <div class="result-stat">
                                <span class="result-stat-icon">🎯</span>
                                <span class="result-stat-text">
                                    <strong>Typical challenge:</strong> ${q.challenge}
                                </span>
                            </div>
                            <div class="result-stat">
                                <span class="result-stat-icon">📈</span>
                                <span class="result-stat-text">
                                    <strong>Next steps:</strong> ${q.nextSteps}
                                </span>
                            </div>
                        </div>

                        <div class="result-cta-card">
                            <h3 class="result-cta-title">
                                Want Your Full PMO AI Readiness Assessment?
                            </h3>
                            <ul class="result-cta-list">
                                <li>15-question detailed analysis</li>
                                <li>Personalized improvement roadmap</li>
                                <li>PMO AI Adoption Report (PDF)</li>
                            </ul>

                            <a href="https://forms.gle/YOUR_GOOGLE_FORM_ID"
                               target="_blank"
                               class="btn-result-cta">
                                Get Full Assessment →
                            </a>

                            <p class="result-cta-note">
                                Takes 3 minutes · Instant personalized results via email
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        `;
    }

    function generateQuadrantSVG() {
        return `
            <svg id="quadrant-svg" viewBox="0 0 400 400" class="quadrant-svg">
                <defs>
                    <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#06B6D4;stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:#06B6D4;stop-opacity:0.1" />
                    </linearGradient>
                    <linearGradient id="amber-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#F59E0B;stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:#F59E0B;stop-opacity:0.1" />
                    </linearGradient>
                    <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:0.1" />
                    </linearGradient>
                    <linearGradient id="grey-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#6B7280;stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:#6B7280;stop-opacity:0.1" />
                    </linearGradient>
                </defs>

                <!-- Grid lines -->
                <line x1="200" y1="50" x2="200" y2="350" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
                <line x1="50" y1="200" x2="350" y2="200" stroke="rgba(255,255,255,0.1)" stroke-width="1" />

                <!-- Quadrant backgrounds (CORRECTED ORDER) -->
                <!-- Top-Left: Prompt Whisperers -->
                <rect x="50" y="50" width="150" height="150"
                      fill="url(#cyan-gradient)"
                      class="quadrant-rect"
                      data-quadrant="Prompt Whisperers" />

                <!-- Top-Right: Zen PMO (FIXED) -->
                <rect x="200" y="50" width="150" height="150"
                      fill="url(#purple-gradient)"
                      class="quadrant-rect"
                      data-quadrant="Zen PMO" />

                <!-- Bottom-Left: Spreadsheet Nation -->
                <rect x="50" y="200" width="150" height="150"
                      fill="url(#grey-gradient)"
                      class="quadrant-rect"
                      data-quadrant="Spreadsheet Nation" />

                <!-- Bottom-Right: ChatGPT Fan Club -->
                <rect x="200" y="200" width="150" height="150"
                      fill="url(#amber-gradient)"
                      class="quadrant-rect"
                      data-quadrant="ChatGPT Fan Club" />

                <!-- Quadrant labels (CORRECTED) -->
                <text x="125" y="90" text-anchor="middle" fill="#06B6D4" font-size="13" font-weight="700">Prompt</text>
                <text x="125" y="108" text-anchor="middle" fill="#06B6D4" font-size="13" font-weight="700">Whisperers</text>
                <text x="125" y="126" text-anchor="middle" fill="#06B6D4" font-size="11" opacity="0.8">28%</text>

                <text x="275" y="95" text-anchor="middle" fill="#8B5CF6" font-size="14" font-weight="700">Zen PMO</text>
                <text x="275" y="113" text-anchor="middle" fill="#8B5CF6" font-size="11" opacity="0.8">6%</text>

                <text x="125" y="260" text-anchor="middle" fill="#6B7280" font-size="12" font-weight="700">Spreadsheet</text>
                <text x="125" y="276" text-anchor="middle" fill="#6B7280" font-size="12" font-weight="700">Nation</text>
                <text x="125" y="292" text-anchor="middle" fill="#6B7280" font-size="11" opacity="0.8">10%</text>

                <text x="275" y="260" text-anchor="middle" fill="#F59E0B" font-size="12" font-weight="700">ChatGPT</text>
                <text x="275" y="276" text-anchor="middle" fill="#F59E0B" font-size="12" font-weight="700">Fan Club</text>
                <text x="275" y="292" text-anchor="middle" fill="#F59E0B" font-size="11" opacity="0.8">52%</text>

                <!-- Axis labels -->
                <text x="200" y="380" text-anchor="middle" fill="#b0c4de" font-size="11">
                    AI Adoption Intensity →
                </text>
                <text x="20" y="200" text-anchor="middle" fill="#b0c4de" font-size="11"
                      transform="rotate(-90 20 200)">
                    ← Value Realization
                </text>

                <!-- User position dot (animated) -->
                <circle id="user-position-dot" cx="200" cy="200" r="0"
                        fill="#00F5FF" stroke="#fff" stroke-width="3" opacity="0">
                    <animate attributeName="r" from="0" to="12" dur="0.6s" fill="freeze" begin="indefinite" />
                    <animate attributeName="opacity" from="0" to="1" dur="0.6s" fill="freeze" begin="indefinite" />
                </circle>

                <!-- Pulse effect -->
                <circle id="user-position-pulse" cx="200" cy="200" r="12"
                        fill="none" stroke="#00F5FF" stroke-width="2" opacity="0">
                    <animate attributeName="r" from="12" to="30" dur="2s" repeatCount="indefinite" begin="indefinite" />
                    <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" begin="indefinite" />
                </circle>
            </svg>
        `;
    }

    function plotQuadrantPosition(xScore, yScore, quadrantName) {
        // Convert 0-100 scores to SVG coordinates 50-350
        const svgX = 50 + (xScore / 100) * 300;
        const svgY = 350 - (yScore / 100) * 300; // Inverted Y

        const dot = document.getElementById('user-position-dot');
        const pulse = document.getElementById('user-position-pulse');

        if (!dot || !pulse) return;

        dot.setAttribute('cx', svgX);
        dot.setAttribute('cy', svgY);
        pulse.setAttribute('cx', svgX);
        pulse.setAttribute('cy', svgY);

        // Trigger animations
        const dotAnims = dot.querySelectorAll('animate');
        dotAnims.forEach(anim => anim.beginElement());

        setTimeout(() => {
            const pulseAnims = pulse.querySelectorAll('animate');
            pulseAnims.forEach(anim => anim.beginElement());
        }, 600);

        // Highlight quadrant
        const rects = document.querySelectorAll('.quadrant-rect');
        rects.forEach(rect => {
            if (rect.dataset.quadrant === quadrantName) {
                rect.classList.add('highlighted');
            } else {
                rect.style.opacity = '0.3';
            }
        });
    }

    // Public API
    return {
        init() {
            renderQuestion(state.currentQuestion);

            document.getElementById('btn-next').addEventListener('click', handleNext);
            document.getElementById('btn-back').addEventListener('click', handleBack);
            document.getElementById('quiz-options').addEventListener('change', handleAnswerSelect);
        },

        getState() {
            return { ...state };
        },

        getResult() {
            return state.result ? { ...state.result } : null;
        }
    };
})();

// ============================================================================
// LIVE STATS LOADER (IIFE Module)
// ============================================================================

const LiveStatsModule = (() => {
    'use strict';

    const config = {
        statsUrl: 'api/live-stats.json',
        refreshInterval: 5 * 60 * 1000
    };

    let intervalId = null;

    function formatNumber(num) {
        return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
    }

    function display(stats) {
        const badge = document.getElementById('live-stats-badge');
        if (!badge) return;

        badge.style.display = 'block';

        const discovered = document.getElementById('stats-discovered');
        const analyzed = document.getElementById('stats-analyzed');
        const insights = document.getElementById('stats-insights');
        const passRate = document.getElementById('stats-pass-rate');

        if (discovered) discovered.textContent = formatNumber(stats.discovered || 0);
        if (analyzed) analyzed.textContent = formatNumber(stats.analyzed || 0);
        if (insights) insights.textContent = formatNumber(stats.insights || 0);
        if (passRate) passRate.textContent = `${Math.round(stats.pass_rate || 0)}%`;

        const insightsMobile = document.getElementById('stats-insights-mobile');
        const passRateMobile = document.getElementById('stats-pass-rate-mobile');

        if (insightsMobile) insightsMobile.textContent = formatNumber(stats.insights || 0);
        if (passRateMobile) passRateMobile.textContent = `${Math.round(stats.pass_rate || 0)}%`;

        const period = document.getElementById('stats-period');
        if (period) period.textContent = stats.period || 'Last 24h';
    }

    async function load() {
        try {
            const response = await fetch(config.statsUrl);
            if (!response.ok) return;

            const stats = await response.json();
            display(stats);
        } catch (error) {
            const badge = document.getElementById('live-stats-badge');
            if (badge) badge.style.display = 'none';
        }
    }

    return {
        init() {
            load();
            intervalId = setInterval(load, config.refreshInterval);
        },

        stop() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        },

        refresh() {
            load();
        }
    };
})();

// ============================================================================
// Initialize on page load
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    QuizModule.init();
    LiveStatsModule.init();
});
