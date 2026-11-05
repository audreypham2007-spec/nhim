/* Nhím Telex trainer: learn to type Vietnamese on any keyboard.
   A small Telex engine turns plain letters into Vietnamese as you type (aa → â, dd → đ, s → sắc …). */
(function(){
const TONE_KEY={s:"́",f:"̀",r:"̉",x:"̃",j:"̣"};
const KEY_OF={"́":"s","̀":"f","̉":"r","̃":"x","̣":"j"};
const TONE_MARKS=/[̣̀́̃̉]/g;
const VOW="aăâeêioôơuưy";
const isV=c=>VOW.includes(c.toLowerCase());
const keepCase=(src,out)=>src===src.toUpperCase()&&src!==src.toLowerCase()?out.toUpperCase():out;

/* where the tone mark goes in a syllable (letters without tone) */
function tonePos(L){
 const low=L.map(c=>c.toLowerCase());let s=0;
 if(low[0]==="q"&&low[1]==="u")s=2;else if(low[0]==="g"&&low[1]==="i"&&isV(low[2]||""))s=2;
 const idx=[];for(let i=s;i<low.length;i++){if(isV(low[i]))idx.push(i);else if(idx.length)break}
 if(!idx.length){for(let i=0;i<low.length;i++)if(isV(low[i]))return i;return -1}
 for(const i of idx)if("ơê".includes(low[i]))return i;
 for(const i of idx)if("âăôư".includes(low[i])){ if(low[i]==="ư"&&low[idx[idx.length-1]]==="ơ")continue;return i}
 if(idx.length===1)return idx[0];
 const closed=idx[idx.length-1]<low.length-1;
 if(closed)return idx[idx.length-1];
 if(idx.length===3)return idx[1];
 const pair=low[idx[0]]+low[idx[1]];
 if(["oa","oe","uy"].includes(pair))return idx[1];
 return idx[0];
}

/* convert one typed word (plain Telex letters, or text that already has marks) */
function word(raw){
 const L=[];let tone=null;
 for(const ch of raw.normalize("NFD")){
  if(/[̀-ͯ]/.test(ch)){ // already-marked input from a Vietnamese keyboard
   if(KEY_OF[ch]){tone=ch;continue}
   const last=L.pop()||"";L.push((last+ch).normalize("NFC"));continue}
  const c=ch.toLowerCase(),hasV=L.some(isV);
  const lastV=()=>{for(let i=L.length-1;i>=0;i--){if(isV(L[i]))return i;}return -1};
  if(TONE_KEY[c]&&hasV&&L.length){
   if(tone===TONE_KEY[c]){tone=null;L.push(ch);continue}
   tone=TONE_KEY[c];continue}
  if(c==="z"&&hasV){tone=null;continue}
  if(c==="a"||c==="e"||c==="o"){
   // aa → â, ee → ê, oo → ô. The second letter can come after the final consonant: tien + e → tiên
   const v=lastV(),b=v>=0?L[v].toLowerCase():"";
   if(b===c){L[v]=keepCase(L[v],{a:"â",e:"ê",o:"ô"}[c]);continue}
   if(b===({a:"â",e:"ê",o:"ô"}[c])){L[v]=keepCase(L[v],c);L.push(ch);continue} // aaa → aa
  }
  if(c==="w"){
   const low=L.map(x=>x.toLowerCase()).join("");
   const uo=low.lastIndexOf("uo");
   if(uo>=0&&uo>=low.length-3){L[uo]=keepCase(L[uo],"ư");L[uo+1]=keepCase(L[uo+1],"ơ");continue}
   let done=false;
   for(let i=L.length-1;i>=0&&i>=L.length-3;i--){const b=L[i].toLowerCase();const m={a:"ă",o:"ơ",u:"ư"}[b];
    if(m){L[i]=keepCase(L[i],m);done=true;break}
    if(["ă","ơ","ư"].includes(b)){L[i]=keepCase(L[i],{"ă":"a","ơ":"o","ư":"u"}[b]);L.push(ch);done=true;break}}
   if(!done)L.push(keepCase(ch,"ư"));continue}
  if(c==="d"&&L.length&&L[0].toLowerCase()==="d"&&!L.slice(1).some(isV)&&L.length===1){L[0]=keepCase(L[0],"đ");continue}
  L.push(ch)}
 if(tone){const p=tonePos(L);if(p>=0)L[p]=(L[p]+tone).normalize("NFC")}
 return L.join("").normalize("NFC");
}
const convert=s=>s.split(/(\s+)/).map(t=>/\s/.test(t)||!t?t:word(t)).join("");

/* how to type a Vietnamese word in Telex: việt → vieetj */
function spell(w){return w.split(/\s+/).map(x=>{let out="",tone="";
 for(const ch of x.normalize("NFD")){if(KEY_OF[ch]){tone=KEY_OF[ch];continue}
  if(ch==="̂"){out+=out.slice(-1);continue}           // â ê ô
  if(ch==="̆"||ch==="̛"){out+="w";continue}       // ă, ơ ư
  out+=ch==="đ"?"dd":ch==="Đ"?"DD":ch}
 out=out.replace(/uwow/g,"uow");return out.replace(/[.,!?]+$/,"")+tone}).join(" ")}

/* same word? compare letters and tone, not where the mark sits (hoà = hòa) */
const key=s=>String(s).normalize("NFC").toLowerCase().replace(/[.,!?;:"“”()…]/g,"").replace(/\s+/g," ").trim().split(" ").map(w=>{
 const d=w.normalize("NFD"),t=(d.match(TONE_MARKS)||[""])[0];return d.replace(TONE_MARKS,"").normalize("NFC")+t}).join(" ");
const same=(a,b)=>key(a)===key(b);

/* ------------- screen ------------- */
function open(o){
 const {I,mascot}=UI,esc=o.esc,items=o.items.slice(0,10);
 let i=0,right=0,tries=0;
 const layer=document.getElementById("layer");
 layer.innerHTML=`<div class="lesson telex" role="dialog" aria-label="Typing practice"><div class="in">
 <div class="lhead"><button class="xbtn" id="tClose" aria-label="Close">${I.x}</button><div class="pbar"><i id="tbar" style="width:0%"></i></div><span></span></div>
 <div class="lbody" id="tBody"></div></div>
 <div class="lfoot" id="tFoot"><div class="in2" id="tFootIn"></div></div></div>`;
 document.body.style.overflow="hidden";
 const $=s=>layer.querySelector(s);
 const close=()=>{layer.innerHTML="";document.body.style.overflow="";o.onClose&&o.onClose()};
 $("#tClose").onclick=close;
 function show(){
  $("#tbar").style.width=(i/items.length*100)+"%";
  if(i>=items.length)return end();
  const it=items[i];tries=0;
  $("#tBody").innerHTML=`<h2 class="qtitle">Type this with Telex</h2>
   <div class="tgoal"><span class="big">${esc(it.vi)}</span><button class="spk" data-say="${esc(it.vi)}" aria-label="Play">${I.sound}</button></div>
   <p class="muted">${esc(it.en)}</p>
   <label class="tlab" for="tIn">Type plain letters. Nhím turns them into Vietnamese.</label>
   <input id="tIn" class="tin" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" lang="vi" inputmode="text">
   <div class="tlive" id="tLive" aria-live="polite">&nbsp;</div>
   <div class="thint" id="tHint"></div>
   <details class="tcheat"><summary>Telex keys</summary><div class="tkeys">${[["aa","â"],["aw","ă"],["ee","ê"],["oo","ô"],["ow","ơ"],["uw","ư"],["dd","đ"],["s","sắc á"],["f","huyền à"],["r","hỏi ả"],["x","ngã ã"],["j","nặng ạ"],["z","no mark"]].map(([k,v])=>`<span><kbd>${k}</kbd>${v}</span>`).join("")}</div></details>`;
  $("#tFootIn").innerHTML=`<button class="btn ghost skip" id="tShow">Show me</button><button class="btn" id="tCheck">Check</button>`;
  const inp=$("#tIn"),live=$("#tLive");
  inp.oninput=()=>{const v=convert(inp.value);live.textContent=v||" ";live.classList.toggle("ok",same(v,it.vi))};
  inp.onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();check()}};
  $("#tShow").onclick=()=>{$("#tHint").innerHTML=`Type <kbd class="big">${esc(spell(it.vi))}</kbd>`;tries=Math.max(tries,1);inp.focus()};
  $("#tCheck").onclick=check;
  layer.querySelector("[data-say]").onclick=()=>o.say(it.vi);
  setTimeout(()=>inp.focus(),50);
 }
 function check(){
  const it=items[i],v=convert($("#tIn").value);
  if(!v.trim())return;
  if(same(v,it.vi)){
   if(tries===0)right++;$("#tHint").innerHTML="";
   o.onRight&&o.onRight(it,tries===0);
   $("#tFoot").className="lfoot ok";
   $("#tFootIn").innerHTML=`<div class="fb"><h3>${tries?"Got it!":"Chính xác!"}</h3><p>${esc(it.vi)} = <kbd>${esc(spell(it.vi))}</kbd></p></div><button class="btn" id="tNext">Continue</button>`;
   $("#tNext").onclick=()=>{$("#tFoot").className="lfoot";i++;show()};$("#tNext").focus();
  }else{
   tries++;o.onWrong&&o.onWrong(it);
   const miss=key(v).replace(/[̀-ͯ]/g,"")===key(it.vi).replace(/[̀-ͯ]/g,"")?"The letters are right. Check the tone key at the end.":"Not quite. Compare it letter by letter.";
   $("#tHint").innerHTML=`${esc(miss)}${tries>=2?`<br>Type <kbd class="big">${esc(spell(it.vi))}</kbd>`:""}`;
   $("#tIn").focus();
  }
 }
 function end(){
  $("#tBody").innerHTML=`<div class="result">${mascot(right>=8?"cheer":"happy").replace('class="m "','style="width:130px;height:130px" class="m "')}<h2>Bạn gõ giỏi lắm!</h2><p class="muted">${right} of ${items.length} on the first try. To type Vietnamese everywhere, add the Vietnamese (Telex) keyboard on your phone or computer.</p></div>`;
  $("#tFootIn").innerHTML=`<button class="btn" id="tDone">Done</button>`;$("#tDone").onclick=close;
  o.onEnd&&o.onEnd(right,items.length);
 }
 show();
}
window.TELEX={convert,spell,same,open};
})();
