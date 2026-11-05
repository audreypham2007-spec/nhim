/* Nhím: app logic.
   Sections: helpers, saved state, course map, exercise builders, quests and badges, screens, lesson player, stories, onboarding. */
(function(){
"use strict";
const {I,ICON_FOR_SCENE,mascot,scene,contour,animateDot,avatar,speak,sfx,confetti}=UI;
const N=window.NHIM,TONES=N.TONES,UNITS=N.UNITS,STORIES=N.STORIES||[];

/* ================= HELPERS ================= */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=(a,n)=>shuffle(a).slice(0,n);
const pad2=n=>String(n).padStart(2,"0");
const dkey=d=>d.getFullYear()+"-"+pad2(d.getMonth()+1)+"-"+pad2(d.getDate());
const today=()=>dkey(new Date());
const dayDiff=(a,b)=>Math.round((new Date(b+"T12:00")-new Date(a+"T12:00"))/864e5);
const norm=s=>String(s).normalize("NFC").toLowerCase().replace(/[.,!?;:"“”()…]/g,"").replace(/\s+/g," ").trim();
const bare=s=>norm(s).normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/đ/g,"d");
const TONE_MARK={"́":"sắc","̀":"huyền","̉":"hỏi","̃":"ngã","̣":"nặng"};
function toneOf(w){const d=w.normalize("NFD");for(const m in TONE_MARK)if(d.includes(m))return TONE_MARK[m];return "ngang"}
const toneByName=n=>TONES.find(t=>t.name===n);
const MIN=6e4,HOUR=36e5,DAY=864e5;

/* ================= SAVED STATE ================= */
const KEY="nhim-v2";
const fresh=()=>({name:"",xp:0,streak:0,best:0,last:null,hearts:5,heartTs:Date.now(),done:{},stories:{},srs:{},miss:{},daily:{},goal:20,
 conf:{},tstat:{},badges:{},quest:{day:null,items:[]},cnt:{lessons:0,perfect:0,bestCombo:0,stories:0},
 set:{dialect:"S",sound:true,rate:.9,theme:"auto"},onb:false,joined:today(),noListenUntil:0,streakShown:null});
let S=fresh();
try{const t=JSON.parse(localStorage.getItem(KEY));if(t){S=Object.assign(fresh(),t);S.set=Object.assign(fresh().set,t.set);S.cnt=Object.assign(fresh().cnt,t.cnt)}
 else{const old=JSON.parse(localStorage.getItem("nhim-v1")||"null");if(old){ // carry over v1 progress
  S.xp=old.xp||0;S.streak=old.streak||0;S.best=old.streak||0;S.last=old.last;S.daily=old.daily||{};S.goal=old.goal||20;S.onb=true;
  const map={"-1:0":"-1:0","-1:1":"-1:1"};Object.keys(old.done||{}).forEach(k=>{const [u,l]=k.split(":").map(Number);if(u===-1)S.done[k]=1;else if(l<3)S.done[u+":"+l]=1;else{S.done[u+":3"]=1}});
  if(old.done&&old.done["-1:1"])S.done["-1:2"]=1;
  Object.keys(old.learned||{}).forEach(vi=>S.srs[vi]={s:1,due:Date.now(),r:1,w:0});}}}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function applyTheme(){const t=S.set.theme;if(t==="auto")document.documentElement.removeAttribute("data-theme");else document.documentElement.dataset.theme=t;
 const m=$('meta[name="theme-color"]');if(m)m.content=getComputedStyle(document.documentElement).getPropertyValue("--page").trim()||"#EDF2EA"}

const HEART_MS=3*HOUR;
function regen(){if(S.hearts>=5){S.heartTs=Date.now();return}const n=Math.floor((Date.now()-S.heartTs)/HEART_MS);if(n>0){S.hearts=Math.min(5,S.hearts+n);S.heartTs+=n*HEART_MS;if(S.hearts>=5)S.heartTs=Date.now()}}
function nextHeartIn(){return Math.max(0,HEART_MS-(Date.now()-S.heartTs))}
function loseHeart(){if(S.hearts>=5)S.heartTs=Date.now();S.hearts=Math.max(0,S.hearts-1)}
function dailyRefresh(){regen();if(S.last&&dayDiff(S.last,today())>1)S.streak=0;ensureQuests();save()}
function addXp(n){S.xp+=n;const t=today();S.daily[t]=(S.daily[t]||0)+n;let extended=false;
 if(S.last!==t){S.streak=(S.last&&dayDiff(S.last,t)===1)?S.streak+1:1;S.last=t;S.best=Math.max(S.best,S.streak);extended=true}
 questProg("xp",S.daily[t],true);save();return extended}
const listenOK=()=>UI.hasVoice()&&S.set.sound!==false&&Date.now()>S.noListenUntil;
const say=(t,o={})=>{if(S.set.sound!==false)speak(t,{rate:S.set.rate,...o})};
const fx=k=>{if(S.set.sound!==false)sfx(k)};

/* ================= COURSE MAP ================= */
const item=(u,w)=>({vi:w[0],en:w[1],alt:w[2]||[],reg:w[3]||"",unit:u.id});
const unitWords=ui=>UNITS[ui].words.map(w=>item(UNITS[ui],w));
const unitPhrases=ui=>UNITS[ui].phrases.map(p=>({vi:p[0],en:p[1],alt:[],reg:"",unit:UNITS[ui].id}));
const ALL_WORDS=UNITS.flatMap((u,ui)=>unitWords(ui));
const WORD_BY_VI=new Map();ALL_WORDS.forEach(w=>{WORD_BY_VI.set(norm(w.vi),w);w.alt.forEach(a=>{if(!WORD_BY_VI.has(norm(a)))WORD_BY_VI.set(norm(a),w)})});
UNITS.forEach((u,ui)=>unitPhrases(ui).forEach(p=>{if(!WORD_BY_VI.has(norm(p.vi)))WORD_BY_VI.set(norm(p.vi),p)}));
/* show the learner's dialect form first */
function disp(it){if(!it.alt||!it.alt.length)return it.vi;const d=S.set.dialect;if(it.reg&&it.reg!==d)return it.alt[0];return it.vi}
const forms=it=>[it.vi,...(it.alt||[])];
const storyFor=ui=>STORIES.find(s=>s.unit===UNITS[ui].id);
function lessonsOf(ui){
 if(ui===-1)return [{k:0,name:"Meet the tones"},{k:1,name:"Tone shapes"},{k:2,name:"Tone check",check:true}];
 const L=[{k:0,name:"New words"},{k:1,name:"More words"},{k:2,name:"Phrases"}];
 if(storyFor(ui))L.push({k:"s",name:"Story",story:true});
 L.push({k:3,name:"Mix it up"},{k:4,name:"Unit check",check:true});return L}
const ORDER=[-1,...UNITS.map((_,i)=>i)].flatMap(ui=>lessonsOf(ui).map(l=>ui+":"+l.k));
const unlocked=key=>{const i=ORDER.indexOf(key);return i<=0||!!S.done[ORDER[i-1]]};
const unitDone=ui=>!!S.done[ui+":4"];
const unitProgress=ui=>{const L=lessonsOf(ui);return [L.filter(l=>S.done[ui+":"+l.k]).length,L.length]};
const currentKey=()=>ORDER.find(k=>!S.done[k]&&unlocked(k));
const learnedCount=()=>Object.keys(S.srs).length;

/* ================= SPACED REPETITION ================= */
const GAP=[10*MIN,DAY,3*DAY,7*DAY,14*DAY,30*DAY];
function srsSeen(it){if(!it||!it.vi||!WORD_BY_VI.has(norm(it.vi)))return;if(!S.srs[it.vi])S.srs[it.vi]={s:0,due:Date.now()+GAP[0],r:0,w:0}}
function srsHit(it,ok){if(!it||!it.vi||!WORD_BY_VI.has(norm(it.vi)))return;const r=S.srs[it.vi]||(S.srs[it.vi]={s:0,due:0,r:0,w:0});
 if(ok){r.s=Math.min(5,r.s+1);r.r++;const m=S.miss[it.vi];if(m){m.ok=(m.ok||0)+1;if(m.ok>=2)delete S.miss[it.vi]}}
 else{r.s=Math.max(0,r.s-2);r.w++;const m=S.miss[it.vi]||(S.miss[it.vi]={vi:it.vi,en:it.en,n:0,ok:0});m.n++;m.ok=0}
 r.due=Date.now()+GAP[r.s]}
const dueItems=()=>Object.entries(S.srs).filter(([,r])=>r.due<=Date.now()).sort((a,b)=>a[1].s-b[1].s||a[1].due-b[1].due).map(([vi])=>WORD_BY_VI.get(norm(vi))).filter(Boolean);

/* ================= NUMBERS ================= */
const DIG=["không","một","hai","ba","bốn","năm","sáu","bảy","tám","chín"];
function numVi(n){if(n<10)return [DIG[n]];
 if(n<100){const t=Math.floor(n/10),u=n%10,head=t===1?"mười":DIG[t]+" mươi";if(!u)return [head];
  const tail=u===1?(t===1?["một"]:["mốt"]):u===4?(t===1?["bốn"]:["bốn","tư"]):u===5?["lăm"]:[DIG[u]];return tail.map(x=>head+" "+x)}
 const h=Math.floor(n/100),r=n%100,head=DIG[h]+" trăm";if(!r)return [head];if(r<10)return [head+" linh "+DIG[r],head+" lẻ "+DIG[r]];return numVi(r).map(x=>head+" "+x)}
function randNum(){const b=Math.random();return b<.3?Math.floor(Math.random()*11)+10:b<.7?Math.floor(Math.random()*80)+20:Math.floor(Math.random()*900)+100}

/* ================= EXERCISE BUILDERS ================= */
function wrongs(pool,it,field,n){const seen=new Set([norm(it[field]),norm(disp(it))]);return pick(pool.filter(p=>{const v=norm(field==="vi"?disp(p):p[field]);if(seen.has(v))return false;seen.add(v);return true}),n)}
const exIntro=it=>({type:"intro",it,audio:disp(it)});
const exMCvi=(it,pool)=>{const o=shuffle([it,...wrongs(pool,it,"en",3)]);return {type:"mc",title:"What does this mean?",show:disp(it),audio:disp(it),opts:o.map(x=>x.en),ans:it.en,it}};
const exMCen=(it,pool)=>{const o=shuffle([it,...wrongs(pool,it,"vi",3)]);return {type:"mc",title:"Which one means this?",show:it.en,opts:o.map(disp),ans:disp(it),optAudio:true,it}};
const exListen=(it,pool)=>{const o=shuffle([it,...wrongs(pool,it,"vi",3)]);return {type:"listen",title:"What do you hear?",audio:disp(it),opts:o.map(disp),ans:disp(it),it,needsAudio:true}};
const exListenType=it=>({type:"type",title:"Type what you hear",audio:disp(it),hideText:true,ans:disp(it),alts:forms(it),it,needsAudio:true});
const exMatch=items=>({type:"match",title:"Tap the matching pairs",pairs:items.slice(0,5).map(x=>[disp(x),x.en,x]),it:null});
function exBank(it,pool){const strip=s=>s.replace(/[.!?,]/g,"");const toks=strip(it.vi).split(" ");const low=new Set(toks.map(t=>t.toLowerCase()));
 const extra=pick([...new Set(pool.flatMap(p=>strip(p.vi).split(" ")))].filter(t=>!low.has(t.toLowerCase())),Math.max(2,Math.min(5,9-toks.length)));
 return {type:"bank",title:"Write this in Vietnamese",show:it.en,tiles:shuffle([...toks,...extra]),ans:toks.join(" "),it}}
function exBankEn(it,pool){const toks=it.en.replace(/[.!?,]/g,"").split(" ");const low=new Set(toks.map(t=>t.toLowerCase()));
 const extra=pick([...new Set(pool.flatMap(p=>p.en.replace(/[.!?,()/]/g,"").split(" ")))].filter(t=>t&&!low.has(t.toLowerCase())),Math.max(2,Math.min(4,8-toks.length)));
 return {type:"bank",title:"Translate this sentence",show:it.vi,audio:it.vi,tiles:shuffle([...toks,...extra]),ans:toks.join(" "),it}}
const exType=it=>({type:"type",title:"Type this in Vietnamese",show:it.en,ans:disp(it),alts:forms(it),it});
const exFill=f=>({type:"fill",title:"Fill in the blank",sentence:f[0],opts:shuffle([f[1],...f[2]]),ans:f[1],en:f[3],it:WORD_BY_VI.get(norm(f[1]))||null});
const exToneID=w=>({type:"mc",title:"Which tone is this?",show:w,audio:w,opts:TONES.map(t=>t.name),ans:toneOf(w),tone:true,grid:true,it:{vi:w,en:"tone: "+toneOf(w),tonal:true}});
const exToneShape=w=>({type:"shape",title:"Which pitch shape matches?",show:w,audio:w,opts:shuffle(TONES.map(t=>t.name)).slice(0,3),ans:toneOf(w),it:{vi:w,tonal:true}});
const exToneListen=()=>{const t=pick(TONES,1)[0];return {type:"listen",title:"Which word do you hear?",audio:t.ex,opts:shuffle(TONES.map(x=>x.ex)).slice(0,4).concat([]),ans:t.ex,it:{vi:t.ex,en:t.mean,tonal:true},needsAudio:true}};
function fixToneListen(q){if(!q.opts.includes(q.ans))q.opts[0]=q.ans;q.opts=shuffle(q.opts);return q}
function exNum(){const n=randNum(),f=numVi(n);const r=Math.random();
 if(r<.45)return {type:"type",title:"Write this number in Vietnamese",show:String(n),ans:f[0],alts:f,it:null,num:true};
 if(r<.8||!listenOK()){const o=shuffle([n,...pick([n+1,n-1,n+10,n-10,n+100,Math.floor(n/10)+n%10*10].filter(x=>x>=0&&x!==n&&x<1000),3)]);return {type:"mc",title:"Which number is this?",show:f[0],audio:f[0],opts:o.map(String),ans:String(n),it:null,num:true}}
 const o=shuffle([n,...pick([n+1,n-1,n+10,n-10,n+5].filter(x=>x>=0&&x!==n),3)]);return {type:"listen",title:"Which number do you hear?",audio:f[0],opts:o.map(String),ans:String(n),it:null,needsAudio:true,num:true}}
const SINGLE=ALL_WORDS.filter(w=>!/\s/.test(w.vi));
const toneWordsUpTo=ui=>SINGLE.filter(w=>UNITS.findIndex(u=>u.id===w.unit)<=Math.max(0,ui)).map(disp);

function buildLesson(ui,k){
 if(ui===-1){
  const ma=TONES.map(t=>t.ex);
  if(k===0)return [...TONES.flatMap((t,i)=>[{type:"tone-intro",t},...(i%2?[exToneID(pick(ma.slice(0,i+1),1)[0])]:[])]),...pick(ma,4).map(exToneID),exToneShape(pick(ma,1)[0])];
  if(k===1)return shuffle([...pick(ma,3).map(exToneShape),...pick(SINGLE.map(disp),5).map(exToneShape),...pick(SINGLE.map(disp),4).map(exToneID),...(listenOK()?[fixToneListen(exToneListen()),fixToneListen(exToneListen())]:[])]);
  return shuffle([...pick(SINGLE.map(disp),6).map(exToneID),...pick(SINGLE.map(disp),4).map(exToneShape),...(listenOK()?[fixToneListen(exToneListen()),fixToneListen(exToneListen())]:[])]);
 }
 const words=unitWords(ui),phrases=unitPhrases(ui),pool=[...words,...phrases],fills=UNITS[ui].fill||[];
 const prev=UNITS.slice(0,ui).flatMap((_,j)=>unitWords(j));
 const au=listenOK();let ex=[];
 if(k===0||k===1){const half=Math.ceil(words.length/2),set=k===0?words.slice(0,half):words.slice(half);
  set.forEach((w,i)=>{ex.push(exIntro(w));if(i%2===1){ex.push(Math.random()<.5?exMCvi(set[i-1],words):exMCen(set[i-1],words));ex.push(Math.random()<.5?exMCen(w,words):exMCvi(w,words))}});
  if(set.length%2)ex.push(exMCvi(set[set.length-1],words));
  ex.push(exMatch(shuffle(set)));
  if(au)pick(set,2).forEach(w=>ex.push(exListen(w,words)));
  pick(set,2).forEach(w=>ex.push(exType(w)));
  if(k===1&&fills[0])ex.push(exFill(fills[0]));
  if(prev.length)ex.push(exMCen(pick(prev,1)[0],prev));
  return ex}
 if(k===2){pick(phrases,Math.min(6,phrases.length)).forEach((p,i)=>ex.push(i%3===2?exBankEn(p,pool):exBank(p,pool)));
  pick(phrases,2).forEach(p=>ex.push(exMCvi(p,phrases)));if(au)ex.push(exListen(pick(phrases,1)[0],phrases));
  fills.slice(1,3).forEach(f=>ex.push(exFill(f)));return ex}
 if(k===3){ex.push(exMatch(pick(words,5)));pick(words,3).forEach(w=>ex.push(exMCen(w,words)));pick(phrases,3).forEach((p,i)=>ex.push(i?exBank(p,pool):exBankEn(p,pool)));
  pick(words,3).forEach(w=>ex.push(exType(w)));fills.forEach(f=>ex.push(exFill(f)));
  pick(words.filter(w=>!/\s/.test(w.vi)),2).forEach(w=>ex.push(exToneID(disp(w))));if(au)pick(pool,2).forEach(p=>ex.push(exListen(p,pool)));
  return shuffle(ex)}
 // unit check: no intros, harder mix including earlier units
 const mixed=[...words,...pick(prev,4)];
 pick(words,4).forEach(w=>ex.push(exType(w)));pick(phrases,3).forEach((p,i)=>ex.push(i===1?exBankEn(p,pool):exBank(p,pool)));
 pick(mixed,3).forEach(w=>ex.push(exMCen(w,mixed)));ex.push(exMatch(pick(mixed,5)));fills.slice(0,2).forEach(f=>ex.push(exFill(f)));
 if(au){ex.push(exListenType(pick(words,1)[0]));ex.push(exListen(pick(phrases,1)[0],phrases))}
 return shuffle(ex)}

function buildPractice(kind){
 const learned=Object.keys(S.srs).map(v=>WORD_BY_VI.get(norm(v))).filter(Boolean);
 const pool=learned.length>=6?learned:ALL_WORDS.slice(0,20);
 const one=it=>{const r=Math.random();if(/\s.*\s/.test(it.vi))return exBank(it,pool);if(r<.35)return exType(it);if(r<.6&&listenOK())return exListen(it,pool);return Math.random()<.5?exMCen(it,pool):exMCvi(it,pool)};
 if(kind==="review"){const due=dueItems();const its=(due.length?due:pick(pool,10)).slice(0,12);return shuffle(its.map(one).concat(its.length>=5?[exMatch(pick(its,5))]:[]))}
 if(kind==="mistakes"){const m=Object.values(S.miss).sort((a,b)=>b.n-a.n).slice(0,10).map(x=>WORD_BY_VI.get(norm(x.vi))).filter(Boolean);
  return shuffle((m.length?m:pick(pool,8)).flatMap(it=>/\s.*\s/.test(it.vi)?[exBank(it,pool)]:[exMCen(it,pool),exType(it)]))}
 if(kind==="tones"){const tw=toneWordsUpTo(UNITS.length-1).filter(w=>S.srs[w]||learned.length<6);const src=tw.length>=8?tw:SINGLE.map(disp);
  return shuffle([...pick(src,6).map(exToneID),...pick(src,5).map(exToneShape),...(listenOK()?[1,2,3].map(()=>fixToneListen(exToneListen())):[])])}
 if(kind==="numbers")return [...Array(10)].map(exNum);
 if(kind==="listening")return pick(pool,10).map((it,i)=>i%3===2?exListenType(it):exListen(it,pool));
 return []}

/* ================= QUESTS + BADGES ================= */
const QUESTS=[
 {id:"xp",t:n=>`Earn ${n} XP`,n:[20,30,40],ic:"bolt"},
 {id:"lessons",t:n=>`Finish ${n} lessons`,n:[2,3],ic:"star"},
 {id:"combo",t:n=>`Get ${n} right in a row`,n:[5,8,10],ic:"flame"},
 {id:"perfect",t:()=>"Finish a lesson with no mistakes",n:[1],ic:"crown"},
 {id:"tones",t:n=>`Get ${n} tone questions right`,n:[6,10],ic:"wave"},
 {id:"practice",t:()=>"Finish a practice session",n:[1],ic:"practice"},
 {id:"story",t:()=>"Read a story",n:[1],ic:"book"}];
function ensureQuests(){const d=today();if(S.quest.day===d)return;let h=0;for(const c of d)h=(h*33+c.charCodeAt(0))%9973;
 const ids=["xp",...shuffleSeeded(QUESTS.slice(1).map(q=>q.id),h).slice(0,2)];
 S.quest={day:d,items:ids.map((id,i)=>{const q=QUESTS.find(x=>x.id===id);return {id,goal:q.n[(h+i)%q.n.length],prog:0}})}}
function shuffleSeeded(a,seed){a=[...a];for(let i=a.length-1;i>0;i--){seed=(seed*9301+49297)%233280;const j=Math.floor(seed/233280*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function questProg(id,v,abs=false){ensureQuests();S.quest.items.forEach(q=>{if(q.id!==id||q.prog>=q.goal)return;q.prog=Math.min(q.goal,abs?Math.max(q.prog,v):q.prog+v);
 if(q.prog>=q.goal){const def=QUESTS.find(x=>x.id===id);toast(I.trophy,"Quest done: "+def.t(q.goal))}})}
const BADGES=[
 {id:"first",name:"First steps",d:"Finish your first lesson",ic:"star",c:"var(--leaf)",ok:()=>S.cnt.lessons>=1},
 {id:"tones",name:"Tone tamer",d:"Finish the six tones",ic:"wave",c:"var(--indigo)",ok:()=>!!S.done["-1:2"]},
 {id:"s3",name:"Warming up",d:"Reach a 3-day streak",ic:"flame",c:"var(--gold)",ok:()=>S.best>=3},
 {id:"s7",name:"One full week",d:"Reach a 7-day streak",ic:"flame",c:"var(--lotus)",ok:()=>S.best>=7},
 {id:"perfect",name:"Không sai",d:"Finish a lesson with no mistakes",ic:"crown",c:"var(--gold)",ok:()=>S.cnt.perfect>=1},
 {id:"combo",name:"Ten in a row",d:"Get 10 right in a row",ic:"bolt",c:"var(--leaf)",ok:()=>S.cnt.bestCombo>=10},
 {id:"w50",name:"50 words",d:"Learn 50 words",ic:"brain",c:"var(--indigo)",ok:()=>learnedCount()>=50},
 {id:"w150",name:"150 words",d:"Learn 150 words",ic:"brain",c:"var(--lotus)",ok:()=>learnedCount()>=150},
 {id:"fam",name:"Con ngoan",d:"Finish the Family unit",ic:"family",c:"var(--lotus)",ok:()=>unitDone(1)},
 {id:"pho",name:"Phở fan",d:"Finish the Food unit",ic:"bowl",c:"var(--gold)",ok:()=>unitDone(3)},
 {id:"story3",name:"Storyteller",d:"Read 3 stories",ic:"book",c:"var(--indigo)",ok:()=>S.cnt.stories>=3},
 {id:"tet",name:"Chúc mừng năm mới",d:"Finish the last unit",ic:"lantern",c:"var(--lotus)",ok:()=>unitDone(UNITS.length-1)},
 {id:"xp1k",name:"Một nghìn",d:"Earn 1,000 XP",ic:"trophy",c:"var(--leaf)",ok:()=>S.xp>=1000}];
function checkBadges(){const got=[];BADGES.forEach(b=>{if(!S.badges[b.id]&&b.ok()){S.badges[b.id]=today();got.push(b)}});if(got.length)save();return got}

/* ================= SCREENS ================= */
let tab="learn",firstLearn=true;
const TABS=[["learn","Học","Learn"],["practice","Ôn tập","Practice"],["stories","Truyện","Stories"],["guide","Hướng dẫn","Guide"],["profile","Hồ sơ","Profile"]];
function shell(){
 $("#rail").innerHTML=`<a class="brand" href="#" aria-label="Nhím home">${mascot()}Nhím</a>`+TABS.map(([id,vi,en])=>`<button class="tab" data-tab="${id}" title="${en}">${I[id]}<span>${vi}</span></button>`).join("");
 $("#tabs").innerHTML=`<div class="in">${TABS.map(([id,vi,en])=>`<button class="tab" data-tab="${id}" aria-label="${en}">${I[id]}<span>${vi}</span></button>`).join("")}</div>`;
 $("#brandTop").innerHTML=mascot()+"Nhím";
 $$("[data-tab]").forEach(b=>b.onclick=()=>{if(!L)setTab(b.dataset.tab)});
 $$(".brand").forEach(b=>b.onclick=e=>{e.preventDefault();setTab("learn")});
 $("#stStreak").onclick=()=>streakSheet();$("#stHearts").onclick=()=>heartSheet();$("#stXp").onclick=()=>setTab("profile");
}
function setTab(t){tab=t;$$("[data-tab]").forEach(b=>b.setAttribute("aria-current",b.dataset.tab===t?"page":"false"));render();scrollTo(0,0)}
function topStats(){const lit=S.last===today();
 $("#stStreak").className="stat c-streak"+(lit?"":" cold");$("#stStreak").innerHTML=I.flame+`<span>${S.streak}</span>`;$("#stStreak").setAttribute("aria-label",`${S.streak} day streak`);
 $("#stXp").innerHTML=I.bolt+`<span>${S.xp}</span>`;$("#stXp").setAttribute("aria-label",`${S.xp} XP`);
 $("#stHearts").innerHTML=I.heart+`<span>${S.hearts}</span>`;$("#stHearts").setAttribute("aria-label",`${S.hearts} hearts`)}
function render(){regen();topStats();renderAside();const v=$("#view");
 ({learn:renderLearn,practice:renderPractice,stories:renderStories,guide:renderGuide,profile:renderProfile})[tab](v);bindSay(v)}

/* ----- right column (wide screens) ----- */
function weekDots(){const lab="CN T2 T3 T4 T5 T6 T7".split(" ");return `<div class="week">${[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));const k=dkey(d),on=(S.daily[k]||0)>0;
 return `<div>${lab[d.getDay()]}<i class="${on?"on":""} ${i===6?"today":""}">${on?I.check:""}</i></div>`}).join("")}</div>`}
function questsHtml(){ensureQuests();return S.quest.items.map(q=>{const d=QUESTS.find(x=>x.id===q.id),done=q.prog>=q.goal;
 return `<div class="quest ${done?"done":""}"><div class="qi">${done?I.check:I[d.ic]}</div><div><p>${esc(d.t(q.goal))}</p><div class="spread"><div class="meter"><i style="width:${q.prog/q.goal*100}%"></i></div><span>${q.prog}/${q.goal}</span></div></div></div>`}).join("")}
function goalHtml(){const g=S.daily[today()]||0;return `<div class="spread"><b>${Math.min(g,S.goal)} / ${S.goal} XP</b><span class="muted small">daily goal</span></div><div class="meter"><i style="width:${Math.min(100,g/S.goal*100)}%"></i></div>`}
function renderAside(){const a=$("#aside");if(!a||getComputedStyle(a).display==="none")return;
 a.innerHTML=`<section class="widget"><div class="streakbig" style="color:var(--gold)">${I.flame}<div><b style="color:var(--ink)">${S.streak}</b><p class="muted small">day streak${S.best>S.streak?`, best ${S.best}`:""}</p></div></div>${weekDots()}</section>
 <section class="widget"><h3>Daily goal</h3>${goalHtml()}</section>
 <section class="widget"><h3>Daily quests</h3>${questsHtml()}</section>
 <section class="widget"><div class="row">${mascot("think")}<p class="small muted" style="flex:1">${dueItems().length?`<b style="color:var(--ink)">${dueItems().length} words</b> are ready to review. Reviewing at the right time keeps them in long-term memory.`:"Nothing to review right now. New reviews appear as words fade."}</p></div>${dueItems().length?`<button class="btn ghost slim" data-go-review>Review now</button>`:""}</section>`;
 a.querySelector(".row svg").style.cssText="width:56px;height:56px;flex:none";
 const r=$("[data-go-review]",a);if(r)r.onclick=()=>startPractice("review")}

/* ----- learn path ----- */
const OFF=[0,-62,-92,-62,0,62,92,62];
function renderLearn(v){
 const g=S.daily[today()]||0,cur=currentKey();
 let msg;if(!S.cnt.lessons&&!Object.keys(S.done).length)msg=`Xin chào${S.name?", "+esc(S.name):""}! I'm <b>Nhím</b>. Start with the six tones. They change the meaning of every word.`;
 else if(g>=S.goal)msg=`Daily goal reached: <b>${g} XP</b>. Giỏi quá! Keep going or come back tomorrow.`;
 else if(dueItems().length>=8)msg=`<b>${dueItems().length} words</b> are fading. A quick review in Practice keeps them fresh.`;
 else msg=`<b>${S.goal-g} XP</b> to today's goal.${S.streak?` Your streak is ${S.streak} ${S.streak===1?"day":"days"}.`:""}`;
 let h=`<div class="hello">${mascot(g>=S.goal?"cheer":"happy","bob")}<p class="speech">${msg}</p></div>`;
 const sections=[{ui:-1,title:"The six tones",vi:"Thanh điệu",color:"#C23B5E",scene:"lanterns"},...UNITS.map((u,ui)=>({ui,...u}))];
 sections.forEach(sec=>{const ui=sec.ui,L=lessonsOf(ui),open=unlocked(ui+":"+L[0].k),[d,t]=unitProgress(ui);
  const n=ui===-1?"Start here":"Unit "+(ui+1);
  h+=`<section class="unit" style="--u:${sec.color}" id="unit-${ui}"><div class="ubanner ${open?"":"locked"}">${scene(sec.scene)}<div class="t"><span class="num">${n}</span><h2>${esc(sec.title)}</h2><span class="vi">${esc(sec.vi)}</span>
   <div class="unitbar"><div class="meter"><i style="width:${d/t*100}%"></i></div>${d}/${t}</div></div>
   <button class="guidebtn" data-tip="${ui}">${I.book}Guide</button></div>`;
  const step=150,top=78,H=top+(L.length-1)*step+70;
  const pts=L.map((l,i)=>({x:200+OFF[(i+(ui+1)*3)%8],y:top+i*step,l,key:ui+":"+l.k}));
  let road=`M${pts[0].x} ${pts[0].y}`;for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];road+=` C${a.x} ${a.y+step*.5} ${b.x} ${b.y-step*.5} ${b.x} ${b.y}`}
  let doneRoad="";for(let i=1;i<pts.length;i++){if(!S.done[pts[i-1].key])break;const a=pts[i-1],b=pts[i];doneRoad+=`M${a.x} ${a.y} C${a.x} ${a.y+step*.5} ${b.x} ${b.y-step*.5} ${b.x} ${b.y}`}
  h+=`<div class="trail" style="height:${H}px"><svg class="road" viewBox="0 0 400 ${H}" preserveAspectRatio="none" aria-hidden="true"><path d="${road}" fill="none" stroke="var(--rule)" stroke-width="14" stroke-linecap="round" vector-effect="non-scaling-stroke"/><path d="${road}" fill="none" stroke="var(--paper)" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round" vector-effect="non-scaling-stroke"/>${doneRoad?`<path d="${doneRoad}" fill="none" stroke="var(--gold)" stroke-width="14" stroke-linecap="round" vector-effect="non-scaling-stroke" opacity=".55"/>`:""}</svg>`;
  pts.forEach(p=>{const done=!!S.done[p.key],op=unlocked(p.key),isCur=p.key===cur;
   const cls=["node",done?"done":op?"":"locked",p.l.check?"check":"",p.l.story?"story":"",isCur?"current":""].join(" ");
   const icon=done?(p.l.check?I.trophy:I.check):!op?I.lock:p.l.check?I.chest:p.l.story?I.book:I.star;
   h+=`<div class="stop" style="left:${p.x/4}%;top:${p.y}px">${isCur?`<span class="startflag">${S.done[ORDER[0]]?"Tiếp tục":"Bắt đầu"}</span>`:""}<button class="${cls}" data-key="${p.key}" aria-label="${esc(p.l.name)}${done?", finished":op?"":", locked"}">${icon}</button><span class="lbl">${esc(p.l.name)}</span></div>`;
   if(isCur){const side=p.x<=200?1:-1;h+=`<div class="walker" style="left:calc(${p.x/4}% + ${side*96}px);top:${p.y-6}px">${mascot("happy","bob")}</div>`}});
  h+=`</div></section>`});
 h+=`<p class="endnote">More units are on the way. Made by Audrey Pham. <a href="https://github.com/audreypham2007-spec/nhim">Source code</a></p>`;
 v.innerHTML=h;
 $$(".node",v).forEach(b=>b.onclick=()=>openNode(b.dataset.key));
 $$("[data-tip]",v).forEach(b=>b.onclick=()=>tipSheet(+b.dataset.tip));
 if(firstLearn&&cur){firstLearn=false;const el=$(`[data-key="${cur}"]`,v);if(el&&cur!==ORDER[0])setTimeout(()=>el.scrollIntoView({block:"center",behavior:"instant"}),30)}
}
function openNode(key){const [u,k]=key.split(":");const ui=+u,kk=k==="s"?"s":+k;const l=lessonsOf(ui).find(x=>String(x.k)===k);
 if(!unlocked(key))return toast(I.lock,"Finish the step before this one to open it.");
 const done=!!S.done[key];
 if(kk==="s"){const st=storyFor(ui);return startStory(st,key)}
 sheet(`<div class="row" style="align-items:flex-start"><div style="flex:1"><p class="muted small">${ui===-1?"The six tones":"Unit "+(ui+1)+": "+esc(UNITS[ui].title)}</p><h2>${esc(l.name)}</h2></div>${l.check?`<span style="color:var(--gold);width:40px">${I.chest}</span>`:""}</div>
 <p class="muted">${l.check?"A mixed test of the whole unit. No new words. Pass it to finish the unit.":done?"You finished this. Replay it for practice XP.":lessonBlurb(ui,kk)}</p>
 <button class="btn ${l.check?"gold":""}" id="goLesson">${done?"Practice again":"Start"}${done?"":` +${l.check?20:10} XP`}</button><button class="btn ghost" data-close>Not now</button>`,()=>{
  $("#goLesson").onclick=()=>{closeSheet();if(S.hearts<=0&&!done)return heartSheet(true);startLesson(ui,kk)}})}
function lessonBlurb(ui,k){if(ui===-1)return k===0?"Hear each tone and see its pitch shape.":"Match words to the shape of their pitch.";
 const w=unitWords(ui),half=Math.ceil(w.length/2);
 if(k===0)return "New words: "+w.slice(0,half).map(disp).join(", ")+".";if(k===1)return "New words: "+w.slice(half).map(disp).join(", ")+".";
 if(k===2)return "Build full sentences with this unit's words.";return "Every exercise type, with words from this unit and earlier ones."}
function tipSheet(ui){
 if(ui===-1){sheet(`<h2>The six tones</h2><p>Every Vietnamese syllable carries one of six tones. The mark over or under the vowel tells you which. Same letters, different tone, different word.</p>${toneCards()}<button class="btn" data-close>Got it</button>`,()=>bindTones($("#sheet")));return}
 const u=UNITS[ui];
 sheet(`<p class="muted small">Unit ${ui+1} guide</p><h2>${esc(u.title)}: ${esc(u.vi)}</h2><p>${esc(u.tip)}</p>
 <h3>Words</h3><div class="vlist">${unitWords(ui).map(w=>`<div><span><b>${esc(disp(w))}</b>${w.alt.length?` <span class="muted small">also ${esc(forms(w).filter(f=>f!==disp(w)).join(", "))}</span>`:""}<br><span class="muted">${esc(w.en)}</span></span><button class="mini" data-say="${esc(disp(w))}" aria-label="Play ${esc(disp(w))}">${I.sound}</button></div>`).join("")}</div>
 <h3>Sentences</h3><div class="vlist">${unitPhrases(ui).map(p=>`<div><span><b>${esc(p.vi)}</b><br><span class="muted">${esc(p.en)}</span></span><button class="mini" data-say="${esc(p.vi)}" aria-label="Play">${I.sound}</button></div>`).join("")}</div>
 <button class="btn" data-close>Got it</button>`)}

/* ----- practice hub ----- */
function renderPractice(v){
 const due=dueItems().length,miss=Object.keys(S.miss).length,ts=Object.values(S.tstat).reduce((a,t)=>[a[0]+t.r,a[1]+t.r+t.w],[0,0]);
 const weak=Object.entries(S.srs).sort((a,b)=>a[1].s-b[1].s).slice(0,24).map(([vi,r])=>({it:WORD_BY_VI.get(norm(vi)),r})).filter(x=>x.it);
 v.innerHTML=`<header><h1 style="font-size:2rem">Practice</h1><p class="muted">Practice never costs hearts. Finishing a session gives one back.</p></header>
 <div class="hub">
  <button class="hubcard wide" data-p="review" style="--hc:var(--leaf)"><span class="ic">${I.brain}</span><span style="flex:1"><h3>Smart review</h3><p>Words come back right before you'd forget them.</p></span><span class="count">${due?due+" due":"All fresh"}</span></button>
  <button class="hubcard" data-p="mistakes" style="--hc:var(--lotus)"><span class="ic">${I.redo}</span><h3>Mistakes</h3><p>Every word you missed, until you get it right twice.</p><span class="count">${miss} ${miss===1?"word":"words"}</span></button>
  <button class="hubcard" data-p="tones" style="--hc:var(--indigo)"><span class="ic">${I.wave}</span><h3>Tone gym</h3><p>Name the tone and match the pitch shape.</p><span class="count">${ts[1]?Math.round(ts[0]/ts[1]*100)+"% right so far":"Not started"}</span></button>
  <button class="hubcard" data-p="numbers" style="--hc:var(--gold-deep)"><span class="ic">${I.hash}</span><h3>Numbers</h3><p>0 to 999, with mốt, lăm, tư, and linh or lẻ.</p><span class="count">10 questions</span></button>
  ${UI.hasVoice()?`<button class="hubcard" data-p="listening" style="--hc:#2C7A7B"><span class="ic">${I.ear}</span><h3>Listening</h3><p>Ears only. Hear it, pick it or type it.</p><span class="count">10 questions</span></button>`:""}
 </div>
 <section class="panel"><div class="spread"><h2>Word strength</h2><span class="muted small">${learnedCount()} ${learnedCount()===1?"word":"words"} learned</span></div>
 ${weak.length?`<div class="vlist">${weak.map(({it,r})=>`<div><span><b>${esc(disp(it))}</b><br><span class="muted small">${esc(it.en)}</span></span><span class="row" style="gap:10px"><span class="strength" aria-label="Strength ${r.s} of 5">${[1,2,3,4,5].map(i=>`<i class="${r.s>=i?"on":""}"></i>`).join("")}</span><button class="mini" data-say="${esc(disp(it))}" aria-label="Play">${I.sound}</button></span></div>`).join("")}</div>`:`<p class="muted">Finish a lesson and your words show up here, weakest first.</p>`}</section>`;
 $$("[data-p]",v).forEach(b=>b.onclick=()=>startPractice(b.dataset.p))}
function startPractice(kind){const q=buildPractice(kind);if(!q.length)return toast(I.x,"Nothing to practice yet.");startLesson("practice",kind,q)}

/* ----- stories list ----- */
function renderStories(v){
 v.innerHTML=`<header><h1 style="font-size:2rem">Stories</h1><p class="muted">Short conversations. Tap any word to see what it means.</p></header>
 <div class="storygrid">${STORIES.map(st=>{const ui=UNITS.findIndex(u=>u.id===st.unit),key=ui+":s",op=unlocked(key),done=!!S.stories[st.id],col=UNITS[ui]?.color||"var(--leaf)";
  return `<button class="scard ${op?"":"locked"}" data-story="${st.id}" style="--sc:${col}"><span class="cover">${op?mascotStory(st):I.lock}${done?`<span class="tick">${I.check}</span>`:""}</span><b>${esc(st.title)}</b><span>${esc(st.vi)}${op?"":` · after Unit ${ui+1} phrases`}</span></button>`}).join("")}</div>`;
 $$("[data-story]",v).forEach(b=>b.onclick=()=>{const st=STORIES.find(s=>s.id===b.dataset.story),ui=UNITS.findIndex(u=>u.id===st.unit);
  if(!unlocked(ui+":s"))return toast(I.lock,`Unlocks after the Phrases lesson in Unit ${ui+1}.`);startStory(st,ui+":s")})}
function mascotStory(st){const names=Object.entries(st.cast||{}).slice(0,2);return `<span style="display:flex">${names.map(([k,n],i)=>avatar(n,k).replace('class="ava"',`class="ava" style="width:56px;height:56px;${i?"margin-left:-14px":""}"`)).join("")}</span>`}

/* ----- guide ----- */
function toneCards(){return `<div class="tonegrid">${TONES.map(t=>`<button class="tonecard" data-tone="${esc(t.name)}"><span class="spread"><span class="big">${esc(t.ex)}</span><span style="color:var(--leaf)">${I.sound}</span></span>${contour(t,{dot:true})}<span class="nm">${esc(t.name)}</span><span class="en">${esc(t.en)}. Mark: ${esc(t.mark)}. ${esc(t.ex)} = ${esc(t.mean)}</span></button>`).join("")}</div>`}
function bindTones(r){$$("[data-tone]",r).forEach(b=>b.onclick=()=>{const t=toneByName(b.dataset.tone);say(t.ex,{slow:true});animateDot($("svg.contour",b),t,1100)})}
const FAMILY=[
 {id:"ongn",x:14,y:10,c:"var(--indigo)",lab:"Dad's dad",call:"ông nội",self:"cháu",note:"Nội means your father's side."},
 {id:"ban",x:36,y:10,c:"var(--indigo)",lab:"Dad's mom",call:"bà nội",self:"cháu"},
 {id:"ongng",x:64,y:10,c:"var(--lotus)",lab:"Mom's dad",call:"ông ngoại",self:"cháu",note:"Ngoại means your mother's side."},
 {id:"bang",x:86,y:10,c:"var(--lotus)",lab:"Mom's mom",call:"bà ngoại",self:"cháu"},
 {id:"bac",x:8,y:40,c:"var(--indigo)",lab:"Dad's older sibling",call:"bác",self:"cháu",note:"Bác is for any older sibling of your dad. In the North it's used for your mom's older siblings too."},
 {id:"chu",x:22,y:40,c:"var(--indigo)",lab:"Dad's younger brother",call:"chú",self:"cháu",note:"Chú is also a polite word for any man around your parents' age."},
 {id:"co",x:36,y:40,c:"var(--indigo)",lab:"Dad's sister",call:"cô",self:"cháu",note:"Cô is also what you call a female teacher."},
 {id:"bo",x:50,y:40,c:"var(--leaf)",lab:"Dad",call:"bố / ba",self:"con",note:"Bố is common in the North, ba in the South."},
 {id:"me",x:64,y:40,c:"var(--leaf)",lab:"Mom",call:"mẹ / má",self:"con",note:"Mẹ is common in the North, má in the South."},
 {id:"cau",x:78,y:40,c:"var(--lotus)",lab:"Mom's brother",call:"cậu",self:"cháu"},
 {id:"di",x:92,y:40,c:"var(--lotus)",lab:"Mom's sister",call:"dì",self:"cháu",note:"In the South, people often call a mom's older sister dì too."},
 {id:"anh",x:26,y:74,c:"var(--gold-deep)",lab:"Older brother",call:"anh",self:"em",note:"Anh also means 'you' for any young man a bit older than you."},
 {id:"chi",x:42,y:74,c:"var(--gold-deep)",lab:"Older sister",call:"chị",self:"em",note:"Chị also means 'you' for any young woman a bit older than you."},
 {id:"me0",x:58,y:74,c:"var(--lotus)",lab:"You",me:true},
 {id:"em",x:74,y:74,c:"var(--gold-deep)",lab:"Younger sibling",call:"em",self:"anh / chị",note:"You call yourself anh if you're male, chị if you're female."}];
function familyTree(){const P=id=>FAMILY.find(f=>f.id===id),ln=(a,b)=>{const A=P(a),B=P(b);return `<path d="M${A.x} ${A.y+6}V${(A.y+B.y)/2+3}H${B.x}V${B.y-6}" fill="none" stroke="var(--rule-2)" stroke-width=".6"/>`};
 return `<div class="tree"><svg class="lines" viewBox="0 0 100 82" preserveAspectRatio="none" aria-hidden="true">${[["ongn","bo"],["ban","bac"],["ban","chu"],["ban","co"],["ongng","me"],["bang","cau"],["bang","di"],["bo","anh"],["bo","chi"],["me","me0"],["me","em"]].map(([a,b])=>ln(a,b)).join("")}</svg>
 ${FAMILY.map(f=>`<button class="p ${f.me?"me":""}" style="left:${f.x}%;top:${f.y/0.82}%;--pc:${f.c}" data-fam="${f.id}" aria-pressed="false"><span class="face">${f.me?"Bạn":esc(f.call.split(" / ")[0].split(" ")[0])}</span><span class="pl">${esc(f.lab)}</span></button>`).join("")}</div>
 <div class="treeout" id="treeout" aria-live="polite"><p class="muted">Tap a relative. You'll see what you call them and what you call yourself when you talk to them.</p></div>`}
function bindTree(r){$$("[data-fam]",r).forEach(b=>b.onclick=()=>{const f=FAMILY.find(x=>x.id===b.dataset.fam);$$("[data-fam]",r).forEach(x=>x.setAttribute("aria-pressed","false"));b.setAttribute("aria-pressed","true");
 const o=$("#treeout",r);if(f.me){o.innerHTML=`<p>That's you. Vietnamese has no single word for "I" and "you". You pick both from the family words, based on who you're talking to.</p>`;return}
 o.innerHTML=`<p class="muted small">${esc(f.lab)}</p><p>You call them <b>${esc(f.call)}</b>. You call yourself <b style="color:var(--leaf)">${esc(f.self)}</b>.</p>${f.note?`<p class="small muted" style="margin-top:4px">${esc(f.note)}</p>`:""}`;say(f.call.split(" / ")[S.set.dialect==="S"?1:0]||f.call)})}
function renderGuide(v){
 const pairs=ALL_WORDS.filter(w=>w.alt.length&&w.reg).slice(0,14);
 v.innerHTML=`<header><h1 style="font-size:2rem">Guide</h1><p class="muted">The rules behind the lessons. Tap anything with a speaker to hear it.</p></header>
 <section class="panel"><h2>The six tones</h2><p class="muted">Each line shows how the pitch moves while you say the word, from low (bottom) to high (top). Tap a card to hear it and watch the dot trace the pitch.</p>${toneCards()}<p class="hint">In the South, hỏi and ngã sound the same. Your family may say mả and mã alike.</p></section>
 <section class="panel"><h2>Who is "you"?</h2><p class="muted">Pronouns come from family words. Use the tree to find the right pair.</p>${familyTree()}</section>
 <section class="panel"><h2>Special letters</h2><div class="tbl"><table><thead><tr><th>Letter</th><th>Sounds like</th><th></th></tr></thead><tbody>
 ${[["ă","short a, as in cut","ăn"],["â","short uh","cần"],["ê","ay, as in say","đêm"],["ô","oh, lips rounded","cô"],["ơ","uh, as in fur without the r","bơ"],["ư","oo with your lips spread","sữa"],["đ","d, as in day","đi"],["d / gi","z in the North, y in the South","da"],["nh","ny, as in canyon","nhà"],["ng / ngh","ng, as in sing, even at the start","ngủ"],["tr","like ch, tongue curled back in the South","trà"],["kh","a breathy k, as in German Bach","khỏe"]].map(r=>`<tr><td class="big">${r[0]}</td><td>${r[1]}</td><td><button class="mini" data-say="${r[2]}" aria-label="Play ${r[2]}">${I.sound}</button></td></tr>`).join("")}</tbody></table></div></section>
 ${pairs.length?`<section class="panel"><h2>North and South</h2><p class="muted">Both are correct. Nhím shows ${S.set.dialect==="S"?"Southern":"Northern"} words first. Change this in Profile.</p><div class="tbl"><table><thead><tr><th>North</th><th>South</th><th>Meaning</th></tr></thead><tbody>${pairs.map(w=>{const n=w.reg==="N"?w.vi:w.alt[0],s=w.reg==="S"?w.vi:w.alt[0];return `<tr><td><b>${esc(n)}</b></td><td><b>${esc(s)}</b></td><td class="muted">${esc(w.en)}</td></tr>`}).join("")}</tbody></table></div></section>`:""}
 <section class="panel"><h2>Typing with Telex</h2><p class="muted">Turn on a Vietnamese keyboard (Telex) on your phone or computer. In lessons you can also tap the letter buttons. Answers without marks still count, and Nhím shows you the right spelling.</p>
 <div class="tbl"><table><thead><tr><th>Type</th><th>Get</th><th>Type</th><th>Get</th></tr></thead><tbody>
 <tr><td>aa</td><td>â</td><td>s</td><td>sắc (á)</td></tr><tr><td>aw</td><td>ă</td><td>f</td><td>huyền (à)</td></tr><tr><td>ee</td><td>ê</td><td>r</td><td>hỏi (ả)</td></tr>
 <tr><td>oo / ow</td><td>ô / ơ</td><td>x</td><td>ngã (ã)</td></tr><tr><td>uw</td><td>ư</td><td>j</td><td>nặng (ạ)</td></tr><tr><td>dd</td><td>đ</td><td>z</td><td>remove mark</td></tr></tbody></table></div><p class="hint">Example: type <b>vieetj</b> to get <b>việt</b>.</p></section>
 ${UI.hasVoice()?"":`<section class="panel" style="background:var(--gold-tint);border-color:transparent"><h2>Turn on audio</h2><p>This browser has no Vietnamese voice, so listening exercises are off. On Android or Chrome, add Vietnamese text-to-speech in your device settings. On iPhone, go to Settings, Accessibility, Spoken Content, Voices, and add Vietnamese. Then reload.</p></section>`}`;
 bindTones(v);bindTree(v)}

/* ----- profile ----- */
function renderProfile(v){
 const words=learnedCount(),lessons=Object.keys(S.done).length;
 const days=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));const k=dkey(d);return {x:S.daily[k]||0,l:"CN T2 T3 T4 T5 T6 T7".split(" ")[d.getDay()]}});
 const mx=Math.max(S.goal,...days.map(d=>d.x));
 const tn=TONES.map(t=>t.name),cmax=Math.max(1,...tn.flatMap(a=>tn.map(b=>(S.conf[a]||{})[b]||0)));
 const heat=`<div class="heat" role="table" aria-label="Tone confusion"><div class="h"></div>${tn.map(t=>`<div class="h">${t}</div>`).join("")}${tn.map(a=>`<div class="h" style="justify-content:flex-start">${a}</div>${tn.map(b=>{const n=(S.conf[a]||{})[b]||0,diag=a===b,al=n/cmax;return `<div class="c" title="Heard ${a}, picked ${b}: ${n}" style="background:${n?`color-mix(in srgb,${diag?"var(--ok)":"var(--bad)"} ${Math.round(18+al*72)}%,var(--paper))`:"var(--page)"};${n&&al>.55?"color:#fff":""}">${n||""}</div>`}).join("")}`).join("")}</div>`;
 v.innerHTML=`<section class="panel"><div class="phead"><div class="av">${mascot(S.streak>=3?"cheer":"happy")}</div><div style="flex:1;min-width:0"><label class="sr" for="nm">Your name</label><input class="namein" id="nm" value="${esc(S.name)}" placeholder="Your name" maxlength="24"><p class="muted small">Learning since ${new Date(S.joined+"T12:00").toLocaleDateString(undefined,{month:"long",year:"numeric"})}</p></div></div></section>
 <div class="statgrid">
  <div class="sbox" style="color:var(--gold)">${I.flame}<div><b style="color:var(--ink)">${S.streak}</b><span>Day streak</span></div></div>
  <div class="sbox" style="color:var(--leaf)">${I.bolt}<div><b style="color:var(--ink)">${S.xp}</b><span>Total XP</span></div></div>
  <div class="sbox" style="color:var(--indigo)">${I.brain}<div><b style="color:var(--ink)">${words}</b><span>Words learned</span></div></div>
  <div class="sbox" style="color:var(--lotus)">${I.trophy}<div><b style="color:var(--ink)">${Object.keys(S.badges).length}/${BADGES.length}</b><span>Badges</span></div></div></div>
 <section class="panel"><div class="spread"><h2>This week</h2><span class="muted small">${lessons} steps finished</span></div>
 <svg viewBox="0 0 280 130" style="width:100%;height:auto" role="img" aria-label="XP per day this week">${days.map((d,i)=>{const h=d.x/mx*84,x=8+i*39;return `<rect x="${x}" y="${100-h}" width="28" height="${Math.max(h,3)}" rx="6" fill="${d.x>=S.goal?"var(--gold)":"var(--leaf)"}" opacity="${d.x?1:.25}"/><text x="${x+14}" y="118" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink-2)">${d.l}</text><text x="${x+14}" y="${94-h}" text-anchor="middle" font-size="10" font-weight="700" fill="var(--ink)">${d.x||""}</text>`}).join("")}
 <line x1="4" x2="276" y1="${100-S.goal/mx*84}" y2="${100-S.goal/mx*84}" stroke="var(--gold)" stroke-dasharray="4 4" stroke-width="1.5"/></svg><p class="hint">Gold bars met your daily goal (dashed line).</p></section>
 <section class="panel"><h2>Tone mix-ups</h2><p class="muted small">Rows are the real tone. Columns are what you picked. Green is right. Red shows which tones you confuse.</p>${Object.keys(S.conf).length?heat:`<p class="muted">Answer a few "Which tone is this?" questions to fill this in.</p>`}</section>
 <section class="panel"><h2>Badges</h2><div class="badges">${BADGES.map(b=>{const on=!!S.badges[b.id];return `<div class="bdg ${on?"":"off"}" style="--bc:${b.c}" title="${esc(b.d)}"><div class="hex">${I[b.ic]}</div>${esc(b.name)}<span class="muted" style="font-weight:500;font-size:.7rem">${esc(b.d)}</span></div>`}).join("")}</div></section>
 <section class="panel"><h2>Settings</h2>
  <div class="setrow"><div class="lab"><b>Vietnamese you hear at home</b><span>Shows these words first. Both are always accepted.</span></div><div class="seg" data-set="dialect">${[["S","South"],["N","North"]].map(([k,l])=>`<button aria-pressed="${S.set.dialect===k}" data-v="${k}">${l}</button>`).join("")}</div></div>
  <div class="setrow"><div class="lab"><b>Daily goal</b><span>XP per day</span></div><div class="seg" data-set="goal">${[10,20,30,50].map(n=>`<button aria-pressed="${S.goal===n}" data-v="${n}">${n}</button>`).join("")}</div></div>
  <div class="setrow"><div class="lab"><b>Speech speed</b><span>For the Vietnamese voice</span></div><div class="seg" data-set="rate">${[[.7,"Slow"],[.9,"Normal"],[1.05,"Fast"]].map(([n,l])=>`<button aria-pressed="${S.set.rate===n}" data-v="${n}">${l}</button>`).join("")}</div></div>
  <div class="setrow"><div class="lab"><b>Sound</b><span>Voice and sound effects</span></div><button class="switch" role="switch" aria-checked="${S.set.sound!==false}" id="swSound" aria-label="Sound"></button></div>
  <div class="setrow"><div class="lab"><b>Theme</b></div><div class="seg" data-set="theme">${[["auto","Auto"],["light","Light"],["dark","Dark"]].map(([k,l])=>`<button aria-pressed="${S.set.theme===k}" data-v="${k}">${l}</button>`).join("")}</div></div>
 </section>
 <section class="panel"><h2>Your data</h2><p class="muted small">Progress saves in this browser only. Download a backup to move it to another device.</p>
  <div class="row"><button class="btn ghost slim" id="exp">${I.down.replace("<svg",'<svg style="width:20px;height:20px"')}Download backup</button><button class="btn ghost slim" id="imp">${I.up.replace("<svg",'<svg style="width:20px;height:20px"')}Restore backup</button><input type="file" id="impf" accept="application/json" hidden></div>
  <button class="btn ghost slim" id="reset" style="color:var(--bad);align-self:flex-start">Reset all progress</button></section>
 <section class="panel"><h2>About Nhím</h2><p>Nhím means hedgehog. This course teaches Vietnamese the way heritage learners need it: tones first, family words early, and both Northern and Southern forms. ${UNITS.length} units, ${ALL_WORDS.length} words, ${UNITS.reduce((a,u)=>a+u.phrases.length,0)} sentences, and ${STORIES.length} stories.</p><p class="muted small">Made by Audrey Pham, Communication Sciences and Disorders, Cal State Fullerton. <a href="https://github.com/audreypham2007-spec/nhim">Source code on GitHub</a>.</p></section>`;
 $("#nm",v).onchange=e=>{S.name=e.target.value.trim();save()};
 $$("[data-set]",v).forEach(g=>$$("button",g).forEach(b=>b.onclick=()=>{const k=g.dataset.set,val=b.dataset.v;
  if(k==="goal")S.goal=+val;else if(k==="rate")S.set.rate=+val;else S.set[k]=val;save();if(k==="theme")applyTheme();if(k==="rate")say("Xin chào");render()}));
 $("#swSound",v).onclick=()=>{S.set.sound=S.set.sound===false;save();render()};
 $("#exp",v).onclick=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(S,null,1)],{type:"application/json"}));a.download="nhim-progress-"+today()+".json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)};
 $("#imp",v).onclick=()=>$("#impf",v).click();
 $("#impf",v).onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{const d=JSON.parse(t);if(typeof d.xp!=="number")throw 0;S=Object.assign(fresh(),d);save();applyTheme();render();toast(I.check,"Progress restored.")}).catch(()=>toast(I.x,"That file isn't a Nhím backup."))};
 $("#reset",v).onclick=()=>sheet(`<h2>Reset all progress?</h2><p>This clears your XP, streak, words and finished lessons in this browser. It can't be undone.</p><button class="btn bad" id="doReset">Reset everything</button><button class="btn ghost" data-close>Keep my progress</button>`,()=>{$("#doReset").onclick=()=>{S=fresh();S.onb=true;save();closeSheet();render()}})}

