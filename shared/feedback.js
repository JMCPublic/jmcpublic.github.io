/* Feedback button for the Natural Wonders games, shared (17 Nov 2026): moved out of the full games' pages so the simple games use the same one.
   tmg-feedback: one Feedback button for ideas, likes and bug reports. Messages go privately to Firestore 'feedback'; only the owner can read them (stats page, signed in). */
(()=>{const st=document.createElement('style');st.textContent=".tmgfb-pill{position:fixed;right:max(14px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom));z-index:60;display:flex;align-items:center;gap:6px;background:var(--ink,#16181d);color:#fff;border:0;border-radius:999px;padding:9px 15px;font-family:inherit;font-weight:600;font-size:13.5px;line-height:1;cursor:pointer;box-shadow:0 8px 20px rgba(0,0,0,.22)}\n.tmgfb-pill[hidden],body.timed .tmgfb-pill,body:has(.play) .tmgfb-pill{display:none}\n.tmgfb-pill svg,.tmgfb-icon svg{width:15px;height:15px}\n.tmgfb-v{position:fixed;inset:0;z-index:2147483000;background:rgba(22,24,29,.35);display:flex;align-items:center;justify-content:center;padding:16px;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}\n.tmgfb-v[hidden]{display:none}\n.tmgfb-c{background:#fff;color:var(--ink,#16181d);border:1.5px solid var(--line,#d9dde4);border-radius:20px;padding:22px 22px 18px;width:100%;max-width:400px;max-height:calc(100% - 8px);overflow:auto;box-sizing:border-box;box-shadow:0 24px 48px -20px rgba(0,0,0,.35);font-family:inherit;font-size:15px;line-height:1.45;text-align:left}\n.tmgfb-c h2{margin:0 0 4px;font-size:20px;line-height:1.2}\n.tmgfb-c p{margin:0 0 14px;color:var(--muted,var(--soft,#5b606b));font-size:13.5px}\n.tmgfb-chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}\n.tmgfb-chip{border:1.5px solid var(--line,#d9dde4);border-radius:999px;padding:6px 12px;font:inherit;font-size:13.5px;background:#fff;color:inherit;cursor:pointer}\n.tmgfb-chip[aria-pressed=\"true\"]{background:var(--ink,#16181d);color:#fff;border-color:var(--ink,#16181d)}\n.tmgfb-c textarea,.tmgfb-c input{width:100%;box-sizing:border-box;border:1.5px solid var(--line,#d9dde4);border-radius:12px;padding:10px 12px;font:inherit;font-size:16px;color:inherit;background:#fff;outline:none}\n.tmgfb-c textarea{height:96px;resize:none}\n.tmgfb-c input{margin-top:8px}\n.tmgfb-c textarea:focus,.tmgfb-c input:focus{border-color:var(--ink,#16181d)}\n.tmgfb-meta{font-size:12px;color:var(--muted,var(--soft,#5b606b));margin-top:8px}\n.tmgfb-row{display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-top:14px}\n.tmgfb-msg{flex:1;font-size:13px;color:var(--muted,var(--soft,#5b606b))}\n.tmgfb-b{border-radius:999px;padding:9px 18px;font:inherit;font-weight:600;font-size:14px;border:1.5px solid var(--line,#d9dde4);background:#fff;color:inherit;cursor:pointer}\n.tmgfb-b.go{background:var(--ink,#16181d);color:#fff;border-color:var(--ink,#16181d)}\n.tmgfb-b:disabled{opacity:.5}";document.head.appendChild(st)})();
(()=>{if(window.tmgFb||window.top!==window)return;
const CFG={p:'aperture-c0961',k:'AIzaSyCLMslnXssvPk7S7l_0MuajudNtHRK-VAI'};
const ICON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>';
const KINDS=[['idea','💡 Idea','What would make it better?'],['like','👍 Like it','What did you enjoy?'],['wrong','🐞 Something’s wrong','What went wrong, and where?']];
let v,kind='idea';
const dev=()=>{const c=matchMedia('(pointer:coarse)').matches,m=Math.min(screen.width,screen.height);return c?(m>=600?'tablet':'phone'):'desktop'};
function build(){v=document.createElement('div');v.className='tmgfb-v';v.hidden=true;
  v.innerHTML=`<form class="tmgfb-c" role="dialog" aria-label="Feedback or report a problem"><h2>Tell us what you think</h2>
  <p>Choose Idea, Like it or Something’s wrong and let us know. It goes privately to the Two Minute Games back office only. It isn’t a public message, and nobody else can read it.</p>
  <div class="tmgfb-chips">${KINDS.map(k=>`<button type="button" class="tmgfb-chip" data-k="${k[0]}" aria-pressed="${k[0]===kind}">${k[1]}</button>`).join('')}</div>
  <textarea maxlength="1500" required aria-label="Your message"></textarea>
  <input maxlength="150" autocomplete="email" placeholder="Name or email, only if you’d like a reply (optional)" aria-label="Name or email (optional)">
  <div class="tmgfb-meta">We also send which game you were on and your type of device, nothing else.</div>
  <div class="tmgfb-row"><span class="tmgfb-msg" aria-live="polite"></span><button type="button" class="tmgfb-b">Cancel</button><button type="submit" class="tmgfb-b go">Send</button></div></form>`;
  document.body.appendChild(v);const f=v.querySelector('form'),t=f.querySelector('textarea'),c=f.querySelector('input'),m=f.querySelector('.tmgfb-msg'),go=f.querySelector('.go');
  const setK=k=>{kind=k;f.querySelectorAll('.tmgfb-chip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===k));t.placeholder=KINDS.find(x=>x[0]===k)[2]};setK(kind);
  f.querySelectorAll('.tmgfb-chip').forEach(b=>b.onclick=()=>setK(b.dataset.k));
  f.querySelector('.tmgfb-b:not(.go)').onclick=close;v.addEventListener('click',e=>{if(e.target===v)close()});
  addEventListener('keydown',e=>{if(e.key==='Escape'&&!v.hidden)close()});
  f.onsubmit=async e=>{e.preventDefault();const msg=t.value.trim();if(!msg){t.focus();return}
    go.disabled=true;m.textContent='Sending…';let where='';try{if(window.tmgFbWhere)where=String(window.tmgFbWhere()).slice(0,400)}catch(_){}
    const s=x=>({stringValue:String(x)});
    const fields={kind:s(kind),message:s(msg.slice(0,1500)),contact:s(c.value.trim().slice(0,150)),game:s(document.title.slice(0,120)),page:s(location.pathname.slice(0,200)),device:s(dev()),where:s(where),ua:s(navigator.userAgent.slice(0,300)),at:{timestampValue:new Date().toISOString()}};
    try{const r=await fetch(`https://firestore.googleapis.com/v1/projects/${CFG.p}/databases/(default)/documents/feedback?key=${CFG.k}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields})});
      if(!r.ok)throw 0;m.textContent='Thank you. Sent!';t.value='';c.value='';setTimeout(close,1400)}
    catch(_){m.textContent='Couldn’t send just now. Please try again in a moment.';go.disabled=false}}}
function open(){if(!v)build();const m=v.querySelector('.tmgfb-msg');m.textContent='';v.querySelector('.go').disabled=false;v.hidden=false;setTimeout(()=>v.querySelector('textarea').focus(),50)}
function close(){if(v)v.hidden=true}
window.tmgFb={open,close};
function wire(){const own=document.querySelectorAll('[data-tmg-feedback]');
  if(own.length){own.forEach(b=>b.addEventListener('click',e=>{e.preventDefault();open()}));return}
  const p=document.createElement('button');p.type='button';p.className='tmgfb-pill';p.setAttribute('aria-label','Feedback or report a problem');p.innerHTML=ICON+'Feedback or bug';p.onclick=open;document.body.appendChild(p)}
if(document.body)wire();else addEventListener('DOMContentLoaded',wire);
})();
