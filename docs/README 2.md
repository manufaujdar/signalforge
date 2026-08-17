# SignalForge documentation

Read in this order:

1. [`../README.md`](../README.md) — product intent, quick start, and non-goals.
2. [`../PRIVACY_AND_DATA_BOUNDARY.md`](../PRIVACY_AND_DATA_BOUNDARY.md) — data and hosting boundary.
3. [`../SECURITY.md`](../SECURITY.md) and [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — review and reporting rules.
4. The `app/` routes and `db/` schema — authenticated owner-scoped evaluation flow.
5. `tests/` and `npm run quality` — deterministic validation evidence.

## Architecture at a glance

```text
Browser draft -> deterministic evaluator -> explanation/variants
       |                         |
       +-> optional host identity +-> owner-scoped D1 persistence
```

The evaluator is authoritative for the local prototype. External publishing,
OAuth, scheduling, platform analytics, and model calls are separate future
scopes and require an explicit product, privacy, security, and platform-policy
review.

## Release checklist

Before calling a release open-source-ready, confirm the MIT license, notice,
dependency/SBOM inventory, secrets scan, owner-scoped persistence tests, hosted
privacy/terms documents if data collection is enabled, and human approval for
any external account integration.
