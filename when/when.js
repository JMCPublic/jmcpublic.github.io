/* When was that? (built 23 Nov 2026 from mock-up v2, approved by Jonathan): three moments from history, tap them in order, earliest first.
   Six trios a day, the same for everyone: two easy, two medium, two hard. Then an optional bonus (the hardest).
   Scoring: 1 for the right order, ½ when exactly one is in its right place (with three, two right means all three right). Bonus is a ⭐ on top of the /6.
   Uses the Natural Wonders look (simple.css) and the shared house pieces: Goldilocks (rating.js via reach), weekly where-are-you card (tmg:gameover),
   visit/game counts (nwcount.js), feedback, footer, home button. Content: /when/trios.js. */
(()=>{
const app=document.getElementById('app'),$=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
const K='when',NAME='When was that?',TAGLINE='You know the events. Do you know the order?';
const VIP=ls('ap-vip')==='1';
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const dateTxt=()=>{try{return new Date().toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})}catch(e){return 'Today'}};
function rng(seed){let h=1779033703^seed.length;for(let i=0;i<seed.length;i++){h=Math.imul(h^seed.charCodeAt(i),3432918353);h=h<<13|h>>>19}
  return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return((h^=h>>>16)>>>0)/4294967296}}
const shuffle=(a,r)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const LV={e:'Easy',m:'Medium',h:'Hard',b:'Bonus'};

/* ---------- the day's trios: each level's list is shuffled once, then walked through day by day, so trios don't come back until the list runs out.
   No event appears twice on the same day. A practice seed (owner only) picks at random. ---------- */
const POOL={};['e','m','h','b'].forEach(l=>POOL[l]=shuffle(TRIOS.filter(t=>t.l===l),rng('when-pool-'+l)));
const DAY0=Date.UTC(2026,10,24);
function dayNo(seed){const m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(seed);return m?Math.round((Date.UTC(+m[1],+m[2]-1,+m[3])-DAY0)/864e5):Math.floor(rng(seed)()*1e6)}
function pick(seed){const n=dayNo(seed),used=new Set(),out=[];
  const take=(l,k,per)=>{const P=POOL[l];let got=0;for(let j=0;j<P.length&&got<k;j++){const t=P[(((n*per+j)%P.length)+P.length)%P.length];
      if(out.includes(t)||t.ev.some(e=>used.has(e[0])))continue;t.ev.forEach(e=>used.add(e[0]));out.push(t);got++}};
  take('e',2,2);take('m',2,2);take('h',2,2);const main=out.slice();take('b',1,1);const bonus=out[6]||null;
  return {qs:main.map(t=>prep(t,seed)),bonus:bonus?prep(bonus,seed):null}}
function prep(t,seed){const r=rng(seed+'|'+t.ev[0][0]);let o=shuffle([0,1,2],r);if(o.join()==='0,1,2')o=[o[1],o[2],o[0]];return {...t,order:o}}  /* never shown already in order */

/* ---------- page shell ---------- */
const HSVG='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>';
const back=`<a class="tmghome hmb" href="/" aria-label="All games" title="All games">${HSVG}</a><a class="back" href="/">← All games</a><span class="row"></span>`;
const hdr=t=>`<div class="top">${back}<span class="tag">${esc(t||dateTxt())}</span></div>`;
let S=null;
window.tmgMidGame=()=>!!(S&&!S.over&&S.res&&S.res.length>0&&S.res.length<S.qs.length);
const sc=p=>{const n=p.filter((v,i)=>v===i).length;return n===3?1:n===1?.5:0};
const half=n=>String(n).replace('.5','½');
const cls=r=>r===1?'ok':r===.5?'half':r===0?'no':'';
function prog(){const tot=S.qs.length+(S.inBonus?1:0);return `<div class="prog">${[...Array(tot)].map((_,k)=>{const r=k<S.qs.length?S.res[k]:S.bres;return `<i class="${r!=null?cls(r)+(k>=S.qs.length?' star':''):k===S.i?'now':''}"></i>`}).join('')}</div>`}

