import 'server-only';
import type {NextRequest} from 'next/server';

// These are the only public hostnames attached to the Obidient Benue project.
// Never trust an arbitrary x-forwarded-host supplied by a client.
const knownHosts=new Set(['www.obidientbenue.com','obidientbenue.com','obidientbenue.vercel.app']);
export function validAdminWriteOrigin(req:NextRequest):boolean{
 const origin=req.headers.get('origin');
 const host=req.headers.get('host')?.trim().toLowerCase();
 if(!origin||!host||!knownHosts.has(host))return false;
 try{
  const parsed=new URL(origin);
  return parsed.protocol==='https:'&&parsed.host===host&&parsed.username===''&&parsed.password===''&&parsed.pathname==='/'&&parsed.search===''&&parsed.hash==='';
 }catch{return false;}
}
