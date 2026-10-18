#!/usr/bin/env node
// 生成 coze-biz 页的「语言能力矩阵」镜像块。
//
// 源 = spec/docs/user/TARGET-COMPATIBILITY.md 的 capability-matrix 段里
//      全部 `capability.nodecoda-sem-*` 事实（68 条，语言面）。
// 目标 = spec/docs/user/TARGET-COMPATIBILITY-COZE-BIZ.md 的 GENERATED 块。
//
// 为什么只镜像 nodecoda-sem-*：Graphon 节点行（capability.graphon-node-*）
// 是 Dify 面的事实，抄进 coze-biz 页等于把两个 target 的节点面混在一起。
//
// 为什么不做「coze-biz Build 判定」列：coze-biz 的现有判定是**形状级**的
// （`parallel` 结果收集经 merge / nil 传播 / 递增赋值 / 多默认候选），
// 与 capability id 不是一一映射；机械 join 会伪造语义。形状级判定留在
// 「已知限制与拒绝项」，本块只保证**枚举完整 + 防漂**。
//
// 用法：
//   node scripts/gen-coze-biz-capability-matrix.mjs --check   # 漂移 ⇒ rc=1
//   node scripts/gen-coze-biz-capability-matrix.mjs --write   # 重生成
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'spec', 'docs', 'user', 'TARGET-COMPATIBILITY.md')
const DST = join(ROOT, 'spec', 'docs', 'user', 'TARGET-COMPATIBILITY-COZE-BIZ.md')
const BEGIN = '<!-- GENERATED:coze-biz-capability-matrix BEGIN -->'
const END = '<!-- GENERATED:coze-biz-capability-matrix END -->'
const SECTION_BEGIN = '<!-- DOCFORG:BEGIN section=capability-matrix -->'
const SECTION_END = '<!-- DOCFORG:END section=capability-matrix -->'

function fail(msg) { throw new Error(msg) }

// 源页 capability 前缀的**闭集**。新增前缀 = 新 target 面 ⇒ 必须先在这里分类
// （镜像 / 不镜像 + 理由），否则生成器判红 —— 不许静默跳过（枚举范围 < 现实）。
const KNOWN_PREFIXES = new Map([
  ['capability.nodecoda-sem-', 'mirror'],      // 语言面：镜像到 coze-biz 页
  ['capability.graphon-node-', 'dify-only'],   // Graphon/Dify 节点面：不镜像（理由见文件头）
])
const MIRRORED_PREFIX = 'capability.nodecoda-sem-'

export function parseSource() {
  const text = readFileSync(SRC, 'utf8')
  const b = text.indexOf(SECTION_BEGIN)
  const e = text.indexOf(SECTION_END)
  if (b < 0 || e < 0 || e < b) fail('源页缺少 capability-matrix 段标记')
  const body = text.slice(b, e)
  const all = []
  const re = /^\|\s*<!--\s*DOCFORG:FACT id=(capability\.[a-z0-9.-]+)\s*-->\s*([^|]+?)\s*\|(.+)\|\s*$/gm
  for (const m of body.matchAll(re)) {
    const id = m[1].trim()
    const prefix = [...KNOWN_PREFIXES.keys()].find((p) => id.startsWith(p))
    if (!prefix) {
      fail(`未知 capability 前缀：${id} —— 先在生成器 KNOWN_PREFIXES 里声明它属于哪个 target 面（禁静默忽略）`)
    }
    const name = m[2].trim()
    const cols = m[3].split('|').map((s) => s.trim())
    if (cols.length !== 6) fail(`${id}: 期望 7 列（名称 + 6），实得 ${cols.length + 1}`)
    all.push({ id, name, prefix, disposition: cols[0], diagnostic: cols[5] })
  }
  // 已知前缀两侧都必须有事实：段被挪走/表被删 ⇒ 红，而不是「0 行也算过」。
  for (const prefix of KNOWN_PREFIXES.keys()) {
    if (!all.some((r) => r.prefix === prefix)) fail(`源页缺少 ${prefix}* 事实（段被删/挪？分母 0 ≠ 通过）`)
  }
  const rows = all.filter((r) => r.prefix === MIRRORED_PREFIX)
  if (rows.length === 0) fail('源页 capability-matrix 段里没有 nodecoda-sem 事实（分母 0 ≠ 通过）')
  const seen = new Set()
  for (const r of rows) {
    if (seen.has(r.id)) fail(`源页重复 capability id: ${r.id}`)
    seen.add(r.id)
  }
  return rows
}

export function renderMatrix(rows = parseSource()) {
  return [
    BEGIN,
    '> 本块由 `scripts/gen-coze-biz-capability-matrix.mjs` 从 `TARGET-COMPATIBILITY.md` 生成' +
      `（${rows.length} 条 \`nodecoda-sem-*\` 语言事实）；**禁止手改**。`,
    '> `node scripts/check-spec.mjs` 在源页变化而本块未重生成时失败。Graphon 节点行属于 Dify 面，不入本页。',
    '',
    '| 名称 | Disposition（照录源页） | 诊断 |',
    '|------|------------------------|------|',
    ...rows.map((r) => `| ${r.name} | ${r.disposition} | ${r.diagnostic} |`),
    END,
  ].join('\n')
}

export function checkMatrix() {
  try {
    const rows = parseSource()
    const doc = readFileSync(DST, 'utf8')
    const b = doc.indexOf(BEGIN)
    const e = doc.indexOf(END)
    if (b < 0 || e < 0 || e < b) return { ok: false, reason: '目标页缺少 GENERATED 块标记' }
    const actual = doc.slice(b, e + END.length)
    const expected = renderMatrix(rows)
    if (actual !== expected) return { ok: false, reason: 'GENERATED 块与源页不同步（跑 --write 重生成）' }
    return { ok: true, count: rows.length }
  } catch (err) {
    return { ok: false, reason: err.message }
  }
}

export function writeMatrix() {
  const rows = parseSource()
  const expected = renderMatrix(rows)
  const doc = readFileSync(DST, 'utf8')
  const b = doc.indexOf(BEGIN)
  const e = doc.indexOf(END)
  if (b < 0 || e < 0 || e < b) fail('目标页缺少 GENERATED 块标记（先放下 BEGIN/END 占位）')
  const next = doc.slice(0, b) + expected + doc.slice(e + END.length)
  writeFileSync(DST, next)
  return rows.length
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (isMain) {
  const args = new Set(process.argv.slice(2))
  if (args.has('--check')) {
    const r = checkMatrix()
    if (!r.ok) { console.error(`FAIL  coze-biz capability matrix: ${r.reason}`); process.exit(1) }
    console.log(`  ok  coze-biz capability matrix in sync (${r.count} rows)`)
  } else if (args.has('--write')) {
    const n = writeMatrix()
    console.log(`  ok  coze-biz capability matrix regenerated (${n} rows)`)
  } else {
    console.error('用法：--check | --write')
    process.exit(2)
  }
}
