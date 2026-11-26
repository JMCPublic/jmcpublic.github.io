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
const GAMES=[['rivers','Rivers'],['lakes','Lakes'],['bodies-of-water','Bodies of Water'],['mountains','Mountains'],['deserts','Deserts'],['forests','Forests'],['river-cities','River Cities'],['where-is-bigger','Where is Bigger?'],['which-of-five','Which of Three?'],['how-many-borders','How Many Borders?'],['masterbrain','Masterbrain'],['aperture','Aperture'],['landmarks','Landmarks'],['when','When was that?'],['masterpiece','Masterpiece'],['region','Point to the Region'],['charades','Film Charades']];  /* + When was that? and Masterpiece (26 Nov) */  /* Aperture and Landmarks too (17 Nov), so every daily game links to the others */
const APK={aperture:'ap2-day-',landmarks:'apL-day-'},APDIR=['de','tr','fr','es','pt'].includes(L)?L+'/':'';
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
const CT=(q,i)=>(L!=='en'&&q.ct&&q.ct[L]&&q.ct[L][i])||(i?q.f:q.c);  /* translated clue (0) and fact (1), 17 Nov */
function clue(q){return q.k==='borders'?XS.bc:q.k==='target'?XS.tc:q.k==='shapes'?XS.sc:CT(q,0)}
/* a photo of the real place on the answer card (18 Nov; Lakes first, the photos the classic Lakes had): q.ph = [image path, author, licence, source page] */
const HML={en:"All games",de:"Alle Spiele",tr:"Tüm oyunlar",fr:"Tous les jeux",es:"Todos los juegos",pt:"Todos os jogos"}[L]||"All games";
const HSVG='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>';
window.tmgMidGame=()=>!!(S&&!S.over&&S.res&&S.res.length>0&&S.res.length<S.qs.length);
const PHT={en:'Photo',de:'Foto',tr:'Fotoğraf',fr:'Photo',es:'Foto',pt:'Foto'}[L]||'Photo';
function phHTML(q){const p=q.ph;if(!p)return'';return `<figure class="ph"><img src="${esc(p[0])}" alt="${esc(nm(q.a))}" loading="lazy" onerror="this.parentNode.remove()"><figcaption>${PHT}: <a href="${esc(p[3])}" target="_blank" rel="noopener">${esc(p[1])}</a> · ${esc(p[2])}</figcaption></figure>`}
function factHTML(q){
  if(q.k==='borders'){const l=listJoin(q.nbs.map(cname)),n=q.nbs.length;return esc(n===1?XS.one(l):XS.many(n,l))}
  if(q.k==='shapes'){const f=q.f;return esc(cmp(f.big,f.nx))+toScale([f.big,f.nx,f.sm])}
  if(q.k==='target'){const a=idOf(q.a);return esc(cmp(a,q.tg))+toScale([a,q.tg,...q.ids.filter(k=>k!==a&&k!==q.tg)])}
  return esc(CT(q,1))}
function label(q){return q.k==='borders'?cname(q.c)+' · '+q.a:q.k==='target'?nm(q.a)+' > '+cname(q.tg):q.k==='shapes'?nm(q.a):nm(q.a)+'|'+nm(SG.views[q.v].n)}

/* ---------- the game ---------- */
let S;

/* home-screen name in the player's language (18 Nov): point the page at its language's home-screen file and give iPhones the same name */
(()=>{try{const lg=L;if(!lg||lg==='en')return;const ml=document.querySelector('link[rel="manifest"]');if(!ml||!/-en\.webmanifest/.test(ml.getAttribute('href')))return;
  ml.setAttribute('href',ml.getAttribute('href').replace('-en.webmanifest','-'+lg+'.webmanifest'));
  fetch(ml.href).then(r=>r.json()).then(j=>{let m=document.querySelector('meta[name="apple-mobile-web-app-title"]');if(!m){m=document.createElement('meta');m.name='apple-mobile-web-app-title';document.head.appendChild(m)}m.content=j.short_name||j.name}).catch(()=>{})}catch(e){}})();
