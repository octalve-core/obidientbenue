export function PageIntro({eyebrow,title,description}:{eyebrow:string;title:string;description:string}){
 return <section className="relative overflow-hidden bg-[#06452e] py-20 text-white sm:py-28">
  <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-44 size-[450px] rounded-full border-[80px] border-[#27b77c]/25"/>
  <div className="container-shell relative"><p className="text-xs font-semibold uppercase tracking-[.25em] text-[#b9f2d3]">{eyebrow}</p>
   <h1 className="mt-4 max-w-[900px] text-[clamp(2.8rem,6vw,6rem)] font-medium leading-[1.06] tracking-[-.07em]">{title}</h1>
   <p className="mt-7 max-w-2xl text-[17px] leading-8 text-[#e2f5ea]">{description}</p>
  </div>
 </section>;
}
