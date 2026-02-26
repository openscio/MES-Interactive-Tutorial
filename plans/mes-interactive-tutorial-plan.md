# MES 互动式学习平台 — 设计方案

## 一、文档分析总结

### 三份源文档概览

| 文档 | 内容 | 页数 | 核心价值 |
|------|------|------|----------|
| **MES_FMC.pdf** | FMC Modeling Guide — 工厂基准信息建模指南 | 150页 | Factory/Bank/Process/Recipe/Reticle/DataCollect/Alarm/User/System 等17大建模领域 |
| **MES_OIC_Guide_V1.0.pdf** | OIC 操作指南 — 生产执行客户端使用手册 | 162页 | System/STB/LOT/CST/Machine/Transport/Reticle/Recipe/Bank/Material/Pack/MQC/Inquiry 等15大操作模块 |
| **MES功能清单.pdf** | MES功能清单 — 系统功能概述与菜单说明 | ~100页 | 概述/计划与工单/批次管理/消耗品/载具/设备/Batch/分支/返工/出货/未来操作/报警/Reticle/Bank/查询/NPW/Pilot/暖机/搬送/库存/PMS/OCAP/RunCard/数据收集 等24大功能模块 |

---

## 二、平台架构设计

### 技术栈

- **前端框架**: 纯 HTML5 + CSS3 + Vanilla JavaScript（零依赖，可直接打开）
- **样式**: CSS Variables + Flexbox/Grid 响应式布局
- **图表**: SVG 内联绘制（状态机图）
- **数据**: JSON 内嵌于 JS 模块中
- **部署**: 静态文件，可直接用浏览器打开或部署到任意静态服务器

### 目录结构

```
MES-Interactive-Tutorial/
├── index.html                  # 主入口 — 导航到三个模块
├── css/
│   └── style.css               # 全局样式
├── js/
│   ├── app.js                  # 主应用逻辑、路由
│   ├── knowledge.js            # 模块1：知识学习
│   ├── quiz.js                 # 模块1：知识测验
│   ├── lot-simulator.js        # 模块2：批次模拟器
│   └── feature-map.js          # 模块3：功能地图
├── data/
│   ├── knowledge-data.js       # 7大知识模块的结构化内容
│   ├── quiz-data.js            # 测验题库
│   ├── lot-states.js           # Lot状态机定义
│   └── feature-tree.js         # 功能树数据
├── plans/
│   └── mes-interactive-tutorial-plan.md
└── docs/                       # 原始文档（参考）
    ├── MES_FMC.pdf
    ├── MES_OIC_Guide_V1.0.pdf
    └── MES功能清单.pdf
```

---

## 三、模块1：知识学习与知识测验

### 7大知识模块设计

基于三份文档提取的知识体系：

#### 模块1: MES概述
- MES核心作用：连接计划与执行、提高生产效率、保证产品质量、提升透明度
- MES典型架构：数据采集层、应用层、展示层、集成层
- MES实施价值：降低成本、缩短交货周期、增强竞争力
- 7大核心功能：生产计划与调度、资源管理、质量管理、数据采集与分析、库存管理、工艺管理、追溯与可追溯性

#### 模块2: 计划与工单
- 计划 Plan：层次性、灵活性、精细化；产量目标、时间安排、资源分配、优先级
- 工单 Work Order：具体性、实时性、追溯性；产品信息、任务分配、工艺要求、资源清单
- 工单生命周期：创建 → 接收计划 → 开始批次 → 执行 → 完成/关闭
- STB流程：CreateWorkOrder → CreateLot → StartLot

#### 模块3: 批次管理（Lot）
- Lot基本概念：唯一标识、同质性、可追溯性
- Lot生命周期状态：Created → Started → Wait → Run → Wait → ... → Completed → Shipped/Scrapped
- 核心操作：TrackIn/TrackOut、Hold/Release、Split/Merge、Scrap/Unscrap、Rework、Ship
- 高级功能：FutureAction、Sampling、FirstGlass、LotSort、Branch

#### 模块4: 设备管理
- Factory建模层次：Factory → Area → SubArea → MachineSpec → Machine → Port
- 设备类型：ProductionMachine、StorageMachine、TransportMachine、InspectionMachine
- 设备状态模型：StateModel 定义主/子设备及端口状态转换
- MachineCapability：设备能力与工序的关联
- 设备操作：ChangeMachineState、ChangePortState、MachineHold/Release
- Batch管理：CreateBatch → BatchTrackIn → BatchTrackOut → CancelBatch
- PMS预防性维护：PM日历、PM列表、PM规范管理、PM管理

