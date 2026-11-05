/* Nhím tone mirror: say a word, see your pitch next to the target tone.
   Runs fully in the browser. Pitch is found with a small YIN detector on the microphone signal.
   Nothing is recorded or sent anywhere. */
(function(){
const W=320,H=150,PAD=8,REC_MS=2000,SILENCE_MS=380,ST_PER_LEVEL=2.4;
const X=x=>PAD+x*(W-2*PAD),Y=y=>H-PAD-(Math.max(.6,Math.min(5.4,y))-1)/4*(H-2*PAD);
let ctx=null,stream=null,an=null,buf=null;

const supported=()=>!!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&(window.AudioContext||window.webkitAudioContext));

let src=null;
/* one audio engine per mirror session (made during the tap, which iPhone Safari needs); the mic itself is opened and released for every try */
function ensureCtx(){if(!ctx){ctx=new (window.AudioContext||window.webkitAudioContext)();an=ctx.createAnalyser();an.fftSize=2048;buf=new Float32Array(an.fftSize)}if(ctx.state==="suspended")ctx.resume()}
async function openMic(){
 stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:true}});
 src=ctx.createMediaStreamSource(stream);src.connect(an);
}
function releaseMic(){try{src&&src.disconnect()}catch(e){}try{stream&&stream.getTracks().forEach(t=>t.stop())}catch(e){}src=stream=null}
function closeMic(){releaseMic();try{ctx&&ctx.close()}catch(e){}ctx=an=null}

/* one pitch estimate (Hz) for the current audio frame, or 0 if it's silence or noise */
function pitchNow(){
 an.getFloatTimeDomainData(buf);
 let rms=0;for(let i=0;i<buf.length;i++)rms+=buf[i]*buf[i];rms=Math.sqrt(rms/buf.length);
 if(rms<.01)return {hz:0,rms};
 const sr=ctx.sampleRate,minL=Math.floor(sr/450),maxL=Math.floor(sr/65),n=buf.length-maxL;
 const d=new Float32Array(maxL+2);
 for(let l=1;l<=maxL+1;l++){let s=0;for(let i=0;i<n;i++){const x=buf[i]-buf[i+l];s+=x*x}d[l]=s}
 let run=0,best=-1;const c=new Float32Array(maxL+2);c[0]=1;
 for(let l=1;l<=maxL+1;l++){run+=d[l];c[l]=run?d[l]*l/run:1}
 for(let l=minL;l<=maxL;l++){if(c[l]<.15){while(l+1<=maxL&&c[l+1]<c[l])l++;best=l;break}}
 if(best<0)return {hz:0,rms};
 const a=c[best-1],b=c[best],e=c[best+1],den=a-2*b+e,shift=den?(a-e)/(2*den):0;
 return {hz:sr/(best+shift),rms};
}

const st=hz=>12*Math.log2(hz/100);
const median=a=>{const s=[...a].sort((x,y)=>x-y);return s.length?s[s.length>>1]:0};

/* target pitch level (1 to 5) at time t (0 to 1) */
function targetAt(tone,t){const p=tone.contour;if(t<=p[0][0])return p[0][1];
 for(let i=1;i<p.length;i++)if(t<=p[i][0]){const [x0,y0]=p[i-1],[x1,y1]=p[i];return y0+(y1-y0)*(t-x0)/((x1-x0)||1)}
 return p[p.length-1][1]}

/* clean the raw frames: drop octave jumps, smooth, and turn into levels on the 1 to 5 scale */
function clean(frames,ref){
 const v=frames.filter(f=>f.hz>0);if(v.length<5)return null;
 const s=v.map(f=>st(f.hz)),m=median(s);
 let pts=v.map((f,i)=>({t:f.t,s:s[i]})).filter(p=>Math.abs(p.s-m)<8);
 if(pts.length<5)return null;
 pts=pts.map((p,i)=>{const w=pts.slice(Math.max(0,i-2),i+3).map(q=>q.s);return {t:p.t,s:median(w)}});
 const t0=pts[0].t,t1=pts[pts.length-1].t,span=Math.max(1,t1-t0),base=ref==null?m:ref;
 return {pts:pts.map(p=>({x:(p.t-t0)/span,y:3+(p.s-base)/ST_PER_LEVEL,gap:false})).map((p,i,a)=>(i&&pts[i].t-pts[i-1].t>70&&(p.gap=true),p)),median:m,dur:span};
}
function sampleUser(pts,x){if(x<=pts[0].x)return pts[0].y;for(let i=1;i<pts.length;i++)if(x<=pts[i].x){const a=pts[i-1],b=pts[i];return a.y+(b.y-a.y)*(x-a.x)/((b.x-a.x)||1)}return pts[pts.length-1].y}