function start(seed,practice){const d=pick(seed);S={seed,practice,qs:d.qs,bonus:d.bonus,i:0,res:[],bres:null,inBonus:false,over:false};playQ()}
function cur(){return S.inBonus?S.bonus:S.qs[S.i]}
function playQ(){S.pick=[];S.done=false;draw();scrollTo(0,0)}
function gap(y){const a=Math.abs(y);let s;if(a<1){s='later the same year'}else{const r=Math.round(a);s=r.toLocaleString('en-GB')+' year'+(r===1?'':'s')+' later'}return `<div class="gap ${a<=10?'close':''}">${s}</div>`}
function draw(){const t=cur(),done=S.done,lab=S.inBonus?'Bonus trio':`${S.i+1} of ${S.qs.length}`;let cards;
  if(!done)cards=t.order.map(i=>{const p=S.pick.indexOf(i);return `<button class="ev ${p>=0?'on':''}" data-i="${i}"><span class="n">${p>=0?p+1:''}</span><span class="tx">${esc(t.ev[i][0])}</span></button>`}).join('');
  else{const r=S.inBonus?S.bres:S.res[S.i];cards=[0,1,2].map(i=>{const u=S.pick.indexOf(i)+1,ok=u===i+1;
    return `<div class="ev ${ok?(r===1?'ok':'half'):'no'}"><span class="n">${u}</span><span class="tx">${esc(t.ev[i][0])}</span><span class="yr">${esc(t.ev[i][2])}</span></div>`+(i<2?gap(t.ev[i+1][1]-t.ev[i][1]):'')}).join('')}
  const r=done?(S.inBonus?S.bres:S.res[S.i]):0,last=!S.inBonus&&S.i===S.qs.length-1;
  app.innerHTML=`<div class="play">${hdr(lab)}${prog()}
   <h2 class="q">Put them in order<span class="lvlb ${t.l}">${LV[t.l]}</span></h2>
   <p class="hint">${done?'Earliest at the top. The number is where you put it.':'Tap the earliest first, then the next, then the latest.'}</p>
   <div class="evs">${cards}</div>
   ${done?`<div class="fact"><b class="${r===1?'g':r?'y':'r'}">${r===1?(S.inBonus?'Brilliant! Bonus star ⭐':'Spot on! 1 point'):r?'Nearly: one in the right place. ½ point':(S.inBonus?'Not this time. The bonus is a tough one.':'Not quite. 0 points')}</b>${esc(t.f)}</div>
     <button class="next" id="nx">${S.inBonus?'See my score →':last?'Finish →':'Next trio →'}</button>`
   :`<button class="check" id="ck" ${S.pick.length<3?'disabled':''}>Check my order</button>${S.pick.length?'<button class="undo" id="un">Start this trio again</button>':''}`}</div>`;
  if(done){$('#nx').onclick=()=>{if(S.inBonus)return end();if(last)return S.bonus?offer():end();S.i++;playQ()};$('.fact').scrollIntoView({block:'nearest',behavior:'smooth'});return}
  app.querySelectorAll('.ev').forEach(b=>b.onclick=()=>{const i=+b.dataset.i,p=S.pick.indexOf(i);if(p>=0)S.pick=S.pick.slice(0,p);else if(S.pick.length<3)S.pick.push(i);draw()});
  const un=$('#un');if(un)un.onclick=()=>{S.pick=[];draw()};
  $('#ck').onclick=()=>{if(S.pick.length<3)return;const v=sc(S.pick);if(S.inBonus)S.bres=v===1?1:0;else S.res[S.i]=v;S.done=true;draw()}}

/* after the six: play the bonus, or finish */
function offer(){const n=S.res.reduce((a,b)=>a+b,0);
  app.innerHTML=`${hdr()}${prog()}<div class="panel intro bonus"><span class="tag">Six done · ${half(n)} / 6</span><h2>Fancy a bonus?</h2>
   <p>One extra trio, the hardest of the day. Often all three happened in the same year, so the months count.</p>
   <p class="sm">It won’t change your score out of 6. Get it exactly right and you earn a ⭐.</p>
   <div class="btns"><button class="btn" id="yb">Yes, play the bonus</button><button class="btn ghost" id="nb">No thanks, show my score</button></div></div>`;
  $('#yb').onclick=()=>{S.inBonus=true;playQ()};$('#nb').onclick=()=>end();scrollTo(0,0)}