#### 模块5: 质量管理
- DataCollection建模四步骤：DataCollectItem → DataCollectZone → DataCollectSpec → DataCollectView
- DataCollectSpec状态管理：UnFrozen → Frozen → Active/NotActive → Archive
- 抽检 Sampling：AutoSampling、ForceSampling、ReserveSampling
- Alarm报警系统：AlarmDef → AlarmTaskDef → AlarmNotify → AlarmGenerator
- OCAP失控行动计划：OCAP管理、操作计划注册、操作计划视图
- Request审批流程：RequestCard → Confirm → Approval

#### 模块6: 物流与库存
- Bank概念：工厂内物理/逻辑位置，存放Cassette或Foup
- Bank操作：BankIn、BankOut、MoveBank、CancelMoveBank
- BankRelation：Bank之间的移动关系定义
- Carrier载具管理：CreateCarrier、ChangeCarrier、CleanCarrier、AssignCarrier
- 载具操作：ExchangeCarrier、ChangeNewCarrier、HoldCarrier、ScrapCarrier
- Material物料管理：CreateMaterial、ReceiveMaterial、ReturnMaterial、KitMaterial
- 消耗品管理：创建、检查、库存、上下料、Hold、报废、冷冻/解冻
- Stocker库存管理
- 搬送Transport：搬送载具、查看搬送队列

#### 模块7: 高级功能
- Reticle光罩管理：ReticleGroup → ReticleSpec → Reticle；Hold/Release、BankIn/Out、EQPIn/Out、Scrap
- Recipe管理：AbstractRecipe vs MachineRecipe；RecipeSpace → Recipe → RecipeParameter
- ProcessFlow设计：ProcessOperationSpec → ProcessFlowSpec → ProcessFlowDesign
- FoD建模：FodModelDef → FodModeler → FodValueModeler → Frozen
- ParameterOverride：Frozen后通过参数覆盖动态调整
- NPW非生产晶圆：设置NPW作业、循环判定、重复利用判定
- Pilot试点项目：创建、取消、判定、结束
- 暖机Season：预热任务列表管理
- RunCard：起草、设置、履历管理
- 用户/菜单/权限管理

### 知识测验设计 — 自适应出题系统

每个模块采用**自适应出题算法**，根据答题准确率动态决定下一题内容：

#### 核心机制：答错补强

```
出题逻辑：
1. 每个知识点关联一组题目：1道主题 + 1-2道补强题
2. 用户答对主题 → 进入下一个知识点
3. 用户答错主题 → 显示解析 → 立即出一道同知识点的补强题
4. 补强题答对 → 标记为"已掌握-补强后" → 进入下一知识点
5. 补强题再答错 → 标记为"需复习" → 继续下一知识点，最后汇总复习
```

#### 题目数据结构

```javascript
{
  conceptId: "lot-trackin",
  conceptName: "TrackIn进站操作",
  primary: {                          // 主题
    question: "...",
    options: [...],
    answer: 0,
    explanation: "..."
  },
  reinforcement: [                    // 补强题（同知识点不同角度）
    { question: "...", options: [...], answer: 1, explanation: "..." }
  ]
}
```

#### 每模块题目规模

| 模块 | 知识点数 | 主题数 | 补强题数 | 最少答题 | 最多答题 |
|------|----------|--------|----------|----------|----------|
| MES概述 | 6 | 6 | 8 | 6 | 14 |
| 计划与工单 | 6 | 6 | 8 | 6 | 14 |
| 批次管理 | 8 | 8 | 12 | 8 | 20 |
| 设备管理 | 6 | 6 | 8 | 6 | 14 |
| 质量管理 | 7 | 7 | 10 | 7 | 17 |
| 物流库存 | 6 | 6 | 8 | 6 | 14 |
| 高级功能 | 7 | 7 | 10 | 7 | 17 |
| **合计** | **46** | **46** | **64** | **46** | **110** |

#### 测验结果展示

- **即时反馈**：每题选择后立即显示正确/错误 + 详细解析
- **知识点掌握度**：✅ 一次通过 / ⚠️ 补强后通过 / ❌ 需复习
- **模块总结报告**：掌握率、薄弱知识点列表、建议复习内容
- **进度追踪**：本地存储每个知识点的掌握状态
- **复习模式**：可单独复习标记为"需复习"的知识点

---

## 四、模块2：批次模拟器

### Lot 生命周期状态机

```
状态定义：
- Created（已创建）
- Started（已开始）
- Wait（等待中）
- Run（运行中）
- Hold（已扣留）
- Completed（已完成）
- Shipped（已出货）
- Scrapped（已报废）

状态转换：
Created --[StartLot]--> Started
Started --[进入工序]--> Wait
Wait --[TrackIn]--> Run
Run --[TrackOut]--> Wait
Wait --[到达最后工序完成]--> Completed
Wait/Run --[HoldLot]--> Hold
Hold --[ReleaseHold]--> Wait
Hold --[ScrapLot]--> Scrapped
Completed --[ShipLot]--> Shipped
Completed --[UnComplete]--> Wait
Shipped --[UnShipLot]--> Completed
```

