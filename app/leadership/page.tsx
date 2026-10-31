import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {PageIntro} from '@/components/ui/PageIntro';
import {candidates} from '@/content/candidates';
export const metadata:Metadata={title:'The Candidates'};
export default function Leadership(){return <main id="main-content"><PageIntro eyebrow="Leadership" title="Meet the candidates." description="Experience, background and public service across national and Benue State leadership."/><section className="container-shell grid gap-6 py-20 md:grid-cols-2">{candidates.map((p,i)=><Link href={'/leadership/'+p.slug} key={p.slug} className="group overflow-hidden rounded-3xl border border-[#dfe7f4] bg-white transition hover:-translate-y-1 hover:shadow-lg"><div className="relative aspect-[16/9] overflow-hidden bg-[#e7effe]"><Image src={p.image} alt={p.imageAlt} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover object-top transition duration-700 group-hover:scale-105" unoptimized={p.image.startsWith('https://')}/></div><div className="p-8"><span className="text-xs font-medium uppercase tracking-[.16em] text-[#c8213e]">0{i+1} / {p.office}</span><h2 className="mt-3 text-3xl font-medium text-[#092d75]">{p.name}</h2><p className="mt-4 text-sm leading-7 text-slate-600">{p.intro}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#123b9a]">Read biography <ArrowUpRight size={17}/></span></div></Link>)}</section></main>}