/* ---------- the end ---------- */
function verdict(n){return n===6?'Perfect! A true historian 🏆':n>=5?'Brilliant. You really know your history.':n>=4?'Very good. You know your eras.':n>=2.5?'Not bad! History is trickier than it looks.':'Time is a funny thing. Tomorrow brings six fresh trios.'}
function record(n){const st=JSON.parse(ls(K+'-st')||'null')||{played:0,streak:0,last:''};const y=new Date();y.setDate(y.getDate()-1);
  const yk=y.getFullYear()+'-'+String(y.getMonth()+1).padStart(2,'0')+'-'+String(y.getDate()).padStart(2,'0');
  st.streak=st.last===yk?st.streak+1:st.last===today()?st.streak:1;st.last=today();st.played++;ls(K+'-st',JSON.stringify(st));
  ls(K+'-done-'+today(),String(n));ls(K+'-streak',JSON.stringify({n:st.streak,last:today()}))}  /* the home page card reads when-done- and when-streak */
function end(rev){S.over=true;const n=S.res.reduce((a,b)=>a+b,0);let best=+ls(K+'-best')||0;const newBest=!S.practice&&!rev&&n>best;if(newBest){best=n;ls(K+'-best',String(n))}
  if(!S.practice&&!rev){ls(K+'-day',JSON.stringify({d:S.seed,n,res:S.res,b:S.bres}));record(n);setTimeout(()=>{try{dispatchEvent(new Event('tmg:gameover'))}catch(e){}},0)}
  const sq=r=>r===1?'🟩':r===.5?'🟨':'🟥';
  const grid=S.res.map(sq).join('')+(S.bres===1?' ⭐':S.bres===0?' ✖️':'');
  const share=`${NAME} · twominute.games\n${grid} ${half(n)}/6${S.bres===1?' + bonus ⭐':''}`;
  const qs=S.qs.concat(S.bres!=null&&S.bonus?[S.bonus]:[]);
  app.innerHTML=`${hdr(S.practice&&!rev?'Practice set':'')}
  <div class="panel"><div class="score"><div class="tag">Your score</div><div class="big">${half(n)}<small> / 6</small>${S.bres===1?'<span class="star">⭐</span>':''}</div><p class="verdict">${esc(verdict(n))}</p>
   <div class="dots">${S.res.map(r=>`<i class="${cls(r)}"></i>`).join('')}${S.bres!=null?`<i class="${S.bres?'ok':'no'} star"></i>`:''}</div>
   <p class="best">${rev?'You’ve played today’s trios. New ones at midnight.':newBest?'🎉 Your best score yet':best?`Your best: ${half(best)} / 6`:''}${S.bres===1&&!rev?' · Bonus star earned ⭐':''}</p></div>
   <div class="list">${qs.map((t,k)=>{const r=k<6?S.res[k]:S.bres;return `<div class="li"><i>${r===1?(k<6?'✅':'⭐'):r===.5?'½':'❌'}</i><div>${t.ev.map(e=>esc(e[0])).join(' → ')}<br><span>${t.ev.map(e=>esc(e[2])).join(' · ')}${k===6?' · bonus':''}</span></div></div>`}).join('')}</div>
   <div class="btns"><button class="btn" id="share">Share my score</button></div>
   <p class="small">Six new trios tomorrow, the same for everyone.</p><p class="small srcl"><button type="button" class="lnk" id="srcBtn">Sources</button></p></div>
  ${more()}${VIP?'<div class="btns"><button class="btn ghost" id="again">Practice set (owner only)</button></div>':''}`;
  $('#share').onclick=async()=>{try{if(navigator.share){await navigator.share({text:share+'\nhttps://twominute.games/when/'})}else{await navigator.clipboard.writeText(share+'\nhttps://twominute.games/when/');$('#share').textContent='Copied ✓'}}catch(e){}};
  $('#srcBtn').onclick=sources;const ag=$('#again');if(ag)ag.onclick=()=>start(today()+':p'+Date.now(),true);scrollTo(0,0)}

/* Play another today: the other games on the home page, ticked when played today */
const OTHERS=[['Aperture','/aperture/','aperture','aperture2-best-'],['Landmarks','/aperture/landmarks/','landmarks','apL-best-'],['Natural Wonders','/wonders/','natural-wonders',''],['Fictional a→z','/fictional/','fictional','fictional-best-'],['Name That Classic','/classic/','classic','lclassic-done-'],['What’s That Noise?','/noise/','noise','lnoise-done-']];
function more(){return `<div class="panel more"><div class="tag">Play another today</div><div class="mgs">${OTHERS.map(([n,h,ic,k])=>{const d=k&&ls(k+today());
  return `<a class="mg${d?' done':''}" href="${h}"><img src="/icons/${ic}-180.png?v=3" alt="" width="40" height="40"><b>${esc(n)}</b><span>${d?'✓ Played':'Play'}</span></a>`}).join('')}</div></div>`}

