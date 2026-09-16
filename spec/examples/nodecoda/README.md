# NodeCoda Workflow Language 示例库

编号 `00` 至 `38` 的 `.ncoda` Source 对应现有 Dify YAML，展示 Source 到目标产物的映射规则。
`39` 至 `44` 是语言和 lowering 契约样例，`45` 起是部署能力与 reviewed contract 示例。完整语法见
[`docs/user/LANGUAGE-REFERENCE.md`](../../docs/user/LANGUAGE-REFERENCE.md)。

## 编译状态

| 文件 | 模式 | 语法 | 语义 | 说明 |
|------|------|------|------|------|
| 00_minimal | Start→LLM→End | ✓ | ✓ | 可编译 |
| 01_simple | Start(var)→LLM→Answer | ✓ | ✓ | 可编译 |
| 02_rag | Knowledge→LLM | ✓ | ✓ | 可编译 |
| 03_conditional | IF→LLM | ✓ | ✓ | 可编译 |
| 04_code | Code→LLM | ✓ | ✓ | 可编译 |
| 05_http | HTTP→LLM | ✓ | ✓ | 可编译 |
| 06_tool | Tool→LLM | ✓ | — | 待改写：`tool()` 已移除（2026-09-16），插件调用改走 `import "<platform>.<provider>";` + `provider.operation(params)` |
| 07_template | Template+Conditionals | ✓ | ✓ | 可编译 |
| 08_parallel | Parallel { LLM, LLM } | ✓ | ✓ | Dify 1.16 / Graphon 0.6 普通 DAG fan-out/fan-in |
| 09_iteration | FOR→LLM | ✓ | ✓ | plain ForStmt 生产启用 |
| 39_code_typed_direct_output | Code direct result | ✓ | ✓ | 单输出直接值 |
| 40_code_typed_structural_output | Code structural result | ✓ | ✓ | 多物理输出端口 |
| 45_iteration_yield | value For + yield | ✓ | ✓ | 三次 runtime 运行输出 `[2,4,6]` |
| 46_loop_escape | For break/continue/return | ✓ | 关闭 | API 输出正确但 Console 证据不干净，返回 E1034 |
| 47_parallel_product | named parallel product | ✓ | ✓ | 五次 runtime 运行稳定 |
| 48_response_accumulation | 多 End response | ✓ | ✓ | 三次 runtime 运行通过 |
| 49_for_statement_plain | plain statement For | ✓ | ✓ | 三次 runtime 运行，每项执行一次 body |
| 50_condition_direct | direct condition | ✓ | ✓ | Dify 原生 condition operator |
| 51_condition_calculation | calculated condition | ✓ | ✓ | typed Code materialization 后判断 |
| 57_parameter_extractor | schema-dependent extraction | ✓ | ✓ | flat required prompt shape；必须检查 `.ok` |
| 62_llm_open_object | LLMResponse 信封 + llm&lt;T&gt; + object 降级 | ✓ | ✓ | record 不展开顶层字段；空结构降级为开放对象 |
| 63_switch_classifier | switch 多出口 LLM 分类 | ✓ | ✓ | case 标签顺序 = branch_0..N；default 可选；结果绑定 `-> r` 访问 classificationId/reason |
| 64_subflow_decl | subflow 子工作流声明 + 调用 | ✓ | ✓ | 身份 = (workflowId, version)；dify 不支持（编译期诊断） |

> **待改写（登记，未完成）**：`06_tool_use.ncoda`、`38_chatflow_time_tool.ncoda` 仍用已移除的 `tool(...)` 形态
> ⇒ 需改写成 `import "<platform>.<provider>"` + `provider.operation(...)`；改写依赖该平台的 provider 绑定表，
> 本平台（dify）当前无对应 provider 注册条目，故本轮只登记不改写。

