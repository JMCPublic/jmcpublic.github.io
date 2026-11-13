/* Contacts tab (collection 'contacts'): your contacts by country, with their local time against the UK.
   Private: only the owner's Google account can read or add (Firestore collection 'contacts', rules v11). */
(()=>{const OWNER='mybetterbrain109@gmail.com',P='aperture-c0961';
const BASE=`https://firestore.googleapis.com/v1/projects/${P}/databases/(default)/documents/contacts`;
const card=document.getElementById('hpCard');if(!card)return;
const $=s=>card.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let WM=null,PL=null,H=[],user=null,tok='';
// continent windows: /aperture/stats/?contacts=Europe opens just that part of the map, big
const ZB={'Europe':[435,39,182,113],'Africa':[445,143,207,232],'Asia':[559,88,354,207],'North America':[33,31,368,207],'South America':[266,219,153,222],'Oceania':[769,262,227,152]};
const Z=new URLSearchParams(location.search).get('contacts'),ZOOM=Z&&ZB[Z]?ZB[Z]:null;
const bc=('BroadcastChannel' in window)?new BroadcastChannel('tmg-contacts'):null;
const ICO='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-8 8M10 20H4v-6"/></svg>';
const tmin=tz=>{const f=new Intl.DateTimeFormat('en-GB',{timeZone:tz,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());return +f.find(x=>x.type==='hour').value*60+ +f.find(x=>x.type==='minute').value};
const off=tz=>{let m=tmin(tz)-tmin('Europe/London');if(m>720)m-=1440;if(m<-720)m+=1440;return m};
const offs=m=>m===0?'same as UK':(m>0?'+':'−')+Math.floor(Math.abs(m)/60)+(Math.abs(m)%60?':'+String(Math.abs(m)%60).padStart(2,'0'):'')+' h';
const tstr=tz=>new Date().toLocaleTimeString('en-GB',{timeZone:tz,hour:'2-digit',minute:'2-digit'});
const place=(c,city)=>{const cap=PL.caps[c];if(city){const k=PL.cities.find(x=>x[0]===c&&x[1]===city);if(k)return{c,city,x:k[2],y:k[3],tz:k[4],cn:cap?cap[3]:c}}
  return cap?{c,city:cap[2],x:cap[0],y:cap[1],tz:cap[4],cn:cap[3]}:null};

const css=document.createElement('style');css.textContent=`
#hpCard .hptop{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:10px}
#hpCard .hpuk{display:flex;align-items:baseline;gap:8px}#hpCard .hpuk b{font:700 26px var(--mono)}#hpCard .hpuk span{color:var(--soft);font-size:13px}
#hpCard .hpmap{position:relative;border-radius:12px;overflow:hidden}
#hpCard svg{display:block;width:100%;height:auto}
#hpCard .ct{cursor:pointer;transition:fill .12s}#hpCard .ct:hover,#hpCard .ct.hov{fill:#aab4c6}#hpCard .ct.has{fill:#2fae6a}#hpCard .ct.has:hover,#hpCard .ct.has.hov{fill:#23905a}
#hpCard .hit{fill:transparent;cursor:pointer}
#hpCard .city{cursor:pointer}#hpCard .city circle.d{fill:#16181d;stroke:#fff;stroke-width:.8}#hpCard .city.has circle.d{fill:#2fae6a}#hpCard .city:hover circle.d{fill:var(--blue)}
#hpCard .tzl{stroke:#c9d0dc;stroke-width:.6;stroke-dasharray:2 3}#hpCard .tzt{font:600 9px var(--mono);fill:#8a909c;text-anchor:middle}#hpCard .tzt.uk{fill:var(--blue)}
#hpCard .hptip{position:absolute;z-index:4;pointer-events:none;background:var(--ink);color:#fff;font-size:12px;padding:4px 8px;border-radius:8px;white-space:nowrap;transform:translate(-50%,-130%)}#hpCard .hptip span{opacity:.75}
#hpCard .hpkey{font-size:12px;color:var(--soft);margin-top:8px}
#hpCard .hppop{position:absolute;z-index:5;width:300px;background:#fff;border:1.5px solid var(--frame);border-radius:16px;box-shadow:0 18px 40px -16px rgba(0,0,0,.35);padding:14px}
#hpCard .hppop h3{margin:0;font-size:18px}#hpCard .hppop .sub{color:var(--soft);font-size:13px;margin:2px 0 10px}
#hpCard .hptime{display:flex;gap:10px;align-items:baseline;background:var(--blue-wash);border-radius:10px;padding:8px 10px;margin-bottom:10px}#hpCard .hptime b{font:700 20px var(--mono)}#hpCard .hptime span{font-size:13px;color:var(--soft)}#hpCard .hptime em{margin-left:auto;font:700 14px var(--mono);font-style:normal;color:var(--blue)}
#hpCard .hppop ul{list-style:none;padding:0;margin:0 0 6px;max-height:120px;overflow:auto}#hpCard .hppop li{display:flex;justify-content:space-between;gap:8px;font-size:14px;padding:5px 0;border-bottom:1px solid #f0f2f5}#hpCard .hppop li small{color:var(--soft)}
#hpCard .hppop label{display:block;font-size:12px;font-weight:600;margin:8px 0 4px}
#hpCard .hppop input{width:100%;font:inherit;font-size:15px;border:1.5px solid var(--frame);border-radius:10px;padding:8px 10px;box-sizing:border-box}
#hpCard .hprow{display:flex;gap:8px;justify-content:flex-end;align-items:center;margin-top:12px;flex-wrap:wrap}#hpCard .hprow .msg{margin-right:auto;font-size:12px;color:var(--soft)}
#hpCard .hppop button,#hpCard .hpdel{font:inherit;font-size:14px;border-radius:999px;padding:7px 14px;border:1.5px solid var(--frame);background:#fff;cursor:pointer;color:var(--ink)}#hpCard .hppop button.go{background:var(--ink);color:#fff;border-color:var(--ink)}
#hpCard .hppop .x{position:absolute;top:8px;right:10px;border:0;font-size:20px;padding:2px 6px;color:var(--soft)}
#hpCard .hpdel{font-size:12px;padding:3px 10px}
#hpCard .hpzoom{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 0 10px}#hpCard .hpzoom>span{font-size:12px;color:var(--soft);margin-right:2px}
#hpCard .hpzoom button,#hpCard .hpzh button{font:inherit;font-size:13px;border:1.5px solid var(--frame);background:#fff;color:var(--ink);border-radius:999px;padding:5px 12px;cursor:pointer;display:inline-flex;align-items:center;gap:5px}#hpCard .hpzoom button:hover{border-color:var(--blue);color:var(--blue)}#hpCard .hpzoom svg{width:12px;height:12px;display:inline}
#hpCard .hpzh{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 8px}#hpCard .hpzh h2{margin:0;font-size:20px}
#hpCard path,#hpCard line{vector-effect:non-scaling-stroke}
body.hpz .wrap{max-width:none;padding:10px 14px}body.hpz .wrap>*:not(#hpCard){display:none!important}body.hpz #hpCard{display:block!important;margin:0;padding:12px}
body.hpz #hpCard svg{height:calc(100vh - 150px);min-height:320px}body.hpz #hpList{display:none}
@media (max-width:600px){#hpCard .hppop{position:fixed;left:8px!important;right:8px;top:auto!important;bottom:8px;width:auto}}`;
document.head.appendChild(css);

card.innerHTML=(ZOOM?`<div class="hpzh"><h2>Contacts · ${esc(Z)}</h2><button type="button" id="hpClose">Close window</button></div>`:'')+`<div class="hptop"><div class="hpuk"><span>UK now</span><b id="hpUk">--:--</b></div><div class="tiles" id="hpTiles"></div></div>
${ZOOM?'':`<div class="hpzoom"><span>Open bigger:</span>${Object.keys(ZB).map(k=>`<button type="button" data-z="${k}">${ICO}${k}</button>`).join('')}</div>`}<div class="hpmap" id="hpMap"><svg viewBox="0 0 1000 540" id="hpSvg"></svg><div class="hptip" id="hpTip" hidden></div></div>
<div class="hpkey">Point at a country or a city dot to see its name · click it to add a contact · <span style="color:#2fae6a">■</span> has contacts · dots = cities in countries with more than one time zone · numbers along the ${ZOOM?'top':'bottom'} = hours ahead of or behind the UK</div>
<div class="rbody" id="hpList"><p class="msgnote">Loading…</p></div>`;

const api=async(path,opt={})=>{tok=await user.getIdToken();const r=await fetch(BASE+path,{...opt,headers:{Authorization:'Bearer '+tok,'Content-Type':'application/json'}});if(!r.ok)throw r.status;return r.status===204?null:r.json()};
const val=f=>f?(f.stringValue??f.timestampValue??''):'';
async function load(){let out=[],pt='';do{const j=await api('?pageSize=300'+(pt?'&pageToken='+pt:''));out=out.concat(j.documents||[]);pt=j.nextPageToken||''}while(pt);
  H=out.map(d=>({id:d.name.split('/').pop(),n:val(d.fields.name),k:val(d.fields.contact),c:val(d.fields.country),city:val(d.fields.city),at:val(d.fields.at)||d.createTime})).sort((a,b)=>a.n.localeCompare(b.n))}
async function add(h){const s=x=>({stringValue:String(x)});const j=await api('',{method:'POST',body:JSON.stringify({fields:{name:s(h.n),contact:s(h.k),country:s(h.c),city:s(h.city||''),at:{timestampValue:new Date().toISOString()}}})});h.id=j.name.split('/').pop();H.push(h);H.sort((a,b)=>a.n.localeCompare(b.n))}
async function del(id){await api('/'+id,{method:'DELETE'});H=H.filter(h=>h.id!==id)}

function draw(){if(!WM||!PL)return;const a3={};Object.entries(WM.a2).forEach(([k,v])=>a3[v]=k);
  const hc=new Set(H.map(h=>h.c)),hcity=new Set(H.filter(h=>h.city).map(h=>h.c+'|'+h.city));
  let s=`<path d="${WM.sphere}" fill="#f6f8ff"/>`;
  const k=ZOOM?Math.max(ZOOM[2],ZOOM[3]*1.6)/1000:1,fs=ZOOM?9*k*1.5:9,ty=ZOOM?ZOOM[1]+fs*0.4:532;
  let tz='';for(let h=-11;h<=12;h++){const x=500+h*(492/12);s+=`<line class="tzl" x1="${x}" y1="10" x2="${x}" y2="512"/>`;tz+=`<text class="tzt ${h===0?'uk':''}" x="${x}" y="${ty}" style="font-size:${fs}px">${h===0?'UK':(h>0?'+':'−')+Math.abs(h)}</text>`}
  s+=Object.entries(WM.c).map(([k,d])=>{const c=a3[k],ok=c&&PL.caps[c];return `<path d="${d}" class="${ok?'ct':''}${hc.has(c)?' has':''}" ${ok?`data-c="${c}"`:''} fill="#e6e9ef" stroke="#fff" stroke-width=".6"/>`}).join('');
  const dr=ZOOM?2.6*k*1.4:2.6,hr=ZOOM?5*k*1.4:5;Object.entries(PL.caps).forEach(([c,[x,y]])=>{s+=`<circle class="hit" data-c="${c}" cx="${x}" cy="${y}" r="${hr}"/>`});
  PL.cities.forEach(([c,n,x,y])=>{s+=`<g class="city${hcity.has(c+'|'+n)?' has':''}" data-c="${c}" data-city="${esc(n)}"><circle class="d" cx="${x}" cy="${y}" r="${dr}"/><circle cx="${x}" cy="${y}" r="${hr}" fill="transparent"/></g>`});
  s+=tz;
  const svg=$('#hpSvg');svg.innerHTML=s;if(ZOOM){const pad=ZOOM[2]*.03;svg.setAttribute('viewBox',`${ZOOM[0]-pad} ${ZOOM[1]-fs*1.4} ${ZOOM[2]+pad*2} ${ZOOM[3]+fs*1.4+pad}`)}const mb=$('#hpMap'),tip=$('#hpTip');
  svg.querySelectorAll('[data-c]').forEach(g=>{const c=g.dataset.c,city=g.dataset.city||'';
    g.onmousemove=e=>{const r=mb.getBoundingClientRect(),pl=place(c,city);if(!pl)return;const here=H.filter(h=>h.c===c&&(!city||h.city===city));
      tip.innerHTML=`<b>${esc(city?city+', '+pl.cn:pl.cn)}</b> <span>${offs(off(pl.tz))}${here.length?' · '+esc(here.map(h=>h.n).join(', ')):''}</span>`;
      tip.style.left=(e.clientX-r.left)+'px';tip.style.top=(e.clientY-r.top)+'px';tip.hidden=false;
      svg.querySelectorAll('.ct.hov').forEach(x=>x.classList.remove('hov'));if(!city)svg.querySelectorAll(`.ct[data-c="${c}"]`).forEach(x=>x.classList.add('hov'))};
    g.onmouseleave=()=>{tip.hidden=true;svg.querySelectorAll('.ct.hov').forEach(x=>x.classList.remove('hov'))};
    g.onclick=e=>{e.stopPropagation();tip.hidden=true;pop(c,city,e)}});
  const zones=new Set(H.map(h=>{const p=place(h.c,h.city);return p?off(p.tz):0}));
  $('#hpTiles').innerHTML=`<div class="tile"><span>Contacts</span><b>${H.length}</b></div><div class="tile"><span>Countries</span><b>${hc.size}</b></div><div class="tile"><span>Time zones</span><b>${zones.size}</b></div>`;
  $('#hpList').innerHTML=H.length?`<table class="rt"><tr><th>Name</th><th>Where</th><th>Contact</th><th class="n">Their time</th><th class="n">vs UK</th><th></th></tr>${H.map(h=>{const p=place(h.c,h.city)||{tz:'UTC',cn:h.c,city:''};
    return `<tr><td>${esc(h.n)}</td><td>${esc(p.cn)}${h.city?' · '+esc(h.city):''}</td><td>${esc(h.k||'–')}</td><td class="n">${tstr(p.tz)}</td><td class="n">${offs(off(p.tz))}</td><td><button class="hpdel" data-id="${h.id}" aria-label="Remove ${esc(h.n)}">Remove</button></td></tr>`}).join('')}</table>`
    :'<p class="msgnote">No contacts yet. Click a country on the map to add the first one.</p>';
  $('#hpList').querySelectorAll('.hpdel').forEach(b=>b.onclick=async()=>{const h=H.find(x=>x.id===b.dataset.id);if(!h||!confirmDel(b,h))return;try{await del(h.id);if(bc)bc.postMessage('changed');draw()}catch(e){b.textContent='Failed'}});
  $('#hpUk').textContent=tstr('Europe/London')}
// two taps to remove, no browser dialog
function confirmDel(b,h){if(b.dataset.sure)return true;b.dataset.sure='1';b.textContent='Sure?';setTimeout(()=>{if(b.isConnected){delete b.dataset.sure;b.textContent='Remove'}},3000);return false}

function pop(c,city,e){close();const pl=place(c,city);if(!pl)return;const mb=$('#hpMap'),r=mb.getBoundingClientRect();
  const d=document.createElement('div');d.className='hppop';d.id='hpPop';mb.appendChild(d);
  const render=()=>{const here=H.filter(h=>h.c===c&&(city?h.city===city:!h.city||!PL.cities.some(k=>k[0]===c&&k[1]===h.city)));
    d.innerHTML=`<button class="x" aria-label="Close">×</button><h3>${esc(city?city:pl.cn)}</h3><div class="sub">${city?esc(pl.cn):'Time shown for '+esc(pl.city)}</div>
    <div class="hptime"><b>${tstr(pl.tz)}</b><span>there · UK ${tstr('Europe/London')}</span><em>${offs(off(pl.tz))}</em></div>
    ${here.length?`<ul>${here.map(h=>`<li><span>${esc(h.n)}</span><small>${esc(h.k)}</small></li>`).join('')}</ul>`:''}
    <label for="hpN">Name</label><input id="hpN" maxlength="80" autocomplete="off" placeholder="e.g. Pete">
    <label for="hpK">Email or social media</label><input id="hpK" maxlength="150" autocomplete="off" placeholder="name@example.com or @Facebook">
    <div class="hprow"><span class="msg" aria-live="polite"></span><button class="sv">Save</button><button class="go">Save and close</button></div>`;
    d.querySelector('.x').onclick=close;
    const save=async andClose=>{const n=d.querySelector('#hpN').value.trim(),k=d.querySelector('#hpK').value.trim(),m=d.querySelector('.msg');if(!user){m.textContent='Sign in on the Messages tab first.';return}if(!n){d.querySelector('#hpN').focus();return}
      d.querySelectorAll('.hprow button').forEach(b=>b.disabled=true);m.textContent='Saving…';
      try{await add({n,k,c,city:city||''});if(bc)bc.postMessage('changed');draw();if(andClose)close();else{render();d.querySelector('.msg').textContent=`Saved ${n}.`;d.querySelector('#hpN').focus()}}
      catch(err){m.textContent=`Couldn’t save (error ${err}). Are the Firebase rules v11?`;d.querySelectorAll('.hprow button').forEach(b=>b.disabled=false)}};
    d.querySelector('.sv').onclick=()=>save(false);d.querySelector('.go').onclick=()=>save(true);
    d.querySelectorAll('input').forEach(i=>i.onkeydown=ev=>{if(ev.key==='Enter')save(false)})};
  render();d.onclick=ev=>ev.stopPropagation();
  const px=e.clientX-r.left,py=e.clientY-r.top;let L=px+14,T=py-20;if(L+310>r.width)L=px-314;if(L<4)L=4;if(T+d.offsetHeight>mb.offsetHeight)T=mb.offsetHeight-d.offsetHeight-4;if(T<4)T=4;d.style.left=L+'px';d.style.top=T+'px';
  setTimeout(()=>{const i=d.querySelector('#hpN');if(i&&matchMedia('(pointer:fine)').matches)i.focus()},30)}
function close(){const p=document.getElementById('hpPop');if(p)p.remove()}
document.addEventListener('click',e=>{if(!e.target.closest('#hpPop'))close()});
addEventListener('keydown',e=>{if(e.key==='Escape')close()});
// continent buttons, and keeping every open window up to date
card.addEventListener('click',e=>{const b=e.target.closest('[data-z]');if(b){e.stopPropagation();window.open('/aperture/stats/?contacts='+encodeURIComponent(b.dataset.z),'tmg-contacts-'+b.dataset.z.replace(/\W/g,''),'width=1280,height=860')}
  if(e.target.closest('#hpClose'))window.close()});
if(bc)bc.onmessage=async()=>{if(user){try{await load();draw()}catch(e){}}};
if(ZOOM){document.body.classList.add('hpz');document.title='Contacts · '+Z;const t=document.querySelector('.rtabs button[data-t="helpers"]');if(t)t.click()}
setInterval(()=>{if(!card.offsetParent)return;const u=$('#hpUk');if(u)u.textContent=tstr('Europe/London')},20000);

Promise.all([fetch('/shared/wmap.json').then(r=>r.json()),fetch('/shared/places.json?v=2').then(r=>r.json())]).then(([w,p])=>{WM=w;PL=p;draw()}).catch(()=>{$('#hpList').innerHTML='<p class="msgnote">The map didn’t load.</p>'});
try{firebase.app('msgs').auth().onAuthStateChanged(async u=>{if(!u||(u.email||'').toLowerCase()!==OWNER){user=null;H=[];draw();$('#hpList').innerHTML='<p class="msgnote">Sign in on the Messages tab to see and add contacts.</p>';return}
  user=u;try{await load();draw()}catch(e){draw();$('#hpList').innerHTML=`<p class="msgnote">Couldn’t read contacts (error ${esc(e)}). Publish the Firebase rules v11 (adds the contacts collection).</p>`}})}catch(e){}
})();
