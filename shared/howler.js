/* "Spotted a translation mistake?" for the simple Natural Wonders games (17 Nov 2026): the classic games' howler card, moved to one shared file.
   Translated pages only (nothing on English). Reports go to Firestore 'feedback' with kind 'translation'; read them in Messages on the stats page. */
(()=>{const st=document.createElement('style');st.textContent="\n.tmgho-l,.tmgho-f{background:none;border:0;padding:6px 4px;font:inherit;font-size:13px;font-weight:500;color:var(--muted,#6f685d);text-decoration:underline dotted;text-underline-offset:3px;cursor:pointer}\n.tmgho-l:hover,.tmgho-f:hover{color:var(--ink,#16130f)}\n.tmgho-l{display:none}\nhtml.phone .tmgho-l{display:block;margin:2px 16px 0 auto;width:max-content;max-width:calc(100% - 32px);text-align:right}\n.tmgho-f{display:block;margin:6px auto 0}\nhtml.phone .tmgho-f{display:none}\nbody:has(.play) .tmgho-l{display:none}\n.tmgho-p{display:flex;align-items:center;gap:8px;margin:16px auto 0;min-height:44px;padding:0 16px;border:1.5px dashed var(--line,#ddd6c8);border-radius:999px;background:transparent;font:inherit;font-size:14px;font-weight:500;color:var(--ink,#16130f);cursor:pointer;max-width:100%;box-sizing:border-box;text-align:left}\n.tmgho-p:hover{border-color:var(--ink,#16130f)}\n.tmgho-p svg{width:16px;height:16px;flex:none}\n.tmgho-ctx{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px}\n.tmgho-ctx span{font-size:12px;padding:4px 10px;border-radius:999px;background:#f3efe6;color:var(--muted,#6f685d)}\n.tmgho-lbl{display:block;font-size:13px;font-weight:600;margin:0 0 6px}\n.tmgho-lbl small{font-weight:400;color:var(--muted,#6f685d)}\n.tmgho-ph{display:flex;flex-wrap:wrap;gap:6px;max-height:156px;overflow:auto;margin:0 0 12px;padding:2px}\n.tmgho-ph .tmgfb-chip{text-align:left}\n.tmgho-done{text-align:center;padding:10px 0 4px}\n.tmgho-done b{display:block;font-size:20px;margin:6px 0}\n";document.head.appendChild(st)})();

