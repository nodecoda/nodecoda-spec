# NodeCoda Workflow Language 参考手册

<!-- DOCFORG:VERSION:BEGIN -->
> **语言**: nodecoda/1 | **标准库 API**: v1 | **Build Target**: dify-1.16-graphon-0.6
> **文档版本**: 2026-08-13
> **内容来源**: 版本化语言事实与验证示例
<!-- DOCFORG:VERSION:END -->


> **适用范围**: `nodecoda/1`、标准库 API `v1` 与页首 Build Target

---

## 1. 程序结构

每个 NodeCoda 程序由三部分组成，按顺序出现：

```
[@mode <模式声明>]
[@conversation <类型> <名称> [= <默认值>]; ...]
<顶层声明列表>
```

### 1.1 语言身份与模式声明

```ncoda
@mode workflow
// 或
@mode advanced-chat
// 或
@mode agent
```

- `workflow`：标准工作流模式
- `advanced-chat`：高级对话模式，支持 `@conversation` 声明和 `answer` 语句
- `agent`：智能体应用模式，配合 `@agent` 块声明（见 1.5），编译为最小图 `start → agent → end`

### 1.2 对话声明（仅 advanced-chat）

```ncoda
@mode advanced-chat
@conversation string system_prompt = "You are a helpful assistant.";
@conversation int max_turns = 10;
```

`@conversation` 声明会话级状态，仅限 `advanced-chat` 模式：

- 会话变量在**多轮对话之间保持**：每轮请求读取同一份会话值，不会因轮次推进而重置；
- `max_turns` 等整数会话变量用于表达轮次上限，供工作流内部判断与终止逻辑使用；
- 会话变量是可变的，可在工作流中重新赋值，从而在轮次之间累积状态；
- 单轮（`workflow`）模式没有会话持久化，不能使用 `@conversation` 声明。

多轮执行时，每一轮用户输入都会进入同一个工作流实例，`answer` 语句把结果返回给
当前轮次；会话变量则负责区分轮次间的持久状态与当轮输入。轮次相关语义详见工作流模式文档。

### 1.3 顶层声明

程序体由以下顶层声明组成：

| 声明 | 语法 | 说明 |
|------|------|------|
| `const` | `const NAME = value;` | 编译期常量 |
| `type` | `type Name = { fields }` | 结构体类型 |
| `enum` | `enum Name { members }` | 枚举类型 |
| `function` | `function name(params) -> type { ... }` | 工作流函数 |
| `code` | `code name(params) -> type { ... }` | 纯计算函数 |
| `import` | `import "provider";` | 平台提供商绑定（编译期封闭世界校验） |

### 1.4 入口函数

程序必须有且仅有一个名为 `main` 的工作流函数作为入口：

```ncoda verified
@language nodecoda/1
function main(string query) -> string {
    return query;
}
```

### 1.5 agent 应用声明（仅 agent 模式）

```ncoda
@mode agent

@agent {
    model: "provider/model",
    instruction: "system persona",
    max_iteration: 10,
    tools: ["weather"],
}

function main(string query) -> string {
    return run(query);
}
```

- 仅 `@mode agent` 下允许；`main` 内以 `run(...)` 作为 agent 入口调用，返回值即 agent 最终答案；
- 编译为固定最小图 `start → agent → end`；
- 字段（未知键拒绝，类型不符即编译错误）：

| 字段 | 类型 | 说明 |
|------|------|------|
| `model` | `string` | 模型（provider/model），必填 |
| `instruction` | `string` | 系统人格提示词 |
| `strategy` | `string` | agent 策略 |
| `max_iteration` | `int` | 最大迭代轮数 |
| `memory` | `bool` | 是否启用记忆 |
| `memory_window` | `int` | 记忆窗口（>= 0） |
| `tools` | `[string]` | 工具逻辑名（alias）数组，条目必须为字符串字面量 |
| `knowledge` | `{ dataset_ids: [string], top_k: int }` | 知识库检索配置 |

- 与 `@mode workflow` / `advanced-chat` 互斥。

---

## 2. 类型系统

### 2.1 原始类型

| 类型 | 说明 | 字面量示例 |
|------|------|-----------|
| `string` | 文本 | `"hello"`, `` `template ${expr}` `` |
| `int` | 64位整数 | `42`, `-1` |
| `float` | 64位浮点数 | `3.14`, `-0.5` |
| `bool` | 布尔值 | `true`, `false` |
| `file` | 文件引用 | — |
| `void` | 无返回值 | — |
| `any` | 任意类型 | — |

### 2.2 复合类型

```ncoda
// 数组
array<string>           // 字符串数组
string[]                // 等价写法
array<array<int>>       // 嵌套数组

// 映射
map<string, string>     // 字符串到字符串的映射
map<string, int>        // 字符串到整数的映射
```

### 2.3 自定义类型

```ncoda
type TravelRequest = {
    string city;
    float days;
    bool flexible;
    string[] tags;
}
```

### 2.4 枚举类型

```ncoda
enum Priority {
    LOW,
    MEDIUM,
    HIGH
}
```

### 2.5 可选类型

在类型后加 `?` 表示可选：

