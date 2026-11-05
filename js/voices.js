/* Nhím family voices: a parent or grandparent records words, and their voice replaces the computer voice.
   Recordings stay in this browser (IndexedDB). A voice pack file can carry them to another phone or to cousins. */
(function(){
const DB="nhim-voices",ST="clips",KEY_META="nhim-voices-who";
const keyOf=t=>String(t).normalize("NFC").toLowerCase().replace(/[.,!?;:"“”()…]/g,"").replace(/\s+/g," ").trim();
let db=null,keys=new Set(),ready;
function open(){return new Promise((res,rej)=>{if(!("indexedDB" in window))return rej(new Error("no idb"));
 const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(ST);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
function tx(mode,fn){return new Promise((res,rej)=>{const t=db.transaction(ST,mode),s=t.objectStore(ST);const out=fn(s);t.oncomplete=()=>res(out&&out.result!==undefined?out.result:out);t.onerror=()=>rej(t.error)})}
ready=open().then(d=>{db=d;return tx("readonly",s=>s.getAllKeys())}).then(k=>{keys=new Set(k||[]);document.dispatchEvent(new Event("voices-ready"))}).catch(()=>{});

const has=t=>keys.has(keyOf(t));
const count=()=>keys.size;
async function get(t){if(!db)return null;return tx("readonly",s=>s.get(keyOf(t)))}
async function put(t,rec){await tx("readwrite",s=>s.put(rec,keyOf(t)));keys.add(keyOf(t))}
async function del(t){await tx("readwrite",s=>s.delete(keyOf(t)));keys.delete(keyOf(t))}
async function all(){if(!db)return [];const ks=[...keys],out=[];for(const k of ks){const r=await tx("readonly",s=>s.get(k));if(r)out.push([k,r])}return out}
const who=()=>{try{return localStorage.getItem(KEY_META)||""}catch(e){return ""}};
const setWho=v=>{try{localStorage.setItem(KEY_META,v)}catch(e){}};

/* playback */
let cur=null;
async function play(t,{slow=false}={}){
 const r=await get(t);if(!r)return false;
 stop();const url=URL.createObjectURL(r.blob);cur=new Audio(url);
 cur.playbackRate=slow?.75:1;try{cur.preservesPitch=true;cur.webkitPreservesPitch=true}catch(e){}
 cur.onended=()=>URL.revokeObjectURL(url);
 try{await cur.play()}catch(e){return false}
 return true;
}
function stop(){if(cur){try{cur.pause()}catch(e){}cur=null}}

/* recording */
const canRecord=()=>!!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&window.MediaRecorder);
function pickType(){const c=["audio/webm;codecs=opus","audio/mp4","audio/webm","audio/ogg;codecs=opus"];for(const t of c)try{if(MediaRecorder.isTypeSupported(t))return t}catch(e){}return ""}
let rec=null;
async function startRec(maxMs=7000){
 const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
 const type=pickType(),mr=new MediaRecorder(stream,type?{mimeType:type}:undefined),chunks=[];
 mr.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
 const done=new Promise(res=>{mr.onstop=()=>{stream.getTracks().forEach(t=>t.stop());res(new Blob(chunks,{type:mr.mimeType||type||"audio/webm"}))}});
 mr.start();const timer=setTimeout(()=>{if(mr.state==="recording")mr.stop()},maxMs);
 rec={mr,done,timer};return rec;
}
async function stopRec(){if(!rec)return null;const r=rec;rec=null;clearTimeout(r.timer);if(r.mr.state==="recording")r.mr.stop();return r.done}

/* voice packs: one JSON file with every clip as base64 */
const b64=blob=>new Promise(res=>{const fr=new FileReader();fr.onload=()=>res(String(fr.result).split(",")[1]);fr.readAsDataURL(blob)});
async function exportPack(){
 const items=await all(),clips=[];
 for(const [k,r] of items)clips.push({text:r.text||k,who:r.who||"",type:r.blob.type,ts:r.ts||0,data:await b64(r.blob)});
 const pack={app:"nhim",kind:"voice-pack",version:1,who:who(),made:new Date().toISOString(),clips};
 return new Blob([JSON.stringify(pack)],{type:"application/json"});
}
async function importPack(file){
 const pack=JSON.parse(await file.text());
 if(!pack||pack.kind!=="voice-pack"||!Array.isArray(pack.clips))throw new Error("This isn't a Nhím voice pack.");
 let n=0;
 for(const c of pack.clips){
  if(!c||typeof c.text!=="string"||typeof c.data!=="string"||!/^audio\//.test(c.type||""))continue;
  const bin=atob(c.data),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
  await put(c.text,{text:c.text,who:String(c.who||pack.who||"").slice(0,40),ts:c.ts||Date.now(),blob:new Blob([u],{type:c.type})});n++;
 }
 if(pack.who&&!who())setWho(String(pack.who).slice(0,40));
 return n;
}

window.VOICES={ready,keyOf,has,count,get,put,del,play,stop,canRecord,startRec,stopRec,exportPack,importPack,who,setWho};
})();
