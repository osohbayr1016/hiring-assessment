import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const spec=JSON.parse(readFileSync(new URL('../docs/openapi.json',import.meta.url),'utf8'));
test('OpenAPI 3.1 enumerates all public paths',()=>{
  assert.equal(spec.openapi,'3.1.0');
  for(const path of ['/api/health','/api/me','/api/projects','/api/tasks',
    '/api/tasks/{id}/status','/api/projects/{id}/health',
    '/api/projects/{id}/activity','/api/change-requests',
    '/api/change-requests/{id}/decision','/api/change-requests/{id}/history']){
    assert.ok(spec.paths[path],`Missing contract path ${path}`);
  }
  for(const operation of [spec.paths['/api/change-requests'].post,spec.paths['/api/change-requests/{id}/decision'].post]){
    assert.match(operation.description,/501/);
  }
});
