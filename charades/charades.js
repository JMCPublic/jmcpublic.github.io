/* Film Charades (game 10, built 26 Nov 2026 from mock-up v0.3, approved by Jonathan: "Lets do it now").
   Stick people mime a famous film scene; two hosts read three clues. Name the film from four: 3 points on the first clue, 2 on the second, 1 on the third.
   Five films a day, out of 15. Level setting (Jonathan): Easy / Medium / Hard / Film Buff picks the mix of films; everyone on the same level gets the same five.
   Hosts (Jonathan's drawings, "people like seeing people like themselves"): four film lovers and four critics, a different pair each day.
   House pieces as the other games: Goldilocks (rating.js via reach), weekly where-are-you card (tmg:gameover), counts (nwcount), feedback, footer, home button, Sources, Play another today, Keep playing.
   Content: /charades/films.js; scenes drawn by /charades/stage.js (stick people and everyday props only: no film characters, costumes or logos). English for now. */
(()=>{
const app=document.getElementById('app'),$=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
const K='fc',NAME='Film Charades',VIP=ls('ap-vip')==='1';
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const dateTxt=()=>{try{return new Date().toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})}catch(e){return ''}};
function rng(seed){let h=1779033703^seed.length;for(let i=0;i<seed.length;i++){h=Math.imul(h^seed.charCodeAt(i),3432918353);h=h<<13|h>>>19}
  return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return((h^=h>>>16)>>>0)/4294967296}}
const shuffle=(a,r)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const PTS=[3,2,1],LVB={e:'Easy',m:'Medium',h:'Hard',b:'Film buff'};

/* ---------- levels: which films make up each level's daily five ---------- */
const LEVELS={easy:{n:'Easy',mix:[['e',3],['m',2]]},medium:{n:'Medium',mix:[['e',1],['m',3],['h',1]]},hard:{n:'Hard',mix:[['m',2],['h',2],['b',1]]},buff:{n:'Film Buff',mix:[['h',2],['b',3]]}};
let LVL=LEVELS[ls('fc-level')]?ls('fc-level'):'easy';
/* each level walks its own way through the lists from launch day (shuffled once, batch by batch), so a film doesn't come back until its list runs out */
const POOLS={};
function pool(lv,l){const k=lv+l;if(POOLS[k])return POOLS[k];const T=FILMS.filter(f=>f.l===l),ws=[...new Set(T.map(t=>t.w||1))].sort((a,b)=>a-b);
  return POOLS[k]=ws.flatMap(w=>shuffle(T.filter(t=>(t.w||1)===w),rng('fc-'+k+(w>1?'-w'+w:''))))}
const DAY0=Date.UTC(2026,10,27);
function dayNo(seed){const m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(seed);return m?Math.round((Date.UTC(+m[1],+m[2]-1,+m[3])-DAY0)/864e5):-1}
function pick(seed,lv){const mix=LEVELS[lv].mix,n=dayNo(seed);
  if(n<0){const r=rng(seed+lv);return mix.flatMap(([l,k])=>shuffle(pool(lv,l),r).slice(0,k))}
  const out=[];mix.forEach(([l,k])=>{const P=pool(lv,l),start=mix.filter(x=>x[0]===l).reduce((a,x)=>a+x[1],0)*n;for(let j=0;j<k;j++)out.push(P[(start+j)%P.length])});return out}
let SEEN=[];try{SEEN=JSON.parse(sessionStorage.getItem('fc-seen')||'[]')}catch(e){}
function morePick(lv){const t5=new Set(pick(today(),lv).map(f=>f.t));const mix=LEVELS[lv].mix,out=[];
  mix.forEach(([l,k])=>{let c=FILMS.filter(f=>f.l===l&&!t5.has(f.t)&&!SEEN.includes(f.t));if(c.length<k)c=FILMS.filter(f=>f.l===l&&!t5.has(f.t));out.push(...shuffle(c,Math.random).slice(0,k))});
  SEEN=SEEN.concat(out.map(f=>f.t));try{sessionStorage.setItem('fc-seen',JSON.stringify(SEEN))}catch(e){}return out}

