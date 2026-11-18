/* Round home button for every game (18 Nov 2026).
   Any <a class="tmghome"> goes to the home page. If the page says a game is under way
   (window.tmgMidGame() returns true), it asks first so a slip of the thumb can't lose a game.
   On Aperture and Landmarks the button is added before the music button. */
(function(){
  const HOUSE='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>';
  window.TMG_HOUSE=HOUSE;
  const T={
    en:['All games','Leave this game?','You\'re part-way through. Your score so far won\'t be saved.','Keep playing','All games'],
    de:['Alle Spiele','Spiel verlassen?','Du bist mittendrin. Dein bisheriger Punktestand wird nicht gespeichert.','Weiterspielen','Alle Spiele'],
    tr:['Tüm oyunlar','Oyundan çıkılsın mı?','Oyunun ortasındasın. Şimdiye kadarki puanın kaydedilmeyecek.','Oynamaya devam','Tüm oyunlar'],
    fr:['Tous les jeux','Quitter la partie ?','Vous êtes en pleine partie. Votre score actuel ne sera pas enregistré.','Continuer','Tous les jeux'],
    es:['Todos los juegos','¿Salir de la partida?','Estás a mitad de partida. Tu puntuación hasta ahora no se guardará.','Seguir jugando','Todos los juegos'],
    pt:['Todos os jogos','Sair do jogo?','Você está no meio do jogo. A sua pontuação até agora não será guardada.','Continuar a jogar','Todos os jogos']
  };
  const L=((document.documentElement.lang||'en').slice(0,2).toLowerCase());
  const t=T[L]||T.en;
  window.tmgHomeLabel=t[0];
  const css=document.createElement('style');
  css.textContent='.tmghome{text-decoration:none}.tmghome svg{display:block}'+
    '.tmghs{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:flex-end;justify-content:center;z-index:2147483000;animation:tmghf .15s ease}'+
    '.tmghs>div{background:#fff;color:#16181d;width:100%;max-width:520px;border-radius:22px 22px 0 0;padding:24px 22px calc(26px + env(safe-area-inset-bottom));font-family:Inter,system-ui,sans-serif;box-sizing:border-box}'+
    '@media (min-width:700px){.tmghs{align-items:center}.tmghs>div{border-radius:22px}}'+
    '.tmghs h3{margin:0 0 6px;font-size:21px;font-weight:800}.tmghs p{margin:0 0 18px;color:#5b606b;font-size:15.5px;line-height:1.4}'+
    '.tmghs .r{display:flex;gap:10px}.tmghs button{flex:1;height:48px;border-radius:24px;font:700 15.5px Inter,system-ui,sans-serif;cursor:pointer;border:2px solid #16181d;background:#fff;color:#16181d}'+
    '.tmghs button.go{background:linear-gradient(135deg,#FF9100,#DD2C00);color:#fff;border:0}@keyframes tmghf{from{opacity:0}}'+
    'html.tmgtight .helpbtn{font-size:0!important;width:26px!important;height:26px!important;padding:0!important;border-radius:50%!important}.helpbtn::before{content:none}html.tmgtight .helpbtn::before{content:"?";font-size:14px;font-weight:700}';
  document.head.appendChild(css);
  function ask(href){
    const s=document.createElement('div');s.className='tmghs';s.setAttribute('role','dialog');s.setAttribute('aria-modal','true');
    s.innerHTML='<div><h3></h3><p></p><div class="r"><button type="button" class="stay"></button><button type="button" class="go"></button></div></div>';
    s.querySelector('h3').textContent=t[1];s.querySelector('p').textContent=t[2];
    s.querySelector('.stay').textContent=t[3];s.querySelector('.go').textContent=t[4];
    const close=()=>s.remove();
    s.addEventListener('click',e=>{if(e.target===s||e.target.classList.contains('stay'))close();else if(e.target.classList.contains('go'))location.href=href});
    document.body.appendChild(s);s.querySelector('.stay').focus();
  }
  document.addEventListener('click',e=>{
    const a=e.target.closest&&e.target.closest('a.tmghome');if(!a)return;
    let mid=false;try{mid=!!(window.tmgMidGame&&window.tmgMidGame())}catch(err){}
    if(mid){e.preventDefault();ask(a.getAttribute('href')||'/')}
  },true);
  function addAp(){
    const m=document.getElementById('musicBtn');if(!m||document.querySelector('.tmghome'))return;
    const a=document.createElement('a');a.className='soundbtn tmghome';a.href='/';a.innerHTML=HOUSE;
    a.setAttribute('aria-label',t[0]);a.title=t[0];m.parentNode.insertBefore(a,m);
    fit();addEventListener('resize',fit);
  }
  /* if the top row no longer fits, show How to play as a round ? */
  function fit(){const h=document.getElementById('helpBtn'),d=document.documentElement;if(!h)return;d.classList.remove('tmgtight');
    if(h.getBoundingClientRect().right>d.clientWidth-4||d.scrollWidth>d.clientWidth+1){h.setAttribute('aria-label',h.textContent);d.classList.add('tmgtight')}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addAp);else addAp();
})();
