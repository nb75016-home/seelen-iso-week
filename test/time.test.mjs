import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { isoWeek, weekLabel, monthRows } from '../src/time.js';
const require = createRequire(process.env.BUILD_DEPS ? path.resolve(process.env.BUILD_DEPS, 'package.json') : import.meta.url);
const Sandbox = require('@nyariv/sandboxjs').default;
test('ISO year boundaries, week 53 and requested S36', () => {
  for (const [day, year, week] of [['2015-12-31',2015,53],['2016-01-01',2015,53],['2016-01-04',2016,1],['2019-12-30',2020,1],['2021-01-03',2020,53],['2021-01-04',2021,1],['2026-09-05',2026,36],['2027-01-01',2026,53]]) {
    assert.deepEqual(isoWeek(new Date(day + 'T12:00:00')), { year, week });
  }
  assert.equal(weekLabel(1), 'S01'); assert.equal(weekLabel(1,'Sx'), 'S1'); assert.equal(weekLabel(36),'S36');
});
test('Calendar rows remain Monday–Sunday across leap years and DST', () => {
  for (let year=1990; year<=2040; year++) for (let month=0; month<12; month++) {
    const rows=monthRows(year,month), days=rows.flat();
    assert.equal(days.length,42);
    rows.forEach(row => { assert.equal(row[0].getDay(),1); assert.equal(row[6].getDay(),0); });
    const count=new Date(year,month+1,0).getDate();
    assert.equal(days.filter(d=>d.getMonth()===month).length,count);
  }
});

test('Toolbar template and popup trigger work in Seelen SandboxJS', () => {
  const sandbox=new Sandbox();
  const script=fs.readFileSync(new URL('../resource/toolbar/template.js',import.meta.url),'utf8');
  const now=new Date();
  const value=sandbox.compile(script)({date:'localized date',icon:name=>name}).run();
  const date=String(now.getDate()).padStart(2,'0')+'/'+String(now.getMonth()+1).padStart(2,'0')+'/'+now.getFullYear();
  assert.equal(value,weekLabel(isoWeek(now).week)+' · '+date);
  const click=fs.readFileSync(new URL('../resource/toolbar/onClick.js',import.meta.url),'utf8');
  let target; sandbox.compile(click)({trigger:id=>{target=id;}}).run();
  assert.equal(target,'@nicolas/iso-week-popup');
});
test('Distributable embeds the widget and its toolbar plugin without local paths', () => {
  const yaml=require('js-yaml');
  const raw=fs.readFileSync(new URL('../bundles/iso-week.yml',import.meta.url),'utf8');
  const widget=yaml.load(raw);
  assert.equal(widget.id,'@nicolas/iso-week-popup');
  assert.equal(widget.preset,'Popup'); assert.equal(widget.lazy,true);
  assert.equal(widget.plugins[0].target,'@seelen/fancy-toolbar');
  assert.deepEqual(widget.plugins[0].plugin.scopes,['Date']);
  assert.ok(widget.html && widget.js && widget.css);
  assert.ok(!raw.includes('C:\\Users') && !raw.includes('!include') && !raw.includes('!extend'));
});
