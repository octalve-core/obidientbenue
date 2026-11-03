import 'server-only';
import {neon} from '@neondatabase/serverless';
import {getLGAs,getWards,getPollingUnits} from '@/lib/electoral';

export const PAGE_SIZE=40;
const categories=new Set(['Member','Volunteer','Interested','Other']);
export type AdminFilters={
  q:string; lga:string; ward:string; pu:string; category:string;
  from:string; to:string; page:number;
};
export type RegistrationRecord={
  id:string; reference:string; full_name:string; phone:string|null;
  category:string; method:string; assisted_by:string|null;
  lga_code:string; ward_code:string; pu_code:string; pu_name:string;
  consent_at:string; communication_consent:boolean; consent_version:string;
  potential_duplicate:boolean; created_at:string;
};
export function parseAdminFilters(p:URLSearchParams):AdminFilters{
  const q=(p.get('q')||'').trim(),lga=p.get('lga')||'',ward=p.get('ward')||'';
  const pu=p.get('pu')||'',category=p.get('category')||'';
  const from=p.get('from')||'',to=p.get('to')||'',pg=p.get('page')||'1';
  if(q.length>100)throw new Error('Search is too long.');
  if(lga&&(!/^\d{2}$/.test(lga)||!getLGAs().some(x=>x.code===lga)))throw new Error('Invalid local government.');
  if(ward&&(!lga||!/^\d{2}$/.test(ward)||!getWards(lga).some(x=>x.code===ward)))throw new Error('Invalid electoral ward.');
  if(pu&&(!ward||!/^07\/\d{2}\/\d{2}\/\d{3}$/.test(pu)||!getPollingUnits(lga,ward).some(x=>x.code===pu)))throw new Error('Invalid polling unit.');
  if(category&&!categories.has(category))throw new Error('Invalid category.');
  const start=toLagosIso(from),end=toLagosIso(to);
  if(start&&end&&start>end)throw new Error('End date must be after the start date.');
  const page=Number(pg);
  if(!/^[1-9]\d{0,5}$/.test(pg)||!Number.isSafeInteger(page))throw new Error('Invalid page number.');
  return {q,lga,ward,pu,category,from,to,page};
}
export function toLagosIso(value:string):string|null{
  if(!value)return null;
  if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))throw new Error('Choose a valid date and time.');
  // Benue State uses Africa/Lagos (UTC+01:00) year-round.
  const date=new Date(value+':00+01:00');
  if(Number.isNaN(date.valueOf())||date.toISOString().slice(0,16)!==new Date(Date.parse(value+':00+01:00')).toISOString().slice(0,16))throw new Error('Invalid date or time.');
  const local=new Date(date.getTime()+60*60*1000).toISOString().slice(0,16);
  if(local!==value)throw new Error('Invalid local date or time.');
  return date.toISOString();
}
export function serializeFilters(f:AdminFilters,includePage=true){
  const p=new URLSearchParams();
  for(const key of ['q','lga','ward','pu','category','from','to'] as const){
    if(f[key])p.set(key,f[key]);
  }
  if(includePage&&f.page>1)p.set('page',String(f.page));
  return p;
}
export const nameForLga=(code:string)=>getLGAs().find(x=>x.code===code)?.name||code;
export const nameForWard=(lga:string,ward:string)=>getWards(lga).find(x=>x.code===ward)?.name||ward;
export const nameForPu=(lga:string,ward:string,pu:string)=>getPollingUnits(lga,ward).find(x=>x.code===pu)?.name||pu;
export const displayLagosTime=(date:string)=>new Date(date).toLocaleString('en-GB',{timeZone:'Africa/Lagos',year:'numeric',month:'short',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false});
export function registrationSql(){
  if(!process.env.DATABASE_URL)throw new Error('Database not configured');
  return neon(process.env.DATABASE_URL);
}
export async function auditAdmin(email:string,action:string,reference:string|null=null){
  const sql=registrationSql();
  await sql\`INSERT INTO registration_admin_audit(actor_email,action,reference) VALUES (\${email},\${action},\${reference}::uuid)\`;
}
export async function loadRegistrationPage(f:AdminFilters){
 const sql=registrationSql();
 const start=toLagosIso(f.from),end=toLagosIso(f.to);
 const pattern='%'+f.q+'%';
 const stats=await sql\`
 SELECT COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE method='Assisted')::int AS assisted,
        COUNT(*) FILTER (WHERE phone IS NOT NULL AND phone<>'')::int AS contacted
 FROM community_registrations
 WHERE (\${f.lga}::text='' OR lga_code=\${f.lga})
   AND (\${f.ward}::text='' OR ward_code=\${f.ward})
   AND (\${f.pu}::text='' OR pu_code=\${f.pu})
   AND (\${f.category}::text='' OR category=\${f.category})
   AND (\${start}::timestamptz IS NULL OR created_at>=\${start}::timestamptz)
   AND (\${end}::timestamptz IS NULL OR created_at<=\${end}::timestamptz)
   AND (\${f.q}::text='' OR full_name ILIKE \${pattern} OR COALESCE(phone,'') ILIKE \${pattern} OR reference::text ILIKE \${pattern})
 \`;
 const rows=await sql\`
 SELECT id::text,reference::text,full_name,phone,category,method,assisted_by,
        lga_code,ward_code,pu_code,pu_name,created_at
 FROM community_registrations
 WHERE (\${f.lga}::text='' OR lga_code=\${f.lga})
   AND (\${f.ward}::text='' OR ward_code=\${f.ward})
   AND (\${f.pu}::text='' OR pu_code=\${f.pu})
   AND (\${f.category}::text='' OR category=\${f.category})
   AND (\${start}::timestamptz IS NULL OR created_at>=\${start}::timestamptz)
   AND (\${end}::timestamptz IS NULL OR created_at<=\${end}::timestamptz)
   AND (\${f.q}::text='' OR full_name ILIKE \${pattern} OR COALESCE(phone,'') ILIKE \${pattern} OR reference::text ILIKE \${pattern})
 ORDER BY created_at DESC,id DESC
 LIMIT \${PAGE_SIZE} OFFSET \${(f.page-1)*PAGE_SIZE}\`;
 const totalAll=await sql\`SELECT COUNT(*)::int AS total FROM community_registrations\`;
 return {rows:rows as RegistrationRecord[],total:Number(stats[0]?.total||0),
         assisted:Number(stats[0]?.assisted||0),contacted:Number(stats[0]?.contacted||0),
         totalAll:Number(totalAll[0]?.total||0)};
}
export async function getRegistrationDetail(reference:string){
 if(!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(reference))return null;
 const sql=registrationSql();
 const rows=await sql\`
 SELECT id::text,reference::text,full_name,phone,category,method,assisted_by,
   lga_code,ward_code,pu_code,pu_name,consent_at,communication_consent,
   consent_version,potential_duplicate,created_at
 FROM community_registrations WHERE reference=\${reference}::uuid LIMIT 1\`;
 return (rows[0] as RegistrationRecord|undefined)||null;
}
export async function getExportBatch(f:AdminFilters,cursor:string|null,limit=500){
 const sql=registrationSql();
 const start=toLagosIso(f.from),end=toLagosIso(f.to),pattern='%'+f.q+'%';
 const rows=await sql\`
 SELECT id::text,reference::text,full_name,phone,category,method,assisted_by,
  lga_code,ward_code,pu_code,pu_name,consent_at,communication_consent,
  consent_version,potential_duplicate,created_at
 FROM community_registrations
 WHERE (\${f.lga}::text='' OR lga_code=\${f.lga})
  AND (\${f.ward}::text='' OR ward_code=\${f.ward})
  AND (\${f.pu}::text='' OR pu_code=\${f.pu})
  AND (\${f.category}::text='' OR category=\${f.category})
  AND (\${start}::timestamptz IS NULL OR created_at>=\${start}::timestamptz)
  AND (\${end}::timestamptz IS NULL OR created_at<=\${end}::timestamptz)
  AND (\${f.q}::text='' OR full_name ILIKE \${pattern} OR COALESCE(phone,'') ILIKE \${pattern} OR reference::text ILIKE \${pattern})
  AND (\${cursor}::bigint IS NULL OR id<\${cursor}::bigint)
 ORDER BY id DESC LIMIT \${limit}\`;
 return rows as RegistrationRecord[];
}
export function csvCell(value:unknown,forceText=false){
  let text=String(value??'').replace(/\u0000/g,'');
  if(forceText||/^[\s]*[=+\-@＝＋－＠]/u.test(text))text="'"+text;
  return '"'+text.replace(/"/g,'""')+'"';
}
export const CSV_HEADERS=['Reference','Submitted (WAT)','Full name','Phone','Category','Registration method','Assisted by','LGA','LGA code','Ward','Ward code','Polling unit','Polling unit code','Consent recorded (WAT)','Optional updates consent','Consent version','Possible duplicate'];
export function csvRecord(row:RegistrationRecord){
  const data=[
   row.reference,displayLagosTime(row.created_at),row.full_name,row.phone||'',row.category,
   row.method,row.assisted_by||'',nameForLga(row.lga_code),row.lga_code,
   nameForWard(row.lga_code,row.ward_code),row.ward_code,row.pu_name,row.pu_code,
   displayLagosTime(row.consent_at),row.communication_consent?'Yes':'No',
   row.consent_version,row.potential_duplicate?'Review possible duplicate':'No'
  ];
  return data.map((v,i)=>csvCell(v,[3,8,10,12].includes(i))).join(',')+'\r\n';
}
