// This small shared helper intentionally supports a Git merge exercise.
// Candidates will integrate two independently approved reporting changes.
export const PROJECT_REPORT_COLUMNS=[
  {key:'project',label:'Төсөл'},
  {key:'open',label:'Нээлттэй'},
  {key:'done',label:'Дууссан'},
];
export function reportColumnKeys(){return PROJECT_REPORT_COLUMNS.map(c=>c.key);}
