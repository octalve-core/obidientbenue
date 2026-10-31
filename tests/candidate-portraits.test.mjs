import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const source=readFileSync(resolve(root,'content/candidates.ts'),'utf8');
const candidateImages=[...source.matchAll(/\bimage:'([^']+)'/g)].map(match=>match[1]);
const expected=[
 '/images/peter-obi-campaign-portrait.png',
 '/images/rabiu-kwankwaso-campaign-portrait.png',
 '/images/prof-terhemba-shija-campaign-portrait.png',
 '/images/dr-raymond-edoh-campaign-portrait.png'
];

test('all candidate portraits are supplied local assets',()=>{
 assert.deepEqual(candidateImages,expected);
 for(const asset of candidateImages){
  assert.ok(asset.startsWith('/images/'),asset+' must be a local image');
  assert.ok(existsSync(resolve(root,'public'+asset)),asset+' is missing');
 }
});
