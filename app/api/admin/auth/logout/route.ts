import {NextRequest,NextResponse} from 'next/server';
import {adminOrigin,SESSION_COOKIE} from '@/lib/admin-auth';
export async function POST(req:NextRequest){
 if(req.headers.get('origin')!==adminOrigin())return NextResponse.json({message:'Invalid request'},{status:403});
 const response=NextResponse.redirect(new URL('/admin/login',adminOrigin()),303);
 response.cookies.set(SESSION_COOKIE,'',{httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:0});
 return response;
}