**已实现语义功能**：
1. ✓ Start 输入映射为 `function main(...)` 的强类型参数
2. ✓ `knowledge()` 内置函数
3. ✓ 强类型 `foreign code python3(...) -> type { source ...; }` 表达式
4. ✓ `http()` 内置函数
5. ✓ `LLMResponse.text` 真实输出端口
6. ✓ `HTTPResponse` 结构体（body, status_code, headers）
7. ✓ 隔离 named/plain `parallel` lowering；生产 target 使用普通 DAG，不生成 synthetic 节点
8. ✓ `extract<T>` schema-dependent operation，返回 `value`/`ok`/`reason`/`usage`
9. ✓ `ask<Form, Action>` 挂起式人工输入（HITL）：表单字段 + 动作按钮 + 可选 timeout 分支
10. ✓ `switch` 多出口 LLM 分类：case 标签顺序 = branch_0..N + default 兜底 + `-> r` 结果绑定
11. ✓ `subflow` 子工作流顶层声明 + 调用（身份 = workflowId + version；dify 不支持）

## 映射规则

### 节点类型映射

| YAML node.type | DSL 构造 |
|----------------|----------|
| `start` | `function main(type name, ...)` 参数 |
| `llm` | `llm("provider/model", { messages, ... })` |
| `if-else` | `if (cond) { ... } else { ... }` |
| `iteration` | `for (item in items) { ... }` |
| `knowledge-retrieval` | `knowledge("dataset_ids", query, opts)` |
| `code` | ``foreign code python3(type name = value) -> output-type { source `...`; }`` |
| `http-request` | `http("method", url, opts)` |
| `tool` | 平台插件调用：`import "<platform>.<provider>";` 后用 `provider.operation(params)`（如 `import "coze-biz.datetime";` → `datetime.datetime({...})`）|
| `template-transform` | 模板字符串 + 条件表达式 |
| `variable-aggregator` | 仅用于互斥分支值合并 |
| `end` | 流程出口 = 一组具名输出：无名出口（`return x;`）键 = 语言常量 `output`；record 值逐字段具名（键 = 字段名）；也可显式 `return { name: value, ... }`；无带值出口时为 `return;` |
| `output` | 发布一条消息（非终止）：`output(expr)`；与流程出口无关 |
| `answer` | 已移除（2026-08-23 语句 / 2026-09-16 声明）：答复语义在运行期就是一次输出发射 |

### 强类型 Code FFI

Code 输入必须同时声明端口类型和绑定表达式；声明类型是静态分析、Dify 端口和本地运行时校验的唯一依据：

```ncoda
let values = foreign code python3(int limit = max_items) -> array<int> {
    source `def main(limit: int) -> dict:
    return {"result": list(range(limit))}`;
};
```

普通输出类型声明一个隐式 `result` 端口，表达式直接得到该值，因此使用 `values` 而不是
`values.result`。多输出使用至少包含两个字段的匿名结构契约：

```ncoda
let stats = foreign code python3(string text = query) -> {
    count: int;
    summary: string;
} {
    source `def main(text: str) -> dict:
    return {"count": len(text), "summary": text}`;
};

return stats.summary;
```

每个结构字段映射到同一 Dify Code 节点上的独立输出端口。Python AST 检查仅验证 `main`
参数和可见返回键，不推断或修改声明类型。当前只支持 `python3`，输入和输出契约均不支持
`file`。旧 `code(...)` 和 `code python3(...)` 语法均不存在。

可用下面的命令验证整个样例目录的前端语法、类型和 lowering：

```bash
pytest -q tests/lang/regression/test_nodecoda_examples.py
```

### 变量引用映射

| YAML 引用 | DSL 引用 |
|-----------|----------|
| `{{#sys.query#}}` | 函数参数 `query` |
| `{{#start.var#}}` | `var` (input 变量) |
| `{{#llm.text#}}` | `response.text` |
| `{{#retrieval.result#}}` | `context.result` |
| `{{#code.summary#}}` | `stats.summary` |
| `{{#http.body#}}` | `page.body` |
| `{{#http.status_code#}}` | `page.status_code` |
| `{{#tool.result#}}` | `search.result` |
| `{{#conversation.var#}}` | `var` (input 变量) |
