/* Simple games engine (built on the shadow site 17 Nov 2026, live the same day). Started as simple Rivers, approved by Jonathan 17 Nov:
   "great game play and a bit of knowledge and comment as you go... this is the level and format we go for".
   One thing lights up on a map; pick its name from three. Ten a day, the same for everyone (4 warm-ups,
   3 think-about-its, 3 clever ones), a fact after every answer, a friendly score at the end.
   Each game page sets CFG = {key, name, q, noun, intro} and loads its data.js (SG = {views, q}). */
(()=>{
const app=document.getElementById('app'),$=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
const K='s'+CFG.key;
const I=window.TMGI||{L:'en',U:null,G:()=>null,QQ:s=>s},U=I.U,L=I.L,GI=I.G(CFG.key);
if(GI)Object.assign(CFG,{name:GI[0],q:GI[1],next:GI[2],noun:GI[3],intro:GI[4]});
const nm=x=>(SG.tr&&SG.tr[L]&&SG.tr[L][x])||x;  /* place names in the player's language */
const gname=k=>{const g=I.G(k);return g?g[0]:k};
/* the date, the way the player's country writes it (17 Nov, Jonathan): Tue 17 Nov, Di., 17. Nov., 17 Kas Sal... */
const LOC=(()=>{const n=navigator.language||'';return n.toLowerCase().startsWith(L)?n:({en:'en-GB',de:'de-DE',tr:'tr-TR',fr:'fr-FR',es:'es-ES',pt:'pt-PT'})[L]})();
const dateTxt=()=>{try{return new Date().toLocaleDateString(LOC,{weekday:'short',day:'numeric',month:'short'})}catch(e){return U.today}};
const gameUrl=k=>(CFG.base||'/natural-wonders-')+k+'/';
const VIP=ls('ap-vip')==='1';  /* the owner's devices can play extra practice sets for testing */
const GAMES=[['rivers','Rivers'],['lakes','Lakes'],['bodies-of-water','Bodies of Water'],['mountains','Mountains'],['deserts','Deserts'],['forests','Forests'],['river-cities','River Cities'],['where-is-bigger','Where is Bigger?'],['which-of-five','Which of Three?'],['how-many-borders','How Many Borders?'],['masterbrain','Masterbrain']];
const dayRec=k=>{const raw=ls('s'+k+'-day')||'';try{const o=JSON.parse(raw);if(o&&o.d)return o}catch(e){}const p=raw.split(':');return p[0]?{d:p[0],n:+p[1]}:null};
const playedToday=k=>{const r=dayRec(k);return r&&r.d===today()?r:null};
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
function rng(seed){let h=1779033703^seed.length;for(let i=0;i<seed.length;i++){h=Math.imul(h^seed.charCodeAt(i),3432918353);h=h<<13|h>>>19}
  return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return((h^=h>>>16)>>>0)/4294967296}}
const shuffle=(a,r)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const art=a=>L!=='en'?'':(CFG.the===true||(CFG.theRe&&new RegExp(CFG.theRe).test(a)))?'the ':'';
const MIX={1:4,2:3,3:3},LV={1:U.lv[0],2:U.lv[1],3:U.lv[2]};
const MB=!!CFG.mb,MBC=MB?{name:CFG.name,noun:CFG.noun,next:CFG.next}:null;
function loadGame(g){return new Promise((res,rej)=>{if(window.SGD&&SGD[g])return res(SGD[g]);const sc=document.createElement('script');sc.src='/simple/data/'+g+'.js?v='+(CFG.mbv||1);sc.onload=()=>{if(CUR)window.SG=SGD[CUR];res(SGD[g])};sc.onerror=rej;document.head.appendChild(sc)})}
let CUR=null;
function useGame(g){CUR=g;window.SG=SGD[g];const gi=I.G(g)||[];Object.assign(CFG,{q:gi[1]||'',the:(CFG.mb[g]||{}).the,theRe:(CFG.mb[g]||{}).theRe},MBC)}
async function mbQ(slot){await loadGame(slot.g);useGame(slot.g);if(!slot.q){const r=rng(K+':'+S.seed+':'+slot.g),pool=SG.q.filter(q=>q.t===slot.t);const q=pool[Math.floor(r()*pool.length)];Object.assign(slot,q,{q:1,opts:shuffle([q.a,...q.w],r)})}return slot}
function pick(seed){if(MB){const r=rng(K+':'+seed),gs=shuffle(Object.keys(CFG.mb),r),T=[1,1,1,1,2,2,2,3,3,3];return gs.map((g,i)=>({g,t:T[i]}))}
  const r=rng(K+':'+seed);let out=[];
  for(const t of [1,2,3])out=out.concat(shuffle(SG.q.filter(q=>q.t===t),r).slice(0,MIX[t]));
  return out.map(q=>({...q,opts:shuffle([q.a,...q.w],r)}))}

/* ---------- the map ---------- */
function mapSVG(q){const v=SG.views[q.v],id='m'+Math.random().toString(36).slice(2,7),h=q.hl;
  const cp=v.clip?`clip-path="url(#c${id})"`:'';
  const grad=`<linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb37a"/><stop offset=".5" stop-color="#e2552d"/><stop offset="1" stop-color="#ff9a4d"/></linearGradient>`;
  let under='',over='';
  if(h.k==='area'){
    if(v.sea)under=`<path d="${h.d}" fill="url(#g${id})" fill-rule="evenodd"/>`;
    else over=`<path d="${h.d}" fill="url(#g${id})" fill-rule="evenodd" stroke="#ffd2b0" stroke-width="1" stroke-linejoin="round" opacity=".95"/>`}
  const extra=(v.extra||[]).map(e=>{
    if(e.k==='line'){if(h.k==='line'&&e.n===q.a)return '';return `<path d="${e.d}" fill="none" stroke="${v.rivers_white?'#fff':'#6d655a'}" stroke-width="${v.rivers_white?2.2:1.6}" stroke-linecap="round" stroke-linejoin="round" ${cp}/>`}
    if(e.k==='water'){if(e.n===q.a)return '';return `<path d="${e.d}" fill="#fff" fill-rule="evenodd"/>`}
    if(e.k==='dot')return `<circle cx="${e.xy[0]}" cy="${e.xy[1]}" r="3.2" fill="#8a8173"/>`;return ''}).join('');
  if(h.k==='line')over=`<path d="${h.d}" fill="none" stroke="#16130f" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity=".6" ${cp}/><path d="${h.d}" fill="none" stroke="url(#g${id})" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" ${cp}/>`;
  const S=Math.max(v.w,v.h)/520;  /* markers keep the same size on every map */
  if(h.k==='pt'){const[x,y]=h.xy;over+=`<circle class="pulse" cx="${x}" cy="${y}" r="${14*S}" fill="none" stroke="#e2552d" stroke-width="${3*S}"/><circle cx="${x}" cy="${y}" r="${8*S}" fill="#e2552d" stroke="#fff" stroke-width="${3*S}"/>`}
  if(h.ring){const[x,y,r]=h.ring;over+=`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#e2552d" stroke-width="${2.5*S}"/><circle class="pulse" cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#e2552d" stroke-width="${2.5*S}"/>`}
  return `<svg viewBox="${(v.vb||[0,0,v.w,v.h]).join(' ')}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(U.map(nm(v.n)))}"><defs><clipPath id="c${id}"><path d="${v.land}"/></clipPath>${grad}</defs>
  ${under}<path d="${v.land}" fill="#16130f"/>${extra}${over}</svg>`}


/* ---------- the country games (Where is Bigger?, Which of Three?, How Many Borders?) ---------- */
const XS=I.X||{};
const cname=id=>nm((SG.names||{})[id]||id);
const idOf=name=>Object.keys(SG.names||{}).find(k=>SG.names[k]===name);
const num=n=>Number(n).toLocaleString(L==='en'?'en-GB':L);
const listJoin=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+(XS.and||' and ')+a[a.length-1];
function sil(id,fill){const c=SG.shapes[id],[x0,y0,x1,y1]=c.bb;return `<svg viewBox="${x0-4} ${y0-4} ${x1-x0+8} ${y1-y0+8}" preserveAspectRatio="xMidYMid meet"><path d="${c.d}" fill="${fill||'#16130f'}"/></svg>`}
function toScale(ids){const m=Math.min(...ids.map(k=>SG.shapes[k].s));let x=0,H=0;const parts=ids.map((k,i)=>{const c=SG.shapes[k],f=m/c.s,[x0,y0,x1,y1]=c.bb,w=(x1-x0)*f,h=(y1-y0)*f;
  const g=`<g transform="translate(${x} 0) scale(${f}) translate(${-x0} ${-y0})"><path d="${c.d}" fill="${i===0?'#e2552d':'#16130f'}"/></g>`;x+=w+14;H=Math.max(H,h);return g});
  return `<svg class="scale" viewBox="-4 -4 ${x-6} ${H+8}" preserveAspectRatio="xMidYMid meet">${parts.join('')}</svg><div class="scalek">${ids.map((k,i)=>`<span${i===0?' class="hi"':''}>${esc(cname(k))} · ${num(SG.shapes[k].a)} ${XS.km}</span>`).join('')}</div>`}
function cmp(a,b){const r=SG.shapes[a].a/SG.shapes[b].a,A=cname(a),B=cname(b);
  return r>=1.95?XS.times(A,B,num(Math.round(r*10)/10)):r>=1.15?XS.pct(A,B,Math.round((r-1)*100)):XS.bit(A,B,Math.max(1,Math.round((r-1)*100)))}
function bordersSVG(q,rev){const m=q.map;return `<svg viewBox="${m.vb.join(' ')}" preserveAspectRatio="xMidYMid meet" role="img"><path d="${m.ctx}" fill="#16130f"/>
  ${m.nb.map(d=>`<path d="${d}" fill="${rev?'#ffd2b0':'#16130f'}" stroke="#7a7267" stroke-width="${m.vb[2]/260}" stroke-linejoin="round"/>`).join('')}
  <path d="${m.d}" fill="#e2552d" stroke="#fff" stroke-width="${m.vb[2]/200}" stroke-linejoin="round"/></svg>`}
function cardHTML(q){
  if(q.k==='borders')return `<div class="mapcard"><span class="cname">${esc(nm(SG.region[q.c]))}</span><span class="lvl">${LV[q.t]}</span>${bordersSVG(q,false)}</div>`;
  if(q.k==='shapes')return `<div class="silrow">${q.opts.map((o,k)=>`<div>${sil(idOf(o))}<b>${'ABC'[k]}</b></div>`).join('')}</div><div class="lvlrow">${LV[q.t]}</div>`;
  if(q.k==='target')return `<div class="tgcard"><div class="tgs">${sil(q.tg)}</div><div><div class="tag">${esc(XS.tobeat)}</div><b>${esc(cname(q.tg))}</b><div class="tga">${num(SG.shapes[q.tg].a)} ${XS.km}</div></div><span class="lvl">${LV[q.t]}</span></div>`;
  const v=SG.views[q.v];return `<div class="mapcard"><span class="cname">${esc(nm(v.n))}</span><span class="lvl">${LV[q.t]}</span>${mapSVG(q)}</div>`}
function qLine(q){return q.k==='borders'?XS.bq(cname(q.c)):q.k==='target'?XS.tq(cname(q.tg)):q.k==='shapes'?CFG.q:qtext(q)}
function clue(q){return q.k==='borders'?XS.bc:q.k==='target'?XS.tc:q.k==='shapes'?XS.sc:q.c}
function factHTML(q){
  if(q.k==='borders'){const l=listJoin(q.nbs.map(cname)),n=q.nbs.length;return esc(n===1?XS.one(l):XS.many(n,l))}
  if(q.k==='shapes'){const f=q.f;return esc(cmp(f.big,f.nx))+toScale([f.big,f.nx,f.sm])}
  if(q.k==='target'){const a=idOf(q.a);return esc(cmp(a,q.tg))+toScale([a,q.tg,...q.ids.filter(k=>k!==a&&k!==q.tg)])}
  return esc(q.f)}
function label(q){return q.k==='borders'?cname(q.c)+' · '+q.a:q.k==='target'?nm(q.a)+' > '+cname(q.tg):q.k==='shapes'?nm(q.a):nm(q.a)+'|'+nm(SG.views[q.v].n)}

/* ---------- the game ---------- */
let S;
const back=`<a class="back" href="${CFG.home||'/wonders/'}">${esc(U.back)}</a><span class="row"></span>`;
const qtext=q=>{if(q.qq){const t=I.QQ(q.qq);if(t!==q.qq||L==='en')return t}return CFG.q};
function start(seed,practice){S={seed,practice,qs:pick(seed),i:0,res:[],answered:false};playQ()}
function prog(){return `<div class="prog">${S.qs.map((_,k)=>`<i class="${k<S.res.length?(S.res[k]?'ok':'no'):k===S.i?'now':''}"></i>`).join('')}</div>`}
async function playQ(){if(MB){await mbQ(S.qs[S.i]);const nx=S.qs[S.i+1];if(nx)loadGame(nx.g).catch(()=>{})}
  const q=S.qs[S.i];S.answered=false;
  app.innerHTML=`<div class="play"><div class="top">${back}<span class="tag">${esc(U.of(S.i+1,S.qs.length))}</span></div>
  ${prog()}${cardHTML(q)}
  <div class="q">${esc(qLine(q))}</div><p class="clue">${esc(clue(q))}</p>
  <div class="opts">${q.opts.map((o,k)=>`<button class="opt" data-o="${esc(o)}"><span class="k">${'ABC'[k]}</span>${esc(nm(o))}</button>`).join('')}</div><div id="after"></div></div>`;
  app.querySelectorAll('.opt').forEach(b=>b.onclick=()=>answer(b.dataset.o));scrollTo(0,0)}
function answer(o){if(S.answered)return;S.answered=true;const q=S.qs[S.i],ok=o===q.a;S.res.push(ok);
  if(MB)q.lab=label(q).split('|')[0]+'|'+gname(q.g);
  app.querySelectorAll('.opt').forEach(b=>{b.disabled=true;const x=b.dataset.o;b.classList.add(x===q.a?'ok':x===o?'no':'dim')});
  app.querySelector('.prog').outerHTML=prog();
  if(q.k==='borders'){const mc=app.querySelector('.mapcard svg');if(mc)mc.outerHTML=bordersSVG(q,true)}  /* the neighbours light up */
  const last=S.i===S.qs.length-1;
  $('#after').innerHTML=`<div class="fact"><b class="${ok?'g':'r'}">${ok?U.right[S.i%4]:esc(U.wrong(art(q.a)+nm(q.a)))}</b>${factHTML(q)}</div><button class="next">${last?esc(U.score):esc(CFG.next||'Next →')}</button>`;
  $('#after .next').onclick=()=>{if(last)end();else{S.i++;playQ()}};
  $('#after').scrollIntoView({block:'nearest',behavior:'smooth'})}
function more(){const rows=GAMES.filter(g=>g[0]!==CFG.key).map(([k,n])=>{const r=playedToday(k);
    return `<a class="mg${r?' done':''}" href="${gameUrl(k)}"><img src="/icons/${k}-180.png" alt="" width="40" height="40"><b>${esc(gname(k))}</b><span>${r?'✓ '+r.n+' / 10':esc(U.play)}</span></a>`}).join('');
  const left=GAMES.filter(g=>g[0]!==CFG.key&&!playedToday(g[0])).length;
  return `<div class="panel more"><div class="tag">${esc(left?U.another:U.alldone)}</div><p class="msub">${esc(left?U.left(left):U.allmsg)}</p><div class="mgs">${rows}</div></div>`}
function mbLine(){const g=S.qs.map(q=>gname(q.g)),ok=g.filter((_,k)=>S.res[k]),no=g.filter((_,k)=>!S.res[k]);return U.mbs(listJoin(ok.slice(0,3)),listJoin(no.slice(0,2)))}
function verdict(n){return U.v[n===10?0:n>=8?1:n>=6?2:n>=4?3:4](CFG.noun)}
function end(rev){const n=S.res.filter(Boolean).length;let best=+ls(K+'-best')||0;const newBest=!S.practice&&n>best;if(newBest){best=n;ls(K+'-best',String(n))}
  if(!S.practice&&!rev){try{const R=JSON.parse(ls('nw_record')||'null')||{games:{},right:0,total:0},g=R.games[CFG.key]||{played:0,best:0};g.played++;const pc=n*10;if(pc>=(g.best||0)){g.best=pc;g.bestTxt=n+'/10'}R.games[CFG.key]=g;R.right=(R.right||0)+n;R.total=(R.total||0)+10;ls('nw_record',JSON.stringify(R))}catch(e){}}
  if(!S.practice)ls(K+'-day',JSON.stringify({d:S.seed,n,res:S.res,l:S.qs.map(q=>q.lab||label(q))}));
  const share=`${CFG.name} · twominute.games\n${S.res.map(x=>x?'🟩':'🟥').join('')} ${n}/10`;
  app.innerHTML=`<div class="top">${back}<span class="tag">${esc(S.practice&&!rev?U.practice:dateTxt())}</span></div>
  <div class="panel"><div class="score"><div class="tag">${esc(U.your)}</div><div class="big">${n}<small> / 10</small></div><p class="verdict">${verdict(n)}</p>
  <div class="dots">${S.res.map(x=>`<i class="${x?'ok':'no'}"></i>`).join('')}</div>
  <p class="best">${esc(rev?U.playedmsg:newBest?U.newbest:best?U.best(best):'')}</p>${MB&&!rev?`<p class="best">${esc(mbLine())}</p>`:''}</div>
  <div class="list">${S.qs.map((q,k)=>{const [a,b]=(q.lab||label(q)).split('|');return `<div class="li"><i>${S.res[k]?'✅':'❌'}</i><div><b>${esc(a)}</b>${b?` <span>· ${esc(b)}</span>`:''}</div></div>`}).join('')}</div>
  <div class="btns"><button class="btn" id="share">${esc(U.share)}</button></div>
  <p class="small">${esc(U.tomorrow(CFG.noun))}</p></div>${more()}${VIP?'<div class="btns"><button class="btn ghost" id="again">'+esc(U.owner)+'</button></div>':''}`;
  $('#share').onclick=async()=>{try{if(navigator.share){await navigator.share({text:share+'\nhttps://twominute.games/'})}else{await navigator.clipboard.writeText(share+'\nhttps://twominute.games/');$('#share').textContent=U.copied}}catch(e){}};
  const ag=$('#again');if(ag)ag.onclick=()=>start(today()+':p'+Date.now(),true);scrollTo(0,0)}
function review(r){const labs=r.l||(r.a||[]).map((a,i)=>nm(a)+(SG.views&&SG.views[r.v[i]]?'|'+nm(SG.views[r.v[i]].n):''));S={seed:r.d,practice:true,qs:labs.map(lab=>({lab})),res:r.res};end(true)}
function intro(){const r=playedToday(CFG.key);const done=r?[r.d,r.n]:[];const played=!!r;  /* played today: Admire my score, not Play again (17 Nov, Jonathan) */
  app.innerHTML=`<div class="top">${back}<span class="tag">${esc(dateTxt())}</span></div>
  <div class="panel intro menu"><div class="ttl"><span class="tag">${esc(U.kicker)}</span></div><h2>${esc(CFG.name)}</h2>
  <p>${esc(CFG.intro)}</p>
  <ul><li>${esc(U.b1(CFG.noun))}</li><li>${esc(U.b2)}</li><li>${esc(U.b3)}</li></ul>
  <div class="btns">${played?`<p class="best" style="text-align:center;margin:0">${esc(U.scored(done[1]))}</p>`:''}<button class="btn" id="go">${esc(played?U.admire:U.start)}</button>${played&&VIP?`<button class="btn ghost" id="again">${esc(U.owner)}</button>`:''}</div></div>`;
  $('#go').onclick=()=>{if(!played)start(today(),false);else if(r.res)review(r);else start(today(),true)};
  const ag=$('#again');if(ag)ag.onclick=()=>start(today()+':p'+Date.now(),true)}
window.__simple={mapSVG,pick};
intro();
})();
