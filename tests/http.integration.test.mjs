import {test} from 'node:test';
import assert from 'node:assert/strict';
import {startTestServer,request} from '../tools/harness.mjs';

test('HTTP startup, API metadata, secure local-only static assets',async t=>{
  const {base,close}=await startTestServer();t.after(close);
  const health=await request(base,'/api/health');
  assert.equal(health.status,200);assert.equal(health.data.ok,true);
  assert.match(health.headers.get('content-security-policy'),/script-src 'self'/);
  assert.equal(health.headers.get('x-frame-options'),'DENY');
  assert.ok(health.headers.get('x-request-id'));
  const page=await fetch(base+'/');assert.equal(page.status,200);assert.match(await page.text(),/Engineering Lab ERP/);
  const script=await fetch(base+'/app.js');assert.equal(script.status,200);
  assert.match(script.headers.get('content-type'),/javascript/);
  assert.equal((await request(base,'/api/not-real')).status,404);
});

test('project scoped access and permitted synthetic task CRUD',async t=>{
  const {base,close}=await startTestServer();t.after(close);
  const pm=await request(base,'/api/projects');
  assert.deepEqual(pm.data.projects.map(v=>v.id).sort(),['p_school','p_tower']);
  assert.equal((await request(base,'/api/projects/p_bridge/health')).status,404);
  assert.equal((await request(base,'/api/projects/p_tower/health',{actor:'u_out'})).status,404);
  const forbidden=await request(base,'/api/tasks',{actor:'u_view',method:'POST',body:{projectId:'p_tower',title:'Can I edit?',priority:'low',dueDate:'2027-02-03'}});
  assert.equal(forbidden.status,403);
  const created=await request(base,'/api/tasks',{actor:'u_eng',method:'POST',body:{projectId:'p_tower',title:'Test plumbing drawings',priority:'high',dueDate:'2027-02-03'}});
  assert.equal(created.status,201);
  const updated=await request(base,`/api/tasks/${created.data.task.id}/status`,{actor:'u_eng',method:'PATCH',body:{status:'in_progress',expectedVersion:1}});
  assert.equal(updated.status,200);assert.equal(updated.data.task.version,2);
  const activity=await request(base,'/api/projects/p_tower/activity');
  assert.ok(activity.data.activity.some(v=>v.entity_id===created.data.task.id&&v.action==='status_changed'));
  assert.equal((await request(base,'/api/change-requests')).status,501);
});

test('bad inputs and unauthorized project assignment are rejected',async t=>{
  const {base,close}=await startTestServer();t.after(close);
  const baseTask={projectId:'p_tower',title:'Testing task',priority:'high',dueDate:'2027-02-03'};
  assert.equal((await request(base,'/api/tasks',{method:'POST',body:{...baseTask,title:'x'}})).status,400);
  assert.equal((await request(base,'/api/tasks',{method:'POST',body:{...baseTask,assignedTo:'u_out'}})).status,400);
  assert.equal((await request(base,'/api/tasks',{actor:'u_out',method:'POST',body:baseTask})).status,404);
  assert.equal((await request(base,'/api/tasks',{actor:'does-not-exist'})).status,401);
  const res=await fetch(base+'/api/tasks',{method:'POST',headers:{'X-Demo-User':'u_pm','Content-Type':'application/json'},body:'{not-json'});
  assert.equal(res.status,400);
  for(const raw of ['null', '[1,2]', '"not-an-object"']){
    const r=await fetch(base+'/api/tasks',{method:'POST',headers:{'X-Demo-User':'u_pm','content-type':'application/json'},body:raw});
    assert.equal(r.status,400,raw);
  }
});
