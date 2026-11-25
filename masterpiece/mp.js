/* Masterpiece (built 25 Nov 2026 from Old Masters mock-up v0.1, approved by Jonathan: name "Masterpiece", five a day, prints and later works welcome, rights-free).
   A famous artwork seen close up; zoom out step by step and name it from four. 4, 3, 2 or 1 points depending on how early. Five a day: two easy, two medium, one hard.
   Setting (Jonathan, 25 Nov): Easy / Medium / Hard changes how close the first view is (Easy shows more). Saved on the device, like Aperture's.
   House pieces as the other games: Goldilocks (rating.js via reach), weekly where-are-you card (tmg:gameover), counts (nwcount), feedback, footer, home button.
   Content: /masterpiece/art.js (images from Wikimedia Commons, all public domain). English for now. */
(()=>{
const app=document.getElementById('app'),$=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
const K='mp',NAME='Masterpiece',VIP=ls('ap-vip')==='1';
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const dateTxt=()=>{try{return new Date().toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})}catch(e){return ''}};
function rng(seed){let h=1779033703^seed.length;for(let i=0;i<seed.length;i++){h=Math.imul(h^seed.charCodeAt(i),3432918353);h=h<<13|h>>>19}
  return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return((h^=h>>>16)>>>0)/4294967296}}
const shuffle=(a,r)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

/* zoom ladders per setting: how many times enlarged at each step (the last step is the whole work) */
const LEVELS={easy:{n:'Easy',z:[3,2,1.4,1]},medium:{n:'Medium',z:[4.5,2.7,1.6,1]},hard:{n:'Hard',z:[6.5,3.5,1.8,1]}};
let LVL=LEVELS[ls('mp-level')]?ls('mp-level'):'easy';
const PTS=[4,3,2,1];

/* ---------- the day's five: each level's list is shuffled once (batch by batch) and walked through from launch day, so nothing repeats until the list runs out ---------- */
const POOL={};['e','m','h'].forEach(l=>{const T=ART.filter(t=>t.l===l),ws=[...new Set(T.map(t=>t.w||1))].sort((a,b)=>a-b);
  POOL[l]=ws.flatMap(w=>shuffle(T.filter(t=>(t.w||1)===w),rng('mp-pool-'+l+(w>1?'-w'+w:''))))});
const DAY0=Date.UTC(2026,10,26);
function dayNo(seed){const m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(seed);return m?Math.round((Date.UTC(+m[1],+m[2]-1,+m[3])-DAY0)/864e5):-1}
const MIX=[['e',2],['m',2],['h',1]];
function pick(seed){const n=dayNo(seed);let day;
  if(n>=0){const cur={e:0,m:0,h:0};for(let d=0;d<=n;d++){const out=[];MIX.forEach(([l,k])=>{for(let j=0;j<k;j++){out.push(POOL[l][cur[l]%POOL[l].length]);cur[l]++}});if(d===n)day=out}}
  else{const r=rng(seed);day=MIX.flatMap(([l,k])=>shuffle(POOL[l],r).slice(0,k))}
  return day.map(t=>({...t,opts:options(t,seed)}))}
/* wrong answers: another work by the same artist if there is one (from the list or the decoys), the rest from the same level */
function options(t,seed){const r=rng(seed+'|'+t.t);const all=ART.map(x=>[x.t,x.a,x.l]).concat(DECOYS.map(d=>[d[0],d[1],'d']));
  const same=shuffle(all.filter(x=>x[1]===t.a&&x[0]!==t.t),r).slice(0,1);
  const rest=shuffle(all.filter(x=>x[1]!==t.a&&(x[2]===t.l||x[2]==='d')),r).slice(0,3-same.length);
  return shuffle([[t.t,t.a],...same.map(x=>[x[0],x[1]]),...rest.map(x=>[x[0],x[1]])],r)}

