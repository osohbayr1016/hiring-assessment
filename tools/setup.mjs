import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const file = resolve(root, '.data', 'assessment.sqlite');
if (process.argv.includes('--reset')) rmSync(resolve(root,'.data'), {recursive:true,force:true});
mkdirSync(dirname(file), {recursive:true});
if(existsSync(file)) { console.log('Already initialized: '+file+' (use npm run reset for fresh data)');process.exit(0); }
const db = new DatabaseSync(file); db.exec(readFileSync(resolve(root,'db/schema.sql'),'utf8'));
db.exec(readFileSync(resolve(root,'db/seed.sql'),'utf8'));
db.close(); console.log('Created local-only assessment DB: '+file);
