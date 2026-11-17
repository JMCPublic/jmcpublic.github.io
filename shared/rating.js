/* Goldilocks rating on the Natural Wonders results card (15 Nov 2026, approved): "How was that?" with three one-tap answers.
   Asked once per game per device per day, never during a round, never in the way of the buttons. */
(()=>{
const L=(document.documentElement.lang||'en').slice(0,2);
const G=(location.pathname.match(/natural-wonders-([a-z-]+)/)||[])[1]||window.TMG_GAME||'';
const TP={en:{rivers:'rivers',lakes:'lakes',mountains:'mountains',deserts:'deserts',forests:'forests','bodies-of-water':'oceanography','river-cities':'river cities',masterbrain:'everything',_:'geography'},
 de:{rivers:'Flüssen',lakes:'Seen',mountains:'Bergen',deserts:'Wüsten',forests:'Wäldern','bodies-of-water':'Ozeanografie','river-cities':'Flussstädten',masterbrain:'allem',_:'Geografie'},
 tr:{rivers:'nehirler',lakes:'göller',mountains:'dağlar',deserts:'çöller',forests:'ormanlar','bodies-of-water':'oşinografi','river-cities':'nehir şehirleri',masterbrain:'her şey',_:'coğrafya'},
 fr:{rivers:'fleuves',lakes:'lacs',mountains:'montagnes',deserts:'déserts',forests:'forêts','bodies-of-water':'océanographie','river-cities':'villes fluviales',masterbrain:'tout',_:'géographie'},
 es:{rivers:'ríos',lakes:'lagos',mountains:'montañas',deserts:'desiertos',forests:'bosques','bodies-of-water':'oceanografía','river-cities':'ciudades fluviales',masterbrain:'todo',_:'geografía'},
 pt:{rivers:'rios',lakes:'lagos',mountains:'montanhas',deserts:'desertos',forests:'florestas','bodies-of-water':'oceanografia','river-cities':'cidades fluviais',masterbrain:'tudo',_:'geografia'}};
const tp=(TP[L]||TP.en),TOPIC=tp[G]||tp._;
const TT={en:['How was that?','Too tough',`I don't have a degree in ${TOPIC}!`,'Too easy','At least try and challenge me','Just right','You have found my level','Thanks! We use this to get the levels right.'],
 de:['Wie war das?','Zu schwer',`Ich habe kein Diplom in ${TOPIC}!`,'Zu leicht','Fordere mich wenigstens ein bisschen','Genau richtig','Du hast mein Niveau gefunden','Danke! So stimmen wir die Stufen ab.'],
 tr:['Nasıldı?','Çok zor',`${TOPIC} konusunda diplomam yok!`,'Çok kolay','En azından beni biraz zorla','Tam kararında','Seviyemi buldun','Teşekkürler! Bununla seviyeleri ayarlıyoruz.'],
 fr:['C’était comment ?','Trop dur',`Je n’ai pas de diplôme en ${TOPIC} !`,'Trop facile','Essaie au moins de me mettre au défi','Parfait','Tu as trouvé mon niveau','Merci ! Cela nous aide à régler les niveaux.'],
 es:['¿Qué tal?','Demasiado difícil',`¡No tengo un título en ${TOPIC}!`,'Demasiado fácil','Al menos intenta desafiarme','Perfecto','Has encontrado mi nivel','¡Gracias! Así ajustamos los niveles.'],
 pt:['Que tal foi?','Difícil demais',`Não tenho um diploma em ${TOPIC}!`,'Fácil demais','Pelo menos tenta desafiar-me','Na medida certa','Encontraste o meu nível','Obrigado! Usamos isto para acertar os níveis.']}[L]||null;
if(!TT)return;
const T={q:TT[0],a:[['tough',TT[1],TT[2]],['easy',TT[3],TT[4]],['right',TT[5],TT[6]]],ty:TT[7]};
const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
const DAY=new Date().toISOString().slice(0,10),KEY='tmg-rate-'+G;
const st=document.createElement('style');
st.textContent=`.gl{margin:14px 0 4px;padding:12px;border:1.5px solid var(--line,#e6e0d4);border-radius:16px;background:#fffdf8}
.gl h4{margin:0 0 8px;font:600 15px Inter,system-ui,sans-serif;text-align:center}
.gl .gb{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.gl button{border:1.5px solid var(--line,#e6e0d4);background:#fff;border-radius:12px;padding:8px 4px;cursor:pointer;font:600 14px Inter,system-ui,sans-serif;color:var(--ink,#16130f);display:flex;flex-direction:column;align-items:center;gap:3px}
.gl button small{font-weight:500;font-size:11px;line-height:1.25;color:var(--muted,#6f685d);text-align:center}
.gl button:hover{border-color:var(--ink,#16130f)}
.gl .ty{text-align:center;font-size:14px;color:var(--muted,#6f685d);margin:2px 0}`;
document.head.appendChild(st);
function run(){if(window.top!==window)return;const sc=document.querySelector('#app .panel .score');if(!sc)return;const panel=sc.closest('.panel');if(!panel||panel.querySelector('.gl'))return;
  if(ls(KEY)===DAY&&!/[?&]rate=1/.test(location.search))return;
  const d=document.createElement('div');d.className='gl';
  d.innerHTML=`<h4>${T.q}</h4><div class="gb">${T.a.map(([k,a,s])=>`<button type="button" data-k="${k}">${a}<small>${s}</small></button>`).join('')}</div>`;
  d.querySelectorAll('button').forEach(b=>b.onclick=()=>{ls(KEY,DAY);d.innerHTML=`<p class="ty">${T.ty}</p>`;try{window.tmgReach&&tmgReach.bump&&tmgReach.bump({[`rate.${G.replace(/-/g,'_')}_${b.dataset.k}`]:1})}catch(e){}});
  const row=panel.querySelector('.row');const after=row&&row.nextElementSibling&&row.nextElementSibling.classList.contains('endsrc')?row.nextElementSibling:row;if(after)after.after(d);else sc.after(d)}
let q=0;new MutationObserver(()=>{if(!q)q=requestAnimationFrame(()=>{q=0;run()})}).observe(document.body,{childList:true,subtree:true});
})();
