'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {ArrowUpRight,ArrowRight,Pause,Play} from 'lucide-react';
const slides=[
  {src:'/images/hero-rally-01.webp',label:'Benue State · 2027'},
  {src:'/images/hero-rally-02.webp',label:'Leadership and service'},
  {src:'/images/hero-rally-03.webp',label:'Community participation'}
];

export function Hero(){
  const [active,setActive]=useState(0);
  const [playing,setPlaying]=useState(true);
  useEffect(()=>{
    if(!playing)return;
    const timer=window.setInterval(()=>setActive(i=>(i+1)%slides.length),6500);
    return ()=>window.clearInterval(timer);
  },[playing]);

  return <section
    aria-label="Obidient Benue"
    className="relative isolate flex min-h-[calc(100svh-78px)] flex-col overflow-hidden bg-[#06472f] text-white lg:min-h-[calc(100dvh-78px)]"
  >
    <div className="absolute inset-0" aria-hidden="true">
      {slides.map((slide,index)=><div key={slide.src}
        className={'absolute inset-0 transition-opacity duration-1000 '+(index===active?'opacity-100':'opacity-0')}>
        <Image src={slide.src} alt="" fill priority={index===0} sizes="100vw"
          className={'object-cover object-center motion-reduce:transform-none '+(index===active&&playing?'animate-[hero-zoom_8s_ease-out_forwards]':'')}/>
      </div>)}
    </div>
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(3,36,24,0.96)_0%,rgba(5,53,35,0.86)_40%,rgba(4,56,33,0.53)_100%)]"/>
    <div className="container-shell relative flex w-full flex-1 flex-col justify-between gap-12 py-14 sm:py-16 lg:py-[clamp(3rem,6vh,5rem)]">
      <div className="my-auto max-w-[760px] py-6">
        <p className="inline-flex rounded-full border border-white/35 bg-white/10 px-5 py-2.5 text-xs font-medium uppercase tracking-[.16em] text-white backdrop-blur-sm">
          Benue State · Nigeria
        </p>
        <h1 className="mt-8 text-[clamp(3.8rem,8vw,7.5rem)] font-medium leading-[.99] tracking-[-.065em] text-white">
          Obidient<br/><span className="text-[#d9f5e5]">Benue.</span>
        </h1>
        <p className="mt-7 max-w-[560px] text-base leading-8 text-white/95 sm:text-lg sm:leading-9">
          Leadership, service and community participation across Benue State.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link href="/leadership" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#b91f2d] px-7 py-3 text-sm font-semibold !text-white shadow-[0_8px_25px_rgba(10,14,43,0.15)] transition hover:bg-[#a4122e]">
            Meet the candidates <ArrowUpRight size={17} aria-hidden="true"/>
          </Link>
          <Link href="/register" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/70 bg-white/10 px-7 py-3 text-sm font-semibold !text-white backdrop-blur-sm transition hover:bg-white/20">
            Register <ArrowRight size={17} aria-hidden="true"/>
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2" role="group" aria-label="Featured image selection">
          {slides.map((slide,index)=><button key={slide.src} type="button" onClick={()=>setActive(index)}
            aria-label={'Show image '+(index+1)} aria-current={index===active?'true':undefined}
            className={'h-2.5 rounded-full transition-all '+(index===active?'w-11 bg-white':'w-5 bg-white/40 hover:bg-white/75')}/>)}
        </div>
        <button type="button" onClick={()=>setPlaying(p=>!p)}
          aria-label={playing?'Pause slideshow':'Resume slideshow'}
          className="grid size-9 place-items-center rounded-full border border-white/50 text-white transition hover:bg-white/15">
          {playing?<Pause size={15}/>:<Play size={15}/>}
        </button>
        <span className="text-xs font-medium uppercase tracking-[.14em] text-white/85">{slides[active].label}</span>
      </div>
    </div>
  </section>;
}
