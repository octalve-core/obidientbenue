import test from 'node:test';
import assert from 'node:assert/strict';
import {generateAdminProof,checkAdminProof} from '../lib/admin-csrf-core.mjs';

const session='header.payload.signature-from-signed-session';
const secret='a_cryptographically_random_signing_secret_longer_than_32_characters';
const proof=generateAdminProof(session,secret,'export');
const base={session,secret,action:'export',token:proof,origin:'https://www.obidientbenue.com',fetchSite:'same-origin'};

test('accepted on canonical and original production origins',()=>{
 for(const origin of ['https://www.obidientbenue.com','https://obidientbenue.com','https://obidientbenue.vercel.app']){
  assert.equal(checkAdminProof({...base,origin}).ok,true,origin);
 }
});
test('privacy-mode missing origin stays valid only with proper session-bound proof',()=>{
 assert.equal(checkAdminProof({...base,origin:null}).ok,true);
 assert.equal(checkAdminProof({...base,origin:'null',fetchSite:'same-origin'}).ok,true);
 assert.equal(checkAdminProof({...base,origin:'null',fetchSite:'none'}).ok,false);
});
test('rejects cross-site, forged origins and invalid fetch metadata',()=>{
 for(const input of [{fetchSite:'cross-site'},{origin:'https://attacker.example'},{fetchSite:'unexpected'}]){
  assert.equal(checkAdminProof({...base,...input}).ok,false);
 }
});
test('rejects missing, tampered, wrong action or wrong session proofs',()=>{
 for(const input of [{token:''},{token:'0'.repeat(64)},{session:'another-session'},{action:'logout'},{secret:'different-long-secret-value-of-minimum-32-characters'}]){
  assert.equal(checkAdminProof({...base,...input}).ok,false);
 }
});
test('logout proof is purpose-separated from export',()=>{
 const logout=generateAdminProof(session,secret,'logout');
 assert.equal(checkAdminProof({...base,action:'logout',token:logout}).ok,true);
 assert.notEqual(logout,proof);
});
