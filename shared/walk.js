/* twominute.games first-play walkthrough (v1, 7 Nov 2026)
   Shown once per game on each device. Aperture games: welcome + 4 tips before the clock starts.
   Natural Wonders: a "Play now" card instead of the settings wall, then one tip on the first question with the clock paused.
   ?walk=1 shows it again. Counts go to the reach docs under walk.<game>_<event>. */
(()=>{
if(window.tmgWalk)return; /* loaded twice (page tag and reach.js) */
const D=document,H=D.documentElement,P=location.pathname;
if(/\/(duggen|aperture\/stats|where|about)(\/|$)/.test(P))return;
const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
const force=/[?&]walk=1/.test(location.search);
const coarse=matchMedia('(pointer:coarse)').matches;
const lang=(H.lang||'en').slice(0,2);
const T={
 en:{first:'First time here?',play:'Play now',settings:'Change settings',got:'Got it',next:'Next',skip:'Skip tips',
     tipT:'Your first question',tipB:'Read the question at the top, then tap your answer. The clock waits until you tap Got it.',
     wibT:'Tap A or B',wibB:"Go with your gut. Don't trust the shapes: each one is stretched to fill its box. The clock waits until you tap Got it.",
     wofT:'Tick every bigger one',wofB:"Tick each country that's bigger than the one to beat, then lock in. Shapes aren't drawn to scale. The clock waits until you tap Got it."},
 de:{first:'Zum ersten Mal hier?',play:'Jetzt spielen',settings:'Einstellungen ändern',got:'Verstanden',next:'Weiter',skip:'Tipps überspringen',
     tipT:'Deine erste Frage',tipB:'Lies die Frage oben und tippe dann auf deine Antwort. Die Uhr wartet, bis du auf „Verstanden“ tippst.',
     wibT:'Tippe auf A oder B',wibB:'Hör auf dein Bauchgefühl. Trau den Umrissen nicht: Jeder ist gestreckt, um sein Feld zu füllen. Die Uhr wartet, bis du auf „Verstanden“ tippst.'},
 tr:{first:'İlk kez mi buradasın?',play:'Hemen oyna',settings:'Ayarları değiştir',got:'Anladım',next:'İleri',skip:'İpuçlarını geç',
     tipT:'İlk sorun',tipB:'Üstteki soruyu oku, sonra cevabına dokun. Sen "Anladım"a dokunana kadar süre bekler.',
     wibT:"A'ya ya da B'ye dokun",wibB:'İçgüdüne güven. Şekillere aldanma: her biri kutusunu dolduracak şekilde esnetildi. Sen "Anladım"a dokunana kadar süre bekler.'},
 fr:{first:'Première visite ?',play:'Jouer maintenant',settings:'Modifier les réglages',got:'Compris',next:'Suivant',skip:'Passer',
     tipT:'Votre première question',tipB:'Lisez la question en haut, puis touchez votre réponse. Le chrono attend que vous touchiez « Compris ».',
     wibT:'Touchez A ou B',wibB:'Fiez-vous à votre instinct. Ne croyez pas les formes : chacune est étirée pour remplir sa case. Le chrono attend que vous touchiez « Compris ».'},
 es:{first:'¿Primera vez aquí?',play:'Jugar ahora',settings:'Cambiar ajustes',got:'Entendido',next:'Siguiente',skip:'Saltar',
     tipT:'Tu primera pregunta',tipB:'Lee la pregunta de arriba y toca tu respuesta. El reloj espera hasta que toques «Entendido».',
     wibT:'Toca A o B',wibB:'Fíate de tu instinto. No te fíes de las formas: cada una se estira para llenar su recuadro. El reloj espera hasta que toques «Entendido».'},
 pt:{first:'Primeira vez aqui?',play:'Jogar agora',settings:'Mudar configurações',got:'Entendi',next:'Próximo',skip:'Pular',
     tipT:'Sua primeira pergunta',tipB:'Leia a pergunta no alto e toque na sua resposta. O relógio espera até você tocar em "Entendi".',
     wibT:'Toque em A ou B',wibB:'Confie no seu instinto. Não confie nas formas: cada uma é esticada para preencher o quadro. O relógio espera até você tocar em "Entendi".'}
};
const L=Object.assign({},T.en,T[lang]||{});
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* which game */
const ap=/\/aperture\//.test(P)||/\/aperture\/?$/.test(P);
const nwm=P.match(/natural-wonders-([a-z-]+)/);
const game=ap?(/landmarks/.test(P)?'landmarks':'objects'):nwm?nwm[1]:null;
if(!game)return;
const KEY='tmg-walk-'+game;
const bump=ev=>{try{window.tmgReach&&tmgReach.bump&&tmgReach.bump({[`walk.${game.replace(/-/g,'_')}_${ev}`]:1})}catch(e){}};

/* styles */
const css=`
.tw-sheetbg{position:fixed;inset:0;z-index:9990;background:rgba(14,16,22,.45);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);animation:twf .2s}
.tw-sheet{position:fixed;left:0;right:0;bottom:0;z-index:9991;margin:0 auto;max-width:520px;background:#fff;color:#16181d;border-radius:24px 24px 0 0;padding:22px 20px calc(24px + env(safe-area-inset-bottom));box-shadow:0 -10px 30px -10px rgba(0,0,0,.4);font-family:inherit;animation:twu .25s ease}
@media (min-width:700px){.tw-sheet{bottom:50%;transform:translateY(50%);border-radius:24px;animation:twf .2s}}
.tw-eb{font-size:11.5px;letter-spacing:.1em;text-transform:uppercase;font-weight:600;color:var(--blue,#2b50e0)}
.tw-nw .tw-eb{color:#c0602d}
.tw-sheet h3{font-size:24px;line-height:1.15;margin:6px 0 8px;font-weight:700;letter-spacing:-.01em}
.tw-nw h3{font-family:Georgia,'Times New Roman',serif}
.tw-sheet p{margin:0 0 16px;color:#5b606b;line-height:1.45;font-size:15px}
.tw-pills{display:flex;gap:6px;flex-wrap:wrap;margin:-4px 0 14px}.tw-pills span{font-size:12.5px;background:#f0f1f4;border-radius:999px;padding:5px 10px}
.tw-btns{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.tw-btn{border:0;border-radius:999px;background:#16181d;color:#fff;font:600 15px/1 inherit;font-family:inherit;padding:12px 22px;cursor:pointer}
.tw-lnk{background:none;border:0;color:#5b606b;font:500 14px inherit;font-family:inherit;text-decoration:underline;padding:6px;cursor:pointer}
.tw-shield{position:fixed;inset:0;z-index:9990}
.tw-spot{position:fixed;z-index:9991;border-radius:16px;box-shadow:0 0 0 9999px rgba(14,16,22,.62);outline:2.5px solid #fff;outline-offset:2px;pointer-events:none;transition:all .25s ease}
.tw-spot.none{box-shadow:none;outline:0}
.tw-dimall{position:fixed;inset:0;z-index:9990;background:rgba(14,16,22,.5)}
.tw-coach{position:fixed;z-index:9992;left:14px;right:14px;margin:0 auto;max-width:420px;background:#fff;color:#16181d;border-radius:18px;padding:14px 16px 12px;box-shadow:0 10px 30px -8px rgba(0,0,0,.5);font-family:inherit;font-size:14.5px;line-height:1.4;transition:top .25s ease}
.tw-coach .k{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--blue,#2b50e0);color:#fff;font-weight:600;font-size:13px;margin-right:6px;vertical-align:-6px}
.tw-coach b.t{font-size:16px}.tw-coach p{margin:6px 0 10px}
.tw-foot{display:flex;align-items:center;justify-content:space-between;gap:8px}
.tw-dots{display:flex;gap:5px}.tw-dots i{width:7px;height:7px;border-radius:50%;background:#d5d8de}.tw-dots i.on{background:var(--blue,#2b50e0)}
.tw-coach .tw-btn{padding:9px 18px;font-size:14px}
html.tw-on #tmgAd{display:none!important}html.tw-on.tmgad-on body{padding-bottom:0!important}
@keyframes twf{from{opacity:0}}@keyframes twu{from{transform:translateY(40px);opacity:0}}`;
const st=D.createElement('style');st.textContent=css;D.head.appendChild(st);

const waitFor=(fn,ms=15000)=>new Promise(res=>{const t0=Date.now();const iv=setInterval(()=>{const v=fn();if(v||Date.now()-t0>ms){clearInterval(iv);res(v||null)}},150)});
const union=sels=>{let r=null;for(const s of sels){D.querySelectorAll(s).forEach(e=>{if(!e.offsetParent&&getComputedStyle(e).position!=='fixed')return;const b=e.getBoundingClientRect();if(!b.width)return;
  r=r?{l:Math.min(r.l,b.left),t:Math.min(r.t,b.top),r:Math.max(r.r,b.right),b:Math.max(r.b,b.bottom)}:{l:b.left,t:b.top,r:b.right,b:b.bottom}})}return r};

function sheet(cls,html,onBuild){const bg=D.createElement('div');bg.className='tw-sheetbg';const s=D.createElement('div');s.className='tw-sheet '+cls;s.setAttribute('role','dialog');s.innerHTML=html;
  D.body.append(bg,s);const close=()=>{bg.remove();s.remove()};onBuild(s,close);return close}

/* a run of spotlight tips; steps: {sels:[..], k, t, b, last} */
function tour(steps,{onDone,onSkip,lastLabel}){
  const shield=D.createElement('div');shield.className='tw-shield';const spot=D.createElement('div');spot.className='tw-spot';const c=D.createElement('div');c.className='tw-coach';c.setAttribute('role','dialog');
  D.body.append(shield,spot,c);let i=0,alive=true;H.classList.add('tw-on');dispatchEvent(new Event('resize'));
  const end=()=>{alive=false;H.classList.remove('tw-on');setTimeout(()=>dispatchEvent(new Event('resize')),30);shield.remove();spot.remove();c.remove();removeEventListener('resize',place);removeEventListener('scroll',place,true)};
  function place(){if(!alive)return;const s=steps[i];const r=s.sels?union(s.sels):null;
    if(r){spot.classList.remove('none');const pad=4;spot.style.left=(r.l-pad)+'px';spot.style.top=(r.t-pad)+'px';spot.style.width=(r.r-r.l+pad*2)+'px';spot.style.height=(r.b-r.t+pad*2)+'px';spot.style.borderRadius=s.round||'16px'}
    else{spot.classList.add('none');spot.style.cssText='left:0;top:0;width:0;height:0'}
    shield.style.background=r?'transparent':'rgba(14,16,22,.5)';
    const ch=c.offsetHeight,vh=innerHeight;let top;
    if(!r)top=vh-ch-24;else if(r.b+12+ch<vh-8)top=r.b+12;else if(r.t-12-ch>8)top=r.t-12-ch;else top=Math.max(8,vh-ch-12);
    c.style.top=top+'px'}
  function show(){const s=steps[i];const n=steps.length;
    const dots=n>1?`<div class="tw-dots">${steps.map((_,j)=>`<i class="${j===i?'on':''}"></i>`).join('')}</div>`:'<span></span>';
    const last=i===n-1;
    c.innerHTML=`${s.k?`<span class="k">${s.k}</span>`:''}<b class="t">${s.t}</b><p>${s.b}</p><div class="tw-foot">${dots}<div>${!last&&onSkip?`<button class="tw-lnk" data-a="skip">${L.skip}</button>`:''}<button class="tw-btn" data-a="next">${last?(lastLabel||L.got):L.next}</button></div></div>`;
    const u=s.sels&&union(s.sels);
    if(u){const vh=innerHeight;if(u.b>vh-20)scrollBy(0,Math.min(u.t-110,u.b-vh+20));else if(u.t<60)scrollBy(0,u.t-110)}
    requestAnimationFrame(place);
    c.querySelector('[data-a=next]').onclick=()=>{if(i<n-1){i++;show()}else{end();onDone&&onDone()}};
    const sk=c.querySelector('[data-a=skip]');if(sk)sk.onclick=()=>{end();onSkip&&onSkip(i)}}
  addEventListener('resize',place);addEventListener('scroll',place,true);show();return end}

/* ---------------- Aperture and Aperture Landmarks ---------------- */
async function aperture(){
  const btn=await waitFor(()=>{const b=D.getElementById('startBtn');return b&&b.offsetParent&&/Round 1 of/.test((D.getElementById('overlay')||{}).textContent||'')?b:null});
  if(!btn)return;
  await new Promise(r=>setTimeout(r,500));
  ls(KEY,'1');bump('shown');
  const lm=game==='landmarks';const tap=coarse?'Tap':'Click';
  const guide=(D.querySelector('#slots .guide')||{}).textContent||'';const parts=(guide.match(/\d+/g)||[]);
  const gtxt=parts.length>1?`<b>${esc(guide)}</b> means ${parts.length} words: ${parts.join(', then ')} letters.`:parts.length?`<b>${esc(guide)}</b> means one word of ${parts[0]} letters.`:'';
  const ov=D.getElementById('overlay');
  const steps=[
    {sels:['.viewer'],k:'A',t:'The picture',b:`${lm?'A landmark':'An everyday thing'} is hiding behind these slits. More of it opens up as the clock runs. ${coarse?'Pinch or tap + to zoom.':'Scroll or click + to zoom.'}`},
    {sels:['#negThumb','.negwrap'],k:'B',t:'The negative',b:`A second clue: the same picture as a colour-flipped negative, filling in square by square over time.${D.getElementById('negThumb')?` ${tap} it to see it big.`:' Before you start, today\'s quote sits here.'}`},
    {sels:['#tray','.wordsbox','#words'],k:'C',t:coarse?'Tap words to answer':'Click words to answer',b:`${coarse?'No typing. Tap':'Click'} words in the list and they drop into the boxes${coarse?'':' (or just type)'}. ${gtxt}`},
    {sels:['#tray .row','.helpers','#skipBtn'],round:'22px',t:'Stuck?',b:'<b>Help</b> gives clues such as a first letter. <b>Skip</b> moves on to the next picture. Both add a few seconds. Five pictures; lowest total time wins.'}
  ];
  const hideOv=v=>{if(ov)ov.style.visibility=v?'hidden':''};
  sheet('',`<span class="tw-eb">${L.first}</span><h3>Guess what's hiding, in two minutes</h3><p>Four quick tips over the real game. The clock waits until you're ready.</p><div class="tw-btns"><button class="tw-btn" data-a="show">Show me</button><button class="tw-lnk" data-a="play">I'll just play</button></div>`,(s,close)=>{
    s.querySelector('[data-a=play]').onclick=()=>{close();bump('justplay')};
    s.querySelector('[data-a=show]').onclick=()=>{close();bump('show');hideOv(true);scrollTo(0,0);
      tour(steps,{lastLabel:'Ready? Start the clock',onDone:()=>{hideOv(false);bump('done');scrollTo(0,0);const b=D.getElementById('startBtn');b&&b.click()},onSkip:()=>{hideOv(false);bump('skip')}})}});
}
function apertureReplayLink(){const hc=D.querySelector('.helpcard');if(!hc||hc.querySelector('.tw-replay'))return;const b=D.createElement('button');b.className='tw-lnk tw-replay';b.textContent='Show me the quick tips';b.style.marginTop='6px';
  b.onclick=()=>{const h=D.getElementById('help');if(h)h.hidden=true;try{localStorage.removeItem(KEY)}catch(e){}aperture()};hc.appendChild(b)}

/* ---------------- Natural Wonders ---------------- */
const startBtn=()=>[...D.querySelectorAll('button.btn')].find(b=>/start(Game)?\(\)/.test(b.getAttribute('onclick')||'')&&!b.disabled&&b.offsetParent);
function pauseTimer(){try{if(typeof TM==='undefined'||!TM.iv)return null;const el=performance.now()-TM.t0;TM.stop();
  return()=>{TM.t0=performance.now()-el;TM.iv=setInterval(()=>{const l=TM.secs-(performance.now()-TM.t0)/1000;TM.draw(l);if(l<=0){TM.stop();const f=TM.onUp;TM.onUp=null;if(f)f()}},100)}}catch(e){return null}}
async function firstTip(){
  await waitFor(()=>!startBtn()&&(typeof TM==='undefined'||TM.iv||D.querySelector('.cc')),5000);
  await new Promise(r=>setTimeout(r,350));
  const resume=pauseTimer();
  const wib=game==='where-is-bigger',wof=game==='which-of-five';
  const cards=D.querySelectorAll('.cc').length?['.cc']:null;
  tour([{sels:(wib||wof)?cards:null,round:'22px',t:wib?L.wibT:wof&&lang==='en'?L.wofT:L.tipT,b:wib?L.wibB:wof&&lang==='en'?L.wofB:L.tipB}],
    {onDone:()=>{resume&&resume();bump('tip')}});
}
async function wonders(){
  const b=await waitFor(startBtn,8000);if(!b)return;
  await new Promise(r=>setTimeout(r,700));if(!startBtn())return;
  ls(KEY,'1');bump('shown');
  const h1=(D.querySelector('h1')||{}).textContent||'';const sub=(D.querySelector('p.sub')||{}).textContent||'';
  let pills=[...new Set([...D.querySelectorAll('.opt.on')].map(o=>{const f=o.querySelector('b,strong,.t')||o;return (f.firstChild&&f.firstChild.nodeType===3?f.firstChild.textContent:f.textContent).trim()}).filter(t=>t&&t.length<=16))].slice(0,3);
  if(!pills.length){const m=(startBtn().textContent||'').split(/—|-/)[1];if(m)pills=[m.trim()]}
  sheet('tw-nw',`<span class="tw-eb">${esc(L.first)}</span><h3>${esc(h1.trim())}</h3><p>${esc(sub.trim())}</p>${pills.length?`<div class="tw-pills">${pills.map(p=>`<span>${esc(p)}</span>`).join('')}</div>`:''}<div class="tw-btns"><button class="tw-btn" data-a="play">${esc(L.play)}</button><button class="tw-lnk" data-a="set">${esc(L.settings)}</button></div>`,(s,close)=>{
    s.querySelector('[data-a=set]').onclick=()=>{close();bump('settings');const sb=startBtn();if(sb)armTip()};
    s.querySelector('[data-a=play]').onclick=()=>{close();bump('playnow');const sb=startBtn();if(sb){sb.click();bump('play');firstTip()}}});
}
/* chose settings first: still give the one tip when they press Start */
function armTip(){const h=e=>{const b=e.target.closest&&e.target.closest('button.btn');if(!b||!/start(Game)?\(\)/.test(b.getAttribute('onclick')||''))return;D.removeEventListener('click',h,true);bump('play');setTimeout(firstTip,50)};D.addEventListener('click',h,true)}

/* go */
const run=()=>{
  if(ap){apertureReplayLink();const hb=D.getElementById('helpBtn');if(hb)hb.addEventListener('click',()=>setTimeout(apertureReplayLink,50))}
  if(ls(KEY)&&!force)return;
  if(ap)aperture();else wonders();
};
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',run);else run();
window.tmgWalk={replay:()=>{try{localStorage.removeItem(KEY)}catch(e){}ap?aperture():wonders()}};
})();
