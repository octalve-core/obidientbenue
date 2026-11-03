import {NextRequest,NextResponse} from 'next/server';
export function proxy(request:NextRequest){
 const host=request.headers.get('host')?.toLowerCase();
 if(host==='obidientbenue.vercel.app'||host==='obidientbenue.com'){
  const target=new URL(request.nextUrl.pathname+request.nextUrl.search,'https://www.obidientbenue.com');
  return NextResponse.redirect(target,308);
 }
 return NextResponse.next();
}
export const config={matcher:['/admin/:path*']};
