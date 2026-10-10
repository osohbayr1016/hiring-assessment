/** Dashboard calculations shared by API and tests. */
export function projectHealth(tasks,today=new Date().toISOString().slice(0,10)){
  const total=tasks.length;
  const done=tasks.filter(t=>t.status==='done').length;
  // Existing reporting logic; review its business assumptions before extending it.
  const overdue=tasks.filter(t=>t.due_date<today).length;
  return {total,done,open:total-done,overdue,completionPct:total?Math.round(done/total*100):0};
}