(()=>{const LANG=document.documentElement.lang;
const L={
de:{l:'Übersetzungspanne entdeckt? Sag’s uns',h:'Übersetzungspanne entdeckt?',s:'Danke, dass du hilfst, das Spiel besser zu machen.',ph:'Welcher Text?',tap:'(antippen)',other:'Etwas anderes',w:'Was ist falsch, und wie sollte es heißen?',wp:'z. B. „Runde“ klingt hier komisch, besser wäre …',n:'Dein Name',opt:'(freiwillig, damit wir danken können)',meta:'Wir senden dazu nur Spiel, Bildschirm und Sprache.',c:'Abbrechen',go:'Senden',ing:'Wird gesendet …',ty:'Danke! Ist angekommen.',tyb:'Jede Korrektur macht das Spiel für Deutschsprachige natürlicher.',back:'Zurück zum Spiel',err:'Senden hat gerade nicht geklappt. Bitte gleich nochmal versuchen.',lang:'Deutsch',sc:{start:'Startseite',play:'Im Spiel',results:'Ergebnis'}},
tr:{l:'Garip bir çeviri mi gördün? Bize söyle',h:'Garip bir çeviri mi gördün?',s:'Oyunu daha iyi yapmamıza yardım ettiğin için teşekkürler.',ph:'Hangi ifade?',tap:'(seçmek için dokun)',other:'Başka bir şey',w:'Ne yanlış, nasıl olmalı?',wp:'Örn. “Tur” burada tuhaf duruyor, şöyle olmalı …',n:'Adın',opt:'(isteğe bağlı, teşekkür edebilmemiz için)',meta:'Yanına sadece oyunu, ekranı ve dili ekliyoruz.',c:'Vazgeç',go:'Gönder',ing:'Gönderiliyor…',ty:'Teşekkürler! Aldık.',tyb:'Her düzeltme oyunu Türkçe konuşanlar için daha doğal yapıyor.',back:'Oyuna dön',err:'Şu an gönderilemedi. Birazdan tekrar dene.',lang:'Türkçe',sc:{start:'Başlangıç',play:'Oyunda',results:'Sonuç'}},
fr:{l:'Une traduction ratée ? Dites-le-nous',h:'Une traduction ratée ?',s:'Merci de nous aider à améliorer le jeu.',ph:'Quel texte ?',tap:'(touchez pour choisir)',other:'Autre chose',w:'Qu’est-ce qui cloche, et que faudrait-il dire ?',wp:'Ex. « Manche » sonne bizarre ici, on dirait plutôt …',n:'Votre nom',opt:'(facultatif, pour vous remercier)',meta:'Nous envoyons seulement le jeu, l’écran et la langue.',c:'Annuler',go:'Envoyer',ing:'Envoi…',ty:'Merci ! C’est reçu.',tyb:'Chaque correction rend le jeu plus naturel pour les francophones.',back:'Retour au jeu',err:'Envoi impossible pour l’instant. Réessayez dans un moment.',lang:'Français',sc:{start:'Accueil',play:'En jeu',results:'Résultat'}},
es:{l:'¿Una traducción desastrosa? Avísanos',h:'¿Una traducción desastrosa?',s:'Gracias por ayudarnos a mejorar el juego.',ph:'¿Qué frase?',tap:'(toca para elegir)',other:'Otra cosa',w:'¿Qué está mal y cómo debería decir?',wp:'P. ej. “Ronda” suena raro aquí, mejor diría …',n:'Tu nombre',opt:'(opcional, para darte las gracias)',meta:'Solo enviamos el juego, la pantalla y el idioma.',c:'Cancelar',go:'Enviar',ing:'Enviando…',ty:'¡Gracias! Recibido.',tyb:'Cada corrección hace el juego más natural para quienes hablan español.',back:'Volver al juego',err:'No se pudo enviar ahora. Inténtalo de nuevo en un momento.',lang:'Español',sc:{start:'Inicio',play:'Jugando',results:'Resultado'}},
pt:{l:'Viu uma tradução esquisita? Conta pra gente',h:'Viu uma tradução esquisita?',s:'Obrigado por ajudar a deixar o jogo melhor.',ph:'Qual frase?',tap:'(toque para escolher)',other:'Outra coisa',w:'O que está errado e como deveria ser?',wp:'Ex.: “Rodada” soa estranho aqui, o certo seria …',n:'Seu nome',opt:'(opcional, para agradecermos)',meta:'Enviamos junto só o jogo, a tela e o idioma.',c:'Cancelar',go:'Enviar',ing:'Enviando…',ty:'Valeu! Recebemos.',tyb:'Cada correção deixa o jogo mais natural para quem fala português.',back:'Voltar ao jogo',err:'Não deu para enviar agora. Tente de novo daqui a pouco.',lang:'Português',sc:{start:'Início',play:'Jogando',results:'Resultado'}}
}[LANG];
if(!L||window.tmgHowler||window.top!==window)return;
const CFG={p:'aperture-c0961',k:'AIzaSyCLMslnXssvPk7S7l_0MuajudNtHRK-VAI'};
const ICO='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>';
const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const dev=()=>{const c=matchMedia('(pointer:coarse)').matches,m=Math.min(screen.width,screen.height);return c?(m>=600?'tablet':'phone'):'desktop'};
const screenNow=()=>document.querySelector('#app .play')||document.querySelector('.play')?'play':document.querySelector('#app .score')?'results':'start';
// the short bits of text on the screen the player was looking at, so they can point at the one that is wrong
function phrases(){const app=document.getElementById('app')||document.body,out=[],seen=new Set();
  const w=document.createTreeWalker(app,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;if(!p||p.closest('script,style,svg,.tmgho-p,.tmgho-f,.nwsw,nav,.top,.lgm,.tmgem'))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT}});
  let n;while((n=w.nextNode())&&out.length<16){const pe=n.parentElement;let t=(pe.children.length?n.textContent:pe.textContent).replace(/\s+/g,' ').trim();
    if(t.length<2||t.length>90||!/\p{L}{2}/u.test(t)||seen.has(t))continue;seen.add(t);out.push(t)}
  return out}
let v,picked='',sent=false,scr='start';
function build(){v=document.createElement('div');v.className='tmgfb-v';v.hidden=true;v.lang=LANG;document.body.appendChild(v);
  v.addEventListener('click',e=>{if(e.target===v)close()});addEventListener('keydown',e=>{if(e.key==='Escape'&&v&&!v.hidden)close()})}
