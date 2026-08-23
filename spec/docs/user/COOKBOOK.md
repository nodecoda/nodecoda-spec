# NodeCoda Cookbook

<!-- DOCFORG:VERSION:BEGIN -->
> **语言**: nodecoda/1 | **标准库 API**: v1 | **Build Target**: dify-1.16-graphon-0.6
> **文档版本**: 2026-08-13
> **内容来源**: 版本化语言事实与验证示例
<!-- DOCFORG:VERSION:END -->


以下配方是完整程序，并通过真实 Workflow Build 规则验证。

## 返回输入文本

```ncoda verified
@language nodecoda/1
@mode workflow

function main(string query) -> string {
    return query;
}
```

适合验证安装、CLI 和 Dify 导入链路。

## 按语言选择回答

```ncoda verified
@language nodecoda/1
@mode workflow

function main(string query, string language = "zh") -> string {
    if (language == "zh") {
        return `收到：${query}`;
    } else {
        return `Received: ${query}`;
    }
}
```

条件分支中的每条路径都返回同一种类型。

## 调用标准库 RAG

```ncoda verified
@language nodecoda/1
@mode workflow

function main(string query) -> string {
    return std.v1.rag_answer(query, "dataset-id", "openai/gpt-4o");
}
```

数据集 ID 和模型名称是静态参数，必须使用字符串字面量。可用签名见 [标准库参考](STDLIB-REFERENCE.md)。

## 捕获 HTTP 失败

```ncoda verified
@language nodecoda/1
@mode workflow

function main() -> string {
    attempt http("GET", "https://example.com", {}) as response {
        success { return response.body; }
        failure (error) { return error.error_message; }
    }
}
```

失败分支返回显式错误信息，不让未定义的响应继续流向下游。

## 提取上传文件文本

```ncoda verified
@language nodecoda/1
@mode workflow

function main(file<document; .pdf> doc) -> string {
    let extracted = extract_text(doc);
    return extracted.text;
}
```

`extract_text` 生成 `document-extractor` 节点，把上传文档转换为文本。提取结果可作为后续
LLM 摘要、RAG 查询等操作的输入。支持纯文本与常见代码扩展名（`.txt`、`.md`、`.html`、
`.xml`、`.py`、`.js`、`.ts` 等）；数组形式的文件列表暂不支持。

## 多轮对话会话计数

```ncoda verified
@language nodecoda/1
@mode advanced-chat
@conversation int turn_count = 0;

function main(string query) -> string {
    turn_count += 1;
    if (turn_count >= 5) {
        output("本轮会话已达到 5 轮上限。");
        return "会话结束";
    }
    let response = llm("openai/gpt-4o", {
        "messages": [{ "role": "user", "content": query }]
    });
    output(response.text);
    return response.text;
}
```

会话变量在轮次之间保持，可用于轮次计数、状态累积与终止判断。轮次语义详见工作流模式文档。

更多完整程序位于 [`examples/nodecoda/`](../../examples/nodecoda/)。这些示例证明 Build 合同；
是否具有运行时认证仍以 [目标兼容性](TARGET-COMPATIBILITY.md) 为准。
