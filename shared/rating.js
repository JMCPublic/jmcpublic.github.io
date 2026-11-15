/* Goldilocks rating on the Natural Wonders results card (mock-up, 15 Nov 2026): "How was that?" with three one-tap answers.
   Asked once per game per device per day, never during a round, never in the way of the buttons. */
(()=>{
const L=(document.documentElement.lang||'en').slice(0,2);if(L!=='en')return; /* translations come after approval */
const G=(location.pathname.match(/natural-wonders-([a-z-]+)/)||[])[1]||'';
const TOPIC={rivers:'rivers',lakes:'lakes',mountains:'mountains',deserts:'deserts',forests:'forests','bodies-of-water':'oceanography','river-cities':'river cities',masterbrain:'everything'}[G]||'geography';
const T={q:'How was that?',a:[['tough','Too tough',`I don't have a degree in ${TOPIC}!`],['easy','Too easy','At least try and challenge me'],['right','Just right','You have found my level']],ty:'Thanks! We use this to get the levels right.'};
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