/* ================= LESSON PLAYER ================= */
let L=null;
function startLesson(u,k,qs){
 const practice=u==="practice";
 let q=qs||buildLesson(u,k);q=q.filter(x=>!x.needsAudio||listenOK());
 L={u,k,q,i:0,practice,check:!practice&&lessonsOf(u).find(l=>l.k===k)?.check,total:q.filter(x=>x.type!=="intro"&&x.type!=="tone-intro").length,answered:0,right:0,wrong:0,combo:0,best:0,start:Date.now(),tonesRight:0};
 $("#layer").innerHTML=`<div class="lesson" role="dialog" aria-label="Lesson"><div class="in">
 <div class="lhead"><button class="xbtn" id="quit" aria-label="Quit lesson">${I.x}</button><div class="pbar" id="pbarw"><i id="pbar" style="width:0%"></i><span class="combo" id="combo"></span></div>
 <span class="stat c-heart">${I.heart}<span id="lh">${practice?"∞":S.hearts}</span></span></div>
 <div class="lbody" id="lbody" aria-live="polite"></div></div>
 <div class="lfoot" id="lfoot"><div class="in2" id="lfootIn"></div></div></div>`;
 $("#quit").onclick=()=>sheet(`<div class="row" style="justify-content:center">${mascot("sad").replace('class="m "','style="width:110px;height:110px" class="m "')}</div><h2 style="text-align:center">Wait, don't go!</h2><p style="text-align:center">You'll lose your progress in this lesson.</p><button class="btn" data-close>Keep learning</button><button class="btn ghost" id="doQuit" style="color:var(--bad)">End lesson</button>`,()=>{$("#doQuit").onclick=()=>{closeSheet();endLesson()}});
 document.body.style.overflow="hidden";showQ()}
