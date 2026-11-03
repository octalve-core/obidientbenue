import type {Metadata} from 'next';
import {PageIntro} from '@/components/ui/PageIntro';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Privacy'};
export default function Privacy(){
 const controller=process.env.PRIVACY_CONTROLLER_NAME||'Obidient Benue registration team';
 const email=process.env.PRIVACY_CONTACT_EMAIL||'';
 const retention=Number(process.env.PRIVACY_RETENTION_DAYS);
 return <main id="main-content"><PageIntro eyebrow="Privacy & personal information" title="Your information deserves care." description="How the registration team uses and protects your information."/>
 <article className="container-shell max-w-4xl space-y-9 py-16 text-sm leading-8 text-slate-600">
 <section><h2 className="text-2xl font-medium text-[#075336]">Who is responsible</h2><p className="mt-3">{controller}. {email?<>For questions, corrections and deletion requests, email <a href={'mailto:'+email} className="text-[#067243] underline">{email}</a>.</>:<>Registration will not open until a privacy contact is published.</>}</p></section>
 <section><h2 className="text-2xl font-medium text-[#075336]">What we collect</h2><p className="mt-3">Full name, optional phone number, registration interest, local government, electoral ward and polling unit. With assisted registration, the name of the helper is recorded. We ask for your explicit permission because political interests are sensitive personal information. Never submit NIN, PVC numbers or passwords.</p></section>
 <section><h2 className="text-2xl font-medium text-[#075336]">How it is used</h2><p className="mt-3">Information is used only to register community interest and review the submitted details. Agreeing to receive messages is optional and separate. This website does not register voters with INEC or establish political-party membership.</p></section>
 <section><h2 className="text-2xl font-medium text-[#075336]">Access and protection</h2><p className="mt-3">Only named administrators may review records using restricted accounts. Access is recorded. Information must not be sold or shared for unrelated purposes.</p></section>
 <section><h2 className="text-2xl font-medium text-[#075336]">Your choices and retention</h2><p className="mt-3">You can request correction, withdraw consent or ask for deletion using the stated contact. {Number.isInteger(retention)&&retention>=30&&retention<=730?'The approved maximum retention is '+retention+' days, subject to applicable legal obligations.':'The service remains closed until a retention period is approved.'}</p></section>
 <p className="text-xs">Information about your rights is available from the <a href="https://ndpc.gov.ng/" className="text-[#067243] underline" target="_blank" rel="noopener noreferrer">Nigeria Data Protection Commission</a>.</p></article></main>;
}
