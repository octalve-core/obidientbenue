'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {ArrowUpRight,ArrowRight,Pause,Play} from 'lucide-react';
const slides=[
 {src:'/images/shija-edoh-campaign.webp',alt:'Shija–Edoh campaign portrait',label:'Benue State · 2027'},
 {src:'https://upload.wikimedia.org/wikipedia/commons/1/11/Peter_Obi_2022.jpg',alt:'Peter Obi portrait',label:'National leadership'},
 {src:'https://upload.wikimedia.org/wikipedia/commons/8/81/Rabiu_Kwankwaso_%28cropped%29.jpg',alt:'Rabiu Musa Kwankwaso portrait',label:'Public service'}
];
export function Hero(){
 const [active,setActive]=useState(0),[playing,setPlaying]=useState(true);
 useEffect(()=>{if(!playing)return;const t=window.setInterval(()=>setActive(x=>(x+1)%slides.length),6500);return()=>window.clearInterval(t)},[playing]);
 return <section className="relative isolate overflow-hidden bg-[#071c4e] text-white" aria-label="Obidient Benue">
  <div className="absolute inset-0" aria-hidden="true">{slides.map((s,i)=><div key={s.src} className={'absolute inset-0 transition-opacity duration-1000 '+(i===active?'opacity-100':'opacity-0')}><Image src={s.src} fill alt="" priority={i===0} sizes="100vw" unoptimized={s.src.startsWith('https://')} className={'object-cover '+(i===0?'object-center':'object-[70%_30%]')+' '+(i===active&&playing?'animate-[hero-zoom_8s_ease-out_forwards]':'')}/></div>)}</div>
  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#04122afa_0%,#051a43e8_41%,#061c4b77_100%)]"/>
  <div className="container-shell relative flex min-h-[660px] flex-col justify-center py-20 sm:min-h-[720px]"><div className="max-w-[740px]">
   <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-5 py-2 text-xs font-medium uppercase tracking-[.17em] text-white">Benue State · Nigeria</p>
   <h1 className="mt-8 text-[clamp(3.5rem,8vw,7.25rem)] font-medium leading-[.98] tracking-[-.06em]">Obidient<br/><span className="text-[#d3e3ff]">Benue.</span></h1>
   <p className="mt-8 max-w-xl text-lg leading-9 text-[#f1f5ff]">Leadership, service and community participation across Benue State.</p>
   <div className="mt-10 flex flex-wrap gap-3"><Link href="/leadership" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#071d54] transition hover:bg-blue-50">Meet the candidates <ArrowUpRight size={17}/></Link><Link href="/register" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#f8c0cb] bg-[#bd1838] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#91112b]">Register <ArrowRight size={17}/></Link></div>
  </div><div className="mt-14 flex items-center gap-4"><div className="flex gap-2" role="group" aria-label="Featured image selection">{slides.map((s,i)=><button key={s.src} type="button" onClick={()=>setActive(i)} aria-label={'View image '+(i+1)} aria-current={i===active?'true':undefined} className={'h-2 rounded-full transition-all '+(i===active?'w-11 bg-white':'w-5 bg-white/40 hover:bg-white/75')}/>)}</div><button type="button" onClick={()=>setPlaying(x=>!x)} aria-label={playing?'Pause slideshow':'Play slideshow'} className="grid size-9 place-items-center rounded-full border border-white/40 text-white">{playing?<Pause size={15}/>:<Play size={15}/>}</button><span className="text-xs font-medium uppercase tracking-wider text-white/85">{slides[active].label}</span></div></div>
 </section>;
}
