import { z } from 'zod';
import { directoryReady } from '@/lib/electoral';
export const registrationSchema = z.object({
 fullName:z.string().trim().min(3).max(100),
 phone:z.string().trim().max(20).refine(x=>!x||/^\+?[\d\s()-]{7,20}$/.test(x),'Invalid phone number'),
 category:z.enum(['Member','Volunteer','Interested','Other']),
 method:z.enum(['Self','Assisted']),
 assistedBy:z.string().trim().max(100),
 lgaCode:z.string().regex(/^\d{2}$/),wardCode:z.string().regex(/^\d{2}$/),puCode:z.string().regex(/^07\/\d{2}\/\d{2}\/\d{3}$/),
 consent:z.literal(true), assistedConsent:z.boolean(),communicationConsent:z.boolean(),
 website:z.string().optional(),turnstileToken:z.string().min(5)
}).superRefine((x,ctx)=>{
 if(x.method==='Assisted'&&(!x.assistedBy||!x.assistedConsent))ctx.addIssue({code:'custom',message:'Assisted registration requires the person’s permission and helper name',path:['assistedBy']});
 if(x.website)ctx.addIssue({code:'custom',message:'Invalid submission',path:['website']});
});
export type Registration=z.infer<typeof registrationSchema>;
export function registrationReady(){return directoryReady()&&process.env.REGISTRATION_OPEN==='true'&&Boolean(process.env.DATABASE_URL&&process.env.TURNSTILE_SECRET_KEY&&process.env.TURNSTILE_SITE_KEY&&process.env.PRIVACY_CONTACT_EMAIL);}
