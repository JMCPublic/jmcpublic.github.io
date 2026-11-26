/* When was that? (built 23 Nov 2026 from mock-up v2, approved by Jonathan): three moments from history, tap them in order, earliest first.
   Six trios a day, the same for everyone: two easy, two medium, two hard. Then an optional bonus (the hardest).
   Scoring: 1 for the right order, ½ when exactly one is in its right place (with three, two right means all three right). Bonus is a ⭐ on top of the /6.
   Uses the Natural Wonders look (simple.css) and the shared house pieces: Goldilocks (rating.js via reach), weekly where-are-you card (tmg:gameover),
   visit/game counts (nwcount.js), feedback, footer, home button. Content: /when/trios.js.
   25 Nov: English, Spanish and French. The page picks the language (tmg-lang, else the phone's language; anything else gets English) and loads
   /when/lang/xx.js, which holds the translations, the events left out in that language and its own local trios. EN/ES/FR button in the top row. */
(()=>{
const app=document.getElementById('app'),$=s=>document.querySelector(s);
const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
const WL=window.WHEN_L||null,L=(window.WHEN_LANG&&WL)?window.WHEN_LANG:'en';
const nb=s=>L==='fr'?String(s).replace(/ ([?!:;»])/g,'\u00a0$1').replace(/« /g,'«\u00a0'):String(s);  /* French: no line break before ? ! : ; » */
const esc=s=>nb(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
document.documentElement.lang=L;
const LOC={en:'en-GB',es:'es-ES',fr:'fr-FR'}[L];
const U={
en:{name:'When was that?',tag:'You know the events. Do you know the order?',kick:'History · daily',intro:'Three moments from history. Tap them in order, <b>earliest first</b>.',
  b:['Six trios, about two minutes','Two easy, two medium, two hard','Then a bonus, if you dare'],scored:n=>`Today you scored ${n} / 6`,admire:'Admire my score',play:'Play today’s trios',
  all:'All games',of:(i,n)=>`${i} of ${n}`,btrio:'Bonus trio',lv:{e:'Easy',m:'Medium',h:'Hard',b:'Bonus'},q:'Put them in order',
  h1:'Tap the earliest first, then the next, then the latest.',h2:'Earliest at the top. The number is where you put it.',
  r1:'Spot on! 1 point',rb:'Brilliant! Bonus star ⭐',rh:'Nearly: one in the right place. ½ point',r0:'Not quite. 0 points',rb0:'Not this time. The bonus is a tough one.',
  next:'Next trio →',fin:'Finish →',see:'See my score →',check:'Check my order',undo:'Start this trio again',same:'later the same year',yrs:n=>`${n} year${n===1?'':'s'} later`,
  six:n=>`Six done · ${n} / 6`,fancy:'Fancy a bonus?',o1:'One extra trio, the hardest of the day. Often all three happened in the same year, so the months count.',
  o2:'It won’t change your score out of 6. Get it exactly right and you earn a ⭐.',yes:'Yes, play the bonus',no:'No thanks, show my score',
  v:['Perfect! A true historian 🏆','Brilliant. You really know your history.','Very good. You know your eras.','Not bad! History is trickier than it looks.','Time is a funny thing. Tomorrow brings six fresh trios.'],
  your:'Your score',played:'You’ve played today’s trios. New ones at midnight.',nbest:'🎉 Your best score yet',best:n=>`Your best: ${n} / 6`,star:' · Bonus star earned ⭐',btag:' · bonus',
  share:'Share my score',copied:'Copied ✓',tom:'Six new trios tomorrow, the same for everyone.',another:'Play another today',done:'✓ Played',go:'Play',
  src:['Sources',n=>`Want the full list of sources for ${n}? Leave your email and we’ll send it to you.`,'Your email','Send me the sources','We’ll only use your email to send you the sources, then delete it.','Privacy','Sending…','Thanks! We’ll email you the sources soon.','Please check your email address.','That didn’t send. Please try again in a moment.','Close']},
es:{name:'¿Cuándo fue?',tag:'Conoces los hechos. ¿Sabes el orden?',kick:'Historia · diario',intro:'Tres momentos de la historia. Tócalos en orden, <b>del más antiguo al más reciente</b>.',
  b:['Seis tríos, unos dos minutos','Dos fáciles, dos medios, dos difíciles','Y luego un extra, si te atreves'],scored:n=>`Hoy has sacado ${n} / 6`,admire:'Admirar mi puntuación',play:'Jugar los tríos de hoy',
  all:'Todos los juegos',of:(i,n)=>`${i} de ${n}`,btrio:'Trío extra',lv:{e:'Fácil',m:'Medio',h:'Difícil',b:'Extra'},q:'Ponlos en orden',
  h1:'Toca primero el más antiguo, luego el siguiente y después el más reciente.',h2:'El más antiguo arriba. El número es donde lo pusiste.',
  r1:'¡Exacto! 1 punto',rb:'¡Genial! Estrella extra ⭐',rh:'Casi: uno en su sitio. ½ punto',r0:'No del todo. 0 puntos',rb0:'Esta vez no. El extra es muy difícil.',
  next:'Siguiente trío →',fin:'Terminar →',see:'Ver mi puntuación →',check:'Comprobar mi orden',undo:'Empezar este trío de nuevo',same:'ese mismo año, más tarde',yrs:n=>`${n} año${n===1?'':'s'} después`,
  six:n=>`Seis hechos · ${n} / 6`,fancy:'¿Te animas con un extra?',o1:'Un trío más, el más difícil del día. A menudo los tres ocurrieron el mismo año, así que cuentan los meses.',
  o2:'No cambia tu puntuación sobre 6. Si lo aciertas del todo, ganas una ⭐.',yes:'Sí, jugar el extra',no:'No, gracias, ver mi puntuación',
  v:['¡Perfecto! Todo un historiador 🏆','Genial. Sabes mucha historia.','Muy bien. Conoces las épocas.','¡No está mal! La historia es más traicionera de lo que parece.','El tiempo es curioso. Mañana, seis tríos nuevos.'],
  your:'Tu puntuación',played:'Ya has jugado los tríos de hoy. Hay nuevos a medianoche.',nbest:'🎉 Tu mejor puntuación',best:n=>`Tu mejor: ${n} / 6`,star:' · Estrella extra conseguida ⭐',btag:' · extra',
  share:'Compartir mi puntuación',copied:'Copiado ✓',tom:'Mañana, seis tríos nuevos, los mismos para todos.',another:'Juega a otro hoy',done:'✓ Jugado',go:'Jugar',
  src:['Fuentes',n=>`¿Quieres la lista completa de fuentes de ${n}? Déjanos tu correo y te la enviamos.`,'Tu correo electrónico','Enviadme las fuentes','Solo usaremos tu correo para enviarte las fuentes y después lo borraremos.','Privacidad','Enviando…','¡Gracias! Pronto te enviaremos las fuentes por correo.','Revisa tu dirección de correo.','No se ha podido enviar. Inténtalo de nuevo en un momento.','Cerrar']},
fr:{name:'C’était quand ?',tag:'Tu connais les événements. Connais-tu l’ordre ?',kick:'Histoire · quotidien',intro:'Trois moments de l’histoire. Touche-les dans l’ordre, <b>du plus ancien au plus récent</b>.',
  b:['Six trios, environ deux minutes','Deux faciles, deux moyens, deux difficiles','Puis un bonus, si tu oses'],scored:n=>`Aujourd’hui : ${n} / 6`,admire:'Admirer mon score',play:'Jouer les trios du jour',
  all:'Tous les jeux',of:(i,n)=>`${i} sur ${n}`,btrio:'Trio bonus',lv:{e:'Facile',m:'Moyen',h:'Difficile',b:'Bonus'},q:'Remets-les dans l’ordre',
  h1:'Touche d’abord le plus ancien, puis le suivant, puis le plus récent.',h2:'Le plus ancien en haut. Le chiffre indique où tu l’avais placé.',
  r1:'Parfait ! 1 point',rb:'Bravo ! Étoile bonus ⭐',rh:'Presque : un seul bien placé. ½ point',r0:'Pas tout à fait. 0 point',rb0:'Pas cette fois. Le bonus est coriace.',
  next:'Trio suivant →',fin:'Terminer →',see:'Voir mon score →',check:'Vérifier mon ordre',undo:'Recommencer ce trio',same:'plus tard la même année',yrs:n=>`${n} an${n===1?'':'s'} plus tard`,
  six:n=>`Six faits · ${n} / 6`,fancy:'Envie d’un bonus ?',o1:'Un trio de plus, le plus difficile du jour. Souvent, les trois ont eu lieu la même année : ce sont les mois qui comptent.',
  o2:'Ça ne change pas ton score sur 6. Tout juste, et tu gagnes une ⭐.',yes:'Oui, jouer le bonus',no:'Non merci, voir mon score',
  v:['Parfait ! Un vrai historien 🏆','Bravo. Tu connais vraiment l’histoire.','Très bien. Tu connais tes époques.','Pas mal ! L’histoire est plus piégeuse qu’elle n’en a l’air.','Le temps est une drôle de chose. Demain, six nouveaux trios.'],
  your:'Ton score',played:'Tu as joué les trios du jour. De nouveaux arrivent à minuit.',nbest:'🎉 Ton meilleur score',best:n=>`Ton record : ${n} / 6`,star:' · Étoile bonus gagnée ⭐',btag:' · bonus',
  share:'Partager mon score',copied:'Copié ✓',tom:'Demain, six nouveaux trios, les mêmes pour tous.',another:'Joue à un autre aujourd’hui',done:'✓ Joué',go:'Jouer',
  src:['Sources',n=>`Tu veux la liste complète des sources de ${n} ? Laisse ton e-mail et nous te l’enverrons.`,'Ton e-mail','M’envoyer les sources','Nous utiliserons ton e-mail uniquement pour t’envoyer les sources, puis nous le supprimerons.','Confidentialité','Envoi…','Merci ! Nous t’enverrons les sources par e-mail très bientôt.','Vérifie ton adresse e-mail.','L’envoi n’a pas marché. Réessaie dans un instant.','Fermer']}
}[L];
const K='when',NAME=U.name;
document.title=NAME+' · twominute.games';
const VIP=ls('ap-vip')==='1';
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const dateTxt=()=>{try{return new Date().toLocaleDateString(LOC,{weekday:'short',day:'numeric',month:'short'})}catch(e){return ''}};
function rng(seed){let h=1779033703^seed.length;for(let i=0;i<seed.length;i++){h=Math.imul(h^seed.charCodeAt(i),3432918353);h=h<<13|h>>>19}
  return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return((h^=h>>>16)>>>0)/4294967296}}
const shuffle=(a,r)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

/* ---------- this language's trios: English as written; Spanish/French translated, very British trios left out, local trios added ---------- */
const MON={es:['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'],fr:['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.']};
const MEN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function dl(s){if(L==='en')return s;const es=L==='es';
  return s.replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g,m=>MON[L][MEN.indexOf(m)])
    .replace(/^AD (\d+)$/,es?'$1 d. C.':'$1 apr. J.-C.').replace(/ BC$/,es?' a. C.':' av. J.-C.')
    .replace(/^c\. /,es?'h. ':'v. ').replace(/^by (\d+)$/,es?'ya en $1':'dès $1')}
const TRS=(()=>{if(L==='en')return TRIOS.filter(t=>!t.only);
  const X=new Set(WL.x||[]),tr=s=>WL.ev[s]||s,tf=s=>WL.f[s]||s;
  return TRIOS.filter(t=>!t.only&&!t.ev.some(e=>X.has(e[0]))).map(t=>({...t,ev:t.ev.map(e=>[tr(e[0]),e[1],dl(e[2])]),f:tf(t.f)})).concat(WL.local||[])})();

/* ---------- the day's trios: each level's list is shuffled once, then walked through day by day, so trios don't come back until the list runs out.
   No event appears twice on the same day. A practice seed (owner only) picks at random.
   Each batch is shuffled on its own and added after the earlier ones, so new trios never change days already played (as long as the list hasn't wrapped round) ---------- */
const POOL={};['e','m','h','b'].forEach(l=>{const T=TRS.filter(t=>t.l===l),ws=[...new Set(T.map(t=>t.w||1))].sort((a,b)=>a-b);
  POOL[l]=ws.flatMap(w=>shuffle(T.filter(t=>(t.w||1)===w),rng('when-pool-'+l+(w>1?'-w'+w:''))))});
const DAY0=Date.UTC(2026,10,24);
function dayNo(seed){const m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(seed);return m?Math.round((Date.UTC(+m[1],+m[2]-1,+m[3])-DAY0)/864e5):Math.floor(rng(seed)()*1e6)}
function pick(seed){const n=dayNo(seed),isDay=/^\d{4}-\d\d-\d\d$/.test(seed);
  /* Real days: walk forward from launch day, one cursor per level. A trio skipped because it shares an event with another trio that day
     waits at the front of the queue for the next day, so every trio is used once before any comes round again. */
  if(isDay&&n>=0){const cur={e:0,m:0,h:0,b:0},q={e:[],m:[],h:[],b:[]};let day=null;
    for(let d=0;d<=n;d++){const used=new Set(),out=[];
      const take=(l,k)=>{const P=POOL[l];let got=0,guard=0;const keep=[];
        while(q[l].length&&got<k){const t=q[l].shift();if(t.ev.some(e=>used.has(e[0])))keep.push(t);else{t.ev.forEach(e=>used.add(e[0]));out.push(t);got++}}
        while(got<k&&guard++<P.length*2){const t=P[cur[l]%P.length];cur[l]++;if(out.includes(t))continue;
          if(t.ev.some(e=>used.has(e[0]))){keep.push(t);continue}t.ev.forEach(e=>used.add(e[0]));out.push(t);got++}
        q[l]=keep.concat(q[l])};
      take('e',2);take('m',2);take('h',2);take('b',1);if(d===n)day=out}
    return {qs:day.slice(0,6).map(t=>prep(t,seed)),bonus:day[6]?prep(day[6],seed):null}}
  /* practice sets (owner) and any day before launch: a random-ish slice */
  const used=new Set(),out=[];
  const take=(l,k,per)=>{const P=POOL[l];let got=0;for(let j=0;j<P.length&&got<k;j++){const t=P[(((n*per+j)%P.length)+P.length)%P.length];
      if(out.includes(t)||t.ev.some(e=>used.has(e[0])))continue;t.ev.forEach(e=>used.add(e[0]));out.push(t);got++}};
  take('e',2,2);take('m',2,2);take('h',2,2);const main=out.slice();take('b',1,1);const bonus=out[6]||null;
  return {qs:main.map(t=>prep(t,seed)),bonus:bonus?prep(bonus,seed):null}}
function prep(t,seed){const r=rng(seed+'|'+t.ev[0][0]);let o=shuffle([0,1,2],r);if(o.join()==='0,1,2')o=[o[1],o[2],o[0]];return {...t,order:o}}  /* never shown already in order */

/* ---------- page shell ---------- */
const HSVG='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>';
const back=`<a class="tmghome hmb" href="/" aria-label="${esc(U.all)}" title="${esc(U.all)}">${HSVG}</a><a class="back" href="/">← ${esc(U.all)}</a><span class="row"><button type="button" class="lgb" aria-haspopup="true" aria-label="Language">${L.toUpperCase()} ▾</button></span>`;
const hdr=t=>`<div class="top">${back}<span class="tag">${esc(t||dateTxt())}</span></div>`;
/* language button: English, Español, Français. Saves tmg-lang (the same setting the home page and other games use) and reloads */
const LANGS=[['en','English'],['es','Español'],['fr','Français']];
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.lgb'),m=document.querySelector('.lgm'),it=e.target.closest&&e.target.closest('.lgm button');
  if(it){ls('tmg-lang',it.dataset.l);const u=new URL(location.href);u.searchParams.delete('lang');location.replace(u.pathname+u.search+u.hash);return}
  if(m){m.remove();if(!b)return}
  if(!b||m)return;e.stopPropagation();
  const menu=document.createElement('div');menu.className='lgm';menu.setAttribute('role','menu');
  menu.innerHTML=LANGS.map(([k,n])=>`<button type="button" role="menuitem" data-l="${k}"${k===L?' aria-current="true"':''}><b>${k.toUpperCase()}</b>${n}${k===L?' ✓':''}</button>`).join('');
  document.body.appendChild(menu);const r=b.getBoundingClientRect();menu.style.top=(r.bottom+6)+'px';menu.style.right=Math.max(12,innerWidth-r.right)+'px'},true);