/* compare shapes: both lines are shifted to the same average, so a higher or lower voice doesn't count against you */
function score(tone,pts){
 const xs=[...Array(21)].map((_,i)=>.04+i*.92/20),u=xs.map(x=>sampleUser(pts,x)),g=xs.map(x=>targetAt(tone,x));
 const mu=u.reduce((a,b)=>a+b)/u.length,mg=g.reduce((a,b)=>a+b)/g.length;
 const rmse=Math.sqrt(xs.reduce((a,_,i)=>a+((u[i]-mu)-(g[i]-mg))**2,0)/xs.length);
 const slope=a=>a.slice(-6).reduce((x,y)=>x+y)/6-a.slice(0,6).reduce((x,y)=>x+y)/6;
 const us=slope(u),gs=slope(g),wrongWay=(gs<-.4&&us>.3)||(gs>.8&&us<.1)||(Math.abs(gs)<.3&&Math.abs(us)>1.1);
 return {rmse,stars:wrongWay?1:rmse<.55?3:rmse<.95?2:1,us:slope(u),gs:slope(g),dipU:Math.min(...u.slice(6,15))-Math.max(u[0],u[20]),offset:mu-mg};
}
const HINT={
 "ngang":"Keep your voice flat and steady, like holding one note.",
 "sắc":"Start in the middle and push your voice up at the end, like a surprised question.",
 "huyền":"Start a little low and let your voice sink slowly, relaxed.",
 "hỏi":"Dip down in the middle, then come back up, like a doubtful \"hmm?\"",
 "ngã":"Go up, catch your breath for a split second in the middle, then jump higher.",
 "nặng":"Start low, drop fast, and cut the sound short, like a tiny thud."};
function advice(tone,r){
 if(r.stars===3)return "Your pitch matches "+tone.name+".";
 const n=tone.name;
 if(n==="ngang"&&Math.abs(r.us)>.6)return "Your voice "+(r.us>0?"rose":"fell")+". "+HINT[n];
 if((n==="sắc"||n==="ngã")&&r.us<.8)return "Your voice didn't climb enough. "+HINT[n];
 if((n==="huyền"||n==="nặng")&&r.us>-.4)return "Your voice didn't fall enough. "+HINT[n];
 if(n==="hỏi"&&r.dipU>-.3)return "There wasn't a clear dip. "+HINT[n];
 return HINT[n];
}

