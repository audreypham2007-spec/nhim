/* Nhím family chat: read texts the way families really send them, without accent marks and with shortcuts,
   then reply in Vietnamese with Telex. */
(function(){
const SHORT=[["ko, k","không","no / not"],["dc, đc","được","okay, can"],["j","gì","what"],["r","rồi","already"],["vs","với","with"],["h","giờ","hour, time"],["mn","mọi người","everyone"],["a / e / c","anh / em / chị","pronouns"],["bit","biết","know"],["ntn","như thế nào","how"],["ti, ty","tí","a little bit"]];
const MSGS=[
 {from:"Má",raw:"con an com chua",vi:"Con ăn cơm chưa?",en:"Have you eaten yet?"},
 {from:"Ba",raw:"may h con ve",vi:"Mấy giờ con về?",en:"What time are you coming home?"},
 {from:"Má",raw:"nho mac ao am nha",vi:"Nhớ mặc áo ấm nha.",en:"Remember to wear a warm jacket."},
 {from:"Chị Hai",raw:"e oi toi nay an pho ko",vi:"Em ơi, tối nay ăn phở không?",en:"Want to get pho tonight?"},
 {from:"Bà ngoại",raw:"ba nho con qua",vi:"Bà nhớ con quá.",en:"Grandma misses you so much."},
 {from:"Anh Hai",raw:"dc r, a doi o cong",vi:"Được rồi, anh đợi ở cổng.",en:"Okay, I'll wait at the gate."},
 {from:"Má",raw:"con lam j do",vi:"Con làm gì đó?",en:"What are you doing?"},
 {from:"Dì Tư",raw:"cuoi tuan nay mn qua nha di choi nhe",vi:"Cuối tuần này mọi người qua nhà dì chơi nhé.",en:"Everyone come over to my place this weekend."},
 {from:"Ba",raw:"con thi sao roi",vi:"Con thi sao rồi?",en:"How did your exam go?"},
 {from:"Má",raw:"ko sao dau con",vi:"Không sao đâu con.",en:"It's okay, sweetie."},
 {from:"Chị Hai",raw:"c sap toi r",vi:"Chị sắp tới rồi.",en:"I'm almost there."},
 {from:"Ông ngoại",raw:"chuc mung sinh nhat chau",vi:"Chúc mừng sinh nhật cháu.",en:"Happy birthday, grandchild."},
 {from:"Bà ngoại",raw:"chau co khoe ko",vi:"Cháu có khỏe không?",en:"Are you doing well?"},
 {from:"Má",raw:"ve nha an com nhe con",vi:"Về nhà ăn cơm nhé con.",en:"Come home and eat, okay?"},
 {from:"Anh Hai",raw:"dang ban, ti goi lai",vi:"Đang bận, tí gọi lại.",en:"Busy, I'll call back in a bit."},
 {from:"Ba",raw:"con can tien ko",vi:"Con cần tiền không?",en:"Do you need money?"}
];
const REPLIES=[
 {from:"Má",raw:"con an com chua",en:"Reply: \"Yes, I already ate.\"",show:"Dạ, con ăn rồi.",ok:["Dạ con ăn rồi","Con ăn rồi","Dạ rồi","Con ăn rồi ạ","Dạ con ăn rồi ạ","Rồi ạ","Dạ con ăn rồi má"]},
 {from:"Ba",raw:"may h con ve",en:"Reply: \"Six o'clock.\"",show:"Dạ, sáu giờ.",ok:["Dạ sáu giờ","Sáu giờ","Sáu giờ ạ","Dạ sáu giờ ạ","Con về lúc sáu giờ","Dạ con về lúc sáu giờ"]},
 {from:"Bà ngoại",raw:"ba nho con qua",en:"Reply: \"I miss you too, Grandma.\"",show:"Con cũng nhớ bà.",ok:["Con cũng nhớ bà","Con cũng nhớ bà nhiều","Dạ con cũng nhớ bà","Con cũng nhớ bà ạ","Cháu cũng nhớ bà"]},
 {from:"Chị Hai",raw:"e oi toi nay an pho ko",en:"Reply: \"Yes! Let's go.\"",show:"Dạ, đi!",ok:["Dạ đi","Đi","Có","Dạ có","Đi chị","Dạ đi chị","Có chị"]},
 {from:"Ba",raw:"con can tien ko",en:"Reply: \"No, thank you, Dad.\"",show:"Dạ không, con cảm ơn ba.",ok:["Dạ không con cảm ơn ba","Không con cảm ơn ba","Dạ không cảm ơn ba","Không cảm ơn ba","Dạ không ạ"]},
 {from:"Má",raw:"con lam j do",en:"Reply: \"I'm studying.\"",show:"Dạ, con đang học.",ok:["Dạ con đang học","Con đang học","Con đang học bài","Dạ con đang học bài","Đang học ạ"]}
];
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const TONEKEYS=["","s","f","r","x","j"];
/* a wrong spelling: same letters, a different tone on one or two words */
function misspell(vi){
 const words=vi.split(" ");
 for(let tries=0;tries<30;tries++){
  const w=[...words],n=1+(Math.random()<.4?1:0);
  for(let k=0;k<n;k++){const i=Math.floor(Math.random()*w.length),m=w[i].match(/^(.*?)([.,!?]*)$/),base=m[1].normalize("NFD").replace(/[̣̀́̃̉]/g,"").normalize("NFC");
   if(!/[aeiouyăâêôơư]/i.test(base))continue;
   w[i]=TELEX.convert(base+TONEKEYS[Math.floor(Math.random()*6)])+m[2]}
  const out=w.join(" ");if(out!==vi)return out}
 return null;
}
function rounds(){
 const pool=shuffle(MSGS),R=[];
 pool.slice(0,3).forEach(m=>R.push({type:"mean",m,opts:shuffle([m.en,...shuffle(MSGS.filter(x=>x!==m)).slice(0,2).map(x=>x.en)])}));
 pool.slice(3,6).forEach(m=>{const d=new Set([m.vi]);for(let i=0;i<20&&d.size<3;i++){const x=misspell(m.vi);if(x)d.add(x)}R.push({type:"spell",m,opts:shuffle([...d])})});
 shuffle(REPLIES).slice(0,2).forEach(r=>R.push({type:"reply",r}));
 return shuffle(R.slice(0,6)).concat(R.slice(6));
}
function open(o){
 const {I,avatar}=UI,esc=o.esc,R=rounds();let i=0,right=0;
 const layer=document.getElementById("layer");
 layer.innerHTML=`<div class="lesson chat" role="dialog" aria-label="Family chat"><div class="in">
 <div class="lhead"><button class="xbtn" id="cClose" aria-label="Close">${I.x}</button><div class="pbar"><i id="cbar" style="width:0%"></i></div><span></span></div>
 <div class="lbody" id="cBody"></div></div><div class="lfoot" id="cFoot"><div class="in2" id="cFootIn"></div></div></div>`;
 document.body.style.overflow="hidden";
 const $=s=>layer.querySelector(s),close=()=>{layer.innerHTML="";document.body.style.overflow="";o.onClose&&o.onClose()};
 $("#cClose").onclick=close;
 const bubble=(from,text)=>`<div class="cmsg">${avatar(from,from.toLowerCase())}<div><span class="cfrom">${esc(from)}</span><p class="cbub">${esc(text)}</p></div></div>`;
 const foot=(h,c="")=>{$("#cFoot").className="lfoot "+c;$("#cFootIn").innerHTML=h};
 function intro(){
  $("#cBody").innerHTML=`<h2 class="qtitle">Family chat</h2><p class="muted">Family texts often skip the accent marks and use shortcuts. Here's the cheat sheet. You'll read real-style messages, then reply.</p>
  <div class="tbl"><table><thead><tr><th>They type</th><th>It means</th><th></th></tr></thead><tbody>${SHORT.map(r=>`<tr><td><kbd>${esc(r[0])}</kbd></td><td><b>${esc(r[1])}</b></td><td class="muted small">${esc(r[2])}</td></tr>`).join("")}</tbody></table></div>`;
  foot(`<button class="btn" id="cGo">Open the chat</button>`);$("#cGo").onclick=show}
 function show(){
  $("#cbar").style.width=(i/R.length*100)+"%";if(i>=R.length)return end();
  const r=R[i],b=$("#cBody");
  if(r.type==="mean"||r.type==="spell"){
   b.innerHTML=`<h2 class="qtitle">${r.type==="mean"?"What does this message mean?":"Which is the full spelling?"}</h2><div class="cphone">${bubble(r.m.from,r.m.raw)}</div>
   ${r.type==="spell"?`<p class="hint">Same letters, different marks. Think about what ${esc(r.m.from)} would say.</p>`:""}
   <div class="opts">${r.opts.map((x,k)=>`<button class="opt" data-o="${esc(x)}"><span class="k">${k+1}</span><span>${esc(x)}</span></button>`).join("")}</div>`;
   foot(`<p class="muted" style="text-align:center;width:100%">Pick an answer.</p>`);
   const ans=r.type==="mean"?r.m.en:r.m.vi;
   b.querySelectorAll(".opt").forEach(x=>x.onclick=()=>{const ok=x.dataset.o===ans;b.querySelectorAll(".opt").forEach(y=>{y.style.pointerEvents="none";if(y.dataset.o===ans)y.classList.add("reveal-ok")});if(!ok)x.classList.add("reveal-bad");
    if(ok)right++;o.onAnswer&&o.onAnswer(ok);o.say&&o.say(r.m.vi);
    foot(`<div class="fb"><span class="badge">${ok?I.check:I.x}</span><div><h3>${ok?"Đúng rồi!":"Not quite"}</h3><p>${esc(r.m.vi)} = ${esc(r.m.en)}</p></div></div><button class="btn ${ok?"":"bad"}" id="cNext">Continue</button>`,ok?"ok":"bad");$("#cNext").onclick=()=>{i++;show()};$("#cNext").focus()});
  }else{
   const rp=r.r;let tries=0;
   b.innerHTML=`<h2 class="qtitle">Reply in Vietnamese</h2><div class="cphone">${bubble(rp.from,rp.raw)}</div><p><b>${esc(rp.en)}</b></p>
   <label class="tlab" for="cIn">Type with Telex (plain letters work). Nhím adds the marks.</label><input id="cIn" class="tin" autocomplete="off" autocapitalize="off" spellcheck="false" lang="vi">
   <div class="cphone cme" id="cLive" aria-live="polite"></div><div class="thint" id="cHint"></div>`;
   foot(`<button class="btn ghost skip" id="cShow">Show me</button><button class="btn" id="cSend">Send</button>`);
   const inp=$("#cIn"),live=$("#cLive");
   inp.oninput=()=>{const v=TELEX.convert(inp.value);live.innerHTML=v.trim()?`<p class="cbub me">${esc(v)}</p>`:""};
   inp.onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();send()}};
   $("#cShow").onclick=()=>{$("#cHint").innerHTML=`Try: <b>${esc(rp.show)}</b> = <kbd>${esc(TELEX.spell(rp.show))}</kbd>`;tries=Math.max(tries,1)};
   $("#cSend").onclick=send;setTimeout(()=>inp.focus(),50);
   function send(){const v=TELEX.convert(inp.value);if(!v.trim())return;
    const bare=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/đ/g,"d").replace(/Đ/g,"D");
    const hit=rp.ok.find(a=>TELEX.same(a,v)),near=!hit&&rp.ok.find(a=>TELEX.same(bare(a),bare(v)));
    if(hit||near){if(!tries&&hit)right++;o.onAnswer&&o.onAnswer(true);o.say&&o.say(v);
     foot(`<div class="fb"><span class="badge">${I.check}</span><div><h3>${hit?"Sent!":"Sent, but check the marks"}</h3><p>${near?`Full spelling: <b>${esc(near)}</b>`:`${esc(rp.from)} will love that.`}</p></div></div><button class="btn" id="cNext">Continue</button>`,"ok");$("#cNext").onclick=()=>{i++;show()};$("#cNext").focus()}
    else{tries++;o.onAnswer&&o.onAnswer(false);$("#cHint").innerHTML=`Not quite. ${tries>=2?`Try: <b>${esc(rp.show)}</b> = <kbd>${esc(TELEX.spell(rp.show))}</kbd>`:"Tap Show me for a hint."}`}}
  }
 }
 function end(){
  $("#cBody").innerHTML=`<div class="result">${UI.mascot(right>=6?"cheer":"happy").replace('class="m "','style="width:130px;height:130px" class="m "')}<h2>Giỏi lắm!</h2><p class="muted">${right} of ${R.length} right. Now go text your family something in Vietnamese.</p></div>`;
  foot(`<button class="btn" id="cDone">Done</button>`);$("#cDone").onclick=close;o.onEnd&&o.onEnd(right,R.length)}
 intro();
}
window.CHAT={open,misspell,MSGS};
})();