let S=null;
window.tmgMidGame=()=>!!(S&&!S.over&&S.res&&S.res.length>0&&S.res.length<S.qs.length);
const sc=p=>{const n=p.filter((v,i)=>v===i).length;return n===3?1:n===1?.5:0};
const half=n=>String(n).replace('.5','½');
const cls=r=>r===1?'ok':r===.5?'half':r===0?'no':'';
function prog(){const tot=S.qs.length+(S.inBonus?1:0);return `<div class="prog">${[...Array(tot)].map((_,k)=>{const r=k<S.qs.length?S.res[k]:S.bres;return `<i class="${r!=null?cls(r)+(k>=S.qs.length?' star':''):k===S.i?'now':''}"></i>`}).join('')}</div>`}

function start(seed,practice){const d=pick(seed);S={seed,practice,qs:d.qs,bonus:d.bonus,i:0,res:[],bres:null,inBonus:false,over:false};playQ()}
function cur(){return S.inBonus?S.bonus:S.qs[S.i]}
function playQ(){S.pick=[];S.done=false;draw();scrollTo(0,0)}
function gap(y){const a=Math.abs(y);let s;if(a<1){s=U.same}else{const r=Math.round(a);s=U.yrs(r).replace(String(r),r.toLocaleString(LOC))}return `<div class="gap ${a<=10?'close':''}">${s}</div>`}
function draw(){const t=cur(),done=S.done,lab=S.inBonus?U.btrio:U.of(S.i+1,S.qs.length);let cards;
  if(!done)cards=t.order.map(i=>{const p=S.pick.indexOf(i);return `<button class="ev ${p>=0?'on':''}" data-i="${i}"><span class="n">${p>=0?p+1:''}</span><span class="tx">${esc(t.ev[i][0])}</span></button>`}).join('');
  else{const r=S.inBonus?S.bres:S.res[S.i];cards=[0,1,2].map(i=>{const u=S.pick.indexOf(i)+1,ok=u===i+1;
    return `<div class="ev ${ok?(r===1?'ok':'half'):'no'}"><span class="n">${u}</span><span class="tx">${esc(t.ev[i][0])}</span><span class="yr">${esc(t.ev[i][2])}</span></div>`+(i<2?gap(t.ev[i+1][1]-t.ev[i][1]):'')}).join('')}
  const r=done?(S.inBonus?S.bres:S.res[S.i]):0,last=!S.inBonus&&S.i===S.qs.length-1;
  app.innerHTML=`<div class="play">${hdr(lab)}${prog()}
   <h2 class="q">${esc(U.q)}<span class="lvlb ${t.l}">${esc(U.lv[t.l])}</span></h2>
   <p class="hint">${esc(done?U.h2:U.h1)}</p>
   <div class="evs">${cards}</div>
   ${done?`<div class="fact"><b class="${r===1?'g':r?'y':'r'}">${esc(r===1?(S.inBonus?U.rb:U.r1):r?U.rh:(S.inBonus?U.rb0:U.r0))}</b>${esc(t.f)}</div>
     <button class="next" id="nx">${esc(S.inBonus?U.see:last?U.fin:U.next)}</button>`
   :`<button class="check" id="ck" ${S.pick.length<3?'disabled':''}>${esc(U.check)}</button>${S.pick.length?`<button class="undo" id="un">${esc(U.undo)}</button>`:''}`}</div>`;
  if(done){$('#nx').onclick=()=>{if(S.inBonus)return end();if(last)return S.bonus?offer():end();S.i++;playQ()};$('.fact').scrollIntoView({block:'nearest',behavior:'smooth'});return}
  app.querySelectorAll('.ev').forEach(b=>b.onclick=()=>{const i=+b.dataset.i,p=S.pick.indexOf(i);if(p>=0)S.pick=S.pick.slice(0,p);else if(S.pick.length<3)S.pick.push(i);draw()});
  const un=$('#un');if(un)un.onclick=()=>{S.pick=[];draw()};
  $('#ck').onclick=()=>{if(S.pick.length<3)return;const v=sc(S.pick);if(S.inBonus)S.bres=v===1?1:0;else S.res[S.i]=v;S.done=true;draw()}}

