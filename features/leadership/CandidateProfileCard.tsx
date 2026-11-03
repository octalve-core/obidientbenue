import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import type {Candidate} from '@/content/candidates';

const labels:Record<string,{name:string;cta:string}>={
  'peter-obi':{name:'Peter Obi',cta:'Meet Peter Obi'},
  'rabiu-kwankwaso':{name:'Rabiu Musa Kwankwaso',cta:'Meet Kwankwaso'},
  'terhemba-shija':{name:'Prof. Terhemba Shija',cta:'Meet Prof. Shija'},
  'raymond-edoh':{name:'Dr. Raymond Edoh',cta:'Meet Dr. Edoh'}
};

export function CandidateProfileCard({candidate}: {candidate:Candidate}){
  const label=labels[candidate.slug]??{name:candidate.name,cta:'Read biography'};
  return <article className="group grid min-w-0 overflow-hidden rounded-[26px] border border-[#d4e6d9] bg-white shadow-[0_14px_48px_rgba(6,68,43,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_65px_rgba(6,68,43,0.14)] sm:grid-cols-[42%_58%]">
    <div className="relative isolate min-h-[300px] overflow-hidden bg-[#075137] sm:min-h-[410px]">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#2565bf_0%,#0a296b_52%,#061843_100%)]"/>
      <div aria-hidden="true" className="absolute -bottom-28 -left-32 h-72 w-80 rotate-[-28deg] rounded-[36px] bg-[#c91b3a]"/>
      <div aria-hidden="true" className="absolute -right-32 top-[10%] h-64 w-64 rounded-full border-[38px] border-[#068A4F]/55"/>
      <Image src={candidate.image} alt={candidate.imageAlt} fill
        sizes="(max-width:640px) 100vw, (max-width:1024px) 42vw, 24vw"
        unoptimized={candidate.image.startsWith('https://')}
        className="relative z-[1] object-cover object-top transition-transform duration-700 group-hover:scale-[1.045]"/>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[#061840]/25 via-transparent to-transparent"/>
    </div>
    <div className="relative flex min-w-0 flex-col justify-center overflow-hidden px-6 py-9 sm:px-7 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 -right-32 size-72 rounded-full border-[32px] border-[#eff8f1]"/>
      <div className="relative mb-10 self-end text-right">
        <span className="block text-[24px] font-semibold leading-none tracking-[-.06em] text-[#081b4d]">OBIDIENT</span>
        <span className="mt-1 block text-[9px] font-medium uppercase tracking-[.07em] text-[#27436d]">Benue · NDC</span>
        <span aria-hidden="true" className="mt-1.5 ml-auto flex w-16"><span className="h-[3px] flex-1 bg-[#163881]"/><span className="h-[3px] flex-1 bg-[#d91d3f]"/></span>
      </div>
      <p className="relative text-[11px] font-semibold uppercase leading-5 tracking-[.14em] text-[#c52633]">{candidate.office}</p>
      <div aria-hidden="true" className="relative mt-3 h-[3px] w-10 rounded-full bg-[#ed3237]"/>
      <h3 className="relative mt-6 break-words text-[clamp(1.75rem,2.55vw,2.7rem)] font-semibold leading-[1.08] tracking-[-.05em] text-[#071a4e]">{label.name}</h3>
      <p className="relative mt-5 text-sm leading-7 text-[#324767]">{candidate.intro}</p>
      <div className="relative mt-7">
        <Link href={'/leadership/'+candidate.slug} aria-label={'Read the biography of '+candidate.name}
          className="inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-[#c81938] px-5 py-3 text-[13px] font-semibold !text-white transition hover:bg-[#99102a]">
          {label.cta} <ArrowUpRight size={17} aria-hidden="true"/>
        </Link>
      </div>
    </div>
  </article>;
}
