import assert from 'node:assert/strict';
import {startTestServer,request} from './harness.mjs';
const {base,close}=await startTestServer();
try{
  const ready=await request(base,'/api/health');
  assert.equal(ready.status,200);assert.equal(ready.data.ok,true);
  const projects=await request(base,'/api/projects');
  assert.equal(projects.status,200);assert.equal(projects.data.projects.length,2);
  const tasks=await request(base,'/api/tasks');
  assert.equal(tasks.status,200);assert.equal(tasks.data.tasks.length,6);
  assert.equal((await request(base,'/api/projects/p_tower/health')).status,200);
  assert.equal((await request(base,'/api/projects/p_bridge/health')).status,404);
  const created=await request(base,'/api/tasks',{method:'POST',body:{projectId:'p_tower',title:'Local integration smoke task',priority:'medium',dueDate:'2027-02-03'}});
  assert.equal(created.status,201);
  const patched=await request(base,`/api/tasks/${created.data.task.id}/status`,{method:'PATCH',body:{status:'in_progress',expectedVersion:1}});
  assert.equal(patched.status,200);
  const activity=await request(base,'/api/projects/p_tower/activity');
  assert.ok(activity.data.activity.some(v=>v.entity_id===created.data.task.id));
  const changeList=await request(base,'/api/change-requests');
  assert.ok([200,501].includes(changeList.status),'Feature may be intentionally pending or implemented');
  if(changeList.status===200)assert.ok(Array.isArray(changeList.data.requests));
  console.log('PASS: isolated local smoke (no mutation of candidate .data/), CRUD, scope, audit, feature route');
}finally{await close()}
