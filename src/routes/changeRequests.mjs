import {json} from '../shared/http.mjs';
// CANDIDATE FEATURE (TASK F1): implement POST /api/change-requests, GET /api/change-requests,
// POST /api/change-requests/:id/decision and GET /api/change-requests/:id/history.
// Reuse projectAccess and requireEditor; do not trust project/user IDs from the browser.
// Approval workflow, immutability of finalized decisions, version checking, and atomic audit
// are required in TASK.md. This placeholder deliberately returns 501.
export async function changeRequestApi(req,res,db,path){
  if(!path.startsWith('/api/change-requests'))return false;
  return json(res,501,{error:'FEATURE_NOT_IMPLEMENTED',hint:'See TASK.md — Change Request workflow'});
}
