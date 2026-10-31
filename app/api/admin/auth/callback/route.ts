import {NextRequest,NextResponse} from 'next/server';
import {createRemoteJWKSet,jwtVerify} from 'jose';
import {adminOrigin,authReady,FLOW_COOKIE,SESSION_COOKIE,isAllowedAdmin,signAdmin} from '@/lib/admin-auth';
export const runtime='nodejs';
const jwks=createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
const reject=()=>NextResponse.redirect(new URL('/admin/login?error=access',adminOrigin()||'https://obidientbenue.vercel.app'));
export async function GET(req:NextRequest){
 if(!authReady())return NextResponse.json({message:'Team sign-in is temporarily unavailable.'},{status:503});
 let flow:{state:string;nonce:string;verifier:string};
 try{flow=JSON.parse(req.cookies.get(FLOW_COOKIE)?.value||'null');if(!flow?.state||!flow.nonce||!flow.verifier)throw Error();}catch{return reject();}
 const state=req.nextUrl.searchParams.get('state'),code=req.nextUrl.searchParams.get('code');
 if(!state||!code||state!==flow.state)return reject();
 const denied=reject();denied.cookies.delete(FLOW_COOKIE);
 try{
  const body=new URLSearchParams({code,client_id:process.env.GOOGLE_CLIENT_ID!,client_secret:process.env.GOOGLE_CLIENT_SECRET!,redirect_uri:adminOrigin()+'/api/admin/auth/callback',grant_type:'authorization_code',code_verifier:flow.verifier});
  const response=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body,cache:'no-store',signal:AbortSignal.timeout(10000)});
  if(!response.ok)return denied;
  const data=await response.json() as {id_token?:string};
  if(!data.id_token)return denied;
  const {payload}=await jwtVerify(data.id_token,jwks,{issuer:['https://accounts.google.com','accounts.google.com'],audience:process.env.GOOGLE_CLIENT_ID!,algorithms:['RS256']});
  const email=typeof payload.email==='string'?payload.email.toLowerCase():'';
  if(payload.nonce!==flow.nonce||payload.email_verified!==true||!isAllowedAdmin(email))return denied;
  const session=await signAdmin(email);
  const success=NextResponse.redirect(new URL('/admin/registrations',adminOrigin()));
  success.cookies.delete(FLOW_COOKIE);
  success.cookies.set(SESSION_COOKIE,session,{httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:28800});
  return success;
 }catch{return denied;}
}
