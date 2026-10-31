'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu,X,ArrowUpRight } from 'lucide-react';
import { useEffect,useState } from 'react';
import { navigation } from '@/content/site';
import { Wordmark } from '@/components/ui/Wordmark';
export function Header(){const [open,setOpen]=useState(false);const pathname=usePathname();useEffect(()=>{function esc(e:KeyboardEvent){if(e.key==='Escape')setOpen(false)}window.addEventListener('keydown',esc);return()=>window.removeEventListener('keydown',esc)},[]);
return <header className="sticky top-0 z-40 border-b border-[#e4eaf4] bg-white/95 backdrop-blur-xl"><div className="container-shell flex min-h-[78px] items-center justify-between gap-4"><Wordmark/><nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">{navigation.map(item=><Link key={item.href} href={item.href} aria-current={pathname===item.href?'page':undefined} className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${pathname===item.href?'bg-blue-50 text-[var(--brand-blue)]':'text-slate-600 hover:bg-blue-50 hover:text-[var(--brand-blue)]'}`}>{item.label}</Link>)}</nav><div className="hidden lg:block"><Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-red)] px-5 py-3 text-[13px] font-medium text-white transition hover:bg-[#c91a32]">Registration <ArrowUpRight size={15}/></Link></div><button onClick={()=>setOpen(x=>!x)} className="grid size-11 place-items-center rounded-xl border border-slate-200 lg:hidden" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} aria-controls="mobile-menu">{open?<X size={22}/>:<Menu size={22}/>}</button></div>
{open&&<nav id="mobile-menu" aria-label="Mobile navigation" className="border-t border-slate-100 bg-white px-5 pb-6 pt-3 lg:hidden">{navigation.map(item=><Link key={item.href} href={item.href} onClick={()=>setOpen(false)} className="block rounded-xl px-3 py-3 text-base font-medium text-slate-700 hover:bg-blue-50">{item.label}</Link>)}</nav>}
</header>}