/* Sources: same as the Natural Wonders games. The request arrives in Messages on the stats page; the email is used only to reply, then deleted. */
function sources(){const ov=document.createElement('div');ov.className='srcov';
  ov.innerHTML=`<form class="srcbox" role="dialog" aria-label="Sources" novalidate><div class="tag">Sources</div><h3>${NAME}</h3><p>Want the full list of sources for ${NAME}? Leave your email and we’ll send it to you.</p>
   <input type="email" id="srcE" autocomplete="email" inputmode="email" maxlength="150" placeholder="Your email" required>
   <button type="submit" class="btn" id="srcGo">Send me the sources</button>
   <p class="sm" id="srcM" aria-live="polite">We’ll only use your email to send you the sources, then delete it. <a href="/about/#privacy" target="_blank" rel="noopener">Privacy</a></p>
   <button type="button" class="btn ghost" id="srcX">Close</button></form>`;
  document.body.appendChild(ov);const f=ov.querySelector('form'),e=ov.querySelector('#srcE'),m=ov.querySelector('#srcM'),go=ov.querySelector('#srcGo'),x=()=>ov.remove();
  ov.onclick=ev=>{if(ev.target===ov)x()};ov.querySelector('#srcX').onclick=x;setTimeout(()=>e.focus(),60);
  f.onsubmit=async ev=>{ev.preventDefault();const em=e.value.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){m.textContent='Please check your email address.';e.focus();return}
    go.disabled=true;m.textContent='Sending…';const sv=v=>({stringValue:String(v)});
    const doc=k=>({fields:{kind:sv(k),message:sv((k==='sources'?'':'[Sources request] ')+'Please send the sources for When was that? (EN).'),contact:sv(em),game:sv(document.title.slice(0,120)),page:sv(location.pathname.slice(0,200)),where:sv('sources · when · en'),device:sv(matchMedia('(pointer:coarse)').matches?'phone':'desktop'),ua:sv(navigator.userAgent.slice(0,300)),at:{timestampValue:new Date().toISOString()}}});
    const post=k=>fetch('https://firestore.googleapis.com/v1/projects/aperture-c0961/databases/(default)/documents/feedback?key=AIzaSyCLMslnXssvPk7S7l_0MuajudNtHRK-VAI',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(doc(k))}).then(r=>r.ok);
    let ok=false;try{ok=await post('sources');if(!ok)ok=await post('idea')}catch(err){}
    if(!ok){m.textContent='That didn’t send. Please try again in a moment.';go.disabled=false;return}
    f.innerHTML=`<div class="tag">Sources</div><h3>✓</h3><p>Thanks! We’ll email you the sources soon.</p><button type="button" class="btn ghost" id="srcX">Close</button>`;f.querySelector('#srcX').onclick=x}}

/* ---------- start page ---------- */
function dayRec(){try{const o=JSON.parse(ls(K+'-day')||'null');return o&&o.d===today()?o:null}catch(e){return null}}
function intro(){const r=dayRec(),played=!!r;
  app.innerHTML=`${hdr()}<div class="panel intro menu"><img class="gicon" src="/icons/when-180.png?v=1" alt="" width="64" height="64"><span class="tag">History · daily</span><h2>${NAME}</h2><p class="sub">${TAGLINE}</p>
   <p>Three moments from history. Tap them in order, <b>earliest first</b>.</p>
   <ul><li>Six trios, about two minutes</li><li>Two easy, two medium, two hard</li><li>Then a bonus, if you dare</li></ul>
   <div class="btns">${played?`<p class="best" style="text-align:center;margin:0">Today you scored ${half(r.n)} / 6${r.b===1?' ⭐':''}</p>`:''}<button class="btn" id="go">${played?'Admire my score':'Play today’s trios'}</button>${VIP?'<button class="btn ghost" id="again">Practice set (owner only)</button>':''}</div></div>`;
  $('#go').onclick=()=>{if(!played)return start(today(),false);const d=pick(r.d);S={seed:r.d,practice:false,qs:d.qs,bonus:d.bonus,res:r.res,bres:r.b==null?null:r.b,over:true};end(true)};
  const ag=$('#again');if(ag)ag.onclick=()=>start(today()+':p'+Date.now(),true)}
window.__when={pick,POOL};
intro();
})();
