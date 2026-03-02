/* ============================================
   MES Interactive Tutorial - Scenario Data
   特殊场景案例数据 — 6大类20个引导式场景
   ============================================ */

'use strict';

var SCENARIO_CATEGORIES = [
  // ============================================
  // 1. Lot Hold（批次暂停）
  // ============================================
  {
    id: 'hold',
    name: 'Lot Hold（批次暂停）',
    icon: '\u23F8\uFE0F',
    color: '#ff9800',
    desc: 'Lot 在正常流程中被临时中止，等待决策',
    scenarios: [
      {
        id: 'hold-quality',
        name: '质量异常 Hold',
        desc: '检测工序发现良率骤降，触发批次暂停等待分析',
        difficulty: 'beginner',
        initialLot: {
          lotName: "LOT-SC-001",
          productSpec: "PROD-A-001",
          processFlow: "PROD-FLOW-001",
          quantity: 25,
          priority: 3,
          state: "wait",
          holdState: "none",
          currentOpIndex: 3,
          bankState: "none",
          reworkState: "none",
          branchState: "none",
          history: []
        },
        narrative: {
          title: '场景：质量异常 Hold',
          background: '批次 LOT-SC-001 完成蚀刻工序后进入 INSP-01 检测站。检测数据显示良率从正常的 98% 骤降至 72%，缺陷扫描发现多处异常图案。QC 工程师判定需要暂停该批次进行调查分析。',
          objective: '作为产线操作员，你需要执行正确的 MES 操作来暂停该批次，等待工程师分析后再决定后续处理。'
        },
        steps: [
          {
            id: 1,
            instruction: '检测数据异常！QC 工程师通知你需要 Hold 该批次，防止问题产品流入下游。请执行 Hold 操作。',
            expectedAction: 'holdLot',
            hint: '批次处于 Wait 状态时，使用"扣留批次 Hold"按钮暂停生产流程。',
            explanation: '当检测发现质量异常时，第一步是立即 Hold 批次。这是半导体制造中最常见的质量管控手段，可以防止潜在不良品继续流入后续工序。',
            successMsg: '批次已被 Hold，等待工程师分析。',
            wrongActionMsg: '当前需要先 Hold 批次以阻止其继续生产。请找到"扣留批次 Hold"按钮。'
          },
          {
            id: 2,
            instruction: '工程师分析完毕：问题来自前一工序设备的温度漂移（已修复），该批次产品可以继续生产。请释放 Hold。',
            expectedAction: 'releaseHold',
            hint: '批次处于 Hold 状态时，确认可以继续后使用"释放扣留 Release"。',
            explanation: '工程师确认问题根因并验证设备修复后，通过 Release 操作恢复批次的正常生产流程。Release 后批次回到 Wait 状态。',
            successMsg: '批次已释放，恢复到等待状态。',
            wrongActionMsg: '批次处于 Hold 状态，需要执行"释放扣留 Release"才能继续。'
          },
          {
            id: 3,
            instruction: '批次已释放。现在将批次进站到 INSP-01 设备进行重新检测，确认产品质量合格。',
            expectedAction: 'trackIn',
            hint: '使用"进站 TrackIn"让批次进入设备进行检测。',
            explanation: 'Hold 释放后批次回到原工序等待状态。操作员需要执行 TrackIn 将批次送入检测设备重新检测，确认质量合格后才能放行。',
            successMsg: '批次已进站检测。场景完成！',
            wrongActionMsg: '批次需要进站进行检测，请执行"进站 TrackIn"。'
          }
        ],
        summary: {
          keyPoints: [
            '发现质量异常时，第一步是立即 Hold 批次',
            'Hold 可以有效防止问题产品流入下游工序',
            '工程师分析并确认修复后，才能执行 Release',
            'Release 后批次回到 Wait 状态，需要重新 TrackIn 继续加工'
          ],
          realWorldNote: '在实际工厂中，Hold 操作通常会关联 Hold Code（如 QC-Hold、ENG-Hold）来分类暂停原因。系统会记录 Hold 发起人、原因、时间等信息，方便后续统计分析和追溯。'
        }
      },
      {
        id: 'hold-equipment',
        name: '设备关联 Hold',
        desc: '设备加工中报警，需要扣留该设备加工过的批次复测',
        difficulty: 'beginner',
        initialLot: {
          lotName: "LOT-SC-002",
          productSpec: "PROD-A-001",
          processFlow: "PROD-FLOW-001",
          quantity: 25,
          priority: 3,
          state: "run",
          holdState: "none",
          currentOpIndex: 2,
          bankState: "none",
          reworkState: "none",
          branchState: "none",
          history: []
        },
        narrative: {
          title: '场景：设备关联 Hold',
          background: '批次 LOT-SC-002 正在 ETCH-01 设备上进行蚀刻加工。加工过程中设备报警，显示蚀刻腔体压力异常。虽然批次已完成加工，但工程师怀疑设备参数漂移可能影响了加工质量。',
          objective: '你需要将该批次从运行状态直接扣留，并在工程师确认后执行后续处理。'
        },
        steps: [
          {
            id: 1,
            instruction: '设备在加工过程中报警！需要紧急 Hold 正在运行的批次。请执行运行中扣留操作。',
            expectedAction: 'holdRunLot',
            hint: '批次正在运行中（Run），使用"运行中扣留"按钮可以直接扣留。',
            explanation: '当设备在加工过程中发生异常，需要使用"运行中扣留"将正在运行的批次直接转为 Hold 状态。这与等待状态的 Hold 不同，适用于紧急情况。',
            successMsg: '批次已从运行状态直接扣留。',
            wrongActionMsg: '批次正在运行中，需要使用"运行中扣留"操作。'
          },
          {
            id: 2,
            instruction: '工程师检查设备参数日志，确认蚀刻参数在报警前仍在规格范围内，批次不受影响。请释放 Hold。',
            expectedAction: 'releaseHold',
            hint: '工程师确认批次无问题，使用"释放扣留 Release"恢复生产。',
            explanation: '设备关联 Hold 的释放需要工程师提供 Disposition（处置意见），确认批次质量不受设备异常影响后才能放行。',
            successMsg: '批次已释放，恢复到等待状态。',
            wrongActionMsg: '请执行"释放扣留 Release"来恢复批次。'
          },
          {
            id: 3,
            instruction: '批次释放后回到 ETCH-01 等待状态。工程师要求回退到上一工序（PHT-01）重新确认。请执行回退操作。',
            expectedAction: 'backupOp',
            hint: '使用"返回工序 Backup"将批次回退到上一个工序。',
            explanation: '在设备异常场景中，工程师可能要求回退到前一工序进行额外检查。Backup 操作将当前工序指针回退一步，让批次重新从上一工序开始。',
            successMsg: '批次已回退到 PHT-01 工序。',
            wrongActionMsg: '工程师要求回退，请使用"返回工序 Backup"操作。'
          },
          {
            id: 4,
            instruction: '批次已回退到 PHT-01。现在将批次进站进行复测确认。',
            expectedAction: 'trackIn',
            hint: '使用"进站 TrackIn"将批次送入设备。',
            explanation: '回退后批次处于前一工序的等待状态，需要通过 TrackIn 将批次送入设备进行复测或重新加工。',
            successMsg: '批次已进站复测。场景完成！',
            wrongActionMsg: '请执行"进站 TrackIn"将批次送入设备。'
          }
        ],
        summary: {
          keyPoints: [
            '"运行中扣留"可以将正在加工的批次直接转为 Hold 状态',
            '设备关联 Hold 通常需要检查所有经过该设备的批次',
            '释放前需要工程师提供 Disposition（处置意见）',
            '可能需要 Backup 回退工序进行额外检查'
          ],
          realWorldNote: '在实际工厂中，设备报警会触发 Chamber-Hold，系统会自动查询该腔体在特定时间窗口内加工过的所有 Lot，并批量执行 Hold。这通常通过 OCAP（Out of Control Action Plan）自动化规则实现。'
        }
      },
      {
        id: 'hold-metrology',
        name: '量测异常 Hold',
        desc: 'Inline 量测数据超出规格限，需要工程师复审才能放行',
        difficulty: 'intermediate',
        initialLot: {
          lotName: "LOT-SC-003",
          productSpec: "PROD-A-001",
          processFlow: "PROD-FLOW-001",
          quantity: 25,
          priority: 3,
          state: "wait",
          holdState: "none",
          currentOpIndex: 3,
          bankState: "none",
          reworkState: "none",
          branchState: "none",
          history: []
        },
        narrative: {
          title: '场景：量测异常 Hold',
          background: '批次 LOT-SC-003 在 INSP-01 检测站完成量测后，SPC（统计过程控制）系统自动判定关键尺寸（CD）数据超出 UCL（上控制限），触发 OOC（Out of Control）报警。根据 OCAP 规则，批次需要暂停等待工程师复审。',
          objective: '执行 SPC 触发的自动 Hold 流程，并在工程师复审后正确处理批次。'
        },
        steps: [
          {
            id: 1,
            instruction: 'SPC 系统报警！CD 量测数据超出控制限。根据 OCAP 规则，需要立即 Hold 批次。',
            expectedAction: 'holdLot',
            hint: 'SPC OOC 触发 Hold，使用"扣留批次 Hold"操作。',
            explanation: '在 SPC 管控体系中，当量测数据超出控制限（OOC），OCAP 规则会要求暂停批次。在 MES 中表现为执行 Hold 操作，等待工程师复审（Review）。',
            successMsg: '批次已被 Hold，等待工程师复审。',
            wrongActionMsg: 'SPC OOC 要求暂停批次，请执行"扣留批次 Hold"。'
          },
          {
            id: 2,
            instruction: '工程师复审判定：CD 数据虽超出控制限，但仍在规格限（Spec Limit）范围内，属于可接受偏差。批次可以继续。请释放。',
            expectedAction: 'releaseHold',
            hint: '工程师确认可接受偏差，使用"释放扣留 Release"。',
            explanation: '控制限（Control Limit）比规格限（Spec Limit）更严格。数据超出控制限但在规格限内时，工程师可能判定为可接受偏差，允许批次继续生产。',
            successMsg: '批次已释放，可以继续后续工序。',
            wrongActionMsg: '请执行"释放扣留 Release"来恢复批次。'
          },
          {
            id: 3,
            instruction: '批次已释放。INSP-01 检测已完成，不需要重做。将批次进站继续下一工序加工。',
            expectedAction: 'trackIn',
            hint: '检测已完成，直接 TrackIn 进入下一工序。',
            explanation: '量测 Hold 释放后，如果工程师判定检测结果可接受，则无需重测，批次直接进入下一工序继续加工。',
            successMsg: '批次已进站。场景完成！',
            wrongActionMsg: '请执行"进站 TrackIn"继续加工。'
          }
        ],
        summary: {
          keyPoints: [
            'SPC OOC 会自动触发 OCAP 规则，要求 Hold 批次',
            '控制限（CL）比规格限（SL）更严格，超出 CL 不一定超出 SL',
            '工程师复审后给出 Disposition：继续/重测/返工/报废',
            '可接受偏差时可直接释放继续，无需重测'
          ],
          realWorldNote: '实际工厂中，SPC Hold 通常由 OCAP 系统自动执行，不需要操作员手动操作。OCAP 规则由工程师预先配置，包括 Hold 触发条件、通知对象、处置流程等。'
        }
      },
      {
        id: 'hold-customer',
        name: '客户变更 Hold',
        desc: '客户临时通知暂停生产，等待新指令',
        difficulty: 'beginner',
        initialLot: {
          lotName: "LOT-SC-004",
          productSpec: "PROD-B-002",
          processFlow: "PROD-FLOW-001",
          quantity: 25,
          priority: 3,
          state: "wait",
          holdState: "none",
          currentOpIndex: 4,
          bankState: "none",
          reworkState: "none",
          branchState: "none",
          history: []
        },
        narrative: {
          title: '场景：客户变更 Hold',
          background: '客户 B 临时发来通知：由于产品规格变更正在讨论中，要求暂停 PROD-B-002 产品的所有在制批次。批次 LOT-SC-004 当前在 CVD-02 工序等待加工。',
          objective: '根据客户要求暂停批次，并在收到客户恢复通知后释放。'
        },
        steps: [
          {
            id: 1,
            instruction: '客户通知暂停生产！请立即 Hold 批次，等待客户进一步指令。',
            expectedAction: 'holdLot',
            hint: '使用"扣留批次 Hold"暂停批次。',
            explanation: '客户变更 Hold 是业务驱动的暂停，不是质量问题。Hold Code 通常标记为 CUST-Hold（客户暂停），方便后续追踪和客户沟通。',
            successMsg: '批次已被 Hold，等待客户新指令。',
            wrongActionMsg: '需要暂停批次等待客户指令，请执行"扣留批次 Hold"。'
          },
          {
            id: 2,
            instruction: '3 天后客户确认：规格不变，恢复生产。请释放批次继续加工。',
            expectedAction: 'releaseHold',
            hint: '客户确认恢复，使用"释放扣留 Release"。',
            explanation: '收到客户恢复通知后释放 Hold。客户变更 Hold 的持续时间不确定，可能从几小时到几周不等，期间批次完全停滞在当前工序。',
            successMsg: '批次已释放，恢复正常生产。场景完成！',
            wrongActionMsg: '客户已确认恢复，请执行"释放扣留 Release"。'
          }
        ],
        summary: {
          keyPoints: [
            '客户变更 Hold 是业务驱动的暂停，与质量无关',
            'Hold Code 应标记为 CUST-Hold 以区分暂停原因',
            '客户 Hold 可能影响交期，需要及时沟通',
            '释放后批次从暂停工序继续，无需回退'
          ],
          realWorldNote: '客户变更 Hold 在实际工厂中较为常见，尤其在产品规格调整、订单变更、或客户端市场变化时。工厂通常会设置 WIP Hold Report 来追踪所有被 Hold 的批次及其原因、持续时间和影响。'
        }
      }
    ]
  },

  // ============================================
  // 2. Lot Scrap / Partial Scrap（报废）
  // ============================================
  {
    id: 'scrap',
    name: 'Lot Scrap（批次报废）',
    icon: '\u274C',
    color: '#f44336',
    desc: 'Lot 无法继续生产，必须从系统中移除或拆批处理',
    scenarios: [
      {
        id: 'scrap-full',
        name: '整批报废',
        desc: '设备故障导致整批晶圆损坏，无法修复',
        difficulty: 'beginner',
        initialLot: {
          lotName: "LOT-SC-005",
          productSpec: "PROD-A-001",
          processFlow: "PROD-FLOW-001",
          quantity: 25,
          priority: 3,
          state: "run",
          holdState: "none",
          currentOpIndex: 2,
          bankState: "none",
          reworkState: "none",
          branchState: "none",
          history: []
        },
        narrative: {
          title: '场景：整批报废',
          background: '批次 LOT-SC-005 正在 ETCH-01 设备上蚀刻。加工过程中设备突发严重故障（等离子体失控），导致整批 25 片晶圆过度蚀刻，表面严重损坏，无法修复。',
          objective: '执行紧急 Hold 并完成整批报废流程。'
        },
        steps: [
          {
            id: 1,
            instruction: '设备严重故障！批次正在运行中，需要紧急扣留。请执行运行中扣留。',
            expectedAction: 'holdRunLot',
            hint: '使用"运行中扣留"将正在运行的批次紧急暂停。',
            explanation: '设备发生严重故障时，第一步是立即扣留正在加工的批次，防止情况进一步恶化。',
            successMsg: '批次已紧急扣留。',
            wrongActionMsg: '批次正在运行中，请使用"运行中扣留"操作。'
          },
          {
            id: 2,
            instruction: '工程师评估结果：所有 25 片晶圆表面严重损坏，无法修复。需要执行报废。',
            expectedAction: 'scrapLot',
            hint: '使用"报废批次 Scrap"将不可修复的批次报废。',
            explanation: '当批次确认无法修复时，执行 Scrap 将批次标记为报废状态。报废后批次退出正常生产流程，进入报废统计。',
            successMsg: '批次已报废。',
            wrongActionMsg: '批次已确认无法修复，请执行"报废批次 Scrap"。'
          },
          {
            id: 3,
            instruction: '主管发现系统记录有误：设备故障影响范围被高估了，实际只有表面氧化层受损。请撤销报废。',
            expectedAction: 'unscrapLot',
            hint: '使用"反报废 Unscrap"撤销报废操作。',
            explanation: 'Unscrap（反报废）是纠错操作，用于撤销错误的报废决定。实际工厂中此操作需要高级权限和审批流程。',
            successMsg: '报废已撤销，批次回到 Hold 状态。场景完成！',
            wrongActionMsg: '需要撤销报废，请执行"反报废 Unscrap"。'
          }
        ],
        summary: {
          keyPoints: [
            '设备严重故障时先紧急扣留（运行中扣留）',
            '工程师评估确认无法修复后执行 Scrap',
            'Scrap 后批次进入报废状态，退出正常流程',
            'Unscrap 可以撤销错误的报废操作（需高级权限）'
          ],
          realWorldNote: '整批报废会直接影响良率指标和生产成本。实际工厂中报废操作需要多级审批，并会触发 8D 报告（问题分析报告）流程。设备故障导致的报废通常会被归类到设备损失（Equipment Loss）统计中。'
        }
      },
      {
        id: 'scrap-partial',
        name: '部分报废（拆批+报废）',
        desc: '部分晶圆良率极低，需要拆批后分别处理',
        difficulty: 'intermediate',
        initialLot: {
          lotName: "LOT-SC-006",
          productSpec: "PROD-A-001",
          processFlow: "PROD-FLOW-001",
          quantity: 25,
          priority: 3,
          state: "wait",
          holdState: "none",
          currentOpIndex: 3,
          bankState: "none",
          reworkState: "none",
          branchState: "none",
          history: []
        },
        narrative: {
          title: '场景：部分报废',
          background: '批次 LOT-SC-006 在 INSP-01 检测站完成检测，结果显示前 5 片（Slot 1-5）良率极低（< 30%），而后 20 片良率正常（> 95%）。工程师决定拆批处理：将有问题的晶圆分离出去报废，好的晶圆继续生产。',
          objective: '执行拆批操作分离不良品，对不良品执行报废，并通过反报废和释放演示纠错流程。'
        },
        steps: [
          {
            id: 1,
            instruction: '需要将不良晶圆（前 5 片）从批次中分离出来。请执行拆批操作。\n（模拟器将自动对半拆分，实际系统可指定具体 Slot 位置）',
            expectedAction: 'splitLot',
            hint: '使用"拆批 Split"将批次一分为二。',
            explanation: '拆批（Split）是将一个 Lot 分成两个或多个子 Lot 的操作。在实际系统中可以指定按 Slot 位置拆分。拆分后产生的子 Lot 继承原 Lot 的工艺流程和当前工序位置。',
            successMsg: '拆批完成！好的晶圆已分离到子批次中继续生产。',
            wrongActionMsg: '需要先拆批将不良晶圆分离，请执行"拆批 Split"。'
          },
          {
            id: 2,
            instruction: '拆批完成。当前批次代表需要报废的不良品。先执行 Hold，准备进入报废流程。',
            expectedAction: 'holdLot',
            hint: '报废前需要先 Hold 批次，使用"扣留批次 Hold"。',
            explanation: '在 MES 系统中，Scrap 操作通常只能从 Hold 状态执行，这是一种安全机制，防止误操作导致正常批次被报废。',
            successMsg: '批次已扣留，准备执行报废。',
            wrongActionMsg: '报废前需要先 Hold 批次，请执行"扣留批次 Hold"。'
          },
          {
            id: 3,
            instruction: '批次已扣留。工程师确认这些晶圆无法修复，请执行报废操作。',
            expectedAction: 'scrapLot',
            hint: '使用"报废批次 Scrap"将不良品报废。',
            explanation: '确认不良品无法修复后执行 Scrap。部分报废只影响被拆出的子 Lot，原 Lot 的好品继续生产，最大程度减少损失。',
            successMsg: '不良品已报废。',
            wrongActionMsg: '请执行"报废批次 Scrap"将不良品报废。'
          },
          {
            id: 4,
            instruction: '等一下！QC 复查发现其中 3 片实际可以修复，报废决定需要修正。请执行反报废。',
            expectedAction: 'unscrapLot',
            hint: '使用"反报废 Unscrap"撤销报废。',
            explanation: 'Unscrap 后批次回到 Hold 状态，可以进行进一步评估。在实际工厂中，反报废需要提供充分理由并经过审批。',
            successMsg: '报废已撤销，批次回到 Hold 状态。',
            wrongActionMsg: '需要撤销报废，请执行"反报废 Unscrap"。'
          },
          {
            id: 5,
            instruction: '反报废完成，批次回到 Hold 状态。经过工程师再次评估后确认可以继续。请释放 Hold。',
            expectedAction: 'releaseHold',
            hint: '使用"释放扣留 Release"恢复批次。',
            explanation: '释放后这些可修复的晶圆可以重新进入生产流程（可能需要返工），最大化利用可用资源。',
            successMsg: '批次已释放。场景完成！',
            wrongActionMsg: '请执行"释放扣留 Release"恢复批次。'
          }
        ],
        summary: {
          keyPoints: [
            '部分报废时先用 Split 分离不良品和好品',
            'Scrap 只能从 Hold 状态执行（安全机制）',
            '部分报废最大程度减少损失，好品继续生产',
            'Unscrap + Release 可以纠正错误的报废决定'
          ],
          realWorldNote: '部分报废在半导体制造中非常常见。实际系统中 Split 时会指定具体 Wafer Slot 编号，每片晶圆都有独立追溯记录。部分报废的损失会按报废片数比例计入良率统计。'
        }
      },
      {
        id: 'scrap-broken',
        name: '碎片处理',
        desc: '传输过程中晶圆破损，需要更新批次信息',
        difficulty: 'intermediate',
        initialLot: {
          lotName: "LOT-SC-007",
          productSpec: "PROD-A-001",
          processFlow: "PROD-FLOW-001",
          quantity: 25,
          priority: 3,
          state: "wait",
          holdState: "none",
          currentOpIndex: 4,
          bankState: "none",
          reworkState: "none",
          branchState: "none",
          history: []
        },
        narrative: {
          title: '场景：碎片处理',
          background: '批次 LOT-SC-007 在从 INSP-01 传输到 CVD-02 的过程中，AMHS（自动物料搬运系统）发生碰撞，导致 Carrier 中 2 片晶圆破碎。操作员发现碎片后需要处理。',
          objective: '对破损的批次执行正确的处理流程：Hold → 拆分去除碎片 → 确认后释放继续。'
        },
        steps: [
          {
            id: 1,
            instruction: '发现晶圆碎片！需要先 Hold 批次进行检查，确认破损范围。',
            expectedAction: 'holdLot',
            hint: '使用"扣留批次 Hold"暂停批次进行检查。',
            explanation: '发现碎片后第一步是 Hold 批次。碎片可能污染 Carrier 和其他晶圆，需要检查所有晶圆状态并清理碎片。',
            successMsg: '批次已扣留，等待检查和清理。',
            wrongActionMsg: '发现碎片需要先 Hold 批次，请执行"扣留批次 Hold"。'
          },
          {
            id: 2,
            instruction: '清理完毕，2 片碎片已移除。需要释放批次并更新数量。请先释放 Hold。',
            expectedAction: 'releaseHold',
            hint: '清理完成，使用"释放扣留 Release"恢复批次。',
            explanation: '碎片清理完成后释放 Hold。实际系统中会更新 Wafer Map，标记缺失的 Slot 位置。',
            successMsg: '批次已释放。',
            wrongActionMsg: '清理完成，请执行"释放扣留 Release"。'
          },
          {
            id: 3,
            instruction: '批次已释放。需要执行拆批将碎片对应的数量分离出去。\n（模拟器将对半拆分，实际系统会按 Slot 位置移除）',
            expectedAction: 'splitLot',
            hint: '使用"拆批 Split"分离碎片数量。',
            explanation: '通过 Split 将破碎晶圆的记录从批次中移除，更新有效数量。实际系统中会标记具体 Slot 为空（Empty Slot）。',
            successMsg: '批次数量已更新。场景完成！',
            wrongActionMsg: '需要更新批次数量，请执行"拆批 Split"分离碎片。'
          }
        ],
        summary: {
          keyPoints: [
            '发现碎片后立即 Hold，防止碎片污染',
            '清理碎片后检查所有剩余晶圆状态',
            '使用 Split 更新批次有效数量',
            '实际系统中会更新 Wafer Map 标记空 Slot'
          ],
          realWorldNote: '碎片（Broken Wafer）是半导体工厂中的安全隐患。碎片会产生颗粒污染，可能导致 Carrier 和设备腔体污染。工厂通常有严格的碎片处理 SOP，包括 Carrier 更换、设备清洁验证等。AMHS 碰撞事件需要填写异常报告并追查根因。'
        }
      }
    ]
  },

  // ============================================
  // 3. Lot Rerun / Reclaim（重工/回收）
  // ============================================
  {
    id: 'rerun',
    name: 'Lot Rerun/Reclaim（重工）',
    icon: '\uD83D\uDD04',
    color: '#ff5722',
    desc: 'Lot 通过返工或回收的方式修正问题，重新进入流程',
    scenarios: [
      {
        id: 'rerun-litho',
        name: '光刻返工',
        desc: '套刻精度不合格，需要去胶重新曝光',
        difficulty: 'advanced',
        initialLot: {
          lotName: "LOT-SC-008",
          productSpec: "PROD-A-001",
          processFlow: "PROD-FLOW-001",
          quantity: 25,
          priority: 3,
          state: "wait",
          holdState: "none",
          currentOpIndex: 3,
          bankState: "none",
          reworkState: "none",
          branchState: "none",
          history: []
        },
        narrative: {
          title: '场景：光刻返工',
          background: '批次 LOT-SC-008 完成光刻（PHT-01）和蚀刻（ETCH-01）后进入 INSP-01 检测。检测发现套刻精度（Overlay）严重偏移，超出规格限。工程师判定需要返工：将光刻胶去除后重新曝光。返工路径：回退到 PHT-01 重新执行。',
          objective: '执行完整的光刻返工流程：进入返工模式 → 重新加工 → 完成返工。'
        },
        steps: [
          {
            id: 1,
            instruction: '套刻精度不合格！需要返工。请执行 Rework 操作，系统将自动回退到 PHT-01 工序。',
            expectedAction: 'rework',
            hint: '使用"返工 Rework"进入返工模式，批次将自动回退。',
            explanation: 'Rework（返工）操作将批次设为返工状态，并回退到指定工序重新加工。系统会标记批次为 Rework 状态，区分正常生产和返工生产。',
            successMsg: '已进入返工模式，批次回退到 PHT-01。',
            wrongActionMsg: '需要进入返工模式，请执行"返工 Rework"。'
          },
          {
            id: 2,
            instruction: '批次已回退到 PHT-01（光刻工序）。将批次进站进行重新曝光。',
            expectedAction: 'trackIn',
            hint: '使用"进站 TrackIn"将批次送入光刻设备。',
            explanation: '返工模式下的 TrackIn 与正常生产相同，但系统会记录这是返工加工，用于追溯和统计返工频次。',
            successMsg: '批次已进站，正在重新曝光。',
            wrongActionMsg: '请执行"进站 TrackIn"开始重新曝光。'
          },
          {
            id: 3,
            instruction: '光刻重新曝光完成。执行 TrackOut 完成当前工序。',
            expectedAction: 'trackOut',
            hint: '使用"出站 TrackOut"完成光刻工序。',
            explanation: 'TrackOut 后批次前进到下一工序（ETCH-01），在返工模式下继续完成后续工序直到返工结束。',
            successMsg: '光刻工序完成，前进到 ETCH-01。',
            wrongActionMsg: '请执行"出站 TrackOut"完成当前工序。'
          },
          {
            id: 4,
            instruction: '重新曝光后需要重新蚀刻。将批次进站到 ETCH-01。',
            expectedAction: 'trackIn',
            hint: '使用"进站 TrackIn"进入蚀刻设备。',
            explanation: '光刻返工通常需要连带重做后续的蚀刻和检测工序，确保返工后的结果符合规格。',
            successMsg: '批次已进站蚀刻。',
            wrongActionMsg: '请执行"进站 TrackIn"进入蚀刻设备。'
          },
          {
            id: 5,
            instruction: '蚀刻完成，出站后回到 INSP-01 检测。现在完成返工流程，恢复正常生产。',
            expectedAction: 'trackOut',
            hint: '使用"出站 TrackOut"完成蚀刻，然后可以结束返工。',
            explanation: 'TrackOut 后批次前进到 INSP-01，将在检测站验证返工结果。如果合格则可以结束返工模式。',
            successMsg: '蚀刻完成。场景完成！返工流程结束，等待检测验证。',
            wrongActionMsg: '请执行"出站 TrackOut"完成蚀刻。'
          }
        ],
        summary: {
          keyPoints: [
            'Rework 操作进入返工模式并自动回退工序',
            '返工期间的加工操作与正常生产相同（TrackIn/TrackOut）',
            '光刻返工通常需要连带重做后续蚀刻和检测',
            '返工完成后通过"完成返工"恢复正常生产'
          ],
          realWorldNote: '光刻返工（Rework）是半导体制造中最常见的返工类型。返工流程：去胶（Strip）→ 清洗（Clean）→ 涂胶（Coat）→ 曝光（Expose）→ 显影（Develop）。返工次数通常有上限（如最多 3 次），超过后可能需要报废。每次返工都会在晶圆表面留下痕迹，影响最终良率。'
        }
      },
      {
        id: 'rerun-film',
        name: '薄膜去除重长',
        desc: '薄膜厚度异常，需腐蚀掉薄膜后重新沉积',
        difficulty: 'intermediate',
        initialLot: {
          lotName: "LOT-SC-009",
          productSpec: "PROD-A-001",
          processFlow: "PROD-FLOW-001",
          quantity: 25,
          priority: 3,
          state: "wait",
          holdState: "none",
          currentOpIndex: 6,
          bankState: "none",
          reworkState: "none",
          branchState: "none",
          history: []
        },
        narrative: {
          title: '场景：薄膜去除重长',
          background: '批次 LOT-SC-009 在 ETCH-02 完成蚀刻后等待检测。但工程师发现 CVD-02 沉积的薄膜厚度比目标值偏厚 15%，超出规格。需要将已沉积的薄膜腐蚀去除后重新生长。',
          objective: '执行返工流程：回退到 CVD-02 工序重新沉积薄膜。'
        },
        steps: [
          {
            id: 1,
            instruction: '薄膜厚度超出规格！需要返工。请执行 Rework 操作回退重做。',
            expectedAction: 'rework',
            hint: '使用"返工 Rework"进入返工模式。',
            explanation: '从 ETCH-02（index 6）执行 Rework 会回退到 CVD-02（index 4），正好是需要重做薄膜沉积的工序。',
            successMsg: '已进入返工模式，回退到 CVD-02。',
            wrongActionMsg: '需要返工，请执行"返工 Rework"。'
          },
          {
            id: 2,
            instruction: '批次已回退到 CVD-02。进站重新进行薄膜沉积（设备已调整参数）。',
            expectedAction: 'trackIn',
            hint: '使用"进站 TrackIn"进入 CVD 设备。',
            explanation: '返工前工程师会调整设备配方（Recipe），修正导致膜厚异常的参数，然后重新沉积。',
            successMsg: '批次已进站，正在重新沉积薄膜。',
            wrongActionMsg: '请执行"进站 TrackIn"开始重新沉积。'
          },
          {
            id: 3,
            instruction: '薄膜重新沉积完成，出站到下一工序。',
            expectedAction: 'trackOut',
            hint: '使用"出站 TrackOut"完成沉积工序。',
            explanation: 'TrackOut 后批次前进到 PHT-02，在返工模式下继续执行后续工序。',
            successMsg: '沉积完成，前进到 PHT-02。',
            wrongActionMsg: '请执行"出站 TrackOut"完成当前工序。'
          },
          {
            id: 4,
            instruction: '薄膜重新沉积完成，返工流程可以结束。请完成返工，恢复正常生产。',
            expectedAction: 'completeRework',
            hint: '使用"完成返工"结束返工模式。',
            explanation: '完成返工后批次状态恢复正常，后续工序按正常流程执行。系统会记录返工历史供追溯。',
            successMsg: '返工完成，恢复正常生产。场景完成！',
            wrongActionMsg: '返工已达目标，请执行"完成返工"。'
          }
        ],
        summary: {
          keyPoints: [
            '薄膜厚度异常需要先去除再重新沉积',
            'Rework 自动回退到需要重做的工序',
            '返工前需要调整设备参数（Recipe）',
            '"完成返工"恢复批次到正常生产状态'
          ],
          realWorldNote: '薄膜返工（Film Rework）比光刻返工复杂度更高。去除薄膜通常使用湿法蚀刻（Wet Etch）或等离子体蚀刻（Dry Etch），需要精确控制以避免损伤底层结构。返工前需要做 Demo Run 验证新的设备参数，确保重新沉积的膜厚在规格内。'
        }
      },
      {
        id: 'rerun-reclaim',
        name: '晶圆回收',
        desc: '测试晶圆使用后研磨抛光回收，重新进入产线',
        difficulty: 'intermediate',
        initialLot: {
          lotName: "MON-2025-001",
          productSpec: "MONITOR-STD",
          processFlow: "PROD-FLOW-001",
          quantity: 5,
          priority: 5,
          state: "wait",
          holdState: "none",
          currentOpIndex: 4,
          bankState: "none",
          reworkState: "none",
          branchState: "none",
          history: []
        },
        narrative: {
          title: '场景：晶圆回收（Reclaim）',
          background: 'Monitor 批次 MON-2025-001 包含 5 片测试晶圆，已完成第一轮设备监控测试（CVD-01 到 INSP-01）。这些 Monitor Wafer 使用后需要回收：经过研磨抛光后可以重新作为测试晶圆进入产线。',
          objective: '将已使用的 Monitor 批次 Hold 后进行线下回收处理，然后回退到起始工序准备下一轮测试。'
        },
        steps: [
          {
            id: 1,
            instruction: 'Monitor Wafer 已完成本轮测试。先 Hold 批次，准备送去线下研磨抛光。',
            expectedAction: 'holdLot',
            hint: '使用"扣留批次 Hold"准备线下处理。',
            explanation: 'Monitor Wafer 回收是线下操作（不在 MES 系统的正常流程中），需要先 Hold 批次标记为回收处理中。',
            successMsg: '批次已扣留，准备送去研磨抛光。',
            wrongActionMsg: '请先 Hold 批次，准备线下回收。'
          },
          {
            id: 2,
            instruction: '研磨抛光完成，晶圆表面恢复可用状态。请释放 Hold。',
            expectedAction: 'releaseHold',
            hint: '回收完成，使用"释放扣留 Release"。',
            explanation: '线下回收完成后释放 Hold，晶圆表面经过研磨抛光后恢复到可用状态，可以重新投入使用。',
            successMsg: '批次已释放，晶圆已回收完成。',
            wrongActionMsg: '回收完成，请执行"释放扣留 Release"。'
          },
          {
            id: 3,
            instruction: '回收完成的 Monitor Wafer 需要回退到初始工序，准备下一轮测试。请执行工序回退。',
            expectedAction: 'backupOp',
            hint: '使用"返回工序 Backup"回退到前一工序。',
            explanation: '通过回退工序将 Monitor 批次重新定位到早期工序。实际系统中通常使用 ChangeOp 直接跳转到第一道工序，这里用 Backup 演示逐步回退。',
            successMsg: '工序已回退。场景完成！Monitor Wafer 可以开始新一轮测试。',
            wrongActionMsg: '需要回退工序，请执行"返回工序 Backup"。'
          }
        ],
        summary: {
          keyPoints: [
            'Monitor Wafer 是可重复使用的测试晶圆',
            '回收处理是线下操作，MES 中通过 Hold/Release 管理',
            '回收后需要回退工序到起始位置',
            'Monitor Wafer 通常有回收次数上限'
          ],
          realWorldNote: 'Monitor Wafer（监控片）在半导体工厂中大量使用，用于设备状态监控、工艺稳定性验证等。每片 Monitor Wafer 可以回收使用 5-10 次，回收包括研磨（Lapping）、抛光（Polishing）和清洗（Cleaning）。回收次数过多会导致晶圆厚度低于最低要求而被最终报废。'
        }
      }
    ]
  },

  // ============================================
  // 4. Lot Priority Change（优先级变更）
  // ============================================
  {
    id: 'priority',
    name: 'Priority Change（优先级变更）',
    icon: '\u26A1',
    color: '#e91e63',
    desc: 'Lot 物理状态不变，但在队列中的逻辑顺序发生变化',
    scenarios: [
      {
        id: 'priority-hot',
        name: 'Hot Lot 加急',
        desc: '客户加急订单，需要优先插入队列生产',
        difficulty: 'beginner',
        initialLot: {
          lotName: "LOT-SC-010",
          productSpec: "PROD-A-001",
          processFlow: "PROD-FLOW-001",
          quantity: 25,
          priority: 3,
          state: "wait",
          holdState: "none",
          currentOpIndex: 2,
          bankState: "none",
          reworkState: "none",
          branchState: "none",
          history: []
        },
        narrative: {
          title: '场景：Hot Lot 加急',
          background: '客户 A 发来紧急通知：市场需求突增，批次 LOT-SC-010 对应的产品需要提前交货。业务部门要求将该批次提升为 Hot Lot（加急批次），优先级从 P3（Normal）提升到 P1（Hot），使其在派工队列中排到最前。',
          objective: '将批次提升为 Hot Lot 并立即安排加工。'
        },
        steps: [
          {
            id: 1,
            instruction: '客户要求加急！请将批次优先级从 P3（Normal）提升为 P1（Hot Lot）。',
            expectedAction: '_changePriority',
            actionParams: { newPriority: 1 },
            hint: '点击下方的"提升优先级"按钮执行变更。',
            explanation: 'Hot Lot 优先级提升后，派工系统（Dispatch System）会将该批次排到设备队列的最前端，优先于所有 Normal 优先级的批次。',
            successMsg: '优先级已提升为 P1（Hot Lot）！',
            wrongActionMsg: '请先提升批次优先级，点击"提升优先级"按钮。'
          },
          {
            id: 2,
            instruction: '优先级已提升。该批次现在排在 ETCH-01 设备队列最前。立即将批次进站加工。',
            expectedAction: 'trackIn',
            hint: '使用"进站 TrackIn"立即开始加工。',
            explanation: 'Hot Lot 提升优先级后会跳过队列中的其他批次，优先获得设备资源。操作员需要立即 TrackIn 开始加工。',
            successMsg: '批次已紧急进站加工。',
            wrongActionMsg: '请执行"进站 TrackIn"立即开始加工。'
          },
          {
            id: 3,
            instruction: '加工完成。执行 TrackOut 让 Hot Lot 尽快前进到下一工序。',
            expectedAction: 'trackOut',
            hint: '使用"出站 TrackOut"完成当前工序。',
            explanation: 'Hot Lot 在整个流程中都享有优先权，每个工序都会被优先处理，以缩短总周期时间（Cycle Time）。',
            successMsg: 'Hot Lot 完成当前工序。场景完成！',
            wrongActionMsg: '请执行"出站 TrackOut"完成工序。'
          }
        ],
        summary: {
          keyPoints: [
            'Hot Lot 优先级通常为 P1，排在队列最前',
            '优先级提升后所有后续工序都享有优先权',
            'Hot Lot 可显著缩短批次的总周期时间',
            '但过多 Hot Lot 会影响其他正常批次的交期'
          ],
          realWorldNote: '在实际工厂中，Hot Lot 的数量通常有严格控制（如不超过在制品总量的 5%）。过多的 Hot Lot 会导致"所有人都加急等于没人加急"的局面。Hot Lot 的审批通常需要产线主管或更高层级的批准。'
        }
      },
      {
        id: 'priority-superhot',
        name: 'Super Hot Lot 特急',
        desc: '工程样品或关键客户需求，需要打断当前设备立即生产',
        difficulty: 'intermediate',
        initialLot: {
          lotName: "LOT-SC-011",
          productSpec: "PROD-C-003",
          processFlow: "PROD-FLOW-001",
          quantity: 5,
          priority: 3,
          state: "wait",
          holdState: "none",
          currentOpIndex: 1,
          bankState: "none",
          reworkState: "none",
          branchState: "none",
          history: []
        },
        narrative: {
          title: '场景：Super Hot Lot 特急',
          background: '研发部门的关键工程样品批次 LOT-SC-011（仅 5 片）急需完成光刻验证。该结果将决定新产品能否按时进入量产阶段。产线总监要求将其设为 Super Hot Lot，不仅优先排队，还需要打断其他正在运行的批次来让路。',
          objective: '将批次设为最高优先级并紧急安排加工。'
        },
        steps: [
          {
            id: 1,
            instruction: '总监指令：将批次设为 Super Hot（优先级 P0）！这是最高优先级，将打断一切排队。',
            expectedAction: '_changePriority',
            actionParams: { newPriority: 0 },
            hint: '点击下方的"设为最高优先级"按钮。',
            explanation: 'Super Hot Lot（P0）是最高优先级，不仅排在队列最前，还会触发设备调度系统主动"抢占"资源——当前设备上的批次完成后立即切换到 Super Hot。',
            successMsg: '优先级已设为 P0（Super Hot Lot）！',
            wrongActionMsg: '请先设为最高优先级，点击"设为最高优先级"按钮。'
          },
          {
            id: 2,
            instruction: 'Super Hot Lot 就绪！设备已腾出，立即进站。',
            expectedAction: 'trackIn',
            hint: '使用"进站 TrackIn"立即加工。',
            explanation: 'Super Hot Lot 进站时，设备可能需要特殊准备（如优先加载该批次的 Recipe），操作员需要确认设备就绪后立即 TrackIn。',
            successMsg: '批次已紧急进站！',
            wrongActionMsg: '请执行"进站 TrackIn"。'
          },
          {
            id: 3,
            instruction: '加工完成，尽快出站推进流程。',
            expectedAction: 'trackOut',
            hint: '使用"出站 TrackOut"。',
            explanation: 'Super Hot Lot 的每个工序转换都需要最快速度，整个流程的目标是将周期时间压缩到极限。',
            successMsg: '工序完成。场景完成！',
            wrongActionMsg: '请执行"出站 TrackOut"。'
          }
        ],
        summary: {
          keyPoints: [
            'Super Hot Lot（P0）是最高优先级，可打断排队',
            '通常用于工程样品、关键客户紧急需求',
            '数量极少（每周仅 1-2 个），需要总监级审批',
            '会显著影响其他批次的排程'
          ],
          realWorldNote: 'Super Hot Lot 在实际工厂中极其稀少，因为它会打乱整条产线的排程。使用时需要权衡：加速一个批次意味着减缓其他所有批次。一些工厂用颜色编码区分：绿色=Normal、黄色=Hot、红色=Super Hot。Super Hot Lot 通常有专人全程跟踪（Lot Escort）。'
        }
      },
      {
        id: 'priority-upgrade',
        name: '优先级提升',
        desc: '批次交期临近，将优先级从 Normal 提升到 High',
        difficulty: 'beginner',
        initialLot: {
          lotName: "LOT-SC-012",
          productSpec: "PROD-A-001",
          processFlow: "PROD-FLOW-001",
          quantity: 25,
          priority: 3,
          state: "wait",
          holdState: "none",
          currentOpIndex: 5,
          bankState: "none",
          reworkState: "none",
          branchState: "none",
          history: []
        },
        narrative: {
          title: '场景：优先级提升',
          background: '批次 LOT-SC-012 原本按正常优先级（P3）生产。但计划部门发现该批次的预计完成时间已经接近客户交期（Due Date），如果继续按正常排程可能无法按时交货。需要将优先级提升到 P2（High）。',
          objective: '提升批次优先级以确保按时交货。'
        },
        steps: [
          {
            id: 1,
            instruction: '交期预警！请将批次优先级从 P3（Normal）提升到 P2（High）。',
            expectedAction: '_changePriority',
            actionParams: { newPriority: 2 },
            hint: '点击下方的"提升优先级"按钮。',
            explanation: '优先级提升是产线管理中最常见的调度手段。当批次的预计完成时间（ETA）接近或超过交期（Due Date）时，需要提升优先级加速生产。',
            successMsg: '优先级已提升为 P2（High）！',
            wrongActionMsg: '请先提升优先级，点击下方按钮。'
          },
          {
            id: 2,
            instruction: '优先级提升后，批次在 PHT-02 设备队列中排名上升。请将批次进站加工。',
            expectedAction: 'trackIn',
            hint: '使用"进站 TrackIn"开始加工。',
            explanation: '优先级从 P3 提升到 P2 后，批次会在设备排队中跳到 P3 批次的前面，但仍在 P1（Hot）和 P0（Super Hot）之后。',
            successMsg: '批次已进站。场景完成！',
            wrongActionMsg: '请执行"进站 TrackIn"。'
          }
        ],
        summary: {
          keyPoints: [
            '优先级提升是最常见的排程调整手段',
            '通常由计划部门根据交期预警触发',
            'P2（High）排在 P3（Normal）前面',
            '不需要像 Hot Lot 那样的高级审批'
          ],
          realWorldNote: '大型半导体工厂中，优先级管理是自动化的。系统（如 RTD - Real Time Dispatch）会根据批次的交期、当前进度、剩余工序数量自动计算优先级分数，并动态调整排队顺序。人工提升优先级通常只在系统无法自动处理的特殊情况下使用。'
        }
      },
      {
        id: 'priority-merge',
        name: '合批运行',
        desc: '两个数量不足的同类批次合并为一个批次运行',
        difficulty: 'intermediate',
        initialLot: {
          lotName: "LOT-SC-013",
          productSpec: "PROD-A-001",
          processFlow: "PROD-FLOW-001",
          quantity: 12,
          priority: 3,
          state: "wait",
          holdState: "none",
          currentOpIndex: 4,
          bankState: "none",
          reworkState: "none",
          branchState: "none",
          history: []
        },
        narrative: {
          title: '场景：合批运行',
          background: '批次 LOT-SC-013 当前只有 12 片晶圆（之前拆批过），而 CVD-02 设备的最佳运行效率需要满载 25 片。同工序等待的另一批次 LOT-2025-002（10 片，同产品同工艺）也在排队。为了提高设备利用率，决定将两个批次合并。',
          objective: '将两个数量不足的批次合并为一个，提高设备利用效率。'
        },
        steps: [
          {
            id: 1,
            instruction: '设备利用率不足！请执行合批操作，将 LOT-2025-002（10 片）合并到当前批次。',
            expectedAction: 'mergeLot',
            hint: '使用"合批 Merge"将另一批次合并到当前批次。',
            explanation: '合批（Merge）是将两个或多个相同产品、相同工艺的批次合并为一个。合并后数量累加，可以提高设备运行效率（Bath 利用率、Carrier 利用率等）。',
            successMsg: '合批完成！数量已更新。',
            wrongActionMsg: '请执行"合批 Merge"将两个批次合并。'
          },
          {
            id: 2,
            instruction: '合批完成，当前批次数量充足。将批次进站到 CVD-02 满载运行。',
            expectedAction: 'trackIn',
            hint: '使用"进站 TrackIn"开始满载加工。',
            explanation: '合批后批次数量增加，设备可以满载运行，大幅提高产能利用率和单位成本效率。',
            successMsg: '批次已满载进站。',
            wrongActionMsg: '请执行"进站 TrackIn"开始加工。'
          },
          {
            id: 3,
            instruction: '满载加工完成，出站。',
            expectedAction: 'trackOut',
            hint: '使用"出站 TrackOut"。',
            explanation: '合批后的批次作为一个整体继续后续工序，直到所有工序完成或需要再次拆批。',
            successMsg: '工序完成。场景完成！',
            wrongActionMsg: '请执行"出站 TrackOut"。'
          }
        ],
        summary: {
          keyPoints: [
            '合批要求相同产品、相同工艺、相同工序位置',
            '合批可以提高设备利用率和产能效率',
            '合并后批次数量累加，作为一个整体继续',
            '需要注意 Carrier 容量限制（通常 25 片）'
          ],
          realWorldNote: '合批操作在实际工厂中受到严格限制。只有满足以下条件才能合批：(1) 相同产品 (2) 相同工艺流程版本 (3) 相同当前工序 (4) 合并后不超过 Carrier 容量。一些工厂还要求相同优先级和相同生产周次。合批记录会保留在系统中供追溯。'
        }
      }
    ]
  },

  // ============================================
  // 5. Special Handling / Engineering Lot（特殊处置）
  // ============================================
  {
    id: 'special',
    name: 'Special Handling（特殊处置）',
    icon: '\uD83D\uDD2C',
    color: '#9c27b0',
    desc: 'Lot 的流程本身与常规不同，需要特殊标识和管控',
    scenarios: [
      {
        id: 'special-engineering',
        name: '工程试验批次',
        desc: '新产品导入或新工艺验证，走专门的工艺流程',
        difficulty: 'advanced',
        initialLot: {
          lotName: "ENG-2025-001",
          productSpec: "PROD-NEW-X1",
          processFlow: "PROD-FLOW-001",
          quantity: 5,
          priority: 1,
          state: "created",
          holdState: "none",
          currentOpIndex: 0,
          bankState: "none",
          reworkState: "none",
          branchState: "none",
          history: []
        },
        narrative: {
          title: '场景：工程试验批次',
          background: '研发部门新设计的产品 PROD-NEW-X1 需要进行首次流片验证。工程批次 ENG-2025-001 包含 5 片测试晶圆，使用实验性工艺配方。该批次需要走特殊的分支流程：在标准流程基础上增加额外的工艺参数监控。',
          objective: '从头开始创建并推进工程试验批次，进入分支流程执行特殊工艺。'
        },
        steps: [
          {
            id: 1,
            instruction: '工程试验批次已创建。请启动批次，准备进入生产流程。',
            expectedAction: 'startLot',
            hint: '使用"开始批次"启动新创建的批次。',
            explanation: '工程批次（Engineering Lot）与生产批次的生命周期相同，都从 Created 状态开始。不同之处在于它使用实验性配方，并且数量较少（通常 1-5 片）。',
            successMsg: '批次已启动！',
            wrongActionMsg: '请执行"开始批次"启动。'
          },
          {
            id: 2,
            instruction: '批次已启动。将批次投入第一道工序。',
            expectedAction: 'enterProcess',
            hint: '使用"进入工序"进入生产流程。',
            explanation: '进入工序后批次进入 Wait 状态，等待设备派工。工程批次通常有优先级（P1），以加速验证进度。',
            successMsg: '批次已进入第一道工序。',
            wrongActionMsg: '请执行"进入工序"。'
          },
          {
            id: 3,
            instruction: '工程师要求该批次进入特殊分支流程，执行额外的工艺参数测试。请启动分支。',
            expectedAction: 'branch',
            hint: '使用"分支 Branch"进入特殊分支流程。',
            explanation: '分支（Branch）操作将批次从主流程转入分支流程。分支流程通常包含额外的测试步骤、不同的设备参数，或特殊的量测要求。',
            successMsg: '已进入分支流程！',
            wrongActionMsg: '请执行"分支 Branch"进入特殊流程。'
          },
          {
            id: 4,
            instruction: '分支流程中的特殊测试已完成，所有参数符合预期。进站执行标准工序加工。',
            expectedAction: 'trackIn',
            hint: '使用"进站 TrackIn"开始加工。',
            explanation: '分支流程中的加工操作与正常流程相同，但系统会标记为分支状态，所有加工数据会被特殊标注用于工程分析。',
            successMsg: '批次已进站加工。场景完成！',
            wrongActionMsg: '请执行"进站 TrackIn"。'
          }
        ],
        summary: {
          keyPoints: [
            '工程批次使用实验性配方，数量少（1-5 片）',
            '通过 Branch 进入分支流程执行特殊工艺',
            '工程数据会被特殊标注用于分析和验证',
            '验证完成后分支结束，回归主流程'
          ],
          realWorldNote: '工程试验批次（Engineering Lot / Experiment Lot）是新产品导入（NPI）的关键环节。MES 系统会为工程批次配置专门的 Route（工艺路线），包括额外的量测步骤和特殊的 SPC 控制规则。工程批次的数据会被送入 YMS（良率管理系统）进行专门分析。'
        }
      },
      {
        id: 'special-monitor',
        name: '挡控片 / Monitor Wafer',
        desc: '设备维护后的工艺稳定性验证批次',
        difficulty: 'intermediate',
        initialLot: {
          lotName: "MON-PM-001",
          productSpec: "MONITOR-PM",
          processFlow: "PROD-FLOW-001",
          quantity: 3,
          priority: 5,
          state: "created",
          holdState: "none",
          currentOpIndex: 0,
          bankState: "none",
          reworkState: "none",
          branchState: "none",
          history: []
        },
        narrative: {
          title: '场景：挡控片（Monitor Wafer）',
          background: 'CVD-01 设备完成定期保养（PM - Preventive Maintenance）后需要验证工艺稳定性。设备工程师准备了 3 片 Monitor Wafer（挡控片）组成批次 MON-PM-001，需要在设备上运行标准配方来验证沉积均匀性和膜厚。',
          objective: '启动 Monitor 批次并完成设备验证流程。'
        },
        steps: [
          {
            id: 1,
            instruction: '设备 PM 完成，Monitor Wafer 已准备好。请启动挡控批次。',
            expectedAction: 'startLot',
            hint: '使用"开始批次"启动 Monitor 批次。',
            explanation: 'Monitor Wafer（挡控片）是专门用于设备验证的测试晶圆。PM 后必须运行 Monitor 并通过验证，设备才能恢复生产（Qual）。',
            successMsg: '挡控批次已启动。',
            wrongActionMsg: '请执行"开始批次"。'
          },
          {
            id: 2,
            instruction: '批次已启动。将 Monitor 批次投入 CVD-01 工序。',
            expectedAction: 'enterProcess',
            hint: '使用"进入工序"。',
            explanation: 'Monitor 批次进入的是被验证设备对应的工序。批次将在该工序的设备上运行标准验证配方。',
            successMsg: '批次已进入工序。',
            wrongActionMsg: '请执行"进入工序"。'
          },
          {
            id: 3,
            instruction: 'Monitor 批次就绪。将批次进站到 CVD-01 设备进行验证运行。',
            expectedAction: 'trackIn',
            hint: '使用"进站 TrackIn"。',
            explanation: 'TrackIn 到设备上运行验证配方。运行完成后会测量膜厚等参数，与标准值比对来判定设备是否恢复正常。',
            successMsg: '批次已进站，正在运行验证配方。场景完成！',
            wrongActionMsg: '请执行"进站 TrackIn"。'
          }
        ],
        summary: {
          keyPoints: [
            'Monitor Wafer 用于 PM 后的设备验证（Qual）',
            '验证通过后设备才能恢复正常生产',
            'Monitor 数据用于判定设备稳定性',
            'Monitor 批次通常低优先级，不占用生产配额'
          ],
          realWorldNote: '在实际工厂中，每次 PM 后都需要运行 Monitor 进行 Qualification（资质认证）。Qual 流程包括：运行标准 Recipe → 量测关键参数（膜厚、均匀性等）→ 与规格比对 → Pass/Fail 判定。如果 Qual 失败，设备需要重新调整并再次验证，直到通过为止。这期间设备处于 Down 状态，不能生产。'
        }
      },
      {
        id: 'special-customer',
        name: '客户特殊要求',
        desc: '客户指定跳过某些工序或增加额外检查',
        difficulty: 'intermediate',
        initialLot: {
          lotName: "LOT-SC-016",
          productSpec: "PROD-D-004",
          processFlow: "PROD-FLOW-001",
          quantity: 25,
          priority: 2,
          state: "wait",
          holdState: "none",
          currentOpIndex: 3,
          bankState: "none",
          reworkState: "none",
          branchState: "none",
          history: []
        },
        narrative: {
          title: '场景：客户特殊要求',
          background: '客户 D 的随工单上注明特殊要求：该批次可以跳过 INSP-01 常规检测（因为客户自有检测能力），直接进入 CVD-02 继续加工。这可以节省 2 小时的检测时间，加速交货。',
          objective: '根据客户特殊要求跳过检测工序并继续生产。'
        },
        steps: [
          {
            id: 1,
            instruction: '客户要求跳过 INSP-01 检测。请执行跳过工序操作。',
            expectedAction: 'skipOp',
            hint: '使用"跳过工序 Skip"跳过当前检测工序。',
            explanation: 'Skip（跳过工序）允许批次在特殊授权下跳过某道工序。这通常需要工程师审批和客户书面确认。系统会记录跳过操作及原因。',
            successMsg: '已跳过 INSP-01，前进到 CVD-02。',
            wrongActionMsg: '客户要求跳过当前工序，请执行"跳过工序 Skip"。'
          },
          {
            id: 2,
            instruction: '已跳过检测，当前在 CVD-02 等待。将批次进站继续加工。',
            expectedAction: 'trackIn',
            hint: '使用"进站 TrackIn"继续加工。',
            explanation: '跳过工序后批次直接前进到下一工序。虽然跳过了检测，但后续工序的所有标准操作不变。',
            successMsg: '批次已进站加工。',
            wrongActionMsg: '请执行"进站 TrackIn"。'
          },
          {
            id: 3,
            instruction: '加工完成，正常出站。',
            expectedAction: 'trackOut',
            hint: '使用"出站 TrackOut"。',
            explanation: '后续流程正常执行，客户的特殊要求仅影响被跳过的工序。',
            successMsg: '工序完成。场景完成！',
            wrongActionMsg: '请执行"出站 TrackOut"。'
          }
        ],
        summary: {
          keyPoints: [
            '客户特殊要求需要书面确认和工程师审批',
            'Skip 操作跳过工序但系统保留完整记录',
            '跳过工序可以缩短周期时间，但需要风险评估',
            '后续工序不受影响，按正常流程执行'
          ],
          realWorldNote: '实际工厂中，客户特殊要求通过 ECN（Engineering Change Notice）或随工单（Traveler）传递。MES 系统可以配置"Route Deviation"（工艺路线偏差）来管理这类特殊请求。所有偏差操作都需要完整的审计追踪（Audit Trail）和责任人签核。'
        }
      }
    ]
  },

  // ============================================
  // 6. Fab External（厂外因素）
  // ============================================
  {
    id: 'external',
    name: 'Fab External（厂外因素）',
    icon: '\u26A0\uFE0F',
    color: '#795548',
    desc: '原因不在工厂内部，但导致 Lot 无法继续移动',
    scenarios: [
      {
        id: 'external-mask',
        name: '缺料 / 缺 Mask',
        desc: '后段工序需要的光罩未到厂或正在维修',
        difficulty: 'beginner',
        initialLot: {
          lotName: "LOT-SC-017",
          productSpec: "PROD-A-001",
          processFlow: "PROD-FLOW-001",
          quantity: 25,
          priority: 3,
          state: "wait",
          holdState: "none",
          currentOpIndex: 1,
          bankState: "none",
          reworkState: "none",
          branchState: "none",
          history: []
        },
        narrative: {
          title: '场景：缺料 / 缺 Mask',
          background: '批次 LOT-SC-017 已完成 CVD-01 沉积，等待进入 PHT-01 光刻工序。但光刻所需的光罩（Mask/Reticle）正在清洗维护中，预计 4 小时后才能使用。批次需要暂存等待。',
          objective: '将批次暂存到 Bank，等待光罩就绪后取出继续生产。'
        },
        steps: [
          {
            id: 1,
            instruction: '光罩不可用！无法进行光刻。请将批次存入 Bank（暂存区）等待。',
            expectedAction: 'bankIn',
            hint: '使用"入 Bank"将批次暂存到暂存区。',
            explanation: 'Bank（暂存区）是 MES 中的虚拟或物理存储区域。当批次因外部原因无法继续时，将其存入 Bank 可以释放设备旁的物理空间，并在系统中标记为"等待外部条件"。',
            successMsg: '批次已存入 Bank，等待光罩就绪。',
            wrongActionMsg: '批次需要暂存等待光罩，请执行"入 Bank"。'
          },
          {
            id: 2,
            instruction: '4 小时后，光罩维护完成并通过验证。请将批次从 Bank 取出。',
            expectedAction: 'bankOut',
            hint: '使用"出 Bank"将批次从暂存区取出。',
            explanation: '当外部条件就绪（光罩可用）后，从 Bank 取出批次。系统会记录 Bank 停留时间，这部分时间计入非生产等待时间（NVA - Non Value Added）。',
            successMsg: '批次已从 Bank 取出。',
            wrongActionMsg: '光罩已就绪，请执行"出 Bank"取出批次。'
          },
          {
            id: 3,
            instruction: '批次已取出，光罩就绪。将批次进站开始光刻。',
            expectedAction: 'trackIn',
            hint: '使用"进站 TrackIn"。',
            explanation: '取出 Bank 后批次回到正常等待状态，可以立即 TrackIn 进行加工。',
            successMsg: '批次已进站光刻。场景完成！',
            wrongActionMsg: '请执行"进站 TrackIn"开始光刻。'
          }
        ],
        summary: {
          keyPoints: [
            'Bank 用于暂存因外部原因无法继续的批次',
            'Bank 停留时间属于非增值时间（NVA）',
            '光罩维护/清洗期间受影响的批次需要暂存',
            '外部条件就绪后取出 Bank 立即恢复生产'
          ],
          realWorldNote: '光罩（Reticle/Mask）是光刻工序的关键耗材，价值从几万到几百万美元不等。光罩需要定期清洗（Haze Cleaning）和检查（Inspection）。一个光罩可能被多个批次共享，光罩管理系统（RMS - Reticle Management System）负责追踪光罩的使用次数、清洗记录和可用状态。'
        }
      },
      {
        id: 'external-power',
        name: '停电 / 断气',
        desc: '全厂性公用设施中断，所有批次暂停移动',
        difficulty: 'beginner',
        initialLot: {
          lotName: "LOT-SC-018",
          productSpec: "PROD-A-001",
          processFlow: "PROD-FLOW-001",
          quantity: 25,
          priority: 3,
          state: "run",
          holdState: "none",
          currentOpIndex: 2,
          bankState: "none",
          reworkState: "none",
          branchState: "none",
          history: []
        },
        narrative: {
          title: '场景：停电 / 断气',
          background: '工厂供电系统突然发生故障，虽然 UPS（不间断电源）在 30 秒内接管了关键设备供电，但部分设备已经受到影响。批次 LOT-SC-018 正在 ETCH-01 上蚀刻，设备在断电瞬间自动进入安全模式。需要评估批次状态。',
          objective: '紧急处理断电期间正在加工的批次，评估后恢复生产。'
        },
        steps: [
          {
            id: 1,
            instruction: '紧急断电！设备已进入安全模式，正在运行的批次需要紧急扣留评估。',
            expectedAction: 'holdRunLot',
            hint: '使用"运行中扣留"紧急暂停正在运行的批次。',
            explanation: '断电期间正在加工的批次面临最大风险。设备虽然进入安全模式，但加工过程已被打断，需要紧急 Hold 并评估损伤程度。',
            successMsg: '批次已紧急扣留。',
            wrongActionMsg: '批次正在运行中，需要紧急扣留，请使用"运行中扣留"。'
          },
          {
            id: 2,
            instruction: '电力恢复。工程师评估后确认：蚀刻在安全模式下正常终止，晶圆未受损。请释放 Hold。',
            expectedAction: 'releaseHold',
            hint: '工程师确认批次无损，使用"释放扣留 Release"。',
            explanation: '断电后的恢复评估是关键步骤。工程师需要检查设备日志、加工参数记录和晶圆物理状态，确认未受损后才能释放。',
            successMsg: '批次已释放。',
            wrongActionMsg: '请执行"释放扣留 Release"恢复批次。'
          },
          {
            id: 3,
            instruction: '批次释放后需要重新进站完成被中断的蚀刻。',
            expectedAction: 'trackIn',
            hint: '使用"进站 TrackIn"重新开始蚀刻。',
            explanation: '断电导致加工中断，即使晶圆未受损，蚀刻工序也需要重新执行。工程师会根据中断时的进度决定是从头开始还是补充加工。',
            successMsg: '批次已重新进站。场景完成！',
            wrongActionMsg: '请执行"进站 TrackIn"重新蚀刻。'
          }
        ],
        summary: {
          keyPoints: [
            '断电时正在运行的批次风险最高，需要紧急 Hold',
            '设备安全模式可以保护晶圆免受严重损伤',
            '电力恢复后需要工程师全面评估才能释放',
            '被中断的加工通常需要重新执行'
          ],
          realWorldNote: '半导体工厂对供电稳定性要求极高。通常配备多级保护：UPS（毫秒级切换）、柴油发电机（分钟级启动）。断电事件会触发全厂紧急响应程序（ERP - Emergency Response Plan）。所有正在运行的批次都需要逐一评估，损失统计可能达到数百万美元。工厂会定期进行断电演练。'
        }
      },
      {
        id: 'external-system',
        name: '系统锁死',
        desc: 'MES 或自动化系统故障，无法派工和操作',
        difficulty: 'beginner',
        initialLot: {
          lotName: "LOT-SC-019",
          productSpec: "PROD-A-001",
          processFlow: "PROD-FLOW-001",
          quantity: 25,
          priority: 3,
          state: "wait",
          holdState: "none",
          currentOpIndex: 4,
          bankState: "none",
          reworkState: "none",
          branchState: "none",
          history: []
        },
        narrative: {
          title: '场景：系统锁死',
          background: 'MES 系统发生数据库死锁故障，导致所有在线派工和 TrackIn/TrackOut 操作暂时无法执行。IT 部门正在紧急修复，预计 1 小时内恢复。期间所有批次需要进入安全状态。',
          objective: '在系统故障期间将批次置于安全状态，系统恢复后释放继续。'
        },
        steps: [
          {
            id: 1,
            instruction: 'MES 系统故障！所有操作暂停。请 Hold 当前批次，防止在系统不稳定时误操作。',
            expectedAction: 'holdLot',
            hint: '使用"扣留批次 Hold"进入安全状态。',
            explanation: '系统故障期间执行 Hold 是一种保护措施。虽然系统故障理论上不会改变批次的物理状态，但 Hold 可以防止在系统部分恢复时发生数据不一致的误操作。',
            successMsg: '批次已 Hold，进入安全状态。',
            wrongActionMsg: '系统故障期间需要 Hold 批次保护，请执行"扣留批次 Hold"。'
          },
          {
            id: 2,
            instruction: '1 小时后 MES 系统已恢复正常，IT 确认数据一致性无问题。请释放 Hold 恢复生产。',
            expectedAction: 'releaseHold',
            hint: '系统恢复，使用"释放扣留 Release"。',
            explanation: '系统恢复后，IT 部门需要确认数据库一致性、检查是否有丢失的事务记录，确认无误后才能释放所有被保护性 Hold 的批次。',
            successMsg: '批次已释放，恢复正常生产。场景完成！',
            wrongActionMsg: '系统已恢复，请执行"释放扣留 Release"。'
          }
        ],
        summary: {
          keyPoints: [
            '系统故障时 Hold 批次是保护性措施',
            '防止数据不一致导致的误操作',
            '系统恢复后需要 IT 确认数据一致性',
            '释放前要检查是否有丢失的操作记录'
          ],
          realWorldNote: 'MES 系统故障是半导体工厂的严重事件。大型工厂通常配备 HA（High Availability）集群和灾备系统，确保 99.9% 以上的可用性。系统故障期间，工厂可能切换到纸质工单模式（Paper Mode）继续关键操作，系统恢复后再手动补录到 MES 中。'
        }
      }
    ]
  }
];
