import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('admin forms submit the authenticated action token for logout and both exports',()=>{
 const page=src('app/admin/registrations/page.tsx');
 assert.match(page,/adminFormToken\('logout'\)/);
 assert.match(page,/adminFormToken\('export'\)/);
 assert.match(page,/<input type="hidden" name="_csrf" value=\{logoutToken\}/);
 assert.equal((page.match(/<input type="hidden" name="_csrf" value=\{exportToken\}/g)||[]).length,2);
});
test('export and logout require CSRF proof before side effects',()=>{
 for(const [path,purpose] of [['app/api/admin/registrations/export/route.ts','export'],['app/api/admin/auth/logout/route.ts','logout']]){
  assert.match(src(path),new RegExp("validAdminFormPost\\(req,form,'"+purpose+"'\\)"));
 }
});
test('CSRF proof is session-bound and verified in constant time',()=>{
 const file=src('lib/admin-write-origin.ts');
 assert.match(file,/createHmac\('sha256'/);
 assert.match(file,/timingSafeEqual/);
 assert.match(file,/sec-fetch-site/);
 assert.match(file,/getAdminEmail\(\)/);
});
