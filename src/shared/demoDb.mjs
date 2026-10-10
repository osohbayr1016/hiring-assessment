/** Local-only deterministic fixture. Never connects to any cloud service. */
import {DatabaseSync} from 'node:sqlite';
import {readFileSync, mkdirSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
export function initializeDemoDatabase(file){
  mkdirSync(dirname(file),{recursive:true});
  const db=new DatabaseSync(file);
  try{
    db.exec('PRAGMA foreign_keys=ON;');
    db.exec(readFileSync(resolve(root,'db/schema.sql'),'utf8'));
    db.exec(readFileSync(resolve(root,'db/seed.sql'),'utf8'));
  }finally{db.close()}
}
