# NodeCoda 不支持的目标语义

<!-- DOCFORG:VERSION:BEGIN -->
> **语言**: nodecoda/1 | **标准库 API**: v1 | **Build Target**: dify-1.16-graphon-0.6
> **文档版本**: 2026-08-13
> **内容来源**: 版本化语言事实与验证示例
<!-- DOCFORG:VERSION:END -->


本页列出的项目不是“非法 NodeCoda 语法”，而是当前 Dify/Graphon Build Target 无法在不改变
可观察语义的前提下承载的能力形状。Workflow Build 会在生成工作流之前返回目标诊断。

## 当前拒绝项

<!-- DOCFORG:BEGIN section=rejected-capabilities -->
### REJECTED

| Capability | Kind | Disposition | Certification | 原因 |
|------------|------|-------------|---------------|------|
| human-input | Graphon | REJECTED | not_required | dynamic form defaults are not represented by the current NodeCoda contract |
| human-input | Graphon | REJECTED | not_required | NodeCoda request_input is limited to the Console delivery surface |
| human-input | Graphon | REJECTED | not_required | NodeCoda request_input does not expose file form fields |
| parameter-extractor | Graphon | REJECTED | not_required | Graphon parameter type whitelist has no nested object or nested array schema representation |
| parameter-extractor | Graphon | REJECTED | not_required | Graphon exact-cardinality validation rejects omitted optional fields with Invalid number of parameters |
| variable-assigner | Graphon | REJECTED | not_required | legacy aggregation accepted only for compatibility input; the current target never emits it |
| binding.assignment | Language | REJECTED | not_required | unowned workflow mutation has no target store |
| condition.effectful | Language | REJECTED | not_required | effectful conditions reject before graph emission |
| expression.lambda | Language | REJECTED | not_required | lambda values have no public workflow port contract |
| function.recursion | Language | REJECTED | not_required | recursive expansion is not target-lowerable |
| type.any-boundary | Language | REJECTED | not_required | any is restricted to declared external boundaries |

### PENDING

| Capability | Kind | Disposition | Certification | 原因 |
|------------|------|-------------|---------------|------|
| agent | Graphon | PENDING | uncertified | canonical v2 Agent lowering is sealed offline, but the deployed Console returns no exact provider/strategy/tool profile or live evidence |
| datasource | Graphon | PENDING | not_required | Datasource is a Graphon ROOT surface, not a normal workflow node |
| datasource | Graphon | PENDING | uncertified | local-file RAG Pipeline lowering has no certified YAML or live evidence |
| human-input | Graphon | PENDING | not_required | paragraph/select form lowering and approve/reject topology pass offline, but direct human_input_form_filled evidence is blocked |
| human-input | Graphon | PENDING | not_required | timeout lowering is sealed offline but has no accelerated live evidence |
| interaction.human-input | Language | PENDING | not_required | NodeCoda request_input semantics and canonical lowering are sealed offline, but the deployed Console event stream has not produced direct action-resume evidence |

### Runtime uncertified

