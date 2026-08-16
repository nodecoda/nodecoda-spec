# NodeCoda 快速开始

<!-- DOCFORG:VERSION:BEGIN -->
> **语言**: nodecoda/1 | **标准库 API**: v1 | **Build Target**: dify-1.16-graphon-0.6
> **文档版本**: 2026-08-13
> **内容来源**: 版本化语言事实与验证示例
<!-- DOCFORG:VERSION:END -->


## 开始一次 Workflow Build

在 NodeCoda Workspace 或已授权的 NodeCoda Workflow Skill 中创建一个 Workflow Build，
选择 Dify Build Target，然后提交一个以 `.ncoda` 结尾的 NodeCoda Source 文件。

每个公开 Source 都必须以当前语言身份开头：

```text
@language nodecoda/1
```

## 第一个 NodeCoda Source

创建 `hello.ncoda`：

```ncoda verified
@language nodecoda/1
function main(string query) -> string {
    return "Hello, " + query + "!";
}
```

提交 Build 后下载生成的 Dify YAML，并在 Dify 中导入验证。Build 失败时，界面或 Skill
会返回稳定诊断码；请优先依据诊断码定位问题。

## 使用标准库

NodeCoda 内置标准库函数，无需 `import`：

```ncoda verified
@language nodecoda/1
function main(string query) -> string {
    // 使用 RAG 检索并回答
    let result = std.v1.rag_answer(query, "your-dataset-id", "openai/gpt-4o");
    return result;
}
```

## 条件分支

```ncoda verified
@language nodecoda/1
function main(string query) -> string {
    if (query == "help") {
        return "I can help you with your questions.";
    } else {
        let result = std.v1.rag_answer(query, "dataset-id", "openai/gpt-4o");
        return result;
    }
}
```

## 循环与并行

```ncoda verified
@language nodecoda/1
function main(string query) -> string {
    let items = ["topic1", "topic2", "topic3"];
    let results = parallel for (
        item in items,
        concurrency: 3,
        on_error: terminate
    ) {
        let processed = foreign code python3(string item = item) -> string {
            source `def main(item: str) -> dict:
    return {"result": f"Processed: {item}"}`;
        };
        yield processed;
    };
    return results[0];
}
```

## 错误恢复

```ncoda verified
@language nodecoda/1
function main(string query) -> string {
    attempt http("GET", "https://example.com", {}) as response {
        success { return response.body; }
        failure (error) { return error.error_message; }
    }
}
```

## 类型系统

NodeCoda 支持以下基础类型：

| 类型 | 说明 | 示例 |
|------|------|------|
| `string` | 文本 | `"hello"` |
| `int` | 整数 | `42` |
| `float` | 浮点数 | `3.14` |
| `bool` | 布尔值 | `true`, `false` |
| `map` | 键值对 | `map<string, string>` |
| `array` | 数组 | `array<string>` |
| `file` | 文件 | — |
| `void` | 无返回值 | — |

## 常量与变量

```ncoda verified
@language nodecoda/1
const CONSTANT = "compile-time constant";

function main(string query) -> string {
    let immutable_var = "cannot change";
    // immutable_var = "error";  // Build 错误
    return CONSTANT + ": " + immutable_var + ": " + query;
}
```

## 下一步

- [语言参考](LANGUAGE-REFERENCE.md) — 完整语法规范
- [标准库](STDLIB-REFERENCE.md) — 内置函数详解
- [诊断码](DIAGNOSTICS.md) — 理解 Build 错误和警告
- [最佳实践](BEST-PRACTICES.md) — 编写高质量 NodeCoda 代码
