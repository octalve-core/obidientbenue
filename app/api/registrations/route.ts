import { NextRequest,NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { registrationSchema,registrationReady } from '@/lib/registration';
import { verifyLocation } from '@/lib/electoral';
export const runtime='nodejs';
const json=(message:string,status:number)=>NextResponse.json({message},{status,headers:{'Cache-Control':'no-store'}});
async function captchaValid(token:string,ip:string){try{const body=new URLSearchParams({secret:process.env.TURNSTILE_SECRET_KEY!,response:token});if(ip)body.set('remoteip',ip);const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body,cache:'no-store'});if(!r.ok)return false;const data=await r.json() as {success?:boolean};return data.success===true;}catch{return false;}}
export async function POST(req:NextRequest){
 if(!registrationReady())return json('Registration is currently closed. Please try again later.',503);
 const size=Number(req.headers.get('content-length')||0);if(size>12000)return json('Your submission is too large.',413);
 let raw:unknown;try{raw=await req.json();}catch{return json('Please review the form and try again.',400);}
 const parsed=registrationSchema.safeParse(raw);if(!parsed.success)return json('Please review the form and complete all required details.',400);
 const d=parsed.data,loc=verifyLocation(d.lgaCode,d.wardCode,d.puCode);if(!loc)return json('Please select a polling unit under the chosen ward.',400);
 const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'';
 if(!await captchaValid(d.turnstileToken,ip))return json('Security check unsuccessful. Please try again.',400);
 try{
 const sql=neon(process.env.DATABASE_URL!);
 const rows=await sql`INSERT INTO community_registrations (reference, full_name, phone, category, method, assisted_by, lga_code, ward_code, pu_code, pu_name, consent_at, communication_consent, status)
 VALUES (${crypto.randomUUID()}, ${d.fullName}, ${d.phone||null}, ${d.category}, ${d.method}, ${d.method==='Assisted'?d.assistedBy:null}, ${d.lgaCode}, ${d.wardCode}, ${loc.code}, ${loc.name}, NOW(), ${d.communicationConsent}, 'PENDING') RETURNING reference`;
 return NextResponse.json({reference:rows[0]?.reference,message:'Your registration has been received for review.'},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch{return json('We could not save your details. Please try again.',503);}
}