/* ---------- hosts: four film lovers and four critics; a different pair each day (mostly one of each, sometimes two lovers or two critics) ---------- */
const LOVE=[['vera','Vera'],['mei','Mei'],['amara','Amara'],['priya','Priya']].map(([k,n])=>({k,n,t:'love'}));
const CRIT=[['reginald','Reginald'],['kenji','Kenji'],['kwame','Kwame'],['arjun','Arjun']].map(([k,n])=>({k,n,t:'crit'}));
const DN=Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5),PAIRS=['lc','cl','ll','lc','cl','cc'];
const H=(()=>{const p=PAIRS[DN%6],a=DN%4,b=(DN+1+Math.floor(DN/4))%4,g=(t,i)=>t==='l'?LOVE[i]:CRIT[i];return [g(p[0],a),g(p[1],p[0]===p[1]?(a+2)%4:b)]})();
const AV=k=>`<img src="/charades/hosts/${k}.jpg?v=1" alt="" width="46" height="46">`;
const HELLO={love:['Hello! I’m {n}. I’ve seen every film ever made, some of them twice.','And I’m {n}! I’ve brought the popcorn.'],crit:['I am {n}, critic. Our actors are stick people. Do try not to be shocked.','And I am {n}. Also a critic. We disagree about everything.']};
const LINES={love:{y:['Bravo! Pass the popcorn!','Magnifique! You’ve seen a film or two.','Oh, well spotted, darling!','Yes! I knew you’d get that one.','Wonderful! Take a bow.'],n:['Oh dear. Never mind, darling, there’s always tomorrow.','Ah, so close! The stick people forgive you.','Not that one, sweetie. Next time!','Oh no! Still, a lovely guess.','Never mind. Even I mix that one up.']},
  crit:{y:['Good heavens. Correct! I’m astonished.','Hmph. Right again. Most irregular.','Correct! I may need to sit down.','Acceptable. More than acceptable, in fact.','Splendid. Five stars.'],n:['Wrong?! My monocle nearly fell out.','Incorrect. I shall write a strongly worded review.','Oh dear, oh dear. Our actors did their very best.','No, no, no. Have you been to the cinema at all?','One star. For effort.']}};
const bub=(h,small,txt)=>`<div class="hosts"><span class="av">${AV(h.k)}</span><div class="bub"><small>${esc(small)}</small>${esc(txt)}</div></div>`;

/* ---------- page shell ---------- */
const HSVG='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>';
const back=`<a class="tmghome hmb" href="/" aria-label="All games" title="All games">${HSVG}</a><a class="back" href="/">← All games</a><span class="row"></span>`;
const hdr=t=>`<div class="top">${back}<span class="tag">${esc(t||dateTxt())}</span></div>`;
let S=null;
window.tmgMidGame=()=>!!(S&&!S.over&&S.sc&&S.sc.length>0&&S.sc.length<S.qs.length);
const cls=p=>p===3?'ok':p===0?'no':'h';
const prog=()=>`<div class="prog">${S.qs.map((_,k)=>`<i class="${k<S.sc.length?cls(S.sc[k]):k===S.i?'now':''}"></i>`).join('')}</div>`;
function start(seed,practice,more){const qs=more?morePick(LVL):pick(seed,LVL);S={seed,practice:practice||!!more,more:!!more,qs,i:0,sc:[],lvl:LVL,over:false};round()}
function round(){const q=S.qs[S.i],r=rng((S.seed||'')+'|'+q.t);S.n=0;S.done=false;S.opts=shuffle([q.t,...q.w],r);draw();scrollTo(0,0)}
function draw(){const q=S.qs[S.i];
  app.innerHTML=`<div class="play">${hdr(`${S.more?'Keep playing · ':''}${S.i+1} of ${S.qs.length} · ${LEVELS[S.lvl].n}`)}${prog()}<p class="q">What’s the film? <span class="lvl ${q.l}">${LVB[q.l]}</span></p>
   <div class="stage"><div class="curtain"></div>${CHS.scene(q.sc)}</div>
   <div class="clues">${q.c.slice(0,S.n+1).map((c,k)=>bub(H[k%2],H[k%2].n+' · clue '+(k+1),c)).join('')}</div>
   ${S.done?'':`<button class="moreclue" id="mo" ${S.n>=2?'disabled':''}>${S.n>=2?'That’s every clue':'Another clue (−1 point)'}</button><p class="pts">Name it now for <b>${PTS[S.n]} point${PTS[S.n]>1?'s':''}</b></p>`}
   <div class="opts">${S.opts.map((o,k)=>`<button class="opt" data-k="${k}" ${S.done?'disabled':''}><span class="k">${'ABCD'[k]}</span><span>${esc(o)}</span></button>`).join('')}</div><div id="out"></div></div>`;
  if(S.done)return;
  $('#mo').onclick=()=>{if(S.n<2){S.n++;draw();const c=app.querySelectorAll('.clues .hosts');c[c.length-1].scrollIntoView({block:'nearest',behavior:'smooth'})}};
  app.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const o=S.opts[+b.dataset.k],ok=o===q.t,p=ok?PTS[S.n]:0;S.sc.push(p);S.done=true;draw();
    app.querySelectorAll('.opt').forEach(x=>{const v=S.opts[+x.dataset.k];x.classList.add(v===q.t?'ok':v===o?'no':'dim')});
    const host=H[(S.i+1)%2],line=LINES[host.t][ok?'y':'n'][(S.i+S.sc.length*3)%5],last=S.i===S.qs.length-1;
    $('#out').innerHTML=`${bub(host,host.n,line)}<div class="fact"><b class="${ok?'g':'r'}">${ok?'Yes! +'+p:'It’s '+esc(q.t)}</b><b class="ttl2">${esc(q.t)} (${q.y})</b>${esc(q.f)}</div><button class="next" id="nx">${last?'See my score':'Next film →'}</button>`;
    $('#nx').onclick=()=>{if(last)(S.more?moreEnd():end());else{S.i++;round()}};$('#out').scrollIntoView({block:'nearest',behavior:'smooth'})})}

