# Technical overview

Status: alpha prototype; local quality checks are the acceptance gate.

## Runtime and dependencies

- Node.js 22.13 or newer.
- TypeScript, React, Next, vinext, Vite, and Cloudflare tooling.
- Drizzle ORM with SQLite/D1-compatible schema.
- Tailwind/PostCSS and ESLint.
- npm lockfile and scripts for dev, build, unit/rendered tests, lint, typecheck, audit, migrations, and quality.

## Codebase map

- app/: UI, auth helpers, and evaluation API.
- db/ and drizzle/: schema, database client, and migrations.
- worker/: production worker and security-header wrapper.
- build/ and vite.config.ts: Sites/vinext integration and local binding shims.
- examples/d1/: optional D1 surface.
- tests/: authenticated-owner, input, rendered HTML, and quality checks.

## Data contract

evaluations contains id, ownerId, platform, content, score, risk, and
createdAt. ownerId is nullable only for quarantined pre-auth rows; the
application writes authenticated owners and filters every read by the current
user. Keep evaluation content and risk semantics documented with schema changes.

## Operations and gaps

Use the pinned Node/npm setup and the package quality scripts. Generate Drizzle
migrations after schema changes and inspect them before deployment. Membership
policy, retention, migration rollout, observability, and a license decision
need explicit ownership. A green local build is not a hosted authorization or
privacy review.

