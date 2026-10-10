export function json(res,status,data){res.writeHead(status, {'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(data));}
export async function bodyJson(req){
  let data='';for await(const chunk of req){data+=chunk;if(data.length>100_000){const e=new Error('Payload too large');e.status=413;throw e;}}
  try{return JSON.parse(data||'{}')}catch{const e=new Error('Invalid JSON');e.status=400;throw e;}
}
export function httpError(status,message){const e=new Error(message);e.status=status;return e;}
