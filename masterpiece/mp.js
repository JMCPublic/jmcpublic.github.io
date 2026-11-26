/* Masterpiece (built 25 Nov 2026 from Old Masters mock-up v0.1, approved by Jonathan: name "Masterpiece", five a day, prints and later works welcome, rights-free).
   A famous artwork seen close up; zoom out step by step and name it from four. 4, 3, 2 or 1 points depending on how early. Five a day: two easy, two medium, one hard.
   Setting (Jonathan, 25 Nov): Easy / Medium / Hard changes how close the first view is (Easy shows more). Saved on the device, like Aperture's.
   House pieces as the other games: Goldilocks (rating.js via reach), weekly where-are-you card (tmg:gameover), counts (nwcount), feedback, footer, home button.
   v0.2 (25 Nov, Jonathan: "I wanted to play more"): Galleries after the daily five, Greatest Hits and Everything, a random five as often as you like (practice: not counted or shared).
   Easy now has wrong answers from a different artist and a different era, and a clue (nationality and decade) after the first zoom out.
   Content: /masterpiece/art.js (images from Wikimedia Commons, all public domain). English for now. */
(()=>{
const app=document.getElementById('app'),$=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
const K='mp',NAME='Masterpiece',VIP=ls('ap-vip')==='1';
/* language (26 Nov): Spanish and French from lang/es.js, lang/fr.js (loaded by the page); anything else plays in English */
const ML=window.MP_L||null,L=(window.MP_LANG&&ML)?window.MP_LANG:'en';
const EN={all:'All games',tag:'Art · daily',sub:'Can you name it before you see it all?',intro:'A famous work of art, seen close up. Zoom out bit by bit and name it as soon as you can.',li:['Five works, about two minutes','Name it early for more points: 4, 3, 2 or 1','Where it hangs and a fact about every one'],
 lv:{easy:'Easy',medium:'Medium',hard:'Hard'},lvh:'Easy starts further out; Hard starts very close.',start:'Start',admire:'Admire my score',scored:(n,l)=>`Today you scored ${n} / 20 (${l})`,
 of:(i,n)=>`${i} of ${n}`,now:p=>`Name it now for <b>${p} point${p>1?'s':''}</b>`,zoom:'Zoom out (−1 point)',whole:'The whole work is showing',loading:'Loading the work…',
 yes:p=>`Yes! ${p} point${p>1?'s':''}`,no:'Not this time.',img:'Image',pd:'public domain',next:'Next work →',see:'See my score',clue:'Clue',
 your:'Your score',best:'Your best',newBest:'🎉 Your best score yet',seen:'You’ve seen today’s five. New ones at midnight.',share:'Share my score',copied:'Copied ✓',tomorrow:'Five new masterpieces tomorrow, the same for everyone.',sources:'Sources',practice:'Practice set',
 v:['A true connoisseur 🖼️','Brilliant. You know your galleries.','A good eye. Very nicely done.','Not bad! Some of these are tricky up close.','Art takes time. Five new works tomorrow.'],
 keep:'Keep playing',keeps:'Five more, as often as you like. Just for fun: not counted.',gals:{hits:['Greatest Hits','The world-famous ones'],all:['Everything','Every work, famous or not']},again:'Play another five?',yesMore:n=>`Yes, five more ${n}`,
 another:'Play another today',played:'✓ Played',play:'Play',
 srcP:'Every image comes from Wikimedia Commons and is in the public domain; tap “Wikimedia Commons” under any work for its page. Want the full list of sources? Leave your email and we’ll send it to you.',srcE:'Your email',srcGo:'Send me the sources',srcPriv:'We’ll only use your email to send you the sources, then delete it.',privacy:'Privacy',close:'Close',srcBad:'Please check your email address.',sending:'Sending…',srcFail:'That didn’t send. Please try again in a moment.',srcOk:'Thanks! We’ll email you the sources soon.',loc:'en-GB'};
const U=L!=='en'?Object.assign({},EN,ML.u):EN;
const T=t=>(ML&&ML.t[t])||t,AA=a=>(ML&&ML.a&&ML.a[a])||a,MM=m=>(ML&&ML.m[m])||m,FF=p=>(ML&&ML.f[p.t])||p.fact,NN=n=>(ML&&ML.n[n])||n;
/* French spacing: a thin non-breaking space before ? ! : ; » and after «, applied to whatever the game writes */
if(L==='fr'){const fix=n=>{const w=document.createTreeWalker(n,NodeFilter.SHOW_TEXT);let t;while(t=w.nextNode()){const v=t.nodeValue.replace(/ ([?!:;»])/g,'\u202F$1').replace(/« /g,'«\u202F');if(v!==t.nodeValue)t.nodeValue=v}};
  new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(x=>{if(x.nodeType===1||x.nodeType===3)fix(x.nodeType===3?x.parentNode:x)}))).observe(document.body,{childList:true,subtree:true})}
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const dateTxt=()=>{try{return new Date().toLocaleDateString(U.loc,{weekday:'short',day:'numeric',month:'short'})}catch(e){return ''}};
function rng(seed){let h=1779033703^seed.length;for(let i=0;i<seed.length;i++){h=Math.imul(h^seed.charCodeAt(i),3432918353);h=h<<13|h>>>19}
  return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return((h^=h>>>16)>>>0)/4294967296}}
