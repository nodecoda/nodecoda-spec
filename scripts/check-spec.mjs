#!/usr/bin/env node
// NodeCoda spec repository integrity gate.
// Verifies VERSION.json invariants, content-addressed doc hashes, and example
// counts. Runs in CI on every push/PR; also runnable locally (node >=18).

import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const USER_DIR = join(ROOT, 'spec', 'docs', 'user')
const EX_DSL = join(ROOT, 'spec', 'examples', 'nodecoda')
const EX_YAML = join(ROOT, 'spec', 'examples', 'yaml')
const VERSION_PATH = join(USER_DIR, 'VERSION.json')
const DOCS = [
  'BEST-PRACTICES.md', 'CONCEPTS.md', 'COOKBOOK.md',
  'DIAGNOSTICS.md', 'GETTING-STARTED.md', 'LANGUAGE-REFERENCE.md', 'MIGRATION.md',
  'README.md', 'STDLIB-REFERENCE.md', 'TARGET-COMPATIBILITY.md',
  'TROUBLESHOOTING.md', 'UNSUPPORTED-SEMANTICS.md', 'WORKFLOW-PATTERNS.md',
]

let failures = 0
function check(cond, label) {
  if (cond) { console.log(`  ok  ${label}`) } else { failures += 1; console.error(`FAIL  ${label}`) }
}

console.log('[spec] VERSION.json invariants')
const version = JSON.parse(readFileSync(VERSION_PATH, 'utf8'))
check(version.schema_version === 1, `schema_version == 1 (got ${version.schema_version})`)
check(version.language_identity === 'nodecoda/1', `language_identity == nodecoda/1 (got ${version.language_identity})`)
check(version.stdlib_api_version === 'v1', `stdlib_api_version == v1 (got ${version.stdlib_api_version})`)
check(version.target_profile === 'dify-1.16-graphon-0.6', `target_profile == dify-1.16-graphon-0.6 (got ${version.target_profile})`)
check(typeof version.doc_hashes === 'object', 'doc_hashes present')

console.log('[spec] doc_hashes match committed docs')
const hashes = version.doc_hashes || {}
const hashKeys = Object.keys(hashes).sort()
check(hashKeys.length === 13, `doc_hashes has 13 docs (got ${hashKeys.length})`)
for (const name of hashKeys) {
  const p = join(USER_DIR, name)
  if (!existsSync(p)) { failures += 1; console.error(`FAIL  doc missing: ${name}`); continue }
  const actual = createHash('sha256').update(readFileSync(p)).digest('hex').slice(0, 16)
  check(actual === hashes[name], `sha256[:16](${name}) matches`)
}

console.log('[spec] examples')
const dsl = readdirSync(EX_DSL).filter((f) => f.endsWith('.ncoda'))
const yaml = readdirSync(EX_YAML).filter((f) => f.endsWith('.yml'))
check(dsl.length === (version.examples_count ?? 0), `examples_count == ${dsl.length} (.ncoda)`)
check(yaml.length >= 1, `yaml examples present (${yaml.length})`)
check(existsSync(join(ROOT, 'README.md')), 'README.md present')
check(existsSync(join(ROOT, 'LICENSE')), 'LICENSE present')

console.log(failures === 0 ? `[spec] ALL CHECKS PASSED` : `[spec] ${failures} FAILURES`)
process.exit(failures === 0 ? 0 : 1)
