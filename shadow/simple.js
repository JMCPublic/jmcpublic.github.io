/* Simple games engine (shadow site, 17 Nov 2026). Started as simple Rivers, approved by Jonathan 17 Nov:
   "great game play and a bit of knowledge and comment as you go... this is the level and format we go for".
   One thing lights up on a map; pick its name from three. Ten a day, the same for everyone (4 warm-ups,
   3 think-about-its, 3 clever ones), a fact after every answer, a friendly score at the end.
   Each game page sets CFG = {key, name, q, noun, intro} and loads its data.js (SG = {views, q}). */
(()=>{
const app=document.getElementById('app'),$=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
const K='s'+CFG.key;
const VIP=ls('ap-vip')==='1';  /* the owner's devices can play extra practice sets for testing */
const GAMES=[['rivers','Rivers'],['lakes','Lakes'],['bodies-of-water','Bodies of Water'],['mountains','Mountains'],['deserts','Deserts'],['forests','Forests'],['river-cities','River Cities']];
const dayRec=k=>{const raw=ls('s'+k+'-day')||'';try{const o=JSON.parse(raw);if(o&&o.d)return o}catch(e){}const p=raw.split(':');return p[0]?{d:p[0],n:+p[1]}:null};
const playedToday=k=>{const r=dayRec(k);return r&&r.d===today()?r:null};
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
function rng(seed){let h=1779033703^seed.length;for(let i=0;i<seed.length;i++){h=Math.imul(h^seed.charCodeAt(i),3432918353);h=h<<13|h>>>19}
  return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return((h^=h>>>16)>>>0)/4294967296}}
const shuffle=(a,r)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const art=a=>(CFG.the===true||(CFG.theRe&&new RegExp(CFG.theRe).test(a)))?'the ':'';
const MIX={1:4,2:3,3:3},LV={1:'Warm-up',2:'Think about it',3:'The clever one'};
function pick(seed){const r=rng(K+':'+seed);let out=[];
  for(const t of [1,2,3])out=out.concat(shuffle(SG.q.filter(q=>q.t===t),r).slice(0,MIX[t]));
  return out.map(q=>({...q,opts:shuffle([q.a,...q.w],r)}))}

/* ---------- the map ---------- */
function mapSVG(q){const v=SG.views[q.v],id='m'+Math.random().toString(36).slice(2,7),h=q.hl;
  const cp=v.clip?`clip-path="url(#c${id})"`:'';
  const grad=`<linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb37a"/><stop offset=".5" stop-color="#e2552d"/><stop offset="1" stop-color="#ff9a4d"/></linearGradient>`;
  let under='',over='';
  if(h.k==='area'){
    if(v.sea)under=`<path d="${h.d}" fill="url(#g${id})" fill-rule="evenodd"/>`;
    else over=`<path d="${h.d}" fill="url(#g${id})" fill-rule="evenodd" stroke="#ffd2b0" stroke-width="1" stroke-linejoin="round" opacity=".95"/>`}
  const extra=(v.extra||[]).map(e=>{
    if(e.k==='line'){if(h.k==='line'&&e.n===q.a)return '';return `<path d="${e.d}" fill="none" stroke="${v.rivers_white?'#fff':'#6d655a'}" stroke-width="${v.rivers_white?2.2:1.6}" stroke-linecap="round" stroke-linejoin="round" ${cp}/>`}
    if(e.k==='water'){if(e.n===q.a)return '';return `<path d="${e.d}" fill="#fff" fill-rule="evenodd"/>`}
    if(e.k==='dot')return `<circle cx="${e.xy[0]}" cy="${e.xy[1]}" r="3.2" fill="#8a8173"/>`;return ''}).join('');
  if(h.k==='line')over=`<path d="${h.d}" fill="none" stroke="#16130f" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity=".6" ${cp}/><path d="${h.d}" fill="none" stroke="url(#g${id})" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" ${cp}/>`;
  const S=Math.max(v.w,v.h)/520;  /* markers keep the same size on every map */
  if(h.k==='pt'){const[x,y]=h.xy;over+=`<circle class="pulse" cx="${x}" cy="${y}" r="${14*S}" fill="none" stroke="#e2552d" stroke-width="${3*S}"/><circle cx="${x}" cy="${y}" r="${8*S}" fill="#e2552d" stroke="#fff" stroke-width="${3*S}"/>`}
  if(h.ring){const[x,y,r]=h.ring;over+=`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#e2552d" stroke-width="${2.5*S}"/><circle class="pulse" cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#e2552d" stroke-width="${2.5*S}"/>`}
  return `<svg viewBox="${(v.vb||[0,0,v.w,v.h]).join(' ')}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Map of ${esc(v.n)} with one place highlighted"><defs><clipPath id="c${id}"><path d="${v.land}"/></clipPath>${grad}</defs>
  ${under}<path d="${v.land}" fill="#16130f"/>${extra}${over}</svg>`}

/* ---------- the game ---------- */
let S;
const back=`<a class="back" href="/shadow/wonders/">← Natural Wonders</a>`;
function start(seed,practice){S={seed,practice,qs:pick(seed),i:0,res:[],answered:false};playQ()}
function prog(){return `<div class="prog">${S.qs.map((_,k)=>`<i class="${k<S.res.length?(S.res[k]?'ok':'no'):k===S.i?'now':''}"></i>`).join('')}</div>`}
function playQ(){const q=S.qs[S.i],v=SG.views[q.v];S.answered=false;
  app.innerHTML=`<div class="top">${back}<span class="tag">${S.i+1} of ${S.qs.length}</span></div>
  ${prog()}<div class="mapcard"><span class="cname">${esc(v.n)}</span><span class="lvl">${LV[q.t]}</span>${mapSVG(q)}</div>
  <div class="q">${esc(q.qq||CFG.q)}</div><p class="clue">${esc(q.c)}</p>
  <div class="opts">${q.opts.map((o,k)=>`<button class="opt" data-o="${esc(o)}"><span class="k">${'ABC'[k]}</span>${esc(o)}</button>`).join('')}</div><div id="after"></div>`;
  app.querySelectorAll('.opt').forEach(b=>b.onclick=()=>answer(b.dataset.o));scrollTo(0,0)}
function answer(o){if(S.answered)return;S.answered=true;const q=S.qs[S.i],ok=o===q.a;S.res.push(ok);
  app.querySelectorAll('.opt').forEach(b=>{b.disabled=true;const x=b.dataset.o;b.classList.add(x===q.a?'ok':x===o?'no':'dim')});
  app.querySelector('.prog').outerHTML=prog();
  const last=S.i===S.qs.length-1;
  $('#after').innerHTML=`<div class="fact"><b class="${ok?'g':'r'}">${ok?['Yes!','Spot on.','Correct!','Nicely done.'][S.i%4]:'It’s '+art(q.a)+esc(q.a)+'.'}</b>${esc(q.f)}</div><button class="next">${last?'See my score':esc(CFG.next||'Next →')}</button>`;
  $('#after .next').onclick=()=>{if(last)end();else{S.i++;playQ()}};
  $('#after').scrollIntoView({block:'nearest',behavior:'smooth'})}
function more(){const rows=GAMES.filter(g=>g[0]!==CFG.key).map(([k,n])=>{const r=playedToday(k);
    return `<a class="mg${r?' done':''}" href="/shadow/${k}/"><img src="/icons/${k}-180.png" alt="" width="40" height="40"><b>${esc(n)}</b><span>${r?'✓ '+r.n+' / 10':'Play'}</span></a>`}).join('');
  const left=GAMES.filter(g=>g[0]!==CFG.key&&!playedToday(g[0])).length;
  return `<div class="panel more"><div class="tag">${left?'Play another today':'All done for today'}</div><p class="msub">${left?left+' more Natural Wonders game'+(left>1?'s':'')+' to play today, ten questions each.':'You’ve played every Natural Wonders game today. Brilliant. New sets at midnight.'}</p><div class="mgs">${rows}</div></div>`}
function verdict(n){return n===10?'Perfect! 🏆':n>=8?'Brilliant. You really know your '+CFG.noun+'.':n>=6?'Nicely done, a solid score.':n>=4?'Not bad! The clever ones are clever for everyone.':'A tough set today. Tomorrow brings ten fresh '+CFG.noun+'.'}
function end(rev){const n=S.res.filter(Boolean).length;let best=+ls(K+'-best')||0;const newBest=!S.practice&&n>best;if(newBest){best=n;ls(K+'-best',String(n))}
  if(!S.practice)ls(K+'-day',JSON.stringify({d:S.seed,n,res:S.res,a:S.qs.map(q=>q.a),v:S.qs.map(q=>q.v)}));
  const share=`${CFG.name} · twominute.games\n${S.res.map(x=>x?'🟩':'🟥').join('')} ${n}/10`;
  app.innerHTML=`<div class="top">${back}<span class="tag">${rev?'Today’s set · played':S.practice?'Practice set':'Today'}</span></div>
  <div class="panel"><div class="tag">Your score</div><div class="big">${n}<small> / 10</small></div><p class="verdict">${verdict(n)}</p>
  <div class="dots">${S.res.map(x=>`<i class="${x?'ok':'no'}"></i>`).join('')}</div>
  <p class="best">${rev?'You’ve played today’s set. A new one is ready at midnight.':newBest?'🎉 Your best score yet':best?'Your best: '+best+' / 10':''}</p>
  <div class="list">${S.qs.map((q,k)=>`<div class="li"><i>${S.res[k]?'✅':'❌'}</i><div><b>${esc(q.a)}</b> <span>· ${esc(SG.views[q.v].n)}</span></div></div>`).join('')}</div>
  <div class="btns"><button class="btn" id="share">Share my score</button></div>
  <p class="small">Ten new ${esc(CFG.noun)} tomorrow, the same for everyone.</p></div>${more()}${VIP?'<div class="btns"><button class="btn ghost" id="again">Practice set (owner only)</button></div>':''}`;
  $('#share').onclick=async()=>{try{if(navigator.share){await navigator.share({text:share+'\nhttps://twominute.games/'})}else{await navigator.clipboard.writeText(share+'\nhttps://twominute.games/');$('#share').textContent='Copied ✓'}}catch(e){}};
  const ag=$('#again');if(ag)ag.onclick=()=>start(today()+':p'+Date.now(),true);scrollTo(0,0)}
function review(r){S={seed:r.d,practice:true,qs:r.a.map((a,i)=>({a,v:r.v[i]})),res:r.res};end(true)}
function intro(){const r=playedToday(CFG.key);if(r&&r.res&&!VIP){review(r);return}const done=r?[r.d,r.n]:[];const played=!!r;
  app.innerHTML=`<div class="top">${back}</div>
  <div class="panel intro"><div class="ttl"><span class="tag">Natural Wonders · simple</span></div><h2>${esc(CFG.name)}</h2>
  <p>${esc(CFG.intro)}</p>
  <ul><li>Ten ${esc(CFG.noun)}, about two minutes</li><li>Starts easy, ends with a couple of clever ones</li><li>A fact about every one</li></ul>
  <div class="btns"><button class="btn" id="go">${played?'Play again (today’s set)':'Start'}</button>${played?`<p class="best" style="text-align:center">Today you scored ${done[1]} / 10</p>`:''}</div></div>`;
  $('#go').onclick=()=>start(today(),played)}
window.__simple={mapSVG,pick};
intro();
})();
