# Candidate Assessment — MGL ERP / Internal Management

**Timebox:** 3–4 hours of work, 48-hour hand-in window. **Language:** Mongolian or English, your choice. **AI tools:** Allowed, but you must be able to explain all delivered decisions and changes. **Goal:** a reliable vertical slice rather than a visually perfect demo.

## Task 0 — Understand the system (10 points)

In `DECISIONS.md` explain how requests flow from browser UI → HTTP server → route → SQLite → activity history. Identify at least 2 codebase risks and state what you would verify first before deploying.

## Task 1 — Maintenance / bug hunt (20 points)

At least **two functional flaws** are intentionally present in the existing ERP. The app does run, and existing public tests pass. Some behaviors become wrong in edge cases. Find and fix as many as you can without rewriting the whole application. Add regression tests that **fail before** your fix and pass after it. Explain the root cause, impact, and fix in `DECISIONS.md`.

Review tasks and dashboard data carefully, including stale screens and data changes from two browsers. Not every code comment indicates a bug; demonstrate any defect with evidence rather than guessing.

## Task 2 — Build Change Request approval workflow (30 points)

Implement a small construction change-request feature using the existing `change_requests` schema and API placeholder.

**Required endpoints** (document all differences):

- `POST /api/change-requests`: authenticated demo `engineer`, `manager`, or `admin` creates a change request for a project they can access; title 3–150 chars, description 10–2000 chars, safe default `status='submitted'`.
- `GET /api/change-requests?projectId=...`: list only requests from projects the current user can access. Viewer may read requests only for their project. `projectId` must be a valid authorized project if provided.
- `POST /api/change-requests/:id/decision`: `manager` or `admin` only, body `{ "action": "approve" | "reject", "expectedVersion": integer, "note": string }`. `manager` must belong to the request's project. Self-approval is forbidden, even for admins. Reject requires a nonblank reason. May decide only `submitted` requests. `expectedVersion` is optimistic concurrency control; stale writes return HTTP 409.
- `GET /api/change-requests/:id/history`: project-scoped audit events for that specific request, ordered oldest first.

**Persistence requirements:** make the status transition, version increment, reviewer attribution, and audit entry atomic. A failed/stale decision must **not** write an approval audit event. Prevent double approval and unauthorized cross-project data reads/writes. Use parameterized SQL. Include meaningful status codes (400, 403, 404, 409). Do not accept `requested_by` or `reviewed_by` from the frontend.

**UI:** provide an accessible way to see and create requests, and for eligible managers to approve/reject. Loading, success, and error feedback required; design may reuse current styles. Prioritize backend correctness if time runs out.

## Task 3 — Git conflict resolution (15 points)

Follow [docs/MERGE_EXERCISE.md](docs/MERGE_EXERCISE.md). Include both features without discarding either approved change. Show the resulting commit history and briefly justify your merge resolution.

## Task 4 — System design / innovation review (15 points)

In `ARCHITECTURE_PROPOSAL.md` (max 2 pages):
1. Draw a textual architecture diagram for MVP and next 12 months.
2. Give **3 prioritized improvements** in reliability, database design, authorization, caching/real-time, or automation. For each: impact, complexity, risk, test/rollout approach.
3. Propose one valuable construction workflow automation (RFI, document approval, deadline alerts, Revit change notice, etc.). Explain its trigger, business rules, side effects, audit, retries and idempotency.
4. Describe trade-offs of moving the mini-app to MGL's **React + Hono + Cloudflare Workers/D1** stack (including Cloudflare runtime constraints). Avoid proposing microservices or queues solely for impressiveness.

## Task 5 — Tests, maintainability, PR quality (10 points)

Run `npm test` and `npm run check`; add tests for any new business logic. Write clear migrations if schema changes. Include exact verification commands, known limitations and trade-offs in `DECISIONS.md`. Do not hardcode a solution that only works for seed IDs. Don't weaken existing assertions.

## Priorities if time runs out

1. No unauthorized access or unsafe write.
2. Correct version/concurrency and atomic history.
3. Working, tested API.
4. Frontend and UX.
5. Optional polish.

## Submission

- Open a PR into `main` from `candidate/<your-id>` in your **own private non-fork repository**; add the interviewer as collaborator. Do not open a public PR against the starter.
- Include `DECISIONS.md`, `ARCHITECTURE_PROPOSAL.md`, changed source/tests.
- Link evidence of tests, include screenshots if useful.
- Do not commit `.data`, passwords, keys, recorded personal data, or `node_modules`.
- In 30-minute defense, explain 1 code path, 1 bug, 1 design trade-off; be ready for a small live change.

**Fairness:** This is an assessment, not a production feature request. All candidates receive the same version and objective criteria. Make sure you use the assigned baseline commit. Public disclosure of your solution before all interviews have finished is discouraged. Work outside the 3–4h guideline provides no bonus.
