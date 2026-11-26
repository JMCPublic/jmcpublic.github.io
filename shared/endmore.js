/* Aperture and Landmarks in the house style (17 Nov 2026, mock-up approved by Jonathan): under the score card,
   Goldilocks "How was that?" and the same "Play another today" list as the Natural Wonders games.
   Appears once the day's set is finished (body.done), in the page's language. Counts go to Reach (rate.aperture_* / rate.landmarks_*). */
(()=>{
if(window.tmgEndMore||window.top!==window)return;window.tmgEndMore=1;
const D=document,P=location.pathname,LM=/\/landmarks\//.test(P),GAME=LM?'landmarks':'aperture';
const L=((D.documentElement.lang||'en').slice(0,2).toLowerCase());
const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const TOPIC={en:['everyday objects','landmarks'],de:['Alltagsdingen','Wahrzeichen'],tr:['gündelik eşyalar','simge yapılar'],fr:['objets du quotidien','monuments'],es:['objetos cotidianos','monumentos'],pt:['objetos do dia a dia','monumentos']}[L]||['everyday objects','landmarks'];
const TP=TOPIC[LM?1:0];
const TT={en:['How was that?','Too tough',`I don't have a degree in ${TP}!`,'Too easy','At least try and challenge me','Just right','You have found my level','Thanks! We use this to get the levels right.','Play another today','All done for today',k=>`${k} more game${k>1?'s':''} to play today.`,'You’ve played every game today. Brilliant. New ones at midnight.','Play'],
 de:['Wie war das?','Zu schwer',`Ich habe kein Diplom in ${TP}!`,'Zu leicht','Fordere mich wenigstens ein bisschen','Genau richtig','Du hast mein Niveau gefunden','Danke! So stimmen wir die Stufen ab.','Spiel heute noch eins','Für heute alles gespielt',k=>`Noch ${k} Spiel${k>1?'e':''} für heute.`,'Du hast heute alle Spiele gespielt. Klasse. Neue um Mitternacht.','Spielen'],
 tr:['Nasıldı?','Çok zor',`${TP} konusunda diplomam yok!`,'Çok kolay','En azından beni biraz zorla','Tam kararında','Seviyemi buldun','Teşekkürler! Bununla seviyeleri ayarlıyoruz.','Bugün bir tane daha oyna','Bugünlük hepsi tamam',k=>`Bugün oynanacak ${k} oyun daha var.`,'Bugün tüm oyunları oynadın. Harika. Yenileri gece yarısı.','Oyna'],
 fr:['C’était comment ?','Trop dur',`Je n’ai pas de diplôme en ${TP} !`,'Trop facile','Essaie au moins de me mettre au défi','Parfait','Tu as trouvé mon niveau','Merci ! Cela nous aide à régler les niveaux.','Joue à un autre aujourd’hui','Tout est joué pour aujourd’hui',k=>`Encore ${k} jeu${k>1?'x':''} à jouer aujourd’hui.`,'Tu as joué à tous les jeux aujourd’hui. Bravo. Nouveaux jeux à minuit.','Jouer'],
 es:['¿Qué tal?','Demasiado difícil',`¡No tengo un título en ${TP}!`,'Demasiado fácil','Al menos intenta desafiarme','Perfecto','Has encontrado mi nivel','¡Gracias! Así ajustamos los niveles.','Juega otro hoy','Todo jugado por hoy',k=>`Te ${k>1?'quedan':'queda'} ${k} juego${k>1?'s':''} por hoy.`,'Has jugado todos los juegos hoy. Genial. Nuevos a medianoche.','Jugar'],
 pt:['Que tal foi?','Difícil demais',`Não tenho um diploma em ${TP}!`,'Fácil demais','Pelo menos tenta desafiar-me','Na medida certa','Encontraste o meu nível','Obrigado! Usamos isto para acertar os níveis.','Joga outro hoje','Tudo jogado por hoje',k=>`Falta${k>1?'m':''} ${k} jogo${k>1?'s':''} para hoje.`,'Jogaste todos os jogos hoje. Brilhante. Novos à meia-noite.','Jogar']}[L]||null;
if(!TT)return;
/* every daily game, with where it lives and how today's result is stored on this device */
const N={en:['Aperture','Landmarks','When was that?','Masterpiece','Rivers','Lakes','Bodies of Water','Mountains','Deserts','Forests','River Cities','Where is Bigger?','Which of Three?','How Many Borders?','Masterbrain'],
 de:['Aperture','Landmarks','When was that?','Masterpiece','Flüsse','Seen','Gewässer','Berge','Wüsten','Wälder','Flussstädte','Wo ist es größer?','Welches von dreien?','Wie viele Grenzen?','Masterbrain'],
 tr:['Aperture','Landmarks','When was that?','Masterpiece','Nehirler','Göller','Su Kütleleri','Dağlar','Çöller','Ormanlar','Nehir Şehirleri','Hangisi Daha Büyük?','Üçünden Hangisi?','Kaç Sınır?','Masterbrain'],
 fr:['Aperture','Landmarks','C’était quand ?','Masterpiece','Fleuves','Lacs','Étendues d’eau','Montagnes','Déserts','Forêts','Villes fluviales','Lequel est le plus grand ?','Lequel des trois ?','Combien de frontières ?','Masterbrain'],
 es:['Aperture','Landmarks','¿Cuándo fue?','Masterpiece','Ríos','Lagos','Masas de agua','Montañas','Desiertos','Bosques','Ciudades fluviales','¿Cuál es más grande?','¿Cuál de los tres?','¿Cuántas fronteras?','Masterbrain'],
 pt:['Aperture','Landmarks','When was that?','Masterpiece','Rios','Lagos','Massas de água','Montanhas','Desertos','Florestas','Cidades ribeirinhas','Qual é maior?','Qual dos três?','Quantas fronteiras?','Masterbrain']}[L]||[];
const K=['aperture','landmarks','when','masterpiece','rivers','lakes','bodies-of-water','mountains','deserts','forests','river-cities','where-is-bigger','which-of-five','how-many-borders','masterbrain'];
const LANGDIR=['de','tr','fr','es','pt'].includes(L)?L+'/':'';
const url=k=>k==='when'?'/when/':k==='masterpiece'?'/masterpiece/':k==='aperture'?'/aperture/'+LANGDIR:k==='landmarks'?'/aperture/landmarks/'+LANGDIR:'/natural-wonders-'+k+'/';
function status(k){const t=today();
  if(k==='when'||k==='masterpiece'){const n=ls((k==='when'?'when-done-':'mp-done-')+t);return n!==null&&n!==undefined?'✓ '+n+(k==='masterpiece'?' / 20':''):null}  /* When was that? and Masterpiece (26 Nov) */
  if(k==='aperture'||k==='landmarks'){try{const r=JSON.parse(ls((k==='aperture'?'ap2-day-':'apL-day-')+t)||'null');return r?'✓ '+r.t:null}catch(e){return null}}
  try{const r=JSON.parse(ls('s'+k+'-day')||'null');return r&&r.d===t?'✓ '+r.n+' / 10':null}catch(e){return null}}
const st=D.createElement('style');
st.textContent=`.tmgem{max-width:520px;margin:14px auto 6px;padding:0 2px;font-family:Inter,system-ui,sans-serif;color:var(--ink,#16181d)}
.tmgem .gl{padding:12px;border:1.5px solid var(--line,#dfe3ea);border-radius:16px;background:#fffdf8;margin-bottom:12px}
.tmgem .gl h4{margin:0 0 8px;font:600 15px Inter,system-ui,sans-serif;text-align:center}
.tmgem .gb{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.tmgem .gb button{display:flex;flex-direction:column;align-items:center;gap:2px;background:#fff;border:1.5px solid var(--line,#dfe3ea);border-radius:12px;padding:8px 4px;font:700 13.5px Inter,system-ui,sans-serif;color:inherit;cursor:pointer}
.tmgem .gb small{font-weight:500;font-size:11px;line-height:1.25;color:var(--muted,#5b606b);text-align:center}.tmgem .ty{text-align:center;font-size:14px;color:var(--muted,#5b606b);margin:2px 0}
.tmgem .more{background:#fff;border:1.5px solid var(--line,#dfe3ea);border-radius:20px;padding:16px}
.tmgem .tg{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--blue,#2b50e0)}.tmgem .ms{color:var(--muted,#5b606b);font-size:14px;margin:4px 0 10px}
.tmgem .mg{display:flex;align-items:center;gap:12px;text-decoration:none;color:inherit;border:1.5px solid var(--line,#dfe3ea);border-radius:14px;padding:8px 12px;margin-top:7px;background:#fff}
.tmgem .mg img{width:40px;height:40px;border-radius:10px;flex:none}.tmgem .mg b{flex:1;font-size:15.5px}.tmgem .mg span{font-size:13.5px;font-weight:700;color:var(--blue,#2b50e0)}
.tmgem .mg.done{background:#f3f5f9}.tmgem .mg.done span{color:#1f7a4a}`;
D.head.appendChild(st);
function build(){if(D.querySelector('.tmgem'))return;
  const anchor=D.querySelector('main.phones')||D.getElementById('viewer');if(!anchor)return;
  const box=D.createElement('section');box.className='tmgem';
  const KEY='tmg-rate-'+GAME,DAY=new Date().toISOString().slice(0,10);
  const gl=ls(KEY)===DAY?'':`<div class="gl"><h4>${esc(TT[0])}</h4><div class="gb">${[['tough',1],['easy',3],['right',5]].map(([k,i])=>`<button type="button" data-k="${k}">${esc(TT[i])}<small>${esc(TT[i+1])}</small></button>`).join('')}</div></div>`;
  const rows=K.filter(k=>k!==GAME).map(k=>{const s=status(k),i=K.indexOf(k);return `<a class="mg${s?' done':''}" href="${url(k)}"><img src="/icons/${k}-180.png?v=3" alt="" width="40" height="40"><b>${esc(N[i]||k)}</b><span>${esc(s||TT[12])}</span></a>`}).join('');
  const left=K.filter(k=>k!==GAME&&!status(k)).length;
  box.innerHTML=gl+`<div class="more"><div class="tg">${esc(left?TT[8]:TT[9])}</div><p class="ms">${esc(left?TT[10](left):TT[11])}</p>${rows}</div>`;
  anchor.after(box);
  box.querySelectorAll('.gb button').forEach(b=>b.onclick=()=>{ls(KEY,DAY);b.closest('.gl').innerHTML=`<p class="ty">${esc(TT[7])}</p>`;try{window.tmgReach&&tmgReach.bump&&tmgReach.bump({[`rate.${GAME}_${b.dataset.k}`]:1})}catch(e){}})}
function chk(){if(D.body.classList.contains('done'))build();else{const b=D.querySelector('.tmgem');if(b)b.remove()}}
new MutationObserver(chk).observe(D.body,{attributes:true,attributeFilter:['class']});chk();
})();
