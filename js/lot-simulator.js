/* ============================================
   MES Interactive Tutorial - Lot Simulator
   ============================================ */

'use strict';

// ============================================
// Simulator State
// ============================================
var SimState = {
  lot: null,
  visitedStates: [],
  initialized: false
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

  // 1. SVG State Diagram
  html += '<div class="svg-state-diagram" id="simStateDiagram">';
  html += '<h4 style="color:var(--primary);margin-bottom:12px;font-size:1rem;">📊 Lot 状态机图</h4>';
  html += '<div id="svgContainer"></div>';
  html += '</div>';

  // 2. Lot Info Panel
  html += '<div class="lot-info-panel" id="simLotInfo">';
  html += '<h4 style="color:var(--primary);margin-bottom:12px;font-size:1rem;">📋 批次信息</h4>';
  html += '<div class="lot-info-grid" id="lotInfoGrid"></div>';
  html += '</div>';

  // 3. Operation Progress
  html += '<div class="operation-progress" id="simOpProgress">';
  html += '<h4 style="color:var(--primary);margin-bottom:8px;font-size:1rem;">🔧 工序进度 — ' + escapeHtml(SAMPLE_PROCESS_FLOW.name) + ' (Rev ' + escapeHtml(SAMPLE_PROCESS_FLOW.revision) + ')</h4>';
  html += '<div class="progress-steps" id="progressSteps"></div>';
  html += '</div>';

  // 4. Bottom: Action Panel + Operation Log
  html += '<div class="simulator-bottom">';

  // Action Panel
  html += '<div class="action-panel" id="simActionPanel">';
  html += '<h4>⚡ 操作面板</h4>';
  html += '<div id="actionButtonsContainer"></div>';
  html += '</div>';

  // Operation Log
  html += '<div class="operation-log" id="simOpLog">';
  html += '<h4>📝 操作日志</h4>';
  html += '<div id="logEntries"><div style="color:var(--text-muted);font-size:0.85rem;padding:8px 0;">暂无操作记录</div></div>';
  html += '</div>';

  html += '</div>'; // .simulator-bottom

  // Reset button
  html += '<div style="text-align:center;margin-top:16px;">';
  html += '<button class="btn btn-outline" onclick="resetSimulator()">🔄 重置模拟</button>';
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
    ['created',   'started',   '开始批次',     'straight'],
    ['started',   'wait',      '进入工序',     'straight'],
    ['wait',      'run',       'TrackIn',      'curve-down'],
    ['run',       'wait',      'TrackOut',     'curve-up'],
    ['wait',      'hold',      'Hold',         'straight'],
    ['run',       'hold',      '运行中扣留',   'straight'],
    ['hold',      'wait',      'Release',      'curve-left'],
    ['hold',      'scrapped',  'Scrap',        'straight'],
    ['scrapped',  'hold',      'Unscrap',      'curve-back'],
    ['wait',      'completed', '完成批次',     'straight'],
    ['completed', 'shipped',   'Ship',         'straight'],
    ['shipped',   'completed', '取消出货',     'curve-back2']
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
      // wait -> run (left side curve)
      var cdsx = fromNode.x;
      var cdsy = fromNode.y + fromNode.h;
      var cdex = toNode.x;
      var cdey = toNode.y;
      pathD = 'M' + cdsx + ',' + cdsy + ' C' + (cdsx - 50) + ',' + (cdsy + 40) + ' ' + (cdex - 50) + ',' + (cdey - 40) + ' ' + cdex + ',' + cdey;
      labelX = cdsx - 60;
      labelY = (cdsy + cdey) / 2;
    } else if (pathType === 'curve-up') {
      // run -> wait (right side curve)
      var cusx = fromNode.x + fromNode.w;
      var cusy = fromNode.y;
      var cuex = toNode.x + toNode.w;
      var cuey = toNode.y + toNode.h;
      pathD = 'M' + cusx + ',' + cusy + ' C' + (cusx + 50) + ',' + (cusy - 40) + ' ' + (cuex + 50) + ',' + (cuey + 40) + ' ' + cuex + ',' + cuey;
      labelX = cusx + 52;
      labelY = (cusy + cuey) / 2;
    } else if (pathType === 'curve-left') {
      // hold -> wait (left curve back up)
      var clsx = fromNode.x;
      var clsy = fromNode.y;
      var clex = toNode.x;
      var cley = toNode.y + toNode.h;
      pathD = 'M' + clsx + ',' + clsy + ' C' + (clsx - 70) + ',' + (clsy - 30) + ' ' + (clex - 70) + ',' + (cley + 30) + ' ' + clex + ',' + cley;
      labelX = clsx - 85;
      labelY = (clsy + cley) / 2;
    } else if (pathType === 'curve-back') {
      // scrapped -> hold (curve below)
      var cbsx = fromNode.x;
      var cbsy = fromNode.y + fromNode.h / 2;
      var cbex = toNode.x + toNode.w;
      var cbey = toNode.y + toNode.h / 2;
      pathD = 'M' + cbsx + ',' + cbsy + ' C' + (cbsx - 20) + ',' + (cbsy + 50) + ' ' + (cbex + 20) + ',' + (cbey + 50) + ' ' + cbex + ',' + cbey;
      labelX = (cbsx + cbex) / 2;
      labelY = cbsy + 55;
    } else if (pathType === 'curve-back2') {
      // shipped -> completed (curve above)
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
  var opName = currentOp ? (currentOp.name + ' - ' + currentOp.desc) : '—';

  var items = [
    { label: 'Lot Name',      value: lot.lotName,      cls: '' },
    { label: 'Product Spec',  value: lot.productSpec,   cls: '' },
    { label: 'Process Flow',  value: lot.processFlow,   cls: '' },
    { label: '数量',           value: lot.quantity + ' pcs', cls: '' },
    { label: '优先级',         value: 'P' + lot.priority, cls: '' },
    { label: '当前状态',       value: stateInfo.name,    cls: 'state-' + lot.state },
    { label: 'Hold 状态',     value: lot.holdState === 'hold' ? '已扣留' : '正常', cls: lot.holdState === 'hold' ? 'state-hold' : '' },
    { label: '当前工序',       value: opName,            cls: '' },
    { label: 'Bank 状态',     value: lot.bankState === 'in' ? '已入Bank' : '正常', cls: lot.bankState === 'in' ? 'state-hold' : '' },
    { label: '返工状态',       value: lot.reworkState === 'rework' ? '返工中' : '正常', cls: lot.reworkState === 'rework' ? 'state-hold' : '' },
    { label: '分支状态',       value: lot.branchState === 'branch' ? '分支中' : '正常', cls: lot.branchState === 'branch' ? 'state-hold' : '' }
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
  var msg = '请输入目标工序序号 (1-' + ops.length + '):\n';
  for (var i = 0; i < ops.length; i++) {
    var marker = (i === lot.currentOpIndex) ? ' ← 当前' : '';
    msg += '  ' + ops[i].seq + '. ' + ops[i].name + ' (' + ops[i].desc + ')' + marker + '\n';
  }
  var input = prompt(msg);
  if (input === null || input.trim() === '') return null;
  var seq = parseInt(input, 10);
  if (isNaN(seq) || seq < 1 || seq > ops.length) {
    alert('无效的工序序号！');
    return null;
  }
  return seq - 1; // convert to 0-based index
}

// ============================================
// Execute an action
// ============================================
function executeAction(actionId) {
  var lot = SimState.lot;
  var action = LOT_ACTIONS[actionId];
  if (!action) return;

  // Validate
  if (!isActionAvailable(actionId)) {
    addLogEntry('⚠️ 操作不可用', action.name + ' — 当前状态不满足前置条件', '');
    return;
  }

  var prevState = lot.state;
  var prevStateInfo = getStateInfo(prevState);
  var ops = SAMPLE_PROCESS_FLOW.operations;
  var currentOp = getCurrentOp();
  var opInfo = currentOp ? currentOp.name : '—';
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
        extraMsg = '前进到工序 ' + toNextOp.name;
        if (lot.currentOpIndex >= ops.length - 1) {
          extraMsg += ' (最后工序，可执行"完成批次")';
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
      extraMsg = '已从 ' + lot.lotName + ' 拆分出子批次 ' + lot.lotName + '-S1（数量各 ' + lot.quantity + '）';
      break;

    case 'mergeLot':
      lot.quantity = lot.quantity + 10;
      extraMsg = '已将 LOT-2025-002 合并到 ' + lot.lotName + '（合并后数量 ' + lot.quantity + '）';
      break;

    case 'changeOp':
      var targetIdx = promptChangeOp();
      if (targetIdx === null) return;
      lot.currentOpIndex = targetIdx;
      var targetOp = ops[targetIdx];
      extraMsg = '工序变更到 ' + targetOp.name + ' (' + targetOp.desc + ')';
      break;

    case 'backupOp':
      if (lot.currentOpIndex > 0) {
        lot.currentOpIndex--;
        var backOp = ops[lot.currentOpIndex];
        extraMsg = '回退到工序 ' + backOp.name;
      }
      break;

    case 'skipOp':
      if (lot.currentOpIndex < ops.length - 1) {
        var skippedOp = ops[lot.currentOpIndex];
        lot.currentOpIndex++;
        var skipNextOp = ops[lot.currentOpIndex];
        extraMsg = '跳过 ' + skippedOp.name + '，前进到 ' + skipNextOp.name;
      }
      break;

    case 'rework':
      lot.reworkState = 'rework';
      var reworkTarget = Math.max(0, lot.currentOpIndex - 2);
      lot.currentOpIndex = reworkTarget;
      var rwOp = ops[reworkTarget];
      extraMsg = '进入返工模式，回退到工序 ' + rwOp.name;
      break;

    case 'completeRework':
      lot.reworkState = 'none';
      extraMsg = '返工完成，恢复正常生产流程';
      break;

    case 'branch':
      lot.branchState = 'branch';
      extraMsg = '进入分支流程';
      break;

    case 'completeBranch':
      lot.branchState = 'none';
      extraMsg = '分支流程结束，回到主流程';
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
      extraMsg = '批次已存入 Bank（暂存区）';
      break;

    case 'bankOut':
      lot.bankState = 'none';
      extraMsg = '批次已从 Bank（暂存区）取出';
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
    opName: newOp ? newOp.name : '—',
    extra: extraMsg
  };
  lot.history.unshift(historyEntry);

  // Build log detail
  var logDetail = prevStateInfo.name + ' → ' + newStateInfo.name;
  if (newOp) {
    logDetail += ' | 工序: ' + newOp.name;
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
// Reset Simulator
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
