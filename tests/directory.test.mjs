import test from 'node:test';import assert from 'node:assert/strict';
import {parseCSV,buildBenue} from '../scripts/import-inec.mjs';
test('RFC quoted commas and CRLF are preserved',()=>{const rows=parseCSV('a,b,c\r\n07,"SCHOOL, NORTH",001\r\n');assert.deepEqual(rows,[['a','b','c'],['07','SCHOOL, NORTH','001']])});
test('reject incomplete directory without guessed records',()=>{const csv='state_code,state_name,lga_code,lga_name,ward_code,ward_name,pu_code,pu_name,pu_location,full_code\n07,BENUE,01,AGATU,01,WARD,001,EXAMPLE,ROAD,07/01/01/001\n';assert.throws(()=>buildBenue(csv),/Unverified Benue record totals/)});
test('reject duplicated unit codes',()=>{const header='state_code,state_name,lga_code,lga_name,ward_code,ward_name,pu_code,pu_name,pu_location,full_code\n';const line='07,BENUE,01,AGATU,01,WARD,001,EXAMPLE,ROAD,07/01/01/001\n';assert.throws(()=>buildBenue(header+line+line),/Missing\/duplicate unit/)});
