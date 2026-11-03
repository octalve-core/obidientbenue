import {NextRequest,NextResponse} from 'next/server';
import {getAdminEmail} from '@/lib/admin-auth';
import {validAdminFormPost} from '@/lib/admin-write-origin';
import {auditAdmin,CSV_HEADERS,csvCell,csvRecord,getExportBatch,parseAdminFilters} from '@/lib/admin-records';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=60;
const reject=(msg:string,status:number)=>NextResponse.json({message:msg},{status,headers:{'Cache-Control':'no-store'}});
export async function POST(req:NextRequest){
 const email=await getAdminEmail();
 if(!email)return reject('Please sign in to the Registration Office.',401);

 let form:FormData;
 try{form=await req.formData()}catch{return reject('Invalid export request.',400)}
 if(!await validAdminFormPost(req,form,'export'))return reject('Invalid export request.',403);
 const scope=form.get('scope');
 if(scope!=='all'&&scope!=='filtered')return reject('Invalid export selection.',400);
 const p=new URLSearchParams();
 if(scope==='filtered')for(const key of ['q','lga','ward','pu','category','from','to']){
  const value=form.get(key);
  if(value!==null){if(typeof value!=='string')return reject('Invalid filter.',400);p.set(key,value)}
 }
 let filters;try{filters=parseAdminFilters(p)}catch(e){return reject(e instanceof Error?e.message:'Invalid filter.',400)}
 try{await auditAdmin(email,scope==='all'?'CSV_EXPORT_ALL':'CSV_EXPORT_FILTERED')}catch{return reject('Audit service unavailable. Download was not started.',503)}
 const enc=new TextEncoder();
 const stream=new ReadableStream<Uint8Array>({
  async start(controller){
   try{
    controller.enqueue(enc.encode('\uFEFF'+CSV_HEADERS.map(x=>csvCell(x)).join(',')+'\r\n'));
    let cursor:string|null=null;
    for(;;){
     const rows=await getExportBatch(filters,cursor,500);
     if(rows.length===0)break;
     controller.enqueue(enc.encode(rows.map(csvRecord).join('')));
     cursor=rows[rows.length-1].id;
     if(rows.length<500)break;
    }
    controller.close();
   }catch(e){console.error('Private registration export interrupted',e);controller.error(new Error('CSV export interrupted'))}
  }
 });
 const fileName='obidient-benue-'+(scope==='all'?'all':'filtered')+'-registrations-'+new Date().toISOString().slice(0,10)+'.csv';
 return new Response(stream,{status:200,headers:{
  'Content-Type':'text/csv; charset=utf-8',
  'Content-Disposition':'attachment; filename="'+fileName+'"',
  'Cache-Control':'private, no-store, max-age=0',
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'no-referrer',
  'X-Robots-Tag':'noindex, nofollow'
 }});
}