/* ---------- page shell ---------- */
const HSVG='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>';
const back=`<a class="tmghome hmb" href="/" aria-label="All games" title="All games">${HSVG}</a><a class="back" href="/">← All games</a><span class="row"></span>`;
const hdr=t=>`<div class="top">${back}<span class="tag">${esc(t||dateTxt())}</span></div>`;
let S=null;
window.tmgMidGame=()=>!!(S&&!S.over&&S.sc&&S.sc.length>0&&S.sc.length<S.qs.length);
const cls=p=>p>=3?'ok':p>=1?'half':'no';
function prog(){return `<div class="prog">${S.qs.map((_,k)=>`<i class="${k<S.sc.length?cls(S.sc[k]):k===S.i?'now':''}"></i>`).join('')}</div>`}
function start(seed,practice){S={seed,practice,qs:pick(seed),i:0,sc:[],lvl:LVL,over:false};S.qs.forEach(p=>{const im=new Image();im.src=p.img});q()}  /* fetch all five at the start so the next one is ready */
function q(){S.z=0;S.done=false;draw();scrollTo(0,0)}
const Z=()=>LEVELS[S.lvl].z;
function frame(p,scale){return `<div class="wrapf"><div class="frame" data-l="Loading the work…" style="aspect-ratio:${p.r};width:min(100%,calc(var(--fh)*${p.r}))"><img src="${esc(p.img)}" alt="" style="transform-origin:${p.f[0]}% ${p.f[1]}%;transform:scale(${scale})"></div></div>`}
function draw(){const p=S.qs[S.i],done=S.done,z=Z();
  app.innerHTML=`<div class="play">${hdr(`${S.i+1} of ${S.qs.length} · ${LEVELS[S.lvl].n}`)}${prog()}${frame(p,done?1:z[S.z])}
   ${done?'':`<div class="step">${z.map((_,k)=>`<i class="${k<=S.z?'on':''}"></i>`).join('')}</div><p class="pts">Name it now for <b>${PTS[S.z]} point${PTS[S.z]>1?'s':''}</b></p>
   <button class="zoom" id="zo" ${S.z>=z.length-1?'disabled':''}>${S.z>=z.length-1?'The whole work is showing':'Zoom out (−1 point)'}</button>`}
   <div class="opts">${p.opts.map((o,k)=>`<button class="opt" data-k="${k}" ${done?'disabled':''}><span class="k">${'ABCD'[k]}</span><span>${esc(o[0])}<small>${esc(o[1])}</small></span></button>`).join('')}</div><div id="after"></div></div>`;
  if(done)return after();
  $('#zo').onclick=()=>{if(S.z<z.length-1){S.z++;$('.frame img').style.transform=`scale(${z[S.z]})`;const st=app.querySelectorAll('.step i');st[S.z].classList.add('on');
    $('.pts').innerHTML=`Name it now for <b>${PTS[S.z]} point${PTS[S.z]>1?'s':''}</b>`;if(S.z>=z.length-1){$('#zo').disabled=true;$('#zo').textContent='The whole work is showing'}}};
  app.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const o=p.opts[+b.dataset.k];S.pickT=o[0];S.got=o[0]===p.t?PTS[S.z]:0;S.sc.push(S.got);S.done=true;draw()})}
function after(){const p=S.qs[S.i],last=S.i===S.qs.length-1;
  app.querySelectorAll('.opt').forEach(b=>{const o=p.opts[+b.dataset.k];b.classList.add(o[0]===p.t?'ok':o[0]===S.pickT?'no':'dim')});
  $('#after').innerHTML=`<div class="fact"><b class="${S.got?'g':'r'}">${S.got?`Yes! ${S.got} point${S.got>1?'s':''}`:'Not this time.'}</b><b class="ttl2">${esc(p.t)} · ${esc(p.a)}, ${esc(p.y)}</b>${esc(p.m.charAt(0).toUpperCase()+p.m.slice(1))}. ${esc(p.fact)}<div class="cap">Image: <a href="${esc(p.page)}" target="_blank" rel="noopener">Wikimedia Commons</a> · public domain</div></div>
   <button class="next" id="nx">${last?'See my score':'Next work →'}</button>`;
  $('#nx').onclick=()=>{if(last)end();else{S.i++;q()}};$('#after').scrollIntoView({block:'nearest',behavior:'smooth'})}

/* ---------- the end ---------- */
const verdict=n=>n>=18?'A true connoisseur 🖼️':n>=14?'Brilliant. You know your galleries.':n>=10?'A good eye. Very nicely done.':n>=5?'Not bad! Some of these are tricky up close.':'Art takes time. Five new works tomorrow.';
function record(n){const st=JSON.parse(ls(K+'-st')||'null')||{played:0,streak:0,last:''};const y=new Date();y.setDate(y.getDate()-1);
  const yk=y.getFullYear()+'-'+String(y.getMonth()+1).padStart(2,'0')+'-'+String(y.getDate()).padStart(2,'0');
  st.streak=st.last===yk?st.streak+1:st.last===today()?st.streak:1;st.last=today();st.played++;ls(K+'-st',JSON.stringify(st));
  ls(K+'-done-'+today(),String(n));ls(K+'-streak',JSON.stringify({n:st.streak,last:today()}))}  /* the home page card reads mp-done- and mp-streak */
