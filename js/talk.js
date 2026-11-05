/* Nhím "Talk to family": branching conversations where pronouns and politeness matter.
   Each choice is rated best / ok / oops, the relative reacts, and a short note explains why. */
(function(){
const TALKS=[
 {id:"t1",title:"Calling Bà ngoại",vi:"Gọi điện cho bà ngoại",who:"Bà ngoại",kind:"ba",
  intro:"Grandma picks up the phone. With grandparents you call yourself con or cháu, and you start answers with dạ.",
  steps:[
   {npc:["Alô? Ai đó?","Hello? Who is it?"],choices:[
    {vi:"Dạ, con đây bà. Con là Kim.",en:"It's me, Grandma. It's Kim.",q:"best",note:"Dạ, con and bà: polite and warm. Exactly right."},
    {vi:"Alô, tôi là Kim.",en:"Hello, I am Kim.",q:"oops",re:["Tôi? Trời ơi, con nói chuyện như người lạ vậy!","Tôi? Goodness, you sound like a stranger!"],note:"Tôi is for strangers and formal settings. With family, use con or cháu."},
    {vi:"Chào bạn, mình là Kim.",en:"Hi friend, it's Kim.",q:"oops",re:["Bạn hả? Bà là bà của con mà! Ha ha.","Friend? I'm your grandma! Ha ha."],note:"Bạn and mình are for friends your own age. Never for grandparents."}]},
   {npc:["Con khỏe không?","Are you doing well?"],choices:[
    {vi:"Dạ, con khỏe. Bà khỏe không ạ?",en:"I'm well. Are you well, Grandma?",q:"best",note:"Asking back and ending with ạ shows respect."},
    {vi:"Con khỏe. Bà khỏe không?",en:"I'm well. Are you?",q:"ok",note:"Fine, but add dạ at the start and ạ at the end to sound warmer."},
    {vi:"Khỏe.",en:"Fine.",q:"oops",re:["Ừ... Nói 'dạ' với bà nha con.","Mm... say 'dạ' to Grandma, okay?"],note:"One word with no dạ sounds curt to an elder."}]},
   {npc:["Bà khỏe. Con ăn cơm chưa?","I'm well. Have you eaten yet?"],choices:[
    {vi:"Dạ, con ăn rồi ạ.",en:"Yes, I've eaten.",q:"best",note:"\"Ăn cơm chưa?\" is how families say \"How are you?\". Answer it kindly."},
    {vi:"Rồi.",en:"Already.",q:"ok",note:"Correct, but short. Dạ rồi ạ is softer."},
    {vi:"Chưa, tôi chưa ăn.",en:"No, I haven't eaten.",q:"oops",re:["Sao chưa ăn? Mà sao con xưng 'tôi' vậy?","Why not? And why are you calling yourself 'tôi'?"],note:"Tôi again sounds cold. Say: Dạ chưa, con chưa ăn."}]},
   {npc:["Khi nào con về thăm bà?","When will you come visit me?"],choices:[
    {vi:"Dạ, tháng sau con về thăm bà ạ.",en:"I'll come visit next month.",q:"best",note:"A clear plan makes Grandma happy."},
    {vi:"Con không biết.",en:"I don't know.",q:"ok",re:["Ừ, về sớm nha con.","Okay, come soon."],note:"Honest, but try to give a time: tháng sau, cuối tuần này."},
    {vi:"Bạn muốn mình về không?",en:"Do you want me to come, friend?",q:"oops",re:["Ha ha, bạn với mình gì nữa!","Ha ha, enough with 'friend'!"],note:"Bạn/mình again. Grandma is bà, and you are con."}]},
   {npc:["Bà thương con nhiều lắm.","I love you very much."],choices:[
    {vi:"Dạ, con cũng thương bà nhiều lắm.",en:"I love you very much too, Grandma.",q:"best",note:"Thương is the warm, family kind of love."},
    {vi:"Con cảm ơn bà.",en:"Thank you, Grandma.",q:"ok",note:"Polite, but she was hoping to hear thương back."},
    {vi:"Ok bà, bye bye!",en:"Okay Grandma, bye bye!",q:"ok",re:["Ha ha, bai bai con!","Ha ha, bye bye!"],note:"Lots of families mix in English, and Bà might laugh. In Vietnamese: Dạ, con chào bà."}]}]},
 {id:"t2",title:"Your friend's mom",vi:"Gặp mẹ của bạn",who:"Cô Hằng",kind:"co",
  intro:"You're at your friend Linh's house and meet her mom. Call her cô and yourself con.",
  steps:[
   {npc:["Chào con. Con là bạn của Linh hả?","Hi. Are you Linh's friend?"],choices:[
    {vi:"Dạ, con chào cô ạ. Dạ đúng rồi.",en:"Hello, ma'am. Yes, that's right.",q:"best",note:"Con chào cô ạ is the standard polite greeting for a friend's parent."},
    {vi:"Chào chị! Đúng rồi.",en:"Hi, miss! That's right.",q:"ok",re:["Chị hả? Cô già rồi mà! Ha ha.","Miss? I'm too old for that! Ha ha."],note:"Calling an older woman chị flatters her, but for a friend's mom, cô is right."},
    {vi:"Chào cô, đúng rồi.",en:"Hi, that's right.",q:"ok",note:"Okay, but dạ and ạ make it polite."}]},
   {npc:["Con mấy tuổi rồi?","How old are you?"],choices:[
    {vi:"Dạ, con mười chín tuổi ạ.",en:"I'm nineteen.",q:"best",note:"Dạ … ạ around the answer: textbook polite."},
    {vi:"Mười chín.",en:"Nineteen.",q:"ok",note:"Correct, but a full sentence with dạ is warmer."},
    {vi:"Tôi mười chín tuổi.",en:"I am nineteen years old.",q:"oops",note:"Tôi sounds like a job interview. Use con."}]},
   {npc:["Con ở lại ăn cơm với cô nha.","Stay and have dinner with us."],choices:[
    {vi:"Dạ, con cảm ơn cô ạ.",en:"Thank you, I'd love to.",q:"best",note:"Accepting with thanks is perfect."},
    {vi:"Dạ thôi, con cảm ơn cô. Con phải về.",en:"Thank you, but I have to go home.",q:"ok",re:["Ừ, lần sau nha con.","Okay, next time then."],note:"A polite no: start with dạ thôi, then thank her."},
    {vi:"Không, cảm ơn.",en:"No, thanks.",q:"oops",note:"Too blunt for an elder. Try: Dạ thôi, con cảm ơn cô."}]},
   {npc:["Con ăn đi, đừng ngại.","Go ahead and eat, don't be shy."],choices:[
    {vi:"Dạ, con mời cô ăn cơm ạ.",en:"Please, you eat first.",q:"best",note:"Before eating, invite the elders: \"Con mời cô ăn cơm.\" It's a big deal in Vietnamese families."},
    {vi:"Dạ.",en:"Okay.",q:"ok",note:"Fine. Even better, invite her first: Con mời cô ăn cơm ạ."},
    {vi:"(Start eating right away)",en:"",q:"oops",silent:true,re:["…","…"],note:"Wait and say \"Con mời cô ăn cơm\" before you eat. Elders notice."}]},
   {npc:["Lần sau ghé chơi nữa nha.","Come visit again next time."],choices:[
    {vi:"Dạ, con chào cô, con về ạ.",en:"Goodbye, I'm heading home now.",q:"best",note:"Con chào cô, con về is how you say goodbye to someone older."},
    {vi:"Tạm biệt cô.",en:"Goodbye.",q:"ok",note:"Correct, a bit formal. Families usually say con chào cô."},
    {vi:"Bye cô!",en:"Bye!",q:"ok",note:"Common with young people, but add dạ and ạ for parents."}]}]},
 {id:"t3",title:"Chúc Tết Ông nội",vi:"Chúc Tết ông nội",who:"Ông nội",kind:"ong",
  intro:"It's Tết. You visit Grandpa to give New Year wishes. With grandparents you can call yourself cháu or con.",
  steps:[
   {npc:["Ồ, cháu tới rồi!","Oh, you're here!"],choices:[
    {vi:"Dạ, cháu chào ông ạ. Cháu chúc ông sống lâu trăm tuổi!",en:"Hello, Grandpa. I wish you a long life!",q:"best",note:"Greet first, then wish. Sống lâu trăm tuổi (live to 100) is the classic wish for grandparents."},
    {vi:"Chúc mừng năm mới!",en:"Happy New Year!",q:"ok",note:"Nice, but greet him first and add a personal wish."},
    {vi:"Ông khỏe không?",en:"Are you well?",q:"ok",note:"Kind, but at Tết, lead with a wish."}]},
   {npc:["Cảm ơn cháu. Ông lì xì cho cháu nè.","Thank you. Here's some lucky money for you."],choices:[
    {vi:"Dạ, cháu cảm ơn ông ạ.",en:"Thank you, Grandpa.",q:"best",note:"Take the red envelope with both hands and thank him."},
    {vi:"Bao nhiêu tiền vậy ông?",en:"How much is in it?",q:"oops",re:["Ha ha, về nhà rồi mở!","Ha ha, open it at home!"],note:"Never ask how much or open lì xì in front of the person who gave it."},
    {vi:"Wow, cảm ơn!",en:"Wow, thanks!",q:"ok",note:"Sweet, but add dạ, cháu, ông and ạ."}]},
   {npc:["Năm nay cháu học hành sao rồi?","How's school going this year?"],choices:[
    {vi:"Dạ, cháu học tốt lắm ạ.",en:"School is going really well.",q:"best",note:"Grandparents love good news about school."},
    {vi:"Cũng được.",en:"It's okay.",q:"ok",note:"Fine, but a little flat."},
    {vi:"Tôi học giỏi.",en:"I am a good student.",q:"oops",note:"Tôi with Grandpa sounds distant. Use cháu or con."}]},
   {npc:["Ăn bánh chưng với ông nha.","Have some bánh chưng with me."],choices:[
    {vi:"Dạ, cháu mời ông ăn trước ạ.",en:"Please, Grandpa, you eat first.",q:"best",note:"Elders eat first. Inviting him is a lovely touch."},
    {vi:"Dạ!",en:"Okay!",q:"ok",note:"Good. Inviting him first would be even better."},
    {vi:"Cháu không thích bánh chưng.",en:"I don't like bánh chưng.",q:"ok",re:["Ha ha, vậy ăn mứt nha!","Ha ha, then have some candied fruit!"],note:"Honest. A softer way: Dạ, cháu ăn một chút thôi ạ (just a little)."}]}]},
 {id:"t4",title:"At the market",vi:"Đi chợ",who:"Cô Sáu",kind:"co",
  intro:"You're buying mangoes from a fruit seller about your parents' age. Calling her cô and yourself con is friendly, and it might even get you a better price.",
  steps:[
   {npc:["Con mua gì vậy con?","What would you like to buy?"],choices:[
    {vi:"Dạ, cô bán cho con một ký xoài.",en:"Could I get a kilo of mangoes, please?",q:"best",note:"Dạ, cô and con: polite and friendly. \"Bán cho con…\" is how you ask to buy."},
    {vi:"Cho tôi một ký xoài.",en:"Give me a kilo of mangoes.",q:"ok",note:"Tôi is acceptable with a seller, but con sounds warmer."},
    {vi:"Ê, xoài bao nhiêu?",en:"Hey, how much are the mangoes?",q:"oops",re:["Ê gì mà ê! Con nói chuyện lịch sự chút nha.","Hey?! Speak a little more politely, okay?"],note:"Ê is how you call a friend. Never use it with someone older."}]},
   {npc:["Một ký bảy chục nghìn.","Seventy thousand a kilo."],choices:[
    {vi:"Dạ, cô bớt cho con chút được không cô?",en:"Could you lower it a little?",q:"best",note:"\"Bớt chút được không\" is the friendly way to bargain at a market."},
    {vi:"Dạ, được ạ.",en:"Okay.",q:"ok",note:"Fine! At markets, people usually bargain a little, though."},
    {vi:"Mắc quá! Cô nói dối.",en:"Too expensive! You're lying.",q:"oops",re:["Trời, cô bán đúng giá mà!","Goodness, it's a fair price!"],note:"\"Mắc quá\" is fine, but calling someone a liar is rude. Try: Mắc quá, cô bớt chút nha."}]},
   {npc:["Thôi, sáu chục nghìn cho con.","Okay, sixty thousand for you."],choices:[
    {vi:"Dạ, con cảm ơn cô nhiều!",en:"Thank you so much!",q:"best",note:"She gave you a discount. A warm thank-you is the right move."},
    {vi:"Năm chục được không cô?",en:"How about fifty?",q:"ok",re:["Không được đâu con, sáu chục là rẻ rồi.","Can't do it, sixty is already cheap."],note:"Fair to try, but she already lowered it. Time to say thank you."},
    {vi:"Ok.",en:"Ok.",q:"ok",note:"Add dạ and cảm ơn to sound kinder."}]},
   {npc:["Lần sau ghé cô nữa nha.","Come back again next time."],choices:[
    {vi:"Dạ, con chào cô ạ.",en:"Goodbye!",q:"best",note:"Con chào cô is a polite goodbye to an older woman."},
    {vi:"Bye cô!",en:"Bye!",q:"ok",note:"Friendly, and many young people say it. Con chào cô is more polite."},
    {vi:"Dạ.",en:"Okay.",q:"ok",note:"Fine, but add a goodbye."}]}]},
 {id:"t5",title:"Your older cousin",vi:"Gặp anh họ",who:"Anh Tuấn",kind:"anh",
  intro:"You run into your older cousin at a family party. Cousins use family words too: he's anh, and you're em.",
  steps:[
   {npc:["Ê Kim! Lâu quá không gặp em!","Hey Kim! Long time no see!"],choices:[
    {vi:"Anh Tuấn! Em nhớ anh quá!",en:"Tuấn! I missed you so much!",q:"best",note:"With an older cousin, call him anh and yourself em. Casual and warm."},
    {vi:"Dạ, con chào anh ạ.",en:"Hello, sir.",q:"ok",re:["Ha ha, con gì mà con! Em đó!","Ha ha, why con? You're em!"],note:"Very polite, but con is for your parents' generation. With a cousin, use em."},
    {vi:"Chào bạn!",en:"Hi, friend!",q:"oops",re:["Bạn gì? Anh là anh họ của em mà!","Friend? I'm your cousin!"],note:"Cousins use family words: anh, chị, em. Not bạn."}]},
   {npc:["Em mấy tuổi rồi? Anh nhớ em còn nhỏ xíu.","How old are you now? I remember you being tiny."],choices:[
    {vi:"Em hai mươi rồi anh. Còn anh?",en:"I'm twenty now. And you?",q:"best",note:"Asking back keeps the conversation going."},
    {vi:"Hai mươi.",en:"Twenty.",q:"ok",note:"Correct, but a full sentence sounds friendlier."},
    {vi:"Tôi hai mươi tuổi.",en:"I am twenty years old.",q:"oops",re:["Tôi? Sao em nói chuyện như người lạ vậy?","Tôi? Why are you talking like a stranger?"],note:"Tôi sounds distant, even with a cousin. Use em."}]},
   {npc:["Tối nay đi uống cà phê với anh không?","Want to get coffee with me tonight?"],choices:[
    {vi:"Dạ đi! Mấy giờ vậy anh?",en:"Yes! What time?",q:"best",note:"Saying yes and asking the time keeps plans moving."},
    {vi:"Ok anh.",en:"Okay.",q:"ok",note:"Totally normal between cousins."},
    {vi:"Em bận rồi.",en:"I'm busy.",q:"ok",re:["Vậy mai nha!","Tomorrow then!"],note:"That's fine. You could add: Để mai nha anh (let's do tomorrow)."}]},
   {npc:["Bảy giờ nha. Anh chở em đi.","Seven o'clock. I'll give you a ride."],choices:[
    {vi:"Dạ, em cảm ơn anh!",en:"Thanks!",q:"best",note:"Accepting a ride from family is kind. Chở means to give someone a ride, usually on a motorbike."},
    {vi:"Em tự đi được.",en:"I can get there myself.",q:"ok",re:["Thôi, để anh chở cho vui!","Nah, let me drive you, it's more fun!"],note:"Fine, but family likes to take care of you. It's okay to say yes."},
    {vi:"Ok.",en:"Okay.",q:"ok",note:"Fine. Cảm ơn anh is a nice touch."}]}]},
 {id:"t6",title:"A call from Ba",vi:"Ba gọi điện",who:"Ba",kind:"ba",
  intro:"Your dad calls to check on you. With parents, you're always con, and dạ goes a long way.",
  steps:[
   {npc:["Alô, con hả? Ba nè.","Hello? It's Dad."],choices:[
    {vi:"Dạ, con nghe nè ba.",en:"Hi Dad, I'm here.",q:"best",note:"\"Dạ, con nghe\" is how you answer a parent on the phone."},
    {vi:"Alô ba.",en:"Hi Dad.",q:"ok",note:"Fine. Starting with dạ is warmer."},
    {vi:"Tôi nghe đây.",en:"I'm listening.",q:"oops",re:["Tôi?? Con nói chuyện với ba như với khách hàng vậy!","Tôi?? You're talking to me like a customer!"],note:"Never tôi with a parent. You're always con."}]},
   {npc:["Con học hành sao rồi? Thi tốt không?","How's school? Did the exam go well?"],choices:[
    {vi:"Dạ, con thi tốt ạ. Ba đừng lo.",en:"It went well. Don't worry, Dad.",q:"best",note:"Reassuring your parents is a sweet touch."},
    {vi:"Con chưa biết điểm.",en:"I don't know my grade yet.",q:"ok",note:"Honest and fine."},
    {vi:"Cũng được ba.",en:"It was okay.",q:"ok",note:"Fine, a little flat."}]},
   {npc:["Con có cần ba gửi tiền không?","Do you need me to send money?"],choices:[
    {vi:"Dạ không, con đủ rồi. Con cảm ơn ba.",en:"No, I have enough. Thank you, Dad.",q:"best",note:"Thanking him even when you say no makes parents proud."},
    {vi:"Dạ có, một chút.",en:"Yes, a little.",q:"ok",note:"Honest is fine. Add con cảm ơn ba."},
    {vi:"Gửi nhiều nhiều nha!",en:"Send lots!",q:"ok",re:["Ha ha, con này!","Ha ha, you!"],note:"Cheeky. He'll laugh, but say thank you too."}]},
   {npc:["Nhớ ăn uống đầy đủ, ngủ sớm nha con.","Remember to eat well and sleep early."],choices:[
    {vi:"Dạ, con nhớ rồi. Ba cũng giữ sức khỏe nha.",en:"I will. Take care of yourself too, Dad.",q:"best",note:"Wishing health back is a loving touch."},
    {vi:"Dạ.",en:"Okay.",q:"ok",note:"Polite and short."},
    {vi:"Biết rồi mà ba.",en:"I know, Dad.",q:"ok",note:"Very common, but it can sound annoyed. \"Dạ, con nhớ\" is gentler."}]},
   {npc:["Ba thương con.","I love you."],choices:[
    {vi:"Dạ, con cũng thương ba.",en:"I love you too, Dad.",q:"best",note:"Thương back. He'll remember this call."},
    {vi:"Love you ba!",en:"Love you, Dad!",q:"ok",note:"Lots of families mix English. He'll be happy either way."},
    {vi:"Dạ, con chào ba.",en:"Bye, Dad.",q:"ok",note:"A polite goodbye, but he was hoping to hear thương."}]}]}

];
const VAL={best:2,ok:1,oops:0};
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function open(o){
 const {I,avatar,mascot}=UI,esc=o.esc,t=TALKS.find(x=>x.id===o.id);let i=0,pts=0,max=t.steps.length*2;
 const layer=document.getElementById("layer");
 layer.innerHTML=`<div class="lesson talk" role="dialog" aria-label="${esc(t.title)}"><div class="in">
 <div class="lhead"><button class="xbtn" id="kClose" aria-label="Close">${I.x}</button><div class="warm" title="How ${esc(t.who)} feels"><span>${I.heart}</span><div class="pbar"><i id="kWarm" style="width:50%"></i></div></div><span></span></div>
 <div class="lbody"><p class="muted small">Talk to family</p><h2>${esc(t.title)}</h2><p class="muted">${esc(t.intro)}</p><div class="dlg" id="kDlg"></div><div id="kPick"></div></div></div>
 <div class="lfoot" id="kFoot"><div class="in2" id="kFootIn"></div></div></div>`;
 document.body.style.overflow="hidden";
 const $=s=>layer.querySelector(s),close=()=>{layer.innerHTML="";document.body.style.overflow="";o.onClose&&o.onClose()};
 $("#kClose").onclick=close;
 const foot=(h,c="")=>{$("#kFoot").className="lfoot "+c;$("#kFootIn").innerHTML=h};
 const warm=()=>{$("#kWarm").style.width=Math.round(20+80*pts/max)+"%"};
 const line=(me,vi,en)=>{const el=document.createElement("div");el.className="line"+(me?" r":"");
  el.innerHTML=`${me?avatar(o.name||"Bạn","me"):avatar(t.who,t.kind)}<div class="say"><p class="who">${esc(me?(o.name||"You"):t.who)}</p><p class="vi">${esc(vi)}</p>${en?`<p class="en">${esc(en)}</p>`:""}</div>`;
  $("#kDlg").appendChild(el);el.scrollIntoView({block:"end",behavior:"smooth"})};
 function step(){
  if(i>=t.steps.length)return end();
  const s=t.steps[i];line(false,s.npc[0],s.npc[1]);o.say(s.npc[0]);
  $("#kPick").innerHTML=`<div class="squiz"><h3>What do you say?</h3><div class="opts">${shuffle(s.choices.map((c,k)=>[c,k])).map(([c,k],n)=>`<button class="opt kopt" data-k="${k}"><span class="k">${n+1}</span><span><b>${esc(c.vi)}</b>${c.en?`<br><span class="muted small">${esc(c.en)}</span>`:""}</span></button>`).join("")}</div></div>`;
  $("#kPick").querySelector(".squiz").scrollIntoView({block:"end",behavior:"smooth"});
  foot(`<p class="muted" style="text-align:center;width:100%">Pick what you'd say.</p>`);
  layer.querySelectorAll(".kopt").forEach(b=>b.onclick=()=>{
   const c=s.choices[+b.dataset.k];$("#kPick").innerHTML="";
   if(c.silent){line(true,c.vi,"")}else{line(true,c.vi,c.en);o.say(c.vi)}
   pts+=VAL[c.q];warm();o.onPick&&o.onPick(c.q);
   const react=()=>{if(c.re){line(false,c.re[0],c.re[1]);if(!c.silent)setTimeout(()=>o.say(c.re[0]),50)}};
   setTimeout(react,c.silent?100:900);
   const head=c.q==="best"?"Perfect!":c.q==="ok"?"That works":"Hmm…";
   foot(`<div class="fb"><span class="badge">${c.q==="oops"?I.x:I.check}</span><div><h3>${head}</h3><p>${esc(c.note)}</p></div></div><button class="btn ${c.q==="oops"?"bad":""}" id="kNext">Continue</button>`,c.q==="oops"?"bad":"ok");
   $("#kNext").onclick=()=>{i++;step()};$("#kNext").focus()});
 }
 function end(){
  const pct=pts/max,stars=pct>=.85?3:pct>=.55?2:1;
  $("#kPick").innerHTML=`<div class="result">${mascot(stars===3?"cheer":"happy").replace('class="m "','style="width:120px;height:120px" class="m "')}<h2>${stars===3?`${esc(t.who)} is so proud of you!`:stars===2?"Nice conversation!":"Good try!"}</h2>
   <div class="mstars" style="justify-content:center">${[1,2,3].map(k=>`<i class="${k<=stars?"on":""}">${I.star}</i>`).join("")}</div>
   <p class="muted">${stars===3?"Your pronouns and politeness were spot on.":"Try again and pick the warmest answer each time."}</p></div>`;
  $("#kPick").scrollIntoView({block:"end",behavior:"smooth"});
  foot(`<button class="btn ghost skip" id="kAgain">Try again</button><button class="btn" id="kDone">Done</button>`);
  $("#kDone").onclick=close;$("#kAgain").onclick=()=>open(o);
  o.onEnd&&o.onEnd(stars);
 }
 warm();step();
}
window.TALK={TALKS,open};
})();
