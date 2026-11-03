import 'server-only';
import {createHmac,timingSafeEqual} from 'node:crypto';
import {cookies} from 'next/headers';
import type {NextRequest} from 'next/server';
import {SESSION_COOKIE,getAdminEmail} from '@/lib/admin-auth';

const trustedOrigins=new Set([
 'https://www.obidientbenue.com',
 'https://obidientbenue.com',
 'https://obidientbenue.vercel.app'
]);

type AdminAction='export'|'logout';

/** CSRF proof bound to this administrator's signed session, not to Vercel's internal Host. */
function tokenFor(session:string,action:AdminAction):string{
 return createHmac('sha256',process.env.ADMIN_SESSION_SECRET!)
  .update('obidient-benue:admin-csrf:v1\0'+action+'\0'+session).digest('hex');
}
export async function adminFormToken(action:AdminAction):Promise<string>{
 if(!await getAdminEmail())throw new Error('Admin login required');
 const session=(await cookies()).get(SESSION_COOKIE)?.value;
 if(!session||!process.env.ADMIN_SESSION_SECRET)throw new Error('Admin login required');
 return tokenFor(session,action);
}
export async function validAdminFormPost(req:NextRequest,form:FormData,action:AdminAction):Promise<boolean>{
 const site=req.headers.get('sec-fetch-site');
 if(site&&site!=='same-origin'&&site!=='none')return false;
 const origin=req.headers.get('origin');
 if(origin&&!trustedOrigins.has(origin))return false;
 const submitted=form.get('_csrf');
 if(typeof submitted!=='string'||!/^[a-f0-9]{64}$/.test(submitted))return false;
 const session=req.cookies.get(SESSION_COOKIE)?.value;
 if(!session||!process.env.ADMIN_SESSION_SECRET)return false;
 if(!await getAdminEmail())return false;
 const expected=Buffer.from(tokenFor(session,action),'hex');
 const received=Buffer.from(submitted,'hex');
 return expected.length===received.length&&timingSafeEqual(expected,received);
}