const back=`<a class="tmghome hmb" href="/" aria-label="${HML}" title="${HML}">${HSVG}</a><a class="back" href="${CFG.home||'/wonders/'}">${esc(U.back)}</a><span class="row"><button type="button" class="lgb" aria-haspopup="true" aria-label="Language">${L.toUpperCase()} ▾</button></span>`;
/* 17 Nov (mock-up approved): the language button beside ♫ and ⓘ. Picks one of six, saves it as tmg-lang (like the home page menu) and reloads */
const LANGS=[['en','English'],['de','Deutsch'],['tr','Türkçe'],['fr','Français'],['es','Español'],['pt','Português']];
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.lgb'),m=document.querySelector('.lgm');
  const it=e.target.closest&&e.target.closest('.lgm button');
  if(it){ls('tmg-lang',it.dataset.l);const u=new URL(location.href);u.searchParams.delete('lang');location.replace(u.pathname+u.search+u.hash);return}
  if(m){m.remove();if(!b)return}
  if(!b||m)return;e.stopPropagation();
  const menu=document.createElement('div');menu.className='lgm';menu.setAttribute('role','menu');
  menu.innerHTML=LANGS.map(([k,n])=>`<button type="button" role="menuitem" data-l="${k}"${k===L?' aria-current="true"':''}><b>${k.toUpperCase()}</b>${n}${k===L?' ✓':''}</button>`).join('');
  document.body.appendChild(menu);const r=b.getBoundingClientRect();menu.style.top=(r.bottom+6)+'px';menu.style.right=Math.max(12,innerWidth-r.right)+'px'},true);
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
  $('#after').innerHTML=`<div class="fact">${phHTML(q)}<b class="${ok?'g':'r'}">${ok?U.right[S.i%4]:esc(U.wrong(art(q.a)+nm(q.a)))}</b>${factHTML(q)}</div><button class="next">${last?esc(U.score):esc(CFG.next||'Next →')}</button>`;
  $('#after .next').onclick=()=>{if(last)end();else{S.i++;playQ()}};
  $('#after').scrollIntoView({block:'nearest',behavior:'smooth'})}
const OWN={when:['/when/','when-done-'],masterpiece:['/masterpiece/','mp-done-'],region:['/region/','rg-done-'],charades:['/charades/','fc-done-']},WHN={fr:'C’était quand ?',es:'¿Cuándo fue?'};
const apDone=k=>{try{return JSON.parse(ls(APK[k]+today())||'null')}catch(e){return null}};
function more(){const rows=GAMES.filter(g=>g[0]!==CFG.key).map(([k,n])=>{
    if(OWN[k]){const d=ls(OWN[k][1]+today());return `<a class="mg${d!==null?' done':''}" href="${OWN[k][0]}"><img src="/icons/${k}-180.png?v=1" alt="" width="40" height="40"><b>${esc(k==='when'?(WHN[L]||n):n)}</b><span>${d!==null?'✓ '+esc(d)+(k==='masterpiece'?' / 20':k==='region'?' / 30':k==='charades'?' / 15':''):esc(U.play)}</span></a>`}
    if(APK[k]){const r=apDone(k);return `<a class="mg${r?' done':''}" href="/aperture/${k==='landmarks'?'landmarks/':''}${APDIR}"><img src="/icons/${k}-180.png?v=3" alt="" width="40" height="40"><b>${esc(n)}</b><span>${r?'✓ '+esc(r.t||''):esc(U.play)}</span></a>`}
    const r=playedToday(k);
    return `<a class="mg${r?' done':''}" href="${gameUrl(k)}"><img src="/icons/${k}-180.png?v=3" alt="" width="40" height="40"><b>${esc(gname(k))}</b><span>${r?'✓ '+r.n+' / 10':esc(U.play)}</span></a>`}).join('');
  const left=GAMES.filter(g=>g[0]!==CFG.key&&!APK[g[0]]&&!OWN[g[0]]&&!playedToday(g[0])).length;  /* the message counts the Natural Wonders games */
  return `<div class="panel more"><div class="tag">${esc(left?U.another:U.alldone)}</div><p class="msub">${esc(left?U.left(left):U.allmsg)}</p><div class="mgs">${rows}</div></div>`}
