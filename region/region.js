/* Point to the Region (built 26 Nov 2026 from mock-up v0.4, approved by Jonathan: "Nice game. Played on mobile. Please build with all the usual bells and whistles").
   A round: "What is this country?" (big map with its neighbours, four choices), then the map zooms in: "Where is Saxony?" (tap the region).
   The UK, France, Italy and Spain have three steps: region, then a county / département / province inside it.
   Every round is worth 6 points, shared equally between its steps (3 + 3, or 2 + 2 + 2). Five rounds a day (2 easy, 2 medium, 1 hard), out of 30.
   House pieces as the other games: Goldilocks (rating.js via reach), weekly where-are-you card (tmg:gameover), counts (nwcount), feedback, footer, home button, Sources, Play another today.
   Maps: Natural Earth (public domain), one data file per country in /region/data/. Rounds: /region/rounds.js. English for now. */
(()=>{
const app=document.getElementById('app'),$=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
const K='rg',NAME='Point to the Region',VIP=ls('ap-vip')==='1';
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const dateTxt=()=>{try{return new Date().toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})}catch(e){return ''}};
function rng(seed){let h=1779033703^seed.length;for(let i=0;i<seed.length;i++){h=Math.imul(h^seed.charCodeAt(i),3432918353);h=h<<13|h>>>19}
  return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return((h^=h>>>16)>>>0)/4294967296}}
const shuffle=(a,r)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const LVN={e:'Easy',m:'Medium',h:'Hard'};

/* ---------- the day's five: each level's list is shuffled once (batch by batch) and walked through from launch day; a country never appears twice in one day (a clash waits in a queue for the next day) ---------- */
const POOL={};['e','m','h'].forEach(l=>{const T=PR.filter(t=>t.l===l),ws=[...new Set(T.map(t=>t.w||1))].sort((a,b)=>a-b);
  POOL[l]=ws.flatMap(w=>shuffle(T.filter(t=>(t.w||1)===w),rng('rg-pool-'+l+(w>1?'-w'+w:''))))});
const DAY0=Date.UTC(2026,10,27);
function dayNo(seed){const m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(seed);return m?Math.round((Date.UTC(+m[1],+m[2]-1,+m[3])-DAY0)/864e5):-1}
const MIX=[['e',2],['m',2],['h',1]];
function pick(seed){const n=dayNo(seed);
  if(n<0){const r=rng(seed),out=[],used=new Set();MIX.forEach(([l,k])=>{for(const t of shuffle(POOL[l],r)){if(out.filter(x=>x.l===l).length>=k)break;if(!used.has(t.k)){used.add(t.k);out.push(t)}}});return out}
  const cur={e:0,m:0,h:0},Q={e:[],m:[],h:[]};let day;
  for(let d=0;d<=n;d++){const out=[],used=new Set();
    MIX.forEach(([l,k])=>{let got=0;const keep=[];
      while(Q[l].length&&got<k){const t=Q[l].shift();if(used.has(t.k))keep.push(t);else{out.push(t);used.add(t.k);got++}}
      Q[l]=keep.concat(Q[l]);
      let guard=0;while(got<k&&guard++<POOL[l].length*2){const t=POOL[l][cur[l]%POOL[l].length];cur[l]++;if(used.has(t.k))Q[l].push(t);else{out.push(t);used.add(t.k);got++}}});
    if(d===n)day=out}
  return day}
/* "Keep playing": five random rounds, avoiding today's and anything seen this visit */
let SEEN=[];try{SEEN=JSON.parse(sessionStorage.getItem('rg-seen')||'[]')}catch(e){}
const key=t=>t.k+'|'+[].concat(t.r).join('>');
function morePick(){const t5=new Set(pick(today()).map(key));let c=PR.filter(t=>!t5.has(key(t))&&!SEEN.includes(key(t)));if(c.length<5){SEEN=[];c=PR.filter(t=>!t5.has(key(t)))}
  const r=Math.random,out=[],used=new Set();for(const t of shuffle(c,r)){if(out.length>=5)break;if(!used.has(t.k)){used.add(t.k);out.push(t)}}
  SEEN=SEEN.concat(out.map(key));try{sessionStorage.setItem('rg-seen',JSON.stringify(SEEN))}catch(e){}return out}

