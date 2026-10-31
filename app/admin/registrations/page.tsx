import type {Metadata} from 'next';
import {redirect} from 'next/navigation';
import {neon} from '@neondatabase/serverless';
import {getAdminEmail} from '@/lib/admin-auth';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Registration Office',robots:{index:false,follow:false}};
type RecordRow={reference:string;full_name:string;phone:string|null;category:string;lga_code:string;ward_code:string;pu_code:string;status:string;created_at:string;potential_duplicate:boolean};
export default async function Page(){
 const email=await getAdminEmail();if(!email)redirect('/admin/login');
 let records:RecordRow[]=[];let available=true;
 try{if(!process.env.DATABASE_URL)throw Error();const sql=neon(process.env.DATABASE_URL);
 await sql`INSERT INTO registration_admin_audit(actor_email,action) VALUES (${email},'LIST_VIEW')`;
 records=await sql`SELECT reference::text,full_name,phone,category,lga_code,ward_code,pu_code,status,created_at,potential_duplicate FROM community_registrations ORDER BY created_at DESC LIMIT 50` as RecordRow[];
 }catch{available=false;}
 return <main id="main-content" className="container-shell min-h-[60vh] py-14"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-medium uppercase tracking-[.16em] text-red-600">Private workspace</p><h1 className="mt-3 text-3xl font-medium text-[#112d70]">Registration office</h1><p className="mt-2 text-sm text-slate-500">Recent records for authorised administrators.</p></div><form method="post" action="/api/admin/auth/logout"><button type="submit" className="rounded-full border border-slate-300 px-4 py-3 text-sm">Sign out</button></form></div>
 {!available?<p className="mt-10 rounded-xl bg-blue-50 p-6 text-sm">Registration records are not available at the moment. Please contact the administrator.</p>:
 <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-200"><table className="min-w-[700px] w-full text-left text-sm"><thead className="bg-blue-50 text-[#16367a]"><tr>{['Received','Name','Phone','Category','Location codes','Review'].map(x=><th key={x} className="p-4 font-medium">{x}</th>)}</tr></thead><tbody>{records.map(x=><tr key={x.reference} className="border-t border-slate-100"><td className="p-4 whitespace-nowrap">{new Date(x.created_at).toLocaleDateString('en-NG')}</td><td className="p-4">{x.full_name}</td><td className="p-4">{x.phone||'—'}</td><td className="p-4">{x.category}</td><td className="p-4">{x.lga_code} · {x.ward_code} · {x.pu_code}</td><td className="p-4">{x.status}{x.potential_duplicate?' · Check possible duplicate':''}</td></tr>)}</tbody></table>{records.length===0&&<p className="p-6 text-slate-500">No registrations received yet.</p>}</div>}
 <p className="mt-6 text-xs text-slate-500">Access to these records is logged. Please protect member information.</p></main>;
}
