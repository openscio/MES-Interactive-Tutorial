/* ============================================
   MES Interactive Tutorial - Main Application
   ============================================ */

'use strict';

// ============================================
// Page Routes Configuration
// ============================================
const PAGES = {
  home: {
    title: '欢迎使用 MES 互动学习平台',
    desc: '通过互动式学习，掌握制造执行系统的核心知识',
    containerId: 'page-home'
  },
  knowledge: {
    title: '📚 知识学习',
    desc: '系统化学习 MES 七大核心知识模块',
    containerId: 'page-knowledge'
  },
  quiz: {
    title: '✏️ 知识测验',
    desc: '自适应出题系统，答错补强，巩固所学知识',
    containerId: 'page-quiz'
  },
  simulator: {
    title: '🔄 批次模拟器',
    desc: '模拟 Lot 从创建到出货的完整生命周期',
    containerId: 'page-simulator'
  },
  'feature-map': {
    title: '🗺️ 功能地图',
    desc: '探索 MES 系统的完整功能清单，8 大分类 129 个功能项',
    containerId: 'page-feature-map'
  }
};

// ============================================
// Application State
// ============================================
const AppState = {
  currentPage: 'home',
  initialized: false,
  sidebarOpen: false
};

// ============================================
// DOM References
// ============================================
function getEl(id) {
  return document.getElementById(id);
}

function getEls(selector) {
  return document.querySelectorAll(selector);
}

// ============================================
// Navigation & Routing
// ============================================

/**
 * Navigate to a specific page
 * @param {string} pageName - The page route name (e.g., 'home', 'knowledge')
 */
function navigateTo(pageName) {
  if (!PAGES[pageName]) {
    console.warn('[App] Unknown page:', pageName);
    pageName = 'home';
  }

  const page = PAGES[pageName];

  // Update state
  AppState.currentPage = pageName;

  // Update URL hash
  window.location.hash = '#' + pageName;

  // Update page header
  const pageTitle = getEl('pageTitle');
  const pageDesc = getEl('pageDesc');
  if (pageTitle) pageTitle.textContent = page.title;
  if (pageDesc) pageDesc.textContent = page.desc;

  // Hide all page contents
  getEls('.page-content').forEach(function(el) {
    el.classList.add('hidden');
  });

  // Show target page
  const targetContainer = getEl(page.containerId);
  if (targetContainer) {
    targetContainer.classList.remove('hidden');
    // Add animation
    targetContainer.style.animation = 'none';
    targetContainer.offsetHeight; // trigger reflow
    targetContainer.style.animation = 'fadeIn 0.3s ease';
  }

  // Update nav active state
  updateNavActive(pageName);

  // Close mobile sidebar if open
  closeSidebar();

  // Trigger page-specific initialization
  onPageEnter(pageName);

  // Scroll to top
  window.scrollTo(0, 0);
}

/**
 * Update the active state of navigation items
 * @param {string} pageName - The active page name
 */
