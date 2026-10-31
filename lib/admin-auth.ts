import 'server-only';
import {cookies} from 'next/headers';
import {SignJWT,jwtVerify} from 'jose';
const encoder=new TextEncoder();
export const SESSION_COOKIE='ob_admin_session', FLOW_COOKIE='ob_google_flow';
export const adminOrigin=()=>process.env.ADMIN_AUTH_ORIGIN?.replace(/\/$/,'')||'';
const allowed=()=>new Set((process.env.ADMIN_ALLOWED_EMAILS||'').toLowerCase().split(',').map(x=>x.trim()).filter(Boolean));
export function authReady(){return Boolean(process.env.GOOGLE_CLIENT_ID&&process.env.GOOGLE_CLIENT_SECRET&&process.env.ADMIN_SESSION_SECRET&&process.env.ADMIN_SESSION_SECRET.length>=32&&adminOrigin().startsWith('https://')&&allowed().size);}
export function isAllowedAdmin(email:string){return allowed().has(email.toLowerCase());}
export async function signAdmin(email:string){return new SignJWT({email}).setProtectedHeader({alg:'HS256'}).setIssuer('obidient-benue').setAudience('obidient-benue-admin').setSubject(email).setIssuedAt().setExpirationTime('8h').sign(encoder.encode(process.env.ADMIN_SESSION_SECRET!));}
export async function getAdminEmail(){if(!authReady())return null;const value=(await cookies()).get(SESSION_COOKIE)?.value;if(!value)return null;try{const {payload}=await jwtVerify(value,encoder.encode(process.env.ADMIN_SESSION_SECRET!),{issuer:'obidient-benue',audience:'obidient-benue-admin',algorithms:['HS256']});const email=typeof payload.email==='string'?payload.email.toLowerCase():'';return email&&payload.sub===email&&isAllowedAdmin(email)?email:null;}catch{return null;}}