function progress(){$("#pbar").style.width=Math.min(100,L.answered/Math.max(1,L.total)*100)+"%";$("#pbarw").classList.toggle("hot",L.combo>=5);$("#combo").textContent=L.combo>=3?L.combo+" in a row":""}
function footer(html,cls=""){const f=$("#lfoot");f.className="lfoot "+cls;$("#lfootIn").innerHTML=html}
function speakerBtn(text,cls=""){return `<button class="spk ${cls}" data-say="${esc(text)}" aria-label="Play">${I.sound}</button>`}
function optHtml(o,k,extra=""){return `<button class="opt" data-o="${esc(o)}" aria-pressed="false" ${extra}><span class="k">${k+1}</span><span>${esc(o)}</span></button>`}
function showQ(){progress();if(L.i>=L.q.length)return L.story?storyEnd():finish();
 const q=L.q[L.i],b=$("#lbody");let h="";let ready=()=>false,check=()=>false,answerText=()=>q.ans,sel=null;
 const isNew=q.it&&!q.it.tonal&&q.it.vi&&!S.srs[q.it.vi]&&q.type!=="intro"&&!L.practice;
 if(q.type==="tone-intro"){const t=q.t;
  h=`<p class="qnew">${I.star}New tone</p><div class="flash"><span class="word">${esc(t.ex)}</span>${contour(t,{w:260,h:90,dot:true,color:"var(--lotus)"})}<span class="gloss">${esc(t.name)}: ${esc(t.en)}</span><span class="also">Mark: ${esc(t.mark)}. ${esc(t.ex)} means "${esc(t.mean)}".</span><div class="row">${speakerBtn(t.ex,"mid")}<button class="spk" data-slow="${esc(t.ex)}" aria-label="Play slowly">${I.slow}</button></div></div>`;
  b.innerHTML=h;bindSay(b);const sv=$("svg.contour",b);setTimeout(()=>{say(t.ex,{slow:true});animateDot(sv,t,1200)},250);
  $$("[data-say],[data-slow]",b).forEach(x=>x.addEventListener("click",()=>animateDot(sv,t,1200)));
  footer(`<button class="btn" id="cont">Continue</button>`);$("#cont").onclick=()=>{L.i++;showQ()};return}
 if(q.type==="intro"){const it=q.it,w=disp(it),others=forms(it).filter(f=>f!==w);
  h=`<p class="qnew">${I.star}New ${/\s/.test(it.vi)&&it.vi.split(" ").length>2?"phrase":"word"}</p><div class="flash">${mascot("wow","pop").replace('class="m','style="width:110px;height:110px" class="m')}<span class="word">${esc(w)}</span><span class="gloss">${esc(it.en)}</span>${others.length?`<span class="also">Also said: ${esc(others.join(", "))}</span>`:""}
  <div class="tonechips">${w.split(" ").map(s=>`<span class="tchip">${esc(s)}: ${toneOf(s)}</span>`).join("")}</div><div class="row">${speakerBtn(w,"mid")}<button class="spk" data-slow="${esc(w)}" aria-label="Play slowly">${I.slow}</button></div></div>`;
  b.innerHTML=h;bindSay(b);setTimeout(()=>say(w),200);
  footer(`<button class="btn" id="cont">Got it</button>`);$("#cont").onclick=()=>{srsSeen(it);save();L.i++;showQ()};return}
 h=`${isNew?`<p class="qnew">${I.star}New word</p>`:""}<p class="qtitle">${esc(q.title)}</p>`;
 if(q.type==="mc"){h+=`<div class="prompt">${mascot("happy","",)}<div class="bubble">${q.audio?speakerBtn(q.audio):""}<span>${esc(q.show)}</span></div></div>
  <div class="opts ${q.grid||q.opts.every(o=>o.length<14)?"two":""}">${q.opts.map((o,k)=>optHtml(o,k)).join("")}</div>${q.tone?`<p class="hint">Look at the mark on the vowel. No mark means ngang.</p>`:""}`;
  b.innerHTML=h;if(q.audio&&!q.num)setTimeout(()=>say(q.audio),200);
  $$(".opt",b).forEach(o=>o.onclick=()=>{$$(".opt",b).forEach(x=>x.setAttribute("aria-pressed","false"));o.setAttribute("aria-pressed","true");sel=o.dataset.o;fx("tap");if(q.optAudio)say(sel);enable()});
  ready=()=>sel!==null;check=()=>sel===q.ans}
 if(q.type==="shape"){const t=toneByName(q.ans);if(!q.opts.includes(q.ans)){q.opts[0]=q.ans;q.opts=shuffle(q.opts)}
  h+=`<div class="prompt">${mascot("think")}<div class="bubble">${speakerBtn(q.audio)}<span style="font-size:1.7rem">${esc(q.show)}</span></div></div>
  <div class="opts">${q.opts.map((n,k)=>`<button class="opt shape" data-o="${esc(n)}" aria-pressed="false" aria-label="Pitch shape ${k+1}"><span class="row" style="justify-content:space-between"><span class="k">${k+1}</span></span>${contour(toneByName(n),{w:300,h:70})}</button>`).join("")}</div>`;
  b.innerHTML=h;setTimeout(()=>say(q.audio),200);
  $$(".opt",b).forEach(o=>o.onclick=()=>{$$(".opt",b).forEach(x=>x.setAttribute("aria-pressed","false"));o.setAttribute("aria-pressed","true");sel=o.dataset.o;fx("tap");enable()});
  ready=()=>sel!==null;check=()=>sel===q.ans;answerText=()=>q.ans+" ("+t.en+")"}
 if(q.type==="listen"){h+=`<div class="row" style="justify-content:center;gap:18px;padding:8px 0 4px">${speakerBtn(q.audio,"big")}<button class="spk mid" data-slow="${esc(q.audio)}" aria-label="Play slowly" style="background:var(--indigo);box-shadow:0 5px 0 color-mix(in srgb,var(--indigo) 60%,#000)">${I.slow}</button></div>
  <div class="opts two">${q.opts.map((o,k)=>optHtml(o,k)).join("")}</div>`;
  b.innerHTML=h;setTimeout(()=>say(q.audio),300);
  $$(".opt",b).forEach(o=>o.onclick=()=>{$$(".opt",b).forEach(x=>x.setAttribute("aria-pressed","false"));o.setAttribute("aria-pressed","true");sel=o.dataset.o;fx("tap");enable()});
  ready=()=>sel!==null;check=()=>sel===q.ans}
 if(q.type==="match"){const left=shuffle(q.pairs.map(p=>p[0])),right=shuffle(q.pairs.map(p=>p[1]));
  h+=`<div class="opts two"><div class="opts">${left.map(x=>`<button class="opt" data-side="vi" data-v="${esc(x)}" aria-pressed="false">${esc(x)}</button>`).join("")}</div><div class="opts">${right.map(x=>`<button class="opt" data-side="en" data-v="${esc(x)}" aria-pressed="false">${esc(x)}</button>`).join("")}</div></div>`;
  b.innerHTML=h;let a=null,got=0,miss=0;
  $$(".opt",b).forEach(o=>o.onclick=()=>{if(o.dataset.side==="vi")say(o.dataset.v);else fx("tap");
   if(!a||a.dataset.side===o.dataset.side){$$(`.opt[data-side="${o.dataset.side}"]`,b).forEach(x=>x.setAttribute("aria-pressed","false"));o.setAttribute("aria-pressed","true");a=o;return}
   const vi=a.dataset.side==="vi"?a.dataset.v:o.dataset.v,en=a.dataset.side==="en"?a.dataset.v:o.dataset.v,pr=q.pairs.find(p=>p[0]===vi&&p[1]===en);
   if(pr){[a,o].forEach(x=>{x.setAttribute("aria-pressed","false");x.classList.add("goodflash");setTimeout(()=>{x.classList.remove("goodflash");x.classList.add("matched")},250)});got++;fx("combo");srsSeen(pr[2]);if(got===q.pairs.length){enable();setTimeout(()=>$("#chk")?.click(),400)}}
   else{miss++;fx("bad");[a,o].forEach(x=>{x.classList.add("wrongflash");setTimeout(()=>{x.classList.remove("wrongflash");x.setAttribute("aria-pressed","false")},450)})}a=null});
  ready=()=>got===q.pairs.length;check=()=>true;answerText=()=>""}
 if(q.type==="bank"){h+=`<div class="prompt">${mascot("happy")}<div class="bubble">${q.audio?speakerBtn(q.audio):""}<span>${esc(q.show)}</span></div></div><div class="answer-line" id="aline" aria-label="Your answer"></div>
  <div class="bank">${q.tiles.map((t,k)=>`<button class="tile" data-k="${k}">${esc(t)}</button>`).join("")}</div>`;
  b.innerHTML=h;if(q.audio)setTimeout(()=>say(q.audio),200);const line=$("#aline");
  $$(".bank .tile",b).forEach(t=>t.onclick=()=>{if(t.classList.contains("used"))return;t.classList.add("used");if(q.audio)fx("tap");else say(t.textContent);
   const c=document.createElement("button");c.className="tile";c.textContent=t.textContent;c.onclick=()=>{c.remove();t.classList.remove("used");fx("tap");enable()};line.appendChild(c);enable()});
  ready=()=>line.children.length>0;check=()=>norm([...line.children].map(c=>c.textContent).join(" "))===norm(q.ans);answerText=()=>q.audio?q.it.en:q.it.vi}
 if(q.type==="fill"){const parts=q.sentence.split("___");
  h+=`<div class="prompt">${mascot("think")}<div class="bubble" style="font-size:1rem;font-weight:500;color:var(--ink-2)">${esc(q.en)}</div></div><p class="sentence">${esc(parts[0])}<span class="blank" id="blank">&nbsp;</span>${esc(parts[1]||"")}</p>
  <div class="opts">${q.opts.map((o,k)=>optHtml(o,k)).join("")}</div>`;
  b.innerHTML=h;$$(".opt",b).forEach(o=>o.onclick=()=>{$$(".opt",b).forEach(x=>x.setAttribute("aria-pressed","false"));o.setAttribute("aria-pressed","true");sel=o.dataset.o;$("#blank").textContent=sel;say(sel);enable()});
  ready=()=>sel!==null;check=()=>sel===q.ans;answerText=()=>q.sentence.replace("___",q.ans)}
 if(q.type==="type"){h+=q.hideText?`<div class="row" style="justify-content:center;gap:18px;padding:4px 0">${speakerBtn(q.audio,"big")}<button class="spk mid" data-slow="${esc(q.audio)}" aria-label="Play slowly" style="background:var(--indigo);box-shadow:0 5px 0 color-mix(in srgb,var(--indigo) 60%,#000)">${I.slow}</button></div>`
   :`<div class="prompt">${mascot("happy")}<div class="bubble"><span>${esc(q.show)}</span></div></div>`;
  h+=`<label for="typein" class="sr">Your answer</label><textarea class="typein" id="typein" autocomplete="off" autocapitalize="off" spellcheck="false" lang="vi" placeholder="Gõ tiếng Việt..."></textarea>
  <div class="keys" aria-label="Vietnamese letters">${"ă â đ ê ô ơ ư".split(" ").map(k=>`<button data-key="${k}">${k}</button>`).join("")}</div>
  <div class="keys" aria-label="Tone marks">${[["́","sắc ´"],["̀","huyền `"],["̉","hỏi ?"],["̃","ngã ~"],["̣","nặng ."]].map(([m,l])=>`<button data-mark="${m}" title="Add ${l.split(" ")[0]} to the last letter">${l}</button>`).join("")}</div>`;
  b.innerHTML=h;if(q.hideText)setTimeout(()=>say(q.audio),300);const ta=$("#typein");ta.oninput=enable;
  $$("[data-key]",b).forEach(k=>k.onclick=()=>{ta.value+=k.dataset.key;ta.focus();enable()});
  $$("[data-mark]",b).forEach(k=>k.onclick=()=>{if(!ta.value)return;const base=ta.value.slice(0,-1),last=ta.value.slice(-1).normalize("NFD").replace(/[̣̀́̃̉]/g,"");ta.value=base+(last+k.dataset.mark).normalize("NFC");ta.focus();enable()});
  if(matchMedia("(pointer:fine)").matches)setTimeout(()=>ta.focus(),60);
  ready=()=>ta.value.trim().length>0;
  check=()=>{const g=norm(ta.value),acc=q.alts||[q.ans];if(acc.some(a=>norm(a)===g))return true;if(acc.some(a=>bare(a)===bare(ta.value))){q.slip=true;return true}return false}}
 bindSay(b);
 const skip=q.needsAudio?`<button class="btn ghost skip" id="noaudio">Can't listen now</button>`:"";
 footer(`${skip}<button class="btn" id="chk" disabled>Check</button>`);
 function enable(){const c=$("#chk");if(c)c.disabled=!ready()}
 $("#chk").onclick=()=>grade(check(),answerText(),q,sel);
 if(skip)$("#noaudio").onclick=()=>{S.noListenUntil=Date.now()+15*MIN;save();L.q.splice(L.i,1);L.total--;L.q=L.q.filter(x=>!x.needsAudio);L.total=L.answered+L.q.slice(L.i).filter(x=>x.type!=="intro"&&x.type!=="tone-intro").length;toast(I.ear,"Listening is off for 15 minutes.");showQ()};
}
function grade(ok,ans,q,sel){L.answered++;const b=$("#lbody");
 $$(".opt,.tile,.keys button,textarea",b).forEach(x=>{x.disabled=true;x.style.pointerEvents="none"});
 if(sel!=null&&(q.type==="mc"||q.type==="listen"||q.type==="fill"||q.type==="shape"))$$(".opt",b).forEach(o=>{if(o.dataset.o===q.ans)o.classList.add("reveal-ok");else if(o.dataset.o===sel)o.classList.add("reveal-bad")});
 if(q.tone){const real=q.ans,picked=sel;S.conf[real]=S.conf[real]||{};S.conf[real][picked]=(S.conf[real][picked]||0)+1}
 if(q.tone||q.type==="shape"){const t=S.tstat[q.ans]||(S.tstat[q.ans]={r:0,w:0});ok?t.r++:t.w++;if(ok)questProg("tones",1)}
 const m=$(".prompt>svg",b);
 if(ok){L.right++;L.combo++;L.best=Math.max(L.best,L.combo);questProg("combo",L.combo,true);S.cnt.bestCombo=Math.max(S.cnt.bestCombo,L.combo);
  if(q.it&&!q.it.tonal)srsHit(q.it,true);
  fx(L.combo>0&&L.combo%5===0?"combo":"ok");if(m){m.outerHTML=mascot("cheer","m-hop")}
  const praise=L.combo>=5?pick(["Đỉnh quá!","Không cản nổi!","Quá giỏi!"],1)[0]:pick(["Giỏi quá!","Tuyệt vời!","Đúng rồi!","Hay lắm!","Chính xác!"],1)[0];
  const extra=q.slip?`<p>Watch the marks: <b>${esc(q.ans)}</b></p>`:q.type==="type"&&q.alts&&q.alts.length>1?`<p class="mean">Also right: ${esc(q.alts.filter(a=>norm(a)!==norm(q.ans)).join(", "))}</p>`:q.it&&q.it.en&&q.type!=="match"&&!q.it.tonal&&q.type!=="mc"?`<p class="mean">${esc(disp(q.it))} = ${esc(q.it.en)}</p>`:"";
  footer(`<div class="fb"><span class="badge">${I.check}</span><div><h3>${praise}</h3>${extra}</div></div><button class="btn" id="cont">Continue</button>`,"ok")}
 else{L.wrong++;L.combo=0;if(q.it&&!q.it.tonal)srsHit(q.it,false);
  if(!L.practice&&!L.story){loseHeart();$("#lh").textContent=S.hearts}
  fx("bad");if(m){m.outerHTML=mascot("sad","m-droop")}
  L.q.push({...q,slip:false});L.total++;
  footer(`<div class="fb"><span class="badge">${I.x}</span><div><h3>Not quite</h3>${ans?`<p>Correct answer: <b>${esc(ans)}</b></p>`:""}${q.it&&q.it.en&&!q.it.tonal&&ans!==q.it.en&&q.show!==q.it.en&&q.type!=="bank"?`<p class="mean">${esc(q.it.en)}</p>`:""}</div></div><button class="btn bad" id="cont">Got it</button>`,"bad")}
 save();progress();
 if(q.it&&q.it.vi&&!q.num&&q.type!=="match")setTimeout(()=>say(q.type==="bank"&&q.audio?q.audio:disp(q.it.vi?q.it:{vi:q.it.vi})),150);
 $("#cont").onclick=()=>{L.i++;if(!L.practice&&!L.story&&S.hearts<=0)return outOfHearts();showQ()};$("#cont").focus()}
