import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),root=path.join(base,'..','dist');
const pages=new Map(fs.readdirSync(root).filter(f=>f.endsWith('.html')).map(f=>[f,fs.readFileSync(path.join(root,f),'utf8')]));
const pageIds=new Map();
for(const [file,html] of pages){const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,'Duplicate IDs in '+file);pageIds.set(file,new Set(ids));}
for(const [file,html] of pages){
  for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g)){
    const url=new URL(m[1].replaceAll('&amp;','&'),'https://local.test/'+file);
    if(url.origin!=='https://local.test')continue;
    const target=decodeURIComponent(url.pathname.slice(1))||'index.html';
    assert(fs.existsSync(path.join(root,target)),file+': Missing local target '+target);
    if(url.hash&&pageIds.has(target))assert(pageIds.get(target).has(decodeURIComponent(url.hash.slice(1))),file+': Broken link '+m[1]);
  }
  for(const m of html.matchAll(/<img\b[^>]*>/g))assert(/alt="[^"]*"/.test(m[0]),file+': Missing image alt');
  for(const m of html.matchAll(/<iframe\b[^>]*>/g))assert(/title="[^"]+"/.test(m[0]),file+': Missing player title');
  for(const schema of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs))JSON.parse(schema[1]);
}
for(const f of fs.readdirSync(root).filter(f=>f.endsWith('.js')))new vm.Script(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'config.js'),'utf8'),context);assert(Array.isArray(context.window.FLEX_CONFIG.featuredBeats),'featuredBeats must be an array');
const bytes=fs.readdirSync(path.join(root,'assets')).reduce((n,f)=>n+fs.statSync(path.join(root,'assets',f)).size,0);
console.log(JSON.stringify({status:'passed',pages:pages.size,assetBytes:bytes,checks:['unique IDs','cross-page links and anchors','local assets','image alternatives','player titles','JavaScript syntax','structured data','beat configuration']}));
