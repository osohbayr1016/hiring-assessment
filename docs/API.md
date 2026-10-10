# ERP Lab API Contract

Server: `http://127.0.0.1:3333`. For testing only, set `X-Demo-User: u_pm` etc. Account IDs are mock data.

| Verb | Endpoint | Input / Notes |
|---|---|---|
| GET | `/api/health` | Process health, unauthenticated |
| GET | `/api/me` | Demo user & available mock users |
| GET | `/api/projects` | Projects authorized for selected mock user |
| GET | `/api/tasks` | Authorized tasks, no pagination in starter |
| POST | `/api/tasks` | `{projectId,title,priority,dueDate,assignedTo?}` |
| PATCH | `/api/tasks/:id/status` | `{status:'todo'\|'in_progress'\|'done', expectedVersion:1}` |
| GET | `/api/projects/:id/health` | Project task counts and completion statistics |
| GET | `/api/projects/:id/activity` | Recent project audit events |
| GET | `/api/change-requests?projectId=...` | **Candidate TODO:** authorized list |
| POST | `/api/change-requests` | **Candidate TODO:** `{projectId,title,description}` |
| POST | `/api/change-requests/:id/decision` | **Candidate TODO:** `{action,expectedVersion,note}` |
| GET | `/api/change-requests/:id/history` | **Candidate TODO:** audit trail |

Status codes expected: 200/201 success; 400 malformed input; 403 role forbidden; 404 missing/not-visible project or issue; 409 stale/conflict; 501 reserved TODO endpoint in baseline. SQL must be parametrized and writes should have transaction boundaries where state and audit must remain consistent.

## Demo user matrix

| ID | Role | Projects |
|---|---|---|
| `u_admin` | admin | all |
| `u_pm` | manager | TWR-A, SCH-B |
| `u_eng` | engineer | TWR-A, SCH-B |
| `u_view` | viewer | TWR-A |
| `u_out` | engineer | BRG-C only |

No actual passwords/production identities exist. The role switcher is **not** production authentication.
