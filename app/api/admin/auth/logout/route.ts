import {NextRequest,NextResponse} from 'next/server';
import {SESSION_COOKIE} from '@/lib/admin-auth';
import {validAdminFormPost} from '@/lib/admin-write-origin';
export async function POST(req:NextRequest){
 let form:FormData;try{form=await req.formData()}catch{return NextResponse.json({message:'Invalid request'},{status:400});}
 if(!await validAdminFormPost(req,form,'logout'))return NextResponse.json({message:'Invalid request'},{status:403});
 const response=NextResponse.redirect(new URL('/admin/login','https://www.obidientbenue.com'),303);
 response.cookies.set(SESSION_COOKIE,'',{httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:0});
 return response;
}
