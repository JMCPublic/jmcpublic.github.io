/* twominute.games spotlight days (designed 4 Nov 2026, mock-ups 1-6)
   On a country's national day, one of the five daily landmarks comes from that country.
   Everyone gets the same puzzle; the note by the quote puts the player's own country first.
   Text is looked up in the player's language, falling back to English line by line.
   Preview another date with ?spotdate=MM-DD (only changes the spotlight, not the rest of the puzzle). */
(()=>{if(window.tmgSpot)return;
// one row per country and day. lm: landmark names exactly as in the game. langs: languages spoken there (for "own country first" when abroad)
const CAL=[
 {d:'01-26',c:'AU',f:'🇦🇺',who:'Australia',title:'Australia Day',lm:['Uluru','Opera House','Harbour Bridge'],langs:['en']},
 {d:'01-26',c:'IN',f:'🇮🇳',who:'India',title:'India’s Republic Day',lm:['Taj Mahal','Golden Temple'],langs:['hi','pa','en']},
 {d:'02-11',c:'JP',f:'🇯🇵',who:'Japan',title:'Japan’s National Foundation Day',lm:['Mount Fuji'],langs:['ja']},
 {d:'03-25',c:'GR',f:'🇬🇷',who:'Greece',title:'Greece’s Independence Day',lm:['Acropolis'],langs:['el']},
 {d:'04-18',c:'ZW',f:'🇿🇼',who:'Zimbabwe',title:'Zimbabwe’s Independence Day',lm:['Victoria Falls'],langs:['en','sn','nd']},
 {d:'04-23',c:'GB-ENG',cc:'GB',f:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',who:'England',title:'St George’s Day in England',lm:['Stonehenge','Angel of the North','Tower Bridge','Big Ben','London Eye','Buckingham Palace'],langs:['en']},
 {d:'04-27',c:'ZA',f:'🇿🇦',who:'South Africa',title:'South Africa’s Freedom Day',lm:['Table Mountain'],langs:['af','zu','xh','en']},
 {d:'05-25',c:'JO',f:'🇯🇴',who:'Jordan',title:'Jordan’s Independence Day',lm:['Petra'],langs:['ar']},
 {d:'06-02',c:'IT',f:'🇮🇹',who:'Italy',title:'Italy’s Republic Day',lm:['Colosseum','Leaning Tower','Trevi Fountain'],langs:['it']},
 {d:'07-01',c:'CA',f:'🇨🇦',who:'Canada',title:'Canada Day',lm:['Niagara Falls'],langs:['en','fr']},
 {d:'07-04',c:'US',f:'🇺🇸',who:'the United States',title:'Independence Day in the United States',lm:['Statue of Liberty','Golden Gate Bridge','Empire State Building','Grand Canyon','Mount Rushmore','Space Needle','Hollywood Sign'],langs:['en']},
 {d:'07-14',c:'FR',f:'🇫🇷',who:'France',title:'Bastille Day in France',lm:['Eiffel Tower','Arc de Triomphe','Notre-Dame','Mont Saint Michel'],langs:['fr']},
 {d:'07-21',c:'BE',f:'🇧🇪',who:'Belgium',title:'Belgian National Day',lm:['Atomium'],langs:['nl','fr','de']},
 {d:'07-23',c:'EG',f:'🇪🇬',who:'Egypt',title:'Egypt’s Revolution Day',lm:['Great Pyramid','Sphinx'],langs:['ar']},
 {d:'07-28',c:'PE',f:'🇵🇪',who:'Peru',title:'Peru’s Independence Day',lm:['Machu Picchu'],langs:['es','qu']},
 {d:'08-01',c:'CH',f:'🇨🇭',who:'Switzerland',title:'Swiss National Day',lm:['Matterhorn'],langs:['de','fr','it','rm']},
 {d:'08-15',c:'IN',f:'🇮🇳',who:'India',title:'India’s Independence Day',lm:['Taj Mahal','Golden Temple'],langs:['hi','pa','en']},
 {d:'09-07',c:'BR',f:'🇧🇷',who:'Brazil',title:'Brazil’s Independence Day',lm:['Christ the Redeemer'],langs:['pt']},
 {d:'09-16',c:'MX',f:'🇲🇽',who:'Mexico',title:'Mexico’s Independence Day',lm:['Chichen Itza'],langs:['es']},
 {d:'09-18',c:'CL',f:'🇨🇱',who:'Chile',title:'Chile’s Independence Day',lm:['Moai'],langs:['es']},
 {d:'10-01',c:'CN',f:'🇨🇳',who:'China',title:'China’s National Day',lm:['Forbidden City','Great Wall'],langs:['zh']},
 {d:'10-03',c:'DE',f:'🇩🇪',who:'Germany',title:'German Unity Day',lm:['Brandenburg Gate','Neuschwanstein'],langs:['de']},
 {d:'10-12',c:'ES',f:'🇪🇸',who:'Spain',title:'Spain’s National Day',lm:['Sagrada Familia'],langs:['es','ca','eu','gl']},
 {d:'10-24',c:'ZM',f:'🇿🇲',who:'Zambia',title:'Zambia’s Independence Day',lm:['Victoria Falls'],langs:['en']},
 {d:'11-09',c:'KH',f:'🇰🇭',who:'Cambodia',title:'Cambodia’s Independence Day',lm:['Angkor Wat'],langs:['km']},
 {d:'11-30',c:'GB-SCT',cc:'GB',f:'🏴󠁧󠁢󠁳󠁣󠁴󠁿',who:'Scotland',title:'St Andrew’s Day in Scotland',lm:['Edinburgh Castle'],langs:['en','gd']},
 {d:'12-02',c:'AE',f:'🇦🇪',who:'the United Arab Emirates',title:'UAE National Day',lm:['Burj Khalifa'],langs:['ar']},
];
// wording, by language; any missing line falls back to English
const STR={en:{
  one:e=>`One of today’s five is in ${e.who}.`,
  also:es=>es.length===1?`Also ${es[0].f} ${es[0].title} today`:`Also ${es.map(e=>e.f).join(' ')} today`,
  both:es=>`${es.map(e=>e.f+' '+e.who.replace(/^the /,'')).join(es.length>2?', ':' and ').replace(/, ([^,]*)$/,' and $1')} celebrate today`,
  bothSub:n=>`${['','One','Two','Three','Four','Five'][n]||n} of today’s five celebrate${n===1?'s':''} them.`,
  all:n=>`All ${n} ›`,close:'Close ✕',
  badge:e=>`${e.f} For ${e.title}`,
  result:es=>`<b>Today we celebrated</b> ${es.map(e=>e.f+' '+e.title).join(es.length>2?', ':' and ').replace(/, ([^,]*)$/,' and $1')}.`,
  share:es=>`${es.map(e=>e.f).join('')} spotlight day`}};
const lang=(navigator.language||'en').slice(0,2).toLowerCase();
const T=(k,...a)=>{const v=(STR[lang]&&STR[lang][k]!=null)?STR[lang][k]:STR.en[k];return typeof v==='function'?v(...a):v};
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const rng=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
function today(key){const q=new URLSearchParams(location.search).get('spotdate');return /^\d\d-\d\d$/.test(q||'')?q:key.slice(5)}
let TZC=null;const tzName=(()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){return ''}})();
fetch('/shared/tz.json').then(r=>r.json()).then(j=>{TZC=j;const G=window.tmgSpot&&tmgSpot.last;if(G&&G.spotList&&G.spotList.length)strip(G)}).catch(()=>{});
function viewer(){if(TZC&&TZC[tzName])return TZC[tzName];const m=/-([A-Z]{2})$/i.exec(navigator.language||'');return m?m[1].toUpperCase():''}
// order the day's countries for this player: own country first (time zone), else own language, else alphabetical
function arrange(es){const c=viewer();const mine=es.find(e=>e.c===c||e.cc===c)||es.find(e=>e.langs.includes(lang)&&lang!=='en');
  const rest=es.filter(e=>e!==mine).sort((a,b)=>a.who.replace(/^the /,'').localeCompare(b.who.replace(/^the /,'')));return {mine,list:mine?[mine,...rest]:rest}}
const css=`.tmgspot{display:flex;align-items:center;gap:8px;background:#fff;border:1.5px solid var(--blue,#2b50e0);border-radius:12px;padding:6px 10px;font-size:12.5px;line-height:1.25;color:var(--ink,#16181d);box-shadow:0 6px 16px -10px rgba(43,80,224,.5);position:relative;text-align:left}
.tmgspot .f{font-size:18px;line-height:1;flex:none}.tmgspot small{display:block;color:var(--soft,#5b606b);font-size:11.5px;margin-top:1px}
.tmgspot .more{margin-left:auto;flex:none;color:var(--blue,#2b50e0);font-weight:600;white-space:nowrap;background:none;border:0;font:inherit;font-size:12.5px;cursor:pointer;padding:2px 0}
.tmgspot .lst{position:absolute;left:0;right:0;top:calc(100% + 6px);z-index:30;background:#fff;border:1.5px solid var(--frame,#b9c0cb);border-radius:14px;padding:10px 12px;box-shadow:0 18px 36px -18px rgba(0,0,0,.35);display:flex;flex-direction:column;gap:7px}
.tmgspot .lst[hidden]{display:none}.tmgspot .lst div{display:flex;gap:8px;align-items:center}
.qwrap.tmgspot-on{grid-template-rows:auto 1fr 1fr!important;gap:8px!important;max-height:calc(100% - 8px)!important}
.qwrap.tmgspot-on .quote,.qwrap.tmgspot-on .fact{padding-top:6px!important;padding-bottom:6px!important}
.tmgspot-badge{display:block;color:var(--blue,#2b50e0);margin-top:3px}
.tmgspot-res{border:1.5px solid var(--blue,#2b50e0);border-radius:14px;padding:9px 12px;font-size:13.5px;background:#f6f8ff;margin:8px 0;text-align:left}`;
let styled=false;function style(){if(styled)return;styled=true;const s=document.createElement('style');s.textContent=css;document.head.appendChild(s)}
function clearStrip(){const q=document.getElementById('qwrap');if(!q)return;q.classList.remove('tmgspot-on');const o=q.querySelector('.tmgspot');if(o)o.remove()}
function strip(G){clearStrip();if(!G.spotList||!G.spotList.length)return;style();const q=document.getElementById('qwrap');if(!q)return;
  const {mine,list}=arrange(G.spotList),dl=new Date(new Date().getFullYear()+'-'+G.spotDay+'T12:00:00').toLocaleDateString(lang==='en'?'en-GB':lang,{day:'numeric',month:'short'});
  let main,sub,more='';
  if(list.length===1){main=`${list[0].f}</span><div><b>${dl} · ${list[0].title}</b><small>${T('one',list[0])}</small>`}
  else if(mine){const others=list.slice(1);main=`${mine.f}</span><div><b>${dl} · ${mine.title}</b><small>${T('also',others)}</small>`;if(others.length>1)more=T('all',list.length)}
  else{main=`🎉</span><div><b>${dl} · ${T('both',list)}</b><small>${T('bothSub',list.length)}</small>`;if(list.length>2)more=T('all',list.length)}
  const el=document.createElement('div');el.className='tmgspot';
  el.innerHTML=`<span class="f">${main}</div>${more?`<button type="button" class="more">${more}</button><div class="lst" hidden>${list.map(e=>`<div><span class="f">${e.f}</span><span><b>${e.who.replace(/^the /,'').replace(/^./,m=>m.toUpperCase())}</b> · ${e.title}</span></div>`).join('')}</div>`:''}`;
  const b=el.querySelector('.more');if(b){const l=el.querySelector('.lst');b.onclick=()=>{l.hidden=!l.hidden;b.textContent=l.hidden?more:T('close')}}
  q.classList.add('tmgspot-on');q.prepend(el)}
window.tmgSpot={CAL,STR,
  // call once the day's order is chosen: swaps in one landmark per country celebrating today, in seeded rounds
  apply(G,OBJECTS){this.last=G;G.spot={};G.spotList=[];clearStrip();if(G.mode!=='daily')return;
    const day=today(G.key);const es=CAL.filter(e=>e.d===day).slice(0,G.order.length);if(!es.length)return;
    const r=rng(hash('spot|'+G.key+'|'+day));const slots=G.order.map((_,i)=>i).sort(()=>r()-.5);const used=new Set();
    es.forEach((e,k)=>{const cand=OBJECTS.map((o,i)=>[o,i]).filter(([o,i])=>e.lm.includes(o.title)&&!used.has(i));if(!cand.length)return;
      const idx=cand[Math.floor(r()*cand.length)][1],pos=slots[k];used.add(idx);
      const was=G.order.indexOf(idx);if(was>=0&&was!==pos)G.order[was]=G.order[pos];G.order[pos]=idx;G.spot[pos]=e;(G.spotIdx=G.spotIdx||{})[pos]=idx;G.spotList.push(e)});
    G.spotDay=day;strip(G)},
  badge(G){const e=G&&G.spot&&G.spot[G.round]&&G.order[G.round]===G.spotIdx[G.round]&&G.spot[G.round];return e?`<span class="tmgspot-badge">${T('badge',e)}</span>`:''},
  result(G){if(!G||!G.spotList||!G.spotList.length)return'';style();return `<p class="tmgspot-res">${T('result',arrange(G.spotList).list)}</p>`},
  share(G){if(!G||!G.spotList||!G.spotList.length)return'';return '\n'+T('share',arrange(G.spotList).list)},
  strip,clear:clearStrip};
})();
