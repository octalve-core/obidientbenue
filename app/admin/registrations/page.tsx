import type {Metadata} from 'next';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {Eye,ShieldCheck,Users,HandHeart,Phone} from 'lucide-react';
import {getAdminEmail} from '@/lib/admin-auth';
import {adminFormToken} from '@/lib/admin-write-origin';
import {AdminExportActions,AdminLogoutAction} from '@/features/admin/AdminActions';
import {getLGAs} from '@/lib/electoral';
import {RegistrationFilters} from '@/features/admin/RegistrationFilters';
import {auditAdmin,displayLagosTime,loadRegistrationPage,nameForLga,nameForWard,PAGE_SIZE,parseAdminFilters,serializeFilters} from '@/lib/admin-records';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Registration Office',robots:{index:false,follow:false}};
type SearchParams=Promise<Record<string,string|string[]|undefined>>;
export default async function RegistrationOffice({searchParams}:{searchParams:SearchParams}){
 const admin=await getAdminEmail();if(!admin)redirect('/admin/login');
 const exportToken=await adminFormToken('export'),logoutToken=await adminFormToken('logout');
 const query=await searchParams;const params=new URLSearchParams();
 for(const [k,v] of Object.entries(query))if(typeof v==='string')params.set(k,v);
 let filters;try{filters=parseAdminFilters(params)}catch(e){return <main id="main-content" className="container-shell min-h-[65vh] py-20"><h1 className="text-3xl font-semibold text-[#0c4a31]">Please correct your filters</h1><p className="mt-5 text-slate-600">{e instanceof Error?e.message:'Invalid filter'}</p><Link className="mt-6 inline-block rounded-full bg-[#047546] px-6 py-3 text-sm font-semibold !text-white" href="/admin/registrations">Clear filters</Link></main>}
 let result:Awaited<ReturnType<typeof loadRegistrationPage>>|null=null;
 try{await auditAdmin(admin,'LIST_VIEW');result=await loadRegistrationPage(filters)}catch{}
 const cards=[{label:'Total received',value:result?.totalAll||0,icon:Users},{label:'Matching filters',value:result?.total||0,icon:ShieldCheck},{label:'Assisted entries',value:result?.assisted||0,icon:HandHeart},{label:'With phone numbers',value:result?.contacted||0,icon:Phone}];
 const pages=Math.max(1,Math.ceil((result?.total||0)/PAGE_SIZE));const exportParams=serializeFilters(filters,false);
 return <main id="main-content" className="min-h-[66vh] bg-[#f3faf5] py-12 sm:py-16"><div className="container-shell">
  <header className="flex flex-wrap items-start justify-between gap-6"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#b7212d]">Private administration</p><h1 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-semibold tracking-[-.04em] text-[#073e29]">Registration office</h1><p className="mt-3 max-w-xl text-sm leading-7 text-[#4c6c58]">Search, review and securely export the registration information submitted by your community.</p></div><div className="flex flex-wrap gap-3"><Link href="/admin/readiness" className="inline-flex items-center rounded-full border border-[#c9dfd0] bg-white px-5 py-3 text-sm font-semibold text-[#0a5839]">System status</Link><AdminLogoutAction token={logoutToken}/></div></header>
  {!result?<div role="alert" className="mt-8 rounded-2xl border border-[#eac0be] bg-white p-8 text-sm text-[#9c2130]">Registration records are temporarily unavailable. Please check your database connection.</div>:<>
   <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(({label,value,icon:Icon})=><div key={label} className="rounded-2xl border border-[#dbe9de] bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-3"><p className="text-sm text-[#55715c]">{label}</p><Icon className="text-[#068A4F]" size={20}/></div><p className="mt-5 text-4xl font-semibold tracking-tight text-[#083c29]">{value.toLocaleString('en-NG')}</p></div>)}</div>
   <div className="mt-7"><RegistrationFilters initial={filters} lgas={getLGAs()}/></div>
   <section className="mt-7 overflow-hidden rounded-3xl border border-[#dce9df] bg-white shadow-sm" aria-label="Registration records">
    <div className="flex flex-wrap items-center justify-between gap-4 p-6"><div><h2 className="text-lg font-semibold text-[#103d29]">All submissions</h2><p className="mt-1 text-xs text-[#5e7965]">{result.total.toLocaleString('en-NG')} records match these filters · 40 records per page</p></div><div className="flex flex-wrap items-center gap-2">
     <AdminExportActions token={exportToken} filters={Object.fromEntries(exportParams.entries())}/>
    </div></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[1040px] text-left text-sm"><thead className="bg-[#eff8f0] text-[#255039]"><tr>{['Received · WAT','Full name','Phone','Category','LGA','Ward','Polling unit','Details'].map(t=><th key={t} scope="col" className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-[.06em]">{t}</th>)}</tr></thead><tbody>{result.rows.map(row=><tr key={row.reference} className="border-t border-[#e4efe8] hover:bg-[#f9fcfa]"><td className="whitespace-nowrap px-5 py-4 text-xs text-[#557360]">{displayLagosTime(row.created_at)}</td><td className="px-5 py-4 font-semibold text-[#163f2b]">{row.full_name}</td><td className="px-5 py-4 text-[#43614b]">{row.phone||'—'}</td><td className="px-5 py-4 text-[#43614b]">{row.category}</td><td className="px-5 py-4 text-[#43614b]">{nameForLga(row.lga_code)}</td><td className="px-5 py-4 text-[#43614b]">{nameForWard(row.lga_code,row.ward_code)}</td><td className="px-5 py-4 text-[#43614b]">{row.pu_name}<span className="mt-0.5 block font-mono text-xs text-[#708a75]">{row.pu_code}</span></td><td className="px-5 py-4"><Link href={'/admin/registrations/'+row.reference} className="inline-flex items-center gap-2 rounded-full border border-[#b9d7c4] px-4 py-2 text-xs font-semibold text-[#08603d] hover:bg-[#edf8ef]"><Eye size={15}/> Details</Link></td></tr>)}</tbody></table>{result.rows.length===0&&<p className="px-6 py-14 text-center text-sm text-[#637d68]">No registrations match the selected filters.</p>}</div>
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e1ede4] px-6 py-5"><p className="text-xs text-[#5d7662]">Page {filters.page} of {pages}</p><nav aria-label="Pagination" className="flex gap-2">{filters.page>1&&<Link href={'/admin/registrations?'+serializeFilters({...filters,page:filters.page-1})} className="rounded-full border border-[#c5dfce] px-4 py-2 text-sm font-semibold text-[#0b583a]">Previous</Link>}{filters.page<pages&&<Link href={'/admin/registrations?'+serializeFilters({...filters,page:filters.page+1})} className="rounded-full bg-[#047546] px-4 py-2 text-sm font-semibold !text-white">Next page</Link>}</nav></div>
   </section>
   <p className="mt-6 flex gap-2 text-xs leading-6 text-[#5f7868]"><ShieldCheck className="mt-0.5 shrink-0 text-[#068A4F]" size={18}/>This private information must be used only for the consented purpose. Download activity is logged. CSV files open in Excel; store them securely and avoid sharing outside authorised staff.</p>
  </>}
 </div></main>;
}
