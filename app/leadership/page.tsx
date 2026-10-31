import type {Metadata} from 'next';
import {PageIntro} from '@/components/ui/PageIntro';
import {candidates} from '@/content/candidates';
import {CandidateProfileCard} from '@/features/leadership/CandidateProfileCard';
export const metadata:Metadata={title:'The Candidates'};
export default function Leadership(){
  return <main id="main-content">
    <PageIntro eyebrow="Leadership" title="Meet the candidates." description="Experience, background and public service across national and Benue State leadership."/>
    <section className="bg-[#f5f8fd] py-16 sm:py-24" aria-label="Candidate profiles">
      <div className="container-shell grid gap-6 lg:grid-cols-2">
        {candidates.map(candidate=><CandidateProfileCard key={candidate.slug} candidate={candidate}/>)}
      </div>
    </section>
  </main>;
}
