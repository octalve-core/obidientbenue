import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound,redirect} from 'next/navigation';
import {ArrowLeft,ShieldCheck,UserRound} from 'lucide-react';
import {getAdminEmail} from '@/lib/admin-auth';
import {auditAdmin,displayLagosTime,getRegistrationDetail,nameForLga,nameForWard} from '@/lib/admin-records';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Registration Details',robots:{index:false,follow:false}};
export default async function RegistrationDetails({params}:{params:Promise<{reference:string}>}){
 const email=await getAdminEmail();if(!email)redirect('/admin/login');
 const {reference}=await params;
 if(!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(reference))notFound();
 let record:Awaited<ReturnType<typeof getRegistrationDetail>>=null;
 try{await auditAdmin(email,'DETAIL_VIEW',reference);record=await getRegistrationDetail(reference)}catch{
 return <main id="main-content" className="container-shell py-20"><h1 className="text-2xl font-semibold text-[#095132]">Registration details are temporarily unavailable</h1><Link href="/admin/registrations" className="mt-6 inline-flex text-[#08613c] underline">Return to records</Link></main>;
 }
 if(!record)notFound();
 const items=[
  ['Full name',record.full_name],['Phone number',record.phone||'Not provided'],['Registration category',record.category],
  ['Registration method',record.method],['Assisted by',record.assisted_by||'Not applicable'],
  ['Local government',nameForLga(record.lga_code)],['LGA code',record.lga_code],
  ['Electoral ward',nameForWard(record.lga_code,record.ward_code)],['Ward code',record.ward_code],
  ['Polling unit',record.pu_name],['Polling unit code',record.pu_code],
  ['Date submitted (WAT)',displayLagosTime(record.created_at)],
  ['Consent recorded (WAT)',displayLagosTime(record.consent_at)],
  ['Optional updates consent',record.communication_consent?'Yes':'No'],
  ['Consent wording version',record.consent_version],
  ['Possible duplicate',record.potential_duplicate?'Similar name and polling-unit combination detected':'No duplicate flag']
 ];
 return <main id="main-content" className="min-h-[65vh] bg-[#f5faf6] py-14 sm:py-20"><div className="container-shell max-w-5xl">
  <Link href="/admin/registrations" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0b6643]"><ArrowLeft size={16}/> Back to all registrations</Link>
  <div className="mt-8 flex items-center gap-3"><UserRound size={24} className="text-[#068A4F]"/><p className="text-xs font-bold uppercase tracking-[.18em] text-[#c42b32]">Private registration details</p></div>
  <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#083f29]">{record.full_name}</h1>
  <p className="mt-3 break-all font-mono text-xs text-[#607c6b]">Reference: {record.reference}</p>
  <div className="mt-10 overflow-hidden rounded-3xl border border-[#d9e8de] bg-white shadow-sm"><div className="border-b border-[#e4eee6] bg-[#edf7ef] px-7 py-5"><h2 className="text-lg font-semibold text-[#16472f]">Submitted information</h2></div><dl className="grid gap-x-10 gap-y-0 p-7 sm:grid-cols-2">{items.map(([label,value])=><div key={label} className="border-b border-[#edf1ed] py-5"><dt className="text-xs font-semibold uppercase tracking-[.06em] text-[#66816e]">{label}</dt><dd className="mt-2 break-words text-sm font-medium leading-7 text-[#153d2a]">{value}</dd></div>)}</dl></div>
  <p className="mt-7 flex gap-2 text-xs leading-6 text-[#5c7565]"><ShieldCheck className="mt-0.5 shrink-0 text-[#068A4F]" size={18}/>Access to this record has been logged. The registration was received when the person submitted the form; no second approval is required. A possible-duplicate flag is informational only.</p>
 </div></main>;
}
