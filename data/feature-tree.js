/* ============================================
   MES Feature Tree Data - 8 Major Categories
   ============================================ */

'use strict';

var FEATURE_TREE = [
  {
    id: "stb",
    name: "生产计划与开始",
    icon: "📋",
    color: "#1a237e",
    description: "制定生产计划，创建工单和批次",
    items: [
      { id: "createWO", name: "创建工单", engName: "CreateWorkOrder", desc: "为加工Lot创建工作单和规范，包含产品类型、计划时间、数量等信息" },
      { id: "changeWoInfo", name: "更改工单信息", engName: "ChangeWoInfo", desc: "修改已创建工单的属性信息" },
      { id: "reserveWOPlan", name: "预约工单计划", engName: "ReserveWorkOrderPlan", desc: "预约生产计划时间" },
      { id: "closeWO", name: "关闭工单", engName: "CloseWO", desc: "关闭已完成的工单" },
      { id: "holdWO", name: "Hold工单", engName: "HoldWO", desc: "暂停工单执行" },
      { id: "releaseWO", name: "释放工单", engName: "ReleaseWO", desc: "恢复被Hold的工单" },
      { id: "createLot", name: "创建批次", engName: "CreateLot", desc: "根据工单创建生产批次" },
      { id: "cancelCreateLot", name: "取消创建批次", engName: "CancelCreateLot", desc: "撤销已创建的批次" },
      { id: "receivePlan", name: "接收计划", engName: "ReceivePlan", desc: "接收来自ERP的生产计划" },
      { id: "cancelReceivePlan", name: "取消接收计划", engName: "CancelReceivePlan", desc: "取消已接收的计划" },
      { id: "startLot", name: "开始批次", engName: "StartLot", desc: "启动批次进入生产流程" },
      { id: "startProduct", name: "开始产品", engName: "StartProduct", desc: "启动单个产品的生产" }
    ]
  },
  {
    id: "lot",
    name: "批次跟踪与操作",
    icon: "🔄",
    color: "#2196f3",
    description: "跟踪批次状态，执行进出站等核心操作",
    items: [
      { id: "firstGlass", name: "首个产品流程", engName: "FirstGlass", desc: "记录批次中第一个产品的流程" },
      { id: "reserveLot", name: "预约批次", engName: "ReserveLot", desc: "预约批次到指定设备" },
      { id: "productSampling", name: "产品抽选", engName: "ProductSampling", desc: "对产品进行抽样选择" },
      { id: "trackIn", name: "进站", engName: "TrackIn", desc: "批次进入设备开始加工" },
      { id: "trackOut", name: "出站", engName: "TrackOut", desc: "批次完成加工离开设备" },
      { id: "cancelTrackIn", name: "取消进站", engName: "CancelTrackIn", desc: "撤销进站操作" },
      { id: "recipeSync", name: "Recipe同步", engName: "RecipeSync", desc: "同步设备Recipe参数" },
      { id: "samplingSpec", name: "抽检规格", engName: "SamplingSpec", desc: "配置抽检规格和规则" },
      { id: "samplingLotList", name: "抽检批次列表", engName: "SamplingLotList", desc: "查看抽检批次信息" },
      { id: "changeProcessOp", name: "更改制程", engName: "ChangeProcessOperation", desc: "变更批次当前工序" },
      { id: "backupOp", name: "返回制程", engName: "BackupOperation", desc: "回退到上一工序" },
      { id: "skipOp", name: "跳过制程", engName: "SkipOperation", desc: "跳过当前工序" },
      { id: "changeProductSpec", name: "更改产品规格", engName: "ChangeProductSpec", desc: "变更产品规格信息" },
      { id: "changeFlowRevision", name: "更改流程版本", engName: "ChangeFlowRevision", desc: "变更工艺流程版本" },
      { id: "setFlag", name: "设置开关状态", engName: "SetFlag", desc: "设置批次的各种标志位" },
      { id: "holdLot", name: "扣留批次", engName: "HoldLot", desc: "暂停批次生产" },
      { id: "releaseHoldLot", name: "释放扣留", engName: "ReleaseHoldLot", desc: "恢复被扣留的批次" },
      { id: "changeLotAttr", name: "更改批次属性", engName: "ChangeLotAttribute", desc: "修改批次优先级、等级等属性" },
      { id: "scrapLot", name: "报废批次", engName: "ScrapLot", desc: "报废不合格的产品" },
      { id: "unscrapLot", name: "反报废", engName: "UnscrapLot", desc: "撤销报废操作" },
      { id: "splitLot", name: "拆批", engName: "SplitLot", desc: "将一个批次拆分为多个子批次" },
      { id: "mergeLot", name: "合批", engName: "MergeLot", desc: "将多个批次合并为一个" },
      { id: "finalScrap", name: "最终报废", engName: "FinalScrap", desc: "对批次进行最终报废处理" },
      { id: "cancelFinalScrap", name: "取消最终报废", engName: "CancelFinalScrap", desc: "撤销最终报废" }
    ]
  },
  {
    id: "cst",
    name: "载具管理",
    icon: "📦",
    color: "#00bcd4",
    description: "管理载具的创建、分配、清洗和生命周期",
    items: [
      { id: "carrierMain", name: "载具主页", engName: "CarrierMain", desc: "查看所有载具状态概览" },
      { id: "createCarrier", name: "创建载具", engName: "CreateCarrier", desc: "新增载具信息" },
      { id: "changeCarrier", name: "更改载具信息", engName: "ChangeCarrier", desc: "修改载具属性" },
      { id: "cleanCarrier", name: "清洗载具", engName: "CleanCarrier", desc: "记录载具清洗操作" },
      { id: "changeCarrierLoc", name: "更改载具位置", engName: "ChangeCarrierLocation", desc: "变更载具物理位置" },
      { id: "exchangeCarrier", name: "交换载具", engName: "ExchangeCarrier", desc: "交换两个载具的内容" },
      { id: "changeNewCarrier", name: "更换新载具", engName: "ChangeNewCarrier", desc: "将产品转移到新载具" },
      { id: "combineCarrier", name: "组合载具", engName: "CombineCarrier", desc: "组合多个载具" },
      { id: "assignCarrier", name: "分配载具", engName: "AssignCarrier", desc: "将载具分配给批次" },
      { id: "deAssignCarrier", name: "取消分配载具", engName: "DeAssignCarrier", desc: "取消载具分配" },
      { id: "holdCarrier", name: "Hold载具", engName: "HoldCarrier", desc: "暂停载具使用" },
      { id: "releaseCarrier", name: "释放载具", engName: "ReleaseCarrier", desc: "恢复载具使用" },
      { id: "scrapCarrier", name: "报废载具", engName: "ScrapCarrier", desc: "报废损坏的载具" },
      { id: "unScrapCarrier", name: "取消报废载具", engName: "UnScrapCarrier", desc: "撤销载具报废" }
    ]
  },
  {
    id: "machine",
    name: "设备管理",
    icon: "⚙️",
    color: "#4caf50",
    description: "管理设备状态、端口和批处理任务",
    items: [
      { id: "changeMachineState", name: "更改设备状态", engName: "ChangeMachineState", desc: "变更设备运行状态" },
      { id: "changePortState", name: "更改端口状态", engName: "ChangePortState", desc: "变更设备端口搬送状态" },
      { id: "machineHold", name: "Hold设备", engName: "MachineHold", desc: "暂停设备运行" },
      { id: "machineRelease", name: "释放Hold设备", engName: "MachineRelease", desc: "恢复设备运行" },
      { id: "createBatch", name: "创建Batch", engName: "CreateBatch", desc: "创建设备批处理任务" },
      { id: "cancelBatch", name: "取消创建Batch", engName: "CancelBatch", desc: "取消批处理任务" },
      { id: "batchTrackIn", name: "Batch投入", engName: "BatchTrackIn", desc: "批处理任务开始执行" },
      { id: "batchTrackOut", name: "Batch产出", engName: "BatchTrackOut", desc: "批处理任务完成" },
      { id: "cancelBatchTrackIn", name: "取消Batch投入", engName: "CancelBatchTrackIn", desc: "取消批处理执行" }
    ]
  },
  {
    id: "advanced",
    name: "高级生产功能",
    icon: "🚀",
    color: "#9c27b0",
    description: "分支、返工、出货等高级生产操作",
    items: [
      { id: "branch", name: "分支", engName: "Branch", desc: "从主流程进入分支流程" },
      { id: "cancelBranch", name: "取消分支", engName: "CancelBranch", desc: "撤销分支操作" },
      { id: "completeBranch", name: "结束分支", engName: "CompleteBranch", desc: "完成分支流程" },
      { id: "rework", name: "返工", engName: "Rework", desc: "对不合格产品进行返工" },
      { id: "cancelRework", name: "取消返工", engName: "CancelRework", desc: "撤销返工操作" },
      { id: "completeRework", name: "完成返工", engName: "CompleteRework", desc: "完成返工流程" },
      { id: "cancelCompleteLot", name: "取消完成批次", engName: "CancelCompleteLot", desc: "撤销批次完成状态" },
      { id: "shipLot", name: "批次出货", engName: "ShipLot", desc: "将完成的批次出货" },
      { id: "unShipLot", name: "取消批次出货", engName: "UnShipLot", desc: "撤销出货操作" },
      { id: "setFutureAction", name: "设置未来操作", engName: "SetFutureAction", desc: "预设未来的操作计划" },
      { id: "futureActionHistory", name: "未来操作履历", engName: "FutureActionHistory", desc: "查看未来操作历史" },
      { id: "clearAlarm", name: "清除报警", engName: "ClearAlarm", desc: "清除已解决的报警信息" },
      { id: "ocapManagement", name: "OCAP管理", engName: "OcapManagement", desc: "管理失控行动计划" },
      { id: "ocapRegister", name: "操作计划注册", engName: "OcapRegister", desc: "注册新的操作计划" },
      { id: "ocapView", name: "操作计划视图", engName: "OcapView", desc: "查看操作计划执行情况" }
    ]
  },
  {
    id: "reticle",
    name: "Reticle与Recipe管理",
    icon: "🔬",
    color: "#ff5722",
    description: "管理Reticle生命周期和设备Recipe参数",
    items: [
      { id: "reticleMain", name: "Reticle主页", engName: "ReticleMain", desc: "查看所有Reticle信息" },
      { id: "createReticle", name: "创建Reticle", engName: "CreateReticle", desc: "新增Reticle记录" },
      { id: "changeReticleInfo", name: "更改Reticle信息", engName: "ChangeReticleInfo", desc: "修改Reticle属性" },
      { id: "cleanReticle", name: "清洗Reticle", engName: "CleanReticle", desc: "记录Reticle清洗" },
      { id: "holdReticle", name: "Hold Reticle", engName: "HoldReticle", desc: "暂停Reticle使用" },
      { id: "releaseReticle", name: "释放Reticle", engName: "ReleaseReticle", desc: "恢复Reticle使用" },
      { id: "reticleBankIn", name: "进ReticleBank", engName: "ReticleBankIn", desc: "Reticle入库" },
      { id: "reticleBankOut", name: "出ReticleBank", engName: "ReticleBankOut", desc: "Reticle出库" },
      { id: "scrapReticle", name: "报废Reticle", engName: "ScrapReticle", desc: "报废损坏的Reticle" },
      { id: "unScrapReticle", name: "取消报废Reticle", engName: "UnScrapReticle", desc: "撤销Reticle报废" },
      { id: "reticleTransport", name: "Reticle搬送", engName: "ReticleTransport", desc: "Reticle物理搬运" },
      { id: "mountReticle", name: "上Reticle", engName: "MountReticle", desc: "将Reticle安装到设备" },
      { id: "unmountReticle", name: "下Reticle", engName: "UnmountReticle", desc: "从设备卸下Reticle" },
      { id: "recipeManagement", name: "Recipe管理", engName: "RecipeManagement", desc: "管理设备Recipe参数" }
    ]
  },
  {
    id: "logistics",
    name: "物流库存与Bank",
    icon: "🏪",
    color: "#795548",
    description: "管理Bank存取、消耗品和物流搬送",
    items: [
      { id: "bankIn", name: "入Bank", engName: "BankIn", desc: "将批次存入Bank" },
      { id: "bankOut", name: "出Bank", engName: "BankOut", desc: "从Bank取出批次" },
      { id: "moveBank", name: "移动Bank", engName: "MoveBank", desc: "在Bank之间移动" },
      { id: "cancelMoveBank", name: "取消移动Bank", engName: "CancelMoveBank", desc: "取消Bank移动" },
      { id: "consumableMain", name: "消耗品主页", engName: "ConsumableMain", desc: "查看消耗品概览" },
      { id: "createConsumable", name: "创建消耗品", engName: "CreateConsumable", desc: "新增消耗品记录" },
      { id: "changeConsumableInfo", name: "消耗品信息变更", engName: "ChangeConsumableInfo", desc: "修改消耗品信息" },
      { id: "inspectConsumable", name: "消耗品检查", engName: "InspectConsumable", desc: "检查消耗品质量" },
      { id: "consumableStockReq", name: "消耗品库存请求", engName: "ConsumableStockRequest", desc: "请求消耗品入库" },
      { id: "consumableStockOut", name: "消耗品库存出库", engName: "ConsumableStockOut", desc: "消耗品出库" },
      { id: "consumableLoadUnload", name: "消耗品上下料", engName: "ConsumableLoadUnload", desc: "消耗品上料/下料" },
      { id: "consumableHold", name: "消耗品Hold", engName: "ConsumableHold", desc: "暂停消耗品使用" },
      { id: "consumableRelease", name: "消耗品释放Hold", engName: "ConsumableRelease", desc: "恢复消耗品使用" },
      { id: "consumableScrap", name: "消耗品报废", engName: "ConsumableScrap", desc: "报废消耗品" },
      { id: "consumableFreeze", name: "消耗品冷冻", engName: "ConsumableFreeze", desc: "冷冻消耗品" },
      { id: "consumableThaw", name: "消耗品解冻", engName: "ConsumableThaw", desc: "解冻消耗品" },
      { id: "stockerInventory", name: "Stocker库存管理", engName: "StockerInventory", desc: "管理Stocker存储" },
      { id: "transportCarrier", name: "搬送载具", engName: "TransportCarrier", desc: "搬运载具到指定位置" },
      { id: "viewTransportQueue", name: "查看搬送队列", engName: "ViewTransportQueue", desc: "查看搬送任务队列" }
    ]
  },
  {
    id: "inquiry",
    name: "查询与高级功能",
    icon: "🔍",
    color: "#607d8b",
    description: "查询履历信息和管理高级功能",
    items: [
      { id: "startLotList", name: "开始批次列表", engName: "StartLotList", desc: "查询已开始的批次" },
      { id: "shipLotList", name: "出货列表", engName: "ShipLotList", desc: "查询已出货的批次" },
      { id: "lotHistory", name: "批次履历", engName: "LotHistory", desc: "查看批次完整历史" },
      { id: "nextOpList", name: "下一个制程列表", engName: "NextOperationList", desc: "查看后续工序" },
      { id: "lotStepInquiry", name: "批次步骤查询", engName: "LotStepInquiry", desc: "查询批次步骤详情" },
      { id: "productHistory", name: "产品履历", engName: "ProductHistory", desc: "查看产品完整历史" },
      { id: "carrierInfo", name: "载具信息", engName: "CarrierInfo", desc: "查看载具详细信息" },
      { id: "carrierHistory", name: "载具履历", engName: "CarrierHistory", desc: "查看载具操作历史" },
      { id: "machineInfo", name: "设备信息", engName: "MachineInfo", desc: "查看设备详细信息" },
      { id: "maintenanceHistory", name: "维护履历", engName: "MaintenanceHistory", desc: "查看设备维护记录" },
      { id: "machineHistory", name: "设备履历", engName: "MachineHistory", desc: "查看设备操作历史" },
      { id: "machineEfficiency", name: "设备效率", engName: "MachineEfficiency", desc: "查看设备效率数据" },
      { id: "reticleInfo", name: "Reticle信息", engName: "ReticleInfo", desc: "查看Reticle详情" },
      { id: "reticleHistory", name: "Reticle履历", engName: "ReticleHistory", desc: "查看Reticle操作历史" },
      { id: "portHistory", name: "端口履历", engName: "PortHistory", desc: "查看端口操作历史" },
      { id: "consumableHistory", name: "消耗品履历", engName: "ConsumableHistory", desc: "查看消耗品历史" },
      { id: "npwManagement", name: "NPW管理", engName: "NPWManagement", desc: "管理非生产晶圆" },
      { id: "pilotManagement", name: "Pilot管理", engName: "PilotManagement", desc: "管理试点项目" },
      { id: "seasonManagement", name: "暖机管理", engName: "SeasonManagement", desc: "管理设备预热任务" },
      { id: "pmsManagement", name: "PMS预防性维护", engName: "PMSManagement", desc: "管理预防性维护" },
      { id: "runCardManagement", name: "RunCard管理", engName: "RunCardManagement", desc: "管理RunCard" },
      { id: "dataCollection", name: "数据收集", engName: "DataCollection", desc: "收集和查询生产数据" }
    ]
  }
];