const shuffle=(a,r)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

/* zoom ladders per setting: how many times enlarged at each step (the last step is the whole work) */
const LEVELS={easy:{n:U.lv.easy,z:[3,2,1.4,1]},medium:{n:U.lv.medium,z:[4.5,2.7,1.6,1]},hard:{n:U.lv.hard,z:[6.5,3.5,1.8,1]}};
let LVL=LEVELS[ls('mp-level')]?ls('mp-level'):'easy';
const PTS=[4,3,2,1];

/* ---------- the day's five: each level's list is shuffled once (batch by batch) and walked through from launch day, so nothing repeats until the list runs out ---------- */
const POOL={};['e','m','h'].forEach(l=>{const T=ART.filter(t=>t.l===l),ws=[...new Set(T.map(t=>t.w||1))].sort((a,b)=>a-b);
  POOL[l]=ws.flatMap(w=>shuffle(T.filter(t=>(t.w||1)===w),rng('mp-pool-'+l+(w>1?'-w'+w:''))))});
const DAY0=Date.UTC(2026,10,26);
function dayNo(seed){const m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(seed);return m?Math.round((Date.UTC(+m[1],+m[2]-1,+m[3])-DAY0)/864e5):-1}
const MIX=[['e',2],['m',2],['h',1]];
function pick(seed){const n=dayNo(seed);let day;
  if(n>=0){const cur={e:0,m:0,h:0};for(let d=0;d<=n;d++){const out=[];MIX.forEach(([l,k])=>{for(let j=0;j<k;j++){out.push(POOL[l][cur[l]%POOL[l].length]);cur[l]++}});if(d===n)day=out}}
  else{const r=rng(seed);day=MIX.flatMap(([l,k])=>shuffle(POOL[l],r).slice(0,k))}
  return day}
const yr=t=>+(String(t.y!==undefined?t.y:t[2]).match(/\d{4}/)||[0])[0];
/* wrong answers: another work by the same artist if there is one (from the list or the decoys), the rest from the same level */
/* Easy: no same-artist trap, and the wrong answers come from at least 80 years away, so half-knowing it is enough */
function options(t,seed,lvl){const r=rng(seed+'|'+lvl+'|'+t.t),ty=yr(t);const all=ART.map(x=>[x.t,x.a,x.l,yr(x)]).concat(DECOYS.map(d=>[d[0],d[1],'d',d[2]]));
  let same=[],rest;
  if(lvl==='easy'){rest=shuffle(all.filter(x=>x[1]!==t.a&&Math.abs(x[3]-ty)>=80),r).slice(0,3);if(rest.length<3)rest=rest.concat(shuffle(all.filter(x=>x[1]!==t.a&&!rest.includes(x)),r).slice(0,3-rest.length))}
  else{same=shuffle(all.filter(x=>x[1]===t.a&&x[0]!==t.t),r).slice(0,1);
  rest=shuffle(all.filter(x=>x[1]!==t.a&&(x[2]===t.l||x[2]==='d')),r).slice(0,3-same.length)}
  return shuffle([[t.t,t.a],...same.map(x=>[x[0],x[1]]),...rest.map(x=>[x[0],x[1]])],r)}