```ncoda
function process(string input, string? optional_param) -> string {
    // optional_param 可以为 null
    return input;
}
```

---

## 3. 变量与常量

### 3.1 变量声明

NodeCoda 提供三种绑定方式：

| 关键字 | 可变性 | 说明 |
|--------|--------|------|
| `let` | 不可变 | 默认选择，绑定后不可重新赋值 |
| `var` | 可变 | 仅限目标平台支持的状态（如 Loop 状态、对话状态） |
| `const` | 编译期常量 | 顶层声明，值在编译时确定 |

```ncoda
let name = "Alice";         // 不可变
var counter = 0;            // 可变（受限）
const MAX_SIZE = 100;       // 编译期常量
```

### 3.2 赋值运算符

```ncoda
var x = 10;
x = 20;      // 简单赋值
x += 5;      // 加等
x -= 3;      // 减等
x *= 2;      // 乘等
x /= 4;      // 除等
x << item;   // 追加（构建输出流：会话变量数组追加，非位左移）
```

---

## 4. 表达式

### 4.1 算术表达式

```ncoda
a + b       // 加法
a - b       // 减法
a * b       // 乘法
a / b       // 除法
a % b       // 取模
-a          // 取负
```

### 4.2 比较表达式

```ncoda
a == b      // 等于
a != b      // 不等于
a < b       // 小于
a <= b      // 小于等于
a > b       // 大于
a >= b      // 大于等于
```

### 4.3 逻辑表达式

```ncoda
a && b      // 逻辑与
a || b      // 逻辑或
!a          // 逻辑非
```

### 4.4 字符串模板

```ncoda
let greeting = `Hello, ${name}!`;
let multiline = `Line 1
Line 2
Value: ${1 + 2}`;
```

### 4.5 数组与映射字面量

```ncoda
let items = [1, 2, 3];
let empty = [];
let config = { "key": "value", "count": 42 };
```

### 4.6 三元表达式

```ncoda
let label = (score > 80) ? "优秀" : "一般";
```

### 4.7 索引与字段访问

```ncoda
let first = items[0];
let city = request.city;
let nested = data["key"].field;
```

### 4.8 运算符优先级（从高到低）

| 优先级 | 运算符 |
|--------|--------|
| 1 | `()` `[]` `.` |
| 2 | `-` (一元) `!` |
| 3 | `*` `/` `%` |
| 4 | `+` `-` |
| 5 | `<` `<=` `>` `>=` |
| 6 | `==` `!=` |
| 7 | `&&` |
| 8 | `||` |
| 9 | `?:` (三元) |
| 10 | `=` `+=` `-=` `*=` `/=` `<<` |

---

## 5. 语句

### 5.1 条件语句

```ncoda
if (condition) {
    // ...
} else if (other_condition) {
    // ...
} else {
    // ...
}
```

条件表达式必须为 `bool` 类型。

### 5.2 for 循环

```ncoda
// 遍历数组
for (item in items) {
    // item 是数组元素
}

// for 表达式（生成新数组）
let doubled = for (x in numbers) {
    yield x * 2;
};
```

**for 表达式的 yield 合约**：每个可达路径必须恰好有一个 `yield`。`return`、`break`、`continue` 在 for 表达式体内被禁止。

### 5.3 while 循环

```ncoda
// limit 是必需语法，不存在无上限 while
while (condition) limit 100 {
    // 最多执行 100 次
}
```

### 5.4 parallel 并行

`parallel` 是**纯控制流栅栏语句**（barrier）：所有分支执行完毕才继续，**从不产生集合值**。

```ncoda
// 并行执行多个块
parallel {
    {
        let r1 = do_something();
    }
    {
        let r2 = do_other_thing();
    }
}
```

语义约束（v4 契约）：

- 并行分支无序、无位置语义——要数组请显式写 `[a.x, b.x]`，由作者定序；
- 分支是**透明屏障（非 block）**：分支内声明的变量全部透明透出到外层，下游直接按变量名访问；兄弟分支之间互不可见（并发数据竞争 = 编译错误）；
- **同名跨分支导出 = 编译错误**：每个分支有自己的 producer，裸名引用无法解析到唯一值——即使同类型也冲突，必须改分支局部变量名；
- 分支内 `return` = **流程结束**（terminate whole flow，直连 end），不是分支退出；栅栏不等待 return 分支；
- 分支命名标签（`r1:` / `u:`）可选，保留但仅源码级，语义忽略；重复分支名 = 语法错误；
- **表达式形态 `let x = parallel { ... }` 不存在**（已删除，不得使用）；`yield` 不得出现在 parallel 块内。

`parallel for` 是值表达式，配置项和 `yield` 均为必需：

```ncoda
let results = parallel for (
    item in items,
    concurrency: 5,
    on_error: keep_null
) {
    yield process(item);
};
```

`on_error` 选项：`terminate`、`keep_null`、`remove_failed`。当前语法要求显式给出 `concurrency` 和 `on_error`；`yield` 仅保留于 `for` / `parallel for`（循环产出）。

### 5.5 attempt / failure（错误恢复）

