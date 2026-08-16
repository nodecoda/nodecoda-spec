# NodeCoda Build Target 兼容性

<!-- DOCFORG:VERSION:BEGIN -->
> **语言**: nodecoda/1 | **标准库 API**: v1 | **Build Target**: dify-1.16-graphon-0.6
> **文档版本**: 2026-08-13
> **内容来源**: 版本化语言事实与验证示例
<!-- DOCFORG:VERSION:END -->


NodeCoda Workflow Language 是否合法、当前 Dify Build Target 能否无损承载、以及目标运行时
是否已经认证，是三个不同结论。本页展示当前 Target 的 Build 支持；精确身份见页首版本信息。

状态含义：

- `ENABLED`：Workflow Build 支持该形状，并存在列出的目标证据。
- `REJECTED`：NodeCoda 语法本身可能合法，但当前 Target 不能保持其语义，Build 会失败关闭。
- 没有运行时证据时，不得从“Build 成功”推断“运行时已认证”。

## 能力矩阵

<!-- DOCFORG:BEGIN section=capability-matrix -->
NodeCoda Source 可以语言有效, 但仍可能无法为当前 Dify Build Target 构建;
语言语义、Build 支持与运行时认证是彼此独立的判断轴。

### NodeCoda 语言语义

| 名称 | Disposition | Build support | Certification | Evidence | Dify range | Diagnostic |
|------|-------------|---------------|---------------|----------|------------|------------|
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-binding-assignment --> binding.assignment | REJECTED | - | not_required | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-binding-let --> binding.let | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-binding-var-loop --> binding.var-loop | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-classification-enum --> classification.enum | EXPOSED | ENABLED | certified | DIFY-RUNTIME-QUESTION-CLASSIFIER-ENUM-2026-07-24 | >=1.16.0rc1,<1.17 | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-condition-calculation --> condition.calculation | MATERIALIZED | ENABLED | certified | DIFY-RUNTIME-CONDITION-CALCULATION-2026-07-17 | >=1.16.0rc1,<1.17 | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-condition-direct --> condition.direct | EXPOSED | ENABLED | certified | DIFY-RUNTIME-CONDITION-DIRECT-2026-07-17 | >=1.16.0rc1,<1.17 | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-condition-effectful --> condition.effectful | REJECTED | REJECTED | not_required | - | - | [E1034](DIAGNOSTICS.md#e1034) |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-control-attempt --> control.attempt | EXPOSED | ENABLED | certified | DIFY-RUNTIME-CONTROL-ATTEMPT-2026-07-23 | >=1.16.0rc1,<1.17 | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-control-block --> control.block | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-control-break --> control.break | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-control-continue --> control.continue | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-control-for-expression --> control.for-expression | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-control-for-statement --> control.for-statement | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-control-if --> control.if | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-control-parallel --> control.parallel | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-control-parallel-for --> control.parallel-for | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-control-return --> control.return | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-control-while --> control.while | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-control-yield --> control.yield | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-declaration-code --> declaration.code | MATERIALIZED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-declaration-function --> declaration.function | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-declaration-output --> declaration.output | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-declaration-type --> declaration.type | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-expression-arithmetic --> expression.arithmetic | MATERIALIZED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-expression-array --> expression.array | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-expression-call --> expression.call | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-expression-comparison --> expression.comparison | MATERIALIZED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-expression-field-access --> expression.field-access | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-expression-index --> expression.index | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-expression-lambda --> expression.lambda | REJECTED | - | not_required | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-expression-literal --> expression.literal | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-expression-logical --> expression.logical | MATERIALIZED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-expression-map --> expression.map | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-expression-record --> expression.record | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-expression-selector --> expression.selector | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-expression-template --> expression.template | MATERIALIZED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-expression-ternary --> expression.ternary | MATERIALIZED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-for-expression-with-yield --> for.expression.with_yield | EXPOSED | ENABLED | certified | DIFY-RUNTIME-FOR-EXPRESSION-WITH_YIELD-2026-07-17 | >=1.16.0rc1,<1.17 | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-for-statement-plain --> for.statement.plain | EXPOSED | ENABLED | certified | DIFY-RUNTIME-FOR-STATEMENT-PLAIN-2026-07-17 | >=1.16.0rc1,<1.17 | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-for-statement-with-exit --> for.statement.with_exit | EXPOSED | ENABLED | certified | DIFY-RUNTIME-FOR-STATEMENT-WITH_EXIT-2026-07-17 | >=1.16.0rc1,<1.17 | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-function-code --> function.code | MATERIALIZED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-function-foreign-code --> function.foreign-code | MATERIALIZED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-function-recursion --> function.recursion | REJECTED | - | not_required | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-function-workflow --> function.workflow | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-interaction-human-input --> interaction.human-input | PENDING | - | not_required | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-loop-function-return --> loop.function_return | EXPOSED | ENABLED | certified | DIFY-RUNTIME-LOOP-FUNCTION_RETURN-2026-07-17 | >=1.16.0rc1,<1.17 | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-operation-answer --> operation.answer | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-operation-failure-policy --> operation.failure-policy | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-operation-http --> operation.http | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-operation-knowledge --> operation.knowledge | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-operation-llm --> operation.llm | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-operation-output --> operation.output | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-operation-stdlib --> operation.stdlib | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-operation-tool --> operation.tool | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-parallel-isolated --> parallel.isolated | EXPOSED | ENABLED | certified | DIFY-RUNTIME-PARALLEL-ISOLATED-2026-07-17 | >=1.16.0rc1,<1.17 | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-program-mode-advanced-chat --> program.mode.advanced-chat | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-program-mode-workflow --> program.mode.workflow | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-response-accumulation --> response.accumulation | EXPOSED | - | certified | DIFY-RUNTIME-RESPONSE-ACCUMULATION-2026-07-17 | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-response-advanced-chat --> response.advanced-chat | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-response-workflow --> response.workflow | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-state-assignment --> state.assignment | EXPOSED | ENABLED | certified | DIFY-RUNTIME-STATE-ASSIGNMENT-2026-07-20 | >=1.16.0rc1,<1.17 | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-type-any-boundary --> type.any-boundary | REJECTED | - | not_required | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-type-array --> type.array | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-type-map --> type.map | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-type-optional --> type.optional | MATERIALIZED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-type-primitive --> type.primitive | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.nodecoda-sem-type-record --> type.record | EXPOSED | - | uncertified | - | - | - |

### Graphon 节点

| 名称 | Disposition | Build support | Certification | Evidence | Dify range | Diagnostic |
|------|-------------|---------------|---------------|----------|------------|------------|
| <!-- DOCFORG:FACT id=capability.graphon-node-agent-function-calling-v1 --> agent | PENDING | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-answer --> answer | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-assigner --> assigner | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-code --> code | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-datasource --> datasource | PENDING | - | not_required | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-datasource-local-file --> datasource | PENDING | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-document-extractor --> document-extractor | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-end --> end | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-http-request --> http-request | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-human-input-console-text-action --> human-input | PENDING | - | not_required | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-human-input-dynamic-default --> human-input | REJECTED | - | not_required | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-human-input-external-delivery --> human-input | REJECTED | - | not_required | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-human-input-file-field --> human-input | REJECTED | - | not_required | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-human-input-timeout --> human-input | PENDING | - | not_required | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-if-else --> if-else | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-iteration --> iteration | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-iteration-start --> iteration-start | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-knowledge-retrieval --> knowledge-retrieval | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-list-operator-file-list --> list-operator | EXPOSED | - | certified | GRAPHON-LIST-OPERATOR-FILE-LIST-2026-07-22 | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-list-operator-scalar --> list-operator | EXPOSED | - | certified | GRAPHON-LIST-OPERATOR-SCALAR-2026-07-20 | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-llm --> llm | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-loop --> loop | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-loop-end --> loop-end | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-loop-start --> loop-start | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-parameter-extractor-enum --> parameter-extractor | EXPOSED | ENABLED | certified | DIFY-RUNTIME-GRAPHON-NODE-PARAMETER-EXTRACTOR-ENUM-2026-07-22 | >=1.16.0rc1,<1.17 | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-parameter-extractor-flat --> parameter-extractor | EXPOSED | ENABLED | certified | DIFY-RUNTIME-GRAPHON-NODE-PARAMETER-EXTRACTOR-FLAT-2026-07-20 | >=1.16.0rc1,<1.17 | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-parameter-extractor-function-call --> parameter-extractor | EXPOSED | ENABLED | certified | DIFY-RUNTIME-GRAPHON-NODE-PARAMETER-EXTRACTOR-FUNCTION-CALL-2026-07-22 | >=1.16.0rc1,<1.17 | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-parameter-extractor-memory --> parameter-extractor | EXPOSED | ENABLED | certified | DIFY-RUNTIME-GRAPHON-NODE-PARAMETER-EXTRACTOR-MEMORY-2026-07-23 | >=1.16.0rc1,<1.17 | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-parameter-extractor-nested --> parameter-extractor | REJECTED | - | not_required | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-parameter-extractor-optional --> parameter-extractor | REJECTED | - | not_required | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-parameter-extractor-vision --> parameter-extractor | EXPOSED | ENABLED | certified | DIFY-RUNTIME-GRAPHON-NODE-PARAMETER-EXTRACTOR-VISION-2026-07-23 | >=1.16.0rc1,<1.17 | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-question-classifier-enum --> question-classifier | EXPOSED | ENABLED | certified | DIFY-RUNTIME-GRAPHON-NODE-QUESTION-CLASSIFIER-ENUM-2026-07-24 | >=1.16.0rc1,<1.17 | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-start --> start | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-template-transform --> template-transform | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-tool --> tool | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-variable-aggregator --> variable-aggregator | EXPOSED | - | uncertified | - | - | - |
| <!-- DOCFORG:FACT id=capability.graphon-node-variable-assigner --> variable-assigner | REJECTED | - | not_required | - | - | - |
<!-- DOCFORG:END section=capability-matrix -->

## 使用方式

编写工作流前先按 Fact ID 查找需要的能力。遇到 `REJECTED` 时，应调整工作流结构或选择支持该语义的目标版本，不能通过忽略诊断继续生成图。

拒绝项的集中说明见 [不支持的目标语义](UNSUPPORTED-SEMANTICS.md)。
