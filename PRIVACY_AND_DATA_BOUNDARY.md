# Privacy and data boundary

This is a source-only, local-first research prototype. This file documents the
repository's technical behavior; it is not a hosted privacy notice, Terms of
Service, DPA, or legal advice.

## Current behavior

- Draft text and local evaluator inputs are processed by the application for the
  current session. The deterministic evaluator does not call an external model.
- Saved evaluations require the hosting environment's authenticated user ID and
  email headers. Reads and writes are owner-scoped; anonymous persistence is
  rejected.
- If a maintainer configures Cloudflare D1, stored records are subject to that
  operator's retention, deletion, backup, access, and incident-response rules.
- The repository contains no account credentials, platform tokens, private
  messages, customer exports, or real analytics datasets.
- OAuth, scheduling, posting, replies, likes, follows, reposts, and autonomous
  account actions are outside the implementation boundary.

## Contributor rules

Use synthetic fixtures and public, redistributable examples only. Do not paste
personal information, private account data, confidential client material,
unpublished campaign data, or platform exports into issues, pull requests,
tests, logs, screenshots, or commits. Remove sensitive data locally and follow
the maintainer's incident process if it is encountered.

## Deployment responsibility

A deployer must publish a jurisdiction-appropriate privacy notice and terms of
use before collecting user data, define controller/operator identity and contact,
lawful basis where applicable, retention/deletion/export handling, subprocessors,
cross-border transfers, security controls, cookies, incident response, and
platform/API compliance. The MIT license grants software rights; it does not
grant rights to social platforms, user data, model weights, datasets, or brands.
