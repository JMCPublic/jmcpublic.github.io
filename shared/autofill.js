/* Natural Wonders ranking rounds (15 Nov 2026): when only one place and one answer are left, the answer drops in by
   itself, and a small line under Lock in says the places can still be changed. Only after the player places an answer:
   taking one out to change it never refills it. Rivers, Lakes, Mountains, Deserts and Forests, every language. */
(()=>{
const L=(document.documentElement.lang||'en').slice(0,2);
const HINT={en:'or tap a place to change it',de:'oder tippe auf einen Platz, um ihn zu ändern',tr:'değiştirmek için bir sıraya dokun',
  fr:'ou touchez une place pour la changer',es:'o toca un puesto para cambiarlo',pt:'ou toque numa posição para mudar'}[L]||'or tap a place to change it';
const st=document.createElement('style');
st.textContent='.afhint{text-align:center;font-size:12.5px;color:var(--muted,#6f685d);margin:6px 0 0}';
document.head.appendChild(st);
let last={key:'',filled:0};
function run(){
  const rank=document.querySelector('.play .rank');if(!rank)return;
  const slots=[...rank.querySelectorAll('.slot')],tiles=[...rank.querySelectorAll('.tile')];if(!slots.length||!tiles.length)return;
  const now=document.querySelector('.prog .now'),key=(now?[...now.parentNode.children].indexOf(now):-1)+'|'+location.pathname;
  const filled=slots.filter(s=>s.classList.contains('full')||s.classList.contains('fixed')).length;
  const empty=slots.length-filled,free=tiles.filter(t=>!t.classList.contains('used'));
  const placedOne=key===last.key&&filled>last.filled;
  last={key,filled};
  if(placedOne&&empty===1&&free.length===1){free[0].click();return}
  const btn=rank.querySelector('.btn');
  if(btn&&!btn.disabled&&empty===0&&!rank.querySelector('.afhint')){const p=document.createElement('p');p.className='afhint';p.textContent=HINT;btn.after(p)}
}
let q=0;new MutationObserver(()=>{if(!q)q=requestAnimationFrame(()=>{q=0;run()})}).observe(document.body,{childList:true,subtree:true});
})();