```ncoda
attempt risky_operation() as result {
    success {
        return result;
    }
    failure (error) {
        return error.error_message;
    }
}
```

### 5.6 return 语句

```ncoda
function compute(int x) -> int {
    if (x < 0) {
        return 0;
    }
    return x * 2;
}
```

### 5.7 output 语句（workflow 模式）

在 `main` 函数中声明式输出到 End 节点：

```ncoda
output("result", computed_value);
output("metadata", meta);
return final_value;
```

### 5.8 answer 语句（advanced-chat 模式）

```ncoda
answer(response_text);
```

### 5.9 break / continue

```ncoda
for (item in items) {
    if (item == "") { continue; }
    if (item == "STOP") { break; }
    process(item);
}
```

---

## 6. 函数

### 6.1 工作流函数

工作流函数包含操作节点（如 `llm()`），在编译时展开为 Dify 图节点：

```ncoda
function analyze(string text) -> string {
    let result = llm("openai/gpt-4o", {
        "messages": [{ "role": "user", "content": text }]
    });
    return result.text;
}
```

### 6.2 code 函数

纯计算函数，不允许包含工作流操作：

```ncoda
code format_label(string name, int score) -> string {
    return name + ": " + score;
}
```

### 6.3 参数默认值

```ncoda
function greet(string name, string greeting = "Hello") -> string {
    return greeting + ", " + name + "!";
}
```

### 6.4 函数调用

```ncoda
let result = analyze(input_text);
let formatted = format_label("Alice", 95);
```

列表操作（`filter` / `flatMap` 等）接受**单参数 lambda 回调**作为内联谓词/映射函数：

```ncoda
let hot = filter(items, (item) -> item.score > 80);
let tags = flatMap(items, (item) -> item.tags);
```

- lambda 仅作为列表操作的内联回调（降级为 code 节点），**不作为一等值**穿过工作流边界；
- `filter` 回调必须返回 `bool`；`flatMap` 回调必须返回数组；
- 除回调位置外，lambda 不得出现在表达式、赋值或函数参数中。

---

## 6.5 文件文本提取（extract_text）

从上传的文件变量中提取文本内容，生成 `document-extractor` 节点。

### 签名

```ncoda
extract_text(file<document; .pdf; ...> doc) -> { text: string }
```

### 参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `doc` | `file` | ✅ | 选择器支持的标量文件变量，必须声明可提取的扩展名 |

### 约束

- 参数必须是**选择器支持的标量文件**（来自函数入参或上游文件节点），不能是数组；
- 声明的扩展名必须在目标支持的可提取集合内（如 `.pdf`、`.docx`、`.txt`、`.md`、`.html`、
  `.xml`、`.py`、`.js`、`.ts` 等纯文本与代码格式）；
- 文件类型不能是 `image`、`audio`、`video`；
- 数组形式的文件列表暂不支持，Build 会拒绝并返回诊断。

### 示例

```ncoda verified
@language nodecoda/1
@mode workflow

function main(file<document; .pdf> doc) -> string {
    let result = extract_text(doc);
    return result.text;
}
```

提取结果以 `text` 字段访问；`extract_text` 的结果可作为后续操作（如 LLM 摘要）的输入。

---

## 7. Foreign Code（外部代码执行）

在 NodeCoda 中嵌入 Python 代码：

### 7.1 直接输出

```ncoda
let result = foreign code python3(string input = text) -> string {
    source `def main(input: str) -> dict:
    return {"result": input.upper()}`;
};
```

### 7.2 结构化输出

```ncoda
let stats = foreign code python3(string text = text) -> {
    word_count: int;
    char_count: int;
} {
    source `def main(text: str) -> dict:
    return {
        "word_count": len(text.split()),
        "char_count": len(text)
    }`;
};
```

### 7.3 外部代码约束

- 支持的语言：`python3`（唯一规范形式）
- `source` 必须是模板字符串
- 输入端口名称和输出端口名称必须唯一且非保留字
- 不支持 `file`、`void`、`any` 作为输出类型

---

## 8. Extract（结构化提取）

使用 LLM 从非结构化文本中提取结构化数据：

```ncoda
type TravelRequest = {
    string city;
    float days;
    bool flexible;
    string[] tags;
}

let extracted = extract<TravelRequest>("provider/model", text, {
    instruction: "提取旅行请求信息",
    descriptions: {
        city: "目的地城市",
        days: "旅行天数",
        flexible: "日期是否灵活",
        tags: "旅行偏好"
    },
    strategy: "prompt"
});

if (!extracted.ok) {
    return extracted.reason;
}
let city = extracted.value.city;
```

### 提取失败通道

- **物理失败**：通过 `attempt` 处理操作级错误
- **软失败**：通过 `.ok` 和 `.reason` 检查；必须在访问 `.value` 前检查 `.ok`

---

## 9. 注释

```ncoda
// 单行注释

/* 多行
   注释 */

/* 支持嵌套 /* 块 */ 注释 */
```

---

## 10. 静态语义限制

以下限制不能在文法中表达，由 Workflow Build 的语义检查强制执行：

