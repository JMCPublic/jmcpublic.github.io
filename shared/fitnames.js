/* Natural Wonders name fitting (14 Nov 2026).
   Rule: a place name never breaks in the middle of a word, and takes at most two lines.
   If it would need more, or one word is too long for its box, the text gets smaller (down to 11px). */
(()=>{
const SEL='.fill b,.choice b,.tile,.cc .nm,.pr .nm,.oc .nm,.tn';
const st=document.createElement('style');
st.textContent=`.fill b,.choice b,.tile,.cc .nm,.pr .nm,.oc .nm,.tn{overflow-wrap:normal!important;word-break:normal!important;hyphens:manual!important}
.fill{flex-wrap:wrap;row-gap:2px}.fill b{flex:1 1 auto;min-width:0}`;
document.head.appendChild(st);
// how many lines the text (not the letter plates or tags) actually takes
function lines(el){let tops=new Set();const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement.closest('.plate,.given,.x,.tick,.key')?NodeFilter.FILTER_REJECT:(n.textContent.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT)});
  let n;while(n=w.nextNode()){const r=document.createRange();r.selectNodeContents(n);for(const q of r.getClientRects())if(q.width>1)tops.add(Math.round(q.top))}
  // rects on the same line can differ by a pixel or two
  const t=[...tops].sort((a,b)=>a-b);let c=0,last=-99;for(const y of t){if(y-last>4)c++;last=y}return c}
function fitOne(el){el.style.fontSize='';const base=parseFloat(getComputedStyle(el).fontSize);let fs=base;
  const bad=()=>lines(el)>2||el.scrollWidth>el.clientWidth+1;
  while(bad()&&fs>11){fs-=1;el.style.fontSize=fs+'px'}}
let t=0;function run(){t=0;document.querySelectorAll(SEL).forEach(el=>{if(el.offsetParent)fitOne(el)})}
function soon(){if(!t)t=requestAnimationFrame(run)}
new MutationObserver(m=>{if(m.some(x=>x.type==='childList'))soon()}).observe(document.body,{childList:true,subtree:true});
addEventListener('resize',soon);if(document.fonts)document.fonts.ready.then(soon);soon();
})();