function mbLine(){const g=S.qs.map(q=>gname(q.g)),ok=g.filter((_,k)=>S.res[k]),no=g.filter((_,k)=>!S.res[k]);return U.mbs(listJoin(ok.slice(0,3)),listJoin(no.slice(0,2)))}
function verdict(n){return U.v[n===10?0:n>=8?1:n>=6?2:n>=4?3:4](CFG.noun)}
function end(rev){S.over=1;const n=S.res.filter(Boolean).length;let best=+ls(K+'-best')||0;const newBest=!S.practice&&n>best;if(newBest){best=n;ls(K+'-best',String(n))}
  if(!S.practice&&!rev){try{const R=JSON.parse(ls('nw_record')||'null')||{games:{},right:0,total:0},g=R.games[CFG.key]||{played:0,best:0};g.played++;const pc=n*10;if(pc>=(g.best||0)){g.best=pc;g.bestTxt=n+'/10'}R.games[CFG.key]=g;R.right=(R.right||0)+n;R.total=(R.total||0)+10;ls('nw_record',JSON.stringify(R))}catch(e){}}
  if(!S.practice&&!rev)setTimeout(()=>{try{dispatchEvent(new Event('tmg:gameover'))}catch(e){}},0); /* 22 Nov: weekly 'where are you playing?' card listens for this */
  if(!S.practice)ls(K+'-day',JSON.stringify({d:S.seed,n,res:S.res,l:S.qs.map(q=>q.lab||label(q))}));
  const share=`${CFG.name} · twominute.games\n${S.res.map(x=>x?'🟩':'🟥').join('')} ${n}/10`;
  app.innerHTML=`<div class="top">${back}<span class="tag">${esc(S.practice&&!rev?U.practice:dateTxt())}</span></div>
  <div class="panel"><div class="score"><div class="tag">${esc(U.your)}</div><div class="big${rev||S.practice?' rev':''}">${n}<small> / 10</small></div><p class="verdict">${verdict(n)}</p>
  <div class="dots">${S.res.map(x=>`<i class="${x?'ok':'no'}"></i>`).join('')}</div>
  <p class="best">${esc(rev?U.playedmsg:newBest?U.newbest:best?U.best(best):'')}</p>${MB&&!rev?`<p class="best">${esc(mbLine())}</p>`:''}</div>
  <div class="list">${S.qs.map((q,k)=>{const [a,b]=(q.lab||label(q)).split('|');return `<div class="li"><i>${S.res[k]?'✅':'❌'}</i><div><b>${esc(a)}</b>${b?` <span>· ${esc(b)}</span>`:''}</div></div>`}).join('')}</div>
  <div class="btns"><button class="btn" id="share">${esc(U.share)}</button></div>
  <p class="small">${esc(U.tomorrow(CFG.noun))}</p><p class="small srcl"><button type="button" class="lnk" id="srcBtn">${esc(SRCT[0])}</button></p></div>${more()}${VIP?'<div class="btns"><button class="btn ghost" id="again">'+esc(U.owner)+'</button></div>':''}`;
  $('#share').onclick=async()=>{try{if(navigator.share){await navigator.share({text:share+'\nhttps://twominute.games/'})}else{await navigator.clipboard.writeText(share+'\nhttps://twominute.games/');$('#share').textContent=U.copied}}catch(e){}};
  $('#srcBtn').onclick=sources;
  const ag=$('#again');if(ag)ag.onclick=()=>start(today()+':p'+Date.now(),true);scrollTo(0,0)}

/* ---------- Sources (17 Nov 2026, Jonathan: "a sources button that lets you send an email to the admin and you get all this info back"):
   the player leaves an email; the request arrives in Messages on the stats page, with a one-tap copy of this game's sources list.
   UK GDPR: used only to send the sources, then deleted (Sent, delete button, and anything older than 30 days is removed). See /about/#privacy */
