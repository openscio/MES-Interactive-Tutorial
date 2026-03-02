/* ============================================
   MES Interactive Tutorial - Lot Simulator
   with Scenario Mode (Special Cases)
   ============================================ */

'use strict';

// ============================================
// Simulator State
// ============================================
var SimState = {
  lot: null,
  visitedStates: [],
  initialized: false,
  mode: 'free',          // 'free' | 'scenario'
  scenario: {
    active: null,         // current scenario object
    currentStep: 0,
    completed: false,
    stepResults: [],      // { stepId, correct, attempts }
    attempts: 0,          // attempts for current step
    feedbackMsg: '',
    feedbackType: '',     // 'success' | 'error' | ''
    hintVisible: false,
    narrativeCollapsed: false
  }
};

// ============================================
// Deep clone helper
// ============================================
function cloneLot(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// ============================================
// Get state display info
// ============================================
function getStateInfo(stateId) {
  var keys = Object.keys(LOT_STATES);
  for (var i = 0; i < keys.length; i++) {
    if (LOT_STATES[keys[i]].id === stateId) {
      return LOT_STATES[keys[i]];
    }
  }
  return { id: stateId, name: stateId, color: '#999' };
}

// ============================================
// Get current operation info
// ============================================
function getCurrentOp() {
  if (!SimState.lot) return null;
  var idx = SimState.lot.currentOpIndex;
  if (idx >= 0 && idx < SAMPLE_PROCESS_FLOW.operations.length) {
    return SAMPLE_PROCESS_FLOW.operations[idx];
  }
  return null;
}

// ============================================
// Scenario completion tracking (localStorage)
// ============================================
function getScenarioProgress() {
  return loadFromStorage('scenario-progress', {});
}

function saveScenarioCompletion(scenarioId) {
  var progress = getScenarioProgress();
  progress[scenarioId] = {
    completed: true,
    timestamp: new Date().toISOString()
  };
  saveToStorage('scenario-progress', progress);
}

// ============================================
// Initialize Simulator Page
// ============================================
function initSimulatorPage() {
  var container = getEl('page-simulator');
  if (!container) return;

  if (!SimState.initialized) {
    SimState.lot = cloneLot(INITIAL_LOT);
    SimState.visitedStates = ['created'];
    SimState.initialized = true;
  }

  renderSimulatorLayout(container);
  updateSimulatorUI();
}

// ============================================
// Render the full simulator layout
// ============================================
function renderSimulatorLayout(container) {
  var html = '';
  html += '<div class="simulator-layout">';

  // Mode Toggle Bar
  html += '<div class="simulator-mode-toggle">';
  html += '<button class="mode-toggle-btn' + (SimState.mode === 'free' ? ' active' : '') + '" onclick="switchSimulatorMode(\'free\')">';
  html += '\uD83D\uDD27 \u81EA\u7531\u6A21\u5F0F</button>';
  html += '<button class="mode-toggle-btn' + (SimState.mode === 'scenario' ? ' active' : '') + '" onclick="switchSimulatorMode(\'scenario\')">';
  html += '\uD83C\uDFAF \u573A\u666F\u6A21\u5F0F</button>';
  html += '</div>';

  // Scenario Mode: Browser or Active Scenario
  if (SimState.mode === 'scenario') {
    if (SimState.scenario.active) {
      html += renderScenarioHeader();
      html += renderNarrativePanel();
    } else {
      html += renderScenarioBrowser();
      html += '</div>'; // close .simulator-layout
      container.innerHTML = html;
      container.dataset.initialized = 'true';
      return; // don't render simulator when browsing
    }
  }

  // 1. SVG State Diagram
  html += '<div class="svg-state-diagram" id="simStateDiagram">';
  html += '<h4 style="color:var(--primary);margin-bottom:12px;font-size:1rem;">\uD83D\uDCCA Lot \u72B6\u6001\u673A\u56FE</h4>';
  html += '<div id="svgContainer"></div>';
  html += '</div>';

  // 2. Lot Info Panel
  html += '<div class="lot-info-panel" id="simLotInfo">';
  html += '<h4 style="color:var(--primary);margin-bottom:12px;font-size:1rem;">\uD83D\uDCCB \u6279\u6B21\u4FE1\u606F</h4>';
  html += '<div class="lot-info-grid" id="lotInfoGrid"></div>';
  html += '</div>';

  // 3. Operation Progress
  html += '<div class="operation-progress" id="simOpProgress">';
  html += '<h4 style="color:var(--primary);margin-bottom:8px;font-size:1rem;">\uD83D\uDD27 \u5DE5\u5E8F\u8FDB\u5EA6 \u2014 ' + escapeHtml(SAMPLE_PROCESS_FLOW.name) + ' (Rev ' + escapeHtml(SAMPLE_PROCESS_FLOW.revision) + ')</h4>';
  html += '<div class="progress-steps" id="progressSteps"></div>';
  html += '</div>';

  // Guided Step Panel (scenario mode only)
  if (SimState.mode === 'scenario' && SimState.scenario.active) {
    html += '<div id="guidedStepContainer">';
    html += renderGuidedStepPanel();
    html += '</div>';
  }

  // 4. Bottom: Action Panel + Operation Log
  html += '<div class="simulator-bottom">';

  // Action Panel
  html += '<div class="action-panel" id="simActionPanel">';
  html += '<h4>\u26A1 \u64CD\u4F5C\u9762\u677F</h4>';
  html += '<div id="actionButtonsContainer"></div>';
  html += '</div>';

  // Operation Log
  html += '<div class="operation-log" id="simOpLog">';
  html += '<h4>\uD83D\uDCDD \u64CD\u4F5C\u65E5\u5FD7</h4>';
  html += '<div id="logEntries"><div style="color:var(--text-muted);font-size:0.85rem;padding:8px 0;">\u6682\u65E0\u64CD\u4F5C\u8BB0\u5F55</div></div>';
  html += '</div>';

  html += '</div>'; // .simulator-bottom

  // Reset / Exit buttons
  html += '<div style="text-align:center;margin-top:16px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">';
  if (SimState.mode === 'scenario' && SimState.scenario.active) {
    html += '<button class="btn btn-outline" onclick="resetScenario()">\uD83D\uDD04 \u91CD\u7F6E\u573A\u666F</button>';
    html += '<button class="btn btn-outline" onclick="exitScenario()">\u2190 \u8FD4\u56DE\u573A\u666F\u5217\u8868</button>';
  } else {
    html += '<button class="btn btn-outline" onclick="resetSimulator()">\uD83D\uDD04 \u91CD\u7F6E\u6A21\u62DF</button>';
  }
  html += '</div>';

  html += '</div>'; // .simulator-layout

  container.innerHTML = html;
  container.dataset.initialized = 'true';
}

// ============================================
// Update all UI components
// ============================================
function updateSimulatorUI() {
  renderSVGStateDiagram();
  renderLotInfo();
  renderProgressSteps();
  renderActionButtons();
  if (SimState.mode === 'scenario' && SimState.scenario.active) {
    var gsContainer = getEl('guidedStepContainer');
    if (gsContainer) {
      gsContainer.innerHTML = renderGuidedStepPanel();
    }
  }
}

// ============================================
// Mode Switching
// ============================================
function switchSimulatorMode(mode) {
  if (SimState.mode === mode) return;

  // Warn if leaving active scenario
  if (SimState.mode === 'scenario' && SimState.scenario.active && !SimState.scenario.completed) {
    if (!confirm('\u5F53\u524D\u573A\u666F\u8FDB\u884C\u4E2D\uFF0C\u786E\u5B9A\u8981\u5207\u6362\u5417\uFF1F\u573A\u666F\u8FDB\u5EA6\u5C06\u4E22\u5931\u3002')) return;
  }

  SimState.mode = mode;

  if (mode === 'free') {
    // Reset to free mode lot
    SimState.scenario.active = null;
    SimState.scenario.currentStep = 0;
    SimState.scenario.completed = false;
    SimState.scenario.stepResults = [];
    SimState.scenario.attempts = 0;
    SimState.scenario.feedbackMsg = '';
    SimState.scenario.feedbackType = '';
    SimState.scenario.hintVisible = false;
    SimState.lot = cloneLot(INITIAL_LOT);
    SimState.visitedStates = ['created'];
  }

  var container = getEl('page-simulator');
  if (container) {
    renderSimulatorLayout(container);
    updateSimulatorUI();
  }
}

// ============================================
// Scenario Browser
// ============================================
function renderScenarioBrowser() {
  var progress = getScenarioProgress();
  var html = '<div class="scenario-browser">';
  html += '<div style="text-align:center;margin-bottom:20px;">';
  html += '<h3 style="color:var(--primary);margin-bottom:8px;">\uD83C\uDFAF \u7279\u6B8A\u573A\u666F\u6848\u4F8B</h3>';
  html += '<p style="color:var(--text-light);font-size:0.9rem;">\u901A\u8FC7\u5F15\u5BFC\u5F0F\u64CD\u4F5C\uFF0C\u5B66\u4E60\u534A\u5BFC\u4F53\u5236\u9020\u4E2D\u7684\u771F\u5B9E\u751F\u4EA7\u573A\u666F</p>';
  html += '</div>';

  // Count totals
  var totalScenarios = 0;
  var completedScenarios = 0;
  for (var ci = 0; ci < SCENARIO_CATEGORIES.length; ci++) {
    var cat = SCENARIO_CATEGORIES[ci];
    for (var si = 0; si < cat.scenarios.length; si++) {
      totalScenarios++;
      if (progress[cat.scenarios[si].id]) completedScenarios++;
    }
  }
  html += '<div style="text-align:center;margin-bottom:20px;">';
  html += '<span class="tag tag-primary" style="font-size:0.85rem;padding:6px 14px;">\u5DF2\u5B8C\u6210 ' + completedScenarios + ' / ' + totalScenarios + ' \u4E2A\u573A\u666F</span>';
  html += '</div>';

  for (var i = 0; i < SCENARIO_CATEGORIES.length; i++) {
    var category = SCENARIO_CATEGORIES[i];
    html += '<div class="scenario-category-card">';
    html += '<div class="scenario-category-header" onclick="toggleScenarioCategory(' + i + ')" id="scenCatHeader' + i + '">';
    html += '<div class="cat-color" style="background:' + category.color + ';"></div>';
    html += '<span style="font-size:1.3rem;">' + category.icon + '</span>';
    html += '<div class="cat-info">';
    html += '<div class="cat-name">' + escapeHtml(category.name) + '</div>';
    html += '<div class="cat-count">' + escapeHtml(category.desc) + ' \u00B7 ' + category.scenarios.length + ' \u4E2A\u573A\u666F</div>';
    html += '</div>';
    html += '<span class="cat-toggle">\u25BC</span>';
    html += '</div>';

    html += '<div class="scenario-category-items" id="scenCatItems' + i + '">';
    for (var j = 0; j < category.scenarios.length; j++) {
      var sc = category.scenarios[j];
      var isCompleted = progress[sc.id] ? true : false;
      var difficultyClass = sc.difficulty === 'beginner' ? 'tag-success' :
                            sc.difficulty === 'intermediate' ? 'tag-warning' : 'tag-danger';
      var difficultyText = sc.difficulty === 'beginner' ? '\u5165\u95E8' :
                           sc.difficulty === 'intermediate' ? '\u4E2D\u7EA7' : '\u9AD8\u7EA7';

      html += '<div class="scenario-item">';
      html += '<div style="flex:1;">';
      html += '<div class="scenario-item-name">';
      if (isCompleted) html += '<span style="color:var(--success);margin-right:6px;">\u2713</span>';
      html += escapeHtml(sc.name);
      html += '</div>';
      html += '<div class="scenario-item-desc">' + escapeHtml(sc.desc) + '</div>';
      html += '</div>';
      html += '<span class="tag ' + difficultyClass + '" style="flex-shrink:0;">' + difficultyText + '</span>';
      html += '<button class="btn btn-sm btn-primary" onclick="startScenario(\'' + category.id + '\',\'' + sc.id + '\')" style="flex-shrink:0;">\u5F00\u59CB</button>';
      html += '</div>';
    }
    html += '</div>';
    html += '</div>';
  }

  html += '</div>';
  return html;
}

function toggleScenarioCategory(index) {
  var items = getEl('scenCatItems' + index);
  var header = getEl('scenCatHeader' + index);
  if (!items) return;
  if (items.classList.contains('show')) {
    items.classList.remove('show');
    if (header) header.classList.remove('expanded');
  } else {
    items.classList.add('show');
    if (header) header.classList.add('expanded');
  }
}

// ============================================
// Start a Scenario
// ============================================
function startScenario(categoryId, scenarioId) {
  var scenario = null;
  for (var i = 0; i < SCENARIO_CATEGORIES.length; i++) {
    if (SCENARIO_CATEGORIES[i].id === categoryId) {
      for (var j = 0; j < SCENARIO_CATEGORIES[i].scenarios.length; j++) {
        if (SCENARIO_CATEGORIES[i].scenarios[j].id === scenarioId) {
          scenario = SCENARIO_CATEGORIES[i].scenarios[j];
          break;
        }
      }
      break;
    }
  }
  if (!scenario) return;

  SimState.scenario.active = scenario;
  SimState.scenario.currentStep = 0;
  SimState.scenario.completed = false;
  SimState.scenario.stepResults = [];
  SimState.scenario.attempts = 0;
  SimState.scenario.feedbackMsg = '';
  SimState.scenario.feedbackType = '';
  SimState.scenario.hintVisible = false;
  SimState.scenario.narrativeCollapsed = false;

  // Set up lot from scenario's initial state
  SimState.lot = cloneLot(scenario.initialLot);
  SimState.visitedStates = [SimState.lot.state];

  var container = getEl('page-simulator');
  if (container) {
    renderSimulatorLayout(container);
    updateSimulatorUI();
  }

  console.log('[Scenario] Started:', scenario.name);
}

// ============================================
// Scenario Header
// ============================================
function renderScenarioHeader() {
  var sc = SimState.scenario.active;
  if (!sc) return '';
  var stepNum = SimState.scenario.completed ? sc.steps.length : (SimState.scenario.currentStep + 1);
  var totalSteps = sc.steps.length;

  var html = '<div class="scenario-header-bar">';
  html += '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">';
  html += '<span style="font-weight:700;color:var(--primary);font-size:1.05rem;">\uD83C\uDFAF ' + escapeHtml(sc.name) + '</span>';
  html += '<span class="scenario-step-progress">\u6B65\u9AA4 ' + stepNum + ' / ' + totalSteps + '</span>';
  html += '</div>';

  // Progress bar
  var pct = SimState.scenario.completed ? 100 : Math.round((SimState.scenario.currentStep / totalSteps) * 100);
  html += '<div class="scenario-progress-bar">';
  html += '<div class="scenario-progress-fill" style="width:' + pct + '%;"></div>';
  html += '</div>';
  html += '</div>';
  return html;
}

// ============================================
// Narrative Panel
// ============================================
function renderNarrativePanel() {
  var sc = SimState.scenario.active;
  if (!sc) return '';
  var collapsed = SimState.scenario.narrativeCollapsed;
  var html = '<div class="narrative-panel' + (collapsed ? ' collapsed' : '') + '">';
  html += '<div class="narrative-header" onclick="toggleNarrative()">';
  html += '<span style="font-weight:700;color:var(--primary);">\uD83D\uDCD6 ' + escapeHtml(sc.narrative.title) + '</span>';
  html += '<span class="narrative-toggle">' + (collapsed ? '\u25BC' : '\u25B2') + '</span>';
  html += '</div>';
  if (!collapsed) {
    html += '<div class="narrative-body">';
    html += '<div style="margin-bottom:10px;"><strong>\u80CC\u666F\uFF1A</strong>' + escapeHtml(sc.narrative.background) + '</div>';
    html += '<div><strong>\u76EE\u6807\uFF1A</strong>' + escapeHtml(sc.narrative.objective) + '</div>';
    html += '</div>';
  }
  html += '</div>';
  return html;
}

function toggleNarrative() {
  SimState.scenario.narrativeCollapsed = !SimState.scenario.narrativeCollapsed;
  var container = getEl('page-simulator');
  if (container) {
    renderSimulatorLayout(container);
    updateSimulatorUI();
  }
}

// ============================================
// Guided Step Panel
// ============================================
function renderGuidedStepPanel() {
  var sc = SimState.scenario.active;
  if (!sc) return '';

  // If scenario completed, show summary
  if (SimState.scenario.completed) {
    return renderScenarioSummary();
  }

  var step = sc.steps[SimState.scenario.currentStep];
  if (!step) return '';

  var isVirtualAction = step.expectedAction && step.expectedAction.charAt(0) === '_';

  var html = '<div class="guided-step-panel">';
  html += '<div class="guided-step-number">\u6B65\u9AA4 ' + step.id + '</div>';
  html += '<div class="guided-step-instruction">' + escapeHtml(step.instruction) + '</div>';

  // Virtual action button (for priority changes etc.)
  if (isVirtualAction) {
    var btnLabel = '\u2705 \u6267\u884C\u64CD\u4F5C';
    if (step.expectedAction === '_changePriority') {
      var newP = step.actionParams ? step.actionParams.newPriority : 1;
      if (newP === 0) btnLabel = '\u26A1 \u8BBE\u4E3A\u6700\u9AD8\u4F18\u5148\u7EA7 (P0)';
      else if (newP === 1) btnLabel = '\u26A1 \u63D0\u5347\u4F18\u5148\u7EA7\u4E3A P1 (Hot)';
      else btnLabel = '\u26A1 \u63D0\u5347\u4F18\u5148\u7EA7\u4E3A P' + newP;
    }
    html += '<div style="margin-top:12px;">';
    html += '<button class="btn btn-primary scenario-virtual-btn" onclick="executeVirtualAction()">' + btnLabel + '</button>';
    html += '</div>';
  }

  // Hint
  html += '<div class="guided-step-hint' + (SimState.scenario.hintVisible ? ' show' : '') + '">';
  if (SimState.scenario.hintVisible) {
    html += '<div class="hint-content">\uD83D\uDCA1 <strong>\u63D0\u793A\uFF1A</strong>' + escapeHtml(step.hint) + '</div>';
  } else {
    html += '<button class="btn btn-sm btn-outline" onclick="showScenarioHint()">\uD83D\uDCA1 \u67E5\u770B\u63D0\u793A</button>';
  }
  html += '</div>';

  // Feedback
  if (SimState.scenario.feedbackMsg) {
    var fbClass = SimState.scenario.feedbackType === 'success' ? 'feedback-success' : 'feedback-error';
    html += '<div class="guided-step-feedback ' + fbClass + '">';
    html += escapeHtml(SimState.scenario.feedbackMsg);
    html += '</div>';
  }

  html += '</div>';
  return html;
}

// ============================================
// Scenario Summary (shown after completion)
// ============================================
function renderScenarioSummary() {
  var sc = SimState.scenario.active;
  if (!sc || !sc.summary) return '';

  var html = '<div class="scenario-summary">';
  html += '<div class="scenario-summary-header">';
  html += '<span style="font-size:2rem;">\uD83C\uDF89</span>';
  html += '<h3>\u573A\u666F\u5B8C\u6210\uFF01</h3>';
  html += '<p>' + escapeHtml(sc.name) + '</p>';
  html += '</div>';

  html += '<div class="scenario-summary-section">';
  html += '<h4>\uD83D\uDCCC \u6838\u5FC3\u8981\u70B9</h4>';
  html += '<ul>';
  for (var i = 0; i < sc.summary.keyPoints.length; i++) {
    html += '<li>' + escapeHtml(sc.summary.keyPoints[i]) + '</li>';
  }
  html += '</ul>';
  html += '</div>';

  if (sc.summary.realWorldNote) {
    html += '<div class="scenario-real-world">';
    html += '<strong>\uD83C\uDFED \u5B9E\u9645\u5DE5\u5382\u6CE8\u89E3\uFF1A</strong>';
    html += '<p>' + escapeHtml(sc.summary.realWorldNote) + '</p>';
    html += '</div>';
  }

  html += '<div style="text-align:center;margin-top:20px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">';
  html += '<button class="btn btn-primary" onclick="exitScenario()">\u2190 \u8FD4\u56DE\u573A\u666F\u5217\u8868</button>';
  html += '<button class="btn btn-outline" onclick="resetScenario()">\uD83D\uDD04 \u91CD\u65B0\u6311\u6218</button>';
  html += '</div>';

  html += '</div>';
  return html;
}

// ============================================
// Scenario Action Validation
// ============================================
function executeScenarioAction(actionId) {
  var sc = SimState.scenario.active;
  if (!sc || SimState.scenario.completed) return;

  var step = sc.steps[SimState.scenario.currentStep];
  if (!step) return;

  // Virtual actions are not triggered by action panel buttons
  if (step.expectedAction && step.expectedAction.charAt(0) === '_') {
    SimState.scenario.feedbackMsg = step.wrongActionMsg || '\u8BF7\u4F7F\u7528\u4E0A\u65B9\u7684\u4E13\u7528\u6309\u94AE\u6267\u884C\u6B64\u64CD\u4F5C\u3002';
    SimState.scenario.feedbackType = 'error';
    SimState.scenario.attempts++;
    if (SimState.scenario.attempts >= 2) SimState.scenario.hintVisible = true;
    updateSimulatorUI();
    return;
  }

  if (actionId === step.expectedAction) {
    // Correct action! Execute it through normal path
    SimState.mode = 'free'; // temp switch to avoid recursion
    executeAction(actionId);
    SimState.mode = 'scenario';

    SimState.scenario.stepResults.push({
      stepId: step.id,
      correct: true,
      attempts: SimState.scenario.attempts + 1
    });

    SimState.scenario.feedbackMsg = step.successMsg || '\u6B63\u786E\uFF01';
    SimState.scenario.feedbackType = 'success';
    SimState.scenario.attempts = 0;
    SimState.scenario.hintVisible = false;

    updateSimulatorUI();

    // Auto-advance after delay
    setTimeout(function() {
      advanceScenarioStep();
    }, 1200);
  } else {
    // Wrong action - do NOT execute
    SimState.scenario.feedbackMsg = step.wrongActionMsg || '\u8FD9\u4E0D\u662F\u5F53\u524D\u6B65\u9AA4\u7684\u6B63\u786E\u64CD\u4F5C\u3002';
    SimState.scenario.feedbackType = 'error';
    SimState.scenario.attempts++;
    if (SimState.scenario.attempts >= 2) {
      SimState.scenario.hintVisible = true;
    }
    updateSimulatorUI();
  }
}

// ============================================
// Execute Virtual Action (priority changes etc.)
// ============================================
function executeVirtualAction() {
  var sc = SimState.scenario.active;
  if (!sc || SimState.scenario.completed) return;

  var step = sc.steps[SimState.scenario.currentStep];
  if (!step || !step.expectedAction || step.expectedAction.charAt(0) !== '_') return;

  var lot = SimState.lot;

  // Handle virtual action types
  if (step.expectedAction === '_changePriority' && step.actionParams) {
    var oldPriority = lot.priority;
    lot.priority = step.actionParams.newPriority;
    addLogEntry('\u4F18\u5148\u7EA7\u53D8\u66F4', 'P' + oldPriority + ' \u2192 P' + lot.priority, '');
  }

  SimState.scenario.stepResults.push({
    stepId: step.id,
    correct: true,
    attempts: SimState.scenario.attempts + 1
  });

  SimState.scenario.feedbackMsg = step.successMsg || '\u6B63\u786E\uFF01';
  SimState.scenario.feedbackType = 'success';
  SimState.scenario.attempts = 0;
  SimState.scenario.hintVisible = false;

  updateSimulatorUI();

  setTimeout(function() {
    advanceScenarioStep();
  }, 1200);
}

// ============================================
// Advance to next step or complete
// ============================================
function advanceScenarioStep() {
  var sc = SimState.scenario.active;
  if (!sc) return;

  if (SimState.scenario.currentStep >= sc.steps.length - 1) {
    // All steps done
    SimState.scenario.completed = true;
    SimState.scenario.feedbackMsg = '';
    SimState.scenario.feedbackType = '';
    saveScenarioCompletion(sc.id);
  } else {
    SimState.scenario.currentStep++;
    SimState.scenario.feedbackMsg = '';
    SimState.scenario.feedbackType = '';
    SimState.scenario.hintVisible = false;
    SimState.scenario.attempts = 0;
  }

  // Re-render
  var container = getEl('page-simulator');
  if (container) {
    renderSimulatorLayout(container);
    updateSimulatorUI();
  }
}

// ============================================
// Show Hint
// ============================================
function showScenarioHint() {
  SimState.scenario.hintVisible = true;
  updateSimulatorUI();
}

// ============================================
// Exit Scenario (back to browser)
// ============================================
function exitScenario() {
  SimState.scenario.active = null;
  SimState.scenario.currentStep = 0;
  SimState.scenario.completed = false;
  SimState.scenario.stepResults = [];
  SimState.scenario.attempts = 0;
  SimState.scenario.feedbackMsg = '';
  SimState.scenario.feedbackType = '';
  SimState.scenario.hintVisible = false;

  var container = getEl('page-simulator');
  if (container) {
    renderSimulatorLayout(container);
    updateSimulatorUI();
  }
}

// ============================================
// Reset current scenario
// ============================================
function resetScenario() {
  var sc = SimState.scenario.active;
  if (!sc) return;

  SimState.scenario.currentStep = 0;
  SimState.scenario.completed = false;
  SimState.scenario.stepResults = [];
  SimState.scenario.attempts = 0;
  SimState.scenario.feedbackMsg = '';
  SimState.scenario.feedbackType = '';
  SimState.scenario.hintVisible = false;

  SimState.lot = cloneLot(sc.initialLot);
  SimState.visitedStates = [SimState.lot.state];

  var container = getEl('page-simulator');
  if (container) {
    renderSimulatorLayout(container);
    updateSimulatorUI();
  }
}

// ============================================
// SVG State Diagram
// ============================================
function renderSVGStateDiagram() {
  var svgContainer = getEl('svgContainer');
  if (!svgContainer) return;

  var lot = SimState.lot;
  var currentState = lot.state;
  var visited = SimState.visitedStates;

  // Node positions (x, y, w, h)
  var nodes = {
    created:   { x: 40,  y: 160, w: 110, h: 44 },
    started:   { x: 200, y: 160, w: 110, h: 44 },
    wait:      { x: 370, y: 100, w: 110, h: 44 },
    run:       { x: 370, y: 230, w: 110, h: 44 },
    hold:      { x: 370, y: 340, w: 110, h: 44 },
    completed: { x: 560, y: 100, w: 110, h: 44 },
    shipped:   { x: 720, y: 100, w: 110, h: 44 },
    scrapped:  { x: 560, y: 340, w: 110, h: 44 }
  };

  // Transitions: [from, to, label, path-type]
  var transitions = [
    ['created',   'started',   '\u5F00\u59CB\u6279\u6B21',     'straight'],
    ['started',   'wait',      '\u8FDB\u5165\u5DE5\u5E8F',     'straight'],
    ['wait',      'run',       'TrackIn',      'curve-down'],
    ['run',       'wait',      'TrackOut',     'curve-up'],
    ['wait',      'hold',      'Hold',         'straight'],
    ['run',       'hold',      '\u8FD0\u884C\u4E2D\u6263\u7559',   'straight'],
    ['hold',      'wait',      'Release',      'curve-left'],
    ['hold',      'scrapped',  'Scrap',        'straight'],
    ['scrapped',  'hold',      'Unscrap',      'curve-back'],
    ['wait',      'completed', '\u5B8C\u6210\u6279\u6B21',     'straight'],
    ['completed', 'shipped',   'Ship',         'straight'],
    ['shipped',   'completed', '\u53D6\u6D88\u51FA\u8D27',     'curve-back2']
  ];

  var svg = '';
  svg += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 410" width="860" height="410" style="max-width:100%;height:auto;">';

  // Defs: arrowhead marker
  svg += '<defs>';
  svg += '<marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">';
  svg += '<polygon points="0 0, 10 3.5, 0 7" fill="#999" />';
  svg += '</marker>';
  svg += '</defs>';

  // Draw transitions (arrows)
  for (var t = 0; t < transitions.length; t++) {
    var tr = transitions[t];
    var fromNode = nodes[tr[0]];
    var toNode = nodes[tr[1]];
    var label = tr[2];
    var pathType = tr[3];

    var fx = fromNode.x + fromNode.w / 2;
    var fy = fromNode.y + fromNode.h / 2;
    var tx = toNode.x + toNode.w / 2;
    var ty = toNode.y + toNode.h / 2;

    var pathD = '';
    var labelX = 0;
    var labelY = 0;

    if (pathType === 'straight') {
      var edgeFrom = getEdgePoint(fromNode, tx, ty);
      var edgeTo = getEdgePoint(toNode, fx, fy);
      pathD = 'M' + edgeFrom.x + ',' + edgeFrom.y + ' L' + edgeTo.x + ',' + edgeTo.y;
      labelX = (edgeFrom.x + edgeTo.x) / 2;
      labelY = (edgeFrom.y + edgeTo.y) / 2 - 8;
    } else if (pathType === 'curve-down') {
      var cdsx = fromNode.x;
      var cdsy = fromNode.y + fromNode.h;
      var cdex = toNode.x;
      var cdey = toNode.y;
      pathD = 'M' + cdsx + ',' + cdsy + ' C' + (cdsx - 50) + ',' + (cdsy + 40) + ' ' + (cdex - 50) + ',' + (cdey - 40) + ' ' + cdex + ',' + cdey;
      labelX = cdsx - 60;
      labelY = (cdsy + cdey) / 2;
    } else if (pathType === 'curve-up') {
      var cusx = fromNode.x + fromNode.w;
      var cusy = fromNode.y;
      var cuex = toNode.x + toNode.w;
      var cuey = toNode.y + toNode.h;
      pathD = 'M' + cusx + ',' + cusy + ' C' + (cusx + 50) + ',' + (cusy - 40) + ' ' + (cuex + 50) + ',' + (cuey + 40) + ' ' + cuex + ',' + cuey;
      labelX = cusx + 52;
      labelY = (cusy + cuey) / 2;
    } else if (pathType === 'curve-left') {
      var clsx = fromNode.x;
      var clsy = fromNode.y;
      var clex = toNode.x;
      var cley = toNode.y + toNode.h;
      pathD = 'M' + clsx + ',' + clsy + ' C' + (clsx - 70) + ',' + (clsy - 30) + ' ' + (clex - 70) + ',' + (cley + 30) + ' ' + clex + ',' + cley;
      labelX = clsx - 85;
      labelY = (clsy + cley) / 2;
    } else if (pathType === 'curve-back') {
      var cbsx = fromNode.x;
      var cbsy = fromNode.y + fromNode.h / 2;
      var cbex = toNode.x + toNode.w;
      var cbey = toNode.y + toNode.h / 2;
      pathD = 'M' + cbsx + ',' + cbsy + ' C' + (cbsx - 20) + ',' + (cbsy + 50) + ' ' + (cbex + 20) + ',' + (cbey + 50) + ' ' + cbex + ',' + cbey;
      labelX = (cbsx + cbex) / 2;
      labelY = cbsy + 55;
    } else if (pathType === 'curve-back2') {
      var cb2sx = fromNode.x;
      var cb2sy = fromNode.y + fromNode.h / 2;
      var cb2ex = toNode.x + toNode.w;
      var cb2ey = toNode.y + toNode.h / 2;
      pathD = 'M' + cb2sx + ',' + cb2sy + ' C' + (cb2sx - 10) + ',' + (cb2sy - 50) + ' ' + (cb2ex + 10) + ',' + (cb2ey - 50) + ' ' + cb2ex + ',' + cb2ey;
      labelX = (cb2sx + cb2ex) / 2;
      labelY = cb2sy - 52;
    }

    svg += '<path class="transition-arrow" d="' + pathD + '" />';
    svg += '<text class="transition-label" x="' + labelX + '" y="' + labelY + '" text-anchor="middle">' + label + '</text>';
  }

  // Draw state nodes
  var stateKeys = Object.keys(nodes);
  for (var s = 0; s < stateKeys.length; s++) {
    var stateId = stateKeys[s];
    var n = nodes[stateId];
    var info = getStateInfo(stateId);
    var isCurrent = (stateId === currentState);
    var isVisited = (visited.indexOf(stateId) !== -1) && !isCurrent;

    var cls = 'state-node';
    if (isCurrent) cls += ' current';
    else if (isVisited) cls += ' visited';

    svg += '<g class="' + cls + '" data-state="' + stateId + '">';

    var fillColor = isCurrent ? info.color : (isVisited ? '#e3f2fd' : '#f5f5f5');
    var strokeColor = isCurrent ? info.color : (isVisited ? info.color : '#bdbdbd');
    var strokeWidth = isCurrent ? 3 : 1.5;
    var textColor = isCurrent ? '#ffffff' : (isVisited ? info.color : '#666');

    svg += '<rect x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" rx="8" ry="8" ';
    svg += 'fill="' + fillColor + '" stroke="' + strokeColor + '" stroke-width="' + strokeWidth + '" />';

    svg += '<text x="' + (n.x + n.w / 2) + '" y="' + (n.y + n.h / 2 - 6) + '" text-anchor="middle" ';
    svg += 'fill="' + textColor + '" font-size="12" font-weight="' + (isCurrent ? '700' : '600') + '">' + info.name + '</text>';

    svg += '<text x="' + (n.x + n.w / 2) + '" y="' + (n.y + n.h / 2 + 10) + '" text-anchor="middle" ';
    svg += 'fill="' + textColor + '" font-size="9" opacity="0.8">' + stateId + '</text>';

    svg += '</g>';
  }

  // Self-loop indicator for wait state (split/merge/changeOp etc.)
  var waitNode = nodes.wait;
  svg += '<path d="M' + (waitNode.x + waitNode.w / 2 - 15) + ',' + waitNode.y + ' C' + (waitNode.x + waitNode.w / 2 - 15) + ',' + (waitNode.y - 35) + ' ' + (waitNode.x + waitNode.w / 2 + 15) + ',' + (waitNode.y - 35) + ' ' + (waitNode.x + waitNode.w / 2 + 15) + ',' + waitNode.y + '" class="transition-arrow" />';
  svg += '<text class="transition-label" x="' + (waitNode.x + waitNode.w / 2) + '" y="' + (waitNode.y - 30) + '" text-anchor="middle">Split/Merge/Skip...</text>';

  svg += '</svg>';

  svgContainer.innerHTML = svg;
}

// Helper: get edge point of a rectangle towards a target point
function getEdgePoint(rect, targetX, targetY) {
  var cx = rect.x + rect.w / 2;
  var cy = rect.y + rect.h / 2;
  var dx = targetX - cx;
  var dy = targetY - cy;

  if (dx === 0 && dy === 0) return { x: cx, y: cy };

  var absDx = Math.abs(dx);
  var absDy = Math.abs(dy);

  var scaleX = absDx > 0 ? (rect.w / 2) / absDx : Infinity;
  var scaleY = absDy > 0 ? (rect.h / 2) / absDy : Infinity;

  var scale = Math.min(scaleX, scaleY);

  return {
    x: cx + dx * scale,
    y: cy + dy * scale
  };
}

// ============================================
// Lot Info Panel
// ============================================
function renderLotInfo() {
  var grid = getEl('lotInfoGrid');
  if (!grid || !SimState.lot) return;

  var lot = SimState.lot;
  var stateInfo = getStateInfo(lot.state);
  var currentOp = getCurrentOp();
  var opName = currentOp ? (currentOp.name + ' - ' + currentOp.desc) : '\u2014';

  var items = [
    { label: 'Lot Name',      value: lot.lotName,      cls: '' },
    { label: 'Product Spec',  value: lot.productSpec,   cls: '' },
    { label: 'Process Flow',  value: lot.processFlow,   cls: '' },
    { label: '\u6570\u91CF',           value: lot.quantity + ' pcs', cls: '' },
    { label: '\u4F18\u5148\u7EA7',         value: 'P' + lot.priority, cls: '' },
    { label: '\u5F53\u524D\u72B6\u6001',       value: stateInfo.name,    cls: 'state-' + lot.state },
    { label: 'Hold \u72B6\u6001',     value: lot.holdState === 'hold' ? '\u5DF2\u6263\u7559' : '\u6B63\u5E38', cls: lot.holdState === 'hold' ? 'state-hold' : '' },
    { label: '\u5F53\u524D\u5DE5\u5E8F',       value: opName,            cls: '' },
    { label: 'Bank \u72B6\u6001',     value: lot.bankState === 'in' ? '\u5DF2\u5165Bank' : '\u6B63\u5E38', cls: lot.bankState === 'in' ? 'state-hold' : '' },
    { label: '\u8FD4\u5DE5\u72B6\u6001',       value: lot.reworkState === 'rework' ? '\u8FD4\u5DE5\u4E2D' : '\u6B63\u5E38', cls: lot.reworkState === 'rework' ? 'state-hold' : '' },
    { label: '\u5206\u652F\u72B6\u6001',       value: lot.branchState === 'branch' ? '\u5206\u652F\u4E2D' : '\u6B63\u5E38', cls: lot.branchState === 'branch' ? 'state-hold' : '' }
  ];

  var html = '';
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    html += '<div class="lot-info-item">';
    html += '<div class="info-label">' + escapeHtml(item.label) + '</div>';
    html += '<div class="info-value ' + item.cls + '">' + escapeHtml(String(item.value)) + '</div>';
    html += '</div>';
  }

  grid.innerHTML = html;
}

