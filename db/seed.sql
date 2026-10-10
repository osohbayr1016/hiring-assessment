INSERT INTO users(id,name,role) VALUES
 ('u_admin','Саран (Admin)','admin'),('u_pm','Тэмүүлэн (Manager)','manager'),
 ('u_eng','Номин (Engineer)','engineer'),('u_view','Болд (Viewer)','viewer'),
 ('u_out','Отгон (External)','engineer');
INSERT INTO projects(id,code,name,client,budget_mnt,start_date,due_date) VALUES
 ('p_tower','TWR-A','Скай Тауэр А блок','Sky Development',3200000000,'2026-08-01','2027-05-31'),
 ('p_school','SCH-B','Шинэ сургуулийн барилга','Education Group',1700000000,'2026-09-10','2027-08-20'),
 ('p_bridge','BRG-C','Тээврийн гүүрийн төсөл','Road Builder',850000000,'2026-07-15','2027-02-15');
INSERT INTO project_members(project_id,user_id) VALUES
 ('p_tower','u_admin'),('p_tower','u_pm'),('p_tower','u_eng'),('p_tower','u_view'),
 ('p_school','u_admin'),('p_school','u_pm'),('p_school','u_eng'),
 ('p_bridge','u_admin'),('p_bridge','u_out');
INSERT INTO tasks(id,project_id,title,status,priority,assigned_to,due_date,version,created_at,updated_at) VALUES
 ('t1','p_tower','B1 давхрын архитектурын зураг','in_progress','high','u_eng','2026-10-05',1,'2026-09-12T08:00:00Z','2026-10-01T08:00:00Z'),
 ('t2','p_tower','Эрчим хүчний тооцооны тайлан','done','high','u_eng','2026-09-25',1,'2026-09-10T08:00:00Z','2026-09-28T08:00:00Z'),
 ('t3','p_tower','Захиалагчийн урьдчилсан зөвшөөрөл','todo','medium','u_pm','2026-12-14',1,'2026-09-13T08:00:00Z','2026-09-13T08:00:00Z'),
 ('t4','p_tower','Revit model clash review','in_progress','high','u_eng','2026-11-15',1,'2026-09-13T08:00:00Z','2026-09-13T08:00:00Z'),
 ('t5','p_school','Сургуулийн талбайн зураг','todo','medium','u_eng','2026-10-06',1,'2026-09-20T08:00:00Z','2026-09-20T08:00:00Z'),
 ('t6','p_school','Материалын тоо хэмжээ','done','low','u_pm','2026-09-19',1,'2026-09-13T08:00:00Z','2026-09-18T08:00:00Z'),
 ('t7','p_bridge','Гүүрийн ачааллын судалгаа','in_progress','high','u_out','2026-10-08',1,'2026-09-13T08:00:00Z','2026-09-13T08:00:00Z');
INSERT INTO activity_log(project_id,entity_type,entity_id,action,actor_id,details_json,created_at) VALUES
 ('p_tower','task','t1','created','u_pm','{"title":"B1 давхрын архитектурын зураг"}','2026-09-12T08:00:00Z'),
 ('p_tower','task','t2','completed','u_eng','{"status":"done"}','2026-09-28T08:00:00Z');
