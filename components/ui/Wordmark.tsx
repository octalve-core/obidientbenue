import Image from 'next/image';
import Link from 'next/link';
export function Wordmark(){
 return <Link href="/" aria-label="Obidient Benue home" className="inline-flex shrink-0 items-center">
  <Image src="/brand/obidient-benue-wordmark-light.webp" alt="Obidient Benue" width={680} height={227}
   priority unoptimized className="h-auto w-[180px] object-contain sm:w-[213px] lg:w-[230px]"/>
 </Link>;
}
