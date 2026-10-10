export const TASK_STATUSES=['todo','in_progress','done'];
export function validTaskTitle(title){return typeof title==='string'&&title.trim().length>=3&&title.trim().length<=150;}
export function validStatus(status){return TASK_STATUSES.includes(status);}
