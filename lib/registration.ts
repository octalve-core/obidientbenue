import {z} from 'zod';
import {directoryReady} from '@/lib/electoral';
export const CONSENT_VERSION='2026-10-31-v1';
export const registrationSchema=z.object({
 fullName:z.string().trim().min(3).max(100),
 phone:z.string().trim().max(20).refine(x=>!x||/^\+?[\d\s()-]{7,20}$/.test(x),'Invalid phone number'),
 category:z.enum(['Member','Volunteer','Interested','Other']),method:z.enum(['Self','Assisted']),
 assistedBy:z.string().trim().max(100),
 lgaCode:z.string().regex(/^\d{2}$/),wardCode:z.string().regex(/^\d{2}$/),
 puCode:z.string().regex(/^07\/\d{2}\/\d{2}\/\d{3}$/),
 consent:z.literal(true),adultConsent:z.literal(true),assistedConsent:z.boolean(),communicationConsent:z.boolean(),
 website:z.string().optional(),turnstileToken:z.string().min(5).max(2048)
}).superRefine((x,ctx)=>{
 if(x.method==='Assisted'&&(!x.assistedBy||!x.assistedConsent))ctx.addIssue({code:'custom',message:'Assisted registration requires permission and a helper name',path:['assistedBy']});
 if(x.website)ctx.addIssue({code:'custom',message:'Invalid submission',path:['website']});
});
export type Registration=z.infer<typeof registrationSchema>;
export function isEnabled(value: string | undefined): boolean { return value?.trim().toLowerCase()==='true'; }
export function registrationReady(){
 const retention=Number(process.env.PRIVACY_RETENTION_DAYS);
 return directoryReady()&&isEnabled(process.env.REGISTRATION_OPEN)&&isEnabled(process.env.REGISTRATION_DATA_APPROVED)&&
 Number.isInteger(retention)&&retention>=30&&retention<=730&&
 Boolean(process.env.DATABASE_URL&&process.env.TURNSTILE_SITE_KEY&&process.env.TURNSTILE_SECRET_KEY&&
 process.env.TURNSTILE_ALLOWED_HOSTNAMES&&process.env.PRIVACY_CONTROLLER_NAME&&process.env.PRIVACY_CONTACT_EMAIL&&
 process.env.REGISTRATION_HASH_SECRET&&process.env.REGISTRATION_HASH_SECRET.length>=32&&
 process.env.GOOGLE_CLIENT_ID&&process.env.GOOGLE_CLIENT_SECRET&&
 process.env.ADMIN_SESSION_SECRET&&process.env.ADMIN_SESSION_SECRET.length>=32&&
 process.env.ADMIN_ALLOWED_EMAILS&&process.env.ADMIN_AUTH_ORIGIN);
}

export async function databaseReady(){
 if(!process.env.DATABASE_URL)return false;
 try{const {neon}=await import('@neondatabase/serverless');const sql=neon(process.env.DATABASE_URL);
 const result=await sql`SELECT to_regclass('public.community_registrations') IS NOT NULL AND to_regclass('public.registration_rate_limits') IS NOT NULL AND to_regclass('public.registration_admin_audit') IS NOT NULL AS ready`;
 return result[0]?.ready===true;
 }catch{return false;}
}
