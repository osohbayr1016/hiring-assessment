import {createServer} from 'node:http';
import {randomUUID} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {erpApi} from './routes/erp.mjs';
import {changeRequestApi} from './routes/changeRequests.mjs';
import {json} from './shared/http.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
// LAB_DB_PATH exists solely for isolated local CI/integration tests.
const dbPath=process.env.LAB_DB_PATH||resolve(root,'.data/assessment.sqlite');
if(!existsSync(dbPath)){console.error('Run npm run setup first');process.exit(1)}
const host=process.env.HOST||'127.0.0.1';
if(!['127.0.0.1','::1','localhost'].includes(host)){
  console.error('Safety guard: assessment server must bind to loopback only.');
  process.exit(1);
}
const requestedPort=process.env.PORT===undefined?3333:Number(process.env.PORT);
if(!Number.isInteger(requestedPort)||requestedPort<0||requestedPort>65535){
  console.error('PORT must be an integer from 0 to 65535');process.exit(1);
}
const db=new DatabaseSync(dbPath);
db.exec('PRAGMA foreign_keys=ON;PRAGMA busy_timeout=2000;');
const assets={'/':'index.html','/app.js':'app.js','/styles.css':'styles.css'};
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const securityHeaders={
  'x-content-type-options':'nosniff',
  'x-frame-options':'DENY',
  'referrer-policy':'no-referrer',
  'permissions-policy':'camera=(), microphone=(), geolocation=()',
  'content-security-policy':"default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; font-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
  'cache-control':'no-store'
};
const server=createServer(async(req,res)=>{
  const requestId=randomUUID();
  for(const [key,value] of Object.entries(securityHeaders))res.setHeader(key,value);
  res.setHeader('x-request-id',requestId);
  try{
    const u=new URL(req.url,'http://127.0.0.1');const path=u.pathname;
    if(path==='/api/health'&&req.method==='GET'){
      db.prepare('SELECT 1 AS ready').get();
      return json(res,200,{ok:true,service:'MGL ERP Engineering Lab',apiVersion:'1.1',storage:'local-only'});
    }
    if(path.startsWith('/api/')){
      if(await erpApi(req,res,db,path)!==false)return;
      if(await changeRequestApi(req,res,db,path)!==false)return;
      return json(res,404,{error:'Route not found'});
    }
    if(req.method!=='GET'||!Object.hasOwn(assets,path))return json(res,404,{error:'Not found'});
    const file=resolve(root,'web',assets[path]);
    res.writeHead(200,{'content-type':mime[extname(file)]});
    return res.end(readFileSync(file));
  }catch(e){
    const status=Number.isInteger(e?.status)&&e.status>=400&&e.status<=599?e.status:500;
    if(status===500)console.error(JSON.stringify({level:'error',requestId,message:e?.message||'unknown'}));
    if(!res.headersSent)return json(res,status,{error:status===500?'Internal server error':e.message,requestId});
    res.destroy();
  }
});
server.requestTimeout=10_000;
server.headersTimeout=15_000;
server.listen(requestedPort,host,()=>console.log(`MGL ERP Lab http://${host}:${server.address().port}`));
function shutdown(){server.close(()=>{db.close();process.exit(0)});server.closeIdleConnections?.()}
process.on('SIGTERM',shutdown);process.on('SIGINT',shutdown);
