/* Natural Wonders results card (15 Nov 2026), every game and language:
   - "Play again" gets "(same settings)" underneath; "Change settings" becomes a second "Play again" with "(change settings)"
   - Sources leaves the row of buttons and sits underneath as a small link
   - the round-by-round list is headed "Results (Round by round)"
   The words under the buttons are drawn with CSS, so the buttons' own text stays the same for the rest of the page's code. */
(()=>{
const L=(document.documentElement.lang||'en').slice(0,2);
const W={en:['same settings','change settings','Results'],de:['gleiche Einstellungen','Einstellungen ändern','Ergebnisse'],tr:['aynı ayarlar','ayarları değiştir','Sonuçlar'],
  fr:['mêmes réglages','modifier les réglages','Résultats'],es:['mismos ajustes','cambiar ajustes','Resultados'],pt:['mesmas configurações','mudar configurações','Resultados']}[L]||['same settings','change settings','Results'];
const RBR=/^(Round by round|Runde für Runde|Tur tur|Manche par manche|Ronda a ronda|Rodada a rodada)$/;
const st=document.createElement('style');
st.textContent=`.btn[data-sub]{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.15}
.btn[data-sub]::after{content:'(' attr(data-sub) ')';display:block;font-size:12px;font-weight:500;opacity:.8;margin-top:2px;white-space:nowrap}
.endsrc{margin:10px 0 0;text-align:center}.endsrc .srclink{background:none;border:0;padding:4px;font:500 14px Inter,system-ui,sans-serif;color:var(--muted,#6f685d);text-decoration:underline;cursor:pointer}
.rbrh{font:inherit}.rbrh small{font-size:.85em;font-weight:500;opacity:.75;margin-left:4px}`;
document.head.appendChild(st);
function run(){
  document.querySelectorAll('.row').forEach(row=>{
    const btns=[...row.querySelectorAll('button')];
    const again=btns.find(b=>/^(startGame|start)\(\)$/.test(b.getAttribute('onclick')||''));
    const change=btns.find(b=>(b.getAttribute('onclick')||'')==='quit()');
    if(!again||!change||row.dataset.ec)return;row.dataset.ec='1';
    again.dataset.sub=W[0];
    change.textContent=again.textContent;change.dataset.sub=W[1];
    const src=btns.find(b=>/^openSources\(\)$/.test(b.getAttribute('onclick')||'')&&b.classList.contains('btn'));
    if(src){const p=document.createElement('p');p.className='endsrc';src.className='srclink';p.append(src);row.after(p)}
  });
  document.querySelectorAll('.label').forEach(l=>{if(l.dataset.ec||!RBR.test(l.textContent.trim()))return;l.dataset.ec='1';const t=l.textContent.trim();l.innerHTML=`<span class="rbrh">${W[2]} <small>(${t})</small></span>`});
}
let q=0;new MutationObserver(()=>{if(!q)q=requestAnimationFrame(()=>{q=0;run()})}).observe(document.body,{childList:true,subtree:true});run();
})();
