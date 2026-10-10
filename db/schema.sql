PRAGMA foreign_keys=ON;
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin','manager','engineer','viewer'))
);
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  client TEXT NOT NULL,
  budget_mnt INTEGER NOT NULL DEFAULT 0,
  start_date TEXT NOT NULL,
  due_date TEXT NOT NULL
);
CREATE TABLE project_members (
  project_id TEXT NOT NULL REFERENCES projects(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  PRIMARY KEY (project_id,user_id)
);
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('todo','in_progress','done')),
  priority TEXT NOT NULL CHECK(priority IN ('low','medium','high')),
  assigned_to TEXT REFERENCES users(id),
  due_date TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX tasks_project_status_idx ON tasks(project_id, status);
CREATE INDEX tasks_due_idx ON tasks(due_date);
CREATE TABLE activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL REFERENCES projects(id),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  actor_id TEXT NOT NULL REFERENCES users(id),
  details_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);
CREATE INDEX activity_project_created_idx ON activity_log(project_id, created_at DESC);
-- Prepared for candidate extension; unimplemented business rules are part of the assignment.
CREATE TABLE change_requests (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('draft','submitted','approved','rejected')),
  requested_by TEXT NOT NULL REFERENCES users(id),
  reviewed_by TEXT REFERENCES users(id),
  review_note TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX change_requests_project_status_idx ON change_requests(project_id,status);
