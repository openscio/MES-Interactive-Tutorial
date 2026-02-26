/* ==========================================================
   MES 互动式学习平台 — 主应用逻辑
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initKnowledge();
  initSimulation();
  initFunctionMap();
  initQuiz();
});

/* ===================== Tab Navigation ===================== */
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });
}

/* =================== Knowledge Module ==================== */
const knowledgeModules = [
  {
    icon: '🏭', title: 'MES 概述', subtitle: '制造执行系统基础概念',
    sections: [
      { heading: '什么是 MES',
        content: 'MES（Manufacturing Execution System，制造执行系统）是位于企业计划层（ERP）与过程控制层（PCS）之间的生产管理信息化系统。它面向车间层的管理信息系统，实时采集生产数据，优化从订单下达到产品完工的整个生产过程。' },
      { heading: 'MES 在制造体系中的定位',
        diagram: '    ┌─────────────────────┐\n    │     ERP 企业资源计划    │  ← 计划层\n    └──────────┬──────────┘\n               │\n    ┌──────────▼──────────┐\n    │   MES 制造执行系统    │  ← 执行层\n    └──────────┬──────────┘\n               │\n    ┌──────────▼──────────┐\n    │  PCS/SCADA 过程控制   │  ← 控制层\n    └─────────────────────┘' },
      { heading: 'ISA-95 标准',
        content: 'ISA-95（IEC 62264）是国际自动化学会制定的企业系统与控制系统集成的国际标准，定义了 MES 的功能模型和数据交换接口。它将制造运营划分为四个主要功能领域：',
        list: ['生产运营管理 — 管理生产工单与调度', '质量运营管理 — 管理质量检测与控制', '库存运营管理 — 管理物料与在制品', '维护运营管理 — 管理设备维护与保养'] },
      { heading: 'MES 核心价值',
        list: ['实时可视化 — 全面掌握车间生产状态', 'WIP 追踪 — 实时跟踪在制品流转', '质量管控 — 自动化质量检测与异常处理', '设备管理 — 预防性维护与利用率优化', '合规追溯 — 完整的生产数据记录与追踪'] },
      { heading: '典型应用场景',
        callout: '半导体制造是 MES 应用最成熟的领域之一。由于半导体工艺复杂（数百道工序）、洁净度要求极高、物料价值大，MES 在该领域承担着关键的生产协调角色，从光刻掩模（Reticle）管理到晶圆批次（Lot）追踪，全流程数字化管控。' }
    ]
  },
  {
    icon: '📋', title: '计划与工单', subtitle: '生产计划与工单管理',
    sections: [
      { heading: '生产计划概述',
        content: '生产计划是 MES 系统的入口，负责将 ERP 下达的销售订单或预测需求转化为车间级可执行的工单（Work Order）。MES 接收上层计划后，进行产能评估、物料检查，生成具体的作业指令。' },
      { heading: '工单（Work Order）',
        content: '工单是 MES 中最基本的生产任务单元，定义了"生产什么、生产多少、何时开始、何时完成"。',
        list: ['工单号（Work Order ID）— 唯一标识', '产品型号 — 需要生产的产品', '计划数量 — 需要生产的数量', '计划开始/结束时间 — 时间窗口', '优先级 — 影响调度排序', '工艺路线（Flow）— 工序步骤序列'] },
      { heading: '工艺路线（Flow / Route）',
        content: '工艺路线定义了产品从原材料到成品的完整工序步骤。每个步骤（Step）关联特定的设备组、配方（Recipe）和质量检测要求。',
        diagram: 'Step 1       Step 2       Step 3       Step 4       Step 5\n清洗  ──→  氧化  ──→  光刻  ──→  蚀刻  ──→  检测\n │           │           │           │           │\n设备组A     设备组B     设备组C     设备组D     设备组E\nRecipe-01  Recipe-02  Recipe-03  Recipe-04  Recipe-05' },
      { heading: '调度规则（Dispatch Rules）',
        content: '调度规则决定了当多个批次竞争同一设备时的排序策略：',
        list: ['FIFO — 先进先出，最经典的规则', 'EDD — 最早交期优先', 'SPT — 最短加工时间优先', 'CR — 关键比率法，综合考虑交期与剩余工序', 'Hot Lot — 紧急批次优先，人工提升优先级'] }
    ]
  },
  {
    icon: '📦', title: '批次管理', subtitle: 'Lot 生命周期与操作',
    sections: [
      { heading: 'Lot（批次）概念',
        content: 'Lot 是 MES 系统中的核心追踪单位，代表一组在同一工序步骤上同时加工的产品单元（如一批晶圆、一批 PCB）。Lot 贯穿整个生产周期，承载着产品的所有工艺与质量信息。' },
      { heading: 'Lot 类型',
        list: ['Production Lot（生产批次）— 正常生产的批次', 'Engineering Lot（工程批次）— 用于工艺开发与验证', 'Pilot Lot（试生产批次）— 新产品导入时的小批量验证', 'Dummy Lot（假批次）— 设备维护或工艺调试用'] },
      { heading: 'Lot 生命周期状态',
        diagram: '已创建 ──→ 排队中 ──→ 加工中 ──→ 已完成\n Created    Queued   Processing  Completed\n                                    │\n              ┌─────────────────────┤\n              ▼                     ▼\n           已出货                已报废\n           Shipped              Scrapped\n\n   * 任何状态均可进入 Hold（暂停）状态' },
      { heading: '关键操作',
        list: ['Track In（入站）— 批次进入工序，绑定设备', 'Track Out（出站）— 批次完成当前工序加工', 'Hold（暂停）— 冻结批次，暂停流转', 'Release（释放）— 解除暂停，恢复流转', 'Split（拆分）— 将一个批次拆成多个子批次', 'Merge（合并）— 将多个子批次合并回主批次', 'Scrap（报废）— 标记批次为报废'] },
      { heading: 'Lot 数据关联',
        callout: '每个 Lot 关联丰富的上下文数据：当前工艺路线与工序步骤、加工设备与配方（Recipe）、质量检测数据（SPC/FDC）、操作员信息与时间戳、物料消耗记录。这些数据构成了完整的批次追溯链（Genealogy）。' }
    ]
  },
  {
    icon: '⚙️', title: '设备管理', subtitle: '设备状态与维护管理',
    sections: [
      { heading: '设备在 MES 中的角色',
        content: '设备（Equipment）是生产执行的物理载体。MES 对设备进行全生命周期管理，包括状态监控、能力匹配、维护计划和利用率分析。设备的可用性直接影响产能和交期。' },
      { heading: '设备状态模型',
        diagram: '    ┌─────────┐     ┌─────────┐\n    │   Idle  │◄───►│   Run   │\n    │  (空闲) │     │  (运行) │\n    └────┬────┘     └────┬────┘\n         │               │\n         ▼               ▼\n    ┌─────────┐     ┌─────────┐\n    │  Down   │     │  PM     │\n    │ (故障)  │     │ (保养)  │\n    └─────────┘     └─────────┘' },
      { heading: 'PMS（预防性维护系统）',
        content: 'PMS（Preventive Maintenance System）是设备管理的核心子系统，基于设备运行时间或加工数量触发维护任务：',
        list: ['基于时间 — 每运行 N 小时触发保养', '基于计数 — 每加工 N 批次触发保养', '基于条件 — 关键参数超限时触发', 'PM 计划 — 预定义的保养作业内容与步骤'] },
      { heading: '设备能力（Equipment Capability）',
        content: '设备能力定义了设备可以执行的工序和配方组合。MES 根据设备能力进行自动派工：',
        list: ['工序资质 — 设备被认证可执行哪些工序', '配方认证 — 设备被认证可运行哪些配方', '产品限制 — 某些产品只能在特定设备上加工', '洁净度等级 — 洁净室分级管理'] },
      { heading: '设备利用率（OEE）',
        callout: 'OEE（Overall Equipment Effectiveness）= 可用率 × 性能率 × 良品率，是衡量设备综合效率的核心指标。MES 通过实时采集设备运行数据自动计算 OEE，帮助识别产能瓶颈。' }
    ]
  },
  {
    icon: '✅', title: '质量管理', subtitle: 'SPC、OCAP 与缺陷管理',
    sections: [
      { heading: '质量管理概述',
        content: '质量管理是 MES 系统的关键能力之一，贯穿从来料检验到成品出货的全过程。在半导体等精密制造领域，质量管理尤为关键，任何工艺偏差都可能导致整批报废。' },
      { heading: 'SPC（统计过程控制）',
        content: 'SPC 是通过统计方法监控工艺过程的稳定性和能力，及时发现异常波动：',
        list: ['控制图（Control Chart）— 绘制过程参数的变化趋势', 'UCL/LCL — 上下控制限，超限即触发告警', 'Cp/Cpk — 过程能力指数，衡量工艺精度', 'Western Electric 规则 — 判定过程失控的规则集', 'Nelson 规则 — 更精细的失控判定规则'] },
      { heading: 'OCAP（异常处理程序）',
        content: 'OCAP（Out-of-Control Action Plan）是 SPC 检测到异常后的标准化处理流程，定义了"发现异常 → 诊断原因 → 采取行动 → 验证效果"的闭环：',
        diagram: '  SPC 告警\n     │\n     ▼\n  OCAP 触发 ──→ 通知相关人员\n     │\n     ▼\n  原因诊断 ──→ 查询历史数据\n     │\n     ▼\n  纠正措施 ──→ 调整参数/停机/Hold 批次\n     │\n     ▼\n  效果验证 ──→ 确认恢复正常\n     │\n     ▼\n  OCAP 关闭' },
      { heading: 'FDC（故障检测与分类）',
        content: 'FDC（Fault Detection and Classification）通过实时监控设备运行参数，自动检测异常并进行分类：',
        list: ['实时参数采集 — 收集设备传感器数据', '异常检测 — 对比基线模型识别偏差', '故障分类 — 自动归类故障类型', '联动措施 — 自动触发 Hold 或停机'] },
      { heading: '缺陷管理',
        list: ['缺陷记录 — 记录缺陷类型、位置、数量', '缺陷代码 — 标准化的缺陷分类编码', '良率计算 — 自动计算各工序/产品良率', 'Pareto 分析 — 识别主要缺陷来源'] }
    ]
  },
  {
    icon: '🚚', title: '物流与库存', subtitle: '物料追踪与 WIP 管理',
    sections: [
      { heading: '物料管理',
        content: 'MES 管理从原材料入库到成品出库的完整物料流转，确保物料可追溯性和库存准确性。物料管理与批次管理紧密关联，每次加工消耗和产出都有完整记录。' },
      { heading: '库存类型',
        list: ['原材料库存 — 未投入生产的原材料', 'WIP（在制品）— 正在生产线上流转的半成品', '成品库存 — 已完成全部工序的产品', '备件库存 — 设备维修用备品备件', '辅材库存 — 化学品、气体等辅助材料'] },
      { heading: 'WIP 追踪',
        content: 'WIP（Work In Progress）追踪是 MES 的核心功能之一，提供生产线在制品的实时视图：',
        list: ['WIP 分布 — 各工序段在制品数量', 'WIP 老化 — 在制品停留时间监控', '瓶颈识别 — 通过 WIP 堆积识别瓶颈工序', '排队时间预测 — 预测批次等待时间'] },
      { heading: '物料消耗管理',
        content: '每次加工操作的物料消耗自动记录，支持：',
        list: ['BOM 消耗 — 按产品 BOM 自动扣减', '批号追溯 — 关联原材料批号', '消耗预警 — 库存低于安全库存时告警', '用量偏差 — 检测实际消耗与标准用量的偏差'] },
      { heading: '仓储管理',
        callout: 'MES 的仓储管理与 WMS（仓储管理系统）集成，管理库位分配、拣货策略和出入库流程。在自动化工厂中，MES 还控制 AMHS（自动物料搬运系统）实现无人化物料运输。' }
    ]
  },
  {
    icon: '🔬', title: '高级功能', subtitle: 'Reticle 管理、配方管理与报表',
    sections: [
      { heading: 'Reticle（光刻掩模）管理',
        content: 'Reticle 是半导体光刻工艺的核心耗材，价值极高（单片可达数十万美元）。MES 对 Reticle 进行全生命周期管理：',
        list: ['Reticle 库存管理 — 入库、出库、库位追踪', '使用次数追踪 — 记录每次使用次数与剩余寿命', '清洗周期管理 — 按规则触发清洗流程', 'Pod 管理 — Reticle 容器的追踪与管理', '光刻机匹配 — 确保 Reticle 与设备兼容'] },
      { heading: 'Recipe（配方）管理',
        content: 'Recipe 是设备执行加工的参数集合，直接决定产品质量。MES 的配方管理确保正确的配方被下载到正确的设备：',
        list: ['配方版本控制 — 管理配方的版本历史', '配方审批流程 — 新配方/变更需经审批', '配方下载验证 — 下载前后参数比对', 'Golden Recipe — 标准配方基线', '配方参数化 — 支持参数替换和继承'] },
      { heading: '电子签名与合规',
        content: '在制药、食品等受监管行业，MES 需符合 21 CFR Part 11 等法规要求：',
        list: ['电子签名 — 操作需经授权人员签名确认', '审计追踪 — 完整记录所有操作与变更', '访问控制 — 基于角色的权限管理', '数据完整性 — 确保数据不可篡改'] },
      { heading: '报表与分析',
        list: ['生产报表 — 产量、良率、周期时间统计', 'OEE 报表 — 设备综合效率分析', '在制品报表 — WIP 分布与老化分析', '追溯报告 — 产品全生命周期追溯', '自定义报表 — 灵活的报表构建器'] },
      { heading: '系统集成',
        callout: 'MES 作为车间级核心系统，需要与众多系统集成：向上对接 ERP/APS（计划排程）、向下连接 SCADA/PLC（设备控制）、横向集成 LIMS（实验室）、QMS（质量）、WMS（仓储）等系统，构成完整的智能制造生态。' }
    ]
  }
];

