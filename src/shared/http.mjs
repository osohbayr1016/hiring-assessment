export function json(res,status,data){
  res.writeHead(status, {'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});
  res.end(JSON.stringify(data));
}
export function httpError(status,message){const e=new Error(message);e.status=status;return e;}
/** Strictly bounded JSON-object parser, shared by all demo write routes. */
export async function bodyJson(req){
  const chunks=[];let length=0;
  for await(const chunk of req){
    length+=chunk.length;
    if(length>100_000)throw httpError(413,'Payload too large');
    chunks.push(chunk);
  }
  let value;
  try{value=JSON.parse(Buffer.concat(chunks).toString('utf8')||'{}')}
  catch{throw httpError(400,'Invalid JSON')}
  if(value===null||typeof value!=='object'||Array.isArray(value))throw httpError(400,'Expected JSON object');
  return value;
}
