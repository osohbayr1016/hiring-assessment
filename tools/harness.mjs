/** Deterministic, independent fixture per run. Does not touch .data/. */
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {initializeDemoDatabase} from '../src/shared/demoDb.mjs';

export async function startTestServer(){
  const dir=mkdtempSync(join(tmpdir(),'mgl-erp-assessment-'));
  const file=join(dir,'isolated.sqlite');
  initializeDemoDatabase(file);
  const child=spawn(process.execPath,['src/server.mjs'],{
    cwd:fileURLToPath(new URL('../',import.meta.url)),
    stdio:['ignore','pipe','pipe'],
    env:{...process.env,PORT:'0',HOST:'127.0.0.1',LAB_DB_PATH:file}
  });
  let stderr='';
  child.stderr.setEncoding('utf8');child.stderr.on('data',v=>{stderr+=v});
  let captured='';
  const base=await new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>reject(new Error('Server start timed out: '+stderr)),10_000);
    const stop=(err,value)=>{clearTimeout(timeout);child.stdout.off('data',onData);child.off('exit',onExit);err?reject(err):resolve(value)};
    const onExit=code=>stop(new Error(`Server exited ${code}: ${stderr}`));
    const onData=chunk=>{
      captured+=chunk.toString();
      const match=captured.match(/MGL ERP Lab (http:\/\/127\.0\.0\.1:\d+)/);
      if(match)stop(null,match[1]);
    };
    child.once('exit',onExit);child.stdout.on('data',onData);
  }).catch(err=>{child.kill('SIGTERM');rmSync(dir,{recursive:true,force:true});throw err});
  const close=async()=>{
    if(child.exitCode===null){
      const stopped=new Promise(resolve=>child.once('exit',resolve));
      child.kill('SIGTERM');
      await Promise.race([stopped,new Promise(resolve=>setTimeout(resolve,2000))]);
      if(child.exitCode===null)child.kill('SIGKILL');
    }
    rmSync(dir,{recursive:true,force:true});
  };
  return {base,close,stderr:()=>stderr};
}

export async function request(base,path,{actor='u_pm',method='GET',body,headers={}}={}){
  const res=await fetch(base+path,{method,headers:{'X-Demo-User':actor,...(body!==undefined?{'content-type':'application/json'}:{}),...headers},body:body===undefined?undefined:JSON.stringify(body)});
  return {status:res.status,data:await res.json(),headers:res.headers};
}