/* ---------- the end ---------- */
const verdict=n=>n>=14?'Box office gold 🎬':n>=11?'A proper film buff. Bravo!':n>=8?'Two thumbs up. Nicely done.':n>=4?'Not bad! Some of those were tricky.':'The stick people need more rehearsal. Five new films tomorrow.';
const SQ=p=>p===3?'🟩':p>0?'🟨':'🟥';
function record(n){const st=JSON.parse(ls(K+'-st')||'null')||{played:0,streak:0,last:''};const y=new Date();y.setDate(y.getDate()-1);
  const yk=y.getFullYear()+'-'+String(y.getMonth()+1).padStart(2,'0')+'-'+String(y.getDate()).padStart(2,'0');
  st.streak=st.last===yk?st.streak+1:st.last===today()?st.streak:1;st.last=today();st.played++;ls(K+'-st',JSON.stringify(st));
  ls(K+'-done-'+today(),String(n));ls(K+'-streak',JSON.stringify({n:st.streak,last:today()}))}  /* the home page card and other games' lists read fc-done- and fc-streak */
const list=()=>`<div class="list">${S.qs.map((q,k)=>`<div class="li"><i>${SQ(S.sc[k])}</i><div><b>${esc(q.t)}</b> <span>· ${q.y}</span></div></div>`).join('')}</div>`;
function end(rev){S.over=true;const n=S.sc.reduce((a,b)=>a+b,0),bk=K+'-best-'+S.lvl;let best=+ls(bk)||0;const newBest=!S.practice&&!rev&&n>best;if(newBest){best=n;ls(bk,String(n))}
  if(!S.practice&&!rev){ls(K+'-day',JSON.stringify({d:S.seed,n,sc:S.sc,lvl:S.lvl,t:S.qs.map(q=>q.t)}));record(n);setTimeout(()=>{try{dispatchEvent(new Event('tmg:gameover'))}catch(e){}},0)}
  const share=`${NAME} · twominute.games\n${S.sc.map(SQ).join('')} ${n}/15 (${LEVELS[S.lvl].n})`;
  app.innerHTML=`${hdr(S.practice&&!rev?'Practice set':'')}
  <div class="panel"><div class="score"><div class="tag">Your score · ${LEVELS[S.lvl].n}</div><div class="big">${n}<small> / 15</small></div><p class="verdict">${esc(verdict(n))}</p>
   <div class="dots">${S.sc.map(p=>`<i class="${cls(p)}"></i>`).join('')}</div>
   <p class="best">${rev?'You’ve seen today’s five. New films at midnight.':newBest?'🎉 Your best score yet':best?`Your best: ${best} / 15`:''}</p></div>
   ${list()}
   <div class="btns"><button class="btn" id="share">Share my score</button></div>
   <p class="small">Five new films tomorrow, the same for everyone on your level.</p><p class="small srcl"><button type="button" class="lnk" id="srcBtn">Sources</button></p></div>
  ${keepPanel()}${more()}${VIP?'<div class="btns"><button class="btn ghost" id="again">Practice set (owner only)</button></div>':''}`;
  $('#share').onclick=async()=>{const u='https://twominute.games/charades/';try{if(navigator.share){await navigator.share({text:share+'\n'+u})}else{await navigator.clipboard.writeText(share+'\n'+u);$('#share').textContent='Copied ✓'}}catch(e){}};
  $('#srcBtn').onclick=sources;keepWire();const ag=$('#again');if(ag)ag.onclick=()=>start(today()+':p'+Date.now(),true);scrollTo(0,0)}