/* after the six: play the bonus, or finish */
function offer(){const n=S.res.reduce((a,b)=>a+b,0);
  app.innerHTML=`${hdr()}${prog()}<div class="panel intro bonus"><span class="tag">${esc(U.six(half(n)))}</span><h2>${esc(U.fancy)}</h2>
   <p>${esc(U.o1)}</p><p class="sm">${esc(U.o2)}</p>
   <div class="btns"><button class="btn" id="yb">${esc(U.yes)}</button><button class="btn ghost" id="nb">${esc(U.no)}</button></div></div>`;
  $('#yb').onclick=()=>{S.inBonus=true;playQ()};$('#nb').onclick=()=>end();scrollTo(0,0)}

/* ---------- the end ---------- */
function verdict(n){return U.v[n===6?0:n>=5?1:n>=4?2:n>=2.5?3:4]}
function record(n){const st=JSON.parse(ls(K+'-st')||'null')||{played:0,streak:0,last:''};const y=new Date();y.setDate(y.getDate()-1);
  const yk=y.getFullYear()+'-'+String(y.getMonth()+1).padStart(2,'0')+'-'+String(y.getDate()).padStart(2,'0');
  st.streak=st.last===yk?st.streak+1:st.last===today()?st.streak:1;st.last=today();st.played++;ls(K+'-st',JSON.stringify(st));
  ls(K+'-done-'+today(),String(n));ls(K+'-streak',JSON.stringify({n:st.streak,last:today()}))}  /* the home page card reads when-done- and when-streak */