/* ---------- page shell ---------- */
const HSVG='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>';
const back=`<a class="tmghome hmb" href="/" aria-label="${esc(U.all)}" title="${esc(U.all)}">${HSVG}</a><a class="back" href="/">← ${esc(U.all)}</a><span class="row"><button type="button" class="lgb" aria-haspopup="true" aria-label="Language">${L.toUpperCase()} ▾</button></span>`;
/* language button: English, Español, Français; saves tmg-lang (the site-wide setting) and reloads */
const LANGS=[['en','English'],['es','Español'],['fr','Français']];
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.lgb'),m=document.querySelector('.lgm'),it=e.target.closest&&e.target.closest('.lgm button');
  if(it){ls('tmg-lang',it.dataset.l);const u=new URL(location.href);u.searchParams.delete('lang');location.replace(u.pathname+u.search+u.hash);return}
  if(m){m.remove();if(!b)return}
  if(!b||m)return;e.stopPropagation();
  const menu=document.createElement('div');menu.className='lgm';menu.setAttribute('role','menu');
  menu.innerHTML=LANGS.map(([k,n])=>`<button type="button" role="menuitem" data-l="${k}"${k===L?' aria-current="true"':''}><b>${k.toUpperCase()}</b>${n}${k===L?' ✓':''}</button>`).join('');
  document.body.appendChild(menu);const r=b.getBoundingClientRect();menu.style.top=(r.bottom+6)+'px';menu.style.right=Math.max(12,innerWidth-r.right)+'px'},true);
const hdr=t=>`<div class="top">${back}<span class="tag">${esc(t||dateTxt())}</span></div>`;
let S=null;
window.tmgMidGame=()=>!!(S&&!S.over&&S.sc&&S.sc.length>0&&S.sc.length<S.qs.length);
const cls=p=>p>=3?'ok':p>=1?'half':'no';
function prog(){return `<div class="prog">${S.qs.map((_,k)=>`<i class="${k<S.sc.length?cls(S.sc[k]):k===S.i?'now':''}"></i>`).join('')}</div>`}
/* Galleries: a random five from the gallery, avoiding today's daily five and anything already seen this visit */
const GALS={hits:{n:U.gals.hits[0],d:U.gals.hits[1],f:t=>t.l==='e'},all:{n:U.gals.all[0],d:U.gals.all[1],f:()=>true}};
let SEEN=[];try{SEEN=JSON.parse(sessionStorage.getItem('mp-seen')||'[]')}catch(e){}
function galPick(g){const r=Math.random,today5=new Set(pick(today()).map(t=>t.t));let c=ART.filter(t=>GALS[g].f(t)&&!today5.has(t.t)&&!SEEN.includes(t.t));
  if(c.length<5){SEEN=[];c=ART.filter(t=>GALS[g].f(t)&&!today5.has(t.t))}
  const out=shuffle(c,r).slice(0,5);SEEN=SEEN.concat(out.map(t=>t.t));try{sessionStorage.setItem('mp-seen',JSON.stringify(SEEN))}catch(e){}return out}