function lvlButtons(dis){return `<div class="lvls" role="group" aria-label="Level">${Object.entries(LEVELS).map(([k,v])=>`<button type="button" data-l="${k}" class="${k===LVL?'on':''}" ${dis?'disabled':''}>${v.n}</button>`).join('')}</div>`}
function lvlWire(scope){app.querySelectorAll(scope+' .lvls button').forEach(b=>b.onclick=()=>{LVL=b.dataset.l;ls('fc-level',LVL);app.querySelectorAll(scope+' .lvls button').forEach(x=>x.classList.toggle('on',x===b))})}
function keepPanel(){return `<div class="panel more keep"><div class="tag">Keep playing</div><p class="small" style="margin:2px 0 10px">Five more films, as often as you like. Just for fun: not counted.</p>${lvlButtons(false)}<div class="btns" style="margin-top:10px"><button class="btn" id="keep">Five more films</button></div></div>`}
function keepWire(){lvlWire('.keep');const b=$('#keep');if(b)b.onclick=()=>start('k'+Date.now(),true,true)}
function moreEnd(){S.over=true;const n=S.sc.reduce((a,b)=>a+b,0);
  app.innerHTML=`${hdr('Keep playing')}<div class="panel"><div class="score"><div class="tag">Keep playing · ${LEVELS[S.lvl].n}</div><div class="big">${n}<small> / 15</small></div><p class="verdict">${esc(verdict(n))}</p><div class="dots">${S.sc.map(p=>`<i class="${cls(p)}"></i>`).join('')}</div></div>
   ${list()}<div class="again"><b>Play another five?</b><div class="btns"><button class="btn" id="keep">Yes, five more films</button></div></div></div>${more()}`;const b=$('#keep');b.onclick=()=>start('k'+Date.now(),true,true);scrollTo(0,0)}

/* Play another today */
const OTHERS=[['Aperture','/aperture/','aperture','aperture2-best-'],['Landmarks','/aperture/landmarks/','landmarks','apL-best-'],['When was that?','/when/','when','when-done-'],['Masterpiece','/masterpiece/','masterpiece','mp-done-'],['Point to the Region','/region/','region','rg-done-'],['Natural Wonders','/wonders/','natural-wonders',''],['Fictional a→z','/fictional/','fictional','fictional-best-'],['Name That Classic','/classic/','classic','lclassic-done-'],['What’s That Noise?','/noise/','noise','lnoise-done-']];
function more(){return `<div class="panel more"><div class="tag">Play another today</div><div class="mgs">${OTHERS.map(([n,h,ic,k])=>{const d=k&&ls(k+today());
  return `<a class="mg${d?' done':''}" href="${h}"><img src="/icons/${ic}-180.png?v=${['when','masterpiece','region'].includes(ic)?1:3}" alt="" width="40" height="40"><b>${esc(n)}</b><span>${d?'✓ Played':'Play'}</span></a>`}).join('')}</div></div>`}

