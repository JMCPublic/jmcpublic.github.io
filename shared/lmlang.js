/* Aperture and Aperture Landmarks language kit (v2, 12 Nov 2026): a language switch (EN plus every language this game
   has) on the start card, a one-time offer in the player's language on the English page, and on translated pages a
   "spotted a bad translation?" card. Which languages exist comes from window.TMG_AV, set in each page's head.
   Reports go to Firestore 'feedback' with kind 'translation' (Messages on the stats page). */
(()=>{if(window.tmgLmLang||window.top!==window)return;window.tmgLmLang=1;
const H=document.documentElement,P0=location.pathname,MOB=/\/mobile\//.test(P0);
const GAME=/^\/aperture\/landmarks\//.test(P0)?'landmarks':'aperture',GNAME=GAME==='landmarks'?'Aperture Landmarks':'Aperture';
const AV=((window.TMG_AV||{})[GAME]||[]).filter(l=>/^(de|tr|fr|es|pt)$/.test(l));
const LANG=AV.includes(H.lang)?H.lang:'en';
const PATH=l=>'/aperture/'+(GAME==='landmarks'?'landmarks/':'')+(l==='en'?'':l+'/')+(MOB?'mobile/':'');
const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
const q=new URLSearchParams(location.search);
const go=(l,via)=>{ls('tmg-lang',l);location.href=PATH(l)+'?via='+via};
if(LANG!=='en'&&!ls('tmg-lang'))ls('tmg-lang',LANG);
const css=document.createElement('style');css.textContent=`
.lmlang{display:flex;align-items:center;gap:2px;background:rgba(255,255,255,.9);border:1px solid var(--line,#e3e6eb);border-radius:999px;padding:3px;font:600 11px/1 var(--mono,ui-monospace,monospace);letter-spacing:.06em;width:max-content}
.lmlang a{display:block;padding:6px 10px;border-radius:999px;color:var(--soft,#5b606b);text-decoration:none}
.lmlang a[aria-current]{background:var(--ink,#16181d);color:#fff}
.lmlang a:not([aria-current]):hover{color:var(--blue,#2b50e0)}
html.playing .lmlang,body.done .lmlang,#overlay:has(#copyBtn)~.lmlang{display:none}
.ovwrap .lmlang{align-self:center}
.lmoffer{position:fixed;top:max(10px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);z-index:80;display:flex;align-items:center;gap:10px;background:#fff;border:1.5px solid #c3c9d2;border-radius:16px;padding:8px 8px 8px 14px;box-shadow:0 14px 34px -14px rgba(0,0,0,.3);font-size:14px;line-height:1.3;width:max-content;max-width:calc(100% - 20px);box-sizing:border-box;color:var(--soft,#5b606b)}
.lmoffer b{color:var(--ink,#16181d)}.lmoffer .fl{font-size:20px}
.lmoffer .ja{background:var(--ink,#16181d);color:#fff;border:0;border-radius:999px;padding:8px 14px;font:inherit;font-weight:600;cursor:pointer;white-space:nowrap}
.lmoffer .x{background:none;border:0;font-size:22px;line-height:1;color:var(--soft,#5b606b);cursor:pointer;padding:2px 6px}
html.playing .lmoffer{display:none}
@media (max-width:599px){.lmoffer .tx span{display:none}}
.lmho{display:inline-flex;align-items:center;gap:6px;margin-top:6px;background:none;border:1px dashed #c3c9d2;border-radius:999px;padding:6px 12px;font:inherit;font-size:12px;font-weight:500;color:var(--ink,#16181d);cursor:pointer;align-self:flex-start}
.lmho:hover{border-color:var(--blue,#2b50e0);color:var(--blue,#2b50e0)}
.lmho svg{width:14px;height:14px;flex:none}
.lmho-ctx{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px}.lmho-ctx span{font-size:12px;padding:4px 10px;border-radius:999px;background:#eef1f5;color:var(--soft,#5b606b)}
.lmho-lbl{display:block;font-size:13px;font-weight:600;margin:0 0 6px}.lmho-lbl small{font-weight:400;color:var(--soft,#5b606b)}
.lmho-ph{display:flex;flex-wrap:wrap;gap:6px;max-height:150px;overflow:auto;margin:0 0 12px;padding:2px}.lmho-ph .tmgfb-chip{text-align:left}
.lmho-done{text-align:center;padding:10px 0 4px}.lmho-done b{display:block;font-size:19px;margin:6px 0}`;
document.head.appendChild(css);

let started=false;
function sw(){const ov=document.getElementById('overlay');if(ov&&ov.hidden||H.classList.contains('playing'))started=true;
  if(started){document.querySelectorAll('.lmlang,.lmoffer').forEach(x=>x.remove());return}
  const w=document.querySelector('.ovwrap');if(!w||w.querySelector('.lmlang'))return;
  if(!AV.length)return;const p=document.createElement('nav');p.className='lmlang';p.setAttribute('aria-label',{de:'Sprache',tr:'Dil',fr:'Langue',es:'Idioma',pt:'Idioma'}[LANG]||'Language');
  p.innerHTML=['en',...AV].map(l=>`<a href="${PATH(l)}?via=switch" lang="${l}" ${l===LANG?'aria-current="true"':''}>${l.toUpperCase()}</a>`).join('');
  p.querySelectorAll('a').forEach(a=>a.onclick=e=>{e.preventDefault();if(a.lang!==LANG)go(a.lang,'switch')});
  w.appendChild(p)}

const OF={de:['🇩🇪','Auf Deutsch spielen?','gibt es auch auf Deutsch.','Ja, bitte','Nein, danke'],
 tr:['🇹🇷','Türkçe oynamak ister misin?','Türkçe de var.','Evet','Hayır, teşekkürler'],
 fr:['🇫🇷','Jouer en français ?','existe aussi en français.','Oui, merci','Non merci'],
 es:['🇪🇸','¿Jugar en español?','también está en español.','Sí, por favor','No, gracias'],
 pt:['🇧🇷','Jogar em português?','também existe em português.','Sim, quero','Não, obrigado']};
function offer(){if(LANG!=='en')return;const qo=q.get('langoffer');const want=qo&&AV.includes(qo)?qo:(navigator.languages||[navigator.language||'']).map(l=>String(l||'').slice(0,2).toLowerCase()).find(l=>AV.includes(l));
  if(!want||!(qo||(!ls('tmg-lang')&&!ls('tmg-lang-offer-'+GAME))))return;const O=OF[want];
  const o=document.createElement('div');o.className='lmoffer';o.setAttribute('role','dialog');o.lang=want;o.setAttribute('aria-label',O[1]);
  o.innerHTML=`<span class="fl" aria-hidden="true">${O[0]}</span><span class="tx"><b>${O[1]}</b> <span>${GNAME} ${O[2]}</span></span><button type="button" class="ja">${O[3]}</button><button type="button" class="x" aria-label="${O[4]}">×</button>`;
  o.querySelector('.ja').onclick=()=>{ls('tmg-lang-offer-'+GAME,'1');go(want,'offer')};
  o.querySelector('.x').onclick=()=>{ls('tmg-lang-offer-'+GAME,'1');o.remove()};
  document.body.appendChild(o)}

/* ---- translated pages: report a bad translation ---- */
const HL={
de:{l:'Fehlerteufel entdeckt? Sag’s uns',h:'Fehlerteufel entdeckt?',s:'Danke, dass du hilfst, das Spiel besser zu machen.',ph:'Welcher Text?',tap:'(antippen)',other:'Etwas anderes',w:'Was ist falsch, und wie sollte es heißen?',wp:'z. B. „Blickwinkel“ klingt hier komisch, besser wäre …',n:'Dein Name',opt:'(freiwillig, damit wir danken können)',meta:'Wir senden dazu nur Spiel, Bildschirm und Sprache.',c:'Abbrechen',go:'Senden',ing:'Wird gesendet …',ty:'Danke! Ist angekommen.',tyb:'Jede Korrektur macht das Spiel für Deutschsprachige natürlicher.',back:'Zurück zum Spiel',err:'Senden hat gerade nicht geklappt. Bitte gleich nochmal versuchen.',lang:'Deutsch',sc:{start:'Startseite',play:'Im Spiel',results:'Ergebnis'}},
tr:{l:'Garip bir çeviri mi gördün? Bize söyle',h:'Garip bir çeviri mi gördün?',s:'Oyunu daha iyi yapmamıza yardım ettiğin için teşekkürler.',ph:'Hangi ifade?',tap:'(seçmek için dokun)',other:'Başka bir şey',w:'Ne yanlış, nasıl olmalı?',wp:'Örn. “Bakış açısı” burada tuhaf duruyor, şöyle olmalı …',n:'Adın',opt:'(isteğe bağlı, teşekkür edebilmemiz için)',meta:'Yanına sadece oyunu, ekranı ve dili ekliyoruz.',c:'Vazgeç',go:'Gönder',ing:'Gönderiliyor…',ty:'Teşekkürler! Aldık.',tyb:'Her düzeltme oyunu Türkçe konuşanlar için daha doğal yapıyor.',back:'Oyuna dön',err:'Şu an gönderilemedi. Birazdan tekrar dene.',lang:'Türkçe',sc:{start:'Başlangıç',play:'Oyunda',results:'Sonuç'}},
fr:{l:'Une traduction ratée ? Dites-le-nous',h:'Une traduction ratée ?',s:'Merci de nous aider à améliorer le jeu.',ph:'Quel texte ?',tap:'(touchez pour choisir)',other:'Autre chose',w:'Qu’est-ce qui cloche, et que faudrait-il dire ?',wp:'Ex. « Point de vue » sonne bizarre ici, on dirait plutôt …',n:'Votre nom',opt:'(facultatif, pour vous remercier)',meta:'Nous envoyons seulement le jeu, l’écran et la langue.',c:'Annuler',go:'Envoyer',ing:'Envoi…',ty:'Merci ! C’est reçu.',tyb:'Chaque correction rend le jeu plus naturel pour les francophones.',back:'Retour au jeu',err:'Envoi impossible pour l’instant. Réessayez dans un moment.',lang:'Français',sc:{start:'Accueil',play:'En jeu',results:'Résultat'}},
es:{l:'¿Una traducción desastrosa? Avísanos',h:'¿Una traducción desastrosa?',s:'Gracias por ayudarnos a mejorar el juego.',ph:'¿Qué frase?',tap:'(toca para elegir)',other:'Otra cosa',w:'¿Qué está mal y cómo debería decir?',wp:'P. ej. “Punto de vista” suena raro aquí, mejor diría …',n:'Tu nombre',opt:'(opcional, para darte las gracias)',meta:'Solo enviamos el juego, la pantalla y el idioma.',c:'Cancelar',go:'Enviar',ing:'Enviando…',ty:'¡Gracias! Recibido.',tyb:'Cada corrección hace el juego más natural para quienes hablan español.',back:'Volver al juego',err:'No se pudo enviar ahora. Inténtalo de nuevo en un momento.',lang:'Español',sc:{start:'Inicio',play:'Jugando',results:'Resultado'}},
pt:{l:'Viu uma tradução esquisita? Conta pra gente',h:'Viu uma tradução esquisita?',s:'Obrigado por ajudar a deixar o jogo melhor.',ph:'Qual frase?',tap:'(toque para escolher)',other:'Outra coisa',w:'O que está errado e como deveria ser?',wp:'Ex.: “Ponto de vista” soa estranho aqui, o certo seria …',n:'Seu nome',opt:'(opcional, para agradecermos)',meta:'Enviamos junto só o jogo, a tela e o idioma.',c:'Cancelar',go:'Enviar',ing:'Enviando…',ty:'Valeu! Recebemos.',tyb:'Cada correção deixa o jogo mais natural para quem fala português.',back:'Voltar ao jogo',err:'Não deu para enviar agora. Tente de novo daqui a pouco.',lang:'Português',sc:{start:'Início',play:'Jogando',results:'Resultado'}}};
const L=HL[LANG]||HL.de;
const CFG={p:'aperture-c0961',k:'AIzaSyCLMslnXssvPk7S7l_0MuajudNtHRK-VAI'};
const ICO='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>';
const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const dev=()=>{const c=matchMedia('(pointer:coarse)').matches,m=Math.min(screen.width,screen.height);return c?(m>=600?'tablet':'phone'):'desktop'};
const isDone=()=>document.body.classList.contains('done')||!!document.querySelector('#overlay #copyBtn');
const scrNow=()=>isDone()?'results':H.classList.contains('playing')?'play':'start';
function phrases(){const out=[],seen=new Set();
  const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;
    if(!p||p.closest('script,style,svg,header,.top,.side,aside,.promo,.tmgad,.lmho,.lmlang,.lmoffer,.tmgfb-v,#words,[hidden]')||!p.getClientRects().length)return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT}});
  let n;while((n=w.nextNode())&&out.length<18){const pe=n.parentElement;const t=(pe.children.length?n.textContent:pe.textContent).replace(/\s+/g,' ').trim();
    if(t.length<3||t.length>90||!/\p{L}{3}/u.test(t)||seen.has(t))continue;seen.add(t);out.push(t)}
  return out}