function start(seed,practice,gal){const qs=gal?galPick(gal):pick(seed);S={seed,practice:practice||!!gal,gal,qs:qs.map(t=>({...t,opts:options(t,seed,LVL)})),i:0,sc:[],lvl:LVL,over:false};S.qs.forEach(p=>{const im=new Image();im.src=p.img});q()}  /* fetch all five at the start so the next one is ready */
function q(){S.z=0;S.done=false;draw();scrollTo(0,0)}
const Z=()=>LEVELS[S.lvl].z;
function frame(p,scale){return `<div class="wrapf"><div class="frame" data-l="${esc(U.loading)}" style="aspect-ratio:${p.r};width:min(100%,calc(var(--fh)*${p.r}))"><img src="${esc(p.img)}" alt="" style="transform-origin:${p.f[0]}% ${p.f[1]}%;transform:scale(${scale})"></div></div>`}
function draw(){const p=S.qs[S.i],done=S.done,z=Z();
  app.innerHTML=`<div class="play">${hdr(`${S.gal?GALS[S.gal].n+' · ':''}${U.of(S.i+1,S.qs.length)} · ${LEVELS[S.lvl].n}`)}${prog()}${frame(p,done?1:z[S.z])}
   ${done?'':`<div class="step">${z.map((_,k)=>`<i class="${k<=S.z?'on':''}"></i>`).join('')}</div><p class="clue" id="clue">${clue(p)}</p><p class="pts">${U.now(PTS[S.z])}</p>
   <button class="zoom" id="zo" ${S.z>=z.length-1?'disabled':''}>${S.z>=z.length-1?esc(U.whole):esc(U.zoom)}</button>`}
   <div class="opts">${p.opts.map((o,k)=>`<button class="opt" data-k="${k}" ${done?'disabled':''}><span class="k">${'ABCD'[k]}</span><span>${esc(T(o[0]))}<small>${esc(AA(o[1]))}</small></span></button>`).join('')}</div><div id="after"></div></div>`;
  if(done)return after();
  $('#zo').onclick=()=>{if(S.z<z.length-1){S.z++;$('.frame img').style.transform=`scale(${z[S.z]})`;const st=app.querySelectorAll('.step i');st[S.z].classList.add('on');
    $('#clue').innerHTML=clue(p);$('.pts').innerHTML=U.now(PTS[S.z]);if(S.z>=z.length-1){$('#zo').disabled=true;$('#zo').textContent=U.whole}}};
  app.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const o=p.opts[+b.dataset.k];S.pickT=o[0];S.got=o[0]===p.t?PTS[S.z]:0;S.sc.push(S.got);S.done=true;draw()})}
const CO=L==='fr'?' : ':': ';  /* French puts a space before a colon */
const cap1=x=>x.charAt(0).toUpperCase()+x.slice(1);
const yy=y=>L==='en'?y:String(y).replace(/^c\. /,L==='fr'?'vers ':'h. ').replace(/(\d{4})s$/,L==='fr'?'années $1':'década de $1');
function clue(p){return S.lvl==='easy'&&S.z>=1?`${esc(U.clue)}${CO}${esc(NN(NAT[p.a]||''))} · ${L==='en'?Math.floor(yr(p)/10)*10+'s':(L==='fr'?'années ':'años ')+Math.floor(yr(p)/10)*10}`:''}
function after(){const p=S.qs[S.i],last=S.i===S.qs.length-1;
  app.querySelectorAll('.opt').forEach(b=>{const o=p.opts[+b.dataset.k];b.classList.add(o[0]===p.t?'ok':o[0]===S.pickT?'no':'dim')});
  $('#after').innerHTML=`<div class="fact"><b class="${S.got?'g':'r'}">${S.got?esc(U.yes(S.got)):esc(U.no)}</b><b class="ttl2">${esc(T(p.t))} · ${esc(AA(p.a))}, ${esc(yy(p.y))}</b>${esc(cap1(MM(p.m)))}. ${esc(FF(p))}<div class="cap">${esc(U.img)}${CO}<a href="${esc(p.page)}" target="_blank" rel="noopener">Wikimedia Commons</a> · ${esc(U.pd)}</div></div>
   <button class="next" id="nx">${last?esc(U.see):esc(U.next)}</button>`;
  $('#nx').onclick=()=>{if(last)(S.gal?galEnd():end());else{S.i++;q()}};$('#after').scrollIntoView({block:'nearest',behavior:'smooth'})}