// ============================================
// Progress Steps
// ============================================
function renderProgressSteps() {
  var stepsEl = getEl('progressSteps');
  if (!stepsEl || !SimState.lot) return;

  var lot = SimState.lot;
  var ops = SAMPLE_PROCESS_FLOW.operations;
  var html = '';

  for (var i = 0; i < ops.length; i++) {
    var op = ops[i];
    var cls = 'progress-step';
    if (i < lot.currentOpIndex) {
      cls += ' completed';
    } else if (i === lot.currentOpIndex && (lot.state === 'wait' || lot.state === 'run')) {
      cls += ' current';
    }

    html += '<div class="' + cls + '">';
    html += '<div class="step-dot">' + op.seq + '</div>';
    html += '<div class="step-name">' + escapeHtml(op.name) + '</div>';
    html += '</div>';

    // Connector line between steps
    if (i < ops.length - 1) {
      var isCompleted = i < lot.currentOpIndex;
      html += '<div style="flex:1;height:2px;background:' + (isCompleted ? 'var(--success)' : 'var(--border)') + ';min-width:12px;align-self:center;margin-top:-10px;"></div>';
    }
  }

  stepsEl.innerHTML = html;
}

// ============================================
// Action Buttons
// ============================================
function renderActionButtons() {
  var container = getEl('actionButtonsContainer');
  if (!container) return;

  var inScenario = SimState.mode === 'scenario' && SimState.scenario.active && !SimState.scenario.completed;
  var expectedAction = '';
  if (inScenario) {
    var step = SimState.scenario.active.steps[SimState.scenario.currentStep];
    if (step) expectedAction = step.expectedAction || '';
  }

  // Group actions by category
  var categories = {};
  var categoryOrder = [];
  var actionKeys = Object.keys(LOT_ACTIONS);
  for (var i = 0; i < actionKeys.length; i++) {
    var action = LOT_ACTIONS[actionKeys[i]];
    var cat = action.category;
    if (!categories[cat]) {
      categories[cat] = [];
      categoryOrder.push(cat);
    }
    categories[cat].push(action);
  }

  var html = '';
  for (var c = 0; c < categoryOrder.length; c++) {
    var catName = categoryOrder[c];
    var actions = categories[catName];

    html += '<div style="margin-bottom:12px;">';
    html += '<div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:6px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">' + escapeHtml(catName) + '</div>';
    html += '<div class="action-buttons">';

    for (var a = 0; a < actions.length; a++) {
      var act = actions[a];
      var disabled = !isActionAvailable(act.id);
      var btnCls = 'action-btn';
      if (act.btnClass) btnCls += ' ' + act.btnClass;

      // Scenario mode: highlight expected action
      if (inScenario && act.id === expectedAction && !disabled) {
        btnCls += ' scenario-expected';
      }

      html += '<button class="' + btnCls + '"' + (disabled ? ' disabled' : '') + ' onclick="executeAction(\'' + act.id + '\')" title="' + escapeHtml(act.desc) + '">';
      html += escapeHtml(act.name);
      html += '</button>';
    }

    html += '</div>';
    html += '</div>';
  }

  container.innerHTML = html;
}

