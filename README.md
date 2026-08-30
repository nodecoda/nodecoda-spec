# NodeCoda Language Specification

The public home of the **NodeCoda language** (`.ncoda`) — specification, reference
docs, and examples.

> **Authority**: `spec/grammar.ebnf` is the machine-readable grammar of record
> (single source of truth). `spec/docs/user/LANGUAGE-REFERENCE.md` §11 is its
> production-name index; `spec/examples/nodecoda/` is its example corpus.
> Grammar changes must update the EBNF, the §11 index, the reference prose,
> and examples in one change set (see `spec/grammar.ebnf` header).

> NodeCoda is an independent product and is not affiliated with or endorsed by
> Dify. Dify is referenced solely to describe a Supported workflow Build Target
> and interoperability.

## Repository layout

```
spec/
  grammar.ebnf            THE grammar of record (EBNF, single source of truth)
  SYNTAX.md               enum-syntax addendum (supplements grammar.ebnf)
  docs/user/              user reference docs + VERSION.json (13 docs)
    VERSION.json          language_identity, stdlib version, content-addressed doc hashes
examples/
  nodecoda/               66 `.ncoda` sources (the high-level DSL)
  yaml/                   47 Dify workflow YAML examples (interop fixtures)
```

## Versioning

`spec/docs/user/VERSION.json` pins:

- `language_identity`: `nodecoda/1`
- `stdlib_api_version`: `v1`
- `target_profile`: `dify-1.16-graphon-0.6`
- `doc_hashes`: sha256[:16] of every rendered user doc (content-addressed)

The platform consumes this repository as a pinned snapshot (`@nodecoda/spec`
vendor bundle in the main product repo). Doc changes land here first, then the
product bumps its pinned snapshot.

## Validation

CI runs `scripts/check-spec.mjs`:

- `VERSION.json` schema/identity invariants
- `doc_hashes` match the committed docs byte-for-byte
- `examples_count` matches the number of `.ncoda` examples
- every example file is non-empty

## License

MIT — see [LICENSE](LICENSE).
