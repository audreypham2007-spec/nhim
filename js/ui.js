/* Nhím: drawing and sound helpers.
   Icons, the hedgehog mascot, unit scenery, tone contour graphs, story avatars, speech and sound effects. */
(function(){
const S2=(p,f)=>`<svg viewBox="0 0 24 24" ${f?'fill="currentColor"':'fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${p}</svg>`;
const I={
 flame:S2('<path d="M12 2c1 3.5 5 5.6 5 10.5A5 5 0 0 1 7 13c0-2 1-3.4 2.3-4.6.2 1.6 1 2.7 2.2 3.2C11.2 8.6 11 5 12 2z"/>',1),
 bolt:S2('<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/>',1),
 heart:S2('<path d="M12 21s-7.5-4.6-9.5-9.3C1.2 8.4 3.3 5 6.8 5c2.1 0 3.6 1.2 5.2 3 1.6-1.8 3.1-3 5.2-3 3.5 0 5.6 3.4 4.3 6.7C19.5 16.4 12 21 12 21z"/>',1),
 learn:S2('<path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),
 practice:S2('<path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12"/>'),
 stories:S2('<path d="M12 6c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14c-3-.5-6 0-8 1.5zM12 6v14"/>'),
 guide:S2('<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>'),
 profile:S2('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'),
 star:S2('<path d="m12 2 3 6.6 7.2.8-5.4 4.9 1.5 7.1L12 17.8 5.7 21.4l1.5-7.1L1.8 9.4 9 8.6z"/>',1),
 check:S2('<path d="m5 12 5 5L20 7"/>').replace('stroke-width="2.2"','stroke-width="3"'),
 lock:S2('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
 x:S2('<path d="M6 6l12 12M18 6 6 18"/>').replace('stroke-width="2.2"','stroke-width="2.8"'),
 sound:S2('<path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>'),
 slow:S2('<path d="M3 17h15a3 3 0 0 0 0-6h-1"/><path d="M5 17c0-4.4 2.7-7 6-7s5 2.2 5 4.5"/><circle cx="19.5" cy="9" r="1.5" fill="currentColor"/>'),
 trophy:S2('<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4M12 13v4M8 21h8M9 17h6"/>'),
 chest:S2('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M3 9a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5M3 13h18"/><rect x="10" y="11.5" width="4" height="4" rx="1" fill="currentColor"/>'),
 book:S2('<path d="M12 6c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14c-3-.5-6 0-8 1.5zM12 6v14"/>'),
 target:S2('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>'),
 clock:S2('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
 mic:S2('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
 keyb:S2('<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>'),
 ear:S2('<path d="M6 10a6 6 0 1 1 12 0c0 3-2 4-3 5.5S14 20 11 20a3 3 0 0 1-3-3"/><path d="M9.5 10a2.5 2.5 0 1 1 5 0c0 1.5-1.5 2-1.5 3"/>'),
 wave:S2('<path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0"/><path d="M2 17c2-4 4-4 6 0s4 4 6 0 4-4 6 0" opacity=".5"/>'),
 hash:S2('<path d="M5 9h15M4 15h15M10 3 8 21M16 3l-2 18"/>'),
 keyboard:S2('<rect x="2" y="6" width="20" height="13" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 15h10"/>'),
 redo:S2('<path d="M4 12a8 8 0 1 0 2.3-5.6L4 9"/><path d="M4 4v5h5"/>'),
 brain:S2('<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>'),
 gear:S2('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>'),
 down:S2('<path d="M12 4v12M6 11l6 6 6-6M5 20h14"/>'),
 up:S2('<path d="M12 20V8M6 13l6-6 6 6M5 4h14"/>'),
 crown:S2('<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',1),
 leaf:S2('<path d="M5 19C5 10 11 4 20 4c0 9-6 15-15 15zM5 19l8-8"/>'),
 lantern:S2('<path d="M12 2v3M8 5h8M7 8c0-1.7 2.2-3 5-3s5 1.3 5 3v7c0 1.7-2.2 3-5 3s-5-1.3-5-3zM7 11.5h10M10 18v3M14 18v3"/>'),
 moon:S2('<path d="M20 14A8 8 0 1 1 10 4a7 7 0 0 0 10 10z"/>'),
 sun:S2('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
 family:S2('<circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="7" r="2.5"/><circle cx="12" cy="14" r="2"/><path d="M3 20c0-3 2-5 4-5s3 1 3 1M21 20c0-3-2-5-4-5s-3 1-3 1M9 21c0-2 1.3-3 3-3s3 1 3 3"/>'),
 pin:S2('<path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>'),
 cart:S2('<path d="M3 4h2l2.5 11h11L21 7H6.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>'),
 bowl:S2('<path d="M3 11h18a9 9 0 0 1-18 0zM8 7c0-2 2-2 2-4M12 7c0-2 2-2 2-4M16 7c0-2 2-2 2-4"/>')
};
const ICON_FOR_SCENE={terraces:"leaf",river:"wave",city:"pin",market:"cart",mountains:"leaf",school:"book",home:"learn",lanterns:"lantern"};

/* ---------- Nhím the hedgehog. moods: happy, sad, wow, sleep, cheer, think ---------- */
function mascot(mood="happy",cls=""){
 const eyes=mood==="sleep"?'<path d="M44 65q5 4 10 0M70 65q5 4 10 0" stroke="#2A1A10" stroke-width="3" fill="none" stroke-linecap="round"/>'
  :mood==="cheer"?'<path d="M44 66q5-6 10 0M70 66q5-6 10 0" stroke="#2A1A10" stroke-width="3.2" fill="none" stroke-linecap="round"/>'
  :'<ellipse cx="49" cy="64" rx="5.5" ry="6.5" fill="#2A1A10"/><ellipse cx="75" cy="64" rx="5.5" ry="6.5" fill="#2A1A10"/><circle cx="51" cy="62" r="1.9" fill="#fff"/><circle cx="77" cy="62" r="1.9" fill="#fff"/>';
 const mouth=mood==="sad"?'<path d="M55 81q7-6 14 0" stroke="#3A2416" stroke-width="3" fill="none" stroke-linecap="round"/>'
  :mood==="wow"?'<ellipse cx="62" cy="79" rx="4.5" ry="5.5" fill="#3A2416"/>'
  :mood==="sleep"?'<ellipse cx="62" cy="79" rx="3" ry="2.4" fill="#3A2416"/>'
  :mood==="think"?'<path d="M56 79h12" stroke="#3A2416" stroke-width="3" stroke-linecap="round"/>'
  :'<path d="M52 75q10 11 20 0z" fill="#E9667E" stroke="#3A2416" stroke-width="2.6" stroke-linejoin="round"/>';
 const brow=mood==="sad"?'<path d="M44 53l9 3M80 53l-9 3" stroke="#2A1A10" stroke-width="2.6" stroke-linecap="round"/>':mood==="think"?'<path d="M44 54l9-2M71 51l9 2" stroke="#2A1A10" stroke-width="2.6" stroke-linecap="round"/>':'';
 let spikes="";
 for(let i=0;i<15;i++){const a=(-176+i*12.4)*Math.PI/180,r1=40,r2=55+(i%2)*4,cx=60,cy=68;
  const p=(r,d)=>[(cx+r*Math.cos(a+d)).toFixed(1),(cy+r*Math.sin(a+d)).toFixed(1)].join(" ");
  spikes+=`<path d="M${p(r1,-.13)}L${p(r2,0)}L${p(r1,.13)}Z" fill="var(--quill)"/>`}
 const arms=mood==="cheer"?'<ellipse cx="22" cy="70" rx="7" ry="11" transform="rotate(35 22 70)" fill="var(--face)"/><ellipse cx="102" cy="70" rx="7" ry="11" transform="rotate(-35 102 70)" fill="var(--face)"/>':'';
 const zz=mood==="sleep"?'<text x="96" y="30" font-family="Baloo 2,sans-serif" font-weight="800" font-size="18" fill="var(--indigo)">z</text><text x="106" y="18" font-family="Baloo 2,sans-serif" font-weight="800" font-size="13" fill="var(--indigo)">z</text>':'';
 return `<svg class="m ${cls}" viewBox="0 0 124 124" role="img" aria-label="Nhím the hedgehog">
 ${spikes}${arms}<ellipse cx="60" cy="71" rx="44" ry="40" fill="var(--quill)"/>
 <ellipse cx="60" cy="59" rx="36" ry="30" fill="var(--quill-2)"/>
 <ellipse cx="62" cy="73" rx="30" ry="27" fill="var(--face)"/>
 ${eyes}<ellipse cx="62" cy="71" rx="5" ry="3.6" fill="#2A1A10"/>
 <ellipse cx="41" cy="77" rx="5" ry="3" fill="#F2A3B3" opacity=".75"/><ellipse cx="83" cy="77" rx="5" ry="3" fill="#F2A3B3" opacity=".75"/>
 ${brow}${mouth}
 <ellipse cx="44" cy="106" rx="9" ry="5" fill="var(--quill)"/><ellipse cx="80" cy="106" rx="9" ry="5" fill="var(--quill)"/>
 <path d="M24 41L62 9L100 41Q62 50 24 41Z" fill="var(--hat)"/><path d="M24 41Q62 50 100 41" stroke="var(--hat-line)" stroke-width="2.6" fill="none"/><path d="M62 9L49 42M62 9L75 42" stroke="var(--hat-line)" stroke-width="1.4" opacity=".7"/>
 ${zz}</svg>`;
}

/* ---------- unit scenery, drawn flat in white like a woodblock silhouette ---------- */
function scene(type){
 const W='#fff';const s={
 terraces:`<path d="M0 100V70q50-18 100-6t100-8v44z" fill="${W}"/><path d="M0 70V48q55-16 100-6t100-6v20q-50 10-100 8T0 70z" fill="${W}" opacity=".7"/><path d="M0 48V30q55-12 100-4t100-6v16q-50 8-100 4T0 48z" fill="${W}" opacity=".45"/><circle cx="160" cy="14" r="9" fill="${W}"/>`,
 river:`<path d="M0 80q25-10 50 0t50 0 50 0 50 0v20H0z" fill="${W}"/><path d="M0 64q25-8 50 0t50 0 50 0 50 0" stroke="${W}" stroke-width="4" fill="none" opacity=".6"/><path d="M70 58h56l-8 12H78z" fill="${W}"/><path d="M98 58V30l18 26" fill="${W}" opacity=".8"/>`,
 city:`<rect x="20" y="40" width="26" height="60" fill="${W}"/><rect x="52" y="22" width="22" height="78" fill="${W}" opacity=".7"/><rect x="80" y="48" width="30" height="52" fill="${W}"/><rect x="116" y="30" width="20" height="70" fill="${W}" opacity=".6"/><rect x="142" y="52" width="34" height="48" fill="${W}"/><circle cx="64" cy="92" r="6" fill="${W}"/><circle cx="84" cy="92" r="6" fill="${W}"/>`,
 market:`<path d="M10 40h80l-8 16H18z" fill="${W}"/><rect x="18" y="56" width="64" height="44" fill="${W}" opacity=".6"/><path d="M100 50h80l-8 16h-64z" fill="${W}"/><rect x="108" y="66" width="64" height="34" fill="${W}" opacity=".6"/><circle cx="40" cy="80" r="7" fill="${W}"/><circle cx="58" cy="82" r="7" fill="${W}"/><circle cx="140" cy="88" r="6" fill="${W}"/>`,
 mountains:`<path d="M0 100L30 30q6-10 12 0l14 30 18-50q5-10 10 0l24 70 16-30q6-10 12 0l24 50z" fill="${W}"/><path d="M0 100q50-12 100-4t100-6v10z" fill="${W}" opacity=".7"/>`,
 school:`<path d="M30 50l70-30 70 30z" fill="${W}"/><rect x="40" y="50" width="120" height="50" fill="${W}" opacity=".7"/><rect x="88" y="66" width="24" height="34" fill="${W}"/><rect x="52" y="60" width="18" height="16" fill="${W}"/><rect x="130" y="60" width="18" height="16" fill="${W}"/><path d="M100 20V2l18 6-18 6" fill="${W}"/>`,
 home:`<path d="M40 56l50-38 50 38z" fill="${W}"/><rect x="50" y="56" width="80" height="44" fill="${W}" opacity=".7"/><rect x="82" y="70" width="18" height="30" fill="${W}"/><path d="M150 100c0-20 10-40 20-46 10 6 20 26 20 46z" fill="${W}" opacity=".8"/>`,
 lanterns:`<path d="M0 10q100 30 200 0" stroke="${W}" stroke-width="3" fill="none"/>${[30,80,130,175].map((x,i)=>`<line x1="${x}" y1="${16+i%2*6}" x2="${x}" y2="${30+i%2*6}" stroke="${W}" stroke-width="2"/><ellipse cx="${x}" cy="${48+i%2*6}" rx="16" ry="20" fill="${W}" opacity="${i%2?.7:1}"/><rect x="${x-7}" y="${66+i%2*6}" width="14" height="5" fill="${W}"/>`).join("")}`};
 return `<svg class="scene" viewBox="0 0 200 100" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">${s[type]||s.terraces}</svg>`;
}

/* ---------- tone contour graph (Chao pitch scale 1 to 5) ---------- */
function contour(tone,{w=160,h=64,dot=false,color}={}){
 const pts=tone.contour||[[0,3],[1,3]],pad=8;
 const X=x=>pad+x*(w-2*pad),Y=y=>h-pad-(y-1)/4*(h-2*pad);
 let d="";
 if(tone.name==="ngã"&&pts.length>=4){d=`M${X(pts[0][0])} ${Y(pts[0][1])}L${X(pts[1][0])} ${Y(pts[1][1])}M${X(pts[2][0])} ${Y(pts[2][1])}`;for(let i=3;i<pts.length;i++)d+=`L${X(pts[i][0])} ${Y(pts[i][1])}`}
 else if(pts.length===3){d=`M${X(pts[0][0])} ${Y(pts[0][1])}Q${X(pts[1][0])} ${Y(pts[1][1]-0.9)} ${X(pts[2][0])} ${Y(pts[2][1])}`}
 else d="M"+pts.map(p=>X(p[0])+" "+Y(p[1])).join("L");
 const grid=[1,2,3,4,5].map(v=>`<line class="grid" x1="${pad}" x2="${w-pad}" y1="${Y(v)}" y2="${Y(v)}"/>`).join("");
 return `<svg class="contour" viewBox="0 0 ${w} ${h}" style="--tc:${color||"var(--indigo)"}" aria-hidden="true">${grid}<path class="line" d="${d}"/>${dot?`<circle class="dot" r="6" cx="${X(pts[0][0])}" cy="${Y(pts[0][1])}"/>`:""}</svg>`;
}
function animateDot(svgEl,tone,ms=900){
 const dot=svgEl.querySelector("circle.dot"),path=svgEl.querySelector("path.line");if(!dot||!path)return;
 const L=path.getTotalLength(),t0=performance.now();
 const step=t=>{const k=Math.min(1,(t-t0)/ms),p=path.getPointAtLength(k*L);dot.setAttribute("cx",p.x);dot.setAttribute("cy",p.y);if(k<1)requestAnimationFrame(step)};
 requestAnimationFrame(step);
}

/* ---------- story characters: simple faces, colors picked from the name ---------- */
const SKIN=["#F1D3B3","#E8C29E","#D9A87E","#C68F64"],HAIR=["#2A1A10","#3B2618","#1C1C24","#5A3A22"],TOPS=["#2B3A67","#C23B5E","#1F6B4F","#B7791F","#2C7A7B","#7A4E9E"];
function hashStr(s){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)}
function avatar(name,kind){
 const h=hashStr(name),skin=SKIN[h%4],hair=HAIR[(h>>3)%4],top=TOPS[(h>>5)%6];
 const old=/bà|ông|bác|cô|chú/i.test(kind||"")||/^(bà|ông|bác)/i.test(name),long=/lan|mai|hoa|linh|vy|thảo|chị|bà|cô|dì|má|mẹ|nga|hương|my|an\b/i.test(name+" "+(kind||""));
 const hairC=old?"#C9C9CF":hair;
 return `<svg class="ava" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="${top}" opacity=".18"/>
 ${long?`<path d="M11 24c0-11 6-16 13-16s13 5 13 16v14H11z" fill="${hairC}"/>`:""}
 <path d="M9 48c1-9 7-13 15-13s14 4 15 13z" fill="${top}"/><circle cx="24" cy="23" r="11" fill="${skin}"/>
 <path d="M13 21c0-7 5-11 11-11s11 4 11 11c-4-3-8-5-11-5s-7 2-11 5z" fill="${hairC}"/>
 <circle cx="20" cy="24" r="1.6" fill="#2A1A10"/><circle cx="28" cy="24" r="1.6" fill="#2A1A10"/><path d="M21 29q3 2 6 0" stroke="#2A1A10" stroke-width="1.5" fill="none" stroke-linecap="round"/>
 ${old?`<path d="M17 20h5M26 20h5" stroke="#8a8a90" stroke-width="1.2"/>`:""}</svg>`;
}

/* ---------- speech (Web Speech API) ---------- */
let viVoice=null;
function findVoice(){try{const vs=speechSynthesis.getVoices();viVoice=vs.find(v=>/^vi/i.test(v.lang))||null}catch(e){viVoice=null}return viVoice}
if("speechSynthesis" in window){findVoice();speechSynthesis.addEventListener?.("voiceschanged",findVoice)}
function speak(text,{slow=false,rate=.9}={}){try{if(!("speechSynthesis" in window))return;speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(text);u.lang="vi-VN";if(viVoice)u.voice=viVoice;u.rate=slow?Math.max(.4,rate*.6):rate;speechSynthesis.speak(u)}catch(e){}}

/* ---------- sound effects, synthesized so there are no audio files ---------- */
let ac=null;
function tone(freq,start,dur,type="sine",gain=.18){const t=ac.currentTime+start,o=ac.createOscillator(),g=ac.createGain();
 o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(gain,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
 o.connect(g).connect(ac.destination);o.start(t);o.stop(t+dur+.02)}
function sfx(kind){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==="suspended")ac.resume();
 if(kind==="ok"){tone(784,0,.16,"triangle");tone(1175,.09,.28,"triangle")}
 else if(kind==="bad"){tone(196,0,.22,"square",.07);tone(165,.1,.3,"square",.06)}
 else if(kind==="tap"){tone(660,0,.05,"sine",.05)}
 else if(kind==="done"){[523,659,784,1047].forEach((f,i)=>tone(f,i*.11,.35,"triangle",.16));tone(1319,.48,.6,"sine",.1)}
 else if(kind==="combo"){tone(988,0,.1,"triangle",.12);tone(1319,.07,.2,"triangle",.12)}
}catch(e){}}

/* ---------- confetti ---------- */
function confetti(){if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
 const c=document.createElement("canvas");c.id="confetti";document.body.appendChild(c);const x=c.getContext("2d");
 const dpr=devicePixelRatio||1;c.width=innerWidth*dpr;c.height=innerHeight*dpr;x.scale(dpr,dpr);
 const cols=["#1F6B4F","#C23B5E","#E2A72E","#2B3A67","#2C7A7B","#7A4E9E"];
 const P=[...Array(140)].map(()=>({x:innerWidth/2+(Math.random()-.5)*80,y:innerHeight*.35,vx:(Math.random()-.5)*12,vy:-Math.random()*13-4,r:Math.random()*Math.PI,vr:(Math.random()-.5)*.3,w:6+Math.random()*7,h:4+Math.random()*5,c:cols[Math.floor(Math.random()*6)]}));
 const t0=performance.now();
 (function f(t){x.clearRect(0,0,innerWidth,innerHeight);P.forEach(p=>{p.vy+=.35;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.w/2,-p.h/2,p.w,p.h);x.restore()});
  if(t-t0<2600)requestAnimationFrame(f);else c.remove()})(t0);
}

window.UI={I,ICON_FOR_SCENE,mascot,scene,contour,animateDot,avatar,speak,findVoice,hasVoice:()=>!!viVoice,sfx,confetti};
})();
