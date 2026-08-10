# Contributing

SignalForge is a local content-evaluation prototype. Keep editorial scoring
explainable, preserve human approval for publication, and treat platform reach
as an internal heuristic rather than a guarantee.

Before opening a pull request:

```bash
npm ci
npm run lint
npm test
```

Never add account credentials, tokens, private messages, or automated publishing,
likes, follows, reposts, or replies. Use synthetic content and test the API and
rendered surface locally.
