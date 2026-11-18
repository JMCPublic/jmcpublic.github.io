/* Game footer with our own Share button (approved mock nw_footer_v1, 18 Nov 2026).
   Shown on start and results screens, hidden during play (adbox.js marks play with html.tmgad-play).
   Opened from a home-screen icon (no Safari toolbar), it adds a line explaining why. */
(function(){
  if(window.__tmgFoot)return;window.__tmgFoot=1;
  const T={
    en:['Share this game','New puzzles every day at midnight, your time.','Put it on your home screen','About, credits and privacy','Buy me a coffee','© 2026 Two Minute Games. All rights reserved.',"You opened this from its home-screen icon, so Safari's toolbar is hidden. Use Share here, or open twominute.games in Safari.",'Link copied'],
    de:['Spiel teilen','Jeden Tag um Mitternacht neue Rätsel, nach deiner Uhrzeit.','Auf den Home-Bildschirm legen','Über uns, Quellen und Datenschutz','Spendier mir einen Kaffee','© 2026 Two Minute Games. Alle Rechte vorbehalten.','Du hast das Spiel über sein Symbol auf dem Home-Bildschirm geöffnet, daher ist die Safari-Leiste ausgeblendet. Teile es hier oder öffne twominute.games in Safari.','Link kopiert'],
    tr:['Oyunu paylaş','Her gün gece yarısı yeni bulmacalar, senin saatine göre.','Ana ekrana ekle','Hakkında, kaynaklar ve gizlilik','Bana bir kahve ısmarla','© 2026 Two Minute Games. Tüm hakları saklıdır.',"Oyunu ana ekrandaki simgesinden açtın, bu yüzden Safari'nin araç çubuğu gizli. Buradan paylaş ya da twominute.games'i Safari'de aç.",'Bağlantı kopyalandı'],
    fr:['Partager ce jeu','De nouvelles énigmes chaque jour à minuit, à votre heure.',"Ajouter à l'écran d'accueil",'À propos, sources et confidentialité','Offrez-moi un café','© 2026 Two Minute Games. Tous droits réservés.',"Vous avez ouvert le jeu depuis son icône sur l'écran d'accueil, la barre de Safari est donc masquée. Partagez ici, ou ouvrez twominute.games dans Safari.",'Lien copié'],
    es:['Compartir este juego','Nuevos retos cada día a medianoche, en tu hora.','Añadir a la pantalla de inicio','Acerca de, fuentes y privacidad','Invítame a un café','© 2026 Two Minute Games. Todos los derechos reservados.','Abriste el juego desde su icono en la pantalla de inicio, por eso la barra de Safari está oculta. Comparte aquí o abre twominute.games en Safari.','Enlace copiado'],
    pt:['Compartilhar este jogo','Novos desafios todos os dias à meia-noite, no seu horário.','Adicionar à tela de início','Sobre, fontes e privacidade','Me pague um café','© 2026 Two Minute Games. Todos os direitos reservados.','Você abriu o jogo pelo ícone na tela de início, por isso a barra do Safari está oculta. Compartilhe aqui ou abra twominute.games no Safari.','Link copiado']
  };
  const L=(document.documentElement.lang||'en').slice(0,2).toLowerCase();const t=T[L]||T.en;
  const dark=getComputedStyle(document.body).backgroundColor.match(/\d+/g);const isDark=dark&&(+dark[0]+ +dark[1]+ +dark[2])<240;
  const css=document.createElement('style');
  css.textContent='.gfoot{position:relative;z-index:1;text-align:center;margin:22px 16px 84px;display:flex;flex-direction:column;gap:6px;align-items:center;font:12.5px/1.5 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;color:'+(isDark?'#8b9097':'#8a8f98')+'}'+
    '.gfoot a{color:'+(isDark?'#b5bac0':'#5b606b')+';text-decoration:none;white-space:nowrap}.gfoot a:hover{text-decoration:underline}'+
    '.gfoot .gsh{display:inline-flex;align-items:center;gap:6px;border:1.5px solid '+(isDark?'#FF9100':'#c2410c')+';color:'+(isDark?'#fff':'#c2410c')+';background:'+(isDark?'transparent':'#fff')+';border-radius:999px;padding:7px 16px;font:800 14px Nunito,Inter,system-ui,sans-serif;margin:2px 0 4px;cursor:pointer}'+
    '.gfoot .gapp{background:'+(isDark?'rgba(255,145,0,.12)':'#fff4ec')+';border:1px solid '+(isDark?'rgba(255,145,0,.4)':'#f3c7a8')+';color:'+(isDark?'#f2e6dc':'#5b3a22')+';border-radius:12px;padding:8px 12px;max-width:340px}'+
    'html.tmgad-play .gfoot{display:none}html.tmgap body:not(.waiting):not(.done) .gfoot,html.tmgap body.midgame:not(.done) .gfoot{display:none}@media (max-width:360px){.gfoot{font-size:11.5px}}';
  document.head.appendChild(css);
  const SH='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v13"/><path d="M7 8l5-5 5 5"/><path d="M5 13v7h14v-7"/></svg>';
  const app=(navigator.standalone||matchMedia('(display-mode: standalone)').matches);
  function build(){
    if(document.getElementById('skipBtn'))document.documentElement.classList.add('tmgap'); /* Aperture and Landmarks: show only before round 1 and after the last round */
    if(document.querySelector('.gfoot'))return;
    const f=document.createElement('footer');f.className='gfoot';
    f.innerHTML=(app?'<span class="gapp"></span>':'')+'<button type="button" class="gsh">'+SH+'<span></span></button><span class="g1"></span><span><a href="/add/" class="g2"></a></span><span><a href="/about/" class="g3"></a> · <a href="https://ko-fi.com/twominutegames" target="_blank" rel="noopener">☕ <span class="g4"></span></a></span><span><a href="/about/#ownership" class="g5"></a></span>';
    if(app)f.querySelector('.gapp').textContent='📱 '+t[6];
    f.querySelector('.gsh span').textContent=t[0];f.querySelector('.g1').textContent=t[1];f.querySelector('.g2').textContent='📱 '+t[2];
    f.querySelector('.g3').textContent=t[3];f.querySelector('.g4').textContent=t[4];f.querySelector('.g5').textContent=t[5];
    f.querySelector('.gsh').onclick=async()=>{const url=location.origin+location.pathname;
      try{if(navigator.share){await navigator.share({title:document.title,url});return}}catch(e){if(e&&e.name==='AbortError')return}
      try{await navigator.clipboard.writeText(url);toast(t[7])}catch(e){prompt(t[7],url)}};
    document.body.appendChild(f);
  }
  function toast(m){const d=document.createElement('div');d.textContent=m;d.style.cssText='position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#16181d;color:#fff;padding:9px 16px;border-radius:999px;font:600 14px Inter,system-ui,sans-serif;z-index:2147483000';document.body.appendChild(d);setTimeout(()=>d.remove(),1800)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();
