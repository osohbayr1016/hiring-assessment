# SECURITY — Read Before Sharing

- **This code is for assessment only**, not suitable for public deployment. `X-Demo-User` is intentionally fake authentication; any local caller can select a demo user.
- HTTP server binds to `127.0.0.1` by default. Do not set `HOST=0.0.0.0` or deploy to a cloud host.
- No real employees, projects, contracts, credentials, Google Drive, Cloudflare credentials or production APIs are included.
- Database is `.data/assessment.sqlite` (gitignored). Reset it with `npm run reset`.
- Use separate private GitHub assessment repositories or isolated candidate forks. Do not reuse actual MGL ERP private credentials or invite candidates to production.
- Candidate PRs must be reviewed and assessed only; do not deploy directly to real systems.
- Do not put the interviewer's evaluator/hidden tests in any branch that candidates can read.

## Runtime hardening (assessment v1.1)

This local app rejects external listening addresses, returns a request ID for diagnostics, and attaches a restrictive browser CSP, frame denial and no-store headers. The `LAB_DB_PATH` override is for temporary **local test databases only**; it is not a network integration. This is **not a substitute for real production identity, security audit, or risk review**.
