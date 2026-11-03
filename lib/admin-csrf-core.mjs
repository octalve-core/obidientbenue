import {createHmac,timingSafeEqual} from 'node:crypto';

const allowedOrigins=new Set([
 'https://www.obidientbenue.com',
 'https://obidientbenue.com',
 'https://obidientbenue.vercel.app'
]);
const validActions=new Set(['export','logout']);

export function generateAdminProof(session,secret,action){
 if(typeof session!=='string'||!session||typeof secret!=='string'||secret.length<32||!validActions.has(action))throw new Error('Invalid proof inputs');
 return createHmac('sha256',secret).update('obidient-benue:admin-action:v2\0'+action+'\0'+session).digest('hex');
}

export function checkAdminProof({session,secret,action,token,origin,fetchSite}){
 // A CSRF token cannot substitute for rejecting untrusted cross-site requests.
 if(fetchSite==='cross-site')return {ok:false,reason:'cross_site'};
 if(fetchSite&& !['same-origin','same-site','none'].includes(fetchSite))return {ok:false,reason:'fetch_site'};
 // Privacy-mode browsers can omit Origin; accept only with a valid signed proof.
 if(origin&&origin!=='null'&&!allowedOrigins.has(origin))return {ok:false,reason:'origin'};
 if(origin==='null'&&fetchSite!=='same-origin')return {ok:false,reason:'origin'};
 if(!session)return {ok:false,reason:'session'};
 if(typeof token!=='string'||!/^[a-f0-9]{64}$/i.test(token))return {ok:false,reason:'missing_proof'};
 if(typeof secret!=='string'||secret.length<32)return {ok:false,reason:'server_config'};
 let expected;
 try{expected=Buffer.from(generateAdminProof(session,secret,action),'hex');}catch{return {ok:false,reason:'server_config'}}
 const got=Buffer.from(token,'hex');
 if(got.length===expected.length&&timingSafeEqual(got,expected))return {ok:true,reason:'ok'};
 // Transitional support for signed session-bound proofs from the previous release.
 // It lets an already-open admin tab submit without weakening authentication.
 const legacy=createHmac('sha256',secret).update('obidient-benue:admin-csrf:v1\0'+action+'\0'+session).digest();
 return got.length===legacy.length&&timingSafeEqual(got,legacy)
  ?{ok:true,reason:'ok'}:{ok:false,reason:'invalid_proof'};
}
