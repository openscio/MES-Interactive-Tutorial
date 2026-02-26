/* ============================================
   MES Feature Map - Rendering & Search Logic
   ============================================ */

'use strict';

// ============================================
// Feature Map State
// ============================================
var FeatureMapState = {
  initialized: false,
  expandedCategories: {},
  expandedItems: {},
  searchTerm: '',
  totalFeatures: 0,
  matchedFeatures: 0
};

// ============================================
// Initialization
// ============================================

/**
 * Initialize the Feature Map page
 * Called by onPageEnter('feature-map') in app.js
 */
function initFeatureMapPage() {
  var container = getEl('page-feature-map');
  if (!container) return;

  // Calculate total features
  FeatureMapState.totalFeatures = 0;
  FEATURE_TREE.forEach(function(cat) {
    FeatureMapState.totalFeatures += cat.items.length;
  });
  FeatureMapState.matchedFeatures = FeatureMapState.totalFeatures;

  // Render the full page
  renderFeatureMapPage(container);

  // Bind search events
  bindFeatureMapEvents();

  container.dataset.initialized = 'true';
}

// ============================================
// Page Rendering
// ============================================

/**
 * Render the complete feature map page
 * @param {HTMLElement} container - The page container
 */
function renderFeatureMapPage(container) {
  var html = '';

  // Header: search + stats + expand/collapse buttons
  html += '<div class="feature-map-header">';
  html += '  <div class="feature-search">';
  html += '    <span>🔍</span>';
  html += '    <input type="text" id="featureSearchInput" placeholder="搜索功能名称、英文标识或描述..." />';
  html += '    <span id="featureSearchClear" style="cursor:pointer;display:none;color:var(--text-muted);" title="清除搜索">✕</span>';
  html += '  </div>';
  html += '  <div class="feature-stats">';
  html += '    <div class="feature-stat">';
  html += '      <div class="stat-num">' + FEATURE_TREE.length + '</div>';
  html += '      <div class="stat-label">大分类</div>';
  html += '    </div>';
  html += '    <div class="feature-stat">';
  html += '      <div class="stat-num" id="featureCountDisplay">' + FeatureMapState.totalFeatures + '</div>';
  html += '      <div class="stat-label" id="featureCountLabel">功能项</div>';
  html += '    </div>';
  html += '  </div>';
  html += '  <div style="display:flex;gap:8px;">';
  html += '    <button class="btn btn-sm btn-outline" id="btnExpandAll" onclick="featureMapExpandAll()">全部展开</button>';
  html += '    <button class="btn btn-sm btn-outline" id="btnCollapseAll" onclick="featureMapCollapseAll()">全部折叠</button>';
  html += '  </div>';
  html += '</div>';

  // Feature tree
  html += '<div class="feature-tree" id="featureTree">';
  FEATURE_TREE.forEach(function(category, catIndex) {
    html += renderCategory(category, catIndex);
  });
  html += '</div>';

  container.innerHTML = html;
}

/**
 * Render a single category card
 * @param {Object} category - Category data object
 * @param {number} catIndex - Category index
 * @returns {string} HTML string
 */
function renderCategory(category, catIndex) {
  var isExpanded = FeatureMapState.expandedCategories[category.id] || false;
  var html = '';

  html += '<div class="feature-category" data-cat-id="' + category.id + '" id="cat-' + category.id + '">';

  // Category header
  html += '<div class="category-header' + (isExpanded ? ' expanded' : '') + '" onclick="toggleFeatureCategory(\'' + category.id + '\')">';
  html += '  <div class="cat-color" style="background:' + category.color + ';"></div>';
  html += '  <span class="cat-icon">' + category.icon + '</span>';
  html += '  <div class="cat-info">';
  html += '    <div class="cat-name">' + escapeHtml(category.name) + '</div>';
  html += '    <div class="cat-count">' + category.items.length + ' 个功能 · ' + escapeHtml(category.description) + '</div>';
  html += '  </div>';
  html += '  <span class="cat-toggle">▼</span>';
  html += '</div>';

  // Category items
  html += '<div class="category-items' + (isExpanded ? ' show' : '') + '" id="catItems-' + category.id + '">';
  category.items.forEach(function(item, itemIndex) {
    html += renderFeatureItem(item, category.color, category.id);
  });
  html += '</div>';

  html += '</div>';
  return html;
}

