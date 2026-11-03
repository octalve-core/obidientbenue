import {NextRequest,NextResponse} from 'next/server';
import {randomUUID,createHmac} from 'node:crypto';
import {neon} from '@neondatabase/serverless';
import {registrationSchema,registrationReady,databaseReady,CONSENT_VERSION} from '@/lib/registration';
import {verifyLocation} from '@/lib/electoral';
export const runtime='nodejs';
const json=(message:string,status:number)=>NextResponse.json({message},{status,headers:{'Cache-Control':'no-store'}});
function digest(value:string){return createHmac('sha256',process.env.REGISTRATION_HASH_SECRET!).update(value).digest('hex');}
async function verifyCaptcha(token:string,ip:string){
 try{
  const body=new URLSearchParams({secret:process.env.TURNSTILE_SECRET_KEY!,response:token});if(ip)body.set('remoteip',ip);
  const response=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body,cache:'no-store',signal:AbortSignal.timeout(10000)});
  if(!response.ok)return false;
  const r=await response.json() as {success?:boolean;hostname?:string};
  const hosts=(process.env.TURNSTILE_ALLOWED_HOSTNAMES||'').split(',').map(x=>x.trim().toLowerCase());
  return r.success===true&&!!r.hostname&&hosts.includes(r.hostname.toLowerCase());
 }catch{return false;}
}
export async function POST(req:NextRequest){
 if(!registrationReady()||!await databaseReady())return json('Registration is currently closed. Please check back later.',503);
 const size=Number(req.headers.get('content-length')||0);if(size>12000)return json('Your submission is too large.',413);
 let input:unknown;try{input=await req.json();}catch{return json('Please review your details.',400);}
 const validated=registrationSchema.safeParse(input);
 if(!validated.success)return json('Please complete the required details.',400);
 const d=validated.data,location=verifyLocation(d.lgaCode,d.wardCode,d.puCode);
 if(!location)return json('Please choose a polling unit under your selected ward.',400);
 const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim().slice(0,50)||'unknown';
 if(!await verifyCaptcha(d.turnstileToken,ip))return json('Security check unsuccessful. Please try again.',400);
 try{
  const sql=neon(process.env.DATABASE_URL!);
  const visitor=digest('visitor|'+ip);
  const rate=await sql`INSERT INTO registration_rate_limits(visitor_hash,window_start,attempts)
    VALUES (${visitor},date_trunc('hour',now()),1)
    ON CONFLICT(visitor_hash,window_start) DO UPDATE SET attempts=registration_rate_limits.attempts+1
    RETURNING attempts`;
  if(Number(rate[0]?.attempts||0)>10)return json('Too many submissions. Please try again later.',429);
  const fingerprint=digest('person|'+d.fullName.toLowerCase().replace(/\s+/g,' ')+'|'+d.puCode);
  const found=await sql`SELECT EXISTS(SELECT 1 FROM community_registrations WHERE fingerprint=${fingerprint} AND created_at>now()-interval '90 days') AS found`;
  const possibleDuplicate=found[0]?.found===true,reference=randomUUID();
  await sql`INSERT INTO community_registrations(reference,full_name,phone,category,method,assisted_by,lga_code,ward_code,pu_code,pu_name,consent_at,communication_consent,status,consent_version,fingerprint,potential_duplicate)
   VALUES (${reference},${d.fullName},${d.phone||null},${d.category},${d.method},
   ${d.method==='Assisted'?d.assistedBy:null},${d.lgaCode},${d.wardCode},${location.code},${location.name},
   NOW(),${d.communicationConsent},'PENDING',${CONSENT_VERSION},${fingerprint},${possibleDuplicate})`;
  return NextResponse.json({reference,message:'Your community registration has been received successfully.'},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch{return json('We could not save your information. Please try again.',503);}
}