const SQ=p=>['⬛','🟥','🟧','🟨','🟩'][p];
function end(rev){S.over=true;const n=S.sc.reduce((a,b)=>a+b,0);let best=+ls(K+'-best')||0;const newBest=!S.practice&&!rev&&n>best;if(newBest){best=n;ls(K+'-best',String(n))}
  if(!S.practice&&!rev){ls(K+'-day',JSON.stringify({d:S.seed,n,sc:S.sc,lvl:S.lvl,t:S.qs.map(p=>[p.t,p.a])}));record(n);setTimeout(()=>{try{dispatchEvent(new Event('tmg:gameover'))}catch(e){}},0)}
  const share=`${NAME} · twominute.games\n${S.sc.map(SQ).join('')} ${n}/20 (${LEVELS[S.lvl].n})`;
  app.innerHTML=`${hdr(S.practice&&!rev?'Practice set':'')}
  <div class="panel"><div class="score"><div class="tag">Your score · ${LEVELS[S.lvl].n}</div><div class="big">${n}<small> / 20</small></div><p class="verdict">${esc(verdict(n))}</p>
   <div class="dots">${S.sc.map(p=>`<i class="${cls(p)}"></i>`).join('')}</div>
   <p class="best">${rev?'You’ve seen today’s five. New ones at midnight.':newBest?'🎉 Your best score yet':best?`Your best: ${best} / 20`:''}</p></div>
   <div class="list">${S.qs.map((p,k)=>`<div class="li"><i>${S.sc[k]?SQ(S.sc[k]):'❌'}</i><div><b>${esc(p.t)}</b> <span>· ${esc(p.a)}</span></div></div>`).join('')}</div>
   <div class="btns"><button class="btn" id="share">Share my score</button></div>
   <p class="small">Five new masterpieces tomorrow, the same for everyone.</p><p class="small srcl"><button type="button" class="lnk" id="srcBtn">Sources</button></p></div>
  ${more()}${VIP?'<div class="btns"><button class="btn ghost" id="again">Practice set (owner only)</button></div>':''}`;
  $('#share').onclick=async()=>{try{if(navigator.share){await navigator.share({text:share+'\nhttps://twominute.games/masterpiece/'})}else{await navigator.clipboard.writeText(share+'\nhttps://twominute.games/masterpiece/');$('#share').textContent='Copied ✓'}}catch(e){}};
  $('#srcBtn').onclick=sources;const ag=$('#again');if(ag)ag.onclick=()=>start(today()+':p'+Date.now(),true);scrollTo(0,0)}

/* Play another today */
const OTHERS=[['Aperture','/aperture/','aperture','aperture2-best-'],['Landmarks','/aperture/landmarks/','landmarks','apL-best-'],['When was that?','/when/','when','when-done-'],['Natural Wonders','/wonders/','natural-wonders',''],['Fictional a→z','/fictional/','fictional','fictional-best-'],['Name That Classic','/classic/','classic','lclassic-done-'],['What’s That Noise?','/noise/','noise','lnoise-done-']];
function more(){return `<div class="panel more"><div class="tag">Play another today</div><div class="mgs">${OTHERS.map(([n,h,ic,k])=>{const d=k&&ls(k+today());
  return `<a class="mg${d?' done':''}" href="${h}"><img src="/icons/${ic}-180.png?v=${ic==='when'?1:3}" alt="" width="40" height="40"><b>${esc(n)}</b><span>${d?'✓ Played':'Play'}</span></a>`}).join('')}</div></div>`}

