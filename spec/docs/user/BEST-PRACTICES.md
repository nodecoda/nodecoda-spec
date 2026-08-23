# NodeCoda 最佳实践

<!-- DOCFORG:VERSION:BEGIN -->
> **语言**: nodecoda/1 | **标准库 API**: v1 | **Build Target**: dify-1.16-graphon-0.6
> **文档版本**: 2026-08-13
> **内容来源**: 版本化语言事实与验证示例
<!-- DOCFORG:VERSION:END -->


> **适用范围**: `nodecoda/1`、标准库 API `v1` 与页首 Build Target

---

## 1. 程序结构

### ✅ 推荐：明确的模式声明

```ncoda verified
@language nodecoda/1
@mode workflow

function main(string query) -> string {
    return query;
}
```

始终显式声明 `@mode`，即使只有一个模式。这使程序意图清晰，也便于未来扩展。

### ✅ 推荐：使用 const 定义配置

```ncoda verified
@language nodecoda/1
@mode workflow

const MODEL = "openai_api_compatible/gpt-5.4";
const TEMPERATURE = 0.5;

function main(string query) -> string {
    let result = llm(MODEL, {
        "messages": [{ "role": "user", "content": query }],
        "temperature": TEMPERATURE
    });
    return result.text;
}
```

将模型名称、温度等配置参数提取为 `const`，避免魔法字符串散落在代码中。

---

## 2. 类型设计

### ✅ 推荐：使用自定义类型表达结构化数据

```ncoda
type TextStats = {
    int word_count;
    int char_count;
    string summary;
}

code analyze_text(string text) -> TextStats {
    // ...
}
```

### ❌ 避免：使用 any 类型

```ncoda
// ❌ 类型不安全
function process(any data) -> string {
    // data 的字段访问会触发 W2010 警告
    return data.name;
}

// ✅ 明确类型
type User = { string name; int age; }
function process(User data) -> string {
    return data.name;
}
```

---

## 3. 变量绑定

### ✅ 推荐：默认使用 let

```ncoda
let result = compute();       // 不可变，推荐
let config = { "key": "v" };  // 不可变配置
```

### ⚠️ 仅在必要时使用 var

```ncoda
// var 仅限于目标平台支持的状态场景
var counter = 0;  // Loop 状态
```

`var` 的可赋值场景受语言规则严格限制。普通工作流变量不应使用 `var` 进行重新赋值。

### ❌ 避免：对 let 重新赋值

```ncoda
// ❌ E1018: ASSIGN_IMMUTABLE
let x = 10;
x = 20;
```

---

## 4. 错误处理

### ✅ 推荐：使用 attempt/failure 处理操作级错误

```ncoda verified
@language nodecoda/1
function main(string query) -> string {
    attempt http("GET", "https://example.com", {}) as response {
        success { return response.body; }
        failure (error) { return error.error_message; }
    }
}
```

### ✅ 推荐：检查 extract 的软失败

```ncoda
let extracted = extract<Request>("model", text, { /* ... */ });
if (!extracted.ok) {
    return `提取失败: ${extracted.reason}`;
}
return extracted.value.city;
```

**关键**：`extract` 有两个失败通道：
- **物理失败**：通过 `attempt` 捕获
- **软失败**：通过 `.ok` / `.reason` 检查

---

## 5. 并行执行

### ✅ 推荐：使用 parallel 进行独立任务

```ncoda verified
@language nodecoda/1
function main(string text) {
    parallel {
        {
            let r1 = foreign code python3(string t = text) -> string {
                source `def main(t: str) -> dict:
    return {"result": t.upper()}`;
            };
        }
        {
            let r2 = foreign code python3(string t = text) -> string {
                source `def main(t: str) -> dict:
    return {"result": t.lower()}`;
            };
        }
    }
}
```

### ✅ 推荐：使用 parallel for 批量处理

```ncoda
let results = parallel for (
    item in items,
    concurrency: 5,
    on_error: keep_null
) {
    yield process(item);
};
```

### ❌ 避免：在 parallel 中访问共享可变状态

```ncoda
// ❌ E1036: PARALLEL_ACCESS_HAZARD
var shared = "data";
parallel {
    { shared = "a"; }
    { shared = "b"; }
}
```

---

## 6. Foreign Code

### ✅ 推荐：明确的输入输出合约

```ncoda
let stats = foreign code python3(string text = text) -> {
    word_count: int;
    char_count: int;
    summary: string;
} {
    source `def main(text: str) -> dict:
    words = text.split()
    return {
        "word_count": len(words),
        "char_count": len(text),
        "summary": f"共 {len(words)} 词"
    }`;
};
```

### ❌ 避免：在 source 中使用多行复杂逻辑

将复杂逻辑拆分为独立的 code 函数，保持 foreign code 块简洁。

---

## 7. 循环

### ✅ 推荐：for 表达式用于数据转换

```ncoda
let items = ["a", "b", "c"];
let results = for (item in items) {
    yield process(item);
};
```

### ✅ 推荐：while 循环添加 limit

```ncoda
// ❌ 语法错误：NodeCoda 不允许无 limit 的 while
while (condition) {
    // Workflow Build 会拒绝
}

// ✅ 带上限的 while
while (condition) limit 100 {
    // 最多 100 次迭代
}
```

### ❌ 避免：for 表达式体中使用 return/break

```ncoda
// ❌ E1043: YIELD_CONTRACT
let results = for (x in items) {
    if (x == "") return "empty";  // 禁止
    yield x;
};
```

---

## 8. 标准库

### ✅ 推荐：直接使用标准库模式

```ncoda verified
@language nodecoda/1
// 简洁的 RAG 工作流
function main(string query) -> string {
    return std.v1.rag_answer(query, "ds-001", "openai/gpt-4o");
}
```

### ❌ 避免：动态构造标准库参数

```ncoda
// ❌ E1031: dataset_ids 必须是字面量
let ds = get_dataset_id();
return std.v1.rag_answer(query, ds, "openai/gpt-4o");

// ✅ 字面量
return std.v1.rag_answer(query, "ds-001", "openai/gpt-4o");
```

---

## 9. Dify 平台特定注意事项

### 目标平台约束

以下语法虽然合法，但可能被页首所示的当前目标配置拒绝：

- 某些变量赋值模式（REJECTED by target capability）
- 特定的条件计算模式

### 输出声明

```ncoda
// 中间消息（非终止，任意位置可多次）
output("正在生成报告…");
output(progress_text);

// 最终结构化结果
return final_value;

// 最终答复文本（terminal，至多一个）
@answer "{{final}} 已生成" final=final_value;
```

`output` 发布中间消息（非终止）；`return` 返回结构化结果；`@answer` 声明最终答复文本。
`answer(...)` 语句已移除（2026-08-23），其中间投递语义并入 `output`。

---

## 10. 常见模式速查

| 模式 | 代码 |
|------|------|
| 简单 LLM 调用 | `let r = llm(MODEL, { ... }); return r.text;` |
| RAG 问答 | `return std.v1.rag_answer(q, ds, model);` |
| 条件分支 | `if (cond) { ... } else { ... }` |
| 数据转换 | `let r = for (x in arr) { yield f(x); };` |
| 并行处理 | `let r = parallel for (x in arr, concurrency: 5, on_error: terminate) { yield f(x); };` |
| 错误恢复 | `attempt operation() as result { success { ... } failure (error) { ... } }` |
| 外部代码 | `let r = foreign code python3(...) -> type { source \`...\`; };` |
| 结构化提取 | `let r = extract<T>(model, text, { ... }); if (!r.ok) { ... }` |
