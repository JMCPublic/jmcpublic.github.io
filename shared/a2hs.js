/* "Add to your home screen" tip for returning players (15 Nov 2026, approved rules)
   - phones only, in a browser (not once the game is already on the home screen)
   - from the 3rd visit on, never the 1st or 2nd; only on a game's menu or Aperture's first Start screen, never during a round
   - "Not now" waits a week; a second "Not now" means never again; "Show me how" is the last time it appears
   - while it is showing it takes the ad's place, so the two never stack
   - counted on Reach (shown / Show me how / Not now); nothing personal is stored */
(()=>{
if(window.__tmgA2hs||window.top!==window)return;window.__tmgA2hs=1;
const R=document.documentElement,ua=navigator.userAgent;
const phone=matchMedia('(pointer:coarse)').matches&&Math.min(screen.width,screen.height)<700;
if(!phone||matchMedia('(display-mode: standalone)').matches||navigator.standalone)return;
const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
// one visit per browser session
let visits=+ls('tmg-visits')||0;try{if(!sessionStorage.getItem('tmg-visit')){sessionStorage.setItem('tmg-visit','1');visits++;ls('tmg-visits',String(visits))}}catch(e){}
let S={};try{S=JSON.parse(ls('tmg-a2hs')||'{}')}catch(e){}
if(visits<3||S.done||(S.n||0)>=2||(S.nx&&Date.now()<S.nx))return;
const save=()=>ls('tmg-a2hs',JSON.stringify(S));
const count=k=>{try{window.tmgReach&&tmgReach.bump&&tmgReach.bump({[`rate.a2hs_${k}`]:1})}catch(e){}};
const L=(R.lang||'en').slice(0,2);
const g=location.pathname.match(/natural-wonders-([a-z-]+)/),ap=/^\/aperture\//.test(location.pathname),lm=/\/landmarks\//.test(location.pathname);
const name=()=>{const t=document.querySelector('meta[name="apple-mobile-web-app-title"]');return (t&&t.content)||(lm?'Landmarks':ap?'Aperture':'')};
const ios=/iPhone|iPad|iPod/.test(ua),inChrome=/CriOS|FxiOS|EdgiOS/.test(ua);
const T={
 en:{t:'Back again? 👋',p:n=>`Put ${n} on your home screen. One tap and you're playing, full screen.`,y:'Show me how',n:'Not now',h:n=>`Add ${n} to your home screen`,
  ios:[`Tap <b>Share</b> <span class="sh">⬆</span> ${inChrome?'at the top right':'at the bottom of Safari'}`,'Scroll down and tap <b>Add to Home Screen</b>','Tap <b>Add</b>'],
  and:['Tap the menu <b>⋮</b> at the top right','Tap <b>Add to Home screen</b> or <b>Install app</b>','Tap <b>Add</b> or <b>Install</b>'],ok:'Got it'},
 de:{t:'Wieder da? 👋',p:n=>`Leg ${n} auf deinen Startbildschirm. Ein Tipp und du spielst, im Vollbild.`,y:'Zeig mir wie',n:'Jetzt nicht',h:n=>`${n} zum Startbildschirm hinzufügen`,
  ios:[`Tippe auf <b>Teilen</b> <span class="sh">⬆</span> ${inChrome?'oben rechts':'unten in Safari'}`,'Scrolle nach unten und tippe auf <b>Zum Home-Bildschirm</b>','Tippe auf <b>Hinzufügen</b>'],
  and:['Tippe oben rechts auf das Menü <b>⋮</b>','Tippe auf <b>Zum Startbildschirm hinzufügen</b> oder <b>App installieren</b>','Tippe auf <b>Hinzufügen</b> oder <b>Installieren</b>'],ok:'Alles klar'},
 tr:{t:'Yine mi buradasın? 👋',p:n=>`${n} oyununu ana ekranına ekle. Tek dokunuşla tam ekran oyna.`,y:'Nasıl yapılır',n:'Şimdi değil',h:n=>`${n} oyununu ana ekrana ekle`,
  ios:[`<b>Paylaş</b> <span class="sh">⬆</span> düğmesine dokun (${inChrome?'sağ üstte':'Safari’nin altında'})`,'Aşağı kaydır ve <b>Ana Ekrana Ekle</b>’ye dokun','<b>Ekle</b>’ye dokun'],
  and:['Sağ üstteki <b>⋮</b> menüsüne dokun','<b>Ana ekrana ekle</b> veya <b>Uygulamayı yükle</b>’ye dokun','<b>Ekle</b> veya <b>Yükle</b>’ye dokun'],ok:'Tamam'},
 fr:{t:'Te revoilà ? 👋',p:n=>`Mets ${n} sur ton écran d’accueil. Un geste et tu joues, en plein écran.`,y:'Montre-moi',n:'Pas maintenant',h:n=>`Ajouter ${n} à l’écran d’accueil`,
  ios:[`Touche <b>Partager</b> <span class="sh">⬆</span> ${inChrome?'en haut à droite':'en bas de Safari'}`,'Fais défiler et touche <b>Sur l’écran d’accueil</b>','Touche <b>Ajouter</b>'],
  and:['Touche le menu <b>⋮</b> en haut à droite','Touche <b>Ajouter à l’écran d’accueil</b> ou <b>Installer l’application</b>','Touche <b>Ajouter</b> ou <b>Installer</b>'],ok:'Compris'},
 es:{t:'¿Otra vez por aquí? 👋',p:n=>`Pon ${n} en tu pantalla de inicio. Un toque y a jugar, a pantalla completa.`,y:'Enséñame cómo',n:'Ahora no',h:n=>`Añadir ${n} a la pantalla de inicio`,
  ios:[`Toca <b>Compartir</b> <span class="sh">⬆</span> ${inChrome?'arriba a la derecha':'abajo en Safari'}`,'Desliza y toca <b>Añadir a pantalla de inicio</b>','Toca <b>Añadir</b>'],
  and:['Toca el menú <b>⋮</b> arriba a la derecha','Toca <b>Añadir a pantalla de inicio</b> o <b>Instalar aplicación</b>','Toca <b>Añadir</b> o <b>Instalar</b>'],ok:'Entendido'},
 pt:{t:'De volta? 👋',p:n=>`Põe ${n} no teu ecrã principal. Um toque e estás a jogar, em ecrã inteiro.`,y:'Mostra-me como',n:'Agora não',h:n=>`Adicionar ${n} ao ecrã principal`,
  ios:[`Toca em <b>Partilhar</b> <span class="sh">⬆</span> ${inChrome?'no canto superior direito':'em baixo no Safari'}`,'Desliza e toca em <b>Adicionar ao ecrã principal</b>','Toca em <b>Adicionar</b>'],
  and:['Toca no menu <b>⋮</b> no canto superior direito','Toca em <b>Adicionar ao ecrã principal</b> ou <b>Instalar aplicação</b>','Toca em <b>Adicionar</b> ou <b>Instalar</b>'],ok:'Percebi'}}[L]||null;
if(!T)return;
const st=document.createElement('style');
st.textContent=`html.tmg-a2hs-on #tmgAd,html.tmg-a2hs-on .tmgfb-pill{visibility:hidden!important}
.a2hs{position:fixed;z-index:60;left:var(--a2l,12px);right:var(--a2r,12px);bottom:calc(14px + env(safe-area-inset-bottom));background:#16130f;color:#fff;border-radius:20px;padding:14px 14px 12px;box-shadow:0 8px 24px rgba(0,0,0,.25);font:500 14px/1.35 Inter,system-ui,sans-serif;animation:a2up .35s ease}
@keyframes a2up{from{transform:translateY(30px);opacity:0}}
.a2hs .r{display:flex;gap:12px;align-items:center}.a2hs img{width:46px;height:46px;border-radius:11px;flex:none}
.a2hs b.t{display:block;font-size:15.5px;font-weight:700}.a2hs p{margin:3px 0 0;font-size:13px;opacity:.85}
.a2hs .acts{display:flex;gap:8px;margin-top:10px}.a2hs button{flex:1;border-radius:999px;padding:10px;font:700 13.5px Inter,system-ui,sans-serif;cursor:pointer}
.a2hs .y{background:#fff;color:#16130f;border:0}.a2hs .n{background:none;color:#fff;border:1.5px solid rgba(255,255,255,.4)}
.a2hs.st{background:#fff;color:#16130f}.a2hs h3{margin:0 0 8px;font:600 19px Fraunces,Georgia,serif}.a2hs ol{margin:0;padding-left:20px;font-size:14px;line-height:1.6}
.a2hs .sh{display:inline-block;border:1.5px solid #2b50e0;color:#2b50e0;border-radius:6px;padding:0 5px;line-height:1.3}
.a2hs .ok{display:block;width:100%;margin-top:12px;background:none;border:1.5px solid #16130f;color:#16130f}
.a2hs .hint{font-size:12.5px;color:#6f685d;margin-top:8px}`;
document.head.appendChild(st);
// where it may appear: a Natural Wonders menu, or Aperture's first Start screen
const ready=()=>{if(R.classList.contains('tw-on')||document.querySelector('.tmglo,.lgoffer,.wt-on'))return false;
  if(g)return !!document.querySelector('.panel.menu,.menuhead')&&!document.querySelector('.play,.score')&&document.getElementById('app')?.style.display!=='none';
  if(ap){const b=document.body;return b.classList.contains('waiting')&&!b.classList.contains('done')&&!!document.getElementById('startBtn')&&/[ ]1[ /]|^1\b/.test((document.getElementById('roundNum')||{}).textContent||'1')}
  return false};
// the tip lines up with the game's panels, like the ad
const edges=el=>{const ref=document.querySelector('.viewer,.panel.menu,.menuhead');if(!ref)return;const r=ref.getBoundingClientRect();el.style.setProperty('--a2l',Math.round(r.left)+'px');el.style.setProperty('--a2r',Math.round(innerWidth-r.right)+'px')};
let box=null,shown=false;
function close(){if(box){box.remove();box=null}R.classList.remove('tmg-a2hs-on')}
function steps(){const and=!ios;box.className='a2hs st';
  box.innerHTML=`<h3>${T.h(name())}</h3><ol>${(and?T.and:T.ios).map(s=>`<li>${s}</li>`).join('')}</ol><button class="ok">${T.ok}</button>`;
  box.querySelector('.ok').onclick=close}
function show(){if(shown)return;shown=true;S.n=(S.n||0)+1;S.nx=Date.now()+7*864e5;save();count('shown');R.classList.add('tmg-a2hs-on');
  box=document.createElement('div');box.className='a2hs';box.setAttribute('role','dialog');const k=g?g[1]:lm?'landmarks':'aperture';
  box.innerHTML=`<div class="r"><img src="/icons/${k}-180.png" alt=""><div><b class="t">${T.t}</b><p>${T.p(name())}</p></div></div><div class="acts"><button class="y">${T.y}</button><button class="n">${T.n}</button></div>`;
  edges(box);document.body.appendChild(box);
  box.querySelector('.n').onclick=()=>{count('no');if(S.n>=2)S.done=1;save();close()};
  box.querySelector('.y').onclick=async()=>{count('how');S.done=1;save();const bip=window.__tmgBip;
    if(bip&&!ios){try{close();bip.prompt();await bip.userChoice}catch(e){}return}steps()};
  // never during a round: if the game starts, the tip goes (and can come back another day)
  const mo=new MutationObserver(()=>{if(box&&!box.classList.contains('st')&&!ready()){close();mo.disconnect()}});mo.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']})}
// wait a few seconds on the menu so it never jumps out the moment the page opens
let t=null;const chk=()=>{if(shown)return;if(ready()){if(!t)t=setTimeout(()=>{t=null;if(ready())show()},2500)}else if(t){clearTimeout(t);t=null}};
new MutationObserver(chk).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});chk();
})();
