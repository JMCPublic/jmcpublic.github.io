/* twominute.games ad box (layout agreed 4 Nov 2026, mock-up v6)
   Until Google approves AdSense, the box shows a house ad. To switch on real ads, fill in the two slot ids below. */
(()=>{if(window.tmgAd||window.top!==window)return;
const ADS={client:'ca-pub-9558088049243609',slotWide:'',slotPhone:''};   // slotWide: 728x90 unit, slotPhone: 320x100 unit
const d=document,root=d.documentElement,path=location.pathname;
const isAp=/^\/aperture\//.test(path),isNW=/^\/natural-wonders-/.test(path);
const css=`
#tmgAd{box-sizing:border-box;font-family:inherit;color:var(--ink,#16181d)}
#tmgAd .tmgad-in{display:flex;align-items:center;justify-content:center;gap:12px;background:var(--sheet,var(--card,#fff));border:1.5px solid var(--frame,var(--line,#b9c0cb));border-radius:22px;padding:14px 16px;box-sizing:border-box}
#tmgAd .tmgad-l{font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--faint,var(--muted,#9aa0ab));align-self:flex-start;white-space:nowrap}
#tmgAd .tmgad-slot{flex:none;display:block;overflow:hidden;position:relative}
#tmgAd .tmgad-slot.w{width:728px;height:90px}#tmgAd .tmgad-slot.p{width:320px;height:100px}
#tmgAd .tmgad-sp{flex:1;min-width:0}
.tmgad-house{display:flex;align-items:center;justify-content:space-between;gap:14px;width:100%;height:100%;box-sizing:border-box;padding:0 22px;border-radius:12px;text-decoration:none;color:#16181d;background:linear-gradient(100deg,#e6edff,#f4f1ea);border:1px solid rgba(22,24,29,.08)}
.tmgad-house b{display:block;font-size:19px;line-height:1.15;letter-spacing:-.01em}
.tmgad-house span{display:block;font-size:13px;color:#5b606b;margin-top:3px}
.tmgad-house i{font-style:normal;flex:none;background:#16181d;color:#fff;border-radius:999px;padding:9px 16px;font-size:13.5px;font-weight:600;white-space:nowrap}
.p .tmgad-house{flex-direction:column;justify-content:center;align-items:flex-start;gap:7px;padding:0 16px}
.p .tmgad-house b{font-size:16px}.p .tmgad-house span{display:none}.p .tmgad-house i{padding:6px 12px;font-size:12.5px}
/* phones and Natural Wonders: a strip fixed to the bottom of the screen */
#tmgAd.fixed{position:fixed;left:0;right:0;bottom:0;z-index:25;padding:6px 8px calc(8px + env(safe-area-inset-bottom));background:var(--bg,#f1f3f7);border-top:1px solid var(--line,#d5dae2);display:flex;justify-content:center}
#tmgAd.fixed .tmgad-in{border-radius:16px;padding:16px 10px 8px;position:relative}
#tmgAd.fixed .tmgad-in.p .tmgad-l{position:absolute;top:3px;left:10px}
#tmgAd.fixed .tmgad-in.w{padding:12px 16px}
html.tmgad-on body{padding-bottom:var(--tmgad-h,0px)}
html.tmgad-on .tbar{bottom:var(--tmgad-h,0px)!important}
html.tmgad-on .tmgfb-pill{bottom:calc(var(--tmgad-h,0px) + 12px)}
html.tmgad-on .toast{bottom:calc(var(--tmgad-h,0px) + 22px)}
html.phone.tmgad-on body.timed .rank .btn:not([disabled]){bottom:calc(64px + var(--tmgad-h,0px) + env(safe-area-inset-bottom))!important}
/* Aperture on laptops: the box sits under boxes A-C, and the side columns are mirrored so A-C are centred */
#tmgAd.inline{flex:none;margin:12px auto 0;display:block}
.phones>.side.tmgad-left{justify-content:space-between}
.phones>.side.tmgad-left>*{width:100%;max-width:100%;box-sizing:border-box;min-width:0;overflow:hidden}
html.tmgad-mirror .phone,html.tmgad-mirror .phones>.side{--w:min(calc((100cqw - 4 * var(--gap) - 2 * var(--mini)) / 3),calc(100cqh * .58))!important}
`;
const st=d.createElement('style');st.textContent=css;d.head.appendChild(st);
const KOFI={href:'https://ko-fi.com/twominutegames',b:'Enjoying the games? Buy us a coffee ☕',pb:'Enjoying the games? ☕',s:'Two Minute Games is free, with no sign-up. Tips keep it going.',i:'Support us'};
const CROSS=isNW?{href:'/aperture/',b:'Try Aperture: what can you see?',pb:'Try Aperture: what can you see?',s:'An everyday object, seen through a few small viewpoints. Two minutes a day.',i:'Play Aperture →'}
                :{href:'/wonders/',b:'Try Natural Wonders',pb:'Try Natural Wonders',s:'Ten quick geography games: rivers, lakes, peaks, deserts and borders.',i:'Play →'};
const DE=d.documentElement.lang==='de';
const KOFI_DE={href:KOFI.href,b:'Gefallen dir die Spiele? Spendier uns einen Kaffee ☕',pb:'Gefallen dir die Spiele? ☕',s:'Two Minute Games ist kostenlos und ohne Anmeldung. Trinkgeld hält es am Laufen.',i:'Unterstützen'};
const CROSS_DE={href:'/aperture/',b:'Probier Aperture: Was siehst du?',pb:'Probier Aperture: Was siehst du?',s:'Ein Alltagsgegenstand, durch ein paar kleine Fenster gesehen. Zwei Minuten am Tag (auf Englisch).',i:'Aperture spielen →'};
function house(wide){const h=Math.random()<.5?(DE?KOFI_DE:KOFI):(DE?CROSS_DE:CROSS);const ext=/^https?:/.test(h.href);
  return `<a class="tmgad-house" href="${h.href}"${ext?' target="_blank" rel="noopener"':''}><div><b>${wide?h.b:h.pb}</b><span>${h.s}</span></div><i>${h.i}</i></a>`}
function fill(slot,wide){const id=wide?ADS.slotWide:ADS.slotPhone;
  if(!id){slot.innerHTML=house(wide);return}
  slot.innerHTML=`<ins class="adsbygoogle" style="display:inline-block;width:${wide?728:320}px;height:${wide?90:100}px" data-ad-client="${ADS.client}" data-ad-slot="${id}"></ins>`;
  if(!d.querySelector('script[src*="adsbygoogle.js"]')){const s=d.createElement('script');s.async=true;s.crossOrigin='anonymous';s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+ADS.client;d.head.appendChild(s)}
  (window.adsbygoogle=window.adsbygoogle||[]).push({})}
let box,mode,wide;
function build(){
  const apDesk=isAp&&d.querySelector('main.phones')&&!/\/mobile\//.test(path);
  const narrow=innerWidth<780;wide=!narrow;
  mode=apDesk&&!narrow?'inline':'fixed';
  if(box&&box.dataset.k===mode+wide)return sync();
  if(box)box.remove();
  box=d.createElement('aside');box.id='tmgAd';box.className=mode;box.dataset.k=mode+wide;box.setAttribute('aria-label',DE?'Anzeige':'Advertisement');
  box.innerHTML=`<div class="tmgad-in ${wide?'w':'p'}">${wide&&mode==='inline'?'<span class="tmgad-sp"></span>':''}<span class="tmgad-l">${DE?'Anzeige':'Advertisement'}</span><div class="tmgad-slot ${wide?'w':'p'}"></div>${wide&&mode==='inline'?'<span class="tmgad-sp"></span>':''}</div>`;
  if(mode==='inline'){const m=d.querySelector('main.phones');m.after(box);root.classList.remove('tmgad-on')}
  else{d.body.appendChild(box);root.classList.add('tmgad-on')}
  fill(box.querySelector('.tmgad-slot'),wide);sync()}
function sync(){if(!box)return;
  if(mode==='fixed'){root.style.setProperty('--tmgad-h',box.offsetHeight+'px');return}
  // inline: as wide as boxes A to C, banner centred, label just left of it at its top edge
  const ph=[...d.querySelectorAll('main.phones>.phone')];if(ph.length){const a=ph[0].getBoundingClientRect(),c=ph[ph.length-1].getBoundingClientRect();box.style.width=Math.round(c.right-a.left)+'px'}
  const inn=box.querySelector('.tmgad-in'),sl=box.querySelector('.tmgad-slot'),lb=box.querySelector('.tmgad-l');
  if(inn&&sl&&lb){inn.style.position='relative';lb.style.position='absolute';lb.style.top=(sl.offsetTop)+'px';lb.style.left=Math.max(10,sl.offsetLeft-lb.offsetWidth-12)+'px'}}
// mirrored side column for Aperture on laptops: "Have you tried" on top, stats below, kept in step with the right-hand column
function mirror(){const m=d.querySelector('main.phones'),side=m&&m.querySelector(':scope>.side');if(!side||!isAp||/\/mobile\//.test(path))return;
  const sc=side.querySelector('.statcard'),pr=side.querySelector('.promo');if(!sc||!pr)return;
  const left=d.createElement('div');left.className='side tmgad-left';left.setAttribute('aria-hidden','true');
  const p2=d.createElement('div');p2.className='promo';p2.tabIndex=-1;const s2=d.createElement('aside');s2.className='statcard';
  left.append(p2,s2);m.insertBefore(left,m.firstElementChild);root.classList.add('tmgad-mirror');
  const strip=h=>h.replace(/\sid="[^"]*"/g,'');
  const copy=()=>{s2.innerHTML=strip(sc.innerHTML);s2.style.cssText=sc.style.cssText;p2.innerHTML=strip(pr.innerHTML);p2.className=pr.className;p2.style.cssText=pr.style.cssText};
  copy();new MutationObserver(copy).observe(sc,{childList:true,subtree:true,characterData:true,attributes:true});
  new MutationObserver(copy).observe(pr,{childList:true,subtree:true,characterData:true,attributes:true});
  p2.addEventListener('click',e=>{e.preventDefault();pr.click()})}
function start(){mirror();build();addEventListener('resize',()=>{clearTimeout(start.t);start.t=setTimeout(build,120)});setTimeout(sync,600);if(d.fonts)d.fonts.ready.then(sync)}
window.tmgAd={ADS,rebuild:build};
if(d.body)start();else addEventListener('DOMContentLoaded',start);
})();
