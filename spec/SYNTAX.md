---
doc_kind: maintainer-guide
doc_status: active
authority: nodecoda-enum-syntax-addendum
scope: Maintainer addendum for NodeCoda enum syntax and parser examples.
last_verified: 2026-07-27
---

# NodeCoda Enum Syntax Addendum

This addendum records the canonical public spelling of enum constructs only. It is not a complete NodeCoda
syntax reference. Grammar acceptance for the whole language, including enums, is defined by
`docs/user/LANGUAGE-REFERENCE.md` (§11 语言事实索引); observable meaning and target limits are
defined by `docs/user/LANGUAGE-REFERENCE.md` together with `docs/user/UNSUPPORTED-SEMANTICS.md`
and `docs/user/TARGET-COMPATIBILITY.md`.

## Enum Declarations

```ncoda
enum TravelMode {
    air,
    rail,
};
```

An enum declaration is top-level and contains one or more identifier members separated by commas.
The trailing comma and the semicolon after `}` are optional. The enum name is unique in the global
type namespace, member names are unique within the declaration, and explicit member assignments are
not supported. Source member spelling is the canonical external value: `TravelMode.air` has wire
value `"air"`.

Members are always qualified as `EnumName.member`; a bare member name is not an enum value. Every
declaration creates a nominal type, so two declarations with the same member spellings are still
different types. An enum value exposes only the read-only projection `.value: string`. The language
does not implicitly convert a string to an enum or an enum to a string.

Values of the same enum type support only `==` and `!=`. Ordering, arithmetic, truthiness, and
comparisons between different enum types are invalid. Enum types may appear in records, locals,
function parameters, and function results; target support for a particular boundary is checked
separately from language validity.

For the locked `dify-1.16-graphon-0.6` target, a scalar Start parameter lowers to Dify `select` with
ordered options derived from the enum members. Compiler-generated Code transports an enum through a
physical `string` port while semantic facts retain its nominal NodeCoda type. Required scalar Parameter
Extractor fields lower to Graphon `type: string` plus the same ordered member options. Source-level
`extract()` configuration has no `options` key; options derive only from the enum declaration.