/* Sources: same as the other games; the email is used only to send the list, then deleted */
function sources(){const ov=document.createElement('div');ov.className='srcov';
  ov.innerHTML=`<form class="srcbox" role="dialog" aria-label="Sources" novalidate><div class="tag">Sources</div><h3>${NAME}</h3><p>Every image comes from Wikimedia Commons and is in the public domain; tap “Wikimedia Commons” under any work for its page. Want the full list of sources? Leave your email and we’ll send it to you.</p>
   <input type="email" id="srcE" autocomplete="email" inputmode="email" maxlength="150" placeholder="Your email" required>
   <button type="submit" class="btn" id="srcGo">Send me the sources</button>
   <p class="sm" id="srcM" aria-live="polite">We’ll only use your email to send you the sources, then delete it. <a href="/about/#privacy" target="_blank" rel="noopener">Privacy</a></p>
   <button type="button" class="btn ghost" id="srcX">Close</button></form>`;
  document.body.appendChild(ov);const f=ov.querySelector('form'),e=ov.querySelector('#srcE'),m=ov.querySelector('#srcM'),go=ov.querySelector('#srcGo'),x=()=>ov.remove();
  ov.onclick=ev=>{if(ev.target===ov)x()};ov.querySelector('#srcX').onclick=x;setTimeout(()=>e.focus(),60);
  f.onsubmit=async ev=>{ev.preventDefault();const em=e.value.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){m.textContent='Please check your email address.';e.focus();return}
    go.disabled=true;m.textContent='Sending…';const sv=v=>({stringValue:String(v)});
    const doc=k=>({fields:{kind:sv(k),message:sv((k==='sources'?'':'[Sources request] ')+'Please send the sources for Masterpiece (EN).'),contact:sv(em),game:sv(document.title.slice(0,120)),page:sv(location.pathname.slice(0,200)),where:sv('sources · masterpiece · en'),device:sv(matchMedia('(pointer:coarse)').matches?'phone':'desktop'),ua:sv(navigator.userAgent.slice(0,300)),at:{timestampValue:new Date().toISOString()}}});
    const post=k=>fetch('https://firestore.googleapis.com/v1/projects/aperture-c0961/databases/(default)/documents/feedback?key=AIzaSyCLMslnXssvPk7S7l_0MuajudNtHRK-VAI',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(doc(k))}).then(r=>r.ok);
    let ok=false;try{ok=await post('sources');if(!ok)ok=await post('idea')}catch(err){}
    if(!ok){m.textContent='That didn’t send. Please try again in a moment.';go.disabled=false;return}
    f.innerHTML=`<div class="tag">Sources</div><h3>✓</h3><p>Thanks! We’ll email you the sources soon.</p><button type="button" class="btn ghost" id="srcX">Close</button>`;f.querySelector('#srcX').onclick=x}}

/* ---------- start page ---------- */
function dayRec(){try{const o=JSON.parse(ls(K+'-day')||'null');return o&&o.d===today()?o:null}catch(e){return null}}
function intro(){const r=dayRec(),played=!!r;
  app.innerHTML=`${hdr()}<div class="panel intro menu"><img class="gicon" src="/icons/masterpiece-180.png?v=1" alt="" width="64" height="64"><span class="tag">Art · daily</span><h2>${NAME}</h2><p class="sub">Can you name it before you see it all?</p>
   <p>A famous work of art, seen close up. Zoom out bit by bit and name it as soon as you can.</p>
   <ul><li>Five works, about two minutes</li><li>Name it early for more points: 4, 3, 2 or 1</li><li>Where it hangs and a fact about every one</li></ul>
   <div class="lvls" role="group" aria-label="How close to start">${Object.entries(LEVELS).map(([k,v])=>`<button type="button" data-l="${k}" class="${k===LVL?'on':''}" ${played?'disabled':''}>${v.n}</button>`).join('')}</div>
   <p class="lvlh">${played?'':'Easy starts further out; Hard starts very close.'}</p>
   <div class="btns">${played?`<p class="best" style="text-align:center;margin:0">Today you scored ${r.n} / 20 (${LEVELS[r.lvl]?LEVELS[r.lvl].n:''})</p>`:''}<button class="btn" id="go">${played?'Admire my score':'Start'}</button>${VIP?'<button class="btn ghost" id="again">Practice set (owner only)</button>':''}</div></div>`;
  app.querySelectorAll('.lvls button').forEach(b=>b.onclick=()=>{LVL=b.dataset.l;ls('mp-level',LVL);app.querySelectorAll('.lvls button').forEach(x=>x.classList.toggle('on',x===b))});
  $('#go').onclick=()=>{if(!played)return start(today(),false);
    const qs=(r.t||[]).map(x=>({t:x[0],a:x[1]}));S={seed:r.d,practice:false,qs,sc:r.sc,lvl:LEVELS[r.lvl]?r.lvl:'easy',over:true};end(true)};
  const ag=$('#again');if(ag)ag.onclick=()=>start(today()+':p'+Date.now(),true)}
window.__mp={pick,POOL};
intro();
})();