/* ---------- the end ---------- */
const verdict=n=>U.v[n>=18?0:n>=14?1:n>=10?2:n>=5?3:4];
function record(n){const st=JSON.parse(ls(K+'-st')||'null')||{played:0,streak:0,last:''};const y=new Date();y.setDate(y.getDate()-1);
  const yk=y.getFullYear()+'-'+String(y.getMonth()+1).padStart(2,'0')+'-'+String(y.getDate()).padStart(2,'0');
  st.streak=st.last===yk?st.streak+1:st.last===today()?st.streak:1;st.last=today();st.played++;ls(K+'-st',JSON.stringify(st));
  ls(K+'-done-'+today(),String(n));ls(K+'-streak',JSON.stringify({n:st.streak,last:today()}))}  /* the home page card reads mp-done- and mp-streak */
const SQ=p=>['⬛','🟥','🟧','🟨','🟩'][p];
function end(rev){S.over=true;const n=S.sc.reduce((a,b)=>a+b,0);let best=+ls(K+'-best')||0;const newBest=!S.practice&&!rev&&n>best;if(newBest){best=n;ls(K+'-best',String(n))}
  if(!S.practice&&!rev){ls(K+'-day',JSON.stringify({d:S.seed,n,sc:S.sc,lvl:S.lvl,t:S.qs.map(p=>[p.t,p.a])}));record(n);setTimeout(()=>{try{dispatchEvent(new Event('tmg:gameover'))}catch(e){}},0)}
  const share=`${NAME} · twominute.games\n${S.sc.map(SQ).join('')} ${n}/20 (${LEVELS[S.lvl].n})`,surl='https://twominute.games/masterpiece/'+(L!=='en'?'?lang='+L:'');
  app.innerHTML=`${hdr(S.practice&&!rev?U.practice:'')}
  <div class="panel"><div class="score"><div class="tag">${esc(U.your)} · ${LEVELS[S.lvl].n}</div><div class="big">${n}<small> / 20</small></div><p class="verdict">${esc(verdict(n))}</p>
   <div class="dots">${S.sc.map(p=>`<i class="${cls(p)}"></i>`).join('')}</div>
   <p class="best">${rev?esc(U.seen):newBest?esc(U.newBest):best?`${esc(U.best)}${CO}${best} / 20`:''}</p></div>
   <div class="list">${S.qs.map((p,k)=>`<div class="li"><i>${S.sc[k]?SQ(S.sc[k]):'❌'}</i><div><b>${esc(T(p.t))}</b> <span>· ${esc(AA(p.a))}</span></div></div>`).join('')}</div>
   <div class="btns"><button class="btn" id="share">${esc(U.share)}</button></div>
   <p class="small">${esc(U.tomorrow)}</p><p class="small srcl"><button type="button" class="lnk" id="srcBtn">${esc(U.sources)}</button></p></div>
  ${galPanel()}${more()}${VIP?'<div class="btns"><button class="btn ghost" id="again">Practice set (owner only)</button></div>':''}`;galWire();
  $('#share').onclick=async()=>{try{if(navigator.share){await navigator.share({text:share+'\n'+surl})}else{await navigator.clipboard.writeText(share+'\n'+surl);$('#share').textContent=U.copied}}catch(e){}};
  $('#srcBtn').onclick=sources;const ag=$('#again');if(ag)ag.onclick=()=>start(today()+':p'+Date.now(),true);scrollTo(0,0)}

/* Keep playing: the galleries, offered once today's five are done */
function galPanel(){return `<div class="panel more"><div class="tag">${esc(U.keep)}</div><p class="small" style="margin:2px 0 10px">${esc(U.keeps)}</p><div class="lvls" role="group" aria-label="How close to start">${Object.entries(LEVELS).map(([k,v])=>`<button type="button" data-l="${k}" class="${k===LVL?'on':''}">${v.n}</button>`).join('')}</div>
  <div class="gals">${Object.entries(GALS).map(([k,g])=>`<button class="gal" data-g="${k}"><b>${g.n}</b><span>${g.d}</span></button>`).join('')}</div></div>`}