function initKnowledge() {
  const list = document.getElementById('moduleList');
  knowledgeModules.forEach((mod, i) => {
    const li = document.createElement('li');
    li.textContent = `${mod.icon} ${mod.title}`;
    li.addEventListener('click', () => showModule(i));
    list.appendChild(li);
  });
  // welcome card clicks
  document.querySelectorAll('.overview-item').forEach(item => {
    item.addEventListener('click', () => showModule(parseInt(item.dataset.module)));
  });
}

function showModule(index) {
  const mod = knowledgeModules[index];
  document.querySelectorAll('.module-list li').forEach((li, i) => {
    li.classList.toggle('active', i === index);
  });
  const container = document.getElementById('knowledgeContent');
  let html = `<h2 class="k-module-title">${mod.icon} ${mod.title}</h2>`;
  html += `<p class="k-module-subtitle">${mod.subtitle}</p>`;
  mod.sections.forEach(sec => {
    html += '<div class="k-section">';
    html += `<h3>${sec.heading}</h3>`;
    if (sec.content) html += `<p>${sec.content}</p>`;
    if (sec.list) {
      html += '<ul>';
      sec.list.forEach(item => html += `<li>${item}</li>`);
      html += '</ul>';
    }
    if (sec.diagram) html += `<div class="k-diagram">${sec.diagram}</div>`;
    if (sec.callout) html += `<div class="k-callout">${sec.callout}</div>`;
    html += '</div>';
  });
  container.innerHTML = html;
}