/* Sources: same as the other games; the email is used only to send the list, then deleted */
function sources(){const ov=document.createElement('div');ov.className='srcov';
  ov.innerHTML=`<form class="srcbox" role="dialog" aria-label="Sources" novalidate><div class="tag">Sources</div><h3>${NAME}</h3><p>The scenes are our own drawings: stick people acting it out, as in a game of charades. The facts are checked against film histories and encyclopaedias. Want the full list? Leave your email and we’ll send it to you.</p>
   <input type="email" id="srcE" autocomplete="email" inputmode="email" maxlength="150" placeholder="Your email" required>
   <button type="submit" class="btn" id="srcGo">Send me the sources</button>
   <p class="sm" id="srcM" aria-live="polite">We’ll only use your email to send you the sources, then delete it. <a href="/about/#privacy" target="_blank" rel="noopener">Privacy</a></p>
   <button type="button" class="btn ghost" id="srcX">Close</button></form>`;
  document.body.appendChild(ov);const f=ov.querySelector('form'),e=ov.querySelector('#srcE'),m=ov.querySelector('#srcM'),go=ov.querySelector('#srcGo'),x=()=>ov.remove();
  ov.onclick=ev=>{if(ev.target===ov)x()};ov.querySelector('#srcX').onclick=x;setTimeout(()=>e.focus(),60);
  f.onsubmit=async ev=>{ev.preventDefault();const em=e.value.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){m.textContent='Please check your email address.';e.focus();return}
    go.disabled=true;m.textContent='Sending…';const sv=v=>({stringValue:String(v)});
    const doc=k=>({fields:{kind:sv(k),message:sv((k==='sources'?'':'[Sources request] ')+'Please send the sources for Film Charades (EN).'),contact:sv(em),game:sv(document.title.slice(0,120)),page:sv(location.pathname.slice(0,200)),where:sv('sources · charades · en'),device:sv(matchMedia('(pointer:coarse)').matches?'phone':'desktop'),ua:sv(navigator.userAgent.slice(0,300)),at:{timestampValue:new Date().toISOString()}}});
    const post=k=>fetch('https://firestore.googleapis.com/v1/projects/aperture-c0961/databases/(default)/documents/feedback?key=AIzaSyCLMslnXssvPk7S7l_0MuajudNtHRK-VAI',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(doc(k))}).then(r=>r.ok);
    let ok=false;try{ok=await post('sources');if(!ok)ok=await post('idea')}catch(err){}
    if(!ok){m.textContent='That didn’t send. Please try again in a moment.';go.disabled=false;return}
    f.innerHTML=`<div class="tag">Sources</div><h3>✓</h3><p>Thanks! We’ll email you the sources soon.</p><button type="button" class="btn ghost" id="srcX">Close</button>`;f.querySelector('#srcX').onclick=x}}

/* ---------- start page ---------- */
function dayRec(){try{const o=JSON.parse(ls(K+'-day')||'null');return o&&o.d===today()?o:null}catch(e){return null}}
function intro(){const r=dayRec(),played=!!r;
  app.innerHTML=`${hdr()}<div class="panel intro menu"><img class="gicon" src="/icons/charades-180.png?v=1" alt="" width="64" height="64"><span class="tag">Film · daily</span><h2>${NAME}</h2><p class="sub">The stick people are acting. What’s the film?</p>
   ${H.map((h,i)=>bub(h,h.n,HELLO[h.t][i===1&&H[0].t===h.t?1:0].replace('{n}',h.n))).join('')}
   <ul><li>Five films, about two minutes</li><li>Name it on the first clue for 3 points, then 2, then 1</li><li>A behind-the-scenes fact for every film</li></ul>
   ${lvlButtons(played)}<p class="lvlh">${played?'':'Easy is the big crowd-pleasers; Film Buff is the classics.'}</p>
   <div class="btns">${played?`<p class="best" style="text-align:center;margin:0">Today you scored ${r.n} / 15 (${LEVELS[r.lvl]?LEVELS[r.lvl].n:''})</p>`:''}<button class="btn" id="go">${played?'Admire my score':'Start'}</button>${VIP?'<button class="btn ghost" id="again">Practice set (owner only)</button>':''}</div></div>${played?keepPanel():''}`;
  lvlWire('.intro');if(played)keepWire();
  $('#go').onclick=()=>{if(!played)return start(today(),false);
    const qs=(r.t||[]).map(t=>FILMS.find(f=>f.t===t)).filter(Boolean);S={seed:r.d,practice:false,qs,sc:r.sc,lvl:LEVELS[r.lvl]?r.lvl:'easy',over:true};end(true)};
  const ag=$('#again');if(ag)ag.onclick=()=>start(today()+':p'+Date.now(),true)}
window.__fc={pick,morePick,LEVELS,H};
intro();
})();
