# Development and hosting

SignalForge uses [vinext](https://github.com/cloudflare/vinext), React and
TypeScript with optional Cloudflare D1/Drizzle storage. Start with the
[root README](../README.md) for product scope and local commands.

## Bindings and persistence

- `.openai/hosting.json` declares optional Sites D1 and R2 bindings.
- `vite.config.ts` simulates declared bindings for local development.
- `db/schema.ts` defines the stored evaluation contract.
- `examples/d1/` contains an optional D1 example surface.
- `drizzle.config.ts` supports `npm run db:generate` after schema changes.

This project does not use `wrangler.jsonc`. A binding declaration does not prove
that a production deployment has the binding. Inspect generated migrations and
the actual deployment configuration before a storage rollout.

## Workspace identity

OpenAI workspace sites can supply `oai-authenticated-user-email`. A non-empty
SIWC profile name may also arrive in `oai-authenticated-user-full-name`, with
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`. The full name
is optional; use the existing identity helper and fall back to email for display.
Display names and emails do not replace the stable ID used to own saved records.

Import the existing helpers from `app/chatgpt-auth.ts` when adding an authenticated
surface:

- `getChatGPTUser()` supports optional signed-in UI.
- `requireChatGPTUser(returnTo)` redirects anonymous visitors to sign-in.
- `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` build links.

Pass a same-origin relative `returnTo` destination. Mark identity-dependent
server pages with `export const dynamic = "force-dynamic"`.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, OAuth
cookies and identity-header injection. Do not implement application routes at
those reserved paths. Unprotected routes remain anonymous-compatible.

SIWC proves identity only. Team use still requires hosting access policy or an
explicit membership/allowlist check. Saved evaluations require a stable user ID
and owner filtering on every read; anonymous evaluation does not enable storage.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start local development |
| `npm run build`, `npm run start` | Build and serve the vinext output |
| `npm run test:unit` | Auth, input and preference contracts |
| `npm test` | Build, unit tests and rendered HTML checks |
| `npm run lint`, `npm run typecheck` | Static checks |
| `npm run audit:prod` | Audit the production dependency scope |
| `npm run quality` | Lint, typecheck, production audit, build and tests |
| `npm run test:browser` | Synthetic browser regressions |
| `npm run db:generate` | Generate migrations for inspection |
| `npm run prepush` | Existing application, browser and engineering gates |

Read [TOOLING.md](../TOOLING.md) for prerequisites and exact-commit publication
checks. [Architecture](architecture.md) and the
[technical overview](technical-overview.md) describe storage and rollout limits.

Framework references: [vinext documentation](https://github.com/cloudflare/vinext)
and [Drizzle D1 guide](https://orm.drizzle.team/docs/get-started/d1-new).