/* load the country maps a set needs, then go */
function need(ks){return Promise.all([...new Set(ks)].map(k=>window.PD&&PD[k]?1:new Promise(res=>{const s=document.createElement('script');s.src='/region/data/'+k+'.js?v=1';s.onload=s.onerror=()=>res();document.head.appendChild(s)})))}

/* ---------- page shell ---------- */
const HSVG='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>';
const back=`<a class="tmghome hmb" href="/" aria-label="All games" title="All games">${HSVG}</a><a class="back" href="/">← All games</a><span class="row"></span>`;
const hdr=t=>`<div class="top">${back}<span class="tag">${esc(t||dateTxt())}</span></div>`;
let S=null;
window.tmgMidGame=()=>!!(S&&!S.over&&S.sc&&S.sc.length>0&&S.sc.length<S.qs.length);
const cls=p=>p===6?'ok':p===0?'no':'h';
const prog=()=>`<div class="prog">${S.qs.map((_,k)=>`<i class="${k<S.sc.length?cls(S.sc[k]):k===S.i?'now':''}"></i>`).join('')}</div>`;
async function start(seed,practice,more){const qs=more?morePick():pick(seed);app.innerHTML=`${hdr()}<p class="loading">Unfolding the maps…</p>`;
  await need(qs.map(t=>t.k));S={seed,practice:practice||!!more,more:!!more,qs,i:0,sc:[],over:false};round()}
const steps=t=>Array.isArray(t.r)?3:2,PS=t=>6/steps(t);
function svg(D,vb){return `<svg id="m" viewBox="${vb.join(' ')}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Map">${D.o.map(d=>`<path class="o" d="${d}"/>`).join('')}<path class="c" id="cty" d="${D.c}"/><g id="cx"></g><g class="rg" id="rg"></g></svg>`}
function round(){const q=S.qs[S.i],D=PD[q.k];S.got=[];S.sel=null;
  const r=rng((S.seed||'')+'|'+key(q));S.opts=shuffle([D.n,...shuffle(PW[q.k]||D.nb.filter(n=>n!==D.n),r).slice(0,3)],r);
  app.innerHTML=`<div class="play">${hdr(`${S.more?'Keep playing · ':''}${S.i+1} of ${S.qs.length}`)}${prog()}<p class="q" id="qq">What is this country?</p>
   <div class="pmap"><span class="lvl ${q.l}">${LVN[q.l]}</span>${svg(D,D.vb1)}<span class="hint" id="hint" style="display:none"></span></div>
   <div class="opts" id="opts">${S.opts.map((o,k)=>`<button class="opt" data-k="${k}"><span class="k">${'ABCD'[k]}</span><span>${esc(o)}</span></button>`).join('')}</div><div id="out"></div></div>`;
  app.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const o=S.opts[+b.dataset.k],ok=o===D.n;S.got.push(ok?PS(q):0);
    app.querySelectorAll('.opt').forEach(x=>{x.disabled=true;const v=S.opts[+x.dataset.k];x.classList.add(v===D.n?'ok':v===o?'no':'dim')});
    const nx=Array.isArray(q.r)?q.r[0]:q.r;
    $('#out').innerHTML=`<div class="fact"><b class="${ok?'g':'r'}">${ok?'Yes! It’s '+esc(D.n):'It’s '+esc(D.n)}<span class="half ${ok?'g':'r'}">${ok?'+'+PS(q):'0'}</span></b>${ok?'':'You can still score in the next step.'}</div><button class="next" id="nx">Now: where is ${esc(nx)}? →</button>`;
    $('#nx').onclick=()=>step2(q,D);$('#out').scrollIntoView({block:'nearest',behavior:'smooth'})});
  scrollTo(0,0)}
function zoomTo(el,from,to,ms,done){if(matchMedia('(prefers-reduced-motion: reduce)').matches){el.setAttribute('viewBox',to.join(' '));done&&done();return}
  const t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/ms),e=1-Math.pow(1-k,3);el.setAttribute('viewBox',from.map((v,i)=>v+(to[i]-v)*e).join(' '));if(k<1)requestAnimationFrame(f);else done&&done()};requestAnimationFrame(f)}
function step2(q,D){S.st=Array.isArray(q.r)?[{list:D.r,name:q.r[0],vb:D.vb2,what:'region'},{list:null,name:q.r[1],what:q.k==='FRA'?'département':q.k==='GBR'?'county':'province'}]:[{list:D.r,name:q.r,vb:D.vb2,what:q.k==='USA'?'state':'region'}];
  S.si=0;$('#opts').remove();$('#cty').style.display='none';scrollTo({top:0,behavior:'smooth'});S.from=D.vb1;doStep(q,D)}