function finish(){const acc=Math.round(L.right/Math.max(1,L.right+L.wrong)*100),secs=Math.round((Date.now()-L.start)/1000),perfect=L.wrong===0&&L.right>0;
 let xp=L.practice?10:L.check?20:10;if(perfect&&!L.practice)xp+=L.check?10:5;
 const firstTime=!L.practice&&!S.done[L.u+":"+L.k];
 if(!L.practice){S.done[L.u+":"+L.k]=1;S.cnt.lessons++;questProg("lessons",1);if(perfect){S.cnt.perfect++;questProg("perfect",1)}}
 else{S.hearts=Math.min(5,S.hearts+1);questProg("practice",1)}
 const extended=addXp(xp);const badges=checkBadges();save();
 fx("done");confetti();
 const title=L.check&&firstTime?"Unit complete!":perfect?"Perfect lesson!":L.practice?"Practice done!":"Lesson complete!";
 const unl=[];if(L.practice)unl.push(`<div class="unlock" style="color:var(--lotus)">${I.heart}<span style="color:var(--ink)">One heart refilled</span></div>`);
 badges.forEach(b=>unl.push(`<div class="unlock" style="color:${b.c}">${I[b.ic]}<span style="color:var(--ink)">New badge: <b>${esc(b.name)}</b></span></div>`));
 if(L.check&&firstTime&&L.u+1<UNITS.length)unl.push(`<div class="unlock" style="color:var(--leaf)">${I.star}<span style="color:var(--ink)">Unit ${L.u+2} unlocked: <b>${esc(UNITS[L.u+1].title)}</b></span></div>`);
 if(L.u===-1&&L.k===2&&firstTime)unl.push(`<div class="unlock" style="color:var(--leaf)">${I.star}<span style="color:var(--ink)">Unit 1 unlocked: <b>${esc(UNITS[0].title)}</b></span></div>`);
 $("#lbody").innerHTML=`<div class="result">${mascot("cheer","pop")}<h2>${title}</h2>
 <div class="tally"><div class="tal" style="--t:var(--gold)"><span>Total XP</span><div>${I.bolt}<b id="xpcount">0</b></div></div><div class="tal" style="--t:var(--leaf)"><span>${acc>=90?"Amazing":acc>=70?"Good":"Accuracy"}</span><div>${I.target}${acc}%</div></div><div class="tal" style="--t:var(--indigo)"><span>Time</span><div>${I.clock}${Math.floor(secs/60)}:${pad2(secs%60)}</div></div></div>
 ${L.best>=5?`<p class="muted">Best run: ${L.best} in a row.</p>`:""}${unl.length?`<div class="unlocks">${unl.join("")}</div>`:""}</div>`;
 countUp($("#xpcount"),xp);$("#pbar").style.width="100%";
 footer(`<button class="btn" id="cont">Continue</button>`);$("#cont").onclick=()=>{if(extended&&S.streakShown!==today()){S.streakShown=today();save();streakScreen()}else endLesson()};$("#cont").focus()}