function form(){const ph=phrases();picked=ph[0]||'';sent=false;
  v.innerHTML=`<form class="tmgfb-c" role="dialog" aria-label="${esc(L.h)}"><h2>${esc(L.h)}</h2><p>${esc(L.s)}</p>
  <div class="tmgho-ctx"><span>${esc(document.title.split('·').pop().trim())}</span><span>${esc(L.sc[scr])}</span><span>${esc(L.lang)}</span></div>
  <span class="tmgho-lbl">${esc(L.ph)} <small>${esc(L.tap)}</small></span>
  <div class="tmgho-ph">${ph.concat([L.other]).map((t,i)=>`<button type="button" class="tmgfb-chip" aria-pressed="${i===0}" data-t="${esc(t)}">${esc(t)}</button>`).join('')}</div>
  <label class="tmgho-lbl" for="tmgho-w">${esc(L.w)}</label>
  <textarea id="tmgho-w" maxlength="1500" required placeholder="${esc(L.wp)}"></textarea>
  <label class="tmgho-lbl" for="tmgho-n" style="margin-top:10px">${esc(L.n)} <small>${esc(L.opt)}</small></label>
  <input id="tmgho-n" maxlength="150" autocomplete="name" style="margin-top:0">
  <div class="tmgfb-meta">${esc(L.meta)}</div>
  <div class="tmgfb-row"><span class="tmgfb-msg" aria-live="polite"></span><button type="button" class="tmgfb-b">${esc(L.c)}</button><button type="submit" class="tmgfb-b go">${esc(L.go)}</button></div></form>`;
  const f=v.querySelector('form'),t=f.querySelector('textarea'),nm=f.querySelector('input'),m=f.querySelector('.tmgfb-msg'),go=f.querySelector('.go');
  f.querySelectorAll('.tmgho-ph .tmgfb-chip').forEach(b=>b.onclick=()=>{picked=b.dataset.t===L.other?'':b.dataset.t;f.querySelectorAll('.tmgho-ph .tmgfb-chip').forEach(x=>x.setAttribute('aria-pressed',x===b))});
  if(!ph.length)picked='';
  f.querySelector('.tmgfb-b:not(.go)').onclick=close;
  f.onsubmit=async e=>{e.preventDefault();const msg=t.value.trim();if(!msg){t.focus();return}
    go.disabled=true;m.textContent=L.ing;
    const s=x=>({stringValue:String(x)});
    const where=`translation · ${LANG} · ${scr} · phrase: ${picked?'“'+picked+'”':'(other)'}`.slice(0,400);
    const doc=k=>({kind:s(k),message:s((k==='translation'?'':'[Translation '+LANG.toUpperCase()+'] ')+msg.slice(0,1500)),contact:s(nm.value.trim().slice(0,150)),game:s(document.title.slice(0,120)),page:s(location.pathname.slice(0,200)),device:s(dev()),where:s(where),ua:s(navigator.userAgent.slice(0,300)),at:{timestampValue:new Date().toISOString()}});
    const post=k=>fetch(`https://firestore.googleapis.com/v1/projects/aperture-c0961/databases/(default)/documents/feedback?key=AIzaSyCLMslnXssvPk7S7l_0MuajudNtHRK-VAI`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:doc(k)})}).then(r=>r.ok);
    let ok=false;try{ok=await post('translation');if(!ok)ok=await post('wrong')}catch(_){}
    if(!ok){m.textContent=L.err;go.disabled=false;return}
    sent=true;v.innerHTML=`<div class="tmgfb-c" role="dialog" aria-label="${esc(L.ty)}"><div class="tmgho-done"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg><b>${esc(L.ty)}</b><p>${esc(L.tyb)}</p></div><div class="tmgfb-row"><button type="button" class="tmgfb-b go">${esc(L.back)}</button></div></div>`;
    v.querySelector('.go').onclick=close;v.querySelector('.go').focus()}}
function open(){if(!v)build();scr=screenNow();form();v.hidden=false;setTimeout(()=>{const b=v.querySelector('.tmgho-ph .tmgfb-chip');if(b)b.focus()},50)}
function close(){if(v)v.hidden=true}
window.tmgHowler={open,close,phrases};
function foot(){const ft=document.querySelector('#app p.foot');if(!ft||document.querySelector('#app .panel .score')||ft.nextElementSibling&&ft.nextElementSibling.classList.contains('tmgho-f'))return;
  const f=document.createElement('button');f.type='button';f.className='tmgho-f';f.textContent=L.l;f.onclick=open;ft.insertAdjacentElement('afterend',f)}
function results(){foot();const sc=document.querySelector('#app .panel .score');if(!sc)return;const panel=sc.closest('.panel');if(!panel||panel.querySelector('.tmgho-p'))return;
  const b=document.createElement('button');b.type='button';b.className='tmgho-p';b.innerHTML=ICO+esc(L.l);b.onclick=open;panel.appendChild(b)}
function wire(){const sw=document.querySelector('.tmglang');const a=document.createElement('button');a.type='button';a.className='tmgho-l';a.textContent=L.l;a.onclick=open;
  if(sw)sw.insertAdjacentElement('afterend',a);
  const app=document.getElementById('app');if(app){new MutationObserver(results).observe(app,{childList:true,subtree:true});results()}}
if(document.readyState==='loading')addEventListener('DOMContentLoaded',wire);else wire();
})();
