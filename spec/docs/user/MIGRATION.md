# NodeCoda 迁移指南

<!-- DOCFORG:VERSION:BEGIN -->
> **语言**: nodecoda/1 | **标准库 API**: v1 | **Build Target**: dify-1.16-graphon-0.6
> **文档版本**: 2026-08-13
> **内容来源**: 版本化语言事实与验证示例
<!-- DOCFORG:VERSION:END -->


## 当前版本状态

NodeCoda 目前处于预发布阶段，公开语言身份已固定为 `nodecoda/1`。每个公开 `.ncoda`
Source 都必须显式声明 `@language nodecoda/1`；缺失或不受支持的身份会使 Workflow Build
失败，不会自动回退到其他版本。

迁移时必须分别记录：

| 身份 | 作用 |
|------|------|
| `language_identity` | NodeCoda Workflow Language 合同版本；当前为 `nodecoda/1` |
| `stdlib_api_version` | 标准库 API 命名空间 |
| `target_profile` | Workflow Build 使用的 Dify/Graphon 目标范围 |
当前精确值见 [`VERSION.json`](VERSION.json)。

## 升级检查

1. 保存旧版 `.ncoda` Source、Build Target 和生成的 YAML。
2. 将 Source 的 `@language` identity 更新到明确支持的版本，不省略版本声明。
3. 使用新版本重新执行所有 Workflow Build，不复用旧 YAML 作为成功依据。
4. 检查 [目标兼容性](TARGET-COMPATIBILITY.md) 中相关能力的状态和证据是否变化。
5. 对诊断变化按稳定诊断码处理，不依赖完整消息文本。
6. 在 Dify 导入并验证运行时行为；Build 成功不等于运行时已经认证。

## 破坏性变化记录

预发布阶段不承诺跨 language identity 的隐式兼容。发生破坏性变化时，发布说明必须明确列出
受影响语法、诊断、标准库 API、Build Target 和替代方案。

## 不要这样迁移

- 不要把目标证据变化标成语法变化。
- 不要为通过编译而静默删除输出或共享状态。
- 不要把旧版导入 YAML 当作当前 Workflow Build 的规范输出。
- 不要在缺少生命周期元数据时自行发明版本号。
