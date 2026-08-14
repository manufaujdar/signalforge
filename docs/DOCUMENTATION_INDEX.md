# Documentation index

SignalForge is a full-stack TypeScript evaluation-dashboard prototype using
vinext and Cloudflare-compatible surfaces. The README retains some starter
template wording; this index records the implemented product-specific boundary.

## Authoritative documents

- README.md: local commands, identity, persistence, and Sites notes.
- docs/architecture.md: application, worker, auth, and persistence flow.
- docs/technical-overview.md: codebase, technology, data model, and validation.
- SECURITY.md and CONTRIBUTING.md: security and change workflow.
- .openai/hosting.json, app/, db/, worker/, tests/: executable sources.

## Initial documentation set

| Area | Status |
| --- | --- |
| Product scope and prototype boundary | Present, needs README cleanup |
| Architecture and deployment topology | Added |
| Codebase and technology | Added |
| Data model and owner-scoped persistence | Added |
| Security headers and identity handling | Present and documented |
| Tests/build/typecheck/quality | Present |
| License/open-source status | Human follow-up; no license declared |

Use vinext/Cloudflare worker, Drizzle migration, and rendered accessibility
patterns as references. Optional D1/R2 bindings are not active production
dependencies unless deployment configuration proves they are bound.

