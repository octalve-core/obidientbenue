import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {candidates} from '@/content/candidates';
import {CandidateProfileCard} from '@/features/leadership/CandidateProfileCard';

export function Candidates(){
  return <section className="bg-[#f4faf5] py-20 sm:py-28" aria-labelledby="candidate-section-title">
    <div className="container-shell">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-7">
        <div><p className="text-xs font-semibold uppercase tracking-[.19em] text-[#be1a39]">Meet the ticket</p>
          <h2 id="candidate-section-title" className="mt-4 max-w-3xl text-[clamp(2.6rem,5vw,4.75rem)] font-medium leading-[1.08] tracking-[-.055em] text-[#06472f]">The candidates.</h2>
        </div>
        <Link href="/leadership" className="inline-flex items-center gap-2 rounded-full border border-[#b7c8e3] bg-white px-6 py-3 text-sm font-semibold text-[#092e7c] transition hover:border-[#123d95] hover:bg-[#e8f0fe]">
          Explore all profiles <ArrowUpRight size={17} aria-hidden="true"/>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {candidates.map(candidate=><CandidateProfileCard key={candidate.slug} candidate={candidate}/>)}
      </div>
    </div>
  </section>;
}
