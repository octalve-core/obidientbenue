import Link from 'next/link';
export function Wordmark(){return <Link href="/" aria-label="Obidient Benue home" className="flex items-center gap-2.5 text-[var(--brand-navy)]">
  <span aria-hidden="true" className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--brand-navy)] text-lg font-semibold text-white shadow-[0_6px_20px_#0b2a6940]">OB<span className="absolute -bottom-0.5 right-0 h-1 w-5 rounded-full bg-[var(--brand-red)]"/></span>
  <span className="flex flex-col leading-none"><span className="text-[19px] font-semibold tracking-[-.05em]">Obidient<span className="text-[var(--brand-red)]">.</span>Benue</span><span className="mt-1 text-[9px] font-medium uppercase tracking-[.25em] text-slate-500">Benue State · Nigeria</span></span>
</Link>}
