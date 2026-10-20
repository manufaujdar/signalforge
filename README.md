# SignalForge

SignalForge is a content-evaluation prototype for drafts intended for X,
LinkedIn and Instagram. It uses an explainable local text-and-platform heuristic
to compare editorial directions. Scores describe prioritization confidence;
they do not predict reach or verify factual claims. Dashboard analytics are
labelled synthetic demonstration data, with no connected platform account.

[Documentation map](docs/DOCUMENTATION_INDEX.md) ·
[Architecture](docs/architecture.md) ·
[Development and hosting](docs/development.md)

## Run locally

Requires Node.js 22.13.0 or newer. Install the locked dependencies:

```sh
npm ci
npm run dev
```

Use `npm run build` to create the vinext build and `npm run start` to serve it.
The application uses React/TypeScript, vinext and Cloudflare-compatible Worker
surfaces, with optional D1/Drizzle persistence.

## Evaluation and saved records

Anonymous visitors can evaluate text locally. Saving is an explicit API action
that requires a stable authenticated-user ID; stored evaluations are filtered
by that owner on every read. Legacy anonymous rows remain quarantined.

Workspace preferences in the desktop/mobile header save the default platform
and enhancement direction in this browser. Blocked browser storage retains
choices for the current tab with visible feedback. Draft text is not autosaved.
Publishing remains a human action. Audience and campaign-goal scoring need a
defined editorial model and are outside the current evaluator.

Sign in with ChatGPT establishes identity, not workspace membership. Keep saved
records behind the hosting access policy or an explicit membership/allowlist
policy. The [development guide](docs/development.md) describes identity headers,
reserved authentication routes and binding setup.

## Repository map

| Location | Purpose |
| --- | --- |
| `app/` | Pages, layout, identity helpers and evaluation API |
| `lib/` | Shared input and workspace-preference contracts |
| `db/`, `drizzle/` | Database client, schema and migration history |
| `worker/` | Hosted Worker entry point and security headers |
| `build/`, `types/` | Hosting integration and local binding types |
| `examples/d1/` | Optional database example |
| `tests/`, `scripts/`, `tools/` | Application checks and engineering tooling |
| `docs/` | Product, architecture and development explanations |

Keep generated build output and local database state out of source commits.
Generate and inspect migrations after schema changes. Existing paths remain
stable for imports, deployment and migration history.

## Validation and contribution

```sh
npm run quality
npm run test:browser
```

`quality` runs lint, typecheck, the production-dependency audit, build, unit
checks and rendered HTML tests. The separate browser command checks synthetic
rendered behavior. See [TOOLING.md](TOOLING.md) for the exact outgoing-commit
gate and [CONTRIBUTING.md](CONTRIBUTING.md) for the change workflow.

Local checks do not establish hosted owner isolation, migration rollout or
production readiness. Those gates, retention, membership policy and the license
decision remain explicit follow-up work in the
[technical overview](docs/technical-overview.md).
