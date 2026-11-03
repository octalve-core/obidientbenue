import {NextRequest,NextResponse} from 'next/server';
import {SESSION_COOKIE} from '@/lib/admin-auth';
import {verifyAdminAction} from '@/lib/admin-write-origin';
export const runtime='nodejs';
export const dynamic='force-dynamic';

export async function POST(req:NextRequest){
 let token:unknown=req.headers.get('x-admin-csrf');
 if(!token&&!req.headers.get('content-type')?.includes('application/json')){
  try{token=(await req.formData()).get('_csrf')}catch{return NextResponse.json({message:'Invalid sign-out request.'},{status:400})}
 }
 const check=await verifyAdminAction(req,'logout',token);
 if(!check.ok){
  console.warn('Admin sign-out refused',check.reason);
  if(check.reason==='not_authenticated'){
   // A previously expired admin session must still be clearable.
   const cleared=NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
   cleared.cookies.set(SESSION_COOKIE,'',{httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:0});
   return cleared;
  }
  return NextResponse.json({message:'Sign-out verification failed. Refresh the Registration Office and try again.'},{status:403,headers:{'Cache-Control':'no-store'}});
 }
 const response=NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
 response.cookies.set(SESSION_COOKIE,'',{httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:0});
 return response;
}
