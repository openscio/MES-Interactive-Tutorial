/* ============================================
   MES Interactive Tutorial - Quiz Module
   ============================================ */

'use strict';

// ============================================
// Quiz State
// ============================================
var quizState = {
  moduleId: '',
  concepts: [],
  currentIndex: 0,
  isReinforcement: false,
  reinforcementIndex: 0,
  results: [],
  answered: false
};

// ============================================
// Module lookup cache (built on first use)
// ============================================
var _knowledgeMap = null;

function getKnowledgeMap() {
  if (_knowledgeMap) return _knowledgeMap;
  if (typeof KNOWLEDGE_DATA !== 'undefined') {
    _knowledgeMap = {};
    for (var i = 0; i < KNOWLEDGE_DATA.length; i++) {
      _knowledgeMap[KNOWLEDGE_DATA[i].id] = KNOWLEDGE_DATA[i];
    }
  }
  return _knowledgeMap || {};
}

function getModuleTitle(moduleId) {
  var mod = getKnowledgeMap()[moduleId];
  return mod ? mod.icon + ' ' + mod.title : moduleId;
}

function getModuleIcon(moduleId) {
  var mod = getKnowledgeMap()[moduleId];
  return mod ? mod.icon : '📝';
}

// ============================================
// Entry Points
// ============================================

/**
 * Initialize the Quiz page.
 * Called by app.js onPageEnter('quiz').
 * @param {string} [moduleId] - Optional module ID to start quiz directly
 */
function initQuizPage(moduleId) {
  var container = document.getElementById('page-quiz');
  if (!container) return;

  if (moduleId && QUIZ_DATA[moduleId]) {
    startQuiz(moduleId);
  } else {
    renderModuleSelection(container);
  }
}

/**
 * Start quiz for a specific module (called from knowledge page)
 * @param {string} moduleId - The module ID
 */
function startQuizForModule(moduleId) {
  if (moduleId && QUIZ_DATA[moduleId]) {
    startQuiz(moduleId);
  }
}

// ============================================
// Module Selection Page
// ============================================

/**
 * Render the module selection page
 * @param {HTMLElement} container - The page container
 */
function renderModuleSelection(container) {
  var html = '<div class="quiz-container" style="max-width: 900px;">';
  html += '<div style="text-align: center; margin-bottom: 24px;">';
  html += '<h3 style="color: var(--primary); margin-bottom: 8px;">选择测验模块</h3>';
  html += '<p style="color: var(--text-light);">选择一个模块开始自适应测验，系统会根据你的回答智能出题</p>';
  html += '</div>';

  html += '<div class="module-cards">';

  if (typeof KNOWLEDGE_DATA !== 'undefined') {
    for (var i = 0; i < KNOWLEDGE_DATA.length; i++) {
      var mod = KNOWLEDGE_DATA[i];
      var concepts = QUIZ_DATA[mod.id];
      var conceptCount = concepts ? concepts.length : 0;

      // Load previous results
      var prevResults = loadFromStorage('mes_quiz_results', {});
      var prevResult = prevResults[mod.id];
      var badgeHtml = '';
      if (prevResult) {
        badgeHtml = '<div class="card-badge">' + prevResult.score + '%</div>';
      }

      html += '<div class="module-card" data-quiz-module="' + mod.id + '" style="padding: 20px;">';
      html += badgeHtml;
      html += '<div class="card-icon" style="font-size: 2rem;">' + mod.icon + '</div>';
      html += '<h3 style="font-size: 1.1rem;">' + mod.title + '</h3>';
      html += '<p style="font-size: 0.85rem;">' + conceptCount + ' 个知识点</p>';
      html += '</div>';
    }
  }

  html += '</div>'; // .module-cards
  html += '</div>'; // .quiz-container

  container.innerHTML = html;

  // Bind click events
  var cards = container.querySelectorAll('[data-quiz-module]');
  for (var j = 0; j < cards.length; j++) {
    cards[j].addEventListener('click', function() {
      var mid = this.getAttribute('data-quiz-module');
      startQuiz(mid);
    });
  }
}

// ============================================
// Quiz Engine
// ============================================

