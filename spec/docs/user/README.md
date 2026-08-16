# NodeCoda Workflow Language 用户文档

<!-- DOCFORG:VERSION:BEGIN -->
> **语言**: nodecoda/1 | **标准库 API**: v1 | **Build Target**: dify-1.16-graphon-0.6
> **文档版本**: 2026-08-13
> **内容来源**: 版本化语言事实与验证示例
<!-- DOCFORG:VERSION:END -->


## 什么是 NodeCoda Workflow Language？

NodeCoda Workflow Language 是一门可序列化、可版本化的 C 风格工作流语言。你可以用
`.ncoda` Source 描述工作流逻辑，通过 Workflow Build 生成可导入 Dify 的工作流产物，
并像管理代码一样审查、共享和演进工作流。

```ncoda verified
@language nodecoda/1
function main(string query) -> string {
    let result = std.v1.rag_answer(query, "dataset-id", "openai/gpt-4o");
    return result;
}
```

## 文档目录

| 文档 | 说明 |
|------|------|
| [快速开始](GETTING-STARTED.md) | 第一个 Source、Build 与导入 |
| [核心概念](CONCEPTS.md) | 程序模型、Build 边界、目标与运行时证据 |
| [工作流模式](WORKFLOW-PATTERNS.md) | 串行、分支、迭代、并行和错误恢复 |
| [Cookbook](COOKBOOK.md) | 可直接 Build 的常见任务配方 |
| [故障排查](TROUBLESHOOTING.md) | 按 Build 阶段和诊断码定位问题 |
| [语言参考](LANGUAGE-REFERENCE.md) | 完整语法、类型系统、控制流、作用域 |
| [标准库](STDLIB-REFERENCE.md) | `std.v1` 命名空间下的内置函数 |
| [诊断码](DIAGNOSTICS.md) | Build 错误码（E）和警告码（W）完整目录 |
| [目标兼容性](TARGET-COMPATIBILITY.md) | Dify/Graphon 能力状态和运行时证据 |
| [不支持的目标语义](UNSUPPORTED-SEMANTICS.md) | 当前目标明确拒绝的合法语言形状 |
| [最佳实践](BEST-PRACTICES.md) | 常见模式、反模式、注意事项 |
| [迁移指南](MIGRATION.md) | 版本身份、升级检查和预发布迁移规则 |

## 语言概览

<!-- DOCFORG:BEGIN section=overview-stats -->
- **322** 个语言事实 (144 语法、14 类型、58 诊断、104 能力、2 标准库)
- **62** 个验证通过的 NodeCoda Source 示例
- **7** 个警告码、**51** 个错误码
- 标准库函数: `std.v1.fetch_and_summarize`、`std.v1.rag_answer`
<!-- DOCFORG:END section=overview-stats -->

- 支持 `if/else`、`for`、`while`、`parallel`、`attempt/retry` 等控制流

## 相关资源

- [权威文法](../dify-dsl.y) — Yacc 格式的语法规范
- [AI 文档入口](../ai/llms.txt) — 面向本地检索与 AI 工具的文档索引
