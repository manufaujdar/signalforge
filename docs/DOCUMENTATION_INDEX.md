# Documentation index

SignalForge is a full-stack TypeScript content-evaluation prototype using vinext
and Cloudflare-compatible surfaces. Start with the product scope before changing
the evaluator, stored records or hosting configuration.

## Authoritative documents

- [README](../README.md): product boundary, local commands and repository map.
- [Development](development.md): identity helpers, binding setup and commands.
- [Architecture](architecture.md): application, worker, auth and persistence flow.
- [Technical overview](technical-overview.md): data model and remaining gates.
- [Security](../SECURITY.md) and [contribution guide](../CONTRIBUTING.md): reporting and change workflow.
- [Tooling](../TOOLING.md): exact outgoing-commit checks and prerequisites.
- .openai/hosting.json, app/, db/, worker/, tests/: executable sources.

## Initial documentation set

| Area | Status |
| --- | --- |
| Product scope and prototype boundary | Product README and development guide |
| Architecture and deployment topology | Added |
| Codebase and technology | Added |
| Data model and owner-scoped persistence | Added |
| Security headers and identity handling | Present and documented |
| Tests/build/typecheck/quality | Present |
| License/open-source status | Human follow-up; no license declared |

Use vinext/Cloudflare worker, Drizzle migration, and rendered accessibility
patterns as references. Optional D1/R2 bindings are not active production
dependencies unless deployment configuration proves they are bound.