function end(rev){S.over=true;const n=S.res.reduce((a,b)=>a+b,0);let best=+ls(K+'-best')||0;const newBest=!S.practice&&!rev&&n>best;if(newBest){best=n;ls(K+'-best',String(n))}
  const qs=S.qs.concat(S.bres!=null&&S.bonus?[S.bonus]:[]);
  /* the day's record keeps the trios as shown, so Admire my score shows the same list even if the language is changed later */
  if(!S.practice&&!rev){ls(K+'-day',JSON.stringify({d:S.seed,n,res:S.res,b:S.bres,l:L,t:qs.map(t=>t.ev.map(e=>[e[0],e[2]]))}));record(n);setTimeout(()=>{try{dispatchEvent(new Event('tmg:gameover'))}catch(e){}},0)}
  const sq=r=>r===1?'🟩':r===.5?'🟨':'🟥';
  const grid=S.res.map(sq).join('')+(S.bres===1?' ⭐':S.bres===0?' ✖️':'');
  const share=`${NAME} · twominute.games\n${grid} ${half(n)}/6${S.bres===1?' + bonus ⭐':''}`;
  app.innerHTML=`${hdr(S.practice&&!rev?'Practice set':'')}
  <div class="panel"><div class="score"><div class="tag">${esc(U.your)}</div><div class="big">${half(n)}<small> / 6</small>${S.bres===1?'<span class="star">⭐</span>':''}</div><p class="verdict">${esc(verdict(n))}</p>
   <div class="dots">${S.res.map(r=>`<i class="${cls(r)}"></i>`).join('')}${S.bres!=null?`<i class="${S.bres?'ok':'no'} star"></i>`:''}</div>
   <p class="best">${esc(rev?U.played:newBest?U.nbest:best?U.best(half(best)):'')}${S.bres===1&&!rev?esc(U.star):''}</p></div>
   <div class="list">${qs.map((t,k)=>{const r=k<6?S.res[k]:S.bres;return `<div class="li"><i>${r===1?(k<6?'✅':'⭐'):r===.5?'½':'❌'}</i><div>${t.ev.map(e=>esc(e[0])).join(' → ')}<br><span>${t.ev.map(e=>esc(e[2])).join(' · ')}${k===6?esc(U.btag):''}</span></div></div>`}).join('')}</div>
   <div class="btns"><button class="btn" id="share">${esc(U.share)}</button></div>
   <p class="small">${esc(U.tom)}</p><p class="small srcl"><button type="button" class="lnk" id="srcBtn">${esc(U.src[0])}</button></p></div>
  ${more()}${VIP?'<div class="btns"><button class="btn ghost" id="again">Practice set (owner only)</button></div>':''}`;
  $('#share').onclick=async()=>{try{if(navigator.share){await navigator.share({text:share+'\nhttps://twominute.games/when/'})}else{await navigator.clipboard.writeText(share+'\nhttps://twominute.games/when/');$('#share').textContent=U.copied}}catch(e){}};
  $('#srcBtn').onclick=sources;const ag=$('#again');if(ag)ag.onclick=()=>start(today()+':p'+Date.now(),true);scrollTo(0,0)}

