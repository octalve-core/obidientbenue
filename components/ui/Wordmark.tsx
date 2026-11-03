'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';
export function Wordmark(){
 const [available,setAvailable]=useState(true);
 return <Link href="/" aria-label="Obidient Benue home" className="inline-flex shrink-0 items-center">
  {available?<Image
    src="/brand/obidient-benue-wordmark-light.webp"
    width={680} height={227}
    alt="Obidient Benue"
    priority
    onError={()=>setAvailable(false)}
    className="h-auto w-[174px] object-contain sm:w-[212px] lg:w-[226px]"
  />:<span className="inline-flex items-center gap-2.5 text-[#06452e]">
    <Image src="/brand/ndc-logo.webp" alt="NDC logo" width={38} height={49} className="h-[49px] w-[38px] shrink-0 object-contain"/>
    <span className="text-lg font-semibold tracking-tight">Obidient Benue</span>
  </span>}
 </Link>;
}