// ============================================
// Check if an action is available
// ============================================
function isActionAvailable(actionId) {
  var lot = SimState.lot;
  if (!lot) return false;

  var state = lot.state;
  var ops = SAMPLE_PROCESS_FLOW.operations;
  var isLastOp = (lot.currentOpIndex >= ops.length - 1);

  switch (actionId) {
    case 'startLot':
      return state === 'created';
    case 'enterProcess':
      return state === 'started';
    case 'trackIn':
      return state === 'wait' && lot.bankState !== 'in';
    case 'trackOut':
      return state === 'run';
    case 'cancelTrackIn':
      return state === 'run';
    case 'holdLot':
      return state === 'wait';
    case 'holdRunLot':
      return state === 'run';
    case 'releaseHold':
      return state === 'hold';
    case 'scrapLot':
      return state === 'hold';
    case 'unscrapLot':
      return state === 'scrapped';
    case 'splitLot':
      return state === 'wait';
    case 'mergeLot':
      return state === 'wait';
    case 'changeOp':
      return state === 'wait';
    case 'backupOp':
      return state === 'wait' && lot.currentOpIndex > 0;
    case 'skipOp':
      return state === 'wait' && !isLastOp;
    case 'rework':
      return state === 'wait' && lot.reworkState !== 'rework';
    case 'completeRework':
      return state === 'wait' && lot.reworkState === 'rework';
    case 'branch':
      return state === 'wait' && lot.branchState !== 'branch';
    case 'completeBranch':
      return state === 'wait' && lot.branchState === 'branch';
    case 'completeLot':
      return state === 'wait' && isLastOp;
    case 'shipLot':
      return state === 'completed';
    case 'unshipLot':
      return state === 'shipped';
    case 'bankIn':
      return state === 'wait' && lot.bankState !== 'in';
    case 'bankOut':
      return state === 'wait' && lot.bankState === 'in';
    default:
      return false;
  }
}

