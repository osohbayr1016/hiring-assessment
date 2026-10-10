import {createServer} from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {erpApi} from './routes/erp.mjs';
import {changeRequestApi} from './routes/changeRequests.mjs';
import {json} from './shared/http.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const dbPath=resolve(root,'.data/assessment.sqlite');
if(!existsSync(dbPath)){console.error('Run npm run setup first');process.exit(1);}
const db=new DatabaseSync(dbPath);db.exec('PRAGMA foreign_keys=ON;PRAGMA busy_timeout=2000;');
const assets={'/':'index.html','/app.js':'app.js','/styles.css':'styles.css'};
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const server=createServer(async(req,res)=>{
  try{
    const u=new URL(req.url,'http://localhost');const path=u.pathname;
    if(path==='/api/health')return json(res,200,{ok:true,service:'MGL ERP Engineering Lab'});
    if(path.startsWith('/api/')){
      if(await erpApi(req,res,db,path)!==false)return;
      if(await changeRequestApi(req,res,db,path)!==false)return;
      return json(res,404,{error:'Route not found'});
    }
    if(req.method!=='GET'||!assets[path])return json(res,404,{error:'Not found'});
    const f=resolve(root,'web',assets[path]);res.writeHead(200,{'content-type':mime[extname(f)],'cache-control':'no-cache','x-content-type-options':'nosniff'});return res.end(readFileSync(f));
  }catch(e){const status=e.status||500;if(status===500)console.error(e);return json(res,status,{error:status===500?'Internal server error':e.message});}
});
const port=Number(process.env.PORT||3333),host=process.env.HOST||'127.0.0.1';
server.listen(port,host,()=>console.log(`MGL ERP Lab http://${host}:${port}`));
function shutdown(){server.close(()=>{db.close();process.exit(0)});}
process.on('SIGTERM',shutdown);process.on('SIGINT',shutdown);