/* ================== Simulation Module =================== */
const LOT_STATES = {
  CREATED:    { label: '已创建',   class: 'state-created' },
  QUEUED:     { label: '排队中',   class: 'state-queued' },
  PROCESSING: { label: '加工中',  class: 'state-processing' },
  HOLD:       { label: '已暂停',   class: 'state-hold' },
  COMPLETED:  { label: '已完成',   class: 'state-completed' },
  SHIPPED:    { label: '已出货',   class: 'state-shipped' },
  SCRAPPED:   { label: '已报废',   class: 'state-scrapped' }
};

const SIM_STEPS = ['清洗', '氧化', '光刻', '蚀刻', '离子注入', '薄膜沉积', '检测'];

const STATE_TRANSITIONS = {
  CREATED:    [{ action: '排队入站', next: 'QUEUED', style: 'btn-action-primary' }],
  QUEUED:     [{ action: 'Track In', next: 'PROCESSING', style: 'btn-action-primary' },
               { action: 'Hold', next: 'HOLD', style: 'btn-action-warning' }],
  PROCESSING: [{ action: 'Track Out', next: 'COMPLETED', style: 'btn-action-success' },
               { action: 'Hold', next: 'HOLD', style: 'btn-action-warning' },
               { action: 'Scrap', next: 'SCRAPPED', style: 'btn-action-danger' }],
  HOLD:       [{ action: 'Release', next: '_PREV', style: 'btn-action-primary' }],
  COMPLETED:  [{ action: '移至下一工序', next: 'QUEUED', style: 'btn-action-primary', nextStep: true },
               { action: '出货', next: 'SHIPPED', style: 'btn-action-success' },
               { action: 'Scrap', next: 'SCRAPPED', style: 'btn-action-danger' }],
  SHIPPED:    [],
  SCRAPPED:   []
};