/**
 * Start a quiz for a given module
 * @param {string} moduleId - The module ID
 */
function startQuiz(moduleId) {
  var concepts = QUIZ_DATA[moduleId];
  if (!concepts || concepts.length === 0) return;

  // Reset state
  quizState.moduleId = moduleId;
  quizState.concepts = concepts;
  quizState.currentIndex = 0;
  quizState.isReinforcement = false;
  quizState.reinforcementIndex = 0;
  quizState.results = [];
  quizState.answered = false;

  renderCurrentQuestion();
}

/**
 * Get the current question based on quiz state
 * @returns {Object} The current question object
 */
function getCurrentQuestion() {
  var concept = quizState.concepts[quizState.currentIndex];
  if (quizState.isReinforcement) {
    var rIdx = quizState.reinforcementIndex;
    if (concept.reinforcement && concept.reinforcement.length > rIdx) {
      return concept.reinforcement[rIdx];
    }
    return concept.primary; // fallback
  }
  return concept.primary;
}

/**
 * Render the current question
 */
function renderCurrentQuestion() {
  var container = document.getElementById('page-quiz');
  if (!container) return;

  var concept = quizState.concepts[quizState.currentIndex];
  var question = getCurrentQuestion();
  var totalConcepts = quizState.concepts.length;
  var progress = Math.round((quizState.currentIndex / totalConcepts) * 100);
  var letters = ['A', 'B', 'C', 'D'];

  var html = '<div class="quiz-container">';

  // Progress bar
  html += '<div class="quiz-progress">';
  html += '<div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:' + progress + '%"></div></div>';
  html += '<span class="quiz-progress-text">' + (quizState.currentIndex + 1) + ' / ' + totalConcepts + '</span>';
  html += '</div>';

  // Concept tag
  html += '<div class="quiz-concept-tag">';
  if (quizState.isReinforcement) {
    html += '🔄 补强题 — ';
  }
  html += concept.conceptName;
  html += '</div>';

  // Quiz card
  html += '<div class="quiz-card">';

  // Question
  html += '<div class="quiz-question">' + question.question + '</div>';

  // Options
  html += '<div class="quiz-options">';
  for (var i = 0; i < question.options.length; i++) {
    html += '<div class="quiz-option" data-option-index="' + i + '">';
    html += '<span class="option-letter">' + letters[i] + '</span>';
    html += '<span>' + question.options[i] + '</span>';
    html += '</div>';
  }
  html += '</div>'; // .quiz-options

  // Feedback area (hidden initially)
  html += '<div class="quiz-feedback" id="quizFeedback"></div>';

  // Next button (hidden initially)
  html += '<button class="quiz-next-btn" id="quizNextBtn" style="display:none;">下一题 →</button>';

  html += '</div>'; // .quiz-card
  html += '</div>'; // .quiz-container

  container.innerHTML = html;

  // Bind next button
  var nextBtnEl = container.querySelector('#quizNextBtn');
  if (nextBtnEl) nextBtnEl.addEventListener('click', handleNextQuestion);

  // Bind option click events
  var options = container.querySelectorAll('.quiz-option');
  for (var j = 0; j < options.length; j++) {
    options[j].addEventListener('click', function() {
      if (quizState.answered) return;
      var selectedIdx = parseInt(this.getAttribute('data-option-index'), 10);
      handleAnswer(selectedIdx);
    });
  }
}

/**
 * Handle user's answer selection
 * @param {number} selectedIndex - The index of the selected option
 */
