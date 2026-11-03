import {NextRequest,NextResponse} from 'next/server';
import {getAdminEmail} from '@/lib/admin-auth';
import {verifyAdminAction} from '@/lib/admin-write-origin';
import {auditAdmin,CSV_HEADERS,csvCell,csvRecord,getExportBatch,parseAdminFilters} from '@/lib/admin-records';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=60;

const respond=(message:string,status:number)=>NextResponse.json({message},{status,headers:{'Cache-Control':'private, no-store'}});

type ExportScope='all'|'filtered';
type RequestInput={scope:ExportScope;params:URLSearchParams;token:unknown};
const filterKeys=['q','lga','ward','pu','category','from','to'] as const;

async function parseExportRequest(req:NextRequest):Promise<RequestInput|null>{
 const contentType=req.headers.get('content-type')||'';
 const params=new URLSearchParams();
 if(contentType.includes('application/json')){
  const raw=await req.text();
  if(raw.length>16000)return null;
  const body=JSON.parse(raw) as unknown;
  if(!body||typeof body!=='object'||Array.isArray(body))return null;
  const {scope,filters}=body as {scope?:unknown;filters?:unknown};
  if(scope!=='filtered'&&scope!=='all')return null;
  if(scope==='filtered'){
   if(!filters||typeof filters!=='object'||Array.isArray(filters))return null;
   for(const key of filterKeys){
    const value=(filters as Record<string,unknown>)[key];
    if(value!==undefined){if(typeof value!=='string')return null;params.set(key,value)}
   }
  }
  return {scope,params,token:req.headers.get('x-admin-csrf')};
 }
 const form=await req.formData();
 const scope=form.get('scope');
 if(scope!=='filtered'&&scope!=='all')return null;
 if(scope==='filtered'){
  for(const key of filterKeys){
   const value=form.get(key);
   if(value!==null){if(typeof value!=='string')return null;params.set(key,value)}
  }
 }
 return {scope,params,token:req.headers.get('x-admin-csrf')||form.get('_csrf')};
}

export async function POST(req:NextRequest){
 const email=await getAdminEmail();
 if(!email)return respond('Your administrator session has expired. Please sign in again.',401);
 let input:RequestInput|null=null;
 try{input=await parseExportRequest(req)}catch{return respond('The export request could not be read. Refresh the page and try again.',400)}
 if(!input)return respond('Invalid export options. Refresh the Registration Office and try again.',400);
 const check=await verifyAdminAction(req,'export',input.token);
 if(!check.ok){
  console.warn('Admin export refused',check.reason);
  return respond(check.reason==='not_authenticated'?'Your administrator session has expired. Please sign in again.':'Export verification failed. Refresh the Registration Office and try again.',check.reason==='not_authenticated'?401:403);
 }
 let filters;
 try{filters=parseAdminFilters(input.params)}catch(e){return respond(e instanceof Error?e.message:'Invalid filter.',400)}
 let firstBatch:Awaited<ReturnType<typeof getExportBatch>>;
 try{
  await auditAdmin(email,input.scope==='all'?'CSV_EXPORT_ALL':'CSV_EXPORT_FILTERED');
  firstBatch=await getExportBatch(filters,null,500);
 }catch{
  return respond('Registration records are temporarily unavailable. The export was not started.',503);
 }

 const encoder=new TextEncoder();
 let pending:typeof firstBatch=firstBatch;
 let cursor:string|null=null;
 const stream=new ReadableStream<Uint8Array>({
  start(controller){controller.enqueue(encoder.encode('\uFEFF'+CSV_HEADERS.map(header=>csvCell(header)).join(',')+'\r\n'))},
  async pull(controller){
   try{
    if(pending.length===0){controller.close();return;}
    controller.enqueue(encoder.encode(pending.map(csvRecord).join('')));
    cursor=pending[pending.length-1].id;
    if(pending.length<500){controller.close();return;}
    pending=await getExportBatch(filters,cursor,500);
   }catch{
    console.error('CSV export stream interrupted');
    controller.error(new Error('Export interrupted'));
   }
  }
 });
 const fileName='obidient-benue-'+(input.scope==='all'?'all':'filtered')+'-registrations-'+new Date().toISOString().slice(0,10)+'.csv';
 return new Response(stream,{status:200,headers:{
  'Content-Type':'text/csv; charset=utf-8',
  'Content-Disposition':'attachment; filename="'+fileName+'"',
  'Cache-Control':'private, no-store, max-age=0',
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'no-referrer',
  'X-Robots-Tag':'noindex, nofollow'
 }});
}
