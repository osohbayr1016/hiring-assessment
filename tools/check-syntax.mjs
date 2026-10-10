import {readdirSync} from 'node:fs';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const roots=['src','web','tools','tests'];
let checked=0;
function inspect(dir){
  for(const entry of readdirSync(dir,{withFileTypes:true})){
    const path=join(dir,entry.name);
    if(entry.isDirectory())inspect(path);
    else if(/\.(mjs|js)$/.test(entry.name)){
      const result=spawnSync(process.execPath,['--check',path],{encoding:'utf8'});
      if(result.status!==0){process.stderr.write(result.stderr||`Syntax check failed: ${path}\n`);process.exitCode=1}
      checked++;
    }
  }
}
for(const root of roots)inspect(root);
if(!process.exitCode)console.log(`PASS: syntax verified for ${checked} JavaScript modules`);
