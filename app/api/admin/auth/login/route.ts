import {NextResponse} from 'next/server';
import {randomBytes,createHash} from 'node:crypto';
import {adminOrigin,authReady,FLOW_COOKIE} from '@/lib/admin-auth';
export const runtime='nodejs';
export async function GET(){
 if(!authReady())return NextResponse.json({message:'Team sign-in is temporarily unavailable.'},{status:503});
 const token=()=>randomBytes(32).toString('base64url');
 const state=token(),nonce=token(),verifier=randomBytes(48).toString('base64url');
 const challenge=createHash('sha256').update(verifier).digest('base64url');
 const url=new URL('https://accounts.google.com/o/oauth2/v2/auth');
 url.search=new URLSearchParams({client_id:process.env.GOOGLE_CLIENT_ID!,redirect_uri:adminOrigin()+'/api/admin/auth/callback',scope:'openid email profile',response_type:'code',state,nonce,code_challenge:challenge,code_challenge_method:'S256',prompt:'select_account'}).toString();
 const response=NextResponse.redirect(url);
 response.cookies.set(FLOW_COOKIE,JSON.stringify({state,nonce,verifier}),{secure:true,httpOnly:true,sameSite:'lax',path:'/api/admin/auth',maxAge:600});
 return response;
}