function doStep(q,D){const st=S.st[S.si],m=$('#m'),rg=$('#rg'),pts=PS(q);S.sel=null;S.locked=false;
  if(!st.list){const g=D.r.find(x=>x.n===S.st[0].name);st.list=D.cs.filter(c=>c.g===g.n);st.vb=g.vb}
  $('#qq').innerHTML=`Where is <b>${esc(st.name)}</b>?`;$('#out').innerHTML=`<button class="next" id="lk" disabled>Lock in ${st.what}</button>`;$('#hint').style.display='none';
  $('#cx').innerHTML=S.si>0?D.r.filter(x=>x.n!==S.st[0].name).map(x=>`<path class="cxp" d="${x.d}"/>`).join(''):'';
  rg.innerHTML=st.list.map((x,k)=>`<path d="${x.d}" data-i="${k}"/>`).join('');
  zoomTo(m,S.from,st.vb,650,()=>{const h=$('#hint');h.textContent='Tap the '+st.what;h.style.display=''});S.from=st.vb;
  rg.onclick=e=>{if(S.locked)return;const t=e.target.closest('path');if(!t)return;rg.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));t.classList.add('sel');S.sel=+t.dataset.i;$('#lk').disabled=false};
  $('#lk').onclick=()=>{if(S.sel===null)return;S.locked=true;const ri=st.list.findIndex(x=>x.n===st.name),ok=S.sel===ri;S.got.push(ok?pts:0);$('#hint').style.display='none';
    rg.querySelectorAll('path').forEach(p=>{p.classList.remove('sel');const i=+p.dataset.i;if(i===ri)p.classList.add('ok');else if(i===S.sel)p.classList.add('no')});
    if(S.si<S.st.length-1){$('#out').innerHTML=`<div class="fact"><b class="${ok?'g':'r'}">${ok?'Yes! That’s '+esc(st.name):'Not quite: that’s '+esc(st.list[S.sel].n)}<span class="half ${ok?'g':'r'}">${ok?'+'+pts:'0'}</span></b>${ok?'':esc(st.name)+' is in green.'}</div><button class="next" id="nx">Now: where is ${esc(S.st[S.si+1].name)}? →</button>`;
      $('#nx').onclick=()=>{S.si++;doStep(q,D)};return}
    const tot=S.got.reduce((a,b)=>a+b,0);S.sc.push(tot);$('.prog').outerHTML=prog();const last=S.i===S.qs.length-1;
    $('#out').innerHTML=`<div class="fact"><b class="${ok?'g':'r'}">${ok?'Spot on!':'Not quite: that’s '+esc(st.list[S.sel].n)}<span class="half ${ok?'g':'r'}">${ok?'+'+pts:'0'}</span></b>This round: <b class="inl">${tot} / 6</b>. ${esc(q.f)}</div><button class="next" id="nx">${last?'See my score':'Next country →'}</button>`;
    $('#nx').onclick=()=>{if(last)(S.more?moreEnd():end());else{S.i++;round()}};$('#out').scrollIntoView({block:'nearest',behavior:'smooth'})}}

/* ---------- the end ---------- */
const verdict=n=>n>=27?'A walking atlas 🗺️':n>=21?'Brilliant. You really know your way around.':n>=15?'A good sense of place. Nicely done.':n>=9?'Not bad! Some of these are tricky.':'Maps take practice. Five new countries tomorrow.';
const SQ=p=>p===6?'🟩':p>0?'🟨':'🟥';
const label=t=>Array.isArray(t.r)?t.r[1]:t.r;
function record(n){const st=JSON.parse(ls(K+'-st')||'null')||{played:0,streak:0,last:''};const y=new Date();y.setDate(y.getDate()-1);
  const yk=y.getFullYear()+'-'+String(y.getMonth()+1).padStart(2,'0')+'-'+String(y.getDate()).padStart(2,'0');
  st.streak=st.last===yk?st.streak+1:st.last===today()?st.streak:1;st.last=today();st.played++;ls(K+'-st',JSON.stringify(st));
  ls(K+'-done-'+today(),String(n));ls(K+'-streak',JSON.stringify({n:st.streak,last:today()}))}  /* the home page card and other games' lists read rg-done- and rg-streak */
