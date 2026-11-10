import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
function extract(name){const start=html.indexOf(`function ${name}(`);assert.ok(start>=0,`${name} exists`);let brace=html.indexOf('{',start),depth=0;for(let i=brace;i<html.length;i++){if(html[i]==='{')depth++;else if(html[i]==='}'&&--depth===0)return html.slice(start,i+1)}throw Error('unterminated function')}
const context={Date,Number,Object,Array,Error,TextDecoder,MAX_HISTORY:10000};
vm.createContext(context);vm.runInContext(extract('cleanProgress')+'\n'+extract('readJsonResponseLimited').replace(/^function /,'async function '),context);
const valid={xp:12,attempts:2,unlocked:false,history:{'base-001':{course:'base',correct:true,time:Date.now(),tier:1}},best:{base:80}};
const cleaned=context.cleanProgress(valid);assert.equal(cleaned.xp,12);assert.notEqual(cleaned.history,valid.history);
for(const bad of [null,{...valid,xp:Infinity},{...valid,attempts:-1},{...valid,history:{x:{course:'base',correct:true,time:Date.now(),tier:999}}}])assert.throws(()=>context.cleanProgress(bad));
const polluted=JSON.parse('{"xp":0,"attempts":0,"unlocked":false,"history":{"__proto__":{"course":"base","correct":true,"time":0,"tier":1}},"best":{}}');assert.throws(()=>context.cleanProgress(polluted));
const huge={...valid,history:Object.fromEntries(Array.from({length:10001},(_,i)=>[`base-${i}`,valid.history['base-001']]))};assert.throws(()=>context.cleanProgress(huge));
function response(chunks,length=null){let i=0,cancelled=false;return {headers:{get:()=>length},body:{getReader:()=>({read:async()=>i<chunks.length?{done:false,value:new TextEncoder().encode(chunks[i++])}:{done:true},cancel:async()=>{cancelled=true},releaseLock(){}})},get cancelled(){return cancelled}}}
assert.equal((await context.readJsonResponseLimited(response(['{"ok":', 'true}']),64)).ok,true);
await assert.rejects(()=>context.readJsonResponseLimited(response(['{"x":"','1234567890','"}']),8),/too large/);
await assert.rejects(()=>context.readJsonResponseLimited(response(['{}'],'100'),8),/too large/);
console.log('PASS academy security validation');
