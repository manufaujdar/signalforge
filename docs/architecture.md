# System architecture

SignalForge is a small full-stack TypeScript application with a vinext/Next
application surface, a Cloudflare Worker entrypoint, and optional D1/Drizzle
persistence.

## Request flow

Browser -> app route/page -> workspace identity helper -> validation/service ->
Drizzle database access -> owner-scoped evaluation response.

Anonymous visitors may use the explainable evaluator locally. Saved evaluations
require a stable authenticated-user ID and every read filters by ownerId.
Legacy anonymous rows are quarantined rather than treated as owned data.

## Components

- app/: pages, layout, styling, auth helpers, and evaluation API.
- app/api/evaluations/: authenticated evaluation API and input validation.
- db/ and drizzle/: client, schema, and generated migrations.
- worker/index.ts: vinext worker, image optimization, and security headers.
- vite.config.ts and .openai/hosting.json: local binding simulation and optional Sites declarations.
- tests/: auth, input, rendered HTML, build, type, lint, and dependency checks.

## Deployment and evolution

The intended hosted shape is a vinext application on a Cloudflare-compatible
worker with optional D1/image bindings. Local development uses Vite/vinext
shims. SIWC identity does not prove workspace membership; use hosting access
policy or an explicit server-side allowlist. Any new stored record needs owner
identity, validation, retention, migration, and test coverage.

