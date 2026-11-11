/* twominute.games reach (step 1, built 5 Nov 2026)
   - Campaign links: ?from=TAG (e.g. ?from=reddit-au). LinkedIn and Facebook links use ?ww=jmc_linkedin and ?ww=jmc_facebook (stored as li / fb).
   - Patient Zero: every share link gets an anonymous code ?r=CODE-STEP-ROOT, so we can see how far a link travels. No names.
   - Where in the World: people arriving from ?ww=li / ?ww=fb get a short form (country filled in from the time zone).
   - Walk-ins (no tag): counted by country only.
   - Local welcome on the home page, from the device's time zone.
   No IP address is used or stored. The owner's own devices (VIP) are not counted. */
(()=>{if(window.tmgReach||window.top!==window)return;
const P='aperture-c0961',K='AIzaSyCLMslnXssvPk7S7l_0MuajudNtHRK-VAI',BASE=`https://firestore.googleapis.com/v1/projects/${P}/databases/(default)/documents`;
const LIVE=location.protocol==='https:'&&!/claude|anthropic|usercontent/.test(location.hostname);
const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
const q=new URLSearchParams(location.search);const VIP=ls('ap-vip')==='1';
const ukParts=o=>{try{const p=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',...o}).formatToParts(new Date()),g=t=>p.find(x=>x.type===t).value;return g}catch(e){return null}};
const MONTH=(()=>{const g=ukParts({year:'numeric',month:'2-digit'});return g?g('year')+'-'+g('month'):''})();
const DAY=(()=>{const g=ukParts({year:'numeric',month:'2-digit',day:'2-digit'});return g?g('year')+'-'+g('month')+'-'+g('day'):''})();
const clean=s=>String(s||'').toLowerCase().replace(/[^a-z0-9-]/g,'').slice(0,30);
const fkey=s=>{const k=clean(s).replace(/-/g,'_')||'none';return /^[a-z_]/.test(k)?k:'t_'+k};
const tzName=(()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){return ''}})();
let CC='';const ccReady=fetch('/shared/tz.json').then(r=>r.json()).then(j=>{CC=j[tzName]||''}).catch(()=>{}).then(()=>{if(!CC){const m=/-([A-Z]{2})$/i.exec(navigator.language||'');CC=m?m[1].toUpperCase():''}return CC});
const flag=c=>/^[A-Z]{2}$/.test(c)?String.fromCodePoint(...[...c].map(x=>127397+x.charCodeAt(0))):'🌍';
const cname=c=>{if(c==='GB')return 'the UK';if(c==='US')return 'the US';try{return new Intl.DisplayNames(['en'],{type:'region'}).of(c)}catch(e){return c}};
// --- who sent this visitor (first visit on this device wins) ---
const me=ls('tmg-me')||(()=>{const c=Math.random().toString(36).slice(2,8);ls('tmg-me',c);return c})();
let src;try{src=JSON.parse(ls('tmg-src')||'null')}catch(e){src=null}
const WW={jmc_linkedin:'li',jmc_facebook:'fb',li:'li',fb:'fb'},ww=WW[String(q.get('ww')||'').toLowerCase().trim()]||'',from=clean(q.get('from')),rp=/^([a-z0-9]{4,10})-(\d{1,2})-([a-z0-9-]{1,30})$/.exec(clean(q.get('r'))||'');
const isNew=!src;
if(!src){
  if(rp)src={root:rp[3],step:Math.min(+rp[2]+1,20),parent:rp[1],day:DAY};
  else if(ww==='li'||ww==='fb')src={root:ww,step:1,day:DAY};
  else if(from)src={root:from,step:1,day:DAY};
  else src={root:'walkin',step:0,day:DAY};
  ls('tmg-src',JSON.stringify(src))}
// --- counters: stats/reach (all time), reach-YYYY-MM (month) ---
async function commit(id,fields){if(!LIVE||VIP||/\bClaude\//.test(navigator.userAgent))return; /* Claude's test browser is never counted, same as the games */try{await fetch(`${BASE}:commit?key=${K}`,{method:'POST',keepalive:true,headers:{'Content-Type':'application/json'},
  body:JSON.stringify({writes:[{transform:{document:`projects/${P}/databases/(default)/documents/stats/${id}`,fieldTransforms:Object.entries(fields).map(([f,n])=>({fieldPath:f,increment:{integerValue:String(n)}}))}}]})})}catch(e){}}
