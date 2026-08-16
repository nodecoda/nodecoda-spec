# NodeCoda 诊断码参考

<!-- DOCFORG:VERSION:BEGIN -->
> **语言**: nodecoda/1 | **标准库 API**: v1 | **Build Target**: dify-1.16-graphon-0.6
> **文档版本**: 2026-08-13
> **内容来源**: 版本化语言事实与验证示例
<!-- DOCFORG:VERSION:END -->


## 概述

Workflow Build 使用结构化诊断码报告错误和警告。诊断码是稳定的公开接口，可被工具和脚本解析。

- **错误码（E）**：语义/类型/作用域错误，阻止编译
- **警告码（W）**：代码质量问题，不阻止编译

格式：`[SEVERITY] CODE: message`
例如：`[ERROR] E1003: type mismatch in assignment`

---

<!-- DOCFORG:BEGIN section=diagnostics-table -->
### 错误码

| 码 | 诊断名称 | 阶段 |
|----|----------|------|
| <a id="e1000"></a> <!-- DOCFORG:FACT id=diagnostic.E1000 --> `E1000` | SYNTAX_ERROR | - |
| <a id="e1001"></a> <!-- DOCFORG:FACT id=diagnostic.E1001 --> `E1001` | UNDEFINED_VAR | - |
| <a id="e1002"></a> <!-- DOCFORG:FACT id=diagnostic.E1002 --> `E1002` | DUPLICATE_DEF | - |
| <a id="e1003"></a> <!-- DOCFORG:FACT id=diagnostic.E1003 --> `E1003` | TYPE_MISMATCH | - |
| <a id="e1004"></a> <!-- DOCFORG:FACT id=diagnostic.E1004 --> `E1004` | ARG_COUNT | - |
| <a id="e1005"></a> <!-- DOCFORG:FACT id=diagnostic.E1005 --> `E1005` | RETURN_TYPE | - |
| <a id="e1006"></a> <!-- DOCFORG:FACT id=diagnostic.E1006 --> `E1006` | NOT_CALLABLE | - |
| <a id="e1007"></a> <!-- DOCFORG:FACT id=diagnostic.E1007 --> `E1007` | NOT_ITERABLE | - |
| <a id="e1008"></a> <!-- DOCFORG:FACT id=diagnostic.E1008 --> `E1008` | CONDITION_NOT_BOOL | - |
| <a id="e1009"></a> <!-- DOCFORG:FACT id=diagnostic.E1009 --> `E1009` | NO_ENTRY | - |
| <a id="e1010"></a> <!-- DOCFORG:FACT id=diagnostic.E1010 --> `E1010` | MISSING_RETURN | - |
| <a id="e1011"></a> <!-- DOCFORG:FACT id=diagnostic.E1011 --> `E1011` | UNREACHABLE_CODE | - |
| <a id="e1012"></a> <!-- DOCFORG:FACT id=diagnostic.E1012 --> `E1012` | BINARY_TYPE | - |
| <a id="e1013"></a> <!-- DOCFORG:FACT id=diagnostic.E1013 --> `E1013` | INDEX_TYPE | - |
| <a id="e1014"></a> <!-- DOCFORG:FACT id=diagnostic.E1014 --> `E1014` | FIELD_NOT_FOUND | - |
| <a id="e1015"></a> <!-- DOCFORG:FACT id=diagnostic.E1015 --> `E1015` | UNKNOWN_TYPE | - |
| <a id="e1016"></a> <!-- DOCFORG:FACT id=diagnostic.E1016 --> `E1016` | NOT_IN_LOOP | - |
| <a id="e1017"></a> <!-- DOCFORG:FACT id=diagnostic.E1017 --> `E1017` | OUTPUT_KEY_TYPE | - |
| <a id="e1018"></a> <!-- DOCFORG:FACT id=diagnostic.E1018 --> `E1018` | ASSIGN_IMMUTABLE | - |
| <a id="e1019"></a> <!-- DOCFORG:FACT id=diagnostic.E1019 --> `E1019` | INVALID_MODE | - |
| <a id="e1020"></a> <!-- DOCFORG:FACT id=diagnostic.E1020 --> `E1020` | ENTRY_NO_RETURN | - |
| <a id="e1021"></a> <!-- DOCFORG:FACT id=diagnostic.E1021 --> `E1021` | CODE_INPUT_TYPE | - |
| <a id="e1022"></a> <!-- DOCFORG:FACT id=diagnostic.E1022 --> `E1022` | CODE_INPUT_SELECTOR | - |
| <a id="e1023"></a> <!-- DOCFORG:FACT id=diagnostic.E1023 --> `E1023` | CODE_DUPLICATE_INPUT | - |
| <a id="e1024"></a> <!-- DOCFORG:FACT id=diagnostic.E1024 --> `E1024` | CODE_SOURCE_REQUIRED | - |
| <a id="e1025"></a> <!-- DOCFORG:FACT id=diagnostic.E1025 --> `E1025` | CODE_OUTPUT_INVALID | - |
| <a id="e1026"></a> <!-- DOCFORG:FACT id=diagnostic.E1026 --> `E1026` | CODE_DUPLICATE_OUTPUT | - |
| <a id="e1027"></a> <!-- DOCFORG:FACT id=diagnostic.E1027 --> `E1027` | CODE_LANGUAGE_UNSUPPORTED | - |
| <a id="e1028"></a> <!-- DOCFORG:FACT id=diagnostic.E1028 --> `E1028` | CODE_SOURCE_INVALID | - |
| <a id="e1030"></a> <!-- DOCFORG:FACT id=diagnostic.E1030 --> `E1030` | CODE_PORT_INVALID | - |
| <a id="e1031"></a> <!-- DOCFORG:FACT id=diagnostic.E1031 --> `E1031` | STDLIB_STATIC_ARGUMENT | - |
| <a id="e1032"></a> <!-- DOCFORG:FACT id=diagnostic.E1032 --> `E1032` | STDLIB_CALL_CONTEXT | - |
| <a id="e1033"></a> <!-- DOCFORG:FACT id=diagnostic.E1033 --> `E1033` | RECURSIVE_CALL | - |
| <a id="e1034"></a> <!-- DOCFORG:FACT id=diagnostic.E1034 --> `E1034` | TARGET_NOT_LOWERABLE | - |
| <a id="e1035"></a> <!-- DOCFORG:FACT id=diagnostic.E1035 --> `E1035` | PARALLEL_EXPORT_CONFLICT | - |
| <a id="e1036"></a> <!-- DOCFORG:FACT id=diagnostic.E1036 --> `E1036` | PARALLEL_ACCESS_HAZARD | - |
| <a id="e1037"></a> <!-- DOCFORG:FACT id=diagnostic.E1037 --> `E1037` | PARALLEL_EXTERNAL_EXIT | - |
| <a id="e1038"></a> <!-- DOCFORG:FACT id=diagnostic.E1038 --> `E1038` | DUPLICATE_TYPE | - |
| <a id="e1039"></a> <!-- DOCFORG:FACT id=diagnostic.E1039 --> `E1039` | OPTIONAL_REQUIRED | - |
| <a id="e1040"></a> <!-- DOCFORG:FACT id=diagnostic.E1040 --> `E1040` | ANY_NOT_NARROWED | - |
| <a id="e1041"></a> <!-- DOCFORG:FACT id=diagnostic.E1041 --> `E1041` | EFFECT_CONTEXT | - |
| <a id="e1042"></a> <!-- DOCFORG:FACT id=diagnostic.E1042 --> `E1042` | INVALID_STATE | - |
| <a id="e1043"></a> <!-- DOCFORG:FACT id=diagnostic.E1043 --> `E1043` | YIELD_CONTRACT | - |
| <a id="e1044"></a> <!-- DOCFORG:FACT id=diagnostic.E1044 --> `E1044` | RESPONSE_CONTEXT | - |
| <a id="e1045"></a> <!-- DOCFORG:FACT id=diagnostic.E1045 --> `E1045` | OPERATION_POLICY | - |
| <a id="e1046"></a> <!-- DOCFORG:FACT id=diagnostic.E1046 --> `E1046` | TARGET_PROFILE_UNKNOWN | - |
| <a id="e1047"></a> <!-- DOCFORG:FACT id=diagnostic.E1047 --> `E1047` | SELECTOR_NO_PRODUCER | - |
| <a id="e1048"></a> <!-- DOCFORG:FACT id=diagnostic.E1048 --> `E1048` | UNINITIALIZED_USE | - |
| <a id="e1049"></a> <!-- DOCFORG:FACT id=diagnostic.E1049 --> `E1049` | EMPTY_AGGREGATE_TYPE | - |
| <a id="e1050"></a> <!-- DOCFORG:FACT id=diagnostic.E1050 --> `E1050` | LANGUAGE_IDENTITY | - |
| <a id="e1099"></a> <!-- DOCFORG:FACT id=diagnostic.E1099 --> `E1099` | LOWERING_INVARIANT | - |

