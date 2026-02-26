# MES 互动式学习平台

> Manufacturing Execution System — 制造执行系统交互式教程

一个面向学生、初学者及所有对工业软件感兴趣的人的 **交互式 MES 学习环境**。通过结构化知识讲解、可视化状态模拟、功能全景地图和即时反馈测验，系统性地掌握制造执行系统的核心概念。

## 功能模块

### 📖 知识学习

涵盖 **7 大知识模块**，每个模块提供结构化的概念讲解和可视化图示：

| 模块 | 内容 |
|------|------|
| MES 概述 | MES 定位、ISA-95 标准、核心价值与应用场景 |
| 计划与工单 | 工单管理、工艺路线（Flow/Route）、调度规则 |
| 批次管理 | Lot 类型、生命周期状态、关键操作（Track In/Out、Split/Merge） |
| 设备管理 | 设备状态模型、PMS 预防性维护、OEE 分析 |
| 质量管理 | SPC 统计过程控制、OCAP 异常处理、FDC 故障检测 |
| 物流与库存 | WIP 追踪、物料消耗管理、仓储与 AMHS |
| 高级功能 | Reticle 管理、Recipe 配方管理、电子签名与合规 |

### ⚡ 批次模拟

交互式 **Lot 生命周期状态机**：

- 点击操作按钮推动批次从 `已创建` → `排队中` → `加工中` → `已完成` → `已出货 / 已报废` 的完整流转
- 支持 Hold（暂停）与 Release（释放）操作
- 多工序步骤模拟（清洗 → 氧化 → 光刻 → 蚀刻 → 离子注入 → 薄膜沉积 → 检测）
- **SVG 状态流转图** 实时高亮当前状态与可用路径
- 完整的操作日志记录每一步状态变迁

### 🗂 功能地图

涵盖 **8 大分类、50+ 功能项**的可展开功能树：

1. **Lot 管理** — 创建、查询、Track In/Out、Hold/Release、Split/Merge、Scrap
2. **设备管理** — 注册、状态、能力配置、Chamber、E10 追踪
3. **维护管理 (PMS)** — PM 计划、任务执行、计数器、预警、备件
4. **质量管理** — SPC、OCAP、FDC、EDC 数据采集、缺陷记录、良率分析
5. **配方管理 (RMS)** — Recipe 创建/编辑/审批/下载、Golden Recipe
6. **物料与库存** — 入库/出库、WIP 追踪、盘点、BOM、追溯
7. **报表与分析** — 生产报表、OEE、WIP 分布、良率、周期时间、看板
8. **系统管理** — 用户/角色权限、电子签名、审计日志、Reticle、接口

### 🎯 知识测验

**8 道选择题**，覆盖 MES 核心概念：

- OCAP 异常处理流程
- Lot Track In 操作含义
- PMS 预防性维护
- Reticle 光刻掩模
- SPC 控制图指标
- ISA-95 架构层级
- Lot Split 应用场景
- Golden Recipe 作用

每题提供 **即时反馈**（正确/错误提示）和 **详细解析**，完成全部题目后给出综合评分。

## 快速开始

本项目为纯前端应用（HTML + CSS + JavaScript），无需任何构建工具或依赖安装。

### 方式一：直接打开

```bash
git clone https://github.com/openscio/MES-Interactive-Tutorial.git
cd MES-Interactive-Tutorial
# 用浏览器打开 index.html
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

### 方式二：本地服务器

```bash
# 使用 Python
python3 -m http.server 8080

# 或使用 Node.js
npx serve .

# 然后访问 http://localhost:8080
```

## 项目结构

```
MES-Interactive-Tutorial/
├── index.html      # 主页面 — 4 个模块的 Tab 导航与 HTML 结构
├── style.css       # 样式表 — 响应式布局与组件样式
├── app.js          # 应用逻辑 — 知识渲染、状态机、功能树、测验引擎
├── README.md       # 项目文档
└── LICENSE         # MIT 许可证
```

## 技术栈

- **HTML5** — 语义化结构
- **CSS3** — CSS Variables、Flexbox、Grid 响应式布局
- **JavaScript (ES6+)** — 原生 JS，零依赖
- **SVG** — 状态流转图动态渲染

## 浏览器兼容

支持所有现代浏览器：

- Chrome / Edge 80+
- Firefox 75+
- Safari 13+

## 许可证

[MIT License](LICENSE) &copy; 2026 OpenScio
