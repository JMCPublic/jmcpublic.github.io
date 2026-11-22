/* twominute.games listening-game engine (live 17 Nov 2026; dark home-page look approved by Jonathan the same day). Shared by Name That Classic and What's That Noise.
   Each page sets window.CFG = {key, name, kicker, intro, bullets, q, clue, per, mix, noun, items, verdicts, tomorrow, next, other}
   and every item = {t: 1|2|3, n: name, c?: sub-line, f: fact, w?: [two wrong answers], p: A => seconds (plays the sound)}.
   The day's set is the same for everyone (seeded by date); one go a day; a fact after every answer. */
(()=>{
const CFG=window.CFG,PER=CFG.per,K='l'+CFG.key;
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
const dk=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const today=()=>dk(new Date());
const dateTxt=()=>{try{return new Date().toLocaleDateString(navigator.language||'en-GB',{weekday:'short',day:'numeric',month:'short'})}catch(e){return 'Today'}};
function rng(seed){let h=1779033703^seed.length;for(let i=0;i<seed.length;i++){h=Math.imul(h^seed.charCodeAt(i),3432918353);h=h<<13|h>>>19}
  return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return((h^=h>>>16)>>>0)/4294967296}}
const shuffle=(a,r)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const PRACTICE_OK=ls('ap-vip')==='1'||location.hash==='#practice';  /* the owner's devices (VIP) can play extra practice sets */
document.documentElement.classList.add('tmgdark');
const LV=['Warm-up','Think about it','The clever one'],RIGHT=['Yes!','Spot on.','Correct!','Nicely done.'];

/* ---------- sound kit: everything is made live in the browser, no recordings ---------- */
let ctx,out,an,nbuf,live=[],endT;
function audio(){if(ctx){if(ctx.state==='suspended')ctx.resume();return}
  ctx=new(window.AudioContext||window.webkitAudioContext)();out=ctx.createGain();out.gain.value=.6;an=ctx.createAnalyser();an.fftSize=256;
  const len=ctx.sampleRate*2.2,ir=ctx.createBuffer(2,len,ctx.sampleRate);
  for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3)}
  const rv=ctx.createConvolver();rv.buffer=ir;const wet=ctx.createGain();wet.gain.value=.22;
  out.connect(an);an.connect(ctx.destination);out.connect(rv);rv.connect(wet);wet.connect(ctx.destination);
  nbuf=ctx.createBuffer(1,ctx.sampleRate*3,ctx.sampleRate);const nd=nbuf.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1}
function env(g,t,d,G,a,r){a=Math.min(a,d*.5);r=Math.min(r,d-a);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(G,t+a);
  g.gain.setValueAtTime(G,t+d-r);g.gain.exponentialRampToValueAtTime(.0001,t+d)}
function lfo(t,d,rate,depth,param){const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=rate;g.gain.value=depth;o.connect(g);g.connect(param);o.start(t);o.stop(t+d+.05);live.push(o)}
function chain(src,t,d,o){let node=src;
  if(o.lp){const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=o.lp;node.connect(f);node=f}
  const g=ctx.createGain();env(g,t,d,o.g==null?.3:o.g,o.a==null?.01:o.a,o.r==null?Math.min(.15,d*.5):o.r);node.connect(g);node=g;
  if(o.am){const m=ctx.createGain();m.gain.value=1-o.am[1];lfo(t,d,o.am[0],o.am[1],m.gain);node.connect(m);node=m}
  node.connect(o.dest||out)}
