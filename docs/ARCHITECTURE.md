# ERP Engineering Lab — Architecture

```text
Browser (vanilla JS; demo role switcher)
       │ JSON + X-Demo-User (fake identity, loopback only)
       ▼
Node HTTP server src/server.mjs
       ├── src/routes/erp.mjs  ──────┐
       │    ├── auth/project scope   │
       │    ├── task CRUD/status     │
       │    ├── project health       ├── SQLite DatabaseSync (.data/assessment.sqlite)
       │    └── activity history     │      users/projects/project_members
       └── src/routes/changeRequests.mjs ┘      tasks/change_requests/activity_log
            (candidate implementation)
```

**Local-only rationale:** This assessment must start immediately and be fully testable offline with Node 22, no Cloudflare account, no npm dependency install. It is a compact analog, **not a copy** of any MGL production code. Think about porting to Hono, D1 and React in your design response.

**Key abstractions:** `projectAccess` hides cross-project data existence with 404; `requireEditor` is demo role gating; `activity_log` records auditable state changes; `version` on tasks and change requests is reserved for optimistic concurrency control; `projectHealth` calculates user-visible metrics.

**Deliberate limitations:** Fake `X-Demo-User` header, single-process synchronous SQLite, no multi-tenant identity provider, no file uploads, no background tasks, no real notifications, no production observability. Never deploy publicly.
