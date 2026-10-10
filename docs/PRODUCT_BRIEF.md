# Product brief — mini Construction ERP

The fictional organization builds three projects: a tower, a school and a bridge. In the initial release, project members manage tasks and a lightweight progress dashboard. The roadmap adds change requests: engineers raise a design/site issue, a manager reviews it, and the system records an immutable decision trail. Production security and customer data are deliberately absent.

## Roles

- **Admin**: cross-project administrative visibility; cannot approve a change request authored by themself.
- **Manager**: project member who can approve/reject requests submitted by other people on the same project.
- **Engineer**: create issues, update eligible tasks and browse their own projects.
- **Viewer**: read projects, tasks and change requests they belong to; no writes.

Every REST endpoint must enforce project scope; hiding a button is not authorization. Simple polling is enough for the assessment; no websockets or AI integration is required.

## Non-goals

Do not implement a billing system, real payroll, construction norm compliance, Autodesk login, Revit syncing, Google Drive or complex reporting. Propose them only when the business case and rollout risks make sense.

## Acceptance demonstration

Select Engineer → create an issue → switch to Manager → decide and provide note → inspect history → try a forbidden action with Viewer or a different-project user. Include a test that catches a previously observed defect.
