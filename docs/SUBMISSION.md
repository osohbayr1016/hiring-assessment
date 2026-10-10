# Candidate private submission guide

This template repository is public. **Do not open a PR with your answer here**: doing so reveals your answers and creates an unfair advantage for later candidates.

1. Clone the shared starter repository:
   ```bash
   git clone https://github.com/osohbayr1016/hiring-assessment.git
   cd hiring-assessment
   git remote rename origin upstream
   git checkout -b candidate/YOUR-ASSIGNED-ID
   ```
2. On your own GitHub account create a **new empty private repository** (do **not** click Fork; forks of public repositories are public).
3. Add your private repository as `origin`, and push `main` and your candidate branch when ready:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-PRIVATE-REPO.git
   git push -u origin main
   git push -u origin candidate/YOUR-ASSIGNED-ID
   ```
4. Follow [`MERGE_EXERCISE.md`](MERGE_EXERCISE.md) using the `upstream` remote and commit your resolution to your candidate branch.
5. Open a PR in **your private repository** from `candidate/YOUR-ASSIGNED-ID` into `main`.
6. Invite the interviewer GitHub account `osohbayr1016` to this private repo (Settings → Collaborators). Provide the PR URL to the recruiter.

If you cannot create a private GitHub repo, ask the interviewer for an alternate private ZIP/email delivery method. Use only synthetic data. No external deployment is required.

Before the trial, the interviewer should communicate the exact baseline commit SHA and the time limit. Keep `DECISIONS.md` and `ARCHITECTURE_PROPOSAL.md` short; explanatory evidence matters more than total code volume.
