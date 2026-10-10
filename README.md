# MGL ERP Engineering Lab

> **Interview-only, local-only application.** Synthetic data. No relation to any MGL production account or live API.

This is a small **working ERP / internal project-management application** for a real-world engineering assessment. It is intentionally an imperfect but usable system: your job is to understand the current codebase, find and fix defects, handle a Git merge conflict, and implement a new feature safely.

![Status](https://img.shields.io/badge/environment-local--only-blue) ![Node](https://img.shields.io/badge/Node-22%2B-green)

## Run (Node 22.13+, Git; no npm install necessary)

```bash
npm run setup
npm run dev
# Open http://127.0.0.1:3333
```

`npm test` checks existing public regression tests. `npm run smoke` exercises local HTTP + SQLite and **adds one synthetic task**; run `npm run reset` to restore the original seed. Node may print an experimental `node:sqlite` warning; this is expected on Node 22. Only the `127.0.0.1` loopback interface is used.

## What exists now

- Project portfolio and health dashboard (3 mock projects)
- Local demo identity switcher (Admin / Manager / Engineer / Viewer / External)
- Task list, status updates, creation, filtering, project-scoped audit activity
- SQLite persistent seed data and public unit tests
- A prepared but incomplete Change Request subsystem

## Your assessment

Read **[TASK.md](TASK.md)** first, then **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** and **[docs/API.md](docs/API.md)**. Please do not edit the requirements or test runner to make tests pass.

**Timebox:** 3–4 hours of focused work; submission within 48 hours of receiving repository access. You do **not** need to implement everything beyond the required acceptance criteria. You may use AI coding tools, docs, web resources; disclose their use in `DECISIONS.md`.

Use a **separate private, non-fork GitHub repository** for your solution. Invite the hiring reviewer as a collaborator and open your PR in that private repository (not against this public starter). Do not publish your answers publicly during the process. See [Candidate submission guide](docs/SUBMISSION.md).

## Git conflict exercise

Two feature branches are available in the public starter repository: `exercise/report-owner` and `exercise/report-planning`. See `docs/MERGE_EXERCISE.md`. These are local refs if you clone the bundled repository; if you receive a GitHub URL, fetch the branches using `git fetch origin`.

## Quick troubleshooting

- Node version below 22.13: update Node.
- Port occupied: `PORT=3334 npm run dev`.
- Seed already applied: use `npm run reset` (destroys **only `.data/`**).
- Missing branch refs: `git branch -a`; contact the interviewer if the remote branches are not visible.
- No project visible: switch the demo identity in the header.
- `http://localhost:3333` resolves elsewhere: explicitly use `http://127.0.0.1:3333`.

## Security

`X-Demo-User` is a **local-only fake identity selector**, not authentication. Do not use this pattern in a real product. No auth provider, third-party API, cloud database, credentials, or production URL is configured. See [SECURITY.md](SECURITY.md).