let simState = {};
let simTimer = 0;

function initSimulation() {
  resetSimulation();
  document.getElementById('btnReset').addEventListener('click', resetSimulation);
}

function resetSimulation() {
  simTimer = 0;
  simState = {
    state: 'CREATED',
    prevState: null,
    stepIndex: 0,
    log: [{ time: '00:00:00', msg: '系统初始化 — Lot LOT-2026-001 已创建，等待排队入站' }]
  };
  renderSimulation();
}

function renderSimulation() {
  const s = LOT_STATES[simState.state];
  document.getElementById('lotState').className = 'state-badge ' + s.class;
  document.getElementById('lotState').textContent = s.label;
  document.getElementById('lotStep').textContent =
    simState.state === 'CREATED' ? '—' : `Step ${simState.stepIndex + 1}: ${SIM_STEPS[simState.stepIndex] || '完成'}`;

  // Render action buttons
  const btnContainer = document.getElementById('actionButtons');
  btnContainer.innerHTML = '';
  const transitions = STATE_TRANSITIONS[simState.state] || [];
  if (transitions.length === 0) {
    btnContainer.innerHTML = '<span style="color:#94a3b8;font-size:0.85rem;">终态 — 无可用操作</span>';
  }
  transitions.forEach(t => {
    // hide "move to next step" if already last step
    if (t.nextStep && simState.stepIndex >= SIM_STEPS.length - 1) return;
    // hide "ship" if not at last step
    if (t.next === 'SHIPPED' && simState.stepIndex < SIM_STEPS.length - 1) return;
    const btn = document.createElement('button');
    btn.className = t.style;
    btn.textContent = t.action;
    btn.addEventListener('click', () => performTransition(t));
    btnContainer.appendChild(btn);
  });

  // Render log
  const logEl = document.getElementById('logEntries');
  logEl.innerHTML = simState.log.map(l =>
    `<div class="log-entry"><span class="log-time">${l.time}</span><span class="log-msg">${l.msg}</span></div>`
  ).join('');
  logEl.scrollTop = logEl.scrollHeight;

  // Render SVG
  renderStateSvg();
}

function performTransition(t) {
  simTimer += Math.floor(Math.random() * 30) + 5;
  const timeStr = formatTime(simTimer);

  let nextState = t.next;
  if (nextState === '_PREV') {
    nextState = simState.prevState || 'QUEUED';
  }

  const oldLabel = LOT_STATES[simState.state].label;
  const newLabel = LOT_STATES[nextState].label;

  if (t.nextStep) {
    simState.stepIndex++;
  }

  simState.prevState = simState.state;
  simState.state = nextState;

  let msg = `${t.action} — 状态: ${oldLabel} → ${newLabel}`;
  if (t.nextStep) {
    msg += ` | 进入工序 Step ${simState.stepIndex + 1}: ${SIM_STEPS[simState.stepIndex]}`;
  }
  if (nextState === 'PROCESSING') {
    msg += ` | 绑定设备 EQP-${String(simState.stepIndex + 1).padStart(3, '0')}`;
  }
  simState.log.push({ time: timeStr, msg });
  renderSimulation();
}

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

