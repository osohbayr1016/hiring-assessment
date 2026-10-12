# MGL ERP Engineering Lab

> **Interview-only, local-only application.** Synthetic data. No relation to any MGL production account or live API.

This is a small **working ERP / internal project-management application** for a real-world engineering assessment. It is intentionally an imperfect but usable system: your job is to understand the current codebase, find and fix defects, handle a Git merge conflict, and implement a new feature safely.

![Status](https://img.shields.io/badge/environment-local--only-blue) ![Node](https://img.shields.io/badge/Node-22%2B-green)

## Run (recommended Node 24 Active LTS; supported Node 22.13+, Git; no npm install necessary)

```bash
npm run setup
npm run dev
# Open http://127.0.0.1:3333
```

`npm run verify` runs syntax, public unit/integration and local HTTP smoke checks. **Smoke uses a temporary seeded database and never modifies your `.data/`**, so it is safe to repeat. `npm run reset` restores your own local app data. Node may print an experimental `node:sqlite` warning; this is expected on Node 22. Only the `127.0.0.1` loopback interface is used.

See [tech stack and decisions](docs/TECH_STACK.md) and [OpenAPI 3.1 contract](docs/openapi.json). The intentionally incomplete feature and two planted defects are still part of the challenge.

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

Two feature branches are available in the public starter repository: `exercise-v2/report-owner` and `exercise-v2/report-planning`. See `docs/MERGE_EXERCISE.md`. These are local refs if you clone the bundled repository; if you receive a GitHub URL, fetch the branches using `git fetch origin`.

## Quick troubleshooting

- Node version below 22.13: update Node.
- Port occupied: `PORT=3334 npm run dev`.
- Seed already applied: use `npm run reset` (destroys **only `.data/`**).
- Missing branch refs: `git branch -a`; contact the interviewer if the remote branches are not visible.
- No project visible: switch the demo identity in the header.
- `http://localhost:3333` resolves elsewhere: explicitly use `http://127.0.0.1:3333`.

## Security

`X-Demo-User` is a **local-only fake identity selector**, not authentication. Do not use this pattern in a real product. No auth provider, third-party API, cloud database, credentials, or production URL is configured. See [SECURITY.md](SECURITY.md).

## Work evidence and non-GitHub evaluation

Before submitting, review [Hiring Playbook](docs/HIRING_PLAYBOOK.md), [Evidence Protocol](docs/EVIDENCE_PROTOCOL.md), and [additional live scenarios](docs/LIVE_SCENARIOS.md). Optional local-only manifest: `npm run evidence -- --run-checks` (saved to ignored `.data/candidate-evidence.json`). This collects only bounded Git/test metadata at candidate request; it does not monitor screens, typing or AI tools. Interviewer scores, private records and hidden tests are **not** in this public repository.