function countUp(el,n){if(!el)return;const t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/700);el.textContent=Math.round(n*k*(2-k));if(k<1)requestAnimationFrame(f)})(t0)}
function streakScreen(){fx("combo");$("#lbody").innerHTML=`<div class="result"><div class="flame-big pop">${I.flame.replace("<svg",'<svg style="width:100%;height:100%"')}</div><div class="streaknum">${S.streak}</div><h2 style="color:var(--ink)">day streak!</h2><p class="muted">${S.streak===1?"Day one. Come back tomorrow to keep the flame going.":`You've practiced ${S.streak} days in a row. Học mỗi ngày!`}</p><div class="widget" style="width:100%">${weekDots()}</div></div>`;
 footer(`<button class="btn gold" id="cont">Continue</button>`);$("#cont").onclick=()=>endLesson();$("#cont").focus()}
function endLesson(){$$(".gloss-pop").forEach(x=>x.remove());L=null;$("#layer").innerHTML="";document.body.style.overflow="";render()}
function outOfHearts(){const t=nextHeartIn(),hrs=Math.floor(t/HOUR),mins=Math.ceil((t%HOUR)/MIN);
 $("#lbody").innerHTML=`<div class="result">${mascot("sleep")}<h2 style="color:var(--ink)">Out of hearts</h2><p class="muted">Nhím needs a nap. Your next heart comes back in ${hrs?hrs+" h ":""}${mins} min. Or earn one now with a practice session.</p></div>`;
 footer(`<button class="btn" id="cont">Practice to earn a heart</button><button class="btn ghost skip" id="later">Quit</button>`);
 $("#cont").onclick=()=>{endLesson();startPractice(Object.keys(S.miss).length?"mistakes":"review")};$("#later").onclick=()=>endLesson()}

