import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const context={window:{}};
for(const file of ['config.js','contact.js'])vm.runInNewContext(fs.readFileSync(new URL('../dist/'+file,import.meta.url),'utf8'),context);
const {FLEX_CONTACT:contact,FLEX_CONFIG:config}=context.window;
assert.equal(config.whatsapp,'18298025315');
for(const [kind,message] of Object.entries(contact.messages)){
  const url=new URL(contact.url(config.whatsapp,message));
  assert.equal(url.origin,'https://wa.me');assert.equal(url.pathname,'/18298025315');assert.equal(url.searchParams.get('text'),message);
  assert(message.includes('website'),kind+' should identify the website');
}
const minimal=contact.inquiry(new Map([['name','Test Artist'],['service','Recording']]));
assert(minimal.includes('Name / artist name: Test Artist'));assert(!minimal.includes('Preferred date:'));assert(!minimal.includes('Email:'));assert(!minimal.includes('undefined'));
const full=contact.inquiry(new Map([['name','  José & Friends  '],['service','Custom production'],['date','2026-11-20'],['time','19:30'],['hours','2.5'],['message','R&B / reggaeton\nA new record + a hook.']]));
assert(full.includes('Name / artist name: José & Friends'));assert(full.includes('Preferred time (Punta Cana): 19:30'));assert(full.includes('Approximate hours: 2.5'));
assert.equal(new URL(contact.url(config.whatsapp,full)).searchParams.get('text'),full);
assert.equal(contact.url('bad',full),'');
const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
const links=[...html.matchAll(/<a\b[^>]*data-whatsapp="([^"]+)"[^>]*>/g)];assert.equal(links.length,8);
for(const [tag,kind] of links){const url=new URL(tag.match(/href="([^"]+)"/)[1]);assert.equal(url.pathname,'/18298025315');assert.equal(url.searchParams.get('text'),contact.messages[kind]);}
const form=html.match(/<form id="inquiry-form"[\s\S]*?<\/form>/)[0];
assert(!/name="(?:email|whatsapp|instagram|artist)"/.test(form));assert(form.includes('Continue in WhatsApp'));assert.equal((form.match(/\brequired\b/g)||[]).length,2);
console.log('Passed: WhatsApp destinations and context messages; Unicode and multiline inquiry encoding; optional fields; HTML fallback links; simplified form.');
