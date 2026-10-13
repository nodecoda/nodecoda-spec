# NodeCoda Build Target 兼容性 — coze-biz

<!-- DOCFORG:VERSION:BEGIN -->
> **语言**: nodecoda/1 | **标准库 API**: v1 | **Build Target**: coze-biz-1.0
> **文档版本**: 2026-10-13
> **内容来源**: 版本化语言事实与验证示例
<!-- DOCFORG:VERSION:END -->


NodeCoda Workflow Language 是否合法、当前 **coze-biz** Build Target 能否无损承载、以及目标运行时
是否已经认证，是三个不同结论。dify 面的逐能力状态见 [`TARGET-COMPATIBILITY.md`](TARGET-COMPATIBILITY.md)；
本页是 **coze-biz** Build Target 的兼容性面。

状态含义（与 `TARGET-COMPATIBILITY.md` 同口径）：

- `ENABLED`：Workflow Build 支持该形状，并存在列出的目标证据。
- `REJECTED`：NodeCoda 语法本身可能合法，但当前 Target 不能保持其语义，Build 会失败关闭。
- 没有运行时证据时，不得从“Build 成功”推断“运行时已认证”。

## 本次收录范围

本页当前收录 **coze-biz 的节点类型对应、平台形状契约与已知限制**。`TARGET-COMPATIBILITY.md`
那种逐 `capability.*` 事实的**完整能力矩阵尚未镜像到本页**（列为待补）⇒ 本页的
`ENABLED`/`REJECTED` 只覆盖下面**点名**的形状，**不构成完整承诺**。

## 节点类型对应

coze-biz 的节点由 `type` 字符串标识；同一 NodeCoda 构造在不同 Target 上由不同节点承载，语义必须一致
（ncoda 自身的自洽优先于平台形状）。常用对应：

| NodeCoda 构造 | coze-biz 节点（`type`） |
|----------------|--------------------------|
| `function main(...)` 入口参数 | `start` |
| `llm("provider/model", …)` | `llm` |
| `if (cond) { … } else { … }` | `condition` |
| `llm` 多出口分类（`switch`） | `question`（分类器；`intent` 为另一种） |
| `for (item in items) { … }` | `loop` / `batch` |
| `knowledge(…)` | `knowledge` |
| `foreign code python3(…) -> T { … }` | `code` |
| `http(...)` | `http` |
| 平台插件调用（`import "…"; provider.operation(...)`） | `plugin` |
| 互斥分支收敛（`if`/`switch` 汇聚） | `variable_merge` |
| 变量赋值（`T v = …;`） | `assign_variable` |
| 一次输出发射（`output(expr)`） | `output` |
| 流程出口（`return …`） | `end` |
| 挂起式人工输入（`ask<Form, Action>`） | `question`（HITL 面） |
| `subflow` 调用 | `subflow` |

商业版另有 `message_*` / `conversation_*` / `dataset_write` / `ltm_*` / `image_generate` /
`drawing_board` / `video_*` 等扩展节点面；开源版独有 `LAMBDA`（coze-biz 无）。

## 平台形状契约（coze-biz）

以下都是 **A 级**平台形状结论（随语言事实一起演进；冲突时以最新裁定为准）。每条只给**口径**，完整
推导与证据见参考实现（godcc）的 `docs/PROJECT-CONTRACT.md` §「平台形状契约（coze-biz 后端）」。

1. **coze-biz 是 nil-less 平台**：语言层仍可有 `null`/`Optional`（其他 Target 需要），但 coze-biz 侧
   编译/反编译都按「输入边界 FillZero 零值吸收」实现 —— 对外可观察世界无 `nil`/`null`。
2. **`merge`（`variable_merge`）是 zero 语义，不是 nil/null 语义**：候选缺省 = 该类型 zero；返回第一个
   非 zero 候选；全 zero ⇒ 返回 zero。「执行臂产出空串」与「未执行」在取值上同权 —— 故 **不建模
   first_not_null**；raising 侧**禁止生成 `??`**，`merge` 一律还原为「提升变量 + 零值初值 + 臂内赋值 +
   下游直读」的纯结构形态。
3. **`merge` 只服务分支收敛**：只用 `if`/`switch`（互斥臂）的汇聚，绝不用于 `parallel` 的结果收集。
4. **`presence`（`required`）是事实废弃字段**：`merge` 的 `nil` 被 FillZero 零值吸收 ⇒ `required` 无消费者；
   回声位（legacy `Group1` `merge` 输出、code ref 输入注入等复制 producer 声明的位置）递归剥除 `required`。
5. **`assign_variable` 的赋值是纯 `set`**：平台没有「递增 / 聚合」类赋值算子 ⇒ 需要聚合/累积语义的形状
   必须由语言层展开（如 `for`/`loop` 的态变量），不得假设平台提供累加。

## 已知限制与拒绝项

| 形状 | Disposition | 原因 |
|------|-------------|------|
| `parallel` 的结果收集经 `merge` | REJECTED | 平台 `merge` 是零值兜底的选择语义，不是 `parallel` 的 fan-in 值聚合 ⇒ 该形状超出 coze-biz 承载面 |
| 依赖 `nil`/`null` 传播的取值（如 first-not-null 短路） | REJECTED | 平台 nil-less（输入边界 FillZero）⇒ `nil` 在平台上不可观察 |
| `assign_variable` 的递增 / 聚合赋值 | REJECTED | 平台赋值是纯 `set`（见上「平台形状契约」第 5 条） |
| 多「默认候选」的 `merge` 组 | PENDING | 平台允许一组挂两个以上默认候选；NodeCoda 侧当前只能表达一个 ⇒ 反编译到该形状须失败关闭（fail loud），不得静默丢弃第二个默认值 |

> 说明：上表随标准与参考实现演进；`TARGET-COMPATIBILITY.md` 的完整 `capability.*` 能力矩阵镜像到本页
> 之前，本表**不是** coze-biz 面的完整拒绝项清单。