// ============================================
// Prompt for changeOp target
// ============================================
function promptChangeOp() {
  var ops = SAMPLE_PROCESS_FLOW.operations;
  var lot = SimState.lot;
  var msg = '\u8BF7\u8F93\u5165\u76EE\u6807\u5DE5\u5E8F\u5E8F\u53F7 (1-' + ops.length + '):\n';
  for (var i = 0; i < ops.length; i++) {
    var marker = (i === lot.currentOpIndex) ? ' \u2190 \u5F53\u524D' : '';
    msg += '  ' + ops[i].seq + '. ' + ops[i].name + ' (' + ops[i].desc + ')' + marker + '\n';
  }
  var input = prompt(msg);
  if (input === null || input.trim() === '') return null;
  var seq = parseInt(input, 10);
  if (isNaN(seq) || seq < 1 || seq > ops.length) {
    alert('\u65E0\u6548\u7684\u5DE5\u5E8F\u5E8F\u53F7\uFF01');
    return null;
  }
  return seq - 1;
}

// ============================================
// Execute an action
// ============================================
function executeAction(actionId) {
  // Scenario mode guard
  if (SimState.mode === 'scenario' && SimState.scenario.active && !SimState.scenario.completed) {
    return executeScenarioAction(actionId);
  }

  var lot = SimState.lot;
  var action = LOT_ACTIONS[actionId];
  if (!action) return;

  // Validate
  if (!isActionAvailable(actionId)) {
    addLogEntry('\u26A0\uFE0F \u64CD\u4F5C\u4E0D\u53EF\u7528', action.name + ' \u2014 \u5F53\u524D\u72B6\u6001\u4E0D\u6EE1\u8DB3\u524D\u7F6E\u6761\u4EF6', '');
    return;
  }

  var prevState = lot.state;
  var prevStateInfo = getStateInfo(prevState);
  var ops = SAMPLE_PROCESS_FLOW.operations;
  var currentOp = getCurrentOp();
  var opInfo = currentOp ? currentOp.name : '\u2014';
  var extraMsg = '';

  // Execute state transition and special logic
  switch (actionId) {
    case 'startLot':
      lot.state = 'started';
      break;

    case 'enterProcess':
      lot.state = 'wait';
      break;

    case 'trackIn':
      lot.state = 'run';
      break;

    case 'trackOut':
      lot.state = 'wait';
      if (lot.currentOpIndex < ops.length - 1) {
        lot.currentOpIndex++;
        var toNextOp = ops[lot.currentOpIndex];
        extraMsg = '\u524D\u8FDB\u5230\u5DE5\u5E8F ' + toNextOp.name;
        if (lot.currentOpIndex >= ops.length - 1) {
          extraMsg += ' (\u6700\u540E\u5DE5\u5E8F\uFF0C\u53EF\u6267\u884C\u201C\u5B8C\u6210\u6279\u6B21\u201D)';
        }
      }
      break;

    case 'cancelTrackIn':
      lot.state = 'wait';
      break;

    case 'holdLot':
      lot.state = 'hold';
      lot.holdState = 'hold';
      break;

    case 'holdRunLot':
      lot.state = 'hold';
      lot.holdState = 'hold';
      break;

    case 'releaseHold':
      lot.state = 'wait';
      lot.holdState = 'none';
      break;

    case 'scrapLot':
      lot.state = 'scrapped';
      break;

    case 'unscrapLot':
      lot.state = 'hold';
      break;

    case 'splitLot':
      lot.quantity = Math.max(1, Math.floor(lot.quantity / 2));
      extraMsg = '\u5DF2\u4ECE ' + lot.lotName + ' \u62C6\u5206\u51FA\u5B50\u6279\u6B21 ' + lot.lotName + '-S1\uFF08\u6570\u91CF\u5404 ' + lot.quantity + '\uFF09';
      break;

    case 'mergeLot':
      lot.quantity = lot.quantity + 10;
      extraMsg = '\u5DF2\u5C06 LOT-2025-002 \u5408\u5E76\u5230 ' + lot.lotName + '\uFF08\u5408\u5E76\u540E\u6570\u91CF ' + lot.quantity + '\uFF09';
      break;

    case 'changeOp':
      var targetIdx = promptChangeOp();
      if (targetIdx === null) return;
      lot.currentOpIndex = targetIdx;
      var targetOp = ops[targetIdx];
      extraMsg = '\u5DE5\u5E8F\u53D8\u66F4\u5230 ' + targetOp.name + ' (' + targetOp.desc + ')';
      break;

    case 'backupOp':
      if (lot.currentOpIndex > 0) {
        lot.currentOpIndex--;
        var backOp = ops[lot.currentOpIndex];
        extraMsg = '\u56DE\u9000\u5230\u5DE5\u5E8F ' + backOp.name;
      }
      break;

    case 'skipOp':
      if (lot.currentOpIndex < ops.length - 1) {
        var skippedOp = ops[lot.currentOpIndex];
        lot.currentOpIndex++;
        var skipNextOp = ops[lot.currentOpIndex];
        extraMsg = '\u8DF3\u8FC7 ' + skippedOp.name + '\uFF0C\u524D\u8FDB\u5230 ' + skipNextOp.name;
      }
      break;

    case 'rework':
      lot.reworkState = 'rework';
      var reworkTarget = Math.max(0, lot.currentOpIndex - 2);
      lot.currentOpIndex = reworkTarget;
      var rwOp = ops[reworkTarget];
      extraMsg = '\u8FDB\u5165\u8FD4\u5DE5\u6A21\u5F0F\uFF0C\u56DE\u9000\u5230\u5DE5\u5E8F ' + rwOp.name;
      break;

    case 'completeRework':
      lot.reworkState = 'none';
      extraMsg = '\u8FD4\u5DE5\u5B8C\u6210\uFF0C\u6062\u590D\u6B63\u5E38\u751F\u4EA7\u6D41\u7A0B';
      break;

    case 'branch':
      lot.branchState = 'branch';
      extraMsg = '\u8FDB\u5165\u5206\u652F\u6D41\u7A0B';
      break;

    case 'completeBranch':
      lot.branchState = 'none';
      extraMsg = '\u5206\u652F\u6D41\u7A0B\u7ED3\u675F\uFF0C\u56DE\u5230\u4E3B\u6D41\u7A0B';
      break;

    case 'completeLot':
      lot.state = 'completed';
      break;

    case 'shipLot':
      lot.state = 'shipped';
      break;

    case 'unshipLot':
      lot.state = 'completed';
      break;

    case 'bankIn':
      lot.bankState = 'in';
      extraMsg = '\u6279\u6B21\u5DF2\u5B58\u5165 Bank\uFF08\u6682\u5B58\u533A\uFF09';
      break;

    case 'bankOut':
      lot.bankState = 'none';
      extraMsg = '\u6279\u6B21\u5DF2\u4ECE Bank\uFF08\u6682\u5B58\u533A\uFF09\u53D6\u51FA';
      break;

    default:
      break;
  }

  // Track visited states
  var newState = lot.state;
  if (SimState.visitedStates.indexOf(newState) === -1) {
    SimState.visitedStates.push(newState);
  }

  // Record history
  var newStateInfo = getStateInfo(newState);
  var newOp = getCurrentOp();
  var historyEntry = {
    time: new Date(),
    actionId: actionId,
    actionName: action.name,
    fromState: prevState,
    toState: newState,
    opName: newOp ? newOp.name : '\u2014',
    extra: extraMsg
  };
  lot.history.unshift(historyEntry);

  // Build log detail
  var logDetail = prevStateInfo.name + ' \u2192 ' + newStateInfo.name;
  if (newOp) {
    logDetail += ' | \u5DE5\u5E8F: ' + newOp.name;
  }
  if (extraMsg) {
    logDetail += ' | ' + extraMsg;
  }

  addLogEntry(action.name, logDetail, '');

  // Update UI
  updateSimulatorUI();
}