| 规则 | 说明 |
|------|------|
| 单一入口 | 程序有且仅有一个名为 `main` 的工作流函数 |
| 无递归 | 用户函数调用图必须是无环的 |
| while 上限 | `while limit` 和 `parallel concurrency` 必须是正整数字面量 |
| 分支标签唯一性 | `parallel` 命名分支标签必须唯一（仅源码级，语义忽略）；重复分支名 = 编译错误 |
| yield 合约 | `for` / `parallel for` 值表达式的每个可达路径恰好有一个 `yield`；`parallel` 块内禁止 `yield` |
| let 不可变 | `let` 绑定后不可重新赋值 |
| output 上下文 | `output(key, value)` 仅限 workflow 模式 |
| answer 上下文 | `answer(value)` 仅限 advanced-chat 模式；`@mode agent` 下 main 仅允许 agent 入口语义（`run(...)`） |
| import 平台限定 | `import` 必须带平台限定符（如 `"coze-biz.web_search"`）；裸 import 或未知平台 = E1052 |
| chatflow 入口 | `@mode advanced-chat` 入口首参必须命名为 `query`（E1054） |
| 能力约束 | 合法语法仍受目标能力分类约束（REJECTED 形式返回诊断） |

---

## 11. 语言事实索引

本节列出当前语言身份下的文法、保留字和类型事实，便于精确查找公开语法能力。

> 机器可读文法以 [`grammar.ebnf`](../../grammar.ebnf) 为准（单一事实源）；下表为其产生式名索引。