/* Play another today: the other games on the home page, ticked when played today (Aperture and Landmarks open in this language) */
const AD=L==='en'?'':L+'/';
const OTHERS=[['Aperture','/aperture/'+AD,'aperture','aperture2-best-'],['Landmarks','/aperture/landmarks/'+AD,'landmarks','apL-best-'],['Masterpiece','/masterpiece/','masterpiece','mp-done-'],['Point to the Region','/region/','region','rg-done-'],['Film Charades','/charades/','charades','fc-done-'],['Natural Wonders','/wonders/','natural-wonders',''],['Fictional a→z','/fictional/','fictional','fictional-best-'],['Name That Classic','/classic/','classic','lclassic-done-'],['What’s That Noise?','/noise/','noise','lnoise-done-']];
function more(){return `<div class="panel more"><div class="tag">${esc(U.another)}</div><div class="mgs">${OTHERS.map(([n,h,ic,k])=>{const d=k&&ls(k+today());
  return `<a class="mg${d?' done':''}" href="${h}"><img src="/icons/${ic}-180.png?v=3" alt="" width="40" height="40"><b>${esc(n)}</b><span>${esc(d?U.done:U.go)}</span></a>`}).join('')}</div></div>`}

/* Sources: same as the Natural Wonders games. The request arrives in Messages on the stats page; the email is used only to reply, then deleted. */
function sources(){const T=U.src,ov=document.createElement('div');ov.className='srcov';
  ov.innerHTML=`<form class="srcbox" role="dialog" aria-label="${esc(T[0])}" novalidate><div class="tag">${esc(T[0])}</div><h3>${esc(NAME)}</h3><p>${esc(T[1](NAME))}</p>
   <input type="email" id="srcE" autocomplete="email" inputmode="email" maxlength="150" placeholder="${esc(T[2])}" required>
   <button type="submit" class="btn" id="srcGo">${esc(T[3])}</button>
   <p class="sm" id="srcM" aria-live="polite">${esc(T[4])} <a href="/about/#privacy" target="_blank" rel="noopener">${esc(T[5])}</a></p>
   <button type="button" class="btn ghost" id="srcX">${esc(T[10])}</button></form>`;
  document.body.appendChild(ov);const f=ov.querySelector('form'),e=ov.querySelector('#srcE'),m=ov.querySelector('#srcM'),go=ov.querySelector('#srcGo'),x=()=>ov.remove();
  ov.onclick=ev=>{if(ev.target===ov)x()};ov.querySelector('#srcX').onclick=x;setTimeout(()=>e.focus(),60);
  f.onsubmit=async ev=>{ev.preventDefault();const em=e.value.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){m.textContent=T[8];e.focus();return}
    go.disabled=true;m.textContent=T[6];const sv=v=>({stringValue:String(v)});
    const doc=k=>({fields:{kind:sv(k),message:sv((k==='sources'?'':'[Sources request] ')+'Please send the sources for When was that? ('+L.toUpperCase()+').'),contact:sv(em),game:sv(document.title.slice(0,120)),page:sv(location.pathname.slice(0,200)),where:sv('sources · when · '+L),device:sv(matchMedia('(pointer:coarse)').matches?'phone':'desktop'),ua:sv(navigator.userAgent.slice(0,300)),at:{timestampValue:new Date().toISOString()}}});
    const post=k=>fetch('https://firestore.googleapis.com/v1/projects/aperture-c0961/databases/(default)/documents/feedback?key=AIzaSyCLMslnXssvPk7S7l_0MuajudNtHRK-VAI',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(doc(k))}).then(r=>r.ok);
    let ok=false;try{ok=await post('sources');if(!ok)ok=await post('idea')}catch(err){}
    if(!ok){m.textContent=T[9];go.disabled=false;return}
    f.innerHTML=`<div class="tag">${esc(T[0])}</div><h3>✓</h3><p>${esc(T[7])}</p><button type="button" class="btn ghost" id="srcX">${esc(T[10])}</button>`;f.querySelector('#srcX').onclick=x}}