### 模拟器功能

1. **SVG状态图**：可视化展示当前Lot所处状态，高亮当前状态节点
2. **操作按钮面板**：根据当前状态动态启用/禁用可用操作
3. **操作日志**：记录每次状态转换的时间、操作名称、前后状态
4. **Lot信息面板**：显示LotName、ProductSpec、ProcessFlow、当前工序、Hold状态等
5. **工序进度条**：显示当前Lot在ProcessFlow中的位置

### 可用操作列表

| 操作 | 前置状态 | 目标状态 | 说明 |
|------|----------|----------|------|
| StartLot | Created | Started | 开始批次 |
| TrackIn | Wait | Run | 进站 |
| TrackOut | Run | Wait | 出站 |
| HoldLot | Wait/Run | Hold | 扣留批次 |
| ReleaseHold | Hold | Wait | 释放扣留 |
| ScrapLot | Hold | Scrapped | 报废 |
| UnscrapLot | Scrapped | Hold | 反报废 |
| SplitLot | Wait | Wait | 拆批（信息变更） |
| MergeLot | Wait | Wait | 合批（信息变更） |
| CompleteLot | Wait（最后工序） | Completed | 完成 |
| ShipLot | Completed | Shipped | 出货 |
| UnShipLot | Shipped | Completed | 取消出货 |
| ChangeOperation | Wait | Wait | 变更工序 |
| BackupOperation | Wait | Wait | 返回工序 |
| SkipOperation | Wait | Wait | 跳过工序 |

---

## 五、模块3：功能地图

### 8大分类功能树

基于三份文档整理的完整功能清单：

#### 1. 生产计划与开始（STB）
- 创建工单 CreateWorkOrder
- 更改工单信息 ChangeWoInfo
- 预约工单计划 ReserveWorkOrderPlan
- 关闭工单 CloseWO
- Hold工单 HoldWO
- 释放工单 ReleaseWO
- 创建批次 CreateLot
- 取消创建批次 CancelCreateLot
- 接收计划 ReceivePlan
- 取消接收计划 CancelReceivePlan
- 开始批次 StartLot
- 开始产品 StartProduct

#### 2. 批次跟踪与操作（LOT）
- 首个产品流程 FirstGlass
- 预约批次 ReserveLot
- 产品抽选 ProductSampling
- TrackIn 进站
- TrackOut 出站
- 取消投入 CancelTrackIn
- Recipe同步
- 抽检规格 SamplingSpec
- 抽检批次列表 SamplingLotList
- 更改制程 ChangeProcessOperation
- 返回制程 BackupOperation
- 跳过制程 SkipOperation
- 更改产品规格 ChangeProductSpec
- 更改流程版本 ChangeFlowRevision
- 设置开关状态 SetFlag
- HoldLot 扣留批次
- ReleaseHoldLot 释放扣留
- 更改批次属性 ChangeLotAttribute
- 更改批次返回 ChangeLotRework
- Hold批次 ChangeLotHold
- 释放Hold批次 ReleaseChangeLotHold
- ScrapLot 报废
- UnscrapLot 反报废
- SplitLot 拆批
- MergeLot 合批
- 最终报废 FinalScrap
- 取消最终报废 CancelFinalScrap

#### 3. 载具管理（CST）
- 载具主页 CarrierMain
- 创建载具 CreateCarrier
- 更改载具信息 ChangeCarrier
- 清洗载具 CleanCarrier
- 更改载具位置 ChangeCarrierLocation
- 交换载具 ExchangeCarrier
- 更换新载具 ChangeNewCarrier
- 组合载具 CombineCarrier
- 分配载具 AssignCarrier
- 取消分配载具 DeAssignCarrier
- Hold载具 HoldCarrier
- 释放载具 ReleaseCarrier
- 报废载具 ScrapCarrier
- 取消报废载具 UnScrapCarrier

#### 4. 设备管理（Machine）
- 更改设备状态 ChangeMachineState
- 更改端口状态 ChangePortState
- Hold设备 MachineHold
- 释放Hold设备 MachineRelease
- 创建Batch CreateBatch
- 取消创建Batch CancelBatch
- Batch投入 BatchTrackIn
- Batch产出 BatchTrackOut
- 取消Batch投入 CancelBatchTrackIn