/**
 * Render a single feature item
 * @param {Object} item - Feature item data
 * @param {string} color - Category color
 * @param {string} catId - Category ID
 * @returns {string} HTML string
 */
function renderFeatureItem(item, color, catId) {
  var isExpanded = FeatureMapState.expandedItems[item.id] || false;
  var html = '';

  html += '<div class="feature-item' + (isExpanded ? ' expanded' : '') + '" data-item-id="' + item.id + '" data-cat-id="' + catId + '" onclick="toggleFeatureItem(\'' + item.id + '\')">';
  html += '  <div class="feat-bullet" style="background:' + color + ';"></div>';
  html += '  <div class="feat-content">';
  html += '    <span class="feat-name">' + escapeHtml(item.name) + '</span>';
  html += '    <span class="feat-id">' + escapeHtml(item.engName) + '</span>';
  html += '    <div class="feat-desc">' + escapeHtml(item.desc) + '</div>';
  html += '  </div>';
  html += '</div>';

  return html;
}

// ============================================
// Interaction Handlers
// ============================================

/**
 * Toggle a category's expanded/collapsed state
 * @param {string} catId - Category ID
 */
function toggleFeatureCategory(catId) {
  var catEl = getEl('cat-' + catId);
  if (!catEl) return;

  var header = catEl.querySelector('.category-header');
  var items = getEl('catItems-' + catId);
  if (!header || !items) return;

  var isExpanded = header.classList.contains('expanded');

  if (isExpanded) {
    header.classList.remove('expanded');
    items.classList.remove('show');
    FeatureMapState.expandedCategories[catId] = false;
  } else {
    header.classList.add('expanded');
    items.classList.add('show');
    FeatureMapState.expandedCategories[catId] = true;
  }
}

/**
 * Toggle a feature item's description visibility
 * @param {string} itemId - Feature item ID
 */
function toggleFeatureItem(itemId) {
  var itemEls = document.querySelectorAll('.feature-item[data-item-id="' + itemId + '"]');
  itemEls.forEach(function(el) {
    var isExpanded = el.classList.contains('expanded');
    if (isExpanded) {
      el.classList.remove('expanded');
      FeatureMapState.expandedItems[itemId] = false;
    } else {
      el.classList.add('expanded');
      FeatureMapState.expandedItems[itemId] = true;
    }
  });
}

/**
 * Expand all categories
 */
function featureMapExpandAll() {
  FEATURE_TREE.forEach(function(cat) {
    var header = document.querySelector('#cat-' + cat.id + ' .category-header');
    var items = getEl('catItems-' + cat.id);
    if (header && items) {
      header.classList.add('expanded');
      items.classList.add('show');
      FeatureMapState.expandedCategories[cat.id] = true;
    }
  });
}

/**
 * Collapse all categories
 */
function featureMapCollapseAll() {
  FEATURE_TREE.forEach(function(cat) {
    var header = document.querySelector('#cat-' + cat.id + ' .category-header');
    var items = getEl('catItems-' + cat.id);
    if (header && items) {
      header.classList.remove('expanded');
      items.classList.remove('show');
      FeatureMapState.expandedCategories[cat.id] = false;
    }
  });
}

// ============================================
// Search Logic
// ============================================

/**
 * Bind search input events
 */
function bindFeatureMapEvents() {
  var searchInput = getEl('featureSearchInput');
  var clearBtn = getEl('featureSearchClear');

  if (searchInput) {
    searchInput.addEventListener('input', debounce(function() {
      var term = searchInput.value.trim();
      FeatureMapState.searchTerm = term;
      performFeatureSearch(term);

      // Show/hide clear button
      if (clearBtn) {
        clearBtn.style.display = term.length > 0 ? 'inline' : 'none';
      }
    }, 300));
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      if (searchInput) {
        searchInput.value = '';
        FeatureMapState.searchTerm = '';
        performFeatureSearch('');
        clearBtn.style.display = 'none';
        searchInput.focus();
      }
    });
  }
}

/**
 * Perform search/filter on the feature tree
 * @param {string} term - Search term
 */
