/* Keeps the quote and "On this day" cards readable: if the words don't fit their card, the text is made a little smaller (never below 65%) instead of running over the label. */
(()=>{if(window.tmgFitQ)return;window.tmgFitQ=1;
const SEL='blockquote,figcaption,p,.label';let busy=false;
function fitAll(){const els=[...document.querySelectorAll('#qwrap .quote,#qwrap .fact')].filter(e=>!e.hidden);
  const sets=els.map(el=>{const kids=[...el.querySelectorAll(SEL)];kids.forEach(k=>k.style.fontSize='');return {el,kids,base:kids.map(k=>parseFloat(getComputedStyle(k).fontSize))}});
  const over=x=>x.el.scrollHeight>x.el.clientHeight+1||x.kids.some(k=>k.scrollHeight>k.clientHeight+2&&getComputedStyle(k).overflow==='hidden');
  const apply=(x,s)=>x.kids.forEach((k,i)=>k.style.fontSize=(x.base[i]*s).toFixed(1)+'px');
  // shrink each card only as far as it needs, then give both cards the same scale so they look like a pair
  let low=1;sets.forEach(x=>{if(x.el.clientHeight===0)return;let s=1;while(over(x)&&s>.66){s-=.03;apply(x,s)}low=Math.min(low,s)});
  sets.forEach(x=>{if(low<1)apply(x,low)})}
function fit(){if(busy)return;busy=true;fitAll();setTimeout(()=>busy=false,40)}
let t;const soon=()=>{clearTimeout(t);t=setTimeout(fit,60)};
function start(){const q=document.getElementById('qwrap');if(!q)return;new MutationObserver(m=>{if(!busy)soon()}).observe(q,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['hidden','class']});
  addEventListener('resize',soon);if(document.fonts)document.fonts.ready.then(soon);soon()}
if(document.readyState==='loading')addEventListener('DOMContentLoaded',start);else start();
})();