<!-- DOCFORG:BEGIN section=language-facts -->
| Fact ID | 名称 | 摘要 |
|---------|------|------|
| <!-- DOCFORG:FACT id=syntax.add.expression --> `syntax.add.expression` | `add_expr` | Grammar production add_expr |
| <!-- DOCFORG:FACT id=syntax.agent.application --> `syntax.agent.application` | `agent_application` | @mode agent + @agent 块声明 |
| <!-- DOCFORG:FACT id=syntax.agent.block --> `syntax.agent.block` | `agent_block` | @agent 配置块（model/instruction/strategy/max_iteration/memory/memory_window/tools/knowledge） |
| <!-- DOCFORG:FACT id=syntax.answer.declaration --> `syntax.answer.declaration` | `answer_decl` | @answer 最终答案模板（workflow final-answer template） |
| <!-- DOCFORG:FACT id=syntax.and.expression --> `syntax.and.expression` | `and_expr` | Grammar production and_expr |
| <!-- DOCFORG:FACT id=syntax.answer.statement --> `syntax.answer.statement` | `answer_stmt` | Grammar production answer_stmt |
| <!-- DOCFORG:FACT id=syntax.arg.list --> `syntax.arg.list` | `arg_list` | Grammar production arg_list |
| <!-- DOCFORG:FACT id=syntax.arg.sequence --> `syntax.arg.sequence` | `arg_seq` | Grammar production arg_seq |
| <!-- DOCFORG:FACT id=syntax.array.literal --> `syntax.array.literal` | `array_literal` | Grammar production array_literal |
| <!-- DOCFORG:FACT id=syntax.array.suffix.sequence --> `syntax.array.suffix.sequence` | `array_suffix_seq` | Grammar production array_suffix_seq |
| <!-- DOCFORG:FACT id=syntax.attempt.statement --> `syntax.attempt.statement` | `attempt_stmt` | Grammar production attempt_stmt |
| <!-- DOCFORG:FACT id=syntax.block --> `syntax.block` | `block` | Grammar production block |
| <!-- DOCFORG:FACT id=syntax.break.statement --> `syntax.break.statement` | `break_stmt` | Grammar production break_stmt |
| <!-- DOCFORG:FACT id=syntax.code.direct.output --> `syntax.code.direct.output` | `code_direct_output` | Grammar production code_direct_output |
| <!-- DOCFORG:FACT id=syntax.code.function --> `syntax.code.function` | `code_function_def` | Grammar production code_function_def |
| <!-- DOCFORG:FACT id=syntax.code.input --> `syntax.code.input` | `code_input` | Grammar production code_input |
| <!-- DOCFORG:FACT id=syntax.code.input.sequence --> `syntax.code.input.sequence` | `code_input_seq` | Grammar production code_input_seq |
| <!-- DOCFORG:FACT id=syntax.code.inputs.optional --> `syntax.code.inputs.optional` | `code_inputs_opt` | Grammar production code_inputs_opt |
| <!-- DOCFORG:FACT id=syntax.code.language --> `syntax.code.language` | `code_language` | Grammar production code_language |
| <!-- DOCFORG:FACT id=syntax.code.output.contract --> `syntax.code.output.contract` | `code_output_contract` | Grammar production code_output_contract |
| <!-- DOCFORG:FACT id=syntax.code.output.field --> `syntax.code.output.field` | `code_output_field` | Grammar production code_output_field |
| <!-- DOCFORG:FACT id=syntax.code.output.field.tail --> `syntax.code.output.field.tail` | `code_output_field_tail` | Grammar production code_output_field_tail |
| <!-- DOCFORG:FACT id=syntax.code.source --> `syntax.code.source` | `code_source` | Grammar production code_source |
| <!-- DOCFORG:FACT id=syntax.code.structural.output --> `syntax.code.structural.output` | `code_structural_output` | Grammar production code_structural_output |
| <!-- DOCFORG:FACT id=syntax.code.type.ref --> `syntax.code.type.ref` | `code_type_ref` | Grammar production code_type_ref |
| <!-- DOCFORG:FACT id=syntax.comparison.expression --> `syntax.comparison.expression` | `comparison_expr` | Grammar production comparison_expr |
| <!-- DOCFORG:FACT id=syntax.const.declaration --> `syntax.const.declaration` | `const_decl` | Grammar production const_decl |
| <!-- DOCFORG:FACT id=syntax.const.value --> `syntax.const.value` | `const_value` | Grammar production const_value |
| <!-- DOCFORG:FACT id=syntax.continue.statement --> `syntax.continue.statement` | `continue_stmt` | Grammar production continue_stmt |
| <!-- DOCFORG:FACT id=syntax.conversation.declaration --> `syntax.conversation.declaration` | `conversation_decl` | Grammar production conversation_decl |
| <!-- DOCFORG:FACT id=syntax.conversation.declaration.list --> `syntax.conversation.declaration.list` | `conversation_decl_list` | Grammar production conversation_decl_list |
| <!-- DOCFORG:FACT id=syntax.conversation.default.optional --> `syntax.conversation.default.optional` | `conversation_default_opt` | Grammar production conversation_default_opt |
| <!-- DOCFORG:FACT id=syntax.duration --> `syntax.duration` | `duration` | Grammar production duration |
| <!-- DOCFORG:FACT id=syntax.else.clause.optional --> `syntax.else.clause.optional` | `else_clause_opt` | Grammar production else_clause_opt |
| <!-- DOCFORG:FACT id=syntax.enum.declaration --> `syntax.enum.declaration` | `enum_decl` | Grammar production enum_decl |
| <!-- DOCFORG:FACT id=syntax.enum.member.list --> `syntax.enum.member.list` | `enum_member_list` | Grammar production enum_member_list |
| <!-- DOCFORG:FACT id=syntax.equality.expression --> `syntax.equality.expression` | `equality_expr` | Grammar production equality_expr |
| <!-- DOCFORG:FACT id=syntax.expression --> `syntax.expression` | `expression` | Grammar production expression |
| <!-- DOCFORG:FACT id=syntax.expression.or.assign.statement --> `syntax.expression.or.assign.statement` | `expr_or_assign_stmt` | Grammar production expr_or_assign_stmt |
| <!-- DOCFORG:FACT id=syntax.field.list --> `syntax.field.list` | `field_list` | Grammar production field_list |
| <!-- DOCFORG:FACT id=syntax.file.extension.list --> `syntax.file.extension.list` | `file_extension_list` | Grammar production file_extension_list |
| <!-- DOCFORG:FACT id=syntax.file.extension.optional --> `syntax.file.extension.optional` | `file_extension_opt` | Grammar production file_extension_opt |
| <!-- DOCFORG:FACT id=syntax.file.type.list --> `syntax.file.type.list` | `file_type_list` | Grammar production file_type_list |
| <!-- DOCFORG:FACT id=syntax.file.type.ref --> `syntax.file.type.ref` | `file_type_ref` | Grammar production file_type_ref |
| <!-- DOCFORG:FACT id=syntax.file.upload.list --> `syntax.file.upload.list` | `file_upload_list` | Grammar production file_upload_list |
| <!-- DOCFORG:FACT id=syntax.file.upload.optional --> `syntax.file.upload.optional` | `file_upload_opt` | Grammar production file_upload_opt |
| <!-- DOCFORG:FACT id=syntax.for.expression --> `syntax.for.expression` | `for_expr` | Grammar production for_expr |
| <!-- DOCFORG:FACT id=syntax.for.statement --> `syntax.for.statement` | `for_stmt` | Grammar production for_stmt |
| <!-- DOCFORG:FACT id=syntax.for.var --> `syntax.for.var` | `for_var` | Grammar production for_var |
| <!-- DOCFORG:FACT id=syntax.foreign.code.expression --> `syntax.foreign.code.expression` | `foreign_code_expr` | Grammar production foreign_code_expr |
| <!-- DOCFORG:FACT id=syntax.function --> `syntax.function` | `function_def` | Grammar production function_def |
| <!-- DOCFORG:FACT id=syntax.human.action --> `syntax.human.action` | `human_action` | Grammar production human_action |
| <!-- DOCFORG:FACT id=syntax.human.action.list --> `syntax.human.action.list` | `human_action_list` | Grammar production human_action_list |
| <!-- DOCFORG:FACT id=syntax.human.timeout.branch --> `syntax.human.timeout.branch` | `human_timeout_branch` | Grammar production human_timeout_branch |
| <!-- DOCFORG:FACT id=syntax.if.statement --> `syntax.if.statement` | `if_stmt` | Grammar production if_stmt |
| <!-- DOCFORG:FACT id=syntax.import.declaration --> `syntax.import.declaration` | `import_decl` | 顶层 import "provider"; 平台提供商绑定 |
| <!-- DOCFORG:FACT id=syntax.keyword.action --> `syntax.keyword.action` | `action` | Reserved keyword action |
| <!-- DOCFORG:FACT id=syntax.keyword.answer --> `syntax.keyword.answer` | `answer` | Reserved keyword answer |
| <!-- DOCFORG:FACT id=syntax.keyword.any --> `syntax.keyword.any` | `any` | Reserved keyword any |
| <!-- DOCFORG:FACT id=syntax.keyword.array --> `syntax.keyword.array` | `array` | Reserved keyword array |
| <!-- DOCFORG:FACT id=syntax.keyword.as --> `syntax.keyword.as` | `as` | Reserved keyword as |
| <!-- DOCFORG:FACT id=syntax.keyword.attempt --> `syntax.keyword.attempt` | `attempt` | Reserved keyword attempt |
| <!-- DOCFORG:FACT id=syntax.keyword.bool --> `syntax.keyword.bool` | `bool` | Reserved keyword bool |
| <!-- DOCFORG:FACT id=syntax.keyword.break --> `syntax.keyword.break` | `break` | Reserved keyword break |
| <!-- DOCFORG:FACT id=syntax.keyword.code --> `syntax.keyword.code` | `code` | Reserved keyword code |
| <!-- DOCFORG:FACT id=syntax.keyword.const --> `syntax.keyword.const` | `const` | Reserved keyword const |
| <!-- DOCFORG:FACT id=syntax.keyword.continue --> `syntax.keyword.continue` | `continue` | Reserved keyword continue |
| <!-- DOCFORG:FACT id=syntax.keyword.default --> `syntax.keyword.default` | `default` | Reserved keyword default |
| <!-- DOCFORG:FACT id=syntax.keyword.else --> `syntax.keyword.else` | `else` | Reserved keyword else |
| <!-- DOCFORG:FACT id=syntax.keyword.entry --> `syntax.keyword.entry` | `entry` | Reserved keyword entry |
| <!-- DOCFORG:FACT id=syntax.keyword.enum --> `syntax.keyword.enum` | `enum` | Reserved keyword enum |
| <!-- DOCFORG:FACT id=syntax.keyword.failure --> `syntax.keyword.failure` | `failure` | Reserved keyword failure |
| <!-- DOCFORG:FACT id=syntax.keyword.false --> `syntax.keyword.false` | `false` | Reserved keyword false |
| <!-- DOCFORG:FACT id=syntax.keyword.file --> `syntax.keyword.file` | `file` | Reserved keyword file |
| <!-- DOCFORG:FACT id=syntax.keyword.float --> `syntax.keyword.float` | `float` | Reserved keyword float |
| <!-- DOCFORG:FACT id=syntax.keyword.for --> `syntax.keyword.for` | `for` | Reserved keyword for |
| <!-- DOCFORG:FACT id=syntax.keyword.foreign --> `syntax.keyword.foreign` | `foreign` | Reserved keyword foreign |
| <!-- DOCFORG:FACT id=syntax.keyword.function --> `syntax.keyword.function` | `function` | Reserved keyword function |
| <!-- DOCFORG:FACT id=syntax.keyword.if --> `syntax.keyword.if` | `if` | Reserved keyword if |
| <!-- DOCFORG:FACT id=syntax.keyword.in --> `syntax.keyword.in` | `in` | Reserved keyword in |
| <!-- DOCFORG:FACT id=syntax.keyword.import --> `syntax.keyword.import` | `import` | Reserved keyword import |
| <!-- DOCFORG:FACT id=syntax.keyword.int --> `syntax.keyword.int` | `int` | Reserved keyword int |
| <!-- DOCFORG:FACT id=syntax.keyword.let --> `syntax.keyword.let` | `let` | Reserved keyword let |
| <!-- DOCFORG:FACT id=syntax.keyword.limit --> `syntax.keyword.limit` | `limit` | Reserved keyword limit |
| <!-- DOCFORG:FACT id=syntax.keyword.map --> `syntax.keyword.map` | `map` | Reserved keyword map |
| <!-- DOCFORG:FACT id=syntax.keyword.null --> `syntax.keyword.null` | `null` | Reserved keyword null |
| <!-- DOCFORG:FACT id=syntax.keyword.output --> `syntax.keyword.output` | `output` | Reserved keyword output |
| <!-- DOCFORG:FACT id=syntax.keyword.parallel --> `syntax.keyword.parallel` | `parallel` | Reserved keyword parallel |
| <!-- DOCFORG:FACT id=syntax.keyword.request_input --> `syntax.keyword.request_input` | `request_input` | Reserved keyword request_input |
| <!-- DOCFORG:FACT id=syntax.keyword.retry --> `syntax.keyword.retry` | `retry` | Reserved keyword retry |
| <!-- DOCFORG:FACT id=syntax.keyword.return --> `syntax.keyword.return` | `return` | Reserved keyword return |
| <!-- DOCFORG:FACT id=syntax.keyword.source --> `syntax.keyword.source` | `source` | Reserved keyword source |
| <!-- DOCFORG:FACT id=syntax.keyword.stream --> `syntax.keyword.stream` | `stream` | Reserved keyword stream |
| <!-- DOCFORG:FACT id=syntax.keyword.string --> `syntax.keyword.string` | `string` | Reserved keyword string |
| <!-- DOCFORG:FACT id=syntax.keyword.success --> `syntax.keyword.success` | `success` | Reserved keyword success |
| <!-- DOCFORG:FACT id=syntax.keyword.timeout --> `syntax.keyword.timeout` | `timeout` | Reserved keyword timeout |
| <!-- DOCFORG:FACT id=syntax.keyword.true --> `syntax.keyword.true` | `true` | Reserved keyword true |
| <!-- DOCFORG:FACT id=syntax.keyword.type --> `syntax.keyword.type` | `type` | Reserved keyword type |
| <!-- DOCFORG:FACT id=syntax.keyword.var --> `syntax.keyword.var` | `var` | Reserved keyword var |
| <!-- DOCFORG:FACT id=syntax.keyword.void --> `syntax.keyword.void` | `void` | Reserved keyword void |
| <!-- DOCFORG:FACT id=syntax.keyword.while --> `syntax.keyword.while` | `while` | Reserved keyword while |
| <!-- DOCFORG:FACT id=syntax.keyword.with --> `syntax.keyword.with` | `with` | Reserved keyword with |
| <!-- DOCFORG:FACT id=syntax.keyword.yield --> `syntax.keyword.yield` | `yield` | Reserved keyword yield |
| <!-- DOCFORG:FACT id=syntax.lambda.expression --> `syntax.lambda.expression` | `lambda_expr` | Grammar production lambda_expr |
| <!-- DOCFORG:FACT id=syntax.lambda.params.optional --> `syntax.lambda.params.optional` | `lambda_params_opt` | Grammar production lambda_params_opt |
| <!-- DOCFORG:FACT id=syntax.language.declaration.optional --> `syntax.language.declaration.optional` | `language_decl_opt` | Grammar production language_decl_opt |
| <!-- DOCFORG:FACT id=syntax.map.entry --> `syntax.map.entry` | `map_entry` | Grammar production map_entry |
| <!-- DOCFORG:FACT id=syntax.map.entry.sequence --> `syntax.map.entry.sequence` | `map_entry_seq` | Grammar production map_entry_seq |
| <!-- DOCFORG:FACT id=syntax.map.key --> `syntax.map.key` | `map_key` | Grammar production map_key |
| <!-- DOCFORG:FACT id=syntax.map.literal --> `syntax.map.literal` | `map_literal` | Grammar production map_literal |
| <!-- DOCFORG:FACT id=syntax.mode.declaration.optional --> `syntax.mode.declaration.optional` | `mode_decl_opt` | Grammar production mode_decl_opt |
| <!-- DOCFORG:FACT id=syntax.multiply.expression --> `syntax.multiply.expression` | `multiply_expr` | Grammar production multiply_expr |
| <!-- DOCFORG:FACT id=syntax.named.parallel.branches --> `syntax.named.parallel.branches` | `named_parallel_branches` | Grammar production named_parallel_branches |
| <!-- DOCFORG:FACT id=syntax.operation.policies --> `syntax.operation.policies` | `operation_policies` | Grammar production operation_policies |
| <!-- DOCFORG:FACT id=syntax.operation.policy --> `syntax.operation.policy` | `operation_policy` | Grammar production operation_policy |
| <!-- DOCFORG:FACT id=syntax.optional.suffix --> `syntax.optional.suffix` | `optional_suffix` | Grammar production optional_suffix |
| <!-- DOCFORG:FACT id=syntax.or.expression --> `syntax.or.expression` | `or_expr` | Grammar production or_expr |
| <!-- DOCFORG:FACT id=syntax.output.statement --> `syntax.output.statement` | `output_stmt` | Grammar production output_stmt |
| <!-- DOCFORG:FACT id=syntax.parallel.branches --> `syntax.parallel.branches` | `parallel_branches` | Grammar production parallel_branches |
| <!-- DOCFORG:FACT id=syntax.parallel.expression --> `syntax.parallel.expression` | `parallel_expr` | 值表达式形态仅限 parallel for；`let x = parallel {...}` 已删除 |
| <!-- DOCFORG:FACT id=syntax.parallel.for.expression --> `syntax.parallel.for.expression` | `parallel_for_expr` | Grammar production parallel_for_expr |
| <!-- DOCFORG:FACT id=syntax.parallel.statement --> `syntax.parallel.statement` | `parallel_stmt` | Grammar production parallel_stmt |
| <!-- DOCFORG:FACT id=syntax.param --> `syntax.param` | `param` | Grammar production param |
| <!-- DOCFORG:FACT id=syntax.param.list --> `syntax.param.list` | `param_list` | Grammar production param_list |
| <!-- DOCFORG:FACT id=syntax.param.sequence --> `syntax.param.sequence` | `param_seq` | Grammar production param_seq |
| <!-- DOCFORG:FACT id=syntax.postfix.expression --> `syntax.postfix.expression` | `postfix_expr` | Grammar production postfix_expr |
| <!-- DOCFORG:FACT id=syntax.primary.expression --> `syntax.primary.expression` | `primary_expr` | Grammar production primary_expr |
| <!-- DOCFORG:FACT id=syntax.primitive.type --> `syntax.primitive.type` | `primitive_type` | Grammar production primitive_type |
| <!-- DOCFORG:FACT id=syntax.program --> `syntax.program` | `program` | Grammar production program |
| <!-- DOCFORG:FACT id=syntax.request.input.statement --> `syntax.request.input.statement` | `request_input_stmt` | Grammar production request_input_stmt |
| <!-- DOCFORG:FACT id=syntax.return.statement --> `syntax.return.statement` | `return_stmt` | Grammar production return_stmt |
| <!-- DOCFORG:FACT id=syntax.return.type.optional --> `syntax.return.type.optional` | `return_type_opt` | Grammar production return_type_opt |
| <!-- DOCFORG:FACT id=syntax.semicolon.optional --> `syntax.semicolon.optional` | `semicolon_opt` | Grammar production semicolon_opt |
| <!-- DOCFORG:FACT id=syntax.statement --> `syntax.statement` | `statement` | Grammar production statement |
| <!-- DOCFORG:FACT id=syntax.statement.list --> `syntax.statement.list` | `stmt_list` | Grammar production stmt_list |
| <!-- DOCFORG:FACT id=syntax.ternary.expression --> `syntax.ternary.expression` | `ternary_expr` | Grammar production ternary_expr |
| <!-- DOCFORG:FACT id=syntax.top.level.declaration --> `syntax.top.level.declaration` | `top_level_decl` | Grammar production top_level_decl |
| <!-- DOCFORG:FACT id=syntax.top.level.list --> `syntax.top.level.list` | `top_level_list` | Grammar production top_level_list |
| <!-- DOCFORG:FACT id=syntax.trailing.comma.optional --> `syntax.trailing.comma.optional` | `trailing_comma_opt` | Grammar production trailing_comma_opt |
| <!-- DOCFORG:FACT id=syntax.type.atom --> `syntax.type.atom` | `type_atom` | Grammar production type_atom |
| <!-- DOCFORG:FACT id=syntax.type.declaration --> `syntax.type.declaration` | `type_decl` | Grammar production type_decl |
| <!-- DOCFORG:FACT id=syntax.type.ref --> `syntax.type.ref` | `type_ref` | Grammar production type_ref |
| <!-- DOCFORG:FACT id=syntax.type.ref.list --> `syntax.type.ref.list` | `type_ref_list` | Grammar production type_ref_list |
| <!-- DOCFORG:FACT id=syntax.typed.var.declaration --> `syntax.typed.var.declaration` | `typed_var_decl` | Grammar production typed_var_decl |
| <!-- DOCFORG:FACT id=syntax.unary.expression --> `syntax.unary.expression` | `unary_expr` | Grammar production unary_expr |
| <!-- DOCFORG:FACT id=syntax.var.declaration --> `syntax.var.declaration` | `var_decl` | Grammar production var_decl |
| <!-- DOCFORG:FACT id=syntax.while.statement --> `syntax.while.statement` | `while_stmt` | Grammar production while_stmt |
| <!-- DOCFORG:FACT id=syntax.yield.block --> `syntax.yield.block` | `yield_block` | Grammar production yield_block |
| <!-- DOCFORG:FACT id=syntax.yield.statement --> `syntax.yield.statement` | `yield_stmt` | Grammar production yield_stmt |
| <!-- DOCFORG:FACT id=type.any --> `type.any` | `any` | NodeCoda type category ANY |
| <!-- DOCFORG:FACT id=type.array --> `type.array` | `array` | NodeCoda type category ARRAY |
| <!-- DOCFORG:FACT id=type.bool --> `type.bool` | `bool` | NodeCoda type category BOOL |
| <!-- DOCFORG:FACT id=type.enum --> `type.enum` | `enum` | NodeCoda type category ENUM |
| <!-- DOCFORG:FACT id=type.file --> `type.file` | `file` | NodeCoda type category FILE |
| <!-- DOCFORG:FACT id=type.float --> `type.float` | `float` | NodeCoda type category FLOAT |
| <!-- DOCFORG:FACT id=type.function --> `type.function` | `function` | NodeCoda type category FUNCTION |
| <!-- DOCFORG:FACT id=type.int --> `type.int` | `int` | NodeCoda type category INT |
| <!-- DOCFORG:FACT id=type.map --> `type.map` | `map` | NodeCoda type category MAP |
| <!-- DOCFORG:FACT id=type.null --> `type.null` | `null` | NodeCoda type category NULL |
| <!-- DOCFORG:FACT id=type.optional --> `type.optional` | `optional` | NodeCoda type category OPTIONAL |
| <!-- DOCFORG:FACT id=type.record --> `type.record` | `record` | NodeCoda type category RECORD |
| <!-- DOCFORG:FACT id=type.string --> `type.string` | `string` | NodeCoda type category STRING |
| <!-- DOCFORG:FACT id=type.void --> `type.void` | `void` | NodeCoda type category VOID |
<!-- DOCFORG:END section=language-facts -->