let v,picked='',scr='start';
function form(){const ph=phrases();picked=ph[0]||'';
  v.innerHTML=`<form class="tmgfb-c" role="dialog" aria-label="${esc(L.h)}"><h2>${esc(L.h)}</h2><p>${esc(L.s)}</p>
  <div class="lmho-ctx"><span>${GNAME}</span><span>${esc(L.sc[scr])}</span><span>${esc(L.lang)}</span></div>
  <span class="lmho-lbl">${esc(L.ph)} <small>${esc(L.tap)}</small></span>
  <div class="lmho-ph">${ph.concat([L.other]).map((t,i)=>`<button type="button" class="tmgfb-chip" aria-pressed="${i===0}" data-t="${esc(t)}">${esc(t)}</button>`).join('')}</div>
  <label class="lmho-lbl" for="lmho-w">${esc(L.w)}</label><textarea id="lmho-w" maxlength="1500" required placeholder="${esc(L.wp)}"></textarea>
  <label class="lmho-lbl" for="lmho-n" style="margin-top:10px">${esc(L.n)} <small>${esc(L.opt)}</small></label><input id="lmho-n" maxlength="150" autocomplete="name" style="margin-top:0">
  <div class="tmgfb-meta">${esc(L.meta)}</div>
  <div class="tmgfb-row"><span class="tmgfb-msg" aria-live="polite"></span><button type="button" class="tmgfb-b">${esc(L.c)}</button><button type="submit" class="tmgfb-b go">${esc(L.go)}</button></div></form>`;
  const f=v.querySelector('form'),t=f.querySelector('textarea'),nm=f.querySelector('input'),m=f.querySelector('.tmgfb-msg'),gb=f.querySelector('.go');
  f.querySelectorAll('.lmho-ph .tmgfb-chip').forEach(b=>b.onclick=()=>{picked=b.dataset.t===L.other?'':b.dataset.t;f.querySelectorAll('.lmho-ph .tmgfb-chip').forEach(x=>x.setAttribute('aria-pressed',x===b))});
  f.querySelector('.tmgfb-b:not(.go)').onclick=close;
  f.onsubmit=async e=>{e.preventDefault();const msg=t.value.trim();if(!msg){t.focus();return}gb.disabled=true;m.textContent=L.ing;
    const s=x=>({stringValue:String(x)});const where=`translation · ${LANG} · ${GAME} · ${scr} · phrase: ${picked?'“'+picked+'”':'(other)'}`.slice(0,400);
    const doc=k=>({kind:s(k),message:s((k==='translation'?'':`[Translation ${LANG.toUpperCase()}] `)+msg.slice(0,1500)),contact:s(nm.value.trim().slice(0,150)),game:s(document.title.slice(0,120)),page:s(location.pathname.slice(0,200)),device:s(dev()),where:s(where),ua:s(navigator.userAgent.slice(0,300)),at:{timestampValue:new Date().toISOString()}});
    const post=k=>fetch(`https://firestore.googleapis.com/v1/projects/${CFG.p}/databases/(default)/documents/feedback?key=${CFG.k}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:doc(k)})}).then(r=>r.ok);
    let ok=false;try{ok=await post('translation');if(!ok)ok=await post('wrong')}catch(_){}
    if(!ok){m.textContent=L.err;gb.disabled=false;return}
    v.innerHTML=`<div class="tmgfb-c" role="dialog" aria-label="${esc(L.ty)}"><div class="lmho-done"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg><b>${esc(L.ty)}</b><p>${esc(L.tyb)}</p></div><div class="tmgfb-row"><button type="button" class="tmgfb-b go">${esc(L.back)}</button></div></div>`;
    v.querySelector('.go').onclick=close;v.querySelector('.go').focus()}}
function open(){scr=scrNow();if(!v){v=document.createElement('div');v.className='tmgfb-v';v.lang=LANG;document.body.appendChild(v);
  v.addEventListener('click',e=>{if(e.target===v)close()});addEventListener('keydown',e=>{if(e.key==='Escape'&&v&&!v.hidden)close()})}
  form();v.hidden=false;setTimeout(()=>{const b=v.querySelector('.lmho-ph .tmgfb-chip');if(b)b.focus()},50)}
function close(){if(v)v.hidden=true}
function howler(){if(LANG==='en'||!isDone())return;const o=document.getElementById('overlay');if(!o||o.querySelector('.lmho'))return;
  const b=document.createElement('button');b.type='button';b.className='lmho';b.innerHTML=ICO+esc(L.l);b.onclick=open;
  const k=o.querySelector('.kofi');if(k)k.insertAdjacentElement('beforebegin',b);else o.appendChild(b)}
if(LANG!=='en')window.tmgHowler={open,close,phrases};

function wire(){sw();offer();howler();
  new MutationObserver(()=>{sw();howler()}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden']})}
if(document.readyState==='loading')addEventListener('DOMContentLoaded',wire);else wire();
})();
