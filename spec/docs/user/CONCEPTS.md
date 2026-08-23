# NodeCoda 核心概念

<!-- DOCFORG:VERSION:BEGIN -->
> **语言**: nodecoda/1 | **标准库 API**: v1 | **Build Target**: dify-1.16-graphon-0.6
> **文档版本**: 2026-08-13
> **内容来源**: 版本化语言事实与验证示例
<!-- DOCFORG:VERSION:END -->


## 从源代码到 Dify

NodeCoda 源文件经过词法和语法分析、绑定与类型检查、目标能力验证、图降低和 YAML 序列化，最终得到可导入 Dify 的工作流。任何一步失败都不会产生可发布的部分图。

```text
.ncoda -> 语法树 -> 语义检查 -> 目标能力检查 -> Dify 图 -> YAML
```

## 设计原则：ncoda 语义独立，投影不承诺全覆盖

**陈述**：ncoda 是一门独立语言。它的语义模型（原语、正交维度、约束）由语言自身定义，
不从任何平台（Dify/Coze/Coze-Biz/Runtime）的节点行为推导，也不反向承诺覆盖任何平台的
全部节点语义。

**推论**：

1. **平台有、ncoda 无**：平台特定节点（如 Dify iterate 细节、Coze 数据库节点等）
   不自动进入语言；若需要，以 ncoda 原语显式暴露，语义由 ncoda 定义。
2. **ncoda 有、平台无**：ncoda 原语投影到某平台时，若该平台无精确等价承载，编译器
   选择**显式降级**——编译期诊断（REJECTED/PENDING，见 [目标语义](UNSUPPORTED-SEMANTICS.md)）、
   文档化近似投影或显式告警；**绝不静默改变语义，也不假装等价**。
3. **语义冲突时**：以 ncoda 语义为准，平台投影负责适配/降级。
4. **投影差异不是缺陷**：某平台缺少 ncoda 原语的等价节点，属于平台能力差异，
   由目标诊断机制显式表达，不构成语言设计缺陷。

> 示例：ncoda `output(expr)` 的语义是"执行中向响应流发布中间消息"（独立定义）。
> Coze 有原生 `OutputEmitter` 承载；Dify 无精确等价节点——此时选择显式降级策略，
> 而非为了对齐 Dify 而改写 ncoda 语义。

## 三个不能混淆的结论



1. **语言有效**：程序符合 NodeCoda 文法、类型和控制流规则。
2. **目标可降低**：选定的 Dify/Graphon 目标能够保持该程序的可观察语义。
3. **运行时已认证**：该精确目标形状有对应的部署运行证据。

语言有效不自动意味着目标可降低，编译成功也不自动意味着运行时已经认证。目标状态见 [目标兼容性](TARGET-COMPATIBILITY.md)。

## 程序与入口

NodeCoda 程序由可选的 `@mode`、类型和枚举声明、常量、辅助函数以及唯一的 `main` 入口组成。`workflow` 使用 End 输出，`advanced-chat` 使用 Answer 消息；`output` 发布中间消息（非终止），`@answer` 声明最终答复文本，`return` 返回结构化结果。`answer(...)` 语句已移除（2026-08-23）。

## 值、操作和控制流

- 普通表达式计算值，按照从左到右的顺序求值。
- `llm`、`http`、`extract` 和外部代码等工作流操作会产生图节点。
- `parallel` 和 `parallel for` 是显式并发边界。
- `attempt` 处理操作级失败；某些操作还具有必须显式检查的软失败通道。
- `return` 是函数控制退出；`main` 的有值返回同时形成模式对应的公开结果。

精确规则见 [语言参考](LANGUAGE-REFERENCE.md)。

## 文档事实来源

语言参考、诊断、标准库和兼容表都绑定页首版本身份。页面之间发生冲突时，以与当前
language identity 和 Build Target 匹配的版本化文档为准。