/* ---------- start page ---------- */
function dayRec(){try{const o=JSON.parse(ls(K+'-day')||'null');return o&&o.d===today()?o:null}catch(e){return null}}
function intro(){const r=dayRec(),played=!!r;
  app.innerHTML=`${hdr()}<div class="panel intro menu"><img class="gicon" src="/icons/when-180.png?v=1" alt="" width="64" height="64"><span class="tag">${esc(U.kick)}</span><h2>${esc(NAME)}</h2><p class="sub">${esc(U.tag)}</p>
   <p>${nb(U.intro)}</p>
   <ul>${U.b.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
   <div class="btns">${played?`<p class="best" style="text-align:center;margin:0">${esc(U.scored(half(r.n)))}${r.b===1?' ⭐':''}</p>`:''}<button class="btn" id="go">${esc(played?U.admire:U.play)}</button>${VIP?'<button class="btn ghost" id="again">Practice set (owner only)</button>':''}</div></div>`;
  $('#go').onclick=()=>{if(!played)return start(today(),false);
    let qs,bonus=null;if(r.t){const all=r.t.map(x=>({ev:x.map(e=>[e[0],0,e[1]])}));qs=all.slice(0,6);bonus=all[6]||null}else{const d=pick(r.d);qs=d.qs;bonus=d.bonus}
    S={seed:r.d,practice:false,qs,bonus,res:r.res,bres:r.b==null?null:r.b,over:true};end(true)};
  const ag=$('#again');if(ag)ag.onclick=()=>start(today()+':p'+Date.now(),true)}
window.__when={pick,POOL,L};
intro();
})();
