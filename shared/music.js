/* twominute.games background music (v1, 11 Nov 2026)
   Natural Wonders games: a quiet classical loop, ON by default, starting on the player's first tap
   (browsers don't allow sound before that). A ♫ button in the game header turns it off/on (remembered on the device).
   When the music starts, a grey "Now playing" line shows under ♫ for 5 seconds; tapping it opens the Now playing card
   with the piece, performer, a fact and a link to a classical station for the player's country.
   Recordings: public domain / CC0 (Handel CC BY-SA), all credited on twominute.games/about#music. */
(()=>{
if(window.tmgMusic)return;
const D=document,P=location.pathname,m=P.match(/natural-wonders-([a-z-]+)/);
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
const L={en:['Now playing','For more like this, try','Listen','Music on','Music off','turn off','turn on','Close','tap for more'],
 de:['Jetzt läuft','Mehr davon gibt es bei','Anhören','Musik an','Musik aus','ausschalten','einschalten','Schließen','für mehr tippen'],
 tr:['Şimdi çalıyor','Benzerleri için:','Dinle','Müzik açık','Müzik kapalı','kapat','aç','Kapat','daha fazlası için dokun'],
 fr:['En ce moment','Pour en écouter davantage :','Écouter','Musique activée','Musique coupée','couper','activer','Fermer','touchez pour en savoir plus'],
 es:['Suena ahora','Para escuchar más, prueba','Escuchar','Música activada','Música desactivada','apagar','encender','Cerrar','toca para saber más'],
 pt:['Tocando agora','Para ouvir mais, experimente','Ouvir','Música ligada','Música desligada','desligar','ligar','Fechar','toque para saber mais']}[lang]||null;
const W=L||['Now playing','For more like this, try','Listen','Music on','Music off','turn off','turn on','Close','tap for more'];
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
.tmgmus.float{position:fixed;top:10px;right:12px;z-index:60}
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
.tmgnpc .ft button{background:none;border:0;padding:0;font:inherit;color:#16181d;text-decoration:underline;cursor:pointer}`;
const st=D.createElement('style');st.textContent=css;D.head.appendChild(st);

const audio=AP?null:new Audio(`https://twominute.games/shared/music/${tr.f}.mp3`);if(audio){audio.loop=true;audio.volume=0.35;audio.preload='none'}
let on=ls('tmg-music')!=='off',started=false,shown=false;
const btns=new Set();
const isOn=()=>AP?((D.getElementById('musicBtn')||{getAttribute:()=>'true'}).getAttribute('aria-pressed')!=='false'):on;
function paint(){if(AP)return;btns.forEach(b=>{b.textContent='♫';b.classList.toggle('off',!on);b.title=on?W[3]:W[4];b.setAttribute('aria-label',on?W[3]:W[4])})}
function play(){if(!on)return;audio.play().then(()=>{started=true;if(!shown){shown=true;showLine()}}).catch(()=>{})}
function toggle(e){e&&e.stopPropagation();if(AP){const b=D.getElementById('musicBtn');if(b)b.click();bump(isOn()?'on':'off');return}on=!on;ls('tmg-music',on?'on':'off');bump(on?'on':'off');if(on)play();else audio.pause();paint()}
function mkBtn(cls){const b=D.createElement('button');b.type='button';b.className='tmgmus '+(cls||'');b.onclick=toggle;btns.add(b);paint();return b}
/* put ♫ in the game header (it is redrawn every question, so keep re-adding it) */
function place(){if(AP){const b=D.getElementById('musicBtn');if(b)btns.add(b);return}const row=D.querySelector('.top .row');if(row&&!row.querySelector('.tmgmus'))row.insertBefore(mkBtn(),row.firstChild);
  btns.forEach(b=>{if(!b.isConnected)btns.delete(b)});
  if(!row&&GAME==='masterbrain'&&!D.querySelector('.tmgmus.float')&&D.querySelector('iframe'))D.body.appendChild(mkBtn('float'))}
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
  k.innerHTML=`<div class="eb"><span class="eq"><b></b><b></b><b></b><b></b></span>${W[0]}</div><h3>${tr.t}</h3><div class="by">${tr.c} · ${tr['p_'+lang]||tr.p}</div><div class="fact">${tr['fact_'+lang]||tr.fact}</div>
  <div class="more"><span>${W[1]} <b>${s[0]}</b></span><a class="go" href="${s[1]}" target="_blank" rel="noopener">${W[2]} ↗</a></div>
  <div class="ft"><span>♫ ${isOn()?W[3]:W[4]} · <button data-a="t">${isOn()?W[5]:W[6]}</button></span><button data-a="x">${W[7]}</button></div>`;
  const close=()=>{bg.remove();k.remove();resume&&resume()};bg.onclick=close;k.querySelector('[data-a=x]').onclick=close;
  k.querySelector('[data-a=t]').onclick=()=>{toggle();close()};k.querySelector('.go').onclick=()=>bump('listen_'+(c||'xx').toLowerCase());
  D.body.append(bg,k)}
/* start on the first tap anywhere (Play now counts); pause when the tab is hidden */
if(!AP){const first=()=>{D.removeEventListener('pointerdown',first,true);D.removeEventListener('keydown',first,true);play()};
D.addEventListener('pointerdown',first,true);D.addEventListener('keydown',first,true);
D.addEventListener('visibilitychange',()=>{if(D.hidden)audio.pause();else if(on&&started)audio.play().catch(()=>{})})}
window.tmgMusic={card,toggle,line:()=>{if(AP&&!shown){shown=true;place();showLine()}}};
})();