function updateNavActive(pageName) {
  getEls('.nav-item').forEach(function(item) {
    var itemPage = item.getAttribute('data-page');
    if (itemPage === pageName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

/**
 * Called when a page is entered - for lazy initialization
 * @param {string} pageName - The page being entered
 */
function onPageEnter(pageName) {
  switch (pageName) {
    case 'knowledge':
      if (typeof initKnowledgePage === 'function') {
        initKnowledgePage();
      } else {
        renderPlaceholder('page-knowledge', '知识学习', '📚', '知识学习模块即将上线，敬请期待！');
      }
      break;
    case 'quiz':
      if (typeof initQuizPage === 'function') {
        initQuizPage();
      } else {
        renderPlaceholder('page-quiz', '知识测验', '✏️', '知识测验模块即将上线，敬请期待！');
      }
      break;
    case 'simulator':
      if (typeof initSimulatorPage === 'function') {
        initSimulatorPage();
      } else {
        renderPlaceholder('page-simulator', '批次模拟器', '🔄', '批次模拟器模块即将上线，敬请期待！');
      }
      break;
    case 'feature-map':
      if (typeof initFeatureMapPage === 'function') {
        initFeatureMapPage();
      } else {
        renderPlaceholder('page-feature-map', '功能地图', '🗺️', '功能地图模块即将上线，敬请期待！');
      }
      break;
    default:
      break;
  }
}

// ============================================
// Placeholder Renderer (for modules not yet loaded)
// ============================================

/**
 * Render a placeholder for pages not yet implemented
 * @param {string} containerId - The container element ID
 * @param {string} title - Placeholder title
 * @param {string} icon - Emoji icon
 * @param {string} message - Placeholder message
 */
function renderPlaceholder(containerId, title, icon, message) {
  var container = getEl(containerId);
  if (!container || container.dataset.initialized) return;

  container.innerHTML = '\
    <div class="content-card" style="text-align: center; padding: 60px 28px;">\
      <div style="font-size: 4rem; margin-bottom: 20px;">' + icon + '</div>\
      <h3 style="color: var(--primary); margin-bottom: 12px; border: none; padding: 0;">' + title + '</h3>\
      <p style="color: var(--text-light); font-size: 1rem; max-width: 400px; margin: 0 auto 24px;">' + message + '</p>\
      <button class="btn btn-outline" onclick="navigateTo(\'home\')">← 返回首页</button>\
    </div>';

  container.dataset.initialized = 'placeholder';
}

// ============================================
// Sidebar (Mobile)
// ============================================

function openSidebar() {
  var sidebar = getEl('sidebar');
  var overlay = getEl('sidebarOverlay');
  if (sidebar) sidebar.classList.add('open');
  if (overlay) overlay.classList.add('show');
  AppState.sidebarOpen = true;
}

function closeSidebar() {
  var sidebar = getEl('sidebar');
  var overlay = getEl('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('show');
  AppState.sidebarOpen = false;
}

function toggleSidebar() {
  if (AppState.sidebarOpen) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

// ============================================
// Utility Functions
// ============================================

/**
 * Render HTML content into a page container
 * @param {string} containerId - Target container ID
 * @param {string} html - HTML content to render
 */
function renderPage(containerId, html) {
  var container = getEl(containerId);
  if (container) {
    container.innerHTML = html;
    container.dataset.initialized = 'true';
  }
}

/**
 * Create an HTML element with attributes
 * @param {string} tag - HTML tag name
 * @param {Object} attrs - Attributes object
 * @param {string} innerHTML - Inner HTML content
 * @returns {HTMLElement}
 */
function createElement(tag, attrs, innerHTML) {
  var el = document.createElement(tag);
  if (attrs) {
    Object.keys(attrs).forEach(function(key) {
      if (key === 'className') {
        el.className = attrs[key];
      } else if (key.startsWith('on')) {
        el.addEventListener(key.substring(2).toLowerCase(), attrs[key]);
      } else {
        el.setAttribute(key, attrs[key]);
      }
    });
  }
  if (innerHTML !== undefined) {
    el.innerHTML = innerHTML;
  }
  return el;
}

/**
 * Format a timestamp to HH:MM:SS
 * @param {Date} date - Date object
 * @returns {string}
 */
function formatTime(date) {
  if (!date) date = new Date();
  var h = String(date.getHours()).padStart(2, '0');
  var m = String(date.getMinutes()).padStart(2, '0');
  var s = String(date.getSeconds()).padStart(2, '0');
  return h + ':' + m + ':' + s;
}

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store (will be JSON serialized)
 */
function saveToStorage(key, value) {
  try {
    localStorage.setItem('mes-tutorial-' + key, JSON.stringify(value));
  } catch (e) {
    console.warn('[Storage] Failed to save:', key, e);
  }
}

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key not found
 * @returns {*}
 */
function loadFromStorage(key, defaultValue) {
  try {
    var data = localStorage.getItem('mes-tutorial-' + key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.warn('[Storage] Failed to load:', key, e);
    return defaultValue;
  }
}

/**
 * Debounce function
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function}
 */
function debounce(fn, delay) {
  var timer = null;
  return function() {
    var context = this;
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  };
}

/**
 * Escape HTML special characters
 * @param {string} str - String to escape
 * @returns {string}
 */
function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ============================================
// Event Binding
// ============================================

function bindEvents() {
  // Navigation click events
  getEls('.nav-item').forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      var page = this.getAttribute('data-page');
      if (page) {
        navigateTo(page);
      }
    });
  });

  // Mobile menu toggle
  var menuToggle = getEl('mobileMenuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleSidebar);
  }

  // Sidebar overlay click to close
  var overlay = getEl('sidebarOverlay');
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  // Handle hash change (browser back/forward)
  window.addEventListener('hashchange', function() {
    var hash = window.location.hash.replace('#', '') || 'home';
    if (hash !== AppState.currentPage) {
      navigateTo(hash);
    }
  });

  // Handle responsive: show/hide mobile menu toggle
  handleResponsive();
  window.addEventListener('resize', debounce(handleResponsive, 200));
}

/**
 * Handle responsive layout changes
 */
function handleResponsive() {
  var menuToggle = getEl('mobileMenuToggle');
  if (!menuToggle) return;

  if (window.innerWidth <= 768) {
    menuToggle.classList.remove('hidden');
  } else {
    menuToggle.classList.add('hidden');
    closeSidebar();
  }
}

// ============================================
// Initialization
// ============================================

function initApp() {
  if (AppState.initialized) return;

  console.log('[MES Tutorial] Initializing application...');

  // Bind events
  bindEvents();

  // Check for hash route
  var hash = window.location.hash.replace('#', '');
  if (hash && PAGES[hash]) {
    navigateTo(hash);
  } else {
    navigateTo('home');
  }

  AppState.initialized = true;
  console.log('[MES Tutorial] Application initialized successfully.');
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