| Capability | Kind | Disposition | Certification | 原因 |
|------------|------|-------------|---------------|------|
| agent | Graphon | PENDING | uncertified | canonical v2 Agent lowering is sealed offline, but the deployed Console returns no exact provider/strategy/tool profile or live evidence |
| answer | Graphon | EXPOSED | uncertified | emitted by the NodeCoda lowering pipeline |
| assigner | Graphon | EXPOSED | uncertified | canonical assigner version 2 items payload emitted by NodeCoda |
| code | Graphon | EXPOSED | uncertified | emitted by the NodeCoda lowering pipeline |
| datasource | Graphon | PENDING | uncertified | local-file RAG Pipeline lowering has no certified YAML or live evidence |
| document-extractor | Graphon | EXPOSED | uncertified | emitted by the NodeCoda lowering pipeline |
| end | Graphon | EXPOSED | uncertified | emitted by the NodeCoda lowering pipeline |
| http-request | Graphon | EXPOSED | uncertified | emitted by the NodeCoda lowering pipeline |
| if-else | Graphon | EXPOSED | uncertified | emitted by the NodeCoda lowering pipeline |
| iteration | Graphon | EXPOSED | uncertified | emitted by the NodeCoda lowering pipeline |
| iteration-start | Graphon | EXPOSED | uncertified | emitted by the NodeCoda lowering pipeline |
| knowledge-retrieval | Graphon | EXPOSED | uncertified | emitted by the NodeCoda lowering pipeline |
| llm | Graphon | EXPOSED | uncertified | emitted by the NodeCoda lowering pipeline |
| loop | Graphon | EXPOSED | uncertified | emitted by the NodeCoda lowering pipeline |
| loop-end | Graphon | EXPOSED | uncertified | emitted by the NodeCoda lowering pipeline |
| loop-start | Graphon | EXPOSED | uncertified | emitted by the NodeCoda lowering pipeline |
| start | Graphon | EXPOSED | uncertified | emitted by the NodeCoda lowering pipeline |
| template-transform | Graphon | EXPOSED | uncertified | emitted by the NodeCoda lowering pipeline |
| tool | Graphon | EXPOSED | uncertified | emitted by the NodeCoda lowering pipeline |
| variable-aggregator | Graphon | EXPOSED | uncertified | emitted by the NodeCoda lowering pipeline |
| binding.let | Language | EXPOSED | uncertified | immutable bindings |
| binding.var-loop | Language | EXPOSED | uncertified | loop-owned mutable binding |
| control.block | Language | EXPOSED | uncertified | lexical statement block |
| control.break | Language | EXPOSED | uncertified | nearest-loop break exit |
| control.continue | Language | EXPOSED | uncertified | nearest-loop continue exit |
| control.for-expression | Language | EXPOSED | uncertified | value iteration |
| control.for-statement | Language | EXPOSED | uncertified | statement iteration |
| control.if | Language | EXPOSED | uncertified | conditional branch control flow |
| control.parallel | Language | EXPOSED | uncertified | isolated parallel branches |
| control.parallel-for | Language | EXPOSED | uncertified | ordered parallel iteration and all three failure policies have exact live evidence |
| control.return | Language | EXPOSED | uncertified | function return exit |
| control.while | Language | EXPOSED | uncertified | bounded loop control flow |
| control.yield | Language | EXPOSED | uncertified | iteration yield |
| declaration.code | Language | MATERIALIZED | uncertified | typed code function declaration |
| declaration.function | Language | EXPOSED | uncertified | workflow function declaration |
| declaration.output | Language | EXPOSED | uncertified | public workflow output declaration |
| declaration.type | Language | EXPOSED | uncertified | named type declaration |
| expression.arithmetic | Language | MATERIALIZED | uncertified | typed calculation node |
| expression.array | Language | EXPOSED | uncertified | array literal values |
| expression.call | Language | EXPOSED | uncertified | typed function and operation calls |
| expression.comparison | Language | MATERIALIZED | uncertified | typed comparison calculation |
| expression.field-access | Language | EXPOSED | uncertified | typed field access |
| expression.index | Language | EXPOSED | uncertified | typed index access |
| expression.literal | Language | EXPOSED | uncertified | literal values |
| expression.logical | Language | MATERIALIZED | uncertified | typed calculation node |
| expression.map | Language | EXPOSED | uncertified | map literal values |
| expression.record | Language | EXPOSED | uncertified | record literal values |
| expression.selector | Language | EXPOSED | uncertified | producer-backed selectors |
| expression.template | Language | MATERIALIZED | uncertified | template interpolation materialization |
| expression.ternary | Language | MATERIALIZED | uncertified | typed conditional calculation |
| function.code | Language | MATERIALIZED | uncertified | code functions lower to typed Code nodes |
| function.foreign-code | Language | MATERIALIZED | uncertified | typed foreign Python code materialization |
| function.workflow | Language | EXPOSED | uncertified | workflow functions are graph-expanded |
| operation.answer | Language | EXPOSED | uncertified | advanced-chat answer emission |
| operation.failure-policy | Language | EXPOSED | uncertified | explicit operation failure policies |
| operation.http | Language | EXPOSED | uncertified | HTTP operation |
| operation.knowledge | Language | EXPOSED | uncertified | knowledge retrieval operation |
| operation.llm | Language | EXPOSED | uncertified | LLM operation |
| operation.output | Language | EXPOSED | uncertified | workflow output accumulation |
| operation.stdlib | Language | EXPOSED | uncertified | versioned standard-library operation |
| operation.tool | Language | EXPOSED | uncertified | tool operation |
| program.mode.advanced-chat | Language | EXPOSED | uncertified | advanced-chat response mode |
| program.mode.agent | Language | EXPOSED | uncertified | @mode agent 智能体应用（start → agent → end） |
| program.mode.workflow | Language | EXPOSED | uncertified | workflow response mode |
| response.advanced-chat | Language | EXPOSED | uncertified | advanced-chat Answer response |
| response.workflow | Language | EXPOSED | uncertified | workflow End response |
| type.array | Language | EXPOSED | uncertified | typed array values |
| type.map | Language | EXPOSED | uncertified | string-keyed map values |
| type.optional | Language | MATERIALIZED | uncertified | optional selectors are materialized with path checks |
| type.primitive | Language | EXPOSED | uncertified | typed scalar values |
| type.record | Language | EXPOSED | uncertified | named structural records |
<!-- DOCFORG:END section=rejected-capabilities -->

## 处理原则

1. 以 [目标兼容性矩阵](TARGET-COMPATIBILITY.md) 中的状态和证据为准。
2. 不要把 `REJECTED` 改写为语言语义限制。
3. 不要用手写 YAML、静默丢值或猜测端口绕过诊断。
4. 目标能力改变后，以新版本兼容表和运行证据为准，不沿用旧 Build 的结论。
