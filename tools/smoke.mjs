import {spawn} from 'node:child_process';
const child=spawn(process.execPath,['src/server.mjs'],{stdio:['ignore','pipe','pipe'],env:{...process.env,PORT:'35691'}});
const base='http://127.0.0.1:35691';
async function req(path,options={}){let r=await fetch(base+path,{...options,headers:{'X-Demo-User':'u_pm',...(options.body?{'content-type':'application/json'}:{}),...(options.headers||{})}});return{status:r.status,data:await r.json()}};
let failures=[];
try{
  let connected=false;for(let i=0;i<30;i++){try{await fetch(base+'/api/health');connected=true;break;}catch{await new Promise(r=>setTimeout(r,100));}}
  if(!connected)throw Error('Server did not start');
  let a=await req('/api/projects');if(a.status!==200||a.data.projects.length!==2)throw Error('Project access failed');
  let t=await req('/api/tasks');if(t.status!==200||t.data.tasks.length!==6)throw Error('Task endpoint failed');
  let h=await req('/api/projects/p_tower/health');if(h.status!==200)throw Error('Project health failed');
  let cross=await req('/api/projects/p_bridge/health');if(cross.status!==404)throw Error('Cross-project access failed');
  let add=await req('/api/tasks',{method:'POST',body:JSON.stringify({projectId:'p_tower',title:'Local integration smoke task',priority:'medium',dueDate:'2027-02-03'})});
  if(add.status!==201)throw Error('Task create failed '+JSON.stringify(add));
  let upd=await req(`/api/tasks/${add.data.task.id}/status`,{method:'PATCH',body:JSON.stringify({status:'in_progress',expectedVersion:1})});if(upd.status!==200)throw Error('Task status update failed');
  let activity=await req('/api/projects/p_tower/activity');if(!activity.data.activity.find(v=>v.entity_id===add.data.task.id))throw Error('Audit missing');
  let todo=await req('/api/change-requests');if(todo.status!==501)throw Error('Placeholder endpoint incorrect');
  console.log('PASS: server boot, projects/tasks/health, access control, create/update, audit, pending feature');
}catch(e){failures.push(String(e));console.error('FAIL: '+e.message)}finally{child.kill('SIGTERM')}
if(failures.length)process.exitCode=1;