function handleAnswer(selectedIndex) {
  if (quizState.answered) return;
  quizState.answered = true;

  var question = getCurrentQuestion();
  var correctIndex = question.answer;
  var isCorrect = (selectedIndex === correctIndex);

  // Update option styles
  var options = document.querySelectorAll('#page-quiz .quiz-option');
  for (var i = 0; i < options.length; i++) {
    options[i].classList.add('disabled');
    if (i === correctIndex) {
      options[i].classList.add('correct');
    }
    if (i === selectedIndex && !isCorrect) {
      options[i].classList.add('wrong');
    }
    if (i === selectedIndex) {
      options[i].classList.add('selected');
    }
  }

  // Show feedback
  var feedback = document.getElementById('quizFeedback');
  if (feedback) {
    var concept = quizState.concepts[quizState.currentIndex];

    if (isCorrect) {
      feedback.className = 'quiz-feedback show correct';
      feedback.innerHTML = '<span class="feedback-icon">✅</span><strong>回答正确！</strong>' +
        '<div class="feedback-text" style="margin-top: 8px;">' + question.explanation + '</div>';

      // Record result
      if (!quizState.isReinforcement) {
        // Primary correct → passed
        quizState.results.push({
          conceptId: concept.conceptId,
          conceptName: concept.conceptName,
          status: 'passed'
        });
      } else {
        // Reinforcement correct → reinforced
        quizState.results.push({
          conceptId: concept.conceptId,
          conceptName: concept.conceptName,
          status: 'reinforced'
        });
      }
    } else {
      feedback.className = 'quiz-feedback show wrong';
      var feedbackHtml = '<span class="feedback-icon">❌</span><strong>回答错误</strong>' +
        '<div class="feedback-text" style="margin-top: 8px;">' + question.explanation + '</div>';

      if (!quizState.isReinforcement) {
        // Primary wrong → will show reinforcement next
        feedbackHtml += '<div class="reinforcement-notice">💡 接下来将出一道补强题，帮助你巩固这个知识点</div>';
      } else {
        // Reinforcement wrong → failed
        quizState.results.push({
          conceptId: concept.conceptId,
          conceptName: concept.conceptName,
          status: 'failed'
        });
      }

      feedback.innerHTML = feedbackHtml;
    }
  }

  // Show next button
  var nextBtn = document.getElementById('quizNextBtn');
  if (nextBtn) {
    // Check if this is the last question
    var isLastConcept = (quizState.currentIndex >= quizState.concepts.length - 1);
    var willShowReinforcement = (!isCorrect && !quizState.isReinforcement);

    if (isLastConcept && !willShowReinforcement) {
      nextBtn.textContent = '查看结果 📊';
    } else {
      nextBtn.textContent = '下一题 →';
    }
    nextBtn.style.display = 'inline-flex';
  }
}

/**
 * Handle clicking the "Next" button
 */
function handleNextQuestion() {
  var question = getCurrentQuestion();
  var concept = quizState.concepts[quizState.currentIndex];

  // Determine what happened with the last answer
  var lastResult = null;
  if (quizState.results.length > 0) {
    lastResult = quizState.results[quizState.results.length - 1];
  }

  // Check if we need to show reinforcement
  var lastResultForConcept = null;
  for (var r = 0; r < quizState.results.length; r++) {
    if (quizState.results[r].conceptId === concept.conceptId) {
      lastResultForConcept = quizState.results[r];
    }
  }

  if (!quizState.isReinforcement && !lastResultForConcept) {
    // Primary was answered wrong (no result recorded yet for this concept)
    // Show reinforcement question
    quizState.isReinforcement = true;
    quizState.reinforcementIndex = 0;
    quizState.answered = false;
    renderCurrentQuestion();
    return;
  }

  // Move to next concept
  quizState.currentIndex++;
  quizState.isReinforcement = false;
  quizState.reinforcementIndex = 0;
  quizState.answered = false;

  if (quizState.currentIndex >= quizState.concepts.length) {
    // All concepts done, show results
    renderQuizResults();
  } else {
    renderCurrentQuestion();
  }
}

// ============================================
// Results Page
// ============================================

/**
 * Render the quiz results page
 */
