/* "Where are you playing from?" (approved mock where_mock_v1, 22 Nov 2026).
   After a finished game (each game sends a 'tmg:gameover' event; never during play, practice or Admire my score),
   at most once a week per device: country and nearest city, nothing else. Not linked to the device or scores.
   Remembered on this device only (localStorage): answered = never asked again here; "Don't ask again" = never;
   Not now / ✕ = asked again the next week. A new phone or cleared browser data counts as a new device.
   Answers go to the same private list as the LinkedIn/Facebook form (witw, src 'game'); shown/sent/not-now/never
   are counted under witw.game.* in the reach stats. */
(function(){
  if(window.__tmgWhere||window.top!==window)return;window.__tmgWhere=1;
  const ls=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
  const LIVE=location.protocol==='https:'&&!/claude|anthropic|usercontent/.test(location.hostname);
  const VIP=ls('ap-vip')==='1',BOT=/\bClaude\//.test(navigator.userAgent);
  const P='aperture-c0961',K='AIzaSyCLMslnXssvPk7S7l_0MuajudNtHRK-VAI',BASE=`https://firestore.googleapis.com/v1/projects/${P}/databases/(default)/documents`;
  const wk=()=>{const d=new Date(),t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const dn=(t.getUTCDay()+6)%7;t.setUTCDate(t.getUTCDate()-dn+3);const y=t.getUTCFullYear(),f=new Date(Date.UTC(y,0,4));return y+'-W'+String(1+Math.round(((t-f)/864e5-3+((f.getUTCDay()+6)%7))/7)).padStart(2,'0')};
  const MONTH=(()=>{try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/London',year:'numeric',month:'2-digit'}).format(new Date()).slice(0,7)}catch(e){return ''}})();
  function count(k){if(!LIVE||VIP||BOT)return;const body=id=>JSON.stringify({writes:[{transform:{document:`projects/${P}/databases/(default)/documents/stats/${id}`,fieldTransforms:[{fieldPath:'witw.game.'+k,increment:{integerValue:'1'}}]}}]});
    ['reach',MONTH?'reach-'+MONTH:null].filter(Boolean).forEach(id=>fetch(`${BASE}:commit?key=${K}`,{method:'POST',keepalive:true,headers:{'Content-Type':'application/json'},body:body(id)}).catch(()=>{}))}
  const T={
    en:{h:'Where are you playing from? 🌍',w:'We love seeing where the games reach. Just your country and nearest city: no name, nothing else.',c:'Country',t:'Nearest city',ph:'Start typing',go:'Send',later:'Not now',never:"Don't ask again",sm:'Optional. Not linked to you or your scores.',pv:'Privacy',ty:'Thank you! You’re on our map 📍',pick:'Please choose your country.',err:'Couldn’t send just now. Please try again.'},
    de:{h:'Von wo spielst du? 🌍',w:'Wir sehen gern, wohin die Spiele reichen. Nur dein Land und die nächste Stadt: kein Name, sonst nichts.',c:'Land',t:'Nächste Stadt',ph:'Tippe los',go:'Senden',later:'Nicht jetzt',never:'Nicht mehr fragen',sm:'Freiwillig. Nicht mit dir oder deinen Punkten verknüpft.',pv:'Datenschutz',ty:'Danke! Du bist auf unserer Karte 📍',pick:'Bitte wähle dein Land.',err:'Senden hat gerade nicht geklappt. Bitte versuch es noch einmal.'},
    tr:{h:'Nereden oynuyorsun? 🌍',w:'Oyunların nerelere ulaştığını görmeyi seviyoruz. Sadece ülken ve en yakın şehir: isim yok, başka bir şey yok.',c:'Ülke',t:'En yakın şehir',ph:'Yazmaya başla',go:'Gönder',later:'Şimdi değil',never:'Bir daha sorma',sm:'İsteğe bağlı. Sana ya da puanlarına bağlanmaz.',pv:'Gizlilik',ty:'Teşekkürler! Haritamızdasın 📍',pick:'Lütfen ülkeni seç.',err:'Şu an gönderilemedi. Lütfen tekrar dene.'},
    fr:{h:'D’où jouez-vous ? 🌍',w:'Nous aimons voir jusqu’où vont les jeux. Juste votre pays et la ville la plus proche : pas de nom, rien d’autre.',c:'Pays',t:'Ville la plus proche',ph:'Commencez à taper',go:'Envoyer',later:'Pas maintenant',never:'Ne plus demander',sm:'Facultatif. Non lié à vous ni à vos scores.',pv:'Confidentialité',ty:'Merci ! Vous êtes sur notre carte 📍',pick:'Choisissez votre pays.',err:'Envoi impossible pour le moment. Réessayez.'},
    es:{h:'¿Desde dónde juegas? 🌍',w:'Nos encanta ver hasta dónde llegan los juegos. Solo tu país y la ciudad más cercana: sin nombre, nada más.',c:'País',t:'Ciudad más cercana',ph:'Empieza a escribir',go:'Enviar',later:'Ahora no',never:'No volver a preguntar',sm:'Opcional. No se vincula contigo ni con tus puntuaciones.',pv:'Privacidad',ty:'¡Gracias! Ya estás en nuestro mapa 📍',pick:'Elige tu país.',err:'No se pudo enviar ahora. Inténtalo de nuevo.'},
    pt:{h:'De onde você está jogando? 🌍',w:'Adoramos ver até onde os jogos chegam. Só o seu país e a cidade mais próxima: sem nome, nada mais.',c:'País',t:'Cidade mais próxima',ph:'Comece a digitar',go:'Enviar',later:'Agora não',never:'Não perguntar de novo',sm:'Opcional. Não fica ligado a você nem às suas pontuações.',pv:'Privacidade',ty:'Obrigado! Você está no nosso mapa 📍',pick:'Escolha o seu país.',err:'Não foi possível enviar agora. Tente de novo.'}};
  const L=(document.documentElement.lang||'en').slice(0,2).toLowerCase(),t=T[L]||T.en;
  const due=()=>{const s=ls('tmg-where');if(s==='sent'||s==='never')return false;return ls('tmg-where-wk')!==wk()};
  window.addEventListener('tmg:gameover',()=>{if(!due())return;setTimeout(()=>{if(due()&&!document.querySelector('.tmgwq'))show()},1600)});
  const fold=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
  async function show(){
    ls('tmg-where-wk',wk());count('shown');
    let caps={},tzm={};try{[caps,tzm]=await Promise.all([fetch('/shared/places.json?v=2').then(r=>r.json()).then(j=>j.caps),fetch('/shared/tz.json').then(r=>r.json())])}catch(e){}
    let dn=null;try{dn=new Intl.DisplayNames([L],{type:'region'})}catch(e){}
    const name=c=>{try{return dn?dn.of(c):(caps[c]?caps[c][3]:c)}catch(e){return c}};
    const codes=Object.keys(caps).sort((a,b)=>name(a).localeCompare(name(b),L));
    let tz='';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){}
    const guess=window.tmgCC||tzm[tz]||'';
    const css=document.createElement('style');
    css.textContent=`.tmgwq{position:fixed;inset:0;z-index:2147482500;background:rgba(0,0,0,.28);display:flex;align-items:flex-end;justify-content:center;animation:tmgwqf .25s ease}
.tmgwq .cd{position:relative;background:#fff;color:#16181d;width:100%;max-width:440px;margin:10px;border-radius:24px;padding:18px 18px calc(14px + env(safe-area-inset-bottom));box-shadow:0 -10px 40px -10px rgba(0,0,0,.4);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;box-sizing:border-box;animation:tmgwqu .3s ease;max-height:calc(100% - 20px);overflow:auto}
@media (min-width:700px){.tmgwq{align-items:center}}
.tmgwq .x{position:absolute;right:12px;top:12px;width:34px;height:34px;border-radius:50%;background:#f0eee9;border:0;font-size:15px;cursor:pointer;color:#16181d}
.tmgwq h3{margin:0 0 4px;font:800 20px/1.25 Nunito,Inter,system-ui,sans-serif;padding-right:36px}.tmgwq .w{font-size:13.5px;color:#5b606b;margin:0 0 12px;line-height:1.4}
.tmgwq label{display:block;font-size:12.5px;font-weight:700;color:#3a4152;margin-bottom:9px}
.tmgwq select,.tmgwq input{display:block;width:100%;box-sizing:border-box;height:44px;margin-top:4px;border:1.5px solid #d6d9e2;border-radius:12px;padding:0 12px;font:500 16px Inter,system-ui,sans-serif;color:#16181d;background:#fff}
.tmgwq select:focus,.tmgwq input:focus{outline:none;border-color:#c2410c}
.tmgwq .sg{border:1px solid #e3e5ea;border-radius:12px;margin:-4px 0 10px;font-size:14.5px;overflow:hidden}.tmgwq .sg button{display:block;width:100%;text-align:left;background:#fff;border:0;border-top:1px solid #f0f1f4;padding:8px 12px;font:inherit;color:#16181d;cursor:pointer}.tmgwq .sg button:first-child{border-top:0}.tmgwq .sg button:hover{background:#fff4ec}
.tmgwq .go{display:block;width:100%;border:0;border-radius:999px;padding:12px;font:800 16px Nunito,Inter,system-ui,sans-serif;color:#fff;background:linear-gradient(90deg,#FF9100,#DD2C00);margin-top:4px;cursor:pointer}.tmgwq .go:disabled{opacity:.6}
.tmgwq .ln{display:flex;justify-content:space-between;margin-top:10px;font-size:13.5px}.tmgwq .ln button{background:none;border:0;padding:4px 0;font:inherit;color:#5b606b;cursor:pointer}.tmgwq .ln .nv{color:#c2410c;font-weight:600}
.tmgwq .sm{font-size:11.5px;color:#8a8f98;margin-top:8px;line-height:1.4}.tmgwq .sm a{color:#8a8f98}.tmgwq .er{color:#c0392b;font-size:13px;min-height:0;margin:2px 0 4px}
.tmgwq .ty{font:800 19px/1.3 Nunito,Inter,system-ui,sans-serif;text-align:center;padding:18px 6px}
@keyframes tmgwqf{from{opacity:0}}@keyframes tmgwqu{from{transform:translateY(30px)}}`;
    document.head.appendChild(css);
    const v=document.createElement('div');v.className='tmgwq';v.setAttribute('role','dialog');v.setAttribute('aria-modal','true');
    v.innerHTML=`<div class="cd"><button type="button" class="x" aria-label="✕">✕</button><h3></h3><p class="w"></p>
      <label><span class="lc"></span><select class="cs"><option value=""></option>${codes.map(c=>`<option value="${c}"${c===guess?' selected':''}></option>`).join('')}</select></label>
      <label><span class="lt"></span><input class="ci" autocomplete="off" maxlength="60"></label><div class="sg" hidden></div>
      <p class="er"></p><button type="button" class="go"></button>
      <div class="ln"><button type="button" class="nl"></button><button type="button" class="nv"></button></div>
      <p class="sm"><span class="smt"></span> <a href="/about/#privacy" target="_blank" rel="noopener"></a></p></div>`;
    const $=s=>v.querySelector(s);
    $('h3').textContent=t.h;$('.w').textContent=t.w;$('.lc').textContent=t.c;$('.lt').textContent=t.t;$('.ci').placeholder=t.ph;$('.go').textContent=t.go;$('.nl').textContent=t.later;$('.nv').textContent=t.never;$('.smt').textContent=t.sm;$('.sm a').textContent=t.pv;
    const opts=v.querySelectorAll('.cs option');opts[0].textContent='—';codes.forEach((c,i)=>opts[i+1].textContent=name(c));
    document.body.appendChild(v);
    let towns=[],tcc='';
    const loadTowns=async c=>{if(!c||c===tcc)return;tcc=c;towns=[];try{towns=await fetch('/shared/cities/'+c+'.json').then(r=>r.ok?r.json():[])}catch(e){}};
    const sg=$('.sg'),ci=$('.ci'),cs=$('.cs');
    const suggest=()=>{const q=fold(ci.value.trim());if(!q||!towns.length){sg.hidden=true;return}
      const a=[],b=[];for(const r of towns){const f=fold(r[0]);if(f.startsWith(q))a.push(r[0]);else if(f.includes(q))b.push(r[0]);if(a.length>=5)break}
      const list=[...a,...b].slice(0,5);if(!list.length||(list.length===1&&fold(list[0])===q)){sg.hidden=true;return}
      sg.innerHTML='';list.forEach(n=>{const bt=document.createElement('button');bt.type='button';bt.textContent=n;bt.onclick=()=>{ci.value=n;sg.hidden=true};sg.appendChild(bt)});sg.hidden=false};
    loadTowns(cs.value);cs.onchange=()=>{loadTowns(cs.value);ci.value='';sg.hidden=true};ci.oninput=suggest;
    const close=()=>{v.remove();css.remove()};
    $('.x').onclick=()=>{count('closed');close()};$('.nl').onclick=()=>{count('closed');close()};
    $('.nv').onclick=()=>{ls('tmg-where','never');count('never');close()};
    v.addEventListener('click',e=>{if(e.target===v){count('closed');close()}});
    $('.go').onclick=async()=>{const c=cs.value;if(!c){$('.er').textContent=t.pick;return}
      const go=$('.go');go.disabled=true;$('.er').textContent='';const s=x=>({stringValue:String(x||'').trim().slice(0,60)});
      const fields={src:s('game'),first:s(''),last:s(''),country:s(c),town:s(ci.value),tz:s(tz),test:{booleanValue:!LIVE||VIP||BOT},at:{timestampValue:new Date().toISOString()}};
      try{if(LIVE&&!BOT){const r=await fetch(`${BASE}/witw?key=${K}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields})});if(!r.ok)throw 0}
        ls('tmg-where','sent');count('sent');$('.cd').innerHTML=`<div class="ty"></div>`;$('.ty').textContent=t.ty;setTimeout(close,1800)}
      catch(e){go.disabled=false;$('.er').textContent=t.err}};
  }
})();
