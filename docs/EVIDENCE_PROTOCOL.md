# Candidate Evidence Protocol (no employee monitoring)

## Capture on request

Run `npm run evidence -- --run-checks` from a local candidate clone. It creates **`.data/candidate-evidence.json`**, excluded by `.gitignore`. For comparison from an assigned starter commit use `npm run evidence -- --base <SHA> --run-checks`. A generated manifest contains only branch/head, a bounded list of commit hashes + subjects, changed file paths, and two local check outcomes. It does **not** capture keystrokes, screenshots, browser history, process lists, personal environment variables, or Git remote URLs. It sends nothing across the network.

Attach it only to a **private** submission. Treat this as self-reported, tamperable data — the reviewer checks real Git commits/PR and CI independently. The `collectedAt` timestamp is not the actual time a candidate began coding, and commit counts are not productivity scores.

## Human-observed signals beyond GitHub

During the live defense the reviewer records: task understanding, concrete reproduced bug, request/response tracing, permission bypass reasoning, live edge-case changes, rollback and migration plan, product clarification questions, collaboration and communication. Each record needs an evidence summary, reviewer ID and timestamp; don't rate personality, eye contact, or typing speed. If a candidate declines recording, use typed observations with consent.

## Reviewer storage

Use the separately delivered **MGL Private Hiring Review Desk** (not part of this public repo). It stores anonymized candidate IDs, stages, evidence links, ratings and decisions on interviewer's machine. The dashboard is not deployed to this public repository and does not automatically access candidate accounts. See local-only instructions included in the private kit.
