/* ============================================
   MES Interactive Tutorial - Lot State Machine Data
   ============================================ */

'use strict';

// ============================================
// Lot State Definitions
// ============================================
var LOT_STATES = {
  CREATED:   { id: 'created',   name: '已创建', color: '#9e9e9e' },
  STARTED:   { id: 'started',   name: '已开始', color: '#00bcd4' },
  WAIT:      { id: 'wait',      name: '等待中', color: '#2196f3' },
  RUN:       { id: 'run',       name: '运行中', color: '#4caf50' },
  HOLD:      { id: 'hold',      name: '已扣留', color: '#ff9800' },
  COMPLETED: { id: 'completed', name: '已完成', color: '#1a237e' },
  SHIPPED:   { id: 'shipped',   name: '已出货', color: '#9c27b0' },
  SCRAPPED:  { id: 'scrapped',  name: '已报废', color: '#f44336' }
};

// ============================================
// Action Definitions
// Each action: name, fromState, toState, desc, category, btnClass
// ============================================
var LOT_ACTIONS = {
  startLot: {
    id: 'startLot',
    name: '开始批次',
    fromState: 'created',
    toState: 'started',
    desc: '将新建的批次启动，进入已开始状态',
    category: '基础',
    btnClass: 'primary'
  },
  enterProcess: {
    id: 'enterProcess',
    name: '进入工序',
    fromState: 'started',
    toState: 'wait',
    desc: '批次进入第一道工序，开始等待加工',
    category: '基础',
    btnClass: 'primary'
  },
  trackIn: {
    id: 'trackIn',
    name: '进站 TrackIn',
    fromState: 'wait',
    toState: 'run',
    desc: '批次进入设备开始加工',
    category: '跟踪',
    btnClass: 'primary'
  },
  trackOut: {
    id: 'trackOut',
    name: '出站 TrackOut',
    fromState: 'run',
    toState: 'wait',
    desc: '批次完成当前工序加工，前进到下一工序',
    category: '跟踪',
    btnClass: 'primary'
  },
  cancelTrackIn: {
    id: 'cancelTrackIn',
    name: '取消进站',
    fromState: 'run',
    toState: 'wait',
    desc: '取消进站操作，批次回到等待状态',
    category: '跟踪',
    btnClass: 'warning'
  },
  holdLot: {
    id: 'holdLot',
    name: '扣留批次 Hold',
    fromState: 'wait',
    toState: 'hold',
    desc: '将等待中的批次扣留，暂停生产流程',
    category: 'Hold',
    btnClass: 'warning'
  },
  holdRunLot: {
    id: 'holdRunLot',
    name: '运行中扣留',
    fromState: 'run',
    toState: 'hold',
    desc: '将运行中的批次直接扣留',
    category: 'Hold',
    btnClass: 'warning'
  },
  releaseHold: {
    id: 'releaseHold',
    name: '释放扣留 Release',
    fromState: 'hold',
    toState: 'wait',
    desc: '释放被扣留的批次，恢复到等待状态',
    category: 'Hold',
    btnClass: 'success'
  },
  scrapLot: {
    id: 'scrapLot',
    name: '报废批次 Scrap',
    fromState: 'hold',
    toState: 'scrapped',
    desc: '将扣留的批次报废处理',
    category: '报废',
    btnClass: 'danger'
  },
  unscrapLot: {
    id: 'unscrapLot',
    name: '反报废 Unscrap',
    fromState: 'scrapped',
    toState: 'hold',
    desc: '撤销报废操作，批次恢复到扣留状态',
    category: '报废',
    btnClass: ''
  },
  splitLot: {
    id: 'splitLot',
    name: '拆批 Split',
    fromState: 'wait',
    toState: 'wait',
    desc: '将批次拆分为多个子批次',
    category: '批次操作',
    btnClass: ''
  },
  mergeLot: {
    id: 'mergeLot',
    name: '合批 Merge',
    fromState: 'wait',
    toState: 'wait',
    desc: '将多个批次合并为一个批次',
    category: '批次操作',
    btnClass: ''
  },
  changeOp: {
    id: 'changeOp',
    name: '变更工序',
    fromState: 'wait',
    toState: 'wait',
    desc: '将批次移动到指定工序',
    category: '工序操作',
    btnClass: ''
  },
  backupOp: {
    id: 'backupOp',
    name: '返回工序 Backup',
    fromState: 'wait',
    toState: 'wait',
    desc: '将批次回退到上一个工序',
    category: '工序操作',
    btnClass: ''
  },
  skipOp: {
    id: 'skipOp',
    name: '跳过工序 Skip',
    fromState: 'wait',
    toState: 'wait',
    desc: '跳过当前工序，前进到下一工序',
    category: '工序操作',
    btnClass: ''
  },
  rework: {
    id: 'rework',
    name: '返工 Rework',
    fromState: 'wait',
    toState: 'wait',
    desc: '将批次设为返工状态，回退到指定工序重新加工',
    category: '高级',
    btnClass: 'warning'
  },
  completeRework: {
    id: 'completeRework',
    name: '完成返工',
    fromState: 'wait',
    toState: 'wait',
    desc: '完成返工流程，恢复正常生产',
    category: '高级',
    btnClass: 'success'
  },
  branch: {
    id: 'branch',
    name: '分支 Branch',
    fromState: 'wait',
    toState: 'wait',
    desc: '将批次进入分支流程',
    category: '高级',
    btnClass: ''
  },
  completeBranch: {
    id: 'completeBranch',
    name: '结束分支',
    fromState: 'wait',
    toState: 'wait',
    desc: '结束分支流程，回到主流程',
    category: '高级',
    btnClass: 'success'
  },
  completeLot: {
    id: 'completeLot',
    name: '完成批次',
    fromState: 'wait',
    toState: 'completed',
    desc: '批次完成所有工序，标记为已完成',
    category: '完成',
    btnClass: 'success'
  },
  shipLot: {
    id: 'shipLot',
    name: '出货 Ship',
    fromState: 'completed',
    toState: 'shipped',
    desc: '将已完成的批次出货',
    category: '出货',
    btnClass: 'primary'
  },
  unshipLot: {
    id: 'unshipLot',
    name: '取消出货',
    fromState: 'shipped',
    toState: 'completed',
    desc: '撤销出货操作，批次恢复到已完成状态',
    category: '出货',
    btnClass: 'warning'
  },
  bankIn: {
    id: 'bankIn',
    name: '入Bank',
    fromState: 'wait',
    toState: 'wait',
    desc: '将批次存入Bank（暂存区）',
    category: 'Bank',
    btnClass: ''
  },
  bankOut: {
    id: 'bankOut',
    name: '出Bank',
    fromState: 'wait',
    toState: 'wait',
    desc: '将批次从Bank（暂存区）取出',
    category: 'Bank',
    btnClass: ''
  }
};

