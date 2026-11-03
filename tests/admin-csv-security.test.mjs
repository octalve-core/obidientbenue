import test from 'node:test';
import assert from 'node:assert/strict';
import {csvCell} from '../lib/csv-escape.mjs';

test('properly quotes commas, quotes and controls',()=>{
 assert.equal(csvCell('Alice, "Junior"'),'"Alice, ""Junior"""');
 assert.equal(csvCell('Line 1\r\nLine 2'),'"Line 1  Line 2"');
});
test('neutralises spreadsheet formulas and Unicode variants',()=>{
 for(const value of ['=1+1','+1+2','-1+2','@SUM(1)','  =HYPERLINK(1)','＝1+1','＠SUM(1)']){
  const formatted=csvCell(value);
  assert.ok(formatted.startsWith('"\t'),value+' must begin with a text marker');
 }
});
test('preserves phone and electoral codes as text',()=>{
 assert.equal(csvCell('08001234567',true),'"\'08001234567"');
 assert.equal(csvCell('07/13/01/001',true),'"\'07/13/01/001"');
});
