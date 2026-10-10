# Tech stack and engineering decisions (October 2026)

The goal is to measure **engineering ability**, not installation speed. This is a deliberately small, **dependency-free and offline-compatible** assessment. It is **not** a real production-ready ERP and must never be publicly hosted as a service.

## Current verified stack

- **Node.js 24 Active LTS** is the recommended local runtime. Node 22 LTS remains supported, and CI tests both releases. Node 26 Current is deliberately not required of candidates.
- **Modern ECMAScript modules** (`.mjs`) and Node's built-in `node:test` runner and `assert/strict`; deterministic public integration tests.
- **Native SQLite** via `node:sqlite`; no account, Docker, npm install or Cloudflare API needed. Data lives in a local SQLite file and can be reset. The Node 22 API may display an experimental warning.
- **Browser Fetch API**, native `<dialog>`, semantic HTML, responsive CSS, and no frontend build step. No external CDN or Google fonts.
- **OpenAPI 3.1** contract in `docs/openapi.json`, with starter-only `501` responses clearly marked.
- **GitHub Actions** CI matrix for Node 22 and 24 using supported official checkout/setup-node actions. Syntax, unit, integration and repeatable smoke checks.
- **Isolated smoke fixtures**: each test starts a new server with a temporary seeded SQLite database. `npm run smoke` never changes the candidate's working `.data/` file.
- **Baseline security**: server refuses non-loopback bindings, has no real credentials, provides no remote auth, sets no-store/CSP/nosniff/frame/referrer security headers and per-request IDs. `X-Demo-User` is purposely **not authentication**.

## Why not install React + Vite + Hono in this starter?

React 19, Vite, Hono and the official Cloudflare Vite plugin are all relevant to the team's future production architecture. However, migrating the **assessment** to those packages would add dependency installation, more tooling and account/runtime differences, obscuring backend correctness and Git skills. This starter can be cloned and run offline in a few commands. The **architecture proposal task** specifically asks candidates to design a concrete migration to **React + Hono + Cloudflare Workers/D1**, including cost/limits, schema, and rollout.

This is an assessment design trade-off rather than a claim that vanilla JS is better than React. Interviewers should keep the same technical baseline for all candidates and not change dependencies mid-round.

## Verification

```bash
node --version             # recommended 24.x, also supports 22.13+
npm run setup              # creates only .data/assessment.sqlite
npm run verify             # all public checks and isolated smoke
npm run smoke              # safe to repeat; fresh ephemeral DB per run
npm run dev                # localhost:3333
```

## Intentional failure cases

Two pre-existing functional defects and unimplemented Change Request endpoints are **part of the assessment**. Do not fix them in the public starter or add public tests that reveal their exact causes. Interviewers must use private hidden tests to distinguish intentionally broken behavior from a broken development setup. Public CI is supposed to be green on the baseline.

## Git conflict baseline correction

The original `exercise/report-planning` branch was merged into an earlier public `main`, which invalidated the old conflict drill. Version 1.1 restores only the *assessment's base report-column metadata*, without deleting Git history, and moves the exercise to fresh `exercise-v2/report-owner` and `exercise-v2/report-planning` branches. Always use `docs/MERGE_EXERCISE.md` and the interviewer-provided baseline SHA.
