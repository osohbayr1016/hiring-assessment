import {mkdirSync, rmSync, existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {initializeDemoDatabase} from '../src/shared/demoDb.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const dir=resolve(root,'.data');
const file=resolve(dir,'assessment.sqlite');
if(process.argv.includes('--reset'))rmSync(dir,{recursive:true,force:true});
mkdirSync(dir,{recursive:true});
if(existsSync(file))console.log(`Already initialized: ${file} (use npm run reset for fresh data)`);
else{initializeDemoDatabase(file);console.log(`Created local-only assessment DB: ${file}`)}