/* -------- SVG State Diagram -------- */
function renderStateSvg() {
  const svg = document.getElementById('stateSvg');
  const nodes = [
    { id: 'CREATED',    label: '已创建',  x: 90,  y: 60 },
    { id: 'QUEUED',     label: '排队中',  x: 260, y: 60 },
    { id: 'PROCESSING', label: '加工中',  x: 430, y: 60 },
    { id: 'COMPLETED',  label: '已完成',  x: 600, y: 60 },
    { id: 'HOLD',       label: '已暂停',  x: 345, y: 200 },
    { id: 'SHIPPED',    label: '已出货',  x: 500, y: 340 },
    { id: 'SCRAPPED',   label: '已报废',  x: 660, y: 200 }
  ];
  const edges = [
    { from: 'CREATED', to: 'QUEUED', label: '排队' },
    { from: 'QUEUED', to: 'PROCESSING', label: 'Track In' },
    { from: 'PROCESSING', to: 'COMPLETED', label: 'Track Out' },
    { from: 'COMPLETED', to: 'SHIPPED', label: '出货' },
    { from: 'COMPLETED', to: 'QUEUED', label: '下一工序', curved: -40 },
    { from: 'QUEUED', to: 'HOLD', label: 'Hold' },
    { from: 'PROCESSING', to: 'HOLD', label: 'Hold' },
    { from: 'PROCESSING', to: 'SCRAPPED', label: 'Scrap' },
    { from: 'COMPLETED', to: 'SCRAPPED', label: 'Scrap' }
  ];
  const W = 120, H = 44;
  const nodeMap = {};
  nodes.forEach(n => nodeMap[n.id] = n);

  // determine which nodes are "done" (visited)
  const visited = new Set();
  const history = simState.log.map(() => null); // we'll track via state
  // Simple approach: mark current and previous states
  if (simState.prevState) visited.add(simState.prevState);
  visited.add(simState.state);

  let svgContent = `<defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8"/></marker>
    <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="${'#2563eb'}"/></marker></defs>`;

  // Draw edges
  edges.forEach(e => {
    const from = nodeMap[e.from];
    const to = nodeMap[e.to];
    const isActive = simState.state === e.from || (simState.prevState === e.from && simState.state === e.to);
    const cls = isActive ? 'svg-arrow svg-arrow-active' : 'svg-arrow';
    const marker = isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead)';

    const x1 = from.x + W/2 * Math.sign(to.x - from.x || 0) + (Math.sign(to.x - from.x) === 0 ? 0 : 0);
    const y1 = from.y + (to.y > from.y ? H/2 : (to.y < from.y ? -H/2 : 0));
    const x2 = to.x - W/2 * Math.sign(to.x - from.x || 0);
    const y2 = to.y + (from.y > to.y ? H/2 : (from.y < to.y ? -H/2 : 0));

    // Adjust connection points
    let sx = from.x, sy = from.y, ex = to.x, ey = to.y;
    if (Math.abs(to.x - from.x) > Math.abs(to.y - from.y)) {
      // Horizontal connection
      sx = from.x + (to.x > from.x ? W/2 : -W/2);
      ex = to.x + (to.x > from.x ? -W/2 : W/2);
      sy = from.y;
      ey = to.y;
    } else {
      // Vertical connection
      sx = from.x;
      ex = to.x;
      sy = from.y + (to.y > from.y ? H/2 : -H/2);
      ey = to.y + (to.y > from.y ? -H/2 : H/2);
    }

    if (e.curved) {
      const mx = (sx + ex) / 2;
      const my = (sy + ey) / 2 + e.curved;
      svgContent += `<path d="M${sx},${sy} Q${mx},${my} ${ex},${ey}" class="${cls}" style="marker-end:${marker}" />`;
      svgContent += `<text x="${mx}" y="${my - 8}" class="svg-edge-label">${e.label}</text>`;
    } else {
      svgContent += `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" class="${cls}" style="marker-end:${marker}" />`;
      const lx = (sx + ex) / 2;
      const ly = (sy + ey) / 2 - 8;
      svgContent += `<text x="${lx}" y="${ly}" class="svg-edge-label">${e.label}</text>`;
    }
  });

  // Draw nodes
  nodes.forEach(n => {
    let cls = 'svg-state svg-state-inactive';
    let lblCls = 'svg-label';
    if (n.id === simState.state) {
      cls = 'svg-state svg-state-active';
      lblCls = 'svg-label svg-label-active';
    } else if (visited.has(n.id)) {
      cls = 'svg-state svg-state-done';
    }
    svgContent += `<rect x="${n.x - W/2}" y="${n.y - H/2}" width="${W}" height="${H}" class="${cls}" rx="8" ry="8" />`;
    svgContent += `<text x="${n.x}" y="${n.y}" class="${lblCls}">${n.label}</text>`;
  });

  svg.innerHTML = svgContent;
}

