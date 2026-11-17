/* twominute.games background music (v1, 11 Nov 2026; v2 15 Nov: ♫ on every screen; v3 17 Nov: one tap on ♫ turns music off or on; the ⓘ beside it, or the Now playing line, opens the card)
   Natural Wonders games: a quiet classical loop, OFF until the player chooses it (17 Nov, Jonathan; was on by default), starting on the player's first tap
   (browsers don't allow sound before that). A ♫ button in the game header turns it off/on (remembered on the device).
   When the music starts, a grey "Now playing" line shows under ♫ for 5 seconds; tapping it opens the Now playing card
   with the piece, performer, a fact and a link to a classical station for the player's country.
   Recordings: public domain / CC0 (Handel CC BY-SA), all credited on twominute.games/about#music. */
(()=>{
if(window.tmgMusic)return;
const D=document,P=location.pathname,m=P.match(/natural-wonders-([a-z-]+)/)||(window.TMG_GAME?[0,window.TMG_GAME]:null); /* simple games name themselves (17 Nov) */
/* Aperture and Landmarks play their own music (in the page) under their own ♫ button; here they only get the Now playing line and card */
const AP=/^\/aperture\//.test(P)&&!/\/stats\//.test(P);
if(!m&&!AP)return;
const GAME=AP?(/\/landmarks\//.test(P)?'landmarks':'aperture'):m[1];
const T={
 'lakes':{f:'lakes',t:'Swan Lake',c:'Pyotr Ilyich Tchaikovsky, 1876',p:'Act II scene',fact:'🦢 The ballet’s heroine is a princess turned into a swan, who can only be human at night by the lake.'},
 'deserts':{f:'deserts',t:'In the Steppes of Central Asia',c:'Alexander Borodin, 1880',p:'Musopen Symphony Orchestra',fact:'🐫 A caravan crosses the empty steppe, guarded by soldiers, and fades into the distance.'},
 'masterbrain':{f:'masterbrain',t:'Air on the G String',c:'Johann Sebastian Bach, about 1730',p:'United States Air Force Band, Air Force Strings',fact:'🎻 Its nickname comes from an 1871 arrangement that let a violinist play the whole tune on one string.'},
 'rivers':{f:'rivers',t:'Vltava (The Moldau)',c:'Bedřich Smetana, 1874',p:'Musopen Symphony Orchestra',fact:'🌊 The music follows the river Vltava from its two springs in the Bohemian forest to Prague.',fact_es:'🌊 La música sigue el río Moldava desde sus dos manantiales en el bosque de Bohemia hasta Praga.',fact_pt:'🌊 A música acompanha o rio Moldava desde suas duas nascentes na floresta da Boêmia até Praga.',fact_fr:'🌊 La musique suit la Vltava depuis ses deux sources dans la forêt de Bohême jusqu’à Prague.',fact_de:'🌊 Die Musik folgt der Moldau von ihren zwei Quellen im Böhmerwald bis nach Prag.',fact_tr:'🌊 Müzik, Vltava nehrini Bohemya ormanındaki iki kaynağından Prag’a kadar izler.'},
 'river-cities':{f:'river-cities',t:'The Blue Danube',c:'Johann Strauss II, 1866',p:'European Archive',fact:'🏙️ The waltz that became Vienna’s unofficial anthem, named after the river that runs through the city.'},
 'bodies-of-water':{f:'bodies-of-water',t:'Water Music, Air',c:'George Frideric Handel, 1717',p:'CC BY-SA 3.0, see About page',fact:'⛵ First played on a barge on the River Thames for King George I, who asked to hear it three times.'},
 'mountains':{f:'mountains',t:'Morning Mood (Peer Gynt)',c:'Edvard Grieg, 1875',p:'Musopen Symphony Orchestra',fact:'🌄 A sunrise in music, written for Ibsen’s play Peer Gynt.'},
 'forests':{f:'forests',t:'Pastoral Symphony, Scene by the brook',c:'Ludwig van Beethoven, 1808',p:'Musopen',fact:'🐦 Near the end, the woodwinds imitate a nightingale, a quail and a cuckoo.'},
 'where-is-bigger':{f:'world',t:'New World Symphony, Largo',c:'Antonín Dvořák, 1893',p:'Musopen',fact:'🌎 Written in America by a Czech composer, missing home. Its tune later became the song “Goin’ Home”.'}
};
T.aperture={f:'aperture',t:'Gymnopédie No. 1',c:'Erik Satie, 1888',p:'Michael Laucke, guitar',fact:'🎹 Satie wrote his three Gymnopédies at 22, while playing piano in a Montmartre cabaret.',fact_de:'🎹 Satie schrieb seine drei Gymnopédies mit 22, als er in einem Kabarett am Montmartre Klavier spielte.',p_de:'Michael Laucke, Gitarre',fact_tr:'🎹 Satie üç Gymnopédie’sini 22 yaşında, Montmartre’da bir kabarede piyano çalarken yazdı.',p_tr:'Michael Laucke, gitar',fact_fr:'🎹 Satie a écrit ses trois Gymnopédies à 22 ans, quand il était pianiste dans un cabaret de Montmartre.',p_fr:'Michael Laucke, guitare',fact_es:'🎹 Satie escribió sus tres Gymnopédies a los 22 años, cuando tocaba el piano en un cabaré de Montmartre.',p_es:'Michael Laucke, guitarra',fact_pt:'🎹 Satie escreveu suas três Gymnopédies aos 22 anos, quando tocava piano num cabaré de Montmartre.',p_pt:'Michael Laucke, violão'};
T.landmarks={f:'landmarks',t:'Clair de lune',c:'Claude Debussy, 1905',p:'Laurens Goedhart, piano',fact:'🌙 Its name means “moonlight”, after a poem by Paul Verlaine.',fact_de:'🌙 Der Name bedeutet „Mondschein“, nach einem Gedicht von Paul Verlaine.',p_de:'Laurens Goedhart, Klavier',fact_tr:'🌙 Adı “ay ışığı” demek; Paul Verlaine’in bir şiirinden geliyor.',p_tr:'Laurens Goedhart, piyano',fact_fr:'🌙 Son nom vient d’un poème de Paul Verlaine.',p_fr:'Laurens Goedhart, piano',fact_es:'🌙 Su nombre significa “claro de luna”, por un poema de Paul Verlaine.',p_es:'Laurens Goedhart, piano',fact_pt:'🌙 O nome quer dizer “luar”, por causa de um poema de Paul Verlaine.',p_pt:'Laurens Goedhart, piano'};
T['which-of-five']=T['how-many-borders']=T['where-is-bigger'];
const tr=T[GAME];
const READY=['aperture','landmarks','lakes','deserts','masterbrain','rivers','river-cities','bodies-of-water','forests','world','mountains']; /* recordings uploaded so far; the rest are added as they arrive */
if(!tr||!READY.includes(tr.f))return;
const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
const lang=(D.documentElement.lang||'en').slice(0,2);
const L={en:['Now playing','For more like this, try','Listen','Music on','Music off','Turn music off','Turn music on','Close','tap for more','Music? Tap here to turn it on'],
 de:['Jetzt läuft','Mehr davon gibt es bei','Anhören','Musik an','Musik aus','Musik ausschalten','Musik einschalten','Schließen','für mehr tippen','Musik? Hier tippen zum Einschalten'],
 tr:['Şimdi çalıyor','Benzerleri için:','Dinle','Müzik açık','Müzik kapalı','Müziği kapat','Müziği aç','Kapat','daha fazlası için dokun','Müzik? Açmak için buraya dokun'],
 fr:['En ce moment','Pour en écouter davantage :','Écouter','Musique activée','Musique coupée','Couper la musique','Activer la musique','Fermer','touchez pour en savoir plus','De la musique ? Touchez ici pour l’activer'],
 es:['Suena ahora','Para escuchar más, prueba','Escuchar','Música activada','Música desactivada','Apagar la música','Encender la música','Cerrar','toca para saber más','¿Música? Toca aquí para encenderla'],
 pt:['Tocando agora','Para ouvir mais, experimente','Ouvir','Música ligada','Música desligada','Desligar a música','Ligar a música','Fechar','toque para saber mais','Música? Toque aqui para ligar']}[lang]||null;
const W=L||['Now playing','For more like this, try','Listen','Music on','Music off','Turn music off','Turn music on','Close','tap for more','Music? Tap here to turn it on'];
/* station by country (from the time zone, via reach.js) */
const ST={def:['Classic FM','https://www.classicfm.com/'],
 DE:['Klassik Radio','https://www.klassikradio.de/'],AT:['Klassik Radio','https://www.klassikradio.de/'],CH:['Klassik Radio','https://www.klassikradio.de/'],
 FR:['Radio Classique','https://www.radioclassique.fr/'],BE:['Radio Classique','https://www.radioclassique.fr/'],LU:['Radio Classique','https://www.radioclassique.fr/'],
 ES:['Radio Clásica','https://www.rtve.es/radio/radioclasica/'],PT:['Antena 2','https://antena2.rtp.pt/'],BR:['Cultura FM','https://cultura.uol.com.br/radio/'],
 TR:['TRT Radyo 3','https://www.trtdinle.com/channel/radyo-3-klasik-caz-rock-pop-ve-dunya-muzigi'],IT:['Rai Radio 3','https://www.raiplaysound.it/radio3'],
 NL:['NPO Klassiek','https://www.npoklassiek.nl/'],SE:['Sveriges Radio P2','https://www.sverigesradio.se/kanaler/p2'],NO:['NRK Klassisk','https://radio.nrk.no/direkte/klassisk'],
 DK:['DR P2','https://www.dr.dk/lyd/p2'],PL:['Dwójka (Polskie Radio)','https://www.polskieradio.pl/8,dwojka'],RO:['Radio România Muzical','https://www.romania-muzical.ro/'],
 IE:['RTÉ lyric fm','https://www.rte.ie/radio/lyricfm/'],US:['WQXR','https://www.wqxr.org/'],AU:['ABC Classic','https://www.abc.net.au/listen/classic'],
 NZ:['RNZ Concert','https://www.rnz.co.nz/concert'],MX:['Opus 94','https://www.imer.mx/opus/']};
const cc=()=>{try{return (window.tmgReach&&tmgReach.cc&&tmgReach.cc())||''}catch(e){return ''}};
const bump=ev=>{try{window.tmgReach&&tmgReach.bump&&tmgReach.bump({[`walk.music_${ev}`]:1})}catch(e){}};
const css=`.tmgmus{width:32px;height:32px;border-radius:50%;border:1.5px solid rgba(0,0,0,.18);background:rgba(255,255,255,.7);display:inline-grid;place-items:center;font-size:15px;line-height:1;color:#b4552a;cursor:pointer;padding:0;margin-right:6px;vertical-align:middle;flex:none}
.tmgmus.off{color:#9aa0a6;text-decoration:line-through}
.tmgmusi{width:26px;height:26px;border-radius:50%;border:1.5px solid rgba(0,0,0,.15);background:rgba(255,255,255,.7);display:inline-grid;place-items:center;font:700 13px/1 Georgia,serif;font-style:italic;color:#6f685d;cursor:pointer;padding:0;margin-right:6px;vertical-align:middle;flex:none}
.tmgmusi.h1b{width:30px;height:30px;margin:0 0 0 auto;background:#fff}
.tmgmus.float{position:fixed;top:10px;right:12px;z-index:60}#bar .tmgmus.inbar{width:32px;height:32px;border-radius:50%;border:1.5px solid rgba(255,255,255,.35);background:rgba(255,255,255,.1);color:#ffb38a;text-decoration:none;padding:0;margin:0;font-size:15px}
.tmgnp{position:fixed;z-index:61;background:#6b7078;color:#fff;font:12px/1.2 system-ui,sans-serif;border-radius:999px;padding:6px 12px;box-shadow:0 6px 16px -8px rgba(0,0,0,.45);white-space:nowrap;cursor:pointer;opacity:0;transition:opacity .3s;max-width:calc(100vw - 24px);overflow:hidden;text-overflow:ellipsis}
.tmgnp.on{opacity:1}.tmgnp i{opacity:.8;font-style:normal}
.tmgnpbg{position:fixed;inset:0;z-index:9980;background:rgba(14,16,22,.45)}
.tmgnpc{position:fixed;left:12px;right:12px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:9981;max-width:440px;margin:0 auto;background:#fff;color:#16181d;border-radius:22px;padding:18px 18px 14px;box-shadow:0 -8px 30px -10px rgba(0,0,0,.5);font:14px/1.45 system-ui,sans-serif}
.tmgnpc .eb{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#c0602d;font-weight:600;display:flex;align-items:center;gap:8px}
.tmgnpc .eq{display:inline-flex;gap:2px;align-items:flex-end;height:12px}.tmgnpc .eq b{width:3px;background:#c0602d;border-radius:1px;animation:tmgeq 1s ease-in-out infinite alternate}
.tmgnpc .eq b:nth-child(2){animation-delay:.3s}.tmgnpc .eq b:nth-child(3){animation-delay:.6s}.tmgnpc .eq b:nth-child(4){animation-delay:.15s}
@keyframes tmgeq{from{height:3px}to{height:12px}}
.tmgnpc h3{font:600 21px/1.2 Georgia,serif;margin:6px 0 2px}.tmgnpc .by{color:#5b606b;margin-bottom:10px}
.tmgnpc .fact{background:#f6f2ea;border-radius:12px;padding:10px 12px;margin-bottom:12px}
.tmgnpc .more{display:flex;align-items:center;justify-content:space-between;gap:10px;border-top:1px solid #eee6d8;padding-top:12px}
.tmgnpc .go{border:0;border-radius:999px;background:#16181d;color:#fff;font:600 13px system-ui;padding:9px 14px;text-decoration:none;white-space:nowrap}
.tmgnpc .ft{display:flex;justify-content:space-between;margin-top:10px;font-size:12.5px;color:#5b606b}
.tmgnpc .ft button{background:none;border:0;padding:0;font:inherit;color:#16181d;text-decoration:underline;cursor:pointer}
/* v2 card: a framed station panel (kept as a frame so a classical station can sponsor it later), then the music switch and Close */
.tmgnpc .stn{border:1.5px solid #e2d6c3;border-radius:14px;padding:10px 12px;display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}
.tmgnpc .acts{display:grid;grid-template-columns:1fr auto;gap:8px}
.tmgnpc .sw{border:0;border-radius:999px;padding:13px 14px;font:700 15px system-ui,sans-serif;cursor:pointer;background:#c0602d;color:#fff}
.tmgnpc .sw.on{background:#16181d}
.tmgnpc .cl{border:1.5px solid #d7cfc2;background:#fff;border-radius:999px;padding:13px 18px;font:600 15px system-ui,sans-serif;cursor:pointer;color:#16181d}
.tmgmus.float{box-shadow:0 2px 8px rgba(0,0,0,.12);background:#fff}
h1:has(>.tmgmus.h1b){display:flex;align-items:center;justify-content:space-between;gap:10px}
@keyframes tmgask{0%,100%{box-shadow:0 0 0 0 rgba(224,106,46,.55)}50%{box-shadow:0 0 0 7px rgba(224,106,46,0)}}
.tmgmus.ask,#musicBtn.ask{animation:tmgask 1.8s ease-in-out infinite;color:#e06a2e;text-decoration:none;border-color:#e06a2e}
.tmgask{position:fixed;z-index:61;background:#e06a2e;color:#fff;font:600 13px/1.2 system-ui,sans-serif;border-radius:999px;padding:8px 13px;box-shadow:0 8px 18px -8px rgba(0,0,0,.45);white-space:nowrap;cursor:pointer;opacity:0;transition:opacity .3s}.tmgask.on{opacity:1}
.tmgask::before{content:'';position:absolute;top:-5px;right:var(--ar,18px);border:6px solid transparent;border-top:0;border-bottom-color:#e06a2e}
.tmgmus.h1b{width:36px;height:36px;font-size:17px;margin:0;background:#fff;border-color:#b4552a55;flex:none}`;
const st=D.createElement('style');st.textContent=css;D.head.appendChild(st);

const audio=AP?null:new Audio(`https://twominute.games/shared/music/${tr.f}.mp3`);if(audio){audio.loop=true;audio.volume=0.35;audio.preload='none'}
let on=ls('tmg-music')==='on',started=false,shown=false;
const btns=new Set();
const isOn=()=>AP?((D.getElementById('musicBtn')||{getAttribute:()=>'true'}).getAttribute('aria-pressed')!=='false'):on;
function paint(){if(AP)return;btns.forEach(b=>{b.textContent='♫';b.classList.toggle('off',!on);b.title=on?W[3]:W[4];b.setAttribute('aria-label',on?W[3]:W[4])})}
function play(){if(!on)return;audio.play().then(()=>{started=true;if(!shown){shown=true;showLine()}}).catch(()=>{})}
function toggle(e){e&&e.stopPropagation();if(AP){const b=D.getElementById('musicBtn');if(b){window.__tmgMusBy=1;b.click();window.__tmgMusBy=0}bump(isOn()?'on':'off');return}on=!on;ls('tmg-music',on?'on':'off');bump(on?'on':'off');if(on)play();else audio.pause();paint()}
/* 17 Nov: a small ⓘ beside ♫ always opens the Now playing card (piece, composer, fact and a classical station for the player's country) */
function mkInfo(cls){const b=D.createElement('button');b.type='button';b.className='tmgmusi '+(cls||'');b.textContent='i';b.title=W[0];b.setAttribute('aria-label',W[0]);b.onclick=e=>{e.stopPropagation();hideLine();card()};return b}
function mkBtn(cls){const b=D.createElement('button');b.type='button';b.className='tmgmus '+(cls||'');b.onclick=e=>{e.stopPropagation();hideLine();toggle(e);if(on)showLine()}; /* 17 Nov: one tap turns music off or on (Paul's feedback); the grey Now playing line under ♫ opens the card */btns.add(b);paint();return b}
/* put ♫ in the game header (it is redrawn every question, so keep re-adding it) */
function place(){if(AP){const b=D.getElementById('musicBtn');if(b)btns.add(b);return}const row=D.querySelector('.top .row');if(row&&!row.querySelector('.tmgmus')){const mb=mkBtn();row.insertBefore(mb,row.firstChild);mb.after(mkInfo())}
  btns.forEach(b=>{if(!b.isConnected)btns.delete(b)});
  /* menu and results have no game bar: ♫ sits at the right-hand end of the page title, so it's on every screen without covering anything */
  const barShown=!!D.querySelector('#bar')&&getComputedStyle(D.querySelector('#bar')).display!=='none';const inbar=D.querySelector('.top .row .tmgmus')||(barShown&&D.querySelector('#bar .tmgmus.inbar'));
  if(!inbar&&window.top===window){const h=[...D.querySelectorAll('h1')].find(x=>x.offsetParent&&!x.closest('.play,.top,#bar,.tmgnpc'));if(h&&!h.querySelector('.tmgmus')){h.appendChild(mkInfo('h1b'));h.appendChild(mkBtn('h1b'))}}
  /* Masterbrain: ♫ sits in its dark top bar, just before Quit (it used to float on top of Quit) */
  if(GAME==='masterbrain'){const bar=D.querySelector('#bar .in');if(bar&&!bar.querySelector('.tmgmus')){const q=[...bar.querySelectorAll('button')].pop();bar.insertBefore(mkBtn('inbar'),q||null)}}}
new MutationObserver(place).observe(D.body,{childList:true,subtree:true});place();
/* the grey line under ♫ */
let line;
function showLine(){const b=[...btns].find(x=>x.isConnected);line=D.createElement('div');line.className='tmgnp';line.innerHTML=`♫ <b>${tr.t}</b> <i>· ${tr.c.split(',')[0].split(' ').slice(-1)[0]} · ${W[8]}</i>`;
  D.body.appendChild(line);const r=b?b.getBoundingClientRect():{bottom:48,right:innerWidth-12};
  line.style.top=(r.bottom+6)+'px';const w=line.offsetWidth;line.style.left=Math.max(12,Math.min(innerWidth-w-12,r.right-w+20))+'px';
  requestAnimationFrame(()=>line.classList.add('on'));line.onclick=()=>{hideLine();card()};setTimeout(hideLine,5000)}
function hideLine(){if(!line)return;const l=line;line=null;l.classList.remove('on');setTimeout(()=>l.remove(),350)}
/* the Now playing card */
function pauseClock(){if(AP){window.tmgHold=true;return()=>{window.tmgHold=false}}try{if(typeof TM==='undefined'||!TM.iv)return null;const el=performance.now()-TM.t0;TM.stop();
  return()=>{TM.t0=performance.now()-el;TM.iv=setInterval(()=>{const l=TM.secs-(performance.now()-TM.t0)/1000;TM.draw(l);if(l<=0){TM.stop();const f=TM.onUp;TM.onUp=null;if(f)f()}},100)}}catch(e){return null}}
function card(){bump('card');const c=cc(),s=ST[c]||ST.def;const resume=pauseClock(); /* the clock waits while the card is open */
  const bg=D.createElement('div');bg.className='tmgnpbg';const k=D.createElement('div');k.className='tmgnpc';k.setAttribute('role','dialog');
  const sw=()=>`<button class="sw ${isOn()?'on':''}" data-a="t">${isOn()?W[5]:W[6]}</button>`;
  k.innerHTML=`<div class="eb"><span class="eq"><b></b><b></b><b></b><b></b></span>${W[0]}</div><h3>${tr.t}</h3><div class="by">${tr.c} · ${tr['p_'+lang]||tr.p}</div><div class="fact">${tr['fact_'+lang]||tr.fact}</div>
  <div class="stn"><span>${W[1]} <b>${s[0]}</b></span><a class="go" href="${s[1]}" target="_blank" rel="noopener">${W[2]} ↗</a></div>
  <div class="acts">${sw()}<button class="cl" data-a="x">${W[7]}</button></div>`;
  const close=()=>{bg.remove();k.remove();resume&&resume()};bg.onclick=close;k.querySelector('[data-a=x]').onclick=close;
  k.querySelector('[data-a=t]').onclick=()=>{toggle();close()};k.querySelector('.go').onclick=()=>bump('listen_'+(c||'xx').toLowerCase());
  D.body.append(bg,k)}
/* start on the first tap anywhere (Play now counts); pause when the tab is hidden */
if(!AP){const first=()=>{D.removeEventListener('pointerdown',first,true);D.removeEventListener('keydown',first,true);play()};
D.addEventListener('pointerdown',first,true);D.addEventListener('keydown',first,true);
D.addEventListener('visibilitychange',()=>{if(D.hidden)audio.pause();else if(on&&started)audio.play().catch(()=>{})})}
/* Aperture and Landmarks: their own ♫ now opens the music card too (one tap), and the card's button does the switching */
if(AP)D.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#musicBtn');if(!b||window.__tmgMusBy)return;e.stopImmediatePropagation();e.preventDefault();hideLine();card()},true);
/* 17 Nov: music is off until chosen, so while no choice has been made ♫ pulses gently, and once a day an orange bubble
   under it invites the player to turn it on (tapping the bubble turns it on) */
const CHOICE=AP?'aperture2-music-v3':'tmg-music';
const chosen=()=>ls(CHOICE)!==null;
function askPaint(){const b=AP?D.getElementById('musicBtn'):null;const all=AP?(b?[b]:[]):[...btns];all.forEach(x=>x.classList.toggle('ask',!chosen()&&!isOn()))}
let ask=null;
function hideAsk(){if(!ask)return;const a=ask;ask=null;a.classList.remove('on');setTimeout(()=>a.remove(),350)}
const busy=()=>!![...D.querySelectorAll('.tw-sheetbg,.tw-sheet,.tmgnpbg,.lgm,[role=dialog]')].find(x=>x.offsetParent||getComputedStyle(x).position==='fixed'&&getComputedStyle(x).display!=='none');
let askTries=0;
function showAsk(){if(chosen()||isOn())return;if(busy()){if(++askTries<40)setTimeout(showAsk,1500);return} /* wait until the how-to-play sheet or a card is closed */const day=new Date().toISOString().slice(0,10);if(ls('tmg-music-ask-'+GAME)===day)return;
  const b=AP?D.getElementById('musicBtn'):[...btns].find(x=>x.isConnected&&x.offsetParent);if(!b)return;ls('tmg-music-ask-'+GAME,day);
  ask=D.createElement('div');ask.className='tmgask';ask.textContent='♫ '+W[9];D.body.appendChild(ask);
  const r=b.getBoundingClientRect(),w=ask.offsetWidth;const left=Math.max(12,Math.min(innerWidth-w-12,r.left+r.width/2-w+24));
  ask.style.top=(r.bottom+9)+'px';ask.style.left=left+'px';ask.style.setProperty('--ar',Math.max(10,Math.min(w-22,(left+w)-(r.left+r.width/2)-6))+'px');
  requestAnimationFrame(()=>ask&&ask.classList.add('on'));ask.onclick=e=>{e.stopPropagation();hideAsk();if(!isOn()){toggle();if(!AP)showLine()}askPaint()};setTimeout(hideAsk,7000)}
D.addEventListener('click',e=>{if(ask&&!(e.target.closest&&e.target.closest('.tmgask')))hideAsk();if(e.target.closest&&e.target.closest('.tmgmus,#musicBtn,.tmgnpc'))setTimeout(askPaint,50)},true);
new MutationObserver(()=>askPaint()).observe(D.body,{childList:true,subtree:true,attributes:true,attributeFilter:['aria-pressed']});
setTimeout(()=>{askPaint();showAsk()},1300);
addEventListener('scroll',()=>hideAsk(),{passive:true});
window.tmgMusic={card,toggle,line:()=>{if(AP&&!shown){shown=true;place();showLine()}}};
})();
