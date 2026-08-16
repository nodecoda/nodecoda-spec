# NodeCoda 故障排查

<!-- DOCFORG:VERSION:BEGIN -->
> **语言**: nodecoda/1 | **标准库 API**: v1 | **Build Target**: dify-1.16-graphon-0.6
> **文档版本**: 2026-08-13
> **内容来源**: 版本化语言事实与验证示例
<!-- DOCFORG:VERSION:END -->


## 先确定失败阶段

1. **词法或解析失败**：检查标点、保留字、声明位置和控制流形式。
2. **绑定或类型失败**：检查名称作用域、参数类型、返回类型和不可变绑定。
3. **目标验证失败**：程序可能是合法 NodeCoda，但当前 Dify/Graphon 目标不能保持其语义。
4. **YAML 导入失败**：确认 YAML 来自当前 Workflow Build，并核对 Build Target。
5. **运行时失败**：查找与精确能力形状匹配的运行证据，不要从 Build 成功推断运行成功。

## 保留完整诊断

诊断码是稳定查找键，人类可读消息不是兼容性接口。报告问题时至少保留：

- 诊断码和失败阶段；
- 最小 `.ncoda` 源码；
- Workflow Build ID；
- language identity、标准库 API 版本和 Build Target；
- 如果问题发生在 Dify，保留导入错误或运行日志。

所有公开诊断见 [诊断码参考](DIAGNOSTICS.md)。`E1034` 通常表示目标能力拒绝，应同时查看 [目标兼容性](TARGET-COMPATIBILITY.md) 和 [不支持的目标语义](UNSUPPORTED-SEMANTICS.md)。

## 检查版本是否一致

对照页首信息检查 Source 的 language identity、标准库 API 和 Build Target。不要用旧版文档解释
新版诊断，也不要把其他 Target 的运行证据套用到当前 Build。

## 提交最小复现

删除与失败无关的操作，但保留相同诊断码、失败阶段和目标配置。不要用手写 YAML 替代 NodeCoda 复现，因为那会绕过语言和目标验证边界。