/* ================== Function Map Module ================== */
const functionMapData = [
  {
    icon: '📦', name: 'Lot 管理', items: [
      { name: 'Lot 创建', desc: '创建新的生产批次，关联工单与工艺路线' },
      { name: 'Lot 查询', desc: '按 Lot ID、产品、状态等条件查询批次信息' },
      { name: 'Track In（入站）', desc: '批次进入工序站点，绑定加工设备' },
      { name: 'Track Out（出站）', desc: '批次完成当前工序加工，记录结果' },
      { name: 'Lot Hold', desc: '冻结批次流转，用于质量或工艺问题处理' },
      { name: 'Lot Release', desc: '解除批次暂停状态，恢复正常流转' },
      { name: 'Lot Split', desc: '将一个批次拆分为多个子批次' },
      { name: 'Lot Merge', desc: '将多个子批次合并回主批次' },
      { name: 'Lot Scrap', desc: '标记批次报废并记录原因' },
      { name: 'Lot 历史查询', desc: '查看批次完整操作历史与状态变迁' }
    ]
  },
  {
    icon: '⚙️', name: '设备管理', items: [
      { name: '设备注册', desc: '注册新设备，定义设备类型与属性' },
      { name: '设备状态管理', desc: '管理设备的 Idle/Run/Down/PM 状态' },
      { name: '设备能力配置', desc: '配置设备可执行的工序与配方' },
      { name: '设备组管理', desc: '按功能或区域组织设备分组' },
      { name: '设备 Chamber 管理', desc: '管理多腔设备的各个 Chamber' },
      { name: 'E10 状态追踪', desc: '按 SEMI E10 标准追踪设备状态' },
      { name: '设备利用率报表', desc: 'OEE 分析与设备效率统计' }
    ]
  },
  {
    icon: '🔧', name: '维护管理 (PMS)', items: [
      { name: 'PM 计划定义', desc: '定义预防性维护计划与触发条件' },
      { name: 'PM 任务执行', desc: '执行维护任务，记录维护内容与结果' },
      { name: 'PM 计数器管理', desc: '管理基于时间/次数的维护计数器' },
      { name: 'PM 到期预警', desc: '即将到期的维护任务预警通知' },
      { name: '备件管理', desc: '维护备件库存与消耗记录' },
      { name: '维护历史查询', desc: '查询设备完整维护记录' }
    ]
  },
  {
    icon: '✅', name: '质量管理', items: [
      { name: 'SPC 控制图', desc: '统计过程控制图的配置与监控' },
      { name: 'OCAP 管理', desc: '异常处理程序的定义与执行' },
      { name: 'FDC 配置', desc: '故障检测与分类规则配置' },
      { name: '数据采集 (EDC)', desc: '工序数据采集模板与规则配置' },
      { name: '缺陷记录', desc: '记录和分类产品缺陷信息' },
      { name: '良率分析', desc: '按产品/工序/时间段分析良率趋势' },
      { name: '质量报告', desc: '生成质量统计与趋势分析报告' }
    ]
  },
  {
    icon: '🧪', name: '配方管理 (RMS)', items: [
      { name: 'Recipe 创建/编辑', desc: '创建和编辑加工配方参数' },
      { name: 'Recipe 版本管理', desc: '配方版本控制与历史追踪' },
      { name: 'Recipe 审批流程', desc: '新配方或变更的审批工作流' },
      { name: 'Recipe 下载管理', desc: '配方下载到设备的验证与控制' },
      { name: 'Golden Recipe', desc: '标准配方基线管理' },
      { name: 'Recipe-设备映射', desc: '配置配方与设备的适用关系' }
    ]
  },
  {
    icon: '🚚', name: '物料与库存', items: [
      { name: '物料入库', desc: '原材料和辅材入库登记' },
      { name: '物料出库', desc: '生产领料和出库管理' },
      { name: 'WIP 追踪', desc: '在制品实时位置与状态追踪' },
      { name: '库存盘点', desc: '定期或循环盘点管理' },
      { name: 'BOM 管理', desc: '产品物料清单维护' },
      { name: '安全库存预警', desc: '库存低于安全水位时自动告警' },
      { name: '物料追溯', desc: '原材料批号到成品的正反向追溯' }
    ]
  },
  {
    icon: '📊', name: '报表与分析', items: [
      { name: '生产日报/周报', desc: '产量、投入量、完成量统计' },
      { name: 'OEE 报表', desc: '设备综合效率分析报表' },
      { name: 'WIP 分布报表', desc: '在制品各工序分布与老化分析' },
      { name: '良率报表', desc: '产品良率趋势与对比分析' },
      { name: '周期时间报表', desc: '生产周期时间统计与分析' },
      { name: '追溯报告', desc: '产品全生命周期追溯报告' },
      { name: '自定义看板', desc: '可配置的实时生产监控看板' }
    ]
  },
  {
    icon: '🔐', name: '系统管理', items: [
      { name: '用户管理', desc: '用户账户的创建、修改与停用' },
      { name: '角色权限管理', desc: '基于角色的访问控制 (RBAC) 配置' },
      { name: '电子签名', desc: '关键操作的电子签名认证' },
      { name: '审计日志', desc: '系统操作审计追踪与查询' },
      { name: 'Reticle 管理', desc: '光刻掩模的库存、使用与清洗管理' },
      { name: '系统参数配置', desc: '全局参数与业务规则配置' },
      { name: '接口管理', desc: 'ERP/SCADA/LIMS 等外部系统接口配置' }
    ]
  }
];