const SRCT={en:['Sources',n=>`Want the full list of sources for ${n}? Leave your email and we’ll send it to you.`,'Your email','Send me the sources','We’ll only use your email to send you the sources, then delete it.','Privacy','Sending…','Thanks! We’ll email you the sources soon.','Please check your email address.','That didn’t send. Please try again in a moment.','Close'],
 de:['Quellen',n=>`Möchtest du die vollständige Quellenliste für ${n}? Gib deine E-Mail-Adresse an, dann schicken wir sie dir.`,'Deine E-Mail-Adresse','Quellen zuschicken','Wir nutzen deine E-Mail-Adresse nur, um dir die Quellen zu schicken, und löschen sie danach.','Datenschutz','Wird gesendet …','Danke! Wir schicken dir die Quellen bald per E-Mail.','Bitte prüfe deine E-Mail-Adresse.','Das hat nicht geklappt. Bitte versuch es gleich noch einmal.','Schließen'],
 tr:['Kaynaklar',n=>`${n} için kaynakların tam listesini ister misin? E-posta adresini bırak, sana gönderelim.`,'E-posta adresin','Kaynakları gönder','E-posta adresini yalnızca kaynakları göndermek için kullanır, sonra sileriz.','Gizlilik','Gönderiliyor…','Teşekkürler! Kaynakları yakında e-postayla göndereceğiz.','Lütfen e-posta adresini kontrol et.','Gönderilemedi. Lütfen birazdan tekrar dene.','Kapat'],
 fr:['Sources',n=>`Vous voulez la liste complète des sources de ${n} ? Laissez votre e-mail et nous vous l’enverrons.`,'Votre e-mail','M’envoyer les sources','Nous utiliserons votre e-mail uniquement pour vous envoyer les sources, puis nous le supprimerons.','Confidentialité','Envoi…','Merci ! Nous vous enverrons les sources par e-mail très bientôt.','Vérifiez votre adresse e-mail.','L’envoi n’a pas marché. Réessayez dans un instant.','Fermer'],
 es:['Fuentes',n=>`¿Quieres la lista completa de fuentes de ${n}? Déjanos tu correo y te la enviamos.`,'Tu correo electrónico','Enviadme las fuentes','Solo usaremos tu correo para enviarte las fuentes y después lo borraremos.','Privacidad','Enviando…','¡Gracias! Pronto te enviaremos las fuentes por correo.','Revisa tu dirección de correo.','No se ha podido enviar. Inténtalo de nuevo en un momento.','Cerrar'],
 pt:['Fontes',n=>`Queres a lista completa das fontes de ${n}? Deixa o teu e-mail e nós enviamos-ta.`,'O teu e-mail','Enviem-me as fontes','Só usamos o teu e-mail para te enviar as fontes e depois apagamo-lo.','Privacidade','A enviar…','Obrigado! Vamos enviar-te as fontes por e-mail em breve.','Verifica o teu endereço de e-mail.','Não foi possível enviar. Tenta de novo daqui a pouco.','Fechar']}[L]||[];
function sources(){
  const ov=document.createElement('div');ov.className='srcov';
  ov.innerHTML=`<form class="srcbox" role="dialog" aria-label="${esc(SRCT[0])}" novalidate><div class="tag">${esc(SRCT[0])}</div><h3>${esc(CFG.name)}</h3><p>${esc(SRCT[1](CFG.name))}</p>
   <input type="email" id="srcE" autocomplete="email" inputmode="email" maxlength="150" placeholder="${esc(SRCT[2])}" required>
   <button type="submit" class="btn" id="srcGo">${esc(SRCT[3])}</button>
   <p class="sm" id="srcM" aria-live="polite">${esc(SRCT[4])} <a href="/about/#privacy" target="_blank" rel="noopener">${esc(SRCT[5])}</a></p>
   <button type="button" class="btn ghost" id="srcX">${esc(SRCT[10])}</button></form>`;
  document.body.appendChild(ov);const f=ov.querySelector('form'),e=ov.querySelector('#srcE'),m=ov.querySelector('#srcM'),go=ov.querySelector('#srcGo'),x=()=>ov.remove();
  ov.onclick=ev=>{if(ev.target===ov)x()};ov.querySelector('#srcX').onclick=x;setTimeout(()=>e.focus(),60);
  f.onsubmit=async ev=>{ev.preventDefault();const em=e.value.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){m.textContent=SRCT[8];e.focus();return}
    go.disabled=true;m.textContent=SRCT[6];const sv=v=>({stringValue:String(v)});
    const doc=k=>({fields:{kind:sv(k),message:sv((k==='sources'?'':'[Sources request] ')+'Please send the sources for '+(GAMES.find(g=>g[0]===CFG.key)||[0,CFG.key])[1]+' ('+L.toUpperCase()+').'),contact:sv(em),game:sv(document.title.slice(0,120)),page:sv(location.pathname.slice(0,200)),where:sv('sources · '+CFG.key+' · '+L),device:sv(matchMedia('(pointer:coarse)').matches?'phone':'desktop'),ua:sv(navigator.userAgent.slice(0,300)),at:{timestampValue:new Date().toISOString()}}});
    const post=k=>fetch('https://firestore.googleapis.com/v1/projects/aperture-c0961/databases/(default)/documents/feedback?key=AIzaSyCLMslnXssvPk7S7l_0MuajudNtHRK-VAI',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(doc(k))}).then(r=>r.ok);
    let ok=false;try{ok=await post('sources');if(!ok)ok=await post('idea')}catch(err){}
    if(!ok){m.textContent=SRCT[9];go.disabled=false;return}
    f.innerHTML=`<div class="tag">${esc(SRCT[0])}</div><h3>✓</h3><p>${esc(SRCT[7])}</p><button type="button" class="btn ghost" id="srcX">${esc(SRCT[10])}</button>`;f.querySelector('#srcX').onclick=x}}
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