/* ================= STORIES ================= */
function startStory(st,key){
 L={story:st,key,i:0,line:0,q:[],answered:0,total:st.lines.length+st.questions.length,right:0,wrong:0,combo:0,best:0,start:Date.now()};
 const cast=Object.keys(st.cast||{}),rightSide=cast[1];
 $("#layer").innerHTML=`<div class="lesson" role="dialog" aria-label="Story"><div class="in">
 <div class="lhead"><button class="xbtn" id="quit" aria-label="Close story">${I.x}</button><div class="pbar"><i id="pbar" style="width:0%"></i><span class="combo" id="combo"></span></div><span id="pbarw" hidden></span></div>
 <div class="lbody" id="lbody"><div><p class="muted small">Story</p><h2 style="font-size:1.8rem">${esc(st.title)}</h2><p class="muted">${esc(st.vi)}. Tap a word to see what it means.</p></div><div class="dlg" id="dlg"></div></div></div>
 <div class="lfoot" id="lfoot"><div class="in2" id="lfootIn"></div></div></div>`;
 $("#quit").onclick=()=>endLesson();document.body.style.overflow="hidden";
 const pbar=()=>{$("#pbar").style.width=Math.min(100,L.answered/L.total*100)+"%"};
 const next=()=>{const qn=st.questions.find(q=>q.after===L.line-1&&!q._done);
  if(qn)return askQ(qn);
  if(L.line>=st.lines.length)return storyEnd();
  const ln=st.lines[L.line],who=st.cast?.[ln.who]||ln.who,r=ln.who===rightSide;
  const el=document.createElement("div");el.className="line"+(r?" r":"");
  el.innerHTML=`${avatar(who,ln.who)}<div class="say"><p class="who">${esc(who)}</p><p class="vi">${wrapWords(ln.vi)}</p><p class="en">${esc(ln.en)}</p></div>`;
  $("#dlg").appendChild(el);el.scrollIntoView({block:"end",behavior:"smooth"});bindGloss(el);say(ln.vi);
  L.line++;L.answered++;pbar();
  footer(`<button class="mini" data-say="${esc(ln.vi)}" aria-label="Replay line" style="width:52px;height:52px;border-radius:14px">${I.sound}</button><button class="btn" id="cont">Continue</button>`);bindSay($("#lfoot"));$("#cont").onclick=next;$("#cont").focus()};
 const askQ=qn=>{qn._done=true;const box=document.createElement("div");box.className="squiz";
  box.innerHTML=`<h3>${esc(qn.q)}</h3><div class="opts">${shuffle(qn.opts).map((o,k)=>optHtml(o,k)).join("")}</div>`;
  $("#dlg").appendChild(box);box.scrollIntoView({block:"end",behavior:"smooth"});footer(`<p class="muted" style="text-align:center;width:100%">Pick an answer to keep reading.</p>`);
  $$(".opt",box).forEach(o=>o.onclick=()=>{const ok=o.dataset.o===qn.ans;$$(".opt",box).forEach(x=>{x.style.pointerEvents="none";if(x.dataset.o===qn.ans)x.classList.add("reveal-ok")});
   if(!ok)o.classList.add("reveal-bad");ok?(L.right++,fx("ok")):(L.wrong++,fx("bad"));L.answered++;pbar();
   footer(`<div class="fb"><span class="badge">${ok?I.check:I.x}</span><div><h3>${ok?"Đúng rồi!":"Not quite"}</h3>${ok?"":`<p>Answer: <b>${esc(qn.ans)}</b></p>`}</div></div><button class="btn ${ok?"":"bad"}" id="cont">Continue</button>`,ok?"ok":"bad");$("#cont").onclick=next;$("#cont").focus()})};
 L.next=next;next()}