const bump=async f=>{await Promise.all([commit('reach',f),MONTH>='2026-11'?commit('reach-'+MONTH,f):null])}; // both at once
const R=fkey(src.root);
const onceToday=k=>{if(ls(k)===DAY)return false;ls(k,DAY);return true};
ccReady.then(cc=>{const f={};
  if(onceToday('tmg-rv')){f[`src.${R}.visits`]=1;if(isNew)f[`src.${R}.uniques`]=1;
    if(!isNew&&src.day!==DAY&&ls('tmg-back')!=='1'){ls('tmg-back','1');f[`src.${R}.back`]=1}
    if(isNew&&src.root==='walkin'&&cc)f['walkc.'+cc]=1}
  if(/^\/(aperture|natural-wonders-|duggen)/.test(location.pathname)&&ls('tmg-rplayed')!=='1'){ls('tmg-rplayed','1');f[`src.${R}.played`]=1}
  if(Object.keys(f).length)bump(f);
  // Patient Zero: one anonymous record per new visitor who arrived through a tagged or shared link
  if(isNew&&src.root!=='walkin'&&LIVE&&!VIP){const s=x=>({stringValue:String(x)});
    fetch(`${BASE}/spread?key=${K}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:{root:s(src.root),step:{integerValue:String(src.step)},parent:s(src.parent||''),country:s(cc||''),at:{timestampValue:new Date().toISOString()}}})}).catch(()=>{})}
  welcome(cc);if(ww==='li'||ww==='fb')witw(ww,cc)});
// --- every twominute.games link a player copies or shares carries their anonymous code ---
const tag=u=>{try{const x=new URL(u);if(!/twominute\.games$/.test(x.hostname))return u;x.searchParams.delete('ww');x.searchParams.delete('from');x.searchParams.set('r',`${me}-${src.step}-${clean(src.root)}`);return x.toString()}catch(e){return u}};
const tagText=t=>String(t).replace(/(?:https?:\/\/)?twominute\.games(?:\/[^\s]*)?/g,m=>{const u=tag(/^https?:/.test(m)?m:'https://'+m);return /^https?:/.test(m)?u:u.replace(/^https:\/\//,'')});
try{const cb=navigator.clipboard;if(cb&&cb.writeText){const w=cb.writeText.bind(cb);cb.writeText=t=>w(tagText(t))}}catch(e){}
try{if(navigator.share){const s=navigator.share.bind(navigator);navigator.share=d=>s({...d,...(d&&d.text?{text:tagText(d.text)}:{}),...(d&&d.url?{url:tag(d.url)}:{})})}}catch(e){}
// --- local welcome (home page only) ---
const HI={FI:'Hei',SE:'Hej',NO:'Hei',DK:'Hej',IS:'Halló',DE:'Hallo',AT:'Servus',CH:'Grüezi',NL:'Hallo',BE:'Hallo',LU:'Moien',FR:'Bonjour',ES:'Hola',MX:'Hola',AR:'Hola',CL:'Hola',CO:'Hola',PE:'Hola',IT:'Ciao',PT:'Olá',BR:'Olá',IE:'Dia duit',GB:'Hello',US:'Hi',CA:'Hi',AU:'G’day',NZ:'Kia ora',IN:'Namaste',JP:'Konnichiwa',CN:'Nǐ hǎo',KR:'Annyeong',TR:'Merhaba',GR:'Geia sou',PL:'Cześć',UA:'Pryvit',CZ:'Ahoj',SK:'Ahoj',HU:'Szia',RO:'Salut',HR:'Bok',SI:'Živjo',EE:'Tere',LV:'Sveiki',LT:'Labas',MT:'Bonġu',MY:'Selamat datang',SG:'Hello',ZA:'Howzit',AE:'Marhaba',SA:'Marhaba',EG:'Marhaba',JO:'Marhaba',IL:'Shalom',TH:'Sawasdee',VN:'Xin chào',ID:'Halo',PH:'Kumusta',KE:'Jambo',NG:'Hello',HK:'Hello'};
function welcome(cc){if(location.pathname!=='/'||!cc)return;const t=document.querySelector('header .tag');if(!t||document.getElementById('tmgHi'))return;
  const st=document.createElement('style');st.textContent=`#tmgHi{text-align:center}#tmgHi>span{display:inline-flex;align-items:center;gap:10px;margin:14px auto 0;background:#fff;border:1.5px solid var(--frame,#b9c0cb);border-radius:999px;padding:7px 16px 7px 10px;font-size:14.5px;line-height:1.35;box-shadow:0 8px 18px -14px rgba(0,0,0,.35);text-align:left}#tmgHi i{font-style:normal;font-size:20px}#tmgHi em{font-style:normal;color:var(--soft,#5b606b)}`;document.head.appendChild(st);
  const d=document.createElement('div');d.id='tmgHi';d.innerHTML=`<span><i>${flag(cc)}</i><span><b>${HI[cc]||'Hello'} ${cc==='US'?'USA':cname(cc).replace(/^the /,'')}!</b> <em>Good to see you. Today’s puzzles are ready.</em></span></span>`;t.after(d)}
// --- Where in the World form, for people arriving from Michael's LinkedIn and Facebook links ---
const ICON='<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="31" fill="#e6edff"/><ellipse cx="32" cy="32" rx="10" ry="23" fill="none" stroke="#2b50e0" stroke-width="2.6"/><line x1="10" y1="32" x2="54" y2="32" stroke="#2b50e0" stroke-width="2.6" stroke-linecap="round"/><circle cx="41" cy="20" r="6.5" fill="#e8662b"/></svg>';
function witw(ch,cc){const done=ls('tmg-witw2');if(done)return;const NAME=ch==='li'?'LinkedIn':'Facebook';
  const fl=document.createElement('link');fl.rel='stylesheet';fl.href='https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&display=swap';document.head.appendChild(fl);
  const st=document.createElement('style');st.textContent=`.ww-v{position:fixed;inset:0;z-index:2147483000;background:rgba(22,24,29,.4);-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:14px;font-family:Inter,"DM Sans",system-ui,sans-serif;color:#1b2233}
.ww-c{position:relative;background:#fff;border-radius:26px;padding:26px 26px 18px;width:100%;max-width:460px;max-height:calc(100% - 8px);overflow:auto;box-sizing:border-box;box-shadow:0 30px 70px -24px rgba(0,0,0,.45);text-align:left}
.ww-x{position:absolute;right:14px;top:14px;width:42px;height:42px;border-radius:50%;background:#eef0f5;border:0;font-size:20px;cursor:pointer;color:#1b2233}
.ww-i{width:52px;height:52px;display:block}.ww-c h2{font:700 30px/1.08 Fraunces,Georgia,serif;margin:14px 0 6px;letter-spacing:-.01em}.ww-c h3{font:700 20px/1.2 Fraunces,Georgia,serif;color:#2f5fd0;margin:0 0 12px}
.ww-c p{margin:0 0 14px;color:#4b5263;font-size:15px;line-height:1.5}.ww-c p b{color:#1b2233}
.ww-g{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ww-g label{display:block;font-size:13px;font-weight:600;color:#3a4152}.ww-g input,.ww-g select{display:block;width:100%;box-sizing:border-box;height:48px;margin-top:5px;border:1.5px solid #d6d9e2;border-radius:12px;padding:0 12px;font:inherit;font-size:16px;color:#1b2233;background:#fff}
.ww-g input:focus,.ww-g select:focus{outline:none;border-color:#2f5fd0}.ww-h{font-size:12px;color:#6b7180;margin-top:5px;font-weight:400}
.ww-go{display:block;width:100%;border:0;background:#2f5fd0;color:#fff;border-radius:12px;padding:14px;font:inherit;font-weight:700;font-size:16.5px;margin-top:16px;cursor:pointer}.ww-go:disabled{opacity:.6}
.ww-s{font-size:12.5px!important;color:#6b7180!important;margin:12px 0 0!important}.ww-f{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;border-top:1px solid #eceef3;margin-top:14px;padding-top:12px;font-size:13.5px;color:#6b7180}.ww-f a{color:#2f5fd0;font-weight:600;text-decoration:none}
.ww-e{color:#c0392b;font-size:13px;min-height:1em;margin-top:8px}`;document.head.appendChild(st);
  let names={};try{const dn=new Intl.DisplayNames(['en'],{type:'region'});'AD AE AF AG AL AM AO AR AT AU AZ BA BB BD BE BF BG BH BI BJ BN BO BR BS BT BW BY BZ CA CD CF CG CH CI CL CM CN CO CR CU CV CY CZ DE DJ DK DM DO DZ EC EE EG ER ES ET FI FJ FM FR GA GB GD GE GH GM GN GQ GR GT GW GY HK HN HR HT HU ID IE IL IN IQ IR IS IT JM JO JP KE KG KH KI KM KN KP KR KW KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MG MH MK ML MM MN MO MR MT MU MV MW MX MY MZ NA NE NG NI NL NO NP NR NZ OM PA PE PG PH PK PL PS PT PW PY QA RO RS RU RW SA SB SC SD SE SG SI SK SL SM SN SO SR SS ST SV SY SZ TD TG TH TJ TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VN VU WS XK YE ZA ZM ZW'.split(' ').forEach(c=>{try{names[c]=dn.of(c)}catch(e){}})}catch(e){}
  const opts=Object.entries(names).sort((a,b)=>a[1].localeCompare(b[1])).map(([c,n])=>`<option value="${c}"${c===cc?' selected':''}>${n}</option>`).join('');
  const v=document.createElement('div');v.className='ww-v';v.innerHTML=`<form class="ww-c" role="dialog" aria-label="Where in the World Are You?"><button type="button" class="ww-x" aria-label="Close">✕</button><span class="ww-i">${ICON}</span>
  <h2>Where in the World Are You?</h2>${cc&&names[cc]?`<h3>${names[cc]}, by any chance?</h3>`:''}
  <p><b>Michael would love to know where his ${NAME} friends and contacts are.</b></p>
  <div class="ww-g"><label>First name<input name="first" maxlength="40" autocomplete="given-name"></label><label>Last name<input name="last" maxlength="40" autocomplete="family-name"></label>
  <label>Country<select name="country"><option value="">Choose…</option>${opts}</select>${cc?'<div class="ww-h">Our best guess. Change it if wrong.</div>':''}</label><label>City or town<input name="town" maxlength="60" autocomplete="address-level2"></label></div>
  <button type="submit" class="ww-go">Add me to the map</button><div class="ww-e" aria-live="polite"></div>
  <p class="ww-s"><b>This is just for Michael.</b> It isn’t public and isn’t shared with anyone. Town level only, never your address. Want it removed? Use the feedback button any time.</p>
  <div class="ww-f"><a href="/" class="ww-back">← Back to twominute.games</a><span>Two-minute puzzles, free daily</span></div></form>`;
  document.body.appendChild(v);const f=v.querySelector('form'),err=v.querySelector('.ww-e'),go=v.querySelector('.ww-go');
  const count=k=>bump({[`witw.${ch}.${k}`]:1});count('shown');
  const close=(why)=>{if(why){ls('tmg-witw2',why);if(why==='closed')count('closed')}v.remove();try{const u=new URL(location.href);u.searchParams.delete('ww');history.replaceState(null,'',u)}catch(e){}};
  v.querySelector('.ww-x').onclick=()=>close('closed');v.querySelector('.ww-back').onclick=e=>{e.preventDefault();close('closed')};
  f.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(f));const country=d.country||'';
    if(!country){err.textContent='Please choose your country.';return}
    go.disabled=true;err.textContent='';const s=x=>({stringValue:String(x||'').trim()});
    const fields={src:s(ch),first:s(d.first),last:s(d.last),country:s(country),town:s(d.town),tz:s(tzName.slice(0,60)),test:{booleanValue:!LIVE||VIP},at:{timestampValue:new Date().toISOString()}};
    try{if(LIVE){const r=await fetch(`${BASE}/witw?key=${K}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields})});if(!r.ok)throw 0}
      ls('tmg-witw2','sent');count('sent');
      const first=String(d.first||'').trim(),town=String(d.town||'').trim(),place=(town?town+', ':'')+(names[country]||country);
      f.innerHTML=`<button type="button" class="ww-x" aria-label="Close">✕</button><span class="ww-i">${ICON}</span><h2>You’re on the map!</h2><h3>${place.replace(/</g,'&lt;')} 📍</h3>
      <p>${first?`Thank you ${first.replace(/</g,'&lt;')}.`:'Thank you.'} Michael will be pleased to see you on the map.</p><p class="ww-s">Your pin is only on Michael’s private map, not shown publicly.</p><button type="button" class="ww-go">Close</button>`;
      f.querySelectorAll('.ww-x,.ww-go').forEach(b=>b.onclick=()=>close())}
    catch(_){go.disabled=false;err.textContent='Couldn’t send just now. Please try again in a moment.'}};
  addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.contains(v))close('closed')})}
// --- languages: which language a game is played in, how players reached it, and whether they finish (needs rules v10) ---
if(/^\/natural-wonders-where-is-bigger\//.test(location.pathname)){const L=(document.documentElement.lang||'en').slice(0,2).toLowerCase().replace(/[^a-z]/g,'')||'en';
  const f={[`langs.${L}.visits`]:1},fresh=ls('tmg-lang-'+L)!=='1';if(fresh){ls('tmg-lang-'+L,'1');f[`langs.${L}.uniques`]=1}
  const via=clean(q.get('via'));if(['link','offer','switch'].includes(via))f[`langs.${L}.via_${via}`]=1;
  ccReady.then(cc=>{if(fresh&&/^[A-Z]{2}$/.test(cc||''))f[`langs.${L}.cc_${cc}`]=1;bump(f)});
  let fin=false;const mo=new MutationObserver(()=>{if(!fin&&document.querySelector('.score .big')){fin=true;mo.disconnect();bump({[`langs.${L}.finished`]:1})}});mo.observe(document.body,{childList:true,subtree:true})}

/* --- player alerts (10 Nov 2026): a phone notification via ntfy the first time someone starts a game on their device. Game, country and link tag only; no names, no IP --- */
{const TOPIC='tmg-pnz2n1a4wqw9';
 const P2=location.pathname,nw=P2.match(/natural-wonders-([a-z-]+)/);
 const GAME=/\/aperture\/landmarks/.test(P2)?'landmarks':/\/aperture(\/|$)/.test(P2)&&!/stats/.test(P2)?'objects':nw?nw[1]:/\/duggen/.test(P2)?'duggen':null;
 const NAMES={objects:'Aperture',landmarks:'Aperture Landmarks',duggen:"Duggen's Outback Maze",'where-is-bigger':'Where is Bigger?','which-of-five':'Which of Five?','how-many-borders':'How Many Borders?','bodies-of-water':'Bodies of Water','river-cities':'River Cities',rivers:'Rivers',lakes:'Lakes',mountains:'Mountains',deserts:'Deserts',forests:'Forests',masterbrain:'Masterbrain'};
 const lang=(document.documentElement.lang||'en').slice(0,2);
 const ping=()=>{const k='tmg-ping-'+GAME;if(ls(k))return;ls(k,'1');
   if(!LIVE||VIP||/\bClaude\//.test(navigator.userAgent))return;
   ccReady.then(cc=>{const via=src.root==='walkin'?'walk-in':src.root==='li'?'LinkedIn':src.root==='fb'?'Facebook':'via ?from='+src.root+(src.step>1?' (passed on '+(src.step-1)+'×)':'');
     const where=cc?flag(cc)+' '+cname(cc).replace(/^the /,''):'🌍 Unknown country';
     fetch('https://ntfy.sh/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({topic:TOPIC,title:'🎮 New player · '+(NAMES[GAME]||GAME)+(lang!=='en'?' ('+lang.toUpperCase()+')':''),message:where+' · '+via,click:'https://twominute.games/aperture/stats/',tags:['video_game']})}).catch(()=>{})})};
 /* a quieter 'visitor' alert: the first time a new device opens any twominute.games page */
 if(isNew&&LIVE&&!VIP&&!/\bClaude\//.test(navigator.userAgent)&&!ls('tmg-visit-ping')){ls('tmg-visit-ping','1');
   ccReady.then(cc=>{const via=src.root==='walkin'?'walk-in':src.root==='li'?'LinkedIn':src.root==='fb'?'Facebook':'via ?from='+src.root+(src.step>1?' (passed on '+(src.step-1)+'×)':'');
     const where=cc?flag(cc)+' '+cname(cc).replace(/^the /,''):'🌍 Unknown country';
     const page=GAME?(NAMES[GAME]||GAME):(/^\/(index\.html)?$/.test(P2)?'home page':P2.replace(/\/$/,'').split('/').pop()||'home page');
     fetch('https://ntfy.sh/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({topic:TOPIC,title:'👀 Visitor · '+where.replace(/^\S+ /,''),message:where+' · '+via+' · opened '+page,priority:2,click:'https://twominute.games/aperture/stats/',tags:['eyes']})}).catch(()=>{})})}
 if(GAME){
   if(GAME==='duggen')ping();
   else if(GAME==='objects'||GAME==='landmarks'){ /* a round starts when the page drops its 'waiting' class */
     const go=()=>{if(!document.body.classList.contains('waiting'))return;const ob=new MutationObserver(()=>{if(!document.body.classList.contains('waiting')){ping();ob.disconnect()}});ob.observe(document.body,{attributes:true,attributeFilter:['class']})};
     if(document.body)go();else addEventListener('DOMContentLoaded',go)}
   else document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button');if(b&&/start(Game)?\(\)/.test(b.getAttribute('onclick')||''))ping()},true)}
}
window.tmgReach={src,me,link:tag,bump,cc:()=>CC};
/* background music for the Natural Wonders games */
if(/natural-wonders-/.test(location.pathname)){const mu=document.createElement('script');mu.src='/shared/music.js?v=3';mu.defer=true;document.head.appendChild(mu)}
/* first-play walkthrough, shared by every game */
{const w=document.createElement('script');w.src='/shared/walk.js?v=4';w.defer=true;document.head.appendChild(w)}
})();