function galWire(){app.querySelectorAll('.more .lvls button').forEach(b=>b.onclick=()=>{LVL=b.dataset.l;ls('mp-level',LVL);app.querySelectorAll('.more .lvls button').forEach(x=>x.classList.toggle('on',x===b))});
  app.querySelectorAll('.gal').forEach(b=>b.onclick=()=>start('g'+Date.now(),true,b.dataset.g))}
function galEnd(){S.over=true;const n=S.sc.reduce((a,b)=>a+b,0),g=S.gal;
  app.innerHTML=`${hdr(GALS[g].n)}<div class="panel"><div class="score"><div class="tag">${esc(GALS[g].n)} · ${LEVELS[S.lvl].n}</div><div class="big">${n}<small> / 20</small></div><p class="verdict">${esc(verdict(n))}</p><div class="dots">${S.sc.map(p=>`<i class="${cls(p)}"></i>`).join('')}</div></div>
   <div class="list">${S.qs.map((p,k)=>`<div class="li"><i>${S.sc[k]?SQ(S.sc[k]):'❌'}</i><div><b>${esc(T(p.t))}</b> <span>· ${esc(AA(p.a))}</span></div></div>`).join('')}</div>
   <div class="again"><b>${esc(U.again)}</b><div class="btns"><button class="btn" id="more5">${esc(U.yesMore(GALS[g].n))}</button></div></div></div>${galPanel()}${more()}`;
  $('#more5').onclick=()=>start('g'+Date.now(),true,g);galWire();scrollTo(0,0)}

/* Play another today */
const AD=L!=='en'?L+'/':'',WN={es:'¿Cuándo fue?',fr:'C’était quand ?'}[L]||'When was that?';
const OTHERS=[['Aperture','/aperture/'+AD,'aperture','aperture2-best-'],['Landmarks','/aperture/landmarks/'+AD,'landmarks','apL-best-'],[WN,'/when/','when','when-done-'],['Point to the Region','/region/','region','rg-done-'],['Film Charades','/charades/','charades','fc-done-'],['Natural Wonders','/wonders/','natural-wonders',''],['Fictional a→z','/fictional/','fictional','fictional-best-'],['Name That Classic','/classic/','classic','lclassic-done-'],['What’s That Noise?','/noise/','noise','lnoise-done-']];
function more(){return `<div class="panel more"><div class="tag">${esc(U.another)}</div><div class="mgs">${OTHERS.map(([n,h,ic,k])=>{const d=k&&ls(k+today());
  return `<a class="mg${d?' done':''}" href="${h}"><img src="/icons/${ic}-180.png?v=${['when','region','charades'].includes(ic)?1:3}" alt="" width="40" height="40"><b>${esc(n)}</b><span>${esc(d?U.played:U.play)}</span></a>`}).join('')}</div></div>`}