#### 5. 高级生产功能
- 分支 Branch
- 取消分支 CancelBranch
- 结束分支 CompleteBranch
- 返工 Rework
- 取消返工 CancelRework
- 完成返工 CompleteRework
- 取消完成批次 CancelCompleteLot
- 批次出货 ShipLot
- 取消批次出货 UnShipLot
- 设置未来操作 SetFutureAction
- 未来操作履历 FutureActionHistory
- 清除报警 ClearAlarm
- OCAP管理 OcapManagement
- 操作计划注册 OcapRegister
- 操作计划视图 OcapView

#### 6. Reticle与Recipe管理
- Reticle主页 ReticleMain
- 创建Reticle CreateReticle
- 更改Reticle信息 ChangeReticleInfo
- 清洗Reticle CleanReticle
- Hold Reticle HoldReticle
- 释放Reticle ReleaseReticle
- 进ReticleBank ReticleBankIn
- 出ReticleBank ReticleBankOut
- 报废Reticle ScrapReticle
- 取消报废Reticle UnScrapReticle
- Reticle搬送 ReticleTransport
- 上Reticle MountReticle
- 下Reticle UnmountReticle
- Recipe管理 RecipeManagement

#### 7. 物流库存与Bank
- 入Bank BankIn
- 出Bank BankOut
- 移动Bank MoveBank
- 取消移动Bank CancelMoveBank
- 消耗品主页 ConsumableMain
- 创建消耗品 CreateConsumable
- 消耗品信息变更 ChangeConsumableInfo
- 消耗品检查 InspectConsumable
- 消耗品库存请求 ConsumableStockRequest
- 消耗品库存出库 ConsumableStockOut
- 消耗品上下料 ConsumableLoadUnload
- 消耗品Hold/Release
- 消耗品报废/取消报废
- 消耗品冷冻/解冻
- Stocker库存管理
- 搬送载具 TransportCarrier
- 查看搬送队列 ViewTransportQueue

#### 8. 查询与高级功能
- WIP批次查询（开始批次列表、出货列表）
- 批次查询（批次履历、下一个制程列表、批次步骤查询、合并产品列表、Q-time）
- 产品履历查询
- 载具查询（载具信息、载具履历）
- 设备查询（设备信息、维护履历、设备履历、设备效率）
- Reticle查询（Reticle信息、Reticle履历）
- 端口履历查询
- 消耗品履历查询
- NPW管理（设置NPW作业、NPW产品信息、NPW循环判定、NPW重复利用判定）
- Pilot管理（创建、取消、判定、结束、信息查看）
- 暖机管理（预热任务列表）
- PMS预防性维护（PM日历、PM列表、PM规范管理、PM管理）
- RunCard管理（起草、设置、履历）
- 数据收集（收集数据、查询DCOL、CollectDCOL Item、询价单Item）

---

## 六、UI/UX 设计要点

### 整体风格
- 半导体/工业风格配色：深蓝 #1a237e + 科技蓝 #2196f3 + 白色背景
- 卡片式布局，圆角阴影
- 左侧导航 + 右侧内容区
- 响应式设计，支持桌面和平板

### 模块1 知识学习
- 左侧：7个模块的手风琴导航
- 右侧：结构化内容展示，含概念卡片、表格、流程图
- 底部：进入测验按钮
- 测验页面：单题展示，即时反馈，进度条

### 模块2 批次模拟
- 上方：SVG状态机图（节点+箭头，当前状态高亮）
- 中间：Lot信息面板 + 工序进度条
- 左下：操作按钮面板（根据状态动态启用/禁用）
- 右下：操作日志（时间戳 + 操作 + 状态变化）

### 模块3 功能地图
- 可展开/折叠的树形结构
- 8大分类用不同颜色标识
- 每个功能项点击可展开查看简要说明
- 搜索过滤功能
- 统计信息：总分类数、总功能数

---

## 七、实施计划

### Phase 1: 基础框架
1. 创建项目目录结构和入口文件
2. 实现全局CSS样式系统
3. 实现主页导航和模块切换

### Phase 2: 知识学习模块
4. 构建7大知识模块的JSON数据
5. 实现知识学习页面的渲染逻辑
6. 构建测验题库数据
7. 实现测验系统（即时反馈、评分、进度）

### Phase 3: 批次模拟器
8. 定义Lot状态机数据模型
9. 实现SVG状态图渲染
10. 实现操作按钮面板和状态转换逻辑
11. 实现操作日志和Lot信息面板

### Phase 4: 功能地图
12. 构建8大分类50+功能项的树形数据
13. 实现可展开功能树UI
14. 实现搜索过滤和统计功能

### Phase 5: 集成与优化
15. 集成三个模块到主页
16. 添加本地存储（学习进度、测验成绩）
17. 响应式适配和最终优化
