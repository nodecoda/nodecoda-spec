# NodeCoda 标准库参考

<!-- DOCFORG:VERSION:BEGIN -->
> **语言**: nodecoda/1 | **标准库 API**: v1 | **Build Target**: dify-1.16-graphon-0.6
> **文档版本**: 2026-08-13
> **内容来源**: 版本化语言事实与验证示例
<!-- DOCFORG:VERSION:END -->


## 概述

NodeCoda 标准库将常用工作流模式封装为 Build-time 模板函数。标准库由 Workflow Build
按页首 API 版本提供，无需网络或本地模块查找，也不需要 `import` 声明。

当前 API 命名空间：`std.v1`

```ncoda verified
@language nodecoda/1
function main(string query) -> string {
    return std.v1.rag_answer(query, "dataset-id", "openai/gpt-4o");
}
```

---

## `std.v1.rag_answer`

知识检索 + LLM 问答。

### 签名

```ncoda
std.v1.rag_answer(
    string query,        // 查询内容（可为表达式）
    string dataset_ids,  // 数据集 ID（必须为字符串字面量）
    string model         // 模型名称（必须为字符串字面量）
) -> string
```

### 参数

| 参数 | 类型 | 必需 | 字面量 | 说明 |
|------|------|------|--------|------|
| `query` | `string` | ✅ | ❌ | 用户查询，可以是输入选择器、字面量或其他字符串表达式 |
| `dataset_ids` | `string` | ✅ | ✅ | 逗号分隔的数据集 ID 列表 |
| `model` | `string` | ✅ | ✅ | LLM 模型名称 |

**字面量** 表示参数必须是字符串字面量（编译期已知），以确保生成的 Dify 节点具有确定性配置。

### 示例

```ncoda verified
@language nodecoda/1
@mode workflow

function main(string query) -> string {
    return std.v1.rag_answer(query, "ds-001,ds-002", "openai/gpt-4o");
}
```

```ncoda verified
@language nodecoda/1
// 带条件分支的 RAG
@mode workflow

function main(string query, string lang = "zh") -> string {
    if (lang == "zh") {
        return std.v1.rag_answer(query, "ds-chinese", "openai/gpt-4o");
    } else {
        return std.v1.rag_answer(query, "ds-english", "openai/gpt-4o");
    }
}
```

---

## `std.v1.fetch_and_summarize`

HTTP 抓取 + LLM 摘要。

### 签名

```ncoda
std.v1.fetch_and_summarize(
    string url,     // 目标 URL（必须为字符串字面量）
    string model    // 模型名称（必须为字符串字面量）
) -> string
```

### 参数

| 参数 | 类型 | 必需 | 字面量 | 说明 |
|------|------|------|--------|------|
| `url` | `string` | ✅ | ✅ | 要抓取的 URL |
| `model` | `string` | ✅ | ✅ | 用于摘要的 LLM 模型 |

### 示例

```ncoda verified
@language nodecoda/1
@mode workflow

function main() -> string {
    return std.v1.fetch_and_summarize(
        "https://example.com/article",
        "openai/gpt-4o"
    );
}
```

```ncoda verified
@language nodecoda/1
// 与 RAG 组合
@mode workflow

function main(string query) -> string {
    let summary = std.v1.fetch_and_summarize(
        "https://example.com/article",
        "openai/gpt-4o"
    );
    let result = std.v1.rag_answer(query, "ds-001", "openai/gpt-4o");
    return `摘要：${summary}\n\n回答：${result}`;
}
```

---

## 标准库签名摘要

<!-- DOCFORG:BEGIN section=stdlib-facts -->
<!-- DOCFORG:FACT id=stdlib.std.v1.fetch_and_summarize -->
### `std.v1.fetch_and_summarize`

- API: `v1`
- 签名: `std.v1.fetch_and_summarize(url: string [static], model: string [static]) -> string`

<!-- DOCFORG:FACT id=stdlib.std.v1.rag_answer -->
### `std.v1.rag_answer`

- API: `v1`
- 签名: `std.v1.rag_answer(query: string, dataset_ids: string [static], model: string [static]) -> string`
<!-- DOCFORG:END section=stdlib-facts -->

## 诊断码

标准库调用使用与普通函数调用相同的诊断码：

| 码 | 含义 |
|----|------|
| `E1003` | 参数类型与签名不匹配 |
| `E1004` | 参数数量与签名不匹配 |
| `E1014` | 请求的版本或函数不存在 |
| `E1031` | 编译期配置参数不是字符串字面量 |
| `E1032` | 标准库调用出现在非法上下文（仅允许变量初始化、表达式语句或直接 return） |

---

## 预发布策略

当前产品处于预发布阶段，`std.v1` 是实现命名空间而非兼容性承诺。当某个辅助函数的所有操作端口和类型不再被选定的 Dify 目标支持时，该函数将被移除。

---

## 相关示例

- `examples/nodecoda/41_stdlib_rag.ncoda` — RAG 检索问答
- `examples/nodecoda/42_stdlib_http_summary.ncoda` — HTTP 抓取摘要