function list(){return `<div class="list">${S.qs.map((q,k)=>`<div class="li"><i>${SQ(S.sc[k])}</i><div><b>${esc(label(q))}</b> <span>· ${esc((PD[q.k]||{n:q.k}).n)}</span></div></div>`).join('')}</div>`}
function end(rev){S.over=true;const n=S.sc.reduce((a,b)=>a+b,0);let best=+ls(K+'-best')||0;const newBest=!S.practice&&!rev&&n>best;if(newBest){best=n;ls(K+'-best',String(n))}
  if(!S.practice&&!rev){ls(K+'-day',JSON.stringify({d:S.seed,n,sc:S.sc,t:S.qs.map(key)}));record(n);setTimeout(()=>{try{dispatchEvent(new Event('tmg:gameover'))}catch(e){}},0)}
  const share=`${NAME} · twominute.games\n${S.sc.map(SQ).join('')} ${n}/30`;
  app.innerHTML=`${hdr(S.practice&&!rev?'Practice set':'')}
  <div class="panel"><div class="score"><div class="tag">Your score</div><div class="big">${n}<small> / 30</small></div><p class="verdict">${esc(verdict(n))}</p>
   <div class="dots">${S.sc.map(p=>`<i class="${cls(p)}"></i>`).join('')}</div>
   <p class="best">${rev?'You’ve played today’s five. New countries at midnight.':newBest?'🎉 Your best score yet':best?`Your best: ${best} / 30`:''}</p></div>
   ${list()}
   <div class="btns"><button class="btn" id="share">Share my score</button></div>
   <p class="small">Five new countries tomorrow, the same for everyone.</p><p class="small srcl"><button type="button" class="lnk" id="srcBtn">Sources</button></p></div>
  ${keepPanel()}${more()}${VIP?'<div class="btns"><button class="btn ghost" id="again">Practice set (owner only)</button></div>':''}`;
  $('#share').onclick=async()=>{const u='https://twominute.games/region/';try{if(navigator.share){await navigator.share({text:share+'\n'+u})}else{await navigator.clipboard.writeText(share+'\n'+u);$('#share').textContent='Copied ✓'}}catch(e){}};
  $('#srcBtn').onclick=sources;keepWire();const ag=$('#again');if(ag)ag.onclick=()=>start(today()+':p'+Date.now(),true);scrollTo(0,0)}
function keepPanel(){return `<div class="panel more"><div class="tag">Keep playing</div><p class="small" style="margin:2px 0 10px">Five more countries, as often as you like. Just for fun: not counted.</p><div class="btns" style="margin-top:0"><button class="btn" id="keep">Five more countries</button></div></div>`}
function keepWire(){const b=$('#keep');if(b)b.onclick=()=>start('k'+Date.now(),true,true)}
function moreEnd(){S.over=true;const n=S.sc.reduce((a,b)=>a+b,0);
  app.innerHTML=`${hdr('Keep playing')}<div class="panel"><div class="score"><div class="tag">Keep playing</div><div class="big">${n}<small> / 30</small></div><p class="verdict">${esc(verdict(n))}</p><div class="dots">${S.sc.map(p=>`<i class="${cls(p)}"></i>`).join('')}</div></div>
   ${list()}<div class="again"><b>Play another five?</b><div class="btns"><button class="btn" id="keep">Yes, five more countries</button></div></div></div>${more()}`;keepWire();scrollTo(0,0)}

/* Play another today */
const OTHERS=[['Aperture','/aperture/','aperture','aperture2-best-'],['Landmarks','/aperture/landmarks/','landmarks','apL-best-'],['When was that?','/when/','when','when-done-'],['Masterpiece','/masterpiece/','masterpiece','mp-done-'],['Natural Wonders','/wonders/','natural-wonders',''],['Fictional a→z','/fictional/','fictional','fictional-best-'],['Name That Classic','/classic/','classic','lclassic-done-'],['What’s That Noise?','/noise/','noise','lnoise-done-']];
function more(){return `<div class="panel more"><div class="tag">Play another today</div><div class="mgs">${OTHERS.map(([n,h,ic,k])=>{const d=k&&ls(k+today());
  return `<a class="mg${d?' done':''}" href="${h}"><img src="/icons/${ic}-180.png?v=${ic==='when'||ic==='masterpiece'?1:3}" alt="" width="40" height="40"><b>${esc(n)}</b><span>${d?'✓ Played':'Play'}</span></a>`}).join('')}</div></div>`}

