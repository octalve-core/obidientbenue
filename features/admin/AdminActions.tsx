'use client';
import {useState} from 'react';
import {Download} from 'lucide-react';

type Scope='all'|'filtered';
type ExportFilters=Record<string,string>;
type Failure={message?:string;code?:string};

function responseName(scope:Scope){
 return 'obidient-benue-'+scope+'-registrations-'+new Date().toISOString().slice(0,10)+'.csv';
}
async function readFailure(response:Response):Promise<string>{
 try{
  const value=await response.json() as Failure;
  if(typeof value.message==='string'&&value.message.length<300)return value.message;
 }catch{}
 return response.status===401?'Your administrator session has expired. Please sign in again.':
  response.status===403?'Security check unsuccessful. Refresh the Registration Office and try again.':
  'The request could not be completed. Please try again.';
}
export function AdminExportActions({token,filters}:{token:string;filters:ExportFilters}){
 const [busy,setBusy]=useState<Scope|null>(null);
 const [error,setError]=useState('');
 async function download(scope:Scope){
  if(busy)return;
  setBusy(scope);setError('');
  try{
   const response=await fetch('/api/admin/registrations/export',{
    method:'POST',credentials:'same-origin',cache:'no-store',
    headers:{'Content-Type':'application/json','X-Admin-CSRF':token,'X-Requested-With':'XMLHttpRequest'},
    body:JSON.stringify({scope,filters:scope==='filtered'?filters:{}})
   });
   if(!response.ok)throw new Error(await readFailure(response));
   if(!(response.headers.get('content-type')||'').includes('text/csv'))throw new Error('The export did not return a CSV file.');
   const blob=await response.blob();
   if(!blob.size)throw new Error('The export file was empty.');
   const url=URL.createObjectURL(blob);
   const link=document.createElement('a');
   link.href=url;link.download=responseName(scope);
   link.style.display='none';document.body.appendChild(link);link.click();link.remove();
   window.setTimeout(()=>URL.revokeObjectURL(url),10000);
  }catch(e){setError(e instanceof Error?e.message:'Unable to download registrations.');}
  finally{setBusy(null);}
 }
 return <div className="flex flex-col gap-2">
  <div className="flex flex-wrap items-center gap-2">
   <button type="button" disabled={busy!==null} onClick={()=>void download('filtered')} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#047546] px-5 py-2 text-xs font-semibold !text-white hover:bg-[#055f3a] disabled:cursor-wait disabled:opacity-60"><Download size={16}/>{busy==='filtered'?'Preparing CSV…':'Export matching CSV'}</button>
   <button type="button" disabled={busy!==null} onClick={()=>void download('all')} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#bbd9c4] px-5 py-2 text-xs font-semibold text-[#09573b] hover:bg-[#ecf8ef] disabled:cursor-wait disabled:opacity-60"><Download size={16}/>{busy==='all'?'Preparing CSV…':'Export all CSV'}</button>
  </div>
  {error&&<p role="alert" className="max-w-xl text-xs leading-6 text-[#b91f2d]">{error}</p>}
 </div>;
}
export function AdminLogoutAction({token}:{token:string}){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 async function logout(){
  if(busy)return;setBusy(true);setError('');
  try{
   const response=await fetch('/api/admin/auth/logout',{
    method:'POST',credentials:'same-origin',cache:'no-store',
    headers:{'Content-Type':'application/json','X-Admin-CSRF':token,'X-Requested-With':'XMLHttpRequest'},
    body:'{}'
   });
   if(!response.ok)throw new Error(await readFailure(response));
   window.location.assign('/admin/login?signed_out=1');
  }catch(e){setError(e instanceof Error?e.message:'Unable to sign out.');setBusy(false);}
 }
 return <div className="flex flex-col items-start gap-2"><button type="button" disabled={busy} onClick={()=>void logout()} className="rounded-full border border-[#c9dfd0] bg-white px-5 py-3 text-sm font-semibold text-[#0a5839] hover:bg-[#eaf7ee] disabled:opacity-60">{busy?'Signing out…':'Sign out'}</button>
  {error&&<p role="alert" className="max-w-[220px] text-xs text-[#b91f2d]">{error}</p>}</div>;
}
