import {httpError} from './http.mjs';
// Intentionally local assessment auth simulator. Never use identity headers in production.
export function identity(req,db){
 const id=req.headers['x-demo-user']||'u_pm';
 const user=db.prepare('SELECT * FROM users WHERE id=?').get(id);
 if(!user)throw httpError(401,'Unknown demo identity');return user;
}
export function projectAccess(db,user,projectId){
 const project=db.prepare('SELECT * FROM projects WHERE id=?').get(projectId);
 if(!project)throw httpError(404,'Project not found');
 if(user.role==='admin')return project;
 if(!db.prepare('SELECT 1 FROM project_members WHERE user_id=? AND project_id=?').get(user.id,projectId))throw httpError(404,'Project not found');
 return project;
}
export function requireEditor(user){if(!['manager','engineer','admin'].includes(user.role))throw httpError(403,'Write permission required');}
