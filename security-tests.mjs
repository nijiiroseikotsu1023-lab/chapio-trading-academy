import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
function extract(name){const start=html.indexOf(`function ${name}(`);assert.ok(start>=0,`${name} exists`);let brace=html.indexOf('{',start),depth=0;for(let i=brace;i<html.length;i++){if(html[i]==='{')depth++;else if(html[i]==='}'&&--depth===0)return html.slice(start,i+1)}throw Error('unterminated function')}
const context={Date,Number,Object,Array,Error,TextDecoder,TextEncoder,console:{warn(){}},MAX_HISTORY:10000,MAX_PROGRESS_BYTES:1024*1024,key:'chapio-academy-v01',recoveryKey:'chapio-academy-v01-recovery',recoveryMode:false,document:{getElementById(){throw Error('simulated UI failure')}},alert(){}};
vm.createContext(context);vm.runInContext(extract('cleanProgress')+'\n'+extract('parseStoredProgress')+'\n'+extract('storageKeyForProgress')+'\n'+extract('emptyProgress')+'\n'+extract('resolveProgressStorage')+'\n'+extract('serializeProgress')+'\n'+extract('persistProgress')+'\n'+extract('refreshProgressUI')+'\n'+extract('save')+'\n'+extract('commitProgress')+'\n'+extract('reviewPriority')+'\n'+extract('entryTrainingFeedback')+'\n'+extract('readJsonResponseLimited').replace(/^function /,'async function '),context);
const valid={xp:12,attempts:2,unlocked:false,history:{'base-001':{course:'base',correct:true,time:Date.now(),tier:1}},best:{base:80}};
const cleaned=context.cleanProgress(valid);assert.equal(cleaned.xp,12);assert.notEqual(cleaned.history,valid.history);
for(const bad of [null,{...valid,xp:Infinity},{...valid,attempts:-1},{...valid,history:{x:{course:'base',correct:true,time:Date.now(),tier:999}}}])assert.throws(()=>context.cleanProgress(bad));
const polluted=JSON.parse('{"xp":0,"attempts":0,"unlocked":false,"history":{"__proto__":{"course":"base","correct":true,"time":0,"tier":1}},"best":{}}');assert.throws(()=>context.cleanProgress(polluted));
const huge={...valid,history:Object.fromEntries(Array.from({length:10001},(_,i)=>[`base-${i}`,valid.history['base-001']]))};assert.throws(()=>context.cleanProgress(huge));
const validRaw=JSON.stringify(valid);assert.equal(context.parseStoredProgress(validRaw).xp,12);assert.equal(context.storageKeyForProgress(false),'chapio-academy-v01');assert.equal(context.storageKeyForProgress(true),'chapio-academy-v01-recovery');
const corruptPrimary='{broken json',recoveryRaw=validRaw;assert.throws(()=>context.parseStoredProgress(corruptPrimary));assert.equal(context.parseStoredProgress(recoveryRaw).xp,12);assert.equal(corruptPrimary,'{broken json');
const recovered=context.resolveProgressStorage(corruptPrimary,recoveryRaw);assert.equal(recovered.recoveryMode,true);assert.equal(recovered.state.xp,12);const restarted=context.resolveProgressStorage(corruptPrimary,JSON.stringify(recovered.state));assert.equal(restarted.recoveryMode,true);assert.equal(restarted.state.xp,12);assert.equal(corruptPrimary,'{broken json');
const recoveryOnly=context.resolveProgressStorage(null,recoveryRaw);assert.equal(recoveryOnly.recoveryMode,true);assert.equal(recoveryOnly.state.xp,12);
assert.throws(()=>context.parseStoredProgress('x'.repeat(1024*1024+1)),/大きすぎ/);
assert.ok(new TextEncoder().encode(context.serializeProgress(valid)).byteLength<=1024*1024);assert.throws(()=>context.serializeProgress({...valid,history:Object.fromEntries(Array.from({length:10000},(_,i)=>[`base-${i}-${'x'.repeat(500)}`,valid.history['base-001']]))}),/1MB|不正/);
let stored=null;context.localStorage={setItem:(k,v)=>{stored={k,v}}};assert.equal(context.persistProgress(valid,false),true);assert.equal(stored.k,'chapio-academy-v01');context.state=context.cleanProgress(valid);context.updateStats=()=>{throw Error('simulated UI failure')};assert.equal(context.save(),true,'a post-save UI error must not be reported as a storage failure');context.localStorage={setItem:()=>{throw Error('quota')}};assert.equal(context.persistProgress(valid,false),false);
context.state=context.cleanProgress(valid);context.save=()=>false;context.updateStats=()=>{throw Error('simulated rollback UI failure')};assert.equal(context.commitProgress(next=>{next.xp+=10}),false);assert.equal(context.state.xp,12);context.save=()=>true;assert.equal(context.commitProgress(next=>{next.xp+=10}),true);assert.equal(context.state.xp,22);
const now=Date.now();assert.ok(context.reviewPriority({correct:false,time:now},now)>context.reviewPriority({correct:true,time:now-864000000},now));assert.ok(context.reviewPriority({correct:false,time:now-1000},now)>context.reviewPriority({correct:false,time:now},now));
assert.match(context.entryTrainingFeedback('up','uncertain',false),/見送り条件/);assert.match(context.entryTrainingFeedback('wait','structure',true),/1本の結果/);
function response(chunks,length=null){let i=0,cancelled=false;return {headers:{get:()=>length},body:{getReader:()=>({read:async()=>i<chunks.length?{done:false,value:new TextEncoder().encode(chunks[i++])}:{done:true},cancel:async()=>{cancelled=true},releaseLock(){}})},get cancelled(){return cancelled}}}
assert.equal((await context.readJsonResponseLimited(response(['{"ok":', 'true}']),64)).ok,true);
await assert.rejects(()=>context.readJsonResponseLimited(response(['{"x":"','1234567890','"}']),8),/too large/);
await assert.rejects(()=>context.readJsonResponseLimited(response(['{}'],'100'),8),/too large/);
assert.match(html,/<meta name="viewport" content="width=device-width,initial-scale=1">/);assert.match(html,/grid-template-columns:repeat\(auto-fit,minmax\(220px,1fr\)\)/);assert.match(html,/#chart\{width:100%;height:auto/);assert.doesNotMatch(html,/min-width:\s*(?:[4-9]\d\d|\d{4,})px/);
console.log('PASS academy security validation');
