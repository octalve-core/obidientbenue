'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import type {AdminFilters} from '@/lib/admin-records';
type Item={code:string;name:string};
export function RegistrationFilters({initial,lgas}:{initial:AdminFilters;lgas:Item[]}){
 const [lga,setLga]=useState(initial.lga),[ward,setWard]=useState(initial.ward),[pu,setPu]=useState(initial.pu);
 const [wards,setWards]=useState<Item[]>([]),[units,setUnits]=useState<Item[]>([]);
 useEffect(()=>{if(!lga)return;let active=true;fetch('/api/locations?lga='+encodeURIComponent(lga)).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{if(active)setWards(d.items)}).catch(()=>{if(active)setWards([])});return()=>{active=false}},[lga]);
 useEffect(()=>{if(!lga||!ward)return;let active=true;fetch('/api/locations?lga='+encodeURIComponent(lga)+'&ward='+encodeURIComponent(ward)).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{if(active)setUnits(d.items)}).catch(()=>{if(active)setUnits([])});return()=>{active=false}},[lga,ward]);
 const field='mt-2 min-h-11 w-full rounded-xl border border-[#c9ddcf] bg-white px-3 py-2.5 text-sm font-normal text-[#153e2b] outline-none focus:border-[#068A4F] focus:ring-2 focus:ring-[#e0f5e7] disabled:cursor-not-allowed disabled:bg-[#f5f8f5]';
 return <form method="get" action="/admin/registrations" className="rounded-3xl border border-[#dae9df] bg-white p-6 shadow-sm sm:p-8">
 <h2 className="text-lg font-semibold text-[#103f2d]">Find registration records</h2><p className="mt-1 text-sm text-[#617d6b]">Refine by name, location, registration category and date or time.</p>
 <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
  <label className="text-xs font-semibold text-[#315740]">Name, phone or reference<input name="q" type="search" maxLength={100} defaultValue={initial.q} placeholder="Search records" className={field}/></label>
  <label className="text-xs font-semibold text-[#315740]">Registration category<select className={field} name="category" defaultValue={initial.category}><option value="">All categories</option>{[['Member','Member'],['Volunteer','Volunteer'],['Interested','Interested supporter'],['Other','Other']].map(([v,t])=><option key={v} value={v}>{t}</option>)}</select></label>
  <label className="text-xs font-semibold text-[#315740]">Local government<select className={field} name="lga" value={lga} onChange={e=>{setLga(e.target.value);setWard('');setPu('');setWards([]);setUnits([])}}><option value="">All LGAs</option>{lgas.map(x=><option key={x.code} value={x.code}>{x.name}</option>)}</select></label>
  <label className="text-xs font-semibold text-[#315740]">Electoral ward<select className={field} name="ward" value={ward} disabled={!lga} onChange={e=>{setWard(e.target.value);setPu('');setUnits([])}}><option value="">All wards</option>{wards.map(x=><option key={x.code} value={x.code}>{x.name}</option>)}</select></label>
  <label className="text-xs font-semibold text-[#315740]">Polling unit<select className={field} name="pu" value={pu} disabled={!ward} onChange={e=>setPu(e.target.value)}><option value="">All polling units</option>{units.map(x=><option key={x.code} value={x.code}>{x.name} · {x.code}</option>)}</select></label>
  <label className="text-xs font-semibold text-[#315740]">From · Benue local time<input name="from" type="datetime-local" className={field} defaultValue={initial.from}/></label>
  <label className="text-xs font-semibold text-[#315740]">Until · Benue local time<input name="to" type="datetime-local" className={field} defaultValue={initial.to}/></label>
  <div className="flex items-end gap-2"><button type="submit" className="min-h-11 rounded-full bg-[#047546] px-6 text-sm font-semibold !text-white hover:bg-[#055f39]">Apply filters</button><Link href="/admin/registrations" className="inline-flex min-h-11 items-center rounded-full border border-[#c4ddcb] px-5 text-sm font-semibold text-[#075338]">Reset</Link></div>
 </div></form>;
}
