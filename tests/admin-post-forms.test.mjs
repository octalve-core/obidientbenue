import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('admin page hands session proofs to typed client actions',()=>{
 const page=src('app/admin/registrations/page.tsx');
 assert.match(page,/adminFormToken\('logout'\)/);
 assert.match(page,/adminFormToken\('export'\)/);
 assert.match(page,/<AdminLogoutAction token=\{logoutToken\}/);
 assert.match(page,/<AdminExportActions token=\{exportToken\}/);
});
test('client sends signed proofs in same-origin requests and handles errors on-page',()=>{
 const client=src('features/admin/AdminActions.tsx');
 assert.match(client,/credentials:'same-origin'/);
 assert.match(client,/'X-Admin-CSRF':token/);
 assert.match(client,/role="alert"/);
 assert.match(client,/URL\.createObjectURL/);
});
test('CSV export and logout require verified action proof before side effects',()=>{
 for(const [path,purpose] of [
  ['app/api/admin/registrations/export/route.ts','export'],
  ['app/api/admin/auth/logout/route.ts','logout']
 ]){
  const content=src(path);
  assert.match(content,new RegExp("verifyAdminAction\\(req,'"+purpose+"'"));
 }
});
test('server binds tokens to the verified admin session',()=>{
 const helper=src('lib/admin-write-origin.ts');
 assert.match(helper,/getAdminEmail\(\)/);
 assert.match(helper,/SESSION_COOKIE/);
 assert.match(helper,/checkAdminProof/);
});