/* ------------- screen ------------- */
function open(opts){
 const {I,mascot,contour}=UI,tones=opts.tones,say=opts.say,esc=opts.esc;
 let tone=tones[0],word=tone.ex,busy=false,attempts=0;
 const refKey="nhim-pitch-ref";let ref=null;try{const v=parseFloat(localStorage.getItem(refKey));if(isFinite(v))ref=v}catch(e){}
 const layer=document.getElementById("layer");
 layer.innerHTML=`<div class="lesson mirror" role="dialog" aria-label="Tone mirror"><div class="in">
 <div class="lhead"><button class="xbtn" id="mClose" aria-label="Close">${I.x}</button><h2 class="mtitle">Tone mirror</h2><span></span></div>
 <div class="lbody">
  <p class="muted">Pick a word, listen, then say it. Your pitch line appears on top of the target. Nothing is recorded or saved.</p>
  <div class="mtones" role="radiogroup" aria-label="Tone">${tones.map((t,i)=>`<button class="mtone" role="radio" aria-checked="${i?"false":"true"}" data-t="${i}"><b>${esc(t.ex)}</b><span>${esc(t.name)}</span></button>`).join("")}</div>
  <div class="mword"><button class="spk" id="mPlay" aria-label="Play">${I.sound}</button><span class="big" id="mWord"></span><button class="mini" id="mNext" title="Another word with this tone">Another word</button></div>
  <div class="mgraph" id="mGraph"></div>
  <div class="mlegend"><span><i class="lg t"></i>Target</span><span><i class="lg u"></i>You</span></div>
  <div class="mres" id="mRes" aria-live="polite"></div>
 </div></div>
 <div class="lfoot"><div class="in2 mfoot"><button class="micbtn" id="mRec" aria-label="Record">${I.mic||"●"}</button><span id="mStat" class="muted">Tap the button and say the word.</span></div></div></div>`;
 document.body.style.overflow="hidden";
 const $=s=>layer.querySelector(s);
 function draw(user,live){
  let svg=contour(tone,{w:W,h:H,color:"var(--indigo)"});
  let u="";
  if(user&&user.length){
   if(live)u=user.map(p=>`<circle cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="2.6" fill="var(--lotus)"/>`).join("");
   else{let d="";user.forEach((p,i)=>{d+=(i===0||p.gap?"M":"L")+X(p.x).toFixed(1)+" "+Y(p.y).toFixed(1)});u=`<path d="${d}" fill="none" stroke="var(--lotus)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="uline"/>`}
  }
  $("#mGraph").innerHTML=svg.replace("</svg>",u+"</svg>");
 }
 function setWord(w){word=w;$("#mWord").textContent=w;$("#mRes").innerHTML="";draw(null)}
 function setTone(i){tone=tones[i];layer.querySelectorAll(".mtone").forEach(b=>b.setAttribute("aria-checked",b.dataset.t==i?"true":"false"));setWord(tone.ex)}
 layer.querySelectorAll(".mtone").forEach(b=>b.onclick=()=>{if(!busy)setTone(+b.dataset.t)});
 $("#mPlay").onclick=()=>say(word,{slow:true});
 $("#mNext").onclick=()=>{if(busy)return;const pool=(opts.wordsFor(tone.name)||[]).filter(w=>w!==word);if(pool.length)setWord(pool[Math.floor(Math.random()*pool.length)])};
 $("#mClose").onclick=()=>{closeMic();layer.innerHTML="";document.body.style.overflow="";opts.onClose&&opts.onClose()};
 $("#mRec").onclick=async()=>{
  if(busy)return;busy=true;const btn=$("#mRec"),stat=$("#mStat");
  ensureCtx();try{await openMic()}catch(e){busy=false;stat.textContent="Nhím can't hear you. Allow the microphone for this site, then try again.";return}
  btn.classList.add("on");stat.textContent="Listening… say “"+word+"”";$("#mRes").innerHTML="";
  const frames=[],t0=performance.now();let lastVoice=0,heard=false;
  const live=[];
  await new Promise(done=>{const iv=setInterval(()=>{const t=performance.now()-t0,{hz}=pitchNow();frames.push({t,hz});
    if(hz){heard=true;lastVoice=t;live.push({x:Math.min(1,t/REC_MS),y:3+(st(hz)-(ref??st(hz)))/ST_PER_LEVEL})}
    if(live.length%3===0)draw(live,true);
    if(t>REC_MS||(heard&&t-lastVoice>SILENCE_MS&&t>500)){clearInterval(iv);done()}},25)});
  btn.classList.remove("on");busy=false;releaseMic();
  const c=clean(frames,ref);
  if(!c||c.dur<120){draw(null);stat.textContent="I couldn't hear a clear voice. Get closer to the mic and try again.";return}
  attempts++;
  ref=ref==null?c.median:ref*.8+c.median*.2;try{localStorage.setItem(refKey,ref.toFixed(2))}catch(e){}
  draw(c.pts,false);
  let r=score(tone,c.pts);
  if(opts.south&&(tone.name==="hỏi"||tone.name==="ngã")){const other=tones.find(t=>t.name===(tone.name==="hỏi"?"ngã":"hỏi")),r2=score(other,c.pts);if(r2.stars>r.stars){r=r2;r.merged=other.name}}
  const msg=r.stars===3?"Chính xác!":r.stars===2?"Gần đúng rồi! Almost.":"Thử lại nhé. Try again.";
  const tip=r.merged&&r.stars===3?`That was the ${r.merged} shape. In the South, hỏi and ngã sound alike, so it counts.`:advice(tone,r);
  $("#mRes").innerHTML=`<div class="mstars" aria-label="${r.stars} of 3">${[1,2,3].map(i=>`<i class="${i<=r.stars?"on":""}">${I.star}</i>`).join("")}</div><b>${esc(msg)}</b><p class="muted">${esc(tip)}</p>`;
  stat.textContent="Tap to try again.";
  opts.onScore&&opts.onScore(r.stars,tone.name);
 };
 setTone(0);
}
/* ------------- compact version for a lesson step ------------- */
function graph(tone,user,live){
 let u="";
 if(user&&user.length){
  if(live)u=user.map(p=>`<circle cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="2.6" fill="var(--lotus)"/>`).join("");
  else{let d="";user.forEach((p,i)=>{d+=(i===0||p.gap?"M":"L")+X(p.x).toFixed(1)+" "+Y(p.y).toFixed(1)});u=`<path d="${d}" fill="none" stroke="var(--lotus)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="uline"/>`}}
 return UI.contour(tone,{w:W,h:H,color:"var(--indigo)"}).replace("</svg>",u+"</svg>");
}
function getRef(){try{const v=parseFloat(localStorage.getItem("nhim-pitch-ref"));return isFinite(v)?v:null}catch(e){return null}}
function setRef(v){try{localStorage.setItem("nhim-pitch-ref",v.toFixed(2))}catch(e){}}
/* records one try; calls onLive with dots while listening; returns cleaned points or null */
async function capture(onLive){
 ensureCtx();await openMic();
 const ref=getRef(),frames=[],live=[],t0=performance.now();let lastVoice=0,heard=false;
 await new Promise(done=>{const iv=setInterval(()=>{const t=performance.now()-t0,{hz}=pitchNow();frames.push({t,hz});
  if(hz){heard=true;lastVoice=t;live.push({x:Math.min(1,t/REC_MS),y:3+(st(hz)-(ref??st(hz)))/ST_PER_LEVEL})}
  if(live.length%3===0)onLive&&onLive(live);
  if(t>REC_MS||(heard&&t-lastVoice>SILENCE_MS&&t>500)){clearInterval(iv);done()}},25)});
 releaseMic();
 const c=clean(frames,ref);if(!c||c.dur<120)return null;
 setRef(ref==null?c.median:ref*.8+c.median*.2);return c;
}
function judge(tone,tones,pts,south){
 let r=score(tone,pts);
 if(south&&(tone.name==="hỏi"||tone.name==="ngã")){const other=tones.find(t=>t.name===(tone.name==="hỏi"?"ngã":"hỏi")),r2=score(other,pts);if(r2.stars>r.stars){r=r2;r.merged=other.name}}
 r.tip=r.merged&&r.stars===3?`That was the ${r.merged} shape. In the South, hỏi and ngã sound alike, so it counts.`:advice(tone,r);
 return r;
}
function inline(el,o){
 const {I}=UI,tone=o.tone,esc=o.esc;let busy=false;
 el.innerHTML=`<div class="mgraph">${graph(tone)}</div><div class="mlegend"><span><i class="lg t"></i>Target: ${esc(tone.name)}</span><span><i class="lg u"></i>You</span></div>
  <div class="irow"><button class="micbtn" aria-label="Record">${I.mic}</button><span class="muted istat">Tap the mic and say it.</span></div><div class="mres" aria-live="polite"></div>`;
 const g=el.querySelector(".mgraph"),btn=el.querySelector(".micbtn"),stat=el.querySelector(".istat"),res=el.querySelector(".mres");
 btn.onclick=async()=>{if(busy)return;busy=true;btn.classList.add("on");stat.textContent="Listening…";res.innerHTML="";
  let c=null;try{c=await capture(l=>{g.innerHTML=graph(tone,l,true)})}catch(e){busy=false;btn.classList.remove("on");stat.textContent="Allow the microphone, or tap \"Can't speak now\".";return}
  busy=false;btn.classList.remove("on");
  if(!c){g.innerHTML=graph(tone);stat.textContent="I couldn't hear you. Try again, a bit louder.";return}
  g.innerHTML=graph(tone,c.pts,false);const r=judge(tone,o.tones,c.pts,o.south);
  res.innerHTML=`<div class="mstars" aria-label="${r.stars} of 3">${[1,2,3].map(i=>`<i class="${i<=r.stars?"on":""}">${I.star}</i>`).join("")}</div><p class="muted">${esc(r.tip)}</p>`;
  stat.textContent="Tap to try again.";o.onScore&&o.onScore(r.stars)};
}
window.PITCH={supported,open,inline,_test:{score,targetAt,clean}};
})();