/* Sources: same as the other games; the email is used only to send the list, then deleted */
function sources(){const ov=document.createElement('div');ov.className='srcov';
  ov.innerHTML=`<form class="srcbox" role="dialog" aria-label="Sources" novalidate><div class="tag">${esc(U.sources)}</div><h3>${NAME}</h3><p>${esc(U.srcP)}</p>
   <input type="email" id="srcE" autocomplete="email" inputmode="email" maxlength="150" placeholder="${esc(U.srcE)}" required>
   <button type="submit" class="btn" id="srcGo">${esc(U.srcGo)}</button>
   <p class="sm" id="srcM" aria-live="polite">${esc(U.srcPriv)} <a href="/about/#privacy" target="_blank" rel="noopener">${esc(U.privacy)}</a></p>
   <button type="button" class="btn ghost" id="srcX">${esc(U.close)}</button></form>`;
  document.body.appendChild(ov);const f=ov.querySelector('form'),e=ov.querySelector('#srcE'),m=ov.querySelector('#srcM'),go=ov.querySelector('#srcGo'),x=()=>ov.remove();
  ov.onclick=ev=>{if(ev.target===ov)x()};ov.querySelector('#srcX').onclick=x;setTimeout(()=>e.focus(),60);
  f.onsubmit=async ev=>{ev.preventDefault();const em=e.value.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){m.textContent=U.srcBad;e.focus();return}
    go.disabled=true;m.textContent=U.sending;const sv=v=>({stringValue:String(v)});
    const doc=k=>({fields:{kind:sv(k),message:sv((k==='sources'?'':'[Sources request] ')+'Please send the sources for Masterpiece ('+L.toUpperCase()+').'),contact:sv(em),game:sv(document.title.slice(0,120)),page:sv(location.pathname.slice(0,200)),where:sv('sources · masterpiece · '+L),device:sv(matchMedia('(pointer:coarse)').matches?'phone':'desktop'),ua:sv(navigator.userAgent.slice(0,300)),at:{timestampValue:new Date().toISOString()}}});
    const post=k=>fetch('https://firestore.googleapis.com/v1/projects/aperture-c0961/databases/(default)/documents/feedback?key=AIzaSyCLMslnXssvPk7S7l_0MuajudNtHRK-VAI',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(doc(k))}).then(r=>r.ok);
    let ok=false;try{ok=await post('sources');if(!ok)ok=await post('idea')}catch(err){}
    if(!ok){m.textContent=U.srcFail;go.disabled=false;return}
    f.innerHTML=`<div class="tag">${esc(U.sources)}</div><h3>✓</h3><p>${esc(U.srcOk)}</p><button type="button" class="btn ghost" id="srcX">${esc(U.close)}</button>`;f.querySelector('#srcX').onclick=x}}

/* ---------- start page ---------- */
function dayRec(){try{const o=JSON.parse(ls(K+'-day')||'null');return o&&o.d===today()?o:null}catch(e){return null}}
function intro(){const r=dayRec(),played=!!r;
  app.innerHTML=`${hdr()}<div class="panel intro menu"><img class="gicon" src="/icons/masterpiece-180.png?v=1" alt="" width="64" height="64"><span class="tag">${esc(U.tag)}</span><h2>${NAME}</h2><p class="sub">${esc(U.sub)}</p>
   <p>${esc(U.intro)}</p>
   <ul>${U.li.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
   <div class="lvls" role="group" aria-label="How close to start">${Object.entries(LEVELS).map(([k,v])=>`<button type="button" data-l="${k}" class="${k===LVL?'on':''}" ${played?'disabled':''}>${v.n}</button>`).join('')}</div>
   <p class="lvlh">${played?'':esc(U.lvlh)}</p>
   <div class="btns">${played?`<p class="best" style="text-align:center;margin:0">${esc(U.scored(r.n,LEVELS[r.lvl]?LEVELS[r.lvl].n:''))}</p>`:''}<button class="btn" id="go">${esc(played?U.admire:U.start)}</button>${VIP?'<button class="btn ghost" id="again">Practice set (owner only)</button>':''}</div></div>${played?galPanel():''}`;if(played)galWire();
  app.querySelectorAll('.intro .lvls button').forEach(b=>b.onclick=()=>{LVL=b.dataset.l;ls('mp-level',LVL);app.querySelectorAll('.intro .lvls button').forEach(x=>x.classList.toggle('on',x===b))});
  $('#go').onclick=()=>{if(!played)return start(today(),false);
    const qs=(r.t||[]).map(x=>({t:x[0],a:x[1]}));S={seed:r.d,practice:false,qs,sc:r.sc,lvl:LEVELS[r.lvl]?r.lvl:'easy',over:true};end(true)};
  const ag=$('#again');if(ag)ag.onclick=()=>start(today()+':p'+Date.now(),true)}
window.__mp={pick,POOL,options,galPick};
intro();
})();