const A={
  get t(){return ctx.currentTime+.08},
  tone(f,t,d,o={}){const s=ctx.createOscillator();s.type=o.type||'sine';s.frequency.setValueAtTime(f,t);
    if(o.f2)s.frequency[o.lin?'linearRampToValueAtTime':'exponentialRampToValueAtTime'](o.f2,t+(o.gt||d));
    if(o.vib)lfo(t,d,o.vib[0],o.vib[1],s.frequency);chain(s,t,d,o);s.start(t);s.stop(t+d+.05);live.push(s)},
  noise(t,d,o={}){const s=ctx.createBufferSource();s.buffer=nbuf;s.loop=true;const f=ctx.createBiquadFilter();f.type=o.ft||'bandpass';
    f.frequency.setValueAtTime(o.f||1000,t);f.Q.value=o.q||1;if(o.f2)f.frequency.exponentialRampToValueAtTime(o.f2,t+(o.gt||d));
    s.connect(f);chain(f,t,d,o);s.start(t,Math.random()*2);s.stop(t+d+.05);live.push(s)},
  bell(f,t,d,g=.25,parts=[[1,1],[2.76,.45],[5.4,.25],[8.9,.12]]){parts.forEach(([m,v])=>A.tone(f*m,t,d/Math.sqrt(m),{g:g*v,a:.003,r:d*.9/Math.sqrt(m)}))},
  hz(n){const m=n.match(/^([A-G])(#|b)?(\d)$/),b={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]];return 440*Math.pow(2,((+m[3]+1)*12+b+(m[2]==='#'?1:m[2]==='b'?-1:0)-69)/12)},
  piano(f,t,d){const s=ctx.createOscillator();s.setPeriodicWave(A._pw||(A._pw=ctx.createPeriodicWave(new Float32Array(8),new Float32Array([0,1,.45,.22,.12,.06,.03,.015]))));
    s.frequency.value=f;const g=ctx.createGain(),ring=Math.min(Math.max(d*1.6,.35),2.4);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.5,t+.008);
    g.gain.exponentialRampToValueAtTime(.18,t+.12);g.gain.exponentialRampToValueAtTime(.0008,t+ring);s.connect(g);g.connect(out);s.start(t);s.stop(t+ring+.05);live.push(s)},
  melody(m,bpm,voice){const spb=60/bpm,t0=A.t;let t=t0;m.forEach(([p,b])=>{const d=b*spb;if(p!=='R')(voice||A.piano)(A.hz(p),t,d);t+=d});return t-t0+.4}
};
window.A=A;
function stop(){live.forEach(o=>{try{o.stop()}catch(e){}});live=[];clearTimeout(endT)}
function play(item,done){audio();stop();const dur=item.p(A);endT=setTimeout(done,dur*1000+250)}
/* the halo breathes with the sound */
(function meter(){const b=$('#pb');if(b&&an){const d=new Uint8Array(an.fftSize);an.getByteTimeDomainData(d);let s=0;for(const v of d){const x=(v-128)/128;s+=x*x}
  const lvl=Math.min(1,Math.sqrt(s/d.length)*4);b.style.setProperty('--lvl',lvl.toFixed(3));
  const f=new Uint8Array(an.frequencyBinCount);an.getByteFrequencyData(f);document.querySelectorAll('#bars span').forEach((e,i)=>e.style.height=(4+f[i*3+2]/255*22)+'px')}
  requestAnimationFrame(meter)})();

/* ---------- today's set ---------- */
function pick(seed){const r=rng(K+':'+seed);let out=[];
  for(const t of [1,2,3])out=out.concat(shuffle(CFG.items.filter(x=>x.t===t),r).slice(0,CFG.mix[t]));
  return out.map(a=>{const w=a.w?a.w.map(n=>({n})):shuffle(CFG.items.filter(x=>x!==a&&(!a.c||x.c!==a.c)),r).slice(0,2);return {a,opts:shuffle([a,...w],r)}})}
const dayRec=()=>{try{const o=JSON.parse(ls(K+'-day')||'null');return o&&o.d===today()?o:null}catch(e){return null}};
function record(n){const st=JSON.parse(ls(K+'-st')||'null')||{played:0,streak:0,last:''};const y=new Date();y.setDate(y.getDate()-1);
  st.streak=st.last===dk(y)?st.streak+1:st.last===today()?st.streak:1;st.last=today();st.played++;ls(K+'-st',JSON.stringify(st));ls(K+'-done-'+today(),String(n));ls(K+'-streak',JSON.stringify({n:st.streak,last:today()}))}

/* ---------- page shell ---------- */
const brand=`<a class="brand" href="/"><span class="o"></span>twominute<span class="tld">.games</span></a>`;
const top=extra=>`<div class="top">${brand}<span class="tr"><span class="datep">${esc(extra||dateTxt())}</span><a class="tmghome" href="/" aria-label="${esc(window.tmgHomeLabel||'All games')}" title="${esc(window.tmgHomeLabel||'All games')}">${window.TMG_HOUSE||''}</a></span></div>`;
/* round home button (shared/homebtn.js): its icon arrives once that script has run; it asks before leaving mid-game */
addEventListener('DOMContentLoaded',()=>document.querySelectorAll('.tmghome').forEach(a=>{if(!a.innerHTML.trim())a.innerHTML=window.TMG_HOUSE||''}));
window.tmgMidGame=()=>!!(S&&!S.done);
const gameCard=g=>`<a class="mg" href="${g.href}">${g.img?`<img class="ic im" src="${g.img}" alt="">`:`<span class="ic">${g.e}</span>`}<span class="t"><b>${esc(g.n)}</b><small>${esc(g.d)}</small></span><span class="pill">Play</span></a>`;
const OTHERS=[CFG.other,{e:'🔍',n:'Aperture',d:'An everyday object through tiny viewpoints.',href:'/aperture/',img:'/icons/aperture-180.png?v=3'},{e:'🌍',n:'Natural Wonders',d:'Rivers, lakes, peaks and deserts.',href:'/wonders/',img:'/icons/natural-wonders-180.png?v=3'}];
document.body.insertAdjacentHTML('afterbegin',`<div class="bg" aria-hidden="true"><div class="glow"></div></div>
<div class="shell"><aside class="side l"><div class="sc"><span class="tag">Have you tried</span>${gameCard(OTHERS[0])}</div><div class="sc" id="stL"></div></aside>
<main id="app"></main>
<aside class="side r"><div class="sc" id="stR"></div><div class="sc"><span class="tag">Have you tried</span>${gameCard(OTHERS[1])}</div></aside></div>`);
const app=$('#app');
function sides(){const st=JSON.parse(ls(K+'-st')||'null')||{played:0,streak:0},r=dayRec();
  $('#stL').innerHTML=`<span class="tag">Your stats</span><div class="stat">Played<b>${st.played}</b></div><div class="stat">Best<b>${ls(K+'-best')||'–'}${ls(K+'-best')?' / '+PER:''}</b></div><div class="stat">Streak<b>🔥 ${st.streak}</b></div>`;
  $('#stR').innerHTML=`<span class="tag">Today</span><div class="stat">${esc(dateTxt())}<b>${r?r.n+' / '+PER+' ✓':'Not played'}</b></div><div class="stat" style="border-top:1px solid var(--line);display:block">Next set in<div class="cd" id="cd"></div></div>`;tick()}
function tick(){const e=$('#cd');if(!e)return;const n=new Date(),m=new Date(n);m.setHours(24,0,0,0);let s=Math.floor((m-n)/1000);
  e.textContent=[Math.floor(s/3600),Math.floor(s%3600/60),s%60].map(x=>String(x).padStart(2,'0')).join(':')}
setInterval(tick,1000);

/* ---------- screens ---------- */
let S;
function start(seed,practice){audio();S={seed,practice,qs:pick(seed),res:[],i:0};playQ()}
function playQ(){const q=S.qs[S.i],last=S.i===PER-1;
  app.innerHTML=`${top(S.practice?'Practice set':'')}
  <div class="prog">${S.qs.map((_,k)=>`<i class="${k<S.i?(S.res[k]?'ok':'no'):k===S.i?'now':''}"></i>`).join('')}</div>
  <div class="mcard"><span class="cname">${S.i+1} of ${PER}</span><span class="lvl">${LV[q.a.t-1]}</span>
    <button class="pbtn" id="pb" aria-label="Play the sound"><span class="ring"></span><span class="ring b"></span><span id="pi">▶</span></button>
    <div class="bars" id="bars">${'<span></span>'.repeat(16)}</div><div class="mhint" id="mh">Tap to play</div></div>
  <p class="q">${esc(CFG.q)}</p><p class="clue">${esc(CFG.clue)}</p>
  <div class="opts">${q.opts.map((o,k)=>`<button class="opt" data-k="${k}"><span class="k">${'ABC'[k]}</span><span>${esc(o.n)}${o.c?`<span class="c">${esc(o.c)}</span>`:''}</span></button>`).join('')}</div>
  <div id="after"></div>`;
  const pb=$('#pb'),go=()=>{pb.classList.add('on');$('#pi').textContent='♪';$('#mh').textContent='Listening…';
    play(q.a,()=>{pb.classList.remove('on');$('#pi').textContent='↻';$('#mh').textContent='Tap to hear it again'})};
  pb.onclick=go;go();
  document.querySelectorAll('.opt').forEach(b=>b.onclick=()=>answer(+b.dataset.k,last))}
function answer(k,last){const q=S.qs[S.i],ok=q.opts[k]===q.a;S.res.push(ok);
  document.querySelectorAll('.opt').forEach((b,j)=>{b.disabled=true;b.classList.add(q.opts[j]===q.a?'ok':j===k?'no':'dim')});
  const p=$('.prog i.now');if(p)p.className=ok?'ok':'no';
  $('#after').innerHTML=`<div class="fact"><b class="${ok?'g':'r'}">${esc(ok?RIGHT[Math.floor(Math.random()*4)]:`It’s ${q.a.n}${q.a.c?' ('+q.a.c+')':''}.`)}</b>${esc(q.a.f)}</div>
  <button class="btn next">${last?'See my score':esc(CFG.next)}</button>`;
  $('#after .next').onclick=()=>{if(last)end();else{S.i++;playQ()}};
  $('#after').scrollIntoView({block:'nearest',behavior:'smooth'})}
const verdict=n=>{const r=n/PER;return CFG.verdicts[r===1?0:r>=.8?1:r>=.6?2:r>=.4?3:4]};
function end(rev){stop();S.done=true;const n=S.res.filter(Boolean).length;let best=+ls(K+'-best')||0;const newBest=!S.practice&&!rev&&n>best;
  if(newBest){best=n;ls(K+'-best',String(n))}
  if(!S.practice&&!rev){ls(K+'-day',JSON.stringify({d:S.seed,n,res:S.res}));record(n);setTimeout(()=>{try{dispatchEvent(new Event('tmg:gameover'))}catch(e){}},0)}
  const share=`${CFG.name} · twominute.games\n${S.res.map(x=>x?'🟩':'🟥').join('')} ${n}/${PER}`;
  app.innerHTML=`${top(S.practice&&!rev?'Practice set':'')}
  <div class="panel" style="margin-top:22px"><span class="tag">Your score</span><div class="big">${n}<small> / ${PER}</small></div><p class="verdict">${esc(verdict(n))}</p>
  <div class="dots">${S.res.map(x=>`<i class="${x?'ok':'no'}"></i>`).join('')}</div>
  <p class="best">${rev?'You’ve played today’s set. A new one is ready at midnight.':newBest?'🎉 Your best score yet':best?`Your best: ${best} / ${PER}`:''}</p>
  <div class="list">${S.qs.map((q,k)=>`<div class="li"><i>${S.res[k]?'✅':'❌'}</i><div><b>${esc(q.a.n)}</b>${q.a.c?` <span>· ${esc(q.a.c)}</span>`:''}</div><button class="re" data-k="${k}" aria-label="Hear it again">▶</button></div>`).join('')}</div>
  <div class="btns"><button class="btn" id="share">Share my score</button></div>
  <p class="small">${esc(CFG.tomorrow)}</p></div>
  <div class="panel more"><span class="tag">Play another today</span>${OTHERS.map(gameCard).join('')}</div>
  ${PRACTICE_OK?'<div class="btns"><button class="btn ghost" id="again">Practice set (owner only)</button></div>':''}`;
  $('#share').onclick=async()=>{try{if(navigator.share){await navigator.share({text:share+'\nhttps://twominute.games/'})}else{await navigator.clipboard.writeText(share+'\nhttps://twominute.games/');$('#share').textContent='Copied ✓'}}catch(e){}};
  document.querySelectorAll('.li .re').forEach(b=>b.onclick=()=>play(S.qs[+b.dataset.k].a,()=>{}));
  const ag=$('#again');if(ag)ag.onclick=()=>start(today()+':p'+Date.now(),true);sides();scrollTo(0,0)}
function intro(){const r=dayRec(),played=!!r;
  app.innerHTML=`${top()}<div class="hero">${CFG.icon?`<img class="gicon" src="${CFG.icon}" alt="">`:''}<span class="tag">${esc(CFG.kicker)}</span><h1>${esc(CFG.name)}</h1><p>${esc(CFG.intro)}</p></div>
  <div class="panel"><ul>${CFG.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}</ul>
  <div class="btns">${played?`<p class="best" style="text-align:center;margin:0">Today you scored ${r.n} / ${PER}</p>`:''}
   <button class="btn" id="go">${played?'Admire my score':'Start'}</button>
   ${PRACTICE_OK?'<button class="btn ghost" id="again">Practice set (owner only)</button>':''}</div>
  <p class="small">Sound on 🔊</p></div>`;
  $('#go').onclick=()=>{if(!played)start(today(),false);else{S={seed:r.d,practice:false,qs:pick(r.d),res:r.res};end(true)}};
  const ag=$('#again');if(ag)ag.onclick=()=>start(today()+':p'+Date.now(),true);sides()}
intro();
})();
