/* Best-score line (15 Nov 2026): one line on every end card that picks the right message.
   "Best score ever!" · "Best score today!" · "Not quite – your earlier score today was X" · "Not quite – your best ever is X"
   Aperture calls tmgBest() (lower time is better). Natural Wonders gets the line added under the score automatically.
   Stored on this device only, in tmg-best. */
(()=>{
if(window.tmgBest)return;
const L=(document.documentElement.lang||'en').slice(0,2);
const W={en:['🏆 Best score ever!','⭐ Best score today!','Not quite – your earlier score today was {x}','Not quite – your best ever is {x}'],
 de:['🏆 Dein bestes Ergebnis aller Zeiten!','⭐ Dein bestes Ergebnis heute!','Knapp daneben – dein früheres Ergebnis heute war {x}','Knapp daneben – dein Bestwert ist {x}'],
 tr:['🏆 Tüm zamanların en iyi skoru!','⭐ Bugünün en iyi skoru!','Tam olmadı – bugünkü önceki skorun {x}','Tam olmadı – en iyi skorun {x}'],
 fr:['🏆 Ton meilleur score de tous les temps !','⭐ Ton meilleur score du jour !','Pas tout à fait – ton score précédent aujourd’hui était {x}','Pas tout à fait – ton record est {x}'],
 es:['🏆 ¡Tu mejor puntuación de siempre!','⭐ ¡Tu mejor puntuación de hoy!','Casi – tu puntuación anterior de hoy fue {x}','Casi – tu récord es {x}'],
 pt:['🏆 A tua melhor pontuação de sempre!','⭐ A tua melhor pontuação de hoje!','Quase – a tua pontuação anterior hoje foi {x}','Quase – o teu recorde é {x}']}[L]||null;
const T=W||['🏆 Best score ever!','⭐ Best score today!','Not quite – your earlier score today was {x}','Not quite – your best ever is {x}'];
const day=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const load=()=>{try{return JSON.parse(localStorage.getItem('tmg-best'))||{}}catch(e){return{}}};
const save=o=>{try{localStorage.setItem('tmg-best',JSON.stringify(o))}catch(e){}};
/* game: a name; v: the number to compare; txt: how to show it; low: true when lower is better; seed: earlier best {v,txt} from before this line existed */
window.tmgBest=(game,v,txt,low,seed)=>{const all=load(),g=all[game]||{};const better=(a,b)=>b==null||(low?a<b:a>b);
  if(g.ev==null&&seed&&seed.v!=null){g.ev=seed.v;g.et=seed.txt}
  const today=day(),hadToday=g.d===today&&g.dv!=null;let kind,x='';
  if(better(v,g.ev))kind=0;
  else if(hadToday){if(better(v,g.dv))kind=1;else{kind=2;x=g.dt}}
  else{kind=3;x=g.et}
  if(better(v,g.ev)){g.ev=v;g.et=txt}
  if(!hadToday||better(v,g.dv)){g.d=today;g.dv=v;g.dt=txt}
  all[game]=g;save(all);
  return {kind,text:T[kind].replace('{x}',x)}};
const st=document.createElement('style');
st.textContent=`.bestln{margin:8px 0 2px;padding:8px 12px;border-radius:12px;font:600 14.5px/1.35 Inter,system-ui,sans-serif;background:#f6f3ec;color:var(--ink,#16130f)}.bestln.k0,.bestln.k1{background:#eef7f0;color:#1f5a35}.bestln.k2,.bestln.k3{font-weight:500;color:var(--muted,#6f685d)}`;
document.head.appendChild(st);
/* Natural Wonders: under the score on the results card (not inside Masterbrain's frames, which have their own total) */
const G=(location.pathname.match(/natural-wonders-([a-z-]+)/)||[])[1];
if(!G||window.top!==window)return;
let cur=null,res=null;
function run(){const big=document.querySelector('.score .big');if(!big){cur=null;res=null;return}
  const m=big.textContent.match(/(\d+)\s*\/\s*(\d+)/);if(!m)return;
  if(cur!==big.textContent||!res){if(cur===big.textContent&&res)return;cur=big.textContent;const r=+m[1],t=+m[2],pct=t?Math.round(r/t*100):0;
    let seed=null;try{const nr=JSON.parse(localStorage.getItem('nw_record')||'{}');const gg=nr.games&&nr.games[G];if(gg&&gg.played>1&&gg.bestTxt)seed={v:gg.best,txt:gg.bestTxt}}catch(e){}
    res=tmgBest('nw-'+G,pct,r+'/'+t,false,seed)}
  const box=big.parentElement;if(box.parentElement.querySelector('.bestln'))return;
  const p=document.createElement('p');p.className='bestln k'+res.kind;p.textContent=res.text;box.after(p)}
let q=0;new MutationObserver(()=>{if(!q)q=requestAnimationFrame(()=>{q=0;run()})}).observe(document.body,{childList:true,subtree:true});run();
})();
