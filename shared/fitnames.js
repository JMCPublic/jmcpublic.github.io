/* Natural Wonders name fitting (14-15 Nov 2026).
   Rule: a place name fits on one line, or two where there is a logical break, never in the middle of a word.
   Words that belong together stay together ("rain forests", "National Park", "(Carstensz Pyramid)", "and State Parks"),
   the two lines are balanced, and if it still needs more room the text gets smaller (down to 11px). */
(()=>{
const SEL='.fill b,.choice b,.tile,.cc .nm,.pr .nm,.oc .nm,.tn';
const st=document.createElement('style');
st.textContent=`.fill b,.choice b,.tile,.cc .nm,.pr .nm,.oc .nm,.tn{overflow-wrap:normal!important;word-break:normal!important;hyphens:manual!important;text-wrap:balance}
.fill{flex-wrap:wrap;row-gap:2px}.fill b{flex:1 1 0;min-width:0}.fill .given{margin-left:auto}`;
document.head.appendChild(st);

// keep phrases together with no-break spaces: words in brackets, "and X", and a closing place word with the word before it
const NOUN=/^(forests?|rainforests?|parks?|reserves?|lakes?|seas?|rivers?|deserts?|mountains?|mount|ranges?|bays?|gulfs?|straits?|basins?|falls|islands?|peaks?|plateaus?|canyons?|glaciers?|woods?|channels?|sounds?|lagoons?|reefs?)$/i;
function glue(t){if(!/ /.test(t))return t;
  t=t.replace(/\(([^)]*)\)/g,(m,x)=>'('+x.replace(/ /g,'\u00a0')+')');
  t=t.replace(/\b(and|of|de|del|la|le|des|du|von|der|das) (\S+)/gi,(m,a,b)=>a+'\u00a0'+b);
  const w=t.split(' ');if(w.length>=3&&NOUN.test(w[w.length-1].replace(/[^\p{L}]/gu,''))){const l=w.pop();w[w.length-1]+='\u00a0'+l}
  return w.join(' ')}
function glueEl(el){if(el.dataset.glued)return;el.dataset.glued='1';const tw=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;const list=[];while(n=tw.nextNode())if(!n.parentElement.closest('.plate,.given,.x,.tick,.key'))list.push(n);list.forEach(n=>{const g=glue(n.textContent);if(g!==n.textContent)n.textContent=g})}
// how many lines the text (not the letter plates or tags) actually takes
function lines(el){let tops=new Set();const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement.closest('.plate,.given,.x,.tick,.key')?NodeFilter.FILTER_REJECT:(n.textContent.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT)});
  let n;while(n=w.nextNode()){const r=document.createRange();r.selectNodeContents(n);for(const q of r.getClientRects())if(q.width>1)tops.add(Math.round(q.top))}
  // rects on the same line can differ by a pixel or two
  const t=[...tops].sort((a,b)=>a-b);let c=0,last=-99;for(const y of t){if(y-last>4)c++;last=y}return c}
function fitOne(el){glueEl(el);el.style.fontSize='';const base=parseFloat(getComputedStyle(el).fontSize);let fs=base;
  const bad=()=>lines(el)>2||el.scrollWidth>el.clientWidth+1;
  while(bad()&&fs>11){fs-=1;el.style.fontSize=fs+'px'}}
// the game title in the bar above a round stays on one line beside ♫ and Quit (long titles such as "Lequel est le plus grand ?")
function fitTitle(top){const h=top.querySelector('h1');if(!h)return;h.style.fontSize='';h.style.whiteSpace='nowrap';let fs=parseFloat(getComputedStyle(h).fontSize);
  const over=()=>top.scrollWidth>top.clientWidth+1||h.scrollWidth>h.clientWidth+1;
  const wraps=()=>{const r=top.querySelector('.row');return r&&r.getBoundingClientRect().top>h.getBoundingClientRect().bottom-4};
  while((over()||wraps())&&fs>15){fs-=1;h.style.fontSize=fs+'px'}}
let t=0;function run(){t=0;document.querySelectorAll(SEL).forEach(el=>{if(el.offsetParent)fitOne(el)});document.querySelectorAll('.play .top').forEach(fitTitle)}
function soon(){if(!t)t=requestAnimationFrame(run)}
new MutationObserver(m=>{if(m.some(x=>x.type==='childList'))soon()}).observe(document.body,{childList:true,subtree:true});
addEventListener('resize',soon);if(document.fonts)document.fonts.ready.then(soon);soon();
})();