function wrapWords(s){return s.split(/(\s+)/).map(t=>/\s/.test(t)?t:`<span class="w" data-w="${esc(t)}">${esc(t)}</span>`).join("")}
function lookUp(words,i){for(let n=3;n>=1;n--)for(let s=Math.max(0,i-n+1);s<=i;s++){const ph=norm(words.slice(s,s+n).join(" "));const w=WORD_BY_VI.get(ph);if(w&&s+n>i)return {w,s,n}}return null}
function bindGloss(el){const spans=$$(".w",el),words=spans.map(s=>s.dataset.w);
 spans.forEach((sp,i)=>sp.onclick=()=>{$$(".gloss-pop").forEach(x=>x.remove());$$(".w.on").forEach(x=>x.classList.remove("on"));
  const hit=lookUp(words,i);const r=sp.getBoundingClientRect();const pop=document.createElement("div");pop.className="gloss-pop";
  if(hit){spans.slice(hit.s,hit.s+hit.n).forEach(x=>x.classList.add("on"));pop.textContent=hit.w.en;say(words.slice(hit.s,hit.s+hit.n).join(" ").replace(/[.,!?]/g,""))}else{sp.classList.add("on");pop.textContent="Not in your word list yet";say(sp.dataset.w.replace(/[.,!?]/g,""))}
  pop.style.left=Math.min(innerWidth-130,Math.max(130,r.left+r.width/2))+"px";pop.style.top=r.top+"px";document.body.appendChild(pop);setTimeout(()=>pop.remove(),2200)})}
