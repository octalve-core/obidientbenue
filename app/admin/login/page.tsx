import type {Metadata} from 'next';
import {redirect} from 'next/navigation';
import {authReady,getAdminEmail} from '@/lib/admin-auth';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Team Sign In',robots:{index:false,follow:false}};
export default async function Login(){
 if(await getAdminEmail())redirect('/admin/registrations');
 return <main id="main-content" className="container-shell flex min-h-[66vh] items-center justify-center py-20"><div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-9 shadow-xl shadow-blue-900/5">
 <p className="text-xs font-medium uppercase tracking-[.18em] text-[#c32835]">Obidient Benue</p><h1 className="mt-3 text-3xl font-medium text-[#075235]">Team sign in</h1><p className="mt-4 text-sm leading-7 text-slate-600">The registration office is available only to authorised administrators.</p>
 {authReady()?<a href="/api/admin/auth/login" className="mt-7 inline-flex w-full justify-center rounded-full bg-[#047546] px-6 py-3 text-sm font-medium text-white">Continue with Google</a>:<p className="mt-7 rounded-xl bg-[#edf8f1] p-4 text-sm text-[#075839]">Team sign-in is not available yet.</p>}</div></main>;
}