// ============================================
// Add log entry to the log panel
// ============================================
function addLogEntry(actionName, detail, extra) {
  var logContainer = getEl('logEntries');
  if (!logContainer) return;

  // Remove placeholder if present
  var placeholder = logContainer.querySelector('div[style]');
  if (placeholder && logContainer.children.length === 1) {
    logContainer.innerHTML = '';
  }

  var timeStr = formatTime(new Date());

  var entryDiv = document.createElement('div');
  entryDiv.className = 'log-entry';
  entryDiv.innerHTML = '<span class="log-time">[' + timeStr + ']</span>' +
    '<span class="log-action">' + escapeHtml(actionName) + '</span>' +
    '<span class="log-arrow">|</span>' +
    '<span class="log-detail">' + escapeHtml(detail) + '</span>';

  // Insert at top
  if (logContainer.firstChild) {
    logContainer.insertBefore(entryDiv, logContainer.firstChild);
  } else {
    logContainer.appendChild(entryDiv);
  }
}

// ============================================
// Reset Simulator (free mode)
// ============================================
function resetSimulator() {
  SimState.lot = cloneLot(INITIAL_LOT);
  SimState.visitedStates = ['created'];

  // Re-render everything
  var container = getEl('page-simulator');
  if (container) {
    renderSimulatorLayout(container);
    updateSimulatorUI();
  }

  console.log('[Simulator] Reset to initial state.');
}
