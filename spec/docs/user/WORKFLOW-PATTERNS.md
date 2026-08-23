# NodeCoda 工作流模式

<!-- DOCFORG:VERSION:BEGIN -->
> **语言**: nodecoda/1 | **标准库 API**: v1 | **Build Target**: dify-1.16-graphon-0.6
> **文档版本**: 2026-08-13
> **内容来源**: 版本化语言事实与验证示例
<!-- DOCFORG:VERSION:END -->


## 串行流水线

将每个操作结果绑定到 `let`，再传给后续操作。这样依赖关系会直接体现在生成图中，也便于诊断定位。

```ncoda
let fetched = http("GET", "https://example.com", {});
let summary = llm(MODEL, { "messages": [{ "role": "user", "content": fetched.body }] });
return summary.text;
```

## 条件分支

使用 `if/else` 表达互斥路径。每个可达路径应产生与函数返回类型兼容的结果。完整示例见 [`03_conditional_branch.ncoda`](../../examples/nodecoda/03_conditional_branch.ncoda)。

## 有值迭代

需要数组结果时使用 `for` 表达式，并在每条正常路径恰好执行一次 `yield`。只做控制流时使用普通 `for` 语句。完整示例见 [`45_iteration_yield.ncoda`](../../examples/nodecoda/45_iteration_yield.ncoda)。

## 并行屏障

只有互不共享可变状态的独立操作才能放入 `parallel`。并行块结束后，后续节点可以读取各分支结果；不要依赖分支执行顺序。完整示例见 [`44_parallel_barrier.ncoda`](../../examples/nodecoda/44_parallel_barrier.ncoda)。

批量并行使用 `parallel for`，显式声明 `concurrency` 和 `on_error`。具体形式见 [语言参考](LANGUAGE-REFERENCE.md#54-parallel-并行)。

## 错误恢复

`attempt` 适合 HTTP、模型和其他操作级失败。成功与失败分支必须明确处理结果，不要把缺失值当作成功结果继续传递。`extract` 等具有软失败通道的操作还需要检查 `.ok`，详见 [最佳实践](BEST-PRACTICES.md#4-错误处理)。

## 多轮对话

`advanced-chat` 模式支持多轮对话：同一工作流在每一轮用户输入时执行一次，`@conversation`
声明的会话变量在轮次之间持久保留，`output` 语句向当前轮次发布中间消息，`@answer` 提供最终答复。

```ncoda verified
@language nodecoda/1
@mode advanced-chat
@conversation int turn_count = 0;

function main(string query) -> string {
    turn_count += 1;
    let response = llm("openai/gpt-4o", {
        "messages": [
            { "role": "system", "content": "You are a helpful assistant." },
            { "role": "user",   "content": query }
        ]
    });
    if (turn_count >= 10) {
        output("已达到本轮会话的轮次上限。");
        return "会话结束";
    }
    output(response.text);
    return response.text;
}
```

要点：

- 会话变量（`turn_count`）跨轮次累积，用于区分轮次与记录会话进度；
- `max_turns` 这类会话变量表达轮次上限，由工作流自行判断终止；
- `output` 可在每轮发布多条中间消息（按序）；`@answer` 至多一个最终答复；`return` 返回结构化结果；
- 文件类输入同样按轮次提供，可在每轮使用 `extract_text` 处理当轮上传的文件。

## 选择模式的顺序

1. 默认使用串行依赖。
2. 只有路径互斥时使用条件分支。
3. 只有结果天然组成集合时使用有值迭代。
4. 只有操作真正独立时引入并行。
5. 在可能失败的操作边界显式恢复，不在下游猜测缺失值。
