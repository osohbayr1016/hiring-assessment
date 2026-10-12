# MGL Engineering Hiring Playbook — Public Candidate Guide

**Role:** software engineer / technical partner for construction and internal management systems. This public document states the assessment process and visible criteria. Reviewers must keep scoring, answer keys, confidential candidate records, and hidden tests OFF this repository.

## Evidence, not hours of surveillance

The process evaluates **outcomes and explanations**, not keyboard activity, continuous screen recording, microphone, token usage, exact number of commits, or which AI tool was used. All applicants receive the same starter commit, published task, timebox, and reasonable-accommodation route. Candidate evidence is self-reported, and independently verified by the reviewer in the private submission.

## Four separate assessment stations

| Station | Format | What it measures | Evidence |
|---|---|---|---|
| 1 — Repository and bug hunt | Individual 3–4h assessment | debugging, test design, backend safety | private PR, regression tests, `DECISIONS.md` |
| 2 — Git collaboration | merge exercise | resolving actual conflict, preserving both features | git log / diff, merge rationale |
| 3 — Live change and paired review | 30–40m live call | understand own code, collaborate, troubleshoot | reviewer notes; same difficulty prompts |
| 4 — Product and architecture | 20–30m structured discussion | business discovery, automation, system evolution | `ARCHITECTURE_PROPOSAL.md`, oral trade-offs |

**Optional, standardized exercises:** 15m architecture diagram; 10m explaining a production incident response; 10m product discovery role-play. All finalists receive the same exercise, time, and question order; do not add secret extra requirements based on candidate background.

## Day-by-day workflow

- **Day 0:** interviewer verifies Node 22/24 setup, CI, exercise branches, seed reset and docs; freezes a starter SHA; informs candidates of the expected total workload and permitted tools.
- **Day 1:** uniform 15-minute screening for the applicants; shortlist with a pre-defined rubric; assign each finalist the exact same SHA.
- **Day 2:** supervised session or equal 48-hour take-home window (choose one mode for all); candidate delivers to their own *private non-fork repository*; reviewer independently runs tests and records findings.
- **Final:** two independent reviewers score first, discuss disagreements after recording their evidence; retain 'insufficient evidence' when needed. No automatic employment decision from test points.

## Candidate submission artifacts

1. PR URL in candidate's separate private repo, exact baseline SHA, final SHA, and test CI URL.
2. `DECISIONS.md`: root cause and reproductions for found bugs, changed code paths, assumptions, known risks and limits; honest AI-assistance disclosure (tool/method optional, not token count).
3. `ARCHITECTURE_PROPOSAL.md`: current architecture map, priority improvements, design trade-offs, a construction workflow automation with idempotency/failure recovery.
4. Optional 1–2 minute product demo (screen share or brief recording only with consent). Screenshots and written walkthrough accepted instead.
5. `npm run evidence -- --run-checks` — locally generated `.data/candidate-evidence.json` that may be attached to the **private** submission. It is a convenience manifest, not a surveillance tool or authoritative proof.

## Review dimensions (visible)

- Correctness, data isolation and security; ability to reproduce and fix a defect.
- Regression tests, concurrency design and rollback readiness.
- End-to-end usability and careful product decisions.
- Git merge quality and clear PR descriptions.
- Engineering trade-offs (modular monolith vs premature microservices, migration strategy, caching and audit).
- Collaboration: asks clarifying questions, communicates uncertainty, can accept feedback.

**Fairness:** give identical prompts and grading anchors to all finalists; evaluate demonstrated job-relevant competence. Do not score gender, age, family status, nationality, ethnicity, or similar personal characteristics. Candidates may request accommodation or an alternative demonstration. The assessment should not produce deployable free work for MGL.

## Data boundaries

All names, contact details, evaluation notes, compensation, interview recordings, private PRs, reviewer scorecards and hidden tests belong in a private HR workspace. Use anonymous candidate IDs in exports. Tell applicants what is collected, who can review it, how long it will be held, and how deletion requests are handled. Stop collecting data when not needed. No public GitHub issue, Actions artifact, or PR comment should contain candidate identity or private evaluation evidence.