function renderQuizResults() {
  var container = document.getElementById('page-quiz');
  if (!container) return;

  var results = quizState.results;
  var totalConcepts = results.length;
  var passedCount = 0;
  var reinforcedCount = 0;
  var failedCount = 0;

  for (var i = 0; i < results.length; i++) {
    if (results[i].status === 'passed') passedCount++;
    else if (results[i].status === 'reinforced') reinforcedCount++;
    else if (results[i].status === 'failed') failedCount++;
  }

  var score = totalConcepts > 0 ? Math.round((passedCount / totalConcepts) * 100) : 0;

  // Save results to storage
  var allResults = loadFromStorage('mes_quiz_results', {});
  allResults[quizState.moduleId] = {
    score: score,
    passed: passedCount,
    reinforced: reinforcedCount,
    failed: failedCount,
    total: totalConcepts,
    details: results,
    timestamp: new Date().toISOString()
  };
  saveToStorage('mes_quiz_results', allResults);

  // Also mark module as learned
  var learnedModules = loadFromStorage('mes_learned_modules', []);
  if (learnedModules.indexOf(quizState.moduleId) === -1) {
    learnedModules.push(quizState.moduleId);
    saveToStorage('mes_learned_modules', learnedModules);
  }

  // Determine score circle color
  var circleColor = 'var(--primary)';
  if (score >= 80) circleColor = 'var(--success)';
  else if (score >= 50) circleColor = 'var(--warning)';
  else circleColor = 'var(--danger)';

  var moduleTitle = getModuleTitle(quizState.moduleId);

  var html = '<div class="quiz-container">';
  html += '<div class="quiz-card quiz-results">';

  // Title
  html += '<h3 style="color: var(--primary); margin-bottom: 20px; border-bottom: 2px solid var(--accent); padding-bottom: 12px;">📊 测验结果 — ' + moduleTitle + '</h3>';

  // Score circle
  html += '<div class="score-circle" style="background: ' + circleColor + ';">';
  html += score + '%';
  html += '<small>正确率</small>';
  html += '</div>';

  // Summary stats
  html += '<div style="display: flex; justify-content: center; gap: 24px; margin: 16px 0;">';
  html += '<div style="text-align: center;"><strong style="color: var(--success); font-size: 1.3rem;">' + passedCount + '</strong><br><span style="font-size: 0.8rem; color: var(--text-muted);">✅ 一次通过</span></div>';
  html += '<div style="text-align: center;"><strong style="color: var(--warning); font-size: 1.3rem;">' + reinforcedCount + '</strong><br><span style="font-size: 0.8rem; color: var(--text-muted);">⚠️ 补强通过</span></div>';
  html += '<div style="text-align: center;"><strong style="color: var(--danger); font-size: 1.3rem;">' + failedCount + '</strong><br><span style="font-size: 0.8rem; color: var(--text-muted);">❌ 需复习</span></div>';
  html += '</div>';

  // Concept mastery list
  html += '<div class="concept-mastery-list">';
  html += '<h4 style="color: var(--primary-light); margin-bottom: 12px;">知识点掌握度</h4>';

  for (var j = 0; j < results.length; j++) {
    var r = results[j];
    var icon = '✅';
    var statusText = '一次通过';
    var statusClass = 'passed';

    if (r.status === 'reinforced') {
      icon = '⚠️';
      statusText = '补强通过';
      statusClass = 'reinforced';
    } else if (r.status === 'failed') {
      icon = '❌';
      statusText = '需复习';
      statusClass = 'failed';
    }

    html += '<div class="mastery-item">';
    html += '<span class="mastery-icon">' + icon + '</span>';
    html += '<span class="mastery-name">' + r.conceptName + '</span>';
    html += '<span class="mastery-status ' + statusClass + '">' + statusText + '</span>';
    html += '</div>';
  }

  html += '</div>'; // .concept-mastery-list

  // Action buttons
  html += '<div style="display: flex; gap: 12px; justify-content: center; margin-top: 24px; flex-wrap: wrap;">';
  html += '<button class="btn btn-primary" id="quizRetryBtn">🔄 重新测验</button>';
  html += '<button class="btn btn-outline" id="quizBackBtn">📚 返回知识学习</button>';
  html += '</div>';

  html += '</div>'; // .quiz-card
  html += '</div>'; // .quiz-container

  container.innerHTML = html;

  // Bind result action buttons after HTML is set
  var savedModuleId = quizState.moduleId;
  var retryBtn = container.querySelector('#quizRetryBtn');
  var backBtn = container.querySelector('#quizBackBtn');
  if (retryBtn) retryBtn.addEventListener('click', function() { startQuiz(savedModuleId); });
  if (backBtn) backBtn.addEventListener('click', function() { navigateTo('knowledge'); });
}
