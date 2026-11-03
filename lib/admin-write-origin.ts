import 'server-only';
import {cookies} from 'next/headers';
import type {NextRequest} from 'next/server';
import {SESSION_COOKIE,getAdminEmail} from '@/lib/admin-auth';
import {checkAdminProof,generateAdminProof,type AdminAction,type AdminCheckReason} from './admin-csrf-core.mjs';

export type AdminActionResult={ok:boolean;reason:AdminCheckReason|'not_authenticated'};

/** Proof generated from a verified session. Never put the value in a URL. */
export async function adminFormToken(action:AdminAction):Promise<string>{
 if(!await getAdminEmail())throw new Error('Administrator session required');
 const session=(await cookies()).get(SESSION_COOKIE)?.value;
 if(!session||!process.env.ADMIN_SESSION_SECRET)throw new Error('Administrator session required');
 return generateAdminProof(session,process.env.ADMIN_SESSION_SECRET,action);
}

export async function verifyAdminAction(req:NextRequest,action:AdminAction,token:unknown):Promise<AdminActionResult>{
 if(!await getAdminEmail())return {ok:false,reason:'not_authenticated'};
 return checkAdminProof({
  session:req.cookies.get(SESSION_COOKIE)?.value,
  secret:process.env.ADMIN_SESSION_SECRET,
  action,
  token,
  origin:req.headers.get('origin'),
  fetchSite:req.headers.get('sec-fetch-site')
 });
}
