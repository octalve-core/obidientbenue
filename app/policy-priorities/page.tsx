import type {Metadata} from 'next';
import {PageIntro} from '@/components/ui/PageIntro';
import {priorities} from '@/content/site';
export const metadata:Metadata={title:'Policy Priorities'};
export default function Priorities(){return <main id="main-content"><PageIntro eyebrow="Development priorities" title="Issues that matter in Benue." description="A focus on security, farming, healthcare, education, accountable government and essential infrastructure."/><section className="container-shell grid gap-5 py-20 md:grid-cols-2">{priorities.map(p=><article key={p.number} className="rounded-3xl border border-[#d8e8dd] p-9 transition hover:shadow-lg"><span className="text-sm text-[#b91f2d]">{p.number} / 06</span><h2 className="mt-6 text-2xl font-medium text-[#075235]">{p.title}</h2><p className="mt-4 text-base leading-8 text-slate-600">{p.detail}</p></article>)}</section></main>}
