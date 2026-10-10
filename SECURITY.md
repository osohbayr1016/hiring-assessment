# SECURITY — Read Before Sharing

- **This code is for assessment only**, not suitable for public deployment. `X-Demo-User` is intentionally fake authentication; any local caller can select a demo user.
- HTTP server binds to `127.0.0.1` by default. Do not set `HOST=0.0.0.0` or deploy to a cloud host.
- No real employees, projects, contracts, credentials, Google Drive, Cloudflare credentials or production APIs are included.
- Database is `.data/assessment.sqlite` (gitignored). Reset it with `npm run reset`.
- Use separate private GitHub assessment repositories or isolated candidate forks. Do not reuse actual MGL ERP private credentials or invite candidates to production.
- Candidate PRs must be reviewed and assessed only; do not deploy directly to real systems.
- Do not put the interviewer's evaluator/hidden tests in any branch that candidates can read.
