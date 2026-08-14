# SignalForge

SignalForge is a local-first dashboard for evaluating draft social content with
transparent editorial heuristics. It helps a human team compare clarity,
conversation, evidence, and risk signals before publication; it is not a
platform-ranking oracle, autonomous marketing system, or publishing service.

The repository is a research/alpha prototype. Scores are directional signals,
not reach predictions, and every external account action remains outside the
application and under human control.

## Start here

- [`docs/README.md`](docs/README.md) — documentation map and release boundary
- [`SECURITY.md`](SECURITY.md) — security reporting and prohibited data
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — local contribution workflow
- [`PRIVACY_AND_DATA_BOUNDARY.md`](PRIVACY_AND_DATA_BOUNDARY.md) — source-only data boundary
- [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) — dependency and integration notice

The source is licensed under the [MIT License](LICENSE). `private: true` in
`package.json` prevents accidental npm publication; it does not make the GitHub
source private and does not replace the repository license.

## Product boundary

- Local evaluation is available without persistence or external model calls.
- Saved evaluations require the host's authenticated user identity and are
  filtered by stable owner ID on every read and write.
- Synthetic dashboard examples are clearly labeled and are not account analytics.
- OAuth, scheduling, posting, replies, likes, follows, reposts, and account
  credentials are intentionally out of scope.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

This starter does not use `wrangler.jsonc`.

## Included application shape

- edit site code under `app/`
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

This application is built on a reusable vinext starter shape, but the
SignalForge product copy, evaluator, data boundary, and owner-scoped routes are
the project-specific surface.

## Workspace Auth Headers

OpenAI workspace sites can read the current user's email from
`oai-authenticated-user-email`.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Saved evaluations require the stable authenticated-user ID and are filtered by
that ID on every read. Anonymous visitors can still use the explainable evaluator
locally, but the API refuses anonymous persistence. Deploy this app privately or
add an explicit membership policy before using saved records with a team.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build the starter and verify its rendered loading skeleton
- `npm run typecheck`: verify application, worker, D1 shim, and test types
- `npm run quality`: lint, typecheck, audit production dependencies, build, and test
- `npm run db:generate`: generate Drizzle migrations after schema changes

Run `npm run quality` before proposing a release. It checks lint, TypeScript,
production dependency advisories, build, and deterministic tests. A green local
check does not establish platform-policy compliance, privacy compliance, or
production readiness.

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
