# Git Merge Exercise — Parallel Reporting Changes

Two developers independently improved the internal ERP's report column metadata. Their features are approved separately:

- `exercise/report-owner` adds an **Owner** column to the report.
- `exercise/report-planning` adds a **Due Soon** column to the report.

Both edit `src/domain/reportColumns.mjs` starting from the same baseline. Your task is to merge both approved changes into your candidate branch, resolve any Git conflict, and preserve the original columns and both new columns without duplicates.

Commands after creating your `candidate/<id>` branch from `main` (with the public starter set as `upstream`):

```bash
git fetch upstream
git merge --no-ff upstream/exercise/report-owner
# then
git merge --no-ff upstream/exercise/report-planning
# Resolve conflict manually, run tests, commit.
```

For the public starter clone, `upstream` refers to the original public repository. If your remotes differ, run `git remote -v` and adjust the remote name. For an offline local bundle, merge the local `exercise/...` refs.

Your final `reportColumnKeys()` should include at least the original `project`, `open`, `done` and the new `owner`, `dueSoon` keys, each exactly once. Preserve label names and ordering as sensibly as possible. **Do not `git merge -s ours`, `--ours`, or `--theirs` the whole file**, because that can silently discard a feature.

In `DECISIONS.md` write:
- Which files conflicted?
- What did each branch introduce?
- How did you verify both changes survived?

This exercise exists to evaluate how you work with concurrent changes, not how fast you type Git commands.