function initFunctionMap() {
  const tree = document.getElementById('fmapTree');
  functionMapData.forEach((cat, ci) => {
    const div = document.createElement('div');
    div.className = 'fmap-category';
    div.innerHTML = `
      <div class="fmap-cat-header" data-cat="${ci}">
        <span class="arrow">▶</span>
        <span class="cat-icon">${cat.icon}</span>
        <span class="cat-name">${cat.name}</span>
        <span class="cat-count">${cat.items.length} 项</span>
      </div>
      <div class="fmap-items" id="fmapItems${ci}">
        ${cat.items.map(item => `
          <div class="fmap-item">
            <div class="fmap-item-name">${item.name}</div>
            <div class="fmap-item-desc">${item.desc}</div>
          </div>
        `).join('')}
      </div>
    `;
    tree.appendChild(div);
    div.querySelector('.fmap-cat-header').addEventListener('click', () => {
      const items = document.getElementById(`fmapItems${ci}`);
      const arrow = div.querySelector('.arrow');
      items.classList.toggle('open');
      arrow.classList.toggle('open');
    });
  });

  document.getElementById('btnExpandAll').addEventListener('click', () => {
    document.querySelectorAll('.fmap-items').forEach(el => el.classList.add('open'));
    document.querySelectorAll('.fmap-cat-header .arrow').forEach(el => el.classList.add('open'));
  });
  document.getElementById('btnCollapseAll').addEventListener('click', () => {
    document.querySelectorAll('.fmap-items').forEach(el => el.classList.remove('open'));
    document.querySelectorAll('.fmap-cat-header .arrow').forEach(el => el.classList.remove('open'));
  });
}

/* ==================== Quiz Module ====================== */
const quizQuestions = [
  {
    question: 'OCAP（Out-of-Control Action Plan）的主要用途是什么？',
    options: [
      'A. 设备日常保养计划',
      'B. SPC 检测到异常后的标准化处理流程',
      'C. 生产排程优化算法',
      'D. 物料采购审批流程'
    ],
    answer: 1,
    explanation: 'OCAP 是 SPC 检测到过程异常后触发的标准化处理程序，定义了从发现异常到诊断原因、采取纠正措施、验证效果的完整闭环流程。'
  },
  {
    question: '在 MES 系统中，Lot 的 Track In 操作表示什么？',
    options: [
      'A. 批次被创建并分配了工单号',
      'B. 批次进入某个工序站点并绑定加工设备',
      'C. 批次完成加工并离开当前工序',
      'D. 批次从暂停状态恢复流转'
    ],
    answer: 1,
    explanation: 'Track In（入站）表示批次进入某个工序站点并与加工设备绑定，开始该工序的加工过程。Track Out 则表示完成当前工序的加工。'
  },
  {
    question: 'PMS（Preventive Maintenance System）的核心功能是什么？',
    options: [
      'A. 实时监控产品质量参数',
      'B. 基于运行时间或加工数量触发预防性维护任务',
      'C. 管理生产工艺配方',
      'D. 追踪在制品库存'
    ],
    answer: 1,
    explanation: 'PMS（预防性维护系统）基于设备运行时间、加工计数或关键参数条件自动触发维护任务，确保设备在最佳状态运行，减少故障停机。'
  },
  {
    question: 'Reticle 在半导体制造中是什么？',
    options: [
      'A. 一种化学清洗溶液',
      'B. 用于光刻工艺的掩模版',
      'C. 晶圆切割的刀具',
      'D. 离子注入的气体源'
    ],
    answer: 1,
    explanation: 'Reticle（光刻掩模/光罩）是半导体光刻工艺的核心耗材，上面刻有电路图案，通过光刻机将图案转印到晶圆上。单片价值可达数十万美元，需要 MES 进行严格的生命周期管理。'
  },
  {
    question: '以下哪个不是 SPC 控制图中的常用指标？',
    options: [
      'A. UCL（上控制限）',
      'B. LCL（下控制限）',
      'C. OEE（设备综合效率）',
      'D. Cpk（过程能力指数）'
    ],
    answer: 2,
    explanation: 'OEE（Overall Equipment Effectiveness）是设备管理的指标，不属于 SPC 控制图的组成部分。UCL/LCL 是控制限，Cpk 是过程能力指数，都是 SPC 的核心指标。'
  },
  {
    question: 'MES 系统在 ISA-95 架构中处于哪一层？',
    options: [
      'A. Level 0-1 — 现场设备与传感器层',
      'B. Level 2 — 过程控制层',
      'C. Level 3 — 制造运营管理层',
      'D. Level 4 — 企业业务计划层'
    ],
    answer: 2,
    explanation: 'ISA-95 标准中，MES 位于 Level 3（制造运营管理层），向上连接 Level 4 的 ERP 企业资源计划，向下连接 Level 2 的过程控制系统（SCADA/PLC）。'
  },
  {
    question: 'Lot Split（批次拆分）操作通常在什么场景下使用？',
    options: [
      'A. 批次需要加急生产时',
      'B. 需要将部分产品送去不同工艺路线或不同设备加工',
      'C. 设备故障导致停机时',
      'D. 产品良率达到 100% 时'
    ],
    answer: 1,
    explanation: 'Lot Split 用于将一个批次拆分为多个子批次，典型场景包括：部分产品需走不同工艺路线、部分产品需送不同设备加工、质量问题需要隔离部分产品等。拆分后各子批次可独立流转。'
  },
  {
    question: 'Golden Recipe 在配方管理中的作用是什么？',
    options: [
      'A. 标记即将过期的配方',
      'B. 作为标准基线配方，用于对比和验证',
      'C. 仅供工程实验使用的配方',
      'D. 自动删除旧版本配方'
    ],
    answer: 1,
    explanation: 'Golden Recipe 是经过验证的标准基线配方，作为生产的参考基准。所有配方变更都与 Golden Recipe 进行对比，确保工艺参数在可接受范围内，防止参数漂移导致质量问题。'
  }
];