function storyEnd(){const st=L.story,first=!S.stories[st.id];S.stories[st.id]=1;S.done[L.key]=1;if(first)S.cnt.stories++;questProg("story",1);
 const extended=addXp(15);const badges=checkBadges();save();fx("done");confetti();
 $("#lbody").innerHTML=`<div class="result">${mascot("cheer","pop")}<h2>Story complete!</h2><p class="muted">${esc(st.title)}: ${L.right} of ${st.questions.length} questions right.</p>
 <div class="tally" style="grid-template-columns:1fr 1fr"><div class="tal" style="--t:var(--gold)"><span>Total XP</span><div>${I.bolt}<b id="xpcount">0</b></div></div><div class="tal" style="--t:var(--indigo)"><span>Lines read</span><div>${I.book}${st.lines.length}</div></div></div>
 ${badges.length?`<div class="unlocks">${badges.map(b=>`<div class="unlock" style="color:${b.c}">${I[b.ic]}<span style="color:var(--ink)">New badge: <b>${esc(b.name)}</b></span></div>`).join("")}</div>`:""}</div>`;
 countUp($("#xpcount"),15);$("#pbar").style.width="100%";
 footer(`<button class="btn" id="cont">Continue</button>`);$("#cont").onclick=()=>{if(extended&&S.streakShown!==today()){S.streakShown=today();save();streakScreen()}else endLesson()}}

/* ================= SMALL UI ================= */
function bindSay(r){$$("[data-say]",r).forEach(b=>b.onclick=e=>{e.stopPropagation();say(b.dataset.say);b.classList.remove("speaking");void b.offsetWidth;b.classList.add("speaking")});$$("[data-slow]",r).forEach(b=>b.onclick=e=>{e.stopPropagation();say(b.dataset.slow,{slow:true})})}
let lastFocus=null;
function sheet(html,after){closeSheet();lastFocus=document.activeElement;$("#layer").insertAdjacentHTML("beforeend",`<div class="sheet" id="sheet"><div class="card" role="dialog" aria-modal="true">${html}</div></div>`);
 const s=$("#sheet");s.onclick=e=>{if(e.target===s)closeSheet()};$$("[data-close]",s).forEach(b=>b.onclick=closeSheet);bindSay(s);after&&after();($(".btn",s)||$("button",s)||s).focus()}
function closeSheet(){const s=$("#sheet");if(s){s.remove();lastFocus?.focus?.()}}
let toastT=null;function toast(icon,text){$$(".toast").forEach(t=>t.remove());const t=document.createElement("div");t.className="toast";t.setAttribute("role","status");t.innerHTML=icon+`<span>${esc(text)}</span>`;document.body.appendChild(t);clearTimeout(toastT);toastT=setTimeout(()=>t.remove(),2600)}
function streakSheet(){sheet(`<div class="streakbig" style="color:var(--gold)">${I.flame}<div><b style="color:var(--ink)">${S.streak} day streak</b><p class="muted small">Best: ${S.best} ${S.best===1?"day":"days"}</p></div></div>${weekDots()}<p class="muted">${S.last===today()?"You practiced today. The flame is lit.":"Finish any lesson today to keep your streak."}</p><h3>Daily quests</h3>${questsHtml()}<button class="btn" data-close>Got it</button>`)}
function heartSheet(blocked){const t=nextHeartIn(),hrs=Math.floor(t/HOUR),mins=Math.ceil((t%HOUR)/MIN);
 sheet(`<h2>${blocked?"You're out of hearts":"Hearts"}</h2><div class="row" style="color:var(--lotus)">${[0,1,2,3,4].map(i=>`<span style="width:34px;opacity:${i<S.hearts?1:.2}">${I.heart}</span>`).join("")}</div>
 <p>You lose a heart for each mistake in a lesson. ${S.hearts<5?`Next heart in <b>${hrs?hrs+" h ":""}${mins} min</b>.`:"You have all 5."} Practice never costs hearts, and finishing a session gives one back.</p>
 <button class="btn" id="hp">Practice to earn a heart</button><button class="btn ghost" data-close>Close</button>`,()=>{$("#hp").onclick=()=>{closeSheet();startPractice(Object.keys(S.miss).length?"mistakes":"review")}})}

/* ================= ONBOARDING ================= */
function onboarding(){let step=0;const o=document.createElement("div");o.className="onb";document.body.appendChild(o);
 const pickRow=(id,ic,b,s,on)=>`<button class="pickcard" data-pick="${id}" aria-pressed="${on}"><span class="ic">${ic}</span><span><b>${b}</b><span>${s}</span></span></button>`;
 let level="new";
 const draw=()=>{const dots=`<div class="dots">${[0,1,2,3].map(i=>`<i class="${i===step?"on":""}"></i>`).join("")}</div>`;
  if(step===0)o.innerHTML=`<div class="in"><div class="hero">${mascot("happy","bob")}<h1>Nhím</h1><p style="font-size:1.15rem">Learn Vietnamese in a few minutes a day. Tones first, family words early, and the Vietnamese your family speaks.</p></div><button class="btn" id="nx">Get started</button>${dots}</div>`;
  if(step===1)o.innerHTML=`<div class="in"><h2>Which Vietnamese do you hear at home?</h2><p class="muted">Nhím shows these words first. Both are always accepted.</p>${pickRow("S","N","Southern","Sài Gòn, the Mekong Delta, and most Viet families in Orange County",S.set.dialect==="S")}${pickRow("N","B","Northern","Hà Nội and the North",S.set.dialect==="N")}<button class="btn" id="nx">Continue</button>${dots}</div>`;
  if(step===2)o.innerHTML=`<div class="in"><h2>How much Vietnamese do you know?</h2>${pickRow("new","1","I'm new","Start from the six tones",level==="new")}${pickRow("some","2","I understand some, but can't read it","Skip ahead to Unit 3",level==="some")}${pickRow("more","3","I can read a little","Skip ahead to Unit 5",level==="more")}<button class="btn" id="nx">Continue</button>${dots}</div>`;
  if(step===3)o.innerHTML=`<div class="in"><h2>Pick a daily goal</h2><p class="muted">A lesson is about 10 XP and 3 to 5 minutes.</p>${[[10,"Casual","1 lesson a day"],[20,"Regular","2 lessons a day"],[30,"Serious","3 lessons a day"],[50,"Intense","5 lessons a day"]].map(([n,b,s])=>pickRow(n,n,b,s,S.goal===n)).join("")}<button class="btn" id="nx">Start learning</button>${dots}</div>`;
  $$("[data-pick]",o).forEach(b=>b.onclick=()=>{$$("[data-pick]",o).forEach(x=>x.setAttribute("aria-pressed","false"));b.setAttribute("aria-pressed","true");const v=b.dataset.pick;
   if(step===1)S.set.dialect=v;if(step===2)level=v;if(step===3)S.goal=+v;fx("tap")});
  $("#nx",o).onclick=()=>{if(step<3){step++;draw();return}
   if(level!=="new"){const upto=level==="some"?2:4;ORDER.forEach(k=>{const u=+k.split(":")[0];if(u<upto)S.done[k]=1})}
   S.onb=true;save();o.remove();render();if(level!=="new")toast(I.star,`Unit ${level==="some"?3:5} is open. Earlier units stay open for review.`)}};
 draw()}

/* ================= KEYS + START ================= */
document.addEventListener("keydown",e=>{
 if(e.key==="Escape"&&$("#sheet")){closeSheet();return}
 if(!L||$("#sheet"))return;
 if(e.key==="Enter"&&!e.shiftKey){const c=$("#cont")||$("#chk");if(c&&!c.disabled&&document.activeElement!==c){e.preventDefault();c.click()}return}
 if(/^[1-9]$/.test(e.key)&&document.activeElement?.tagName!=="TEXTAREA"&&!$("#cont")){const o=$$("#lbody .opt:not(.matched)")[+e.key-1];if(o){o.click();o.focus()}}});
applyTheme();dailyRefresh();shell();setTab("learn");
if(!S.onb)onboarding();
setTimeout(()=>{UI.findVoice();if(!L&&(tab==="guide"||tab==="practice"))render()},900);
if("speechSynthesis" in window)speechSynthesis.addEventListener?.("voiceschanged",()=>{if(!L&&tab==="guide")render()});
setInterval(()=>{if(!L){const h=S.hearts;regen();if(h!==S.hearts){save();topStats()}}},60000);
if("serviceWorker" in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("sw.js").catch(()=>{});
window.__nhim={get S(){return S},get L(){return L},startLesson,buildLesson,ORDER,numVi,showQ,grade};
})();