/* Sources: same as the other games; the email is used only to send the list, then deleted */
function sources(){const ov=document.createElement('div');ov.className='srcov';
  ov.innerHTML=`<form class="srcbox" role="dialog" aria-label="Sources" novalidate><div class="tag">Sources</div><h3>${NAME}</h3><p>The maps are from Natural Earth, free public-domain map data. The facts are checked against encyclopaedias and official sources. Want the full list? Leave your email and we’ll send it to you.</p>
   <input type="email" id="srcE" autocomplete="email" inputmode="email" maxlength="150" placeholder="Your email" required>
   <button type="submit" class="btn" id="srcGo">Send me the sources</button>
   <p class="sm" id="srcM" aria-live="polite">We’ll only use your email to send you the sources, then delete it. <a href="/about/#privacy" target="_blank" rel="noopener">Privacy</a></p>
   <button type="button" class="btn ghost" id="srcX">Close</button></form>`;
  document.body.appendChild(ov);const f=ov.querySelector('form'),e=ov.querySelector('#srcE'),m=ov.querySelector('#srcM'),go=ov.querySelector('#srcGo'),x=()=>ov.remove();
  ov.onclick=ev=>{if(ev.target===ov)x()};ov.querySelector('#srcX').onclick=x;setTimeout(()=>e.focus(),60);
  f.onsubmit=async ev=>{ev.preventDefault();const em=e.value.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){m.textContent='Please check your email address.';e.focus();return}
    go.disabled=true;m.textContent='Sending…';const sv=v=>({stringValue:String(v)});
    const doc=k=>({fields:{kind:sv(k),message:sv((k==='sources'?'':'[Sources request] ')+'Please send the sources for Point to the Region (EN).'),contact:sv(em),game:sv(document.title.slice(0,120)),page:sv(location.pathname.slice(0,200)),where:sv('sources · region · en'),device:sv(matchMedia('(pointer:coarse)').matches?'phone':'desktop'),ua:sv(navigator.userAgent.slice(0,300)),at:{timestampValue:new Date().toISOString()}}});
    const post=k=>fetch('https://firestore.googleapis.com/v1/projects/aperture-c0961/databases/(default)/documents/feedback?key=AIzaSyCLMslnXssvPk7S7l_0MuajudNtHRK-VAI',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(doc(k))}).then(r=>r.ok);
    let ok=false;try{ok=await post('sources');if(!ok)ok=await post('idea')}catch(err){}
    if(!ok){m.textContent='That didn’t send. Please try again in a moment.';go.disabled=false;return}
    f.innerHTML=`<div class="tag">Sources</div><h3>✓</h3><p>Thanks! We’ll email you the sources soon.</p><button type="button" class="btn ghost" id="srcX">Close</button>`;f.querySelector('#srcX').onclick=x}}

/* ---------- start page ---------- */
function dayRec(){try{const o=JSON.parse(ls(K+'-day')||'null');return o&&o.d===today()?o:null}catch(e){return null}}
function intro(){const r=dayRec(),played=!!r;
  app.innerHTML=`${hdr()}<div class="panel intro menu"><img class="gicon" src="/icons/region-180.png?v=1" alt="" width="64" height="64"><span class="tag">Geography · daily</span><h2>${NAME}</h2><p class="sub">Name the country. Then find the region.</p>
   <p>A country lights up on the map. Name it, then tap a region inside it: Saxony, Alberta, Shropshire…</p>
   <ul><li>Five countries, about two minutes</li><li>6 points a round: name the country, then find the region</li><li>A fact about every region</li></ul>
   <div class="btns">${played?`<p class="best" style="text-align:center;margin:0">Today you scored ${r.n} / 30</p>`:''}<button class="btn" id="go">${played?'Admire my score':'Start'}</button>${VIP?'<button class="btn ghost" id="again">Practice set (owner only)</button>':''}</div></div>${played?keepPanel():''}`;
  if(played)keepWire();
  $('#go').onclick=async()=>{if(!played)return start(today(),false);
    const qs=(r.t||[]).map(s=>PR.find(t=>key(t)===s)).filter(Boolean);await need(qs.map(t=>t.k));S={seed:r.d,practice:false,qs,sc:r.sc,over:true};end(true)};
  const ag=$('#again');if(ag)ag.onclick=()=>start(today()+':p'+Date.now(),true)}
window.__rg={pick,POOL,morePick};
intro();
})();