### 警告码

| 码 | 诊断名称 | 阶段 |
|----|----------|------|
| <a id="w2001"></a> <!-- DOCFORG:FACT id=diagnostic.W2001 --> `W2001` | DEAD_CODE | - |
| <a id="w2002"></a> <!-- DOCFORG:FACT id=diagnostic.W2002 --> `W2002` | UNUSED_VAR | - |
| <a id="w2003"></a> <!-- DOCFORG:FACT id=diagnostic.W2003 --> `W2003` | EMPTY_ENTRY | - |
| <a id="w2004"></a> <!-- DOCFORG:FACT id=diagnostic.W2004 --> `W2004` | EMPTY_FOR_BODY | - |
| <a id="w2005"></a> <!-- DOCFORG:FACT id=diagnostic.W2005 --> `W2005` | CODE_SOURCE_CONTRACT_UNVERIFIED | - |
| <a id="w2006"></a> <!-- DOCFORG:FACT id=diagnostic.W2006 --> `W2006` | CODE_SOURCE_CONTRACT_MISMATCH | - |
| <a id="w2010"></a> <!-- DOCFORG:FACT id=diagnostic.W2010 --> `W2010` | ANY_FIELD_ACCESS | - |
<!-- DOCFORG:END section=diagnostics-table -->

## 使用建议

### 遇到 E1003（TYPE_MISMATCH）

```ncoda
// ❌ 错误
int x = "hello";

// ✅ 正确
int x = 42;
```

### 遇到 E1001（UNDEFINED_VAR）

错误程序：

```ncoda invalid E1001
@language nodecoda/1
function main() -> string {
    return result;
}
```

修正后：

```ncoda verified
@language nodecoda/1
function main() -> string {
    let result = "hello";
    return result;
}
```

### 遇到 E1031（STDLIB_STATIC_ARGUMENT）

```ncoda
// ❌ 错误：dataset_ids 必须是字面量
let ds = "ds-001";
return std.v1.rag_answer(query, ds, "openai/gpt-4o");

// ✅ 正确
return std.v1.rag_answer(query, "ds-001", "openai/gpt-4o");
```

---

## 稳定性说明

诊断码和 JSON 字段是稳定的公开接口。人类可读的消息文本不是兼容性接口，可能随服务更新变化。
