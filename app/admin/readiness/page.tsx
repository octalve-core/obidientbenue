import type {Metadata} from 'next';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {getAdminEmail,authReady} from '@/lib/admin-auth';
import {databaseReady,registrationReady,isEnabled} from '@/lib/registration';
import {directoryReady,getLGAs,getWards,getPollingUnits} from '@/lib/electoral';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Registration Readiness',robots:{index:false,follow:false}};
export default async function RegistrationReadiness(){
 const admin=await getAdminEmail();
 if(!admin)redirect('/admin/login');
 const catalogue=directoryReady();
 const lgas=catalogue?getLGAs():[];
 const wards=catalogue?lgas.flatMap(x=>getWards(x.code)):[];
 const units=catalogue?wards.reduce((n,w)=>n+getPollingUnits(w.lgaCode,w.code).length,0):0;
 const database=await databaseReady();
 const e=process.env;
 const retention=Number(e.PRIVACY_RETENTION_DAYS);
 const checks=[
 {title:'Benue location catalogue',pass:catalogue&&lgas.length===23&&wards.length===276&&units===5102,description:catalogue?lgas.length+' local governments · '+wards.length+' wards · '+units+' polling units':'Directory is incomplete'},
 {title:'Database connection and tables',pass:database,description:'The dedicated registration tables must be available'},
 {title:'Google administrator sign-in',pass:authReady(),description:'Google login configuration and approved administrator list'},
 {title:'Cloudflare security keys',pass:!!e.TURNSTILE_SITE_KEY&&!!e.TURNSTILE_SECRET_KEY&&!!e.TURNSTILE_ALLOWED_HOSTNAMES,description:'Keys and allowed site names are present; an actual visitor challenge still needs testing'},
 {title:'Privacy identity and contact',pass:!!e.PRIVACY_CONTROLLER_NAME&&!!e.PRIVACY_CONTACT_EMAIL,description:'An organisation and a monitored contact must be published'},
 {title:'Retention policy setting',pass:Number.isInteger(retention)&&retention>=30&&retention<=730,description:'The set period is in range. Operational deletion procedures need separate verification'},
 {title:'Secure signing keys',pass:!!e.REGISTRATION_HASH_SECRET&&e.REGISTRATION_HASH_SECRET.length>=32&&!!e.ADMIN_SESSION_SECRET&&e.ADMIN_SESSION_SECRET.length>=32,description:'Two distinct signing secrets, each at least 32 characters'},
 {title:'Location data approval',pass:isEnabled(e.REGISTRATION_DATA_APPROVED),description:'Manual confirmation of the official electoral records'},
 {title:'Public registration switch',pass:isEnabled(e.REGISTRATION_OPEN),description:'The final switch after all acceptance checks'}
 ];
 const open=registrationReady()&&database;
 return <main id="main-content" className="container-shell min-h-[64vh] py-14">
  <div className="mb-9"><p className="text-xs font-medium uppercase tracking-[.16em] text-red-600">Private workspace</p>
  <h1 className="mt-3 text-3xl font-medium text-[#112d70]">Registration readiness</h1>
  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">An administrator-only overview of the safeguards needed before receiving new registrations. Security credentials are never displayed here.</p></div>
  <section className="rounded-2xl border border-[#dfe6f2] bg-white p-5 sm:p-8">
   <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-medium text-[#112d70]">Current status</h2>
   <span className={'rounded-full px-4 py-2 text-xs font-medium '+(open?'bg-green-50 text-green-800':'bg-amber-50 text-amber-900')}>{open?'Registration configuration is enabled':'Registration is closed'}</span></div>
   <div className="mt-6 space-y-1">{checks.map(c=><div key={c.title} className="flex items-start justify-between gap-4 border-t border-slate-100 py-4"><div><p className="text-sm font-medium text-slate-800">{c.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{c.description}</p></div><span className={'shrink-0 rounded-full px-3 py-1 text-xs font-medium '+(c.pass?'bg-green-50 text-green-800':'bg-amber-50 text-amber-900')}>{c.pass?'Configured':'Needs attention'}</span></div>)}</div>
  </section>
  <p className="mt-6 max-w-3xl text-xs leading-6 text-slate-500">Configuration checks alone do not certify a live registration service. Before public release, verify official polling-unit data, Google access, Cloudflare challenges, valid and invalid submissions, review workflows and the retention/deletion process. Changing Vercel Production settings requires a new Production deployment.</p>
  <Link href="/admin/registrations" className="mt-7 inline-flex rounded-full border border-blue-200 px-5 py-3 text-sm font-medium text-[#112d70]">Return to registration office</Link>
 </main>;
}
