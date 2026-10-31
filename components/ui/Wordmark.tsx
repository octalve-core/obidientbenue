import Image from 'next/image';
import Link from 'next/link';
export function Wordmark(){return <Link href="/" aria-label="Obidient Benue home" className="flex items-center gap-2.5 text-[var(--brand-navy)]">
  <Image src="/brand/ndc-logo.webp" width={38} height={49} alt="NDC logo" className="h-[49px] w-[38px] shrink-0 object-contain" priority/>
  <span className="flex flex-col leading-none"><span className="text-[19px] font-semibold tracking-[-.05em]">Obidient<span className="text-[var(--brand-red)]">.</span>Benue</span><span className="mt-1 text-[9px] font-medium uppercase tracking-[.25em] text-slate-500">Benue State · Nigeria</span></span>
</Link>}