// ============================================
// Sample Process Flow (工序列表)
// ============================================
var SAMPLE_PROCESS_FLOW = {
  name: "PROD-FLOW-001",
  revision: "1.0",
  operations: [
    { seq: 1, name: "CVD-01",  type: "Production", desc: "化学气相沉积" },
    { seq: 2, name: "PHT-01",  type: "Production", desc: "光刻" },
    { seq: 3, name: "ETCH-01", type: "Production", desc: "蚀刻" },
    { seq: 4, name: "INSP-01", type: "Metrology",  desc: "检测" },
    { seq: 5, name: "CVD-02",  type: "Production", desc: "化学气相沉积" },
    { seq: 6, name: "PHT-02",  type: "Production", desc: "光刻" },
    { seq: 7, name: "ETCH-02", type: "Production", desc: "蚀刻" },
    { seq: 8, name: "INSP-02", type: "Metrology",  desc: "最终检测" }
  ]
};

// ============================================
// Initial Lot Data
// ============================================
var INITIAL_LOT = {
  lotName: "LOT-2025-001",
  productSpec: "PROD-A-001",
  processFlow: "PROD-FLOW-001",
  quantity: 25,
  priority: 3,
  state: "created",
  holdState: "none",       // none, hold
  currentOpIndex: 0,
  bankState: "none",       // none, in
  reworkState: "none",     // none, rework
  branchState: "none",     // none, branch
  history: []
};