let quizState = {};

function initQuiz() {
  resetQuiz();
  document.getElementById('btnRetry').addEventListener('click', resetQuiz);
}

function resetQuiz() {
  quizState = { current: 0, answered: new Array(quizQuestions.length).fill(null), score: 0 };
  document.getElementById('quizResult').classList.add('hidden');
  renderQuiz();
}

function renderQuiz() {
  const body = document.getElementById('quizBody');
  body.innerHTML = '';
  const answered = quizState.answered.filter(a => a !== null).length;
  document.getElementById('progressFill').style.width = `${(answered / quizQuestions.length) * 100}%`;
  document.getElementById('progressText').textContent = `${answered} / ${quizQuestions.length}`;

  quizQuestions.forEach((q, qi) => {
    const div = document.createElement('div');
    div.className = 'quiz-question';
    div.id = `q${qi}`;
    const isAnswered = quizState.answered[qi] !== null;
    const isCorrect = quizState.answered[qi] === q.answer;

    let optionsHtml = q.options.map((opt, oi) => {
      let cls = 'q-option';
      if (isAnswered) {
        if (oi === q.answer) cls += ' correct';
        else if (oi === quizState.answered[qi]) cls += ' wrong';
      } else {
        cls += ''; // clickable
      }
      return `<div class="${cls}" data-q="${qi}" data-o="${oi}">
        <span class="opt-letter">${String.fromCharCode(65 + oi)}</span>
        <span>${opt.substring(3)}</span>
      </div>`;
    }).join('');

    let feedbackHtml = '';
    if (isAnswered) {
      const fbClass = isCorrect ? 'correct-fb' : 'wrong-fb';
      const prefix = isCorrect ? '✓ 正确！' : '✗ 错误。';
      feedbackHtml = `<div class="q-feedback show ${fbClass}">${prefix} ${q.explanation}</div>`;
    }

    div.innerHTML = `
      <div class="q-number">第 ${qi + 1} 题 / 共 ${quizQuestions.length} 题</div>
      <div class="q-text">${q.question}</div>
      <div class="q-options">${optionsHtml}</div>
      ${feedbackHtml}
    `;
    body.appendChild(div);
  });

  // Attach click handlers
  document.querySelectorAll('.q-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const qi = parseInt(opt.dataset.q);
      const oi = parseInt(opt.dataset.o);
      if (quizState.answered[qi] !== null) return; // already answered
      quizState.answered[qi] = oi;
      if (oi === quizQuestions[qi].answer) quizState.score++;
      renderQuiz();
      checkQuizComplete();
    });
  });
}

function checkQuizComplete() {
  const allAnswered = quizState.answered.every(a => a !== null);
  if (!allAnswered) return;
  const result = document.getElementById('quizResult');
  result.classList.remove('hidden');
  const pct = Math.round((quizState.score / quizQuestions.length) * 100);
  let title, desc;
  if (pct >= 90) { title = '🎉 优秀！'; desc = `你答对了 ${quizState.score}/${quizQuestions.length} 题（${pct}%），对 MES 核心概念掌握非常扎实！`; }
  else if (pct >= 70) { title = '👍 良好！'; desc = `你答对了 ${quizState.score}/${quizQuestions.length} 题（${pct}%），对 MES 有较好的理解，继续加油！`; }
  else if (pct >= 50) { title = '📚 继续努力'; desc = `你答对了 ${quizState.score}/${quizQuestions.length} 题（${pct}%），建议回顾知识模块加深理解。`; }
  else { title = '💪 需要加强'; desc = `你答对了 ${quizState.score}/${quizQuestions.length} 题（${pct}%），建议先学习知识模块再来挑战！`; }
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultDesc').textContent = desc;
}
