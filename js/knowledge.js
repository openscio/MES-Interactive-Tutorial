/* ============================================
   MES Interactive Tutorial - Knowledge Module
   ============================================ */

'use strict';

/**
 * Initialize the Knowledge Learning page.
 * Called by app.js onPageEnter('knowledge').
 */
function initKnowledgePage() {
  var container = document.getElementById('page-knowledge');
  if (!container) return;

  // Load learned modules from storage
  var learnedModules = loadFromStorage('mes_learned_modules', []);

  // Default to first module
  var activeIndex = 0;

  // Build the page
  renderKnowledgeLayout(container, activeIndex, learnedModules);
}

/**
 * Render the full knowledge layout (sidebar + content)
 * @param {HTMLElement} container - The page container
 * @param {number} activeIndex - Index of the active module
 * @param {string[]} learnedModules - Array of learned module IDs
 */
function renderKnowledgeLayout(container, activeIndex, learnedModules) {
  var modules = KNOWLEDGE_DATA;
  var currentModule = modules[activeIndex];

  // Mark current module as learned
  if (learnedModules.indexOf(currentModule.id) === -1) {
    learnedModules.push(currentModule.id);
    saveToStorage('mes_learned_modules', learnedModules);
  }

  // Build HTML
  var html = '<div class="knowledge-layout">';

  // === Left sidebar: module list ===
  html += '<div class="knowledge-sidebar">';
  html += '<div class="module-list">';

  for (var i = 0; i < modules.length; i++) {
    var mod = modules[i];
    var isActive = (i === activeIndex);
    var isCompleted = (learnedModules.indexOf(mod.id) !== -1);
    var itemClass = 'module-list-item';
    if (isActive) itemClass += ' active';
    if (isCompleted) itemClass += ' completed';

    html += '<div class="' + itemClass + '" data-module-index="' + i + '">';
    html += '<span class="item-num">' + (i + 1) + '</span>';
    html += '<span>' + mod.icon + ' ' + mod.title + '</span>';
    html += '</div>';
  }

  html += '</div>'; // .module-list
  html += '</div>'; // .knowledge-sidebar

  // === Right content area ===
  html += '<div class="knowledge-content">';
  html += renderModuleContent(currentModule);
  html += '</div>'; // .knowledge-content

  html += '</div>'; // .knowledge-layout

  container.innerHTML = html;

  // Bind click events on module list items
  var items = container.querySelectorAll('.module-list-item');
  for (var j = 0; j < items.length; j++) {
    items[j].addEventListener('click', function() {
      var idx = parseInt(this.getAttribute('data-module-index'), 10);
      var learned = loadFromStorage('mes_learned_modules', []);
      renderKnowledgeLayout(container, idx, learned);
    });
  }
}

/**
 * Render the content for a single module
 * @param {Object} mod - Module data object from KNOWLEDGE_DATA
 * @returns {string} HTML string
 */
function renderModuleContent(mod) {
  var html = '<div class="content-card">';
  html += '<h3>' + mod.icon + ' ' + mod.title + '</h3>';

  // Render each section
  for (var i = 0; i < mod.sections.length; i++) {
    var section = mod.sections[i];
    html += '<h4>' + section.title + '</h4>';
    html += section.content;
  }

  // Start quiz button
  html += '<div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-light); text-align: center;">';
  html += '<button class="start-quiz-btn" onclick="navigateTo(\'quiz\'); setTimeout(function(){ if(typeof startQuizForModule===\'function\') startQuizForModule(\'' + mod.id + '\'); }, 100);">';
  html += '✏️ 开始测验 — ' + mod.title;
  html += '</button>';
  html += '</div>';

  html += '</div>'; // .content-card

  return html;
}
