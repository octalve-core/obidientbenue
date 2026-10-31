import catalog from '@/data/benue-directory.json';
export type LGA={code:string;name:string};
export type Ward={code:string;lgaCode:string;name:string};
export type PollingUnit={code:string;lgaCode:string;wardCode:string;name:string;location:string};
const lgas: LGA[]=catalog.lgas;
const wards: Ward[]=catalog.wards;
const units: PollingUnit[]=catalog.units;
const healthy=lgas.length===23 && wards.length===276 && units.length===5102 && new Set(units.map(x=>x.code)).size===units.length;
export function directoryReady(){return healthy;}
export function getLGAs(){return healthy?lgas:[];}
export function getWards(lga:string){return healthy?wards.filter(w=>w.lgaCode===lga):[];}
export function getPollingUnits(lga:string,ward:string){return healthy?units.filter(u=>u.lgaCode===lga&&u.wardCode===ward):[];}
export function verifyLocation(lga:string,ward:string,pu:string){return healthy?units.find(u=>u.lgaCode===lga&&u.wardCode===ward&&u.code===pu)||null:null;}