function performFeatureSearch(term) {
  var lowerTerm = term.toLowerCase();
  var matchedCount = 0;
  var totalCount = FeatureMapState.totalFeatures;

  FEATURE_TREE.forEach(function(category) {
    var catEl = getEl('cat-' + category.id);
    var itemsContainer = getEl('catItems-' + category.id);
    var header = catEl ? catEl.querySelector('.category-header') : null;
    if (!catEl || !itemsContainer || !header) return;

    var hasMatch = false;
    var catMatchCount = 0;

    // Check each item
    var itemEls = itemsContainer.querySelectorAll('.feature-item');
    category.items.forEach(function(item, idx) {
      var itemEl = itemEls[idx];
      if (!itemEl) return;

      if (term === '') {
        // No search - show all, remove highlights
        itemEl.style.display = '';
        removeHighlights(itemEl);
        matchedCount++;
        catMatchCount++;
      } else {
        var nameMatch = item.name.toLowerCase().indexOf(lowerTerm) !== -1;
        var engMatch = item.engName.toLowerCase().indexOf(lowerTerm) !== -1;
        var descMatch = item.desc.toLowerCase().indexOf(lowerTerm) !== -1;

        if (nameMatch || engMatch || descMatch) {
          itemEl.style.display = '';
          hasMatch = true;
          matchedCount++;
          catMatchCount++;

          // Apply highlights
          highlightItem(itemEl, item, term);
        } else {
          itemEl.style.display = 'none';
          removeHighlights(itemEl);
        }
      }
    });

    if (term === '') {
      // Restore original state - don't force expand/collapse
      catEl.style.display = '';
    } else if (hasMatch) {
      // Show category and auto-expand
      catEl.style.display = '';
      header.classList.add('expanded');
      itemsContainer.classList.add('show');
      FeatureMapState.expandedCategories[category.id] = true;
    } else {
      // Hide entire category if no matches
      catEl.style.display = 'none';
    }
  });

  // Update stats display
  updateFeatureStats(matchedCount, totalCount, term);
}

/**
 * Highlight matching text in a feature item
 * @param {HTMLElement} itemEl - The feature item DOM element
 * @param {Object} item - The feature item data
 * @param {string} term - The search term
 */
function highlightItem(itemEl, item, term) {
  var nameEl = itemEl.querySelector('.feat-name');
  var idEl = itemEl.querySelector('.feat-id');
  var descEl = itemEl.querySelector('.feat-desc');

  if (nameEl) nameEl.innerHTML = highlightText(item.name, term);
  if (idEl) idEl.innerHTML = highlightText(item.engName, term);
  if (descEl) descEl.innerHTML = highlightText(item.desc, term);
}

/**
 * Remove highlights from a feature item
 * @param {HTMLElement} itemEl - The feature item DOM element
 */
function removeHighlights(itemEl) {
  var nameEl = itemEl.querySelector('.feat-name');
  var idEl = itemEl.querySelector('.feat-id');
  var descEl = itemEl.querySelector('.feat-desc');

  // Restore original text (strip any <mark> tags)
  if (nameEl) nameEl.innerHTML = escapeHtml(nameEl.textContent);
  if (idEl) idEl.innerHTML = escapeHtml(idEl.textContent);
  if (descEl) descEl.innerHTML = escapeHtml(descEl.textContent);
}

/**
 * Highlight occurrences of a term within text
 * @param {string} text - Original text
 * @param {string} term - Term to highlight
 * @returns {string} HTML with <mark> tags
 */
function highlightText(text, term) {
  if (!term) return escapeHtml(text);

  var escaped = escapeHtml(text);
  var escapedTerm = escapeHtml(term);

  // Case-insensitive replacement
  var regex = new RegExp('(' + escapeRegex(escapedTerm) + ')', 'gi');
  return escaped.replace(regex, '<mark style="background:#fff176;padding:0 2px;border-radius:2px;">$1</mark>');
}

/**
 * Escape special regex characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Update the feature count stats display
 * @param {number} matched - Number of matched features
 * @param {number} total - Total number of features
 * @param {string} term - Current search term
 */
function updateFeatureStats(matched, total, term) {
  var countEl = getEl('featureCountDisplay');
  var labelEl = getEl('featureCountLabel');

  if (countEl && labelEl) {
    if (term && term.length > 0) {
      countEl.textContent = matched + '/' + total;
      labelEl.textContent = '匹配功能';
    } else {
      countEl.textContent = total;
      labelEl.textContent = '功能项';
    }
  }

  FeatureMapState.matchedFeatures = matched;
}
