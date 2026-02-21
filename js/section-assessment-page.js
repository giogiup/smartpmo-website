/**
 * ASSESSMENT PAGE MODULE
 * 15-question PMO AI assessment with quadrant results
 * IIFE — zero global variables, zero external dependencies
 */
const AssessmentPageModule = (() => {
  'use strict';

  // ── Question Data ──────────────────────────────────────────────────────
  const QUESTIONS = [
    // Section 1: AI Adoption Intensity (Q1-Q5) → X-axis
    {
      id: 1, section: 1, sectionName: 'AI Adoption Intensity',
      text: 'How many AI tools does your PMO team actively use?',
      type: 'single',
      options: [
        { text: 'None', value: 0 },
        { text: '1\u20132 tools', value: 25 },
        { text: '3\u20135 tools', value: 60 },
        { text: '6+ tools or custom AI solutions', value: 100 }
      ]
    },
    {
      id: 2, section: 1, sectionName: 'AI Adoption Intensity',
      text: 'What percentage of your PMO\u2019s projects use AI in some capacity?',
      type: 'single',
      options: [
        { text: '0%', value: 0 },
        { text: '1\u201315%', value: 30 },
        { text: '16\u201350%', value: 60 },
        { text: '51%+', value: 100 }
      ]
    },
    {
      id: 3, section: 1, sectionName: 'AI Adoption Intensity',
      text: 'Which AI capabilities does your PMO currently use?',
      type: 'multi',
      options: [
        { text: 'Document summarization', value: 'summarization' },
        { text: 'Meeting transcription/notes', value: 'transcription' },
        { text: 'Schedule optimization', value: 'scheduling' },
        { text: 'Risk analysis', value: 'risk' },
        { text: 'Resource allocation', value: 'resource' },
        { text: 'Report automation', value: 'reporting' },
        { text: 'Predictive analytics', value: 'predictive' },
        { text: 'None yet', value: 'none' }
      ]
    },
    {
      id: 4, section: 1, sectionName: 'AI Adoption Intensity',
      text: 'How did AI adoption happen in your PMO?',
      type: 'single',
      options: [
        { text: 'We don\u2019t use AI', value: 0 },
        { text: 'Team members use their own tools (BYOAI)', value: 30 },
        { text: 'PMO leadership encouraged experimentation', value: 50 },
        { text: 'Part of formal organizational AI strategy', value: 80 },
        { text: 'AI strategy led by PMO itself', value: 100 }
      ]
    },
    {
      id: 5, section: 1, sectionName: 'AI Adoption Intensity',
      text: 'How long has your PMO been using AI?',
      type: 'single',
      options: [
        { text: 'Not yet', value: 0 },
        { text: 'Less than 6 months', value: 40 },
        { text: '6\u201312 months', value: 60 },
        { text: '1\u20132 years', value: 80 },
        { text: '2+ years', value: 100 }
      ]
    },
    // Section 2: Value Realization (Q6-Q10) → Y-axis
    {
      id: 6, section: 2, sectionName: 'Value Realization',
      text: 'Can you quantify time saved from AI usage?',
      type: 'single',
      options: [
        { text: 'We don\u2019t measure this', value: 0 },
        { text: 'Anecdotally, some time saved', value: 30 },
        { text: 'We estimate 5\u201315% time savings', value: 60 },
        { text: 'We track and measure 15%+ time savings', value: 100 }
      ]
    },
    {
      id: 7, section: 2, sectionName: 'Value Realization',
      text: 'Does your organization measure AI\u2019s contribution to business outcomes?',
      type: 'single',
      options: [
        { text: 'No formal measurement', value: 0 },
        { text: 'We track AI project activity', value: 30 },
        { text: 'We can isolate AI\u2019s impact on 1\u20132 KPIs', value: 60 },
        { text: 'AI contributes measurably to EBIT/revenue', value: 100 }
      ]
    },
    {
      id: 8, section: 2, sectionName: 'Value Realization',
      text: 'How many AI experiments have scaled beyond pilot?',
      type: 'single',
      options: [
        { text: 'None yet / We haven\u2019t piloted', value: 0 },
        { text: 'We\u2019re still in pilot phase', value: 20 },
        { text: '1\u20132 have scaled', value: 60 },
        { text: '3+ have scaled into standard workflows', value: 100 }
      ]
    },
    {
      id: 9, section: 2, sectionName: 'Value Realization',
      text: 'What\u2019s the biggest blocker to AI value in your PMO?',
      type: 'single',
      options: [
        { text: 'We haven\u2019t started yet', value: 0 },
        { text: 'Lack of skills/training', value: 30 },
        { text: 'Can\u2019t identify right use cases', value: 40 },
        { text: 'Tools don\u2019t integrate with our systems', value: 50 },
        { text: 'No blocker \u2014 we\u2019re seeing value', value: 100 }
      ]
    },
    {
      id: 10, section: 2, sectionName: 'Value Realization',
      text: 'How does leadership view your PMO\u2019s AI efforts?',
      type: 'single',
      options: [
        { text: 'Unaware or skeptical', value: 0 },
        { text: 'Aware but waiting for proof', value: 40 },
        { text: 'Supportive, requesting updates', value: 70 },
        { text: 'Actively invested, AI is strategic priority', value: 100 }
      ]
    },
    // Section 3: Strategic Maturity (Q11-Q15) → Sub-level
    {
      id: 11, section: 3, sectionName: 'Strategic Maturity',
      text: 'Does your organization have a formal AI strategy?',
      type: 'single',
      options: [
        { text: 'No', value: 0 },
        { text: 'Under development', value: 40 },
        { text: 'Yes, documented', value: 70 },
        { text: 'Yes, actively governed and measured', value: 100 }
      ]
    },
    {
      id: 12, section: 3, sectionName: 'Strategic Maturity',
      text: 'How does your PMO approach AI governance?',
      type: 'single',
      options: [
        { text: 'No governance yet', value: 0 },
        { text: 'Informal guidelines', value: 30 },
        { text: 'Clear policies on data/security', value: 60 },
        { text: 'Full governance: ethics, ROI tracking, change management', value: 100 }
      ]
    },
    {
      id: 13, section: 3, sectionName: 'Strategic Maturity',
      text: 'What percentage of your PMO team has received AI training?',
      type: 'single',
      options: [
        { text: '0%', value: 0 },
        { text: '1\u201325%', value: 30 },
        { text: '26\u201350%', value: 60 },
        { text: '51%+', value: 100 }
      ]
    },
    {
      id: 14, section: 3, sectionName: 'Strategic Maturity',
      text: 'How are AI investments prioritized in your PMO?',
      type: 'single',
      options: [
        { text: 'Ad-hoc, team members experiment', value: 20 },
        { text: 'PMO leader approves requests', value: 40 },
        { text: 'Based on estimated ROI/impact', value: 70 },
        { text: 'Portfolio approach: 10% tech, 20% algo, 70% people', value: 100 }
      ]
    },
    {
      id: 15, section: 3, sectionName: 'Strategic Maturity',
      text: 'Where is your PMO on the maturity curve?',
      type: 'single',
      options: [
        { text: 'Ad-hoc, project-by-project', value: 20 },
        { text: 'Standardized processes documented', value: 50 },
        { text: 'Optimizing with KPIs and dashboards', value: 70 },
        { text: 'Strategic partner, driving business outcomes', value: 100 }
      ]
    }
  ];

  // ── Quadrant Result Content ────────────────────────────────────────────
  const QUADRANT_RESULTS = {
    SPREADSHEET_NATION: {
      name: 'Spreadsheet Nation',
      tagline: 'Your PMO runs on muscle memory and manual effort.',
      accent: '#6B7280',
      bgTint: 'rgba(107, 114, 128, 0.1)',
      adoptionLabel: 'LOW',
      adoptionDesc: 'Your PMO hasn\u2019t meaningfully integrated AI into daily workflows yet.',
      valueLabel: 'LOW',
      valueDesc: 'Without adoption, there\u2019s no value pipeline to measure.',
      whatThisMeans: 'Your PMO operates primarily with traditional tools and processes. This isn\u2019t a failure \u2014 most PMOs were here 18 months ago. But the window for \u201cwait and see\u201d is closing. Organisations that delay AI adoption risk falling behind on delivery speed, reporting quality, and stakeholder expectations.\n\nThe risk isn\u2019t that AI will replace your PMO. It\u2019s that a PMO using AI will outperform yours.',
      nextSteps: [
        'Pick one pain point, not a strategy. Don\u2019t start with an AI roadmap. Start with the task your team complains about most \u2014 status report compilation, meeting minutes, risk register updates. Solve that one thing with AI this month.',
        'Give 2\u20133 team members permission to experiment. Not training. Not governance. Just permission. Let them use ChatGPT, Copilot, or Claude on real work for 2 weeks. Document what works.',
        'Measure before and after on ONE metric. Time spent on weekly status reports. Number of manual data consolidation steps. Pick something concrete and track the change.',
        'Read SmartPMO.ai daily. We surface AI articles specifically filtered for PMO application \u2014 so you don\u2019t have to search 8.5 million daily articles yourself. Subscribe to the weekly Top 20 newsletter to stay current without the effort.'
      ],
      target: 'Move to Prompt Whisperers within 90 days by demonstrating value on a single use case.'
    },
    CHATGPT_FAN_CLUB: {
      name: 'ChatGPT Fan Club',
      tagline: 'You\u2019ve adopted AI enthusiastically. Now prove it matters.',
      accent: '#F59E0B',
      bgTint: 'rgba(245, 158, 11, 0.1)',
      adoptionLabel: 'HIGH',
      adoptionDesc: 'Your team is actively using AI tools across multiple areas.',
      valueLabel: 'LOW',
      valueDesc: 'But you can\u2019t yet demonstrate measurable business impact.',
      whatThisMeans: 'You\u2019re in the largest group \u2014 52% of PMOs are here. Your team has embraced AI. People are using ChatGPT for emails, Copilot for documents, maybe transcription tools for meetings. The problem? It\u2019s scattered. Individual productivity gains exist but they\u2019re invisible to leadership, ungoverned, and not connected to business outcomes.\n\nThis is pilot purgatory. Lots of experiments, no scaled wins.',
      nextSteps: [
        'Audit what\u2019s actually being used. Survey your team: which AI tools, for which tasks, how often? You\u2019ll find 80% of usage concentrates on 2\u20133 use cases. Those are your candidates for scaling.',
        'Pick your best pilot and put numbers on it. Take the most promising AI use case and measure it properly. Hours saved per week. Error reduction. Cycle time improvement. Leadership doesn\u2019t care about \u201cthe team likes it\u201d \u2014 they need a number.',
        'Create a one-page AI use case register. Document every AI experiment: tool, task, outcome, owner. This is the foundation of governance without the bureaucracy. It also prevents duplicate efforts and surfaces the wins.',
        'Connect AI wins to PMO KPIs. Don\u2019t report \u201cwe use 5 AI tools.\u201d Report \u201cAI-assisted risk analysis reduced our missed-risk rate by 30%.\u201d Translate tool usage into business language.',
        'Follow SmartPMO.ai for use cases that have proven ROI. We specifically tag articles with PMO applicability so you can find what\u2019s worked for others.'
      ],
      target: 'Move to Zen PMO by proving value on 2\u20133 scaled use cases within 6 months.'
    },
    PROMPT_WHISPERERS: {
      name: 'Prompt Whisperers',
      tagline: 'Strategic and selective \u2014 now it\u2019s time to scale.',
      accent: '#06B6D4',
      bgTint: 'rgba(6, 182, 212, 0.1)',
      adoptionLabel: 'LOW',
      adoptionDesc: 'You\u2019re using AI selectively, not broadly.',
      valueLabel: 'HIGH',
      valueDesc: 'But the use cases you have chosen are delivering real results.',
      whatThisMeans: 'You\u2019re the smart money. While others spray AI across everything, your PMO picked specific high-value use cases and made them work. Leadership can see the impact. The data supports continued investment. You\u2019ve proven the model.\n\nThe risk now is complacency. You\u2019ve found 1\u20132 sweet spots, but you\u2019re leaving value on the table by not expanding adoption across the team and into adjacent processes.',
      nextSteps: [
        'Document your winning playbook. You\u2019ve cracked the code on 1\u20132 use cases. Write them up: the tool, the process change, the before/after metrics. This becomes your internal case study for expanding to the rest of the team.',
        'Identify 3 adjacent processes. If AI-assisted risk analysis works, what about AI-assisted dependency mapping? Issue categorisation? Look for processes that share characteristics with your wins \u2014 data-heavy, repetitive, time-pressured.',
        'Train the wider team on YOUR proven use cases. Don\u2019t send people on generic AI courses. Train them specifically on the tools and workflows that work in YOUR PMO context. Practical, not theoretical.',
        'Push for formal AI investment. You have the proof points. Use them to secure budget for licences, training, or dedicated AI integration time. A one-page business case with your measured ROI will do more than a 50-page strategy deck.',
        'Use SmartPMO.ai to find your next use case. We filter AI content specifically for PMO applicability \u2014 including tools and techniques you may not have considered yet.'
      ],
      target: 'Move to Zen PMO by scaling proven patterns across the full PMO within 6 months.'
    },
    ZEN_PMO: {
      name: 'Zen PMO',
      tagline: 'AI isn\u2019t a tool you use. It\u2019s how your PMO operates.',
      accent: '#8B5CF6',
      bgTint: 'rgba(139, 92, 246, 0.1)',
      adoptionLabel: 'HIGH',
      adoptionDesc: 'AI is embedded across your PMO\u2019s core processes.',
      valueLabel: 'HIGH',
      valueDesc: 'You can demonstrate measurable business impact from AI.',
      whatThisMeans: 'You\u2019re in the top 6%. AI isn\u2019t a side project in your PMO \u2014 it\u2019s woven into how you plan, execute, monitor, and report. You have governance, you have metrics, and leadership sees your PMO as a strategic partner, not a reporting function.\n\nThis doesn\u2019t mean you\u2019re done. The AI landscape shifts monthly. Today\u2019s advantage is tomorrow\u2019s baseline.',
      nextSteps: [
        'Become the internal AI centre of excellence. Your PMO has cracked what most of the organisation is still struggling with. Formalise your role: offer AI adoption guidance to other business units. This elevates the PMO from project oversight to strategic enabler.',
        'Build predictive capabilities. You\u2019ve mastered AI for efficiency (summarisation, automation, reporting). The next frontier is AI for prediction \u2014 project risk forecasting, resource demand modelling, portfolio optimisation. This is where AI transforms PMO from reactive to anticipatory.',
        'Contribute back. Share your journey. Speak at PMO forums. Write about what worked. The PMO community needs real case studies, not vendor demos. Your experience has outsized value.',
        'Stay ahead of the curve with SmartPMO.ai. We scan thousands of articles daily to find AI developments applicable to PMO work. At your maturity level, the articles tagged \u201cPMO Related\u201d and the emerging tool reviews will be most valuable.',
        'Watch for disruption. Agentic AI, autonomous project management, AI-driven portfolio rebalancing \u2014 these are coming. Your maturity means you\u2019ll be first to capitalise, but only if you\u2019re watching.'
      ],
      target: 'Maintain leadership position. Publish your AI PMO playbook. Become the reference case.'
    }
  };

  const MATURITY_LEVELS = {
    Emerging: 'Your AI efforts lack formal strategy or governance. This is common at your stage \u2014 but it means gains are fragile. One leadership change or budget cut could wipe out progress. Priority: document what you\u2019re doing and why.',
    Developing: 'You have the foundations \u2014 some strategy, some governance, some training. The gap is consistency and measurement. Priority: close the loop between AI activity and business reporting.',
    Advanced: 'Strategy, governance, and training are in place. You\u2019re operating with intention. Priority: shift from managing AI adoption to optimising AI outcomes. The infrastructure exists \u2014 now maximise throughput.'
  };

  const ADOPTION_THRESHOLD = 200;
  const VALUE_THRESHOLD = 225;

  // ── State ──────────────────────────────────────────────────────────────
  let currentQuestion = 0;
  let answers = new Array(15).fill(null);
  let started = false;

  // ── DOM references ─────────────────────────────────────────────────────
  let els = {};

  // ── Scoring ────────────────────────────────────────────────────────────
  function scoreQ3(selected) {
    if (!selected || !Array.isArray(selected)) return 0;
    const count = selected.filter(v => v !== 'none').length;
    if (count === 0) return 0;
    if (count <= 2) return 30;
    if (count <= 4) return 60;
    return 100;
  }

  function calculateScores() {
    const adoption = (answers[0] || 0) + (answers[1] || 0) + scoreQ3(answers[2]) + (answers[3] || 0) + (answers[4] || 0);
    const value = (answers[5] || 0) + (answers[6] || 0) + (answers[7] || 0) + (answers[8] || 0) + (answers[9] || 0);
    const maturity = (answers[10] || 0) + (answers[11] || 0) + (answers[12] || 0) + (answers[13] || 0) + (answers[14] || 0);
    return { adoption, value, maturity, total: adoption + value + maturity };
  }

  function determineQuadrant(adoption, value) {
    if (adoption >= ADOPTION_THRESHOLD && value >= VALUE_THRESHOLD) return 'ZEN_PMO';
    if (adoption < ADOPTION_THRESHOLD && value >= VALUE_THRESHOLD) return 'PROMPT_WHISPERERS';
    if (adoption >= ADOPTION_THRESHOLD && value < VALUE_THRESHOLD) return 'CHATGPT_FAN_CLUB';
    return 'SPREADSHEET_NATION';
  }

  function determineMaturity(maturityScore) {
    if (maturityScore <= 166) return 'Emerging';
    if (maturityScore <= 333) return 'Developing';
    return 'Advanced';
  }

  function determineScoreLabel(total) {
    if (total <= 375) return 'Early Explorer';
    if (total <= 750) return 'Active Experimenter';
    if (total <= 1125) return 'Strategic Adopter';
    return 'AI-Native PMO';
  }

  // ── Rendering ──────────────────────────────────────────────────────────
  function updateProgress() {
    const q = QUESTIONS[currentQuestion];
    const pct = ((currentQuestion + 1) / 15 * 100).toFixed(0);
    els.progressSection.textContent = 'Section ' + q.section + ' of 3: ' + q.sectionName;
    els.progressCount.textContent = 'Question ' + (currentQuestion + 1) + ' of 15';
    els.progressFill.style.width = pct + '%';
  }

  function renderQuestion(index) {
    const q = QUESTIONS[index];
    const container = els.questionContainer;

    let html = '<div class="assess-question">';
    html += '<div class="assess-question-text">Q' + q.id + '. ' + q.text + '</div>';
    html += '<div class="assess-options">';

    if (q.type === 'multi') {
      q.options.forEach((opt, i) => {
        const isSelected = Array.isArray(answers[index]) && answers[index].includes(opt.value);
        html += '<div class="assess-option assess-option--multi' + (isSelected ? ' is-selected' : '') + '" data-value="' + opt.value + '" data-index="' + i + '" tabindex="0" role="checkbox" aria-checked="' + isSelected + '">';
        html += '<div class="assess-option-checkbox">' + (isSelected ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>' : '') + '</div>';
        html += '<div class="assess-option-text">' + opt.text + '</div>';
        html += '</div>';
      });
    } else {
      q.options.forEach((opt, i) => {
        const isSelected = answers[index] === opt.value;
        html += '<div class="assess-option' + (isSelected ? ' is-selected' : '') + '" data-value="' + opt.value + '" data-index="' + i + '" tabindex="0" role="radio" aria-checked="' + isSelected + '">';
        html += '<div class="assess-option-radio">' + (isSelected ? '<div class="assess-option-radio-dot"></div>' : '') + '</div>';
        html += '<div class="assess-option-text">' + opt.text + '</div>';
        html += '</div>';
      });
    }

    html += '</div></div>';
    container.innerHTML = html;

    // Update nav buttons
    els.backBtn.style.display = index === 0 ? 'none' : '';
    if (q.type === 'multi') {
      els.nextBtn.style.display = '';
      els.nextBtn.textContent = index === 14 ? 'Complete Assessment \u2192' : 'Next \u2192';
      els.nextBtn.disabled = !Array.isArray(answers[index]) || answers[index].length === 0;
    } else {
      els.nextBtn.style.display = index === 14 ? '' : 'none';
      if (index === 14) {
        els.nextBtn.textContent = 'Complete Assessment \u2192';
        els.nextBtn.disabled = answers[index] === null;
      }
    }

    updateProgress();
  }

  function selectSingleOption(questionIndex, value) {
    answers[questionIndex] = value;
    renderQuestion(questionIndex);

    // Auto-advance after 400ms for single-select (except last question)
    if (questionIndex < 14) {
      setTimeout(() => {
        if (currentQuestion === questionIndex) {
          nextQuestion();
        }
      }, 400);
    }
  }

  function toggleMultiOption(questionIndex, value) {
    if (!Array.isArray(answers[questionIndex])) {
      answers[questionIndex] = [];
    }
    const arr = answers[questionIndex];

    if (value === 'none') {
      // "None yet" is exclusive
      answers[questionIndex] = arr.includes('none') ? [] : ['none'];
    } else {
      // Remove 'none' if selecting something else
      const filtered = arr.filter(v => v !== 'none');
      if (filtered.includes(value)) {
        answers[questionIndex] = filtered.filter(v => v !== value);
      } else {
        filtered.push(value);
        answers[questionIndex] = filtered;
      }
    }
    renderQuestion(questionIndex);
  }

  function nextQuestion() {
    if (currentQuestion < 14) {
      currentQuestion++;
      renderQuestion(currentQuestion);
      els.questionContainer.focus();
    } else {
      showResults();
    }
  }

  function prevQuestion() {
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuestion(currentQuestion);
    }
  }

  // ── Results ────────────────────────────────────────────────────────────
  function showResults() {
    const scores = calculateScores();
    const quadrantKey = determineQuadrant(scores.adoption, scores.value);
    const maturityLevel = determineMaturity(scores.maturity);
    const scoreLabel = determineScoreLabel(scores.total);
    const qr = QUADRANT_RESULTS[quadrantKey];

    // Fill progress bar to 100%
    els.progressFill.style.width = '100%';
    els.progressCount.textContent = 'Complete!';

    setTimeout(() => {
      // Hide assessment UI
      els.progress.style.display = 'none';
      els.questionContainer.style.display = 'none';
      els.nav.style.display = 'none';

      // Build and show results
      els.result.innerHTML = buildResultHTML(quadrantKey, scores, maturityLevel, scoreLabel);
      els.result.style.display = 'block';

      // Scroll to top of results
      els.result.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Track completion
      if (window.gtag) {
        window.gtag('event', 'assessment_complete', {
          event_category: 'engagement',
          event_label: quadrantKey,
          value: scores.total
        });
      }
    }, 300);
  }

  function buildResultHTML(quadrantKey, scores, maturityLevel, scoreLabel) {
    const qr = QUADRANT_RESULTS[quadrantKey];
    const adoptionHigh = scores.adoption >= ADOPTION_THRESHOLD;
    const valueHigh = scores.value >= VALUE_THRESHOLD;

    let html = '';

    // 1. Quadrant announcement
    html += '<div class="assess-result-quadrant" style="border-color:' + qr.accent + '; background:' + qr.bgTint + '">';
    html += '<div class="assess-result-label">Your PMO is in:</div>';
    html += '<h2 class="assess-result-name" style="color:' + qr.accent + '">' + qr.name + '</h2>';
    html += '<p class="assess-result-tagline">\u201c' + qr.tagline + '\u201d</p>';
    html += '</div>';

    // 2. Score summary
    html += '<div class="assess-result-scores">';
    html += buildScoreColumn('AI Adoption', scores.adoption, 500, adoptionHigh ? 'HIGH' : 'LOW', qr.accent);
    html += buildScoreColumn('Value Delivered', scores.value, 500, valueHigh ? 'HIGH' : 'LOW', qr.accent);
    html += buildScoreColumn('Strategic Maturity', scores.maturity, 500, maturityLevel, qr.accent);
    html += '</div>';
    html += '<div class="assess-result-total">Total: ' + scores.total + ' / 1500 \u2014 ' + scoreLabel + '</div>';

    // 3. Mini quadrant grid
    html += buildMiniGrid(quadrantKey);

    // 4. What This Means
    html += '<div class="assess-result-meaning">';
    html += '<h3 class="assess-result-heading">What This Means</h3>';
    const paras = qr.whatThisMeans.split('\n\n');
    paras.forEach(p => { html += '<p>' + p + '</p>'; });
    html += '</div>';

    // 5. Your Next Steps
    html += '<div class="assess-result-steps">';
    html += '<h3 class="assess-result-heading">Your Next Steps</h3>';
    html += '<ol class="assess-result-steps-list">';
    qr.nextSteps.forEach(step => {
      // Bold the first sentence (up to first period)
      const dotIdx = step.indexOf('.');
      if (dotIdx > 0 && dotIdx < 80) {
        html += '<li><strong>' + step.substring(0, dotIdx + 1) + '</strong>' + step.substring(dotIdx + 1) + '</li>';
      } else {
        html += '<li>' + step + '</li>';
      }
    });
    html += '</ol>';
    html += '<p class="assess-result-target"><strong>Target:</strong> ' + qr.target + '</p>';
    html += '</div>';

    // 6. Strategic Maturity
    html += '<div class="assess-result-maturity">';
    html += '<h3 class="assess-result-heading">Strategic Maturity \u2014 ' + maturityLevel + '</h3>';
    html += '<p>' + MATURITY_LEVELS[maturityLevel] + '</p>';
    html += '</div>';

    // 7. Action buttons
    html += '<div class="assess-result-actions">';
    html += '<button class="assess-action-btn assess-action-copy" id="assessCopyBtn" aria-label="Copy results to clipboard">';
    html += '<span>Copy Full Results</span></button>';
    html += '<button class="assess-action-btn assess-action-email" id="assessEmailBtn" aria-label="Email results to yourself">';
    html += '<span>Email Results to Myself</span></button>';
    html += '</div>';

    // 8. Navigation
    html += '<div class="assess-result-nav">';
    html += '<a href="/" class="assess-nav-link">\u2190 Back to SmartPMO.ai</a>';
    html += '<button class="assess-nav-link assess-retake-btn" id="assessRetakeBtn">Retake Assessment</button>';
    html += '</div>';

    return html;
  }

  function buildScoreColumn(label, score, max, levelLabel, accent) {
    const pct = (score / max * 100).toFixed(0);
    let html = '<div class="assess-score-col">';
    html += '<div class="assess-score-label">' + label + '</div>';
    html += '<div class="assess-score-value">' + score + ' / ' + max + '</div>';
    html += '<div class="assess-score-bar"><div class="assess-score-bar-fill" style="width:' + pct + '%;background:' + accent + '"></div></div>';
    html += '<div class="assess-score-level">' + levelLabel + '</div>';
    html += '</div>';
    return html;
  }

  function buildMiniGrid(activeQuadrant) {
    const quads = [
      { key: 'PROMPT_WHISPERERS', label: 'Prompt\nWhisperers', pct: '28%', color: '#06B6D4' },
      { key: 'ZEN_PMO', label: 'Zen PMO', pct: '6%', color: '#8B5CF6' },
      { key: 'SPREADSHEET_NATION', label: 'Spreadsheet\nNation', pct: '10%', color: '#6B7280' },
      { key: 'CHATGPT_FAN_CLUB', label: 'ChatGPT\nFan Club', pct: '52%', color: '#F59E0B' }
    ];

    let html = '<div class="assess-result-grid">';
    html += '<div class="assess-mini-grid">';
    quads.forEach(q => {
      const isActive = q.key === activeQuadrant;
      html += '<div class="assess-mini-quad' + (isActive ? ' is-active' : '') + '" style="' + (isActive ? 'border-color:' + q.color + ';box-shadow:0 0 12px ' + q.color : '') + '">';
      html += '<div class="assess-mini-name">' + q.label.replace('\n', '<br>') + '</div>';
      html += '<div class="assess-mini-pct">' + q.pct + '</div>';
      html += '</div>';
    });
    html += '</div>';
    html += '<div class="assess-mini-axes">';
    html += '<span class="assess-mini-x">AI ADOPTION \u2192</span>';
    html += '<span class="assess-mini-y">\u2191 VALUE</span>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  // ── Plain Text Builder ─────────────────────────────────────────────────
  function buildPlainText() {
    const scores = calculateScores();
    const quadrantKey = determineQuadrant(scores.adoption, scores.value);
    const maturityLevel = determineMaturity(scores.maturity);
    const scoreLabel = determineScoreLabel(scores.total);
    const qr = QUADRANT_RESULTS[quadrantKey];
    const adoptionHigh = scores.adoption >= ADOPTION_THRESHOLD;
    const valueHigh = scores.value >= VALUE_THRESHOLD;

    let text = 'HOW SMART IS YOUR PMO AT AI?\n';
    text += 'Assessment Results \u2014 SmartPMO.ai\n\n';
    text += 'YOUR QUADRANT: ' + qr.name + '\n';
    text += '\u201c' + qr.tagline + '\u201d\n\n';
    text += 'SCORES:\n';
    text += '- AI Adoption: ' + scores.adoption + '/500 (' + (adoptionHigh ? 'HIGH' : 'LOW') + ')\n';
    text += '- Value Delivered: ' + scores.value + '/500 (' + (valueHigh ? 'HIGH' : 'LOW') + ')\n';
    text += '- Strategic Maturity: ' + scores.maturity + '/500 (' + maturityLevel + ')\n';
    text += '- Total: ' + scores.total + '/1500 \u2014 ' + scoreLabel + '\n\n';
    text += 'WHAT THIS MEANS:\n' + qr.whatThisMeans + '\n\n';
    text += 'YOUR NEXT STEPS:\n';
    qr.nextSteps.forEach((step, i) => { text += (i + 1) + '. ' + step + '\n'; });
    text += '\nSTRATEGIC MATURITY \u2014 ' + maturityLevel.toUpperCase() + ':\n';
    text += MATURITY_LEVELS[maturityLevel] + '\n\n';
    text += '---\nTake the assessment: https://smartpmo.ai/assessment\n';
    text += 'AI insights for PMO practitioners: https://smartpmo.ai\n';
    return text;
  }

  function copyResults() {
    const text = buildPlainText();
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('assessCopyBtn');
      const orig = btn.innerHTML;
      btn.innerHTML = '<span>Copied \u2713</span>';
      setTimeout(() => { btn.innerHTML = orig; }, 2000);
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      const btn = document.getElementById('assessCopyBtn');
      const orig = btn.innerHTML;
      btn.innerHTML = '<span>Copied \u2713</span>';
      setTimeout(() => { btn.innerHTML = orig; }, 2000);
    });

    if (window.gtag) {
      window.gtag('event', 'assessment_share', { event_category: 'engagement', event_label: 'copy' });
    }
  }

  function emailResults() {
    const text = buildPlainText();
    const subject = encodeURIComponent('My PMO AI Assessment Results \u2014 SmartPMO.ai');
    const body = encodeURIComponent(text);
    window.location.href = 'mailto:?subject=' + subject + '&body=' + body;

    if (window.gtag) {
      window.gtag('event', 'assessment_share', { event_category: 'engagement', event_label: 'email' });
    }
  }

  function retake() {
    currentQuestion = 0;
    answers = new Array(15).fill(null);
    started = false;

    els.result.style.display = 'none';
    els.result.innerHTML = '';
    els.intro.style.display = '';
    els.progress.style.display = 'none';
    els.questionContainer.style.display = 'none';
    els.nav.style.display = 'none';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function start() {
    started = true;
    els.intro.style.display = 'none';
    els.progress.style.display = '';
    els.questionContainer.style.display = '';
    els.nav.style.display = '';
    renderQuestion(0);

    if (window.gtag) {
      window.gtag('event', 'assessment_start', { event_category: 'engagement' });
    }
  }

  // ── Event Handling ─────────────────────────────────────────────────────
  function handleOptionClick(e) {
    const option = e.target.closest('.assess-option');
    if (!option) return;

    const q = QUESTIONS[currentQuestion];
    const value = option.dataset.value;

    if (q.type === 'multi') {
      toggleMultiOption(currentQuestion, value);
    } else {
      const numVal = parseInt(value, 10);
      selectSingleOption(currentQuestion, isNaN(numVal) ? value : numVal);
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const option = e.target.closest('.assess-option');
      if (option) {
        e.preventDefault();
        option.click();
      }
    }
    if (e.key === 'ArrowRight') nextQuestion();
    if (e.key === 'ArrowLeft') prevQuestion();
  }

  function handleResultClick(e) {
    const copyBtn = e.target.closest('#assessCopyBtn');
    if (copyBtn) { copyResults(); return; }
    const emailBtn = e.target.closest('#assessEmailBtn');
    if (emailBtn) { emailResults(); return; }
    const retakeBtn = e.target.closest('#assessRetakeBtn');
    if (retakeBtn) { retake(); return; }
  }

  // ── Public API ─────────────────────────────────────────────────────────
  function init() {
    const page = document.querySelector('.assess-page');
    if (!page) return;

    els = {
      intro: document.getElementById('assessIntro'),
      progress: document.getElementById('assessProgress'),
      progressSection: document.getElementById('assessProgressSection'),
      progressCount: document.getElementById('assessProgressCount'),
      progressFill: document.getElementById('assessProgressFill'),
      questionContainer: document.getElementById('assessQuestionContainer'),
      nav: document.getElementById('assessNav'),
      backBtn: document.getElementById('assessBackBtn'),
      nextBtn: document.getElementById('assessNextBtn'),
      result: document.getElementById('assessResult')
    };

    // Start button
    const startBtn = document.getElementById('assessStartBtn');
    if (startBtn) startBtn.addEventListener('click', start);

    // Navigation
    if (els.backBtn) els.backBtn.addEventListener('click', prevQuestion);
    if (els.nextBtn) els.nextBtn.addEventListener('click', nextQuestion);

    // Option clicks via delegation
    if (els.questionContainer) {
      els.questionContainer.addEventListener('click', handleOptionClick);
      els.questionContainer.addEventListener('keydown', handleKeydown);
    }

    // Result actions via delegation
    if (els.result) {
      els.result.addEventListener('click', handleResultClick);
    }

    // Keyboard nav
    document.addEventListener('keydown', (e) => {
      if (!started) return;
      if (e.key === 'ArrowRight' && !e.target.closest('.assess-option')) nextQuestion();
      if (e.key === 'ArrowLeft' && !e.target.closest('.assess-option')) prevQuestion();
    });
  }

  function destroy() {
    els = {};
  }

  return { init, destroy };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AssessmentPageModule.init());
} else {
  AssessmentPageModule.init();
}
