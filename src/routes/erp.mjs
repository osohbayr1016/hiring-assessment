import {randomUUID} from 'node:crypto';
import {projectHealth} from '../domain/projectHealth.mjs';
import {validTaskTitle,validStatus} from '../domain/statusRules.mjs';
import {identity,projectAccess,requireEditor} from '../shared/auth.mjs';
import {bodyJson,json,httpError} from '../shared/http.mjs';

export async function erpApi(req,res,db,path){
  const user=identity(req,db);
  if(path==='/api/me'&&req.method==='GET')return json(res,200,{user,users:db.prepare('SELECT id,name,role FROM users ORDER BY id').all()});
  if(path==='/api/projects'&&req.method==='GET'){
    const rows=user.role==='admin'?db.prepare('SELECT * FROM projects ORDER BY code').all():
      db.prepare('SELECT p.* FROM projects p INNER JOIN project_members pm ON pm.project_id=p.id WHERE pm.user_id=? ORDER BY p.code').all(user.id);
    return json(res,200,{projects:rows});
  }
  if(path==='/api/tasks'&&req.method==='GET'){
    const rows=user.role==='admin'?db.prepare('SELECT * FROM tasks ORDER BY due_date').all():
      db.prepare('SELECT t.* FROM tasks t INNER JOIN project_members pm ON t.project_id=pm.project_id WHERE pm.user_id=? ORDER BY t.due_date').all(user.id);
    return json(res,200,{tasks:rows});
  }
  if(path==='/api/tasks'&&req.method==='POST'){
    requireEditor(user);const b=await bodyJson(req);
    if(!validTaskTitle(b.title))throw httpError(400,'Title must contain 3–150 characters');
    if(!['low','medium','high'].includes(b.priority))throw httpError(400,'Invalid priority');
    if(typeof b.dueDate!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(b.dueDate))throw httpError(400,'Invalid due date');
    if(!b.projectId)throw httpError(400,'Project required');projectAccess(db,user,b.projectId);
    if(b.assignedTo&& !db.prepare('SELECT 1 FROM project_members WHERE project_id=? AND user_id=?').get(b.projectId,b.assignedTo))throw httpError(400,'Assignee must belong to project');
    const id='t_'+randomUUID().slice(0,8),now=new Date().toISOString();
    db.exec('BEGIN IMMEDIATE');try{
      db.prepare('INSERT INTO tasks(id,project_id,title,status,priority,assigned_to,due_date,created_at,updated_at) VALUES(?,?,?,\'todo\',?,?,?,?,?)')
        .run(id,b.projectId,b.title.trim(),b.priority,b.assignedTo||null,b.dueDate,now,now);
      db.prepare('INSERT INTO activity_log(project_id,entity_type,entity_id,action,actor_id,details_json,created_at) VALUES(?,?,?,?,?,?,?)')
        .run(b.projectId,'task',id,'created',user.id,JSON.stringify({title:b.title.trim()}),now);
      db.exec('COMMIT');
    }catch(e){db.exec('ROLLBACK');throw e;}
    return json(res,201,{task:db.prepare('SELECT * FROM tasks WHERE id=?').get(id)});
  }
  const status=path.match(/^\/api\/tasks\/([^/]+)\/status$/);
  if(status&&req.method==='PATCH'){
    requireEditor(user);const task=db.prepare('SELECT * FROM tasks WHERE id=?').get(status[1]);
    if(!task)throw httpError(404,'Task not found');projectAccess(db,user,task.project_id);
    const b=await bodyJson(req);
    if(!validStatus(b.status))throw httpError(400,'Invalid status');
    if(!Number.isInteger(b.expectedVersion)||b.expectedVersion<1)throw httpError(400,'expectedVersion required');
    // The dashboard may have been open on two devices: how should concurrent updates behave?
    const now=new Date().toISOString();db.exec('BEGIN IMMEDIATE');try{
      db.prepare('UPDATE tasks SET status=?, version=version+1, updated_at=? WHERE id=?').run(b.status,now,task.id);
      db.prepare('INSERT INTO activity_log(project_id,entity_type,entity_id,action,actor_id,details_json,created_at) VALUES(?,?,?,?,?,?,?)')
        .run(task.project_id,'task',task.id,'status_changed',user.id,JSON.stringify({from:task.status,to:b.status}),now);
      db.exec('COMMIT');
    }catch(e){db.exec('ROLLBACK');throw e;}
    return json(res,200,{task:db.prepare('SELECT * FROM tasks WHERE id=?').get(task.id)});
  }
  const activity=path.match(/^\/api\/projects\/([^/]+)\/activity$/);
  if(activity&&req.method==='GET'){
    projectAccess(db,user,activity[1]);
    const rows=db.prepare('SELECT al.*,u.name AS actor_name FROM activity_log al JOIN users u ON u.id=al.actor_id WHERE al.project_id=? ORDER BY al.id DESC LIMIT 80').all(activity[1]);
    return json(res,200,{activity:rows});
  }
  const health=path.match(/^\/api\/projects\/([^/]+)\/health$/);
  if(health&&req.method==='GET'){
    projectAccess(db,user,health[1]);
    const rows=db.prepare('SELECT status,due_date FROM tasks WHERE project_id=?').all(health[1]);
    return json(res,200,{projectId:health[1],...projectHealth(rows)});
  }
  return false;
}
