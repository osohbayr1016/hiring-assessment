import {test} from 'node:test';import assert from 'node:assert/strict';
import {validTaskTitle,validStatus} from '../src/domain/statusRules.mjs';
import {projectHealth} from '../src/domain/projectHealth.mjs';
import {reportColumnKeys} from '../src/domain/reportColumns.mjs';
test('task title boundaries',()=>{assert.equal(validTaskTitle('abc'),true);assert.equal(validTaskTitle(''),false);assert.equal(validTaskTitle('a'.repeat(151)),false);});
test('status values are explicit',()=>{assert.equal(validStatus('todo'),true);assert.equal(validStatus('done'),true);assert.equal(validStatus('archived'),false);});
test('project completion ratio',()=>{assert.equal(projectHealth([{status:'done',due_date:'2099-01-01'},{status:'todo',due_date:'2099-01-01'}],'2026-10-10').completionPct,50)});
test('report columns include existing KPIs',()=>{assert.deepEqual(reportColumnKeys(),['project','open','done'])});
