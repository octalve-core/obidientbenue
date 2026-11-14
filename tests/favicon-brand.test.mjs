import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
test('site metadata points to the official Obidient logo, not NDC',()=>{
 const source=readFileSync(resolve(root,'app/layout.tsx'),'utf8');
 assert.match(source,/icons:\{icon:/);
 assert.match(source,/obidient-benue-favicon\.png/);
 assert.doesNotMatch(source,/icons:\{icon:'\/brand\/ndc-icon\.webp'/);
});
test('official browser icon is a valid, square PNG',()=>{
 const image=readFileSync(resolve(root,'public/brand/obidient-benue-favicon.png'));
 const auto=readFileSync(resolve(root,'app/icon.png'));
 assert.equal(image.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 assert.equal(image.readUInt32BE(16),128);
 assert.equal(image.readUInt32BE(20),128);
 assert.deepEqual(image,auto);
});
