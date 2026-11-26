/* Film Charades stage (26 Nov 2026): plain stick people miming a film scene with simple everyday props, like real charades.
   Never the film's own characters, costumes or logos: only stick people and ordinary objects.
   A scene is a list: ['fig', x, y, pose, {s, flip, hat, c, wings, glasses}] or [prop, x, y, {…}]. Stage 400 × 250, ground at y = 210. */
(()=>{
const INK='#16130f',ACC='#e2552d',SOFT='#b9ad99',SKY='#9cc4d8',WOOD='#8a6a44',GRN='#6aa36a',GOLD='#e2b549';
const P={
 stand:{a:[20,20],l:[10,10]},wide:{a:[95,95],l:[14,14]},up:{a:[160,160],l:[12,12]},point:{a:[25,95],l:[10,10]},
 wave:{a:[20,150],l:[10,10]},fist:{a:[20,170],l:[12,12]},hold:{a:[60,60],l:[10,10]},holdup:{a:[150,150],l:[10,10]},
 walk:{a:[35,-30],l:[28,-22]},run:{a:[70,-60],l:[45,-40]},kick:{a:[40,120],l:[5,85]},sit:{a:[40,40],l:[90,90],sit:1},
 situp:{a:[150,150],l:[90,90],sit:1},kneel:{a:[30,80],l:[85,10],kneel:1},lie:{lie:1},swing:{a:[150,30],l:[30,70]},
 cheeks:{a:[150,150],l:[12,12],cheeks:1},lean:{a:[120,130],l:[25,25],lean:1},hang:{a:[175,175],l:[8,8]},dance:{a:[130,40],l:[35,5]},
 aim:{a:[80,85],l:[14,14]},think:{a:[20,140],l:[10,10]}
};
const rad=d=>d*Math.PI/180;
const limb=(x,y,ang,len)=>{const a=rad(ang);return [x+Math.sin(a)*len,y+Math.cos(a)*len]};
function fig(x,y,pose,o={}){const s=o.s||1,f=o.flip?-1:1,p=P[pose]||P.stand,c=o.c||INK,w=4.2*s;
  const L=(x1,y1,x2,y2)=>`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
  let g='',pre='';
  if(p.lie){const hx=x-30*s*f;g+=L(hx+10*s*f,y,x+20*s*f,y)+L(x+20*s*f,y,x+42*s*f,y+2*s)+L(x,y,x+8*s*f,y-14*s)+`<circle cx="${hx}" cy="${y-2*s}" r="${9*s}" fill="#fff"/>`;return `<g stroke="${c}" stroke-width="${w}" stroke-linecap="round" fill="none">${g}</g>`}
  const lean=p.lean?-14*s*f:0,neck=[x+lean,y-34*s],head=[x+lean*1.3,y-46*s],sh=[x+lean*.9,y-30*s];
  if(o.wings)pre+=`<path d="M${sh[0]} ${sh[1]}q${-30*s} ${-18*s} ${-34*s} ${8*s}q${18*s} ${4*s} ${34*s} ${2*s}M${sh[0]} ${sh[1]}q${30*s} ${-18*s} ${34*s} ${8*s}q${-18*s} ${4*s} ${-34*s} ${2*s}" fill="#fff" stroke="${SOFT}" stroke-width="${2*s}"/>`;
  if(o.dress)pre+=`<path d="M${x-14*s} ${y+6*s}L${x} ${y-24*s}L${x+14*s} ${y+6*s}z" fill="${o.dress}" stroke="none"/>`;
  g+=L(x,y,neck[0],neck[1]);
  const a1=limb(sh[0],sh[1],-p.a[0]*f,24*s),a2=limb(sh[0],sh[1],p.a[1]*f,24*s);
  if(p.cheeks){g+=L(sh[0],sh[1],head[0]-10*s,head[1]+4*s)+L(sh[0],sh[1],head[0]+10*s,head[1]+4*s)}
  else g+=L(sh[0],sh[1],a1[0],a1[1])+L(sh[0],sh[1],a2[0],a2[1]);
  if(p.sit){g+=L(x,y,x+22*s*f,y)+L(x+22*s*f,y,x+22*s*f,y+20*s)}
  else if(p.kneel){g+=L(x,y,x+4*s*f,y+20*s)+L(x+4*s*f,y+20*s,x+26*s*f,y+20*s)}
  else{const l1=limb(x,y,-p.l[0]*f,30*s),l2=limb(x,y,p.l[1]*f,30*s);g+=L(x,y,l1[0],l1[1])+L(x,y,l2[0],l2[1])}
  g+=`<circle cx="${head[0]}" cy="${head[1]}" r="${9*s}" fill="#fff"/>`;
  if(p.cheeks)g+=`<ellipse cx="${head[0]}" cy="${head[1]+3*s}" rx="${2.2*s}" ry="${3*s}" fill="${c}" stroke="none"/>`;
  const hx=head[0],hy=head[1],H=o.hat;
  if(H==='top')g+=`<path d="M${hx-11*s} ${hy-8*s}h${22*s}M${hx-7*s} ${hy-8*s}v${-13*s}h${14*s}v${13*s}" stroke-width="${w*.9}"/>`;
  if(H==='bowler')g+=`<path d="M${hx-12*s} ${hy-7*s}h${24*s}" stroke-width="${w*.9}"/><path d="M${hx-8*s} ${hy-7*s}a${8*s} ${8*s} 0 0 1 ${16*s} 0z" fill="${c}"/>`;
  if(H==='fedora')g+=`<path d="M${hx-14*s} ${hy-7*s}h${28*s}" stroke-width="${w*.9}"/><path d="M${hx-8*s} ${hy-7*s}l${2*s} ${-9*s}h${12*s}l${2*s} ${9*s}z" fill="${WOOD}" stroke="${WOOD}"/>`;
  if(H==='cowboy')g+=`<path d="M${hx-16*s} ${hy-8*s}q${16*s} ${6*s} ${32*s} 0" stroke-width="${w*.9}"/><path d="M${hx-8*s} ${hy-8*s}l${1*s} ${-10*s}q${7*s} ${-3*s} ${14*s} 0l${1*s} ${10*s}z" fill="${WOOD}" stroke="${WOOD}"/>`;
  if(H==='crown')g+=`<path d="M${hx-9*s} ${hy-8*s}l${3*s} ${-10*s}l${3*s} ${6*s}l${3*s} ${-8*s}l${3*s} ${8*s}l${3*s} ${-6*s}l${3*s} ${10*s}z" fill="${GOLD}" stroke="${GOLD}" stroke-width="${1.5*s}"/>`;
  if(H==='hood')g+=`<path d="M${hx-13*s} ${hy+12*s}Q${hx-14*s} ${hy-18*s} ${hx} ${hy-16*s}Q${hx+14*s} ${hy-18*s} ${hx+13*s} ${hy+12*s}" fill="${INK}"/><path d="M${x-16*s} ${y+28*s}L${x} ${neck[1]}L${x+16*s} ${y+28*s}z" fill="${INK}"/>`;
  if(H==='helmet')g+=`<circle cx="${hx}" cy="${hy}" r="${13*s}" fill="rgba(200,225,240,.6)" stroke="#6b737a" stroke-width="${2.5*s}"/>`;
  if(H==='wild')g+=`<path d="M${hx-10*s} ${hy-4*s}l${-6*s} ${-6*s}M${hx-6*s} ${hy-8*s}l${-3*s} ${-9*s}M${hx} ${hy-9*s}v${-9*s}M${hx+6*s} ${hy-8*s}l${3*s} ${-9*s}M${hx+10*s} ${hy-4*s}l${6*s} ${-6*s}" stroke-width="${2.5*s}"/>`;
  if(H==='beret')g+=`<ellipse cx="${hx+2*s}" cy="${hy-8*s}" rx="${11*s}" ry="${4*s}" fill="${c}"/>`;
  if(o.glasses)g+=`<path d="M${hx-7*s} ${hy-1*s}h${14*s}" stroke-width="${3*s}"/>`;
  if(o.bun)g+=`<circle cx="${hx}" cy="${hy-11*s}" r="${4*s}" fill="${c}"/>`;
  if(o.hair)g+=`<path d="M${hx-9*s} ${hy-2*s}q${-2*s} ${16*s} ${-6*s} ${18*s}M${hx+9*s} ${hy-2*s}q${2*s} ${16*s} ${6*s} ${18*s}" stroke-width="${2.5*s}"/>`;
  return `${pre}<g stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none">${g}</g>`}
const st=(w=3)=>`stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const PR={
 sea:(x,y)=>`<path d="M0 ${y} Q25 ${y-8} 50 ${y} T100 ${y} T150 ${y} T200 ${y} T250 ${y} T300 ${y} T350 ${y} T400 ${y} V250 H0Z" fill="${SKY}" opacity=".75"/>`,
 beach:(x,y)=>`<path d="M0 ${y}H400V250H0Z" fill="#efe1bf"/>`,
 grass:(x,y)=>`<path d="M0 ${y}H400V250H0Z" fill="#cfe3b8"/>`,
 snow:(x,y)=>{let s=`<path d="M0 ${y}H400V250H0Z" fill="#fff"/>`;for(let i=0;i<40;i++)s+=`<circle cx="${(i*41)%400}" cy="${(i*67)%200}" r="2.2" fill="#c9dbe6"/>`;return s},
 night:()=>`<rect width="400" height="250" fill="#2a3448"/>`,
 dusk:()=>`<rect width="400" height="250" fill="#f3c9a8"/><rect y="0" width="400" height="120" fill="#c9a6c9" opacity=".6"/>`,
 space:()=>{let s=`<rect width="400" height="250" fill="#141a2a"/>`;for(let i=0;i<40;i++)s+=`<circle cx="${(i*71)%400}" cy="${(i*37)%250}" r="1.4" fill="#fff"/>`;return s},
 stars:()=>{let s='';for(let i=0;i<16;i++)s+=`<circle cx="${(i*71)%400}" cy="${(i*29)%120+8}" r="1.6" fill="#fff"/>`;return s},
 rain:()=>{let s='';for(let i=0;i<46;i++){const rx=(i*37)%400,ry=(i*53)%190;s+=`<path d="M${rx} ${ry}l-4 12" stroke="#7aa6c2" stroke-width="2" stroke-linecap="round"/>`}return s},
 fog:()=>`<rect width="400" height="250" fill="#dfe3e6" opacity=".55"/>`,
 desert:(x,y)=>`<path d="M0 ${y}Q100 ${y-30} 200 ${y}T400 ${y}V250H0Z" fill="#e8c98a"/><path d="M0 ${y+18}Q120 ${y-6} 260 ${y+16}T400 ${y+10}V250H0Z" fill="#dcb573"/>`,
 sun:(x,y,o)=>`<circle cx="${x}" cy="${y}" r="${o.r||22}" fill="#ffc94a"/>`,
 moon:(x,y,o)=>`<circle cx="${x}" cy="${y}" r="${o.r||60}" fill="#f6efd6" stroke="#e2d6ad" stroke-width="2"/>`,
 moonface:(x,y)=>`<circle cx="${x}" cy="${y}" r="62" fill="#f6efd6" stroke="#cbbf98" stroke-width="3"/><circle cx="${x-22}" cy="${y-10}" r="6" fill="${INK}"/><path d="M${x+12} ${y-14}q10 -6 20 0" ${st(3)} fill="none"/><path d="M${x-24} ${y+24}q24 16 46 0" ${st(3)} fill="none"/><path d="M${x+18} ${y-8}l34 -30l8 10z" fill="#9aa3ab" ${st(2)}/>`,
 earth:()=>`<path d="M-40 250Q200 150 440 250Z" fill="#3d7fb8"/><path d="M60 236q40 -20 90 -8q30 8 20 20z" fill="${GRN}"/>`,
 sky:()=>`<rect width="400" height="250" fill="#dcecf5"/>`,
 lamppost:(x,y)=>`<g ${st(5)} fill="none"><path d="M${x} 210V${y}"/><path d="M${x} ${y}q0 -12 16 -12"/></g><path d="M${x+10} ${y-12}h16l-4 12h-8z" fill="#ffd36b" ${st(2)}/>`,
 umbrella:(x,y,o)=>`<path d="M${x-22} ${y}Q${x} ${y-26} ${x+22} ${y}Z" fill="${o.c||ACC}" ${st(2.5)}/><path d="M${x} ${y}v26" ${st(3)} fill="none"/>`,
 puddle:(x,y,o)=>`<ellipse cx="${x}" cy="${y}" rx="${o.w||40}" ry="6" fill="${SKY}"/>`,
 bow:(x,y)=>`<path d="M${x} ${y}L${x+170} ${y}L${x+230} ${y-60}L${x+150} ${y-60}Z" fill="#6b4f2a" ${st(3)}/>`,
 chess:(x,y)=>{let s=`<rect x="${x-26}" y="${y-8}" width="52" height="8" fill="${INK}"/>`;for(let i=0;i<6;i++)s+=`<rect x="${x-24+i*8}" y="${y-16}" width="8" height="8" fill="${i%2?INK:'#f4efe6'}" stroke="${INK}"/>`;return s+`<path d="M${x-20} ${y}v18M${x+20} ${y}v18" ${st(3)}/>`},
 piece:(x,y,o)=>`<path d="M${x-4} ${y}h8l-2 -8h-4z" fill="${o.c||INK}"/><circle cx="${x}" cy="${y-10}" r="3" fill="${o.c||INK}"/>`,
 bicycle:(x,y,o)=>`<g ${st(3)} fill="none"><circle cx="${x-18}" cy="${y}" r="13"/><circle cx="${x+18}" cy="${y}" r="13"/><path d="M${x-18} ${y}L${x-4} ${y-18}L${x+10} ${y-18}L${x+18} ${y}M${x-4} ${y-18}L${x+2} ${y}L${x-18} ${y}M${x+10} ${y-18}l3 -8"/></g>${o.basket?`<rect x="${x+12}" y="${y-30}" width="16" height="10" fill="#c8a165" ${st(2)}/>`:''}`,
 yroad:(x,y)=>`<path d="M-10 230Q120 200 180 215T330 190T420 175" stroke="#f2c230" stroke-width="18" fill="none"/>`,
 citygreen:(x,y)=>`<g fill="#5fae6a" ${st(2)}><path d="M${x} ${y}v-50l8 -14l8 14v50z"/><path d="M${x+18} ${y}v-70l9 -18l9 18v70z"/><path d="M${x+40} ${y}v-40l7 -12l7 12v40z"/></g>`,
 dog:(x,y)=>`<g ${st(2.5)} fill="${INK}"><ellipse cx="${x}" cy="${y-10}" rx="12" ry="7"/><circle cx="${x+13}" cy="${y-18}" r="6"/><path d="M${x-8} ${y-4}v8M${x+6} ${y-4}v8M${x-12} ${y-12}l-6 -6" fill="none"/></g>`,
 fin:(x,y)=>`<path d="M${x} ${y}L${x+18} ${y-34}Q${x+26} ${y-12} ${x+40} ${y}Z" fill="#59626b" ${st(2)}/>`,
 boat:(x,y)=>`<path d="M${x-40} ${y-14}h80l-12 16h-56z" fill="${WOOD}" ${st(3)}/>`,
 dino:(x,y)=>`<path d="M${x-60} ${y-40}q20 -10 40 -6q10 -30 34 -30q22 0 24 14q-4 8 -16 8q-6 8 -4 18q18 8 22 30h-14q-6 -12 -16 -14q-4 12 2 20h-14q-10 -10 -8 -24q-20 -2 -50 -16z" fill="#5d6b4f" ${st(2.5)}/><circle cx="${x+30}" cy="${y-62}" r="2.5" fill="#fff"/>`,
 jeep:(x,y)=>`<g ${st(3)}><path d="M${x-44} ${y-10}v-22h52l14 -14h20v36z" fill="#d9b44a"/><circle cx="${x-26}" cy="${y-8}" r="10" fill="${INK}"/><circle cx="${x+24}" cy="${y-8}" r="10" fill="${INK}"/></g>`,
 car:(x,y,o)=>`<g ${st(3)}><path d="M${x-46} ${y-10}v-18h14l12 -16h40l12 16h14v18z" fill="${o.c||'#b8bec4'}"/><circle cx="${x-26}" cy="${y-8}" r="10" fill="${INK}"/><circle cx="${x+26}" cy="${y-8}" r="10" fill="${INK}"/></g>${o.wings?`<path d="M${x-6} ${y-30}l-40 -24h28zM${x+6} ${y-30}l40 -24h-28z" fill="#fff" ${st(2)}/>`:''}`,
 flames:(x,y)=>`<path d="M${x} ${y}h-140M${x} ${y-14}h-140" stroke="${ACC}" stroke-width="7" stroke-linecap="round"/><path d="M${x} ${y}h-120M${x} ${y-14}h-120" stroke="#ffc94a" stroke-width="3" stroke-linecap="round"/>`,
 clocktower:(x,y)=>`<path d="M${x-22} 210V${y}h44V210z" fill="#c9b79c" ${st(3)}/><path d="M${x-26} ${y}l26 -24l26 24z" fill="${WOOD}" ${st(3)}/><circle cx="${x}" cy="${y+26}" r="15" fill="#fff" ${st(3)}/><path d="M${x} ${y+26}v-9M${x} ${y+26}h7" ${st(2.5)}/>`,
 cliff:(x,y)=>`<path d="M${x-80} 250L${x-60} ${y}L${x+40} ${y}L${x+60} ${y+20}L${x+30} 250z" fill="#b59a74" ${st(3)}/>`,
 bundle:(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="12" ry="8" fill="#f2e2c4" ${st(2.5)}/>`,
 train:(x,y,o)=>`<g ${st(3)}><rect x="${x-60}" y="${y-44}" width="78" height="34" fill="${o.c||'#b8322a'}"/><rect x="${x+18}" y="${y-60}" width="34" height="50" fill="${o.c||'#b8322a'}"/><rect x="${x-44}" y="${y-64}" width="12" height="20" fill="${INK}"/><circle cx="${x-38}" cy="${y-8}" r="9" fill="${INK}"/><circle cx="${x-6}" cy="${y-8}" r="9" fill="${INK}"/><circle cx="${x+34}" cy="${y-8}" r="9" fill="${INK}"/></g><circle cx="${x-36}" cy="${y-80}" r="9" fill="#ddd"/><circle cx="${x-24}" cy="${y-94}" r="12" fill="#e8e8e8"/>`,
 castle:(x,y,o)=>`<g fill="${o.c||'#c9bfae'}" ${st(2.5)}><path d="M${x-40} ${y}v-50h80v50z"/><path d="M${x-50} ${y}v-80h16v80zM${x+34} ${y}v-80h16v80z"/><path d="M${x-52} ${y-80}l10 -18l10 18zM${x+32} ${y-80}l10 -18l10 18z" fill="${o.r||'#7a6aa8'}"/></g>`,
 broom:(x,y)=>`<path d="M${x-50} ${y}L${x+40} ${y-6}" ${st(4)}/><path d="M${x-50} ${y}l-20 -8l-4 14z" fill="#c8a165" ${st(2)}/>`,
 rod:(x,y,o)=>`<line x1="${x}" y1="${y}" x2="${x+(o.dx||30)}" y2="${y+(o.dy||-30)}" stroke="${o.c||'#7ad1ff'}" stroke-width="5" stroke-linecap="round"/><line x1="${x}" y1="${y}" x2="${x+(o.dx||30)}" y2="${y+(o.dy||-30)}" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`,
 stick:(x,y,o)=>`<line x1="${x}" y1="${y}" x2="${x+(o.dx||0)}" y2="${y+(o.dy||-40)}" ${st(o.w||3)}/>`,
 hills:(x,y)=>`<path d="M0 ${y}Q80 ${y-50} 170 ${y-20}T400 ${y-30}V250H0Z" fill="#9cc98a"/><path d="M260 ${y-30}l40 -60l40 60z" fill="#d6e3ea" ${st(2)}/>`,
 roofs:(x,y)=>`<g fill="#a7988a" ${st(2.5)}><path d="M0 250V${y}l40 -30l40 30V250z"/><path d="M90 250V${y+10}l50 -34l50 34V250z"/><path d="M280 250V${y}l60 -36l60 36V250z"/></g><rect x="150" y="${y-46}" width="12" height="22" fill="#8a7a6c" ${st(2)}/>`,
 steps:(x,y)=>{let s='';for(let i=0;i<6;i++)s+=`<rect x="${x+i*24}" y="${y-i*14}" width="${160-i*24}" height="14" fill="#cfc5b4" ${st(2)}/>`;return s},
 bench:(x,y)=>`<g ${st(3)} fill="none"><path d="M${x-40} ${y-20}h80M${x-40} ${y-34}h80M${x-34} ${y-20}v20M${x+34} ${y-20}v20M${x-40} ${y-34}v14M${x+40} ${y-34}v14"/></g>`,
 box:(x,y,o)=>`<rect x="${x-10}" y="${y-8}" width="20" height="10" fill="${o.c||'#c58a5a'}" ${st(2)}/>`,
 feather:(x,y)=>`<path d="M${x} ${y}q12 -18 2 -32q-12 14 -2 32z" fill="#fff" ${st(1.8)}/>`,
 skyscraper:(x,y)=>`<path d="M${x-22} 250V${y}h44V250z" fill="#b9b2a6" ${st(3)}/><path d="M${x-12} ${y}v-20h24v20zM${x-2} ${y-20}v-24h4v24z" fill="#b9b2a6" ${st(2.5)}/>`,
 plane:(x,y,o)=>`<g ${st(2.5)}><path d="M${x-30} ${y}h56l8 -4l-8 -4h-56z" fill="${o.c||'#d6d6d6'}"/><path d="M${x-6} ${y-4}l-10 -18h8l14 18zM${x-6} ${y}l-10 16h8l14 -16zM${x-30} ${y-4}l-6 -10h6l6 10z" fill="${o.c||'#d6d6d6'}"/></g>`,
 jet:(x,y)=>`<path d="M${x-40} ${y}l70 -6l12 4l-12 4z" fill="#9aa3ab" ${st(2.5)}/><path d="M${x-6} ${y-3}l-18 -18h10l22 18zM${x-6} ${y+3}l-18 16h10l22 -16z" fill="#9aa3ab" ${st(2)}/>`,
 ghost:(x,y)=>`<path d="M${x-24} ${y}v-40a24 24 0 0 1 48 0v40l-8 -8l-8 8l-8 -8l-8 8l-8 -8z" fill="#fff" ${st(2.5)}/><circle cx="${x-8}" cy="${y-40}" r="3.5" fill="${INK}"/><circle cx="${x+8}" cy="${y-40}" r="3.5" fill="${INK}"/>`,
 beam:(x,y,o)=>`<path d="M${x} ${y}q${(o.dx||80)/3} -14 ${(o.dx||80)*2/3} 0t${(o.dx||80)/3} ${o.dy||-10}" stroke="${ACC}" stroke-width="3" fill="none"/>`,
 boulder:(x,y)=>`<circle cx="${x}" cy="${y-40}" r="40" fill="#8f8577" ${st(3)}/><path d="M${x-20} ${y-60}q10 10 0 24M${x+10} ${y-30}q12 -4 16 8" ${st(2)} fill="none"/>`,
 apple:(x,y)=>`<circle cx="${x}" cy="${y}" r="7" fill="#d63a2f" ${st(2)}/><path d="M${x} ${y-7}v-5" ${st(2)}/>`,
 bed:(x,y)=>`<g ${st(3)}><rect x="${x-50}" y="${y-22}" width="100" height="12" fill="#e9dfcf"/><path d="M${x-50} ${y-10}v10M${x+50} ${y-10}v10M${x-50} ${y-22}v-16"/></g>`,
 house:(x,y,o)=>`<g ${st(3)}><rect x="${x-34}" y="${y-44}" width="68" height="44" fill="${o.c||'#e8d8b8'}"/><path d="M${x-42} ${y-44}l42 -32l42 32z" fill="#a8574a"/><rect x="${x-8}" y="${y-24}" width="16" height="24" fill="${WOOD}"/></g>`,
 balloons:(x,y)=>{let s='';const C=['#e2552d','#ffc94a','#6aa3d6','#8ac06a','#c57ac9','#f08aa0'];for(let i=0;i<26;i++){const bx=x-50+(i*37)%100,by=y-20-((i*23)%60);s+=`<path d="M${x} ${y+40}L${bx} ${by}" stroke="#999" stroke-width=".7"/><circle cx="${bx}" cy="${by}" r="9" fill="${C[i%6]}" stroke="${INK}" stroke-width="1.2"/>`}return s},
 volcano:(x,y)=>`<path d="M${x-90} 250L${x-20} ${y}h40L${x+90} 250z" fill="#7a5f4f" ${st(3)}/><path d="M${x-20} ${y}q20 -30 40 0" fill="${ACC}"/><path d="M${x-6} ${y-14}q-8 -20 6 -34M${x+8} ${y-18}q10 -16 0 -30" stroke="#ff9d4a" stroke-width="4" fill="none"/>`,
 ring:(x,y)=>`<circle cx="${x}" cy="${y}" r="6" fill="none" stroke="${GOLD}" stroke-width="3.5"/>`,
 ship:(x,y)=>`<g ${st(3)}><path d="M${x-70} ${y-20}h140l-20 24h-100z" fill="#6b4f2a"/><path d="M${x-6} ${y-20}v-90M${x+40} ${y-20}v-70" fill="none"/><path d="M${x-4} ${y-104}h-40v34h40zM${x+42} ${y-84}h-30v30h30z" fill="#f4efe6"/><path d="M${x-6} ${y-110}h22l-6 6l6 6h-22z" fill="${INK}"/></g>`,
 sword:(x,y,o)=>`<path d="M${x} ${y}l${o.dx||26} ${o.dy||-26}" stroke="#9aa3ab" stroke-width="3" stroke-linecap="round"/>`,
 palm:(x,y)=>`<path d="M${x} ${y}q-8 -40 4 -80" stroke="${WOOD}" stroke-width="7" fill="none"/><path d="M${x+4} ${y-80}q-30 -6 -44 10M${x+4} ${y-80}q30 -10 44 6M${x+4} ${y-80}q-10 -20 -30 -22M${x+4} ${y-80}q18 -18 32 -16" stroke="${GRN}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
 ball:(x,y,o)=>`<circle cx="${x}" cy="${y}" r="${o.r||8}" fill="#fff" ${st(2)}/>${o.face?`<path d="M${x-8} ${y-2}q2 -6 4 0M${x} ${y-4}q4 -6 6 2M${x-6} ${y+4}q6 4 10 0" stroke="#b8322a" stroke-width="2" fill="none"/>`:''}`,
 bridge:(x,y)=>`<path d="M0 ${y}Q200 ${y-40} 400 ${y}" stroke="${WOOD}" stroke-width="10" fill="none"/><path d="M0 ${y-20}Q200 ${y-60} 400 ${y-20}" ${st(3)} fill="none"/>`,
 river:(x,y)=>`<path d="M0 ${y}H400V250H0z" fill="${SKY}" opacity=".8"/>`,
 chair:(x,y)=>`<g ${st(3)}><path d="M${x-14} ${y-60}v40h30v20M${x-14} ${y-20}v20" fill="none"/><rect x="${x-18}" y="${y-64}" width="10" height="44" fill="#8a3a2a"/></g>`,
 cat:(x,y)=>`<g fill="#7d7a76" ${st(2)}><ellipse cx="${x}" cy="${y}" rx="10" ry="6"/><circle cx="${x+9}" cy="${y-6}" r="5"/><path d="M${x+6} ${y-10}l1 -5l3 3zM${x+12} ${y-10}l1 -5l2 4z"/></g>`,
 window:(x,y)=>`<rect x="${x-50}" y="${y-60}" width="100" height="70" fill="#e4eef3" ${st(3)}/><path d="M${x} ${y-60}v70M${x-50} ${y-25}h100" ${st(2)}/>`,
 cast:(x,y)=>`<rect x="${x}" y="${y-6}" width="30" height="12" rx="4" fill="#fff" ${st(2)}/>`,
 binoc:(x,y)=>`<g fill="${INK}"><rect x="${x-8}" y="${y-5}" width="7" height="10" rx="2"/><rect x="${x+1}" y="${y-5}" width="7" height="10" rx="2"/></g>`,
 suitcase:(x,y)=>`<rect x="${x-14}" y="${y-22}" width="28" height="20" rx="3" fill="#a8743a" ${st(2.5)}/><path d="M${x-5} ${y-22}v-5h10v5" ${st(2)} fill="none"/>`,
 jar:(x,y)=>`<rect x="${x-6}" y="${y-14}" width="12" height="14" rx="2" fill="#e09a2d" ${st(2)}/><rect x="${x-7}" y="${y-17}" width="14" height="4" fill="#fff" ${st(1.5)}/>`,
 sign:(x,y,o)=>`<rect x="${x-34}" y="${y-18}" width="68" height="18" fill="#fff" ${st(2)}/><text x="${x}" y="${y-5}" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="${INK}">${o.t||''}</text><path d="M${x} ${y}v${o.h||0}" ${st(2)}/>`,
 mini:(x,y,o)=>`<g ${st(2.5)}><path d="M${x-22} ${y-8}v-12h8l6 -8h18l6 8h6v12z" fill="${o.c||'#c8322a'}"/><circle cx="${x-12}" cy="${y-6}" r="5" fill="${INK}"/><circle cx="${x+12}" cy="${y-6}" r="5" fill="${INK}"/></g>`,
 bus:(x,y)=>`<g ${st(3)} transform="rotate(-12 ${x} ${y})"><rect x="${x-60}" y="${y-44}" width="120" height="40" rx="6" fill="#e0b84a"/><path d="M${x-50} ${y-36}h100" stroke="#fff"/><circle cx="${x-36}" cy="${y-4}" r="9" fill="${INK}"/><circle cx="${x+36}" cy="${y-4}" r="9" fill="${INK}"/></g>`,
 cliffedge:(x,y)=>`<path d="M0 ${y}H${x}L${x+20} 250H0z" fill="#b59a74" ${st(3)}/>`,
 motorbike:(x,y)=>`<g ${st(3)}><circle cx="${x-24}" cy="${y}" r="13" fill="none"/><circle cx="${x+24}" cy="${y}" r="13" fill="none"/><path d="M${x-24} ${y}l14 -18h26l8 18M${x+16} ${y-18}l4 -10" fill="none"/><rect x="${x-12}" y="${y-26}" width="24" height="10" fill="#59626b"/></g>`,
 wire:(x,y)=>`<path d="M${x-60} ${y}v-40M${x} ${y}v-40M${x+60} ${y}v-40" ${st(3)}/><path d="M${x-60} ${y-12}h120M${x-60} ${y-24}h120M${x-60} ${y-36}h120" stroke="${INK}" stroke-width="1.5" stroke-dasharray="4 3"/>`,
 shopwin:(x,y)=>`<rect x="${x-60}" y="${y-110}" width="120" height="110" fill="#e9e4da" ${st(3)}/><rect x="${x-48}" y="${y-90}" width="96" height="70" fill="#d6ecf2" ${st(2)}/><circle cx="${x-14}" cy="${y-50}" r="6" fill="#fff" ${st(1.5)}/><circle cx="${x+10}" cy="${y-46}" r="5" fill="#fff" ${st(1.5)}/>`,
 pastry:(x,y)=>`<path d="M${x-7} ${y}q7 -10 14 0z" fill="#d9a35a" ${st(1.5)}/>`,
 goal:(x,y)=>`<path d="M${x-50} ${y}v-50h100v50" ${st(4)} fill="none"/><path d="M${x-50} ${y-50}l10 10h80l10 -10M${x-40} ${y-40}v40M${x+40} ${y-40}v40" stroke="${SOFT}" stroke-width="1.5" fill="none"/>`,
 board:(x,y)=>`<rect x="${x-34}" y="${y-8}" width="68" height="8" fill="#5a3a24" ${st(2)}/><rect x="${x-30}" y="${y-12}" width="60" height="4" fill="#c8a165"/><circle cx="${x-10}" cy="${y-16}" r="4" fill="${ACC}"/><circle cx="${x+12}" cy="${y-16}" r="4" fill="#6aa3d6"/>`,
 vines:()=>`<path d="M30 0q10 60 -6 120M90 0q-14 50 8 100M320 0q12 50 -4 110M370 0q-10 70 6 130" stroke="${GRN}" stroke-width="5" fill="none"/>`,
 skywall:(x,y)=>`<rect width="400" height="210" fill="#bcdcf0"/><g fill="#fff" opacity=".9"><ellipse cx="80" cy="60" rx="34" ry="12"/><ellipse cx="300" cy="40" rx="40" ry="13"/></g><rect x="${x-16}" y="${y-60}" width="32" height="50" fill="#16130f"/><path d="M${x-80} 210l60 -30h40" ${st(3)} fill="none"/>`,
 stairs:(x,y)=>{let s='';for(let i=0;i<7;i++)s+=`<path d="M${x+i*18} ${y-i*16}h18v16" ${st(3)} fill="none"/>`;return s},
 shadowhand:(x,y)=>`<path d="M${x} ${y}v-60m0 0l-6 -40m6 40l2 -46m-2 46l10 -42m-10 42l16 -32" stroke="#4a4540" stroke-width="7" stroke-linecap="round" fill="none" opacity=".75"/>`,
 towers:(x,y)=>`<g fill="#a9a29a" ${st(2.5)}><path d="M20 210V60h40v150zM80 210V20h50v190zM260 210V40h44v170zM330 210V80h40v130z"/></g><path d="M0 120h400" stroke="${INK}" stroke-width="3"/>`,
 loco:(x,y)=>PR.train(x,y,{c:'#3d3a36'}),
 clockface:(x,y)=>`<path d="M${x-70} 250V${y-40}h140V250z" fill="#c9b79c" ${st(3)}/><circle cx="${x}" cy="${y-40}" r="34" fill="#fff" ${st(3)}/><path d="M${x} ${y-40}v-24M${x} ${y-40}l16 10" ${st(3)}/>`,
 table:(x,y)=>`<g ${st(3)}><path d="M${x-50} ${y-34}h100M${x-40} ${y-34}v34M${x+40} ${y-34}v34" fill="none"/></g>`,
 boot:(x,y)=>`<path d="M${x-14} ${y}v-14h10v8h16v6z" fill="#3a2e24" ${st(1.5)}/><ellipse cx="${x}" cy="${y+2}" rx="20" ry="4" fill="#fff" ${st(2)}/>`,
 gate:(x,y)=>`<g ${st(3)}><path d="M${x-90} ${y}v-120M${x+90} ${y}v-120M${x-50} ${y}v-120M${x+50} ${y}v-120" stroke-width="8"/><path d="M${x-110} ${y-120}h220l-20 -26h-180z" fill="#5a4a3a"/></g>`,
 screen:(x,y)=>`<rect x="${x-70}" y="${y-110}" width="140" height="80" fill="#fff" ${st(3)}/><path d="M20 200L${x-60} ${y-100}M20 200L${x+60} ${y-40}" stroke="#ffe9a6" stroke-width="2" opacity=".9"/><rect x="6" y="190" width="24" height="20" fill="#59626b" ${st(2)}/>`,
 station:(x,y)=>`<path d="M0 ${y-120}h400" stroke="${INK}" stroke-width="4"/><path d="M40 ${y-120}v120M360 ${y-120}v120" ${st(4)}/><circle cx="200" cy="${y-100}" r="14" fill="#fff" ${st(3)}/>`,
 bowl:(x,y)=>`<path d="M${x-9} ${y}q9 10 18 0z" fill="#fff" ${st(2)}/><path d="M${x-5} ${y-2}q2 -6 4 0q2 -6 4 0" stroke="#d9a35a" stroke-width="1.5" fill="none"/>`,
 hallway:()=>`<path d="M0 0L130 70V200L0 250M400 0L270 70V200L400 250" fill="#c98a5a" opacity=".45"/>`,
 stumps:(x,y)=>`<path d="M${x-6} ${y}v-30M${x} ${y}v-30M${x+6} ${y}v-30M${x-8} ${y-30}h16" ${st(2.5)}/>`,
 bat:(x,y)=>`<path d="M${x} ${y}l20 -20" stroke="#c8a165" stroke-width="6" stroke-linecap="round"/>`,
 mic:(x,y)=>`<path d="M${x} 210V${y}" ${st(3)}/><rect x="${x-6}" y="${y-16}" width="12" height="18" rx="5" fill="#59626b" ${st(2)}/>`,
 top:(x,y)=>`<path d="M${x-8} ${y-10}h16l-8 10z" fill="#9aa3ab" ${st(2)}/><path d="M${x} ${y-10}v-6" ${st(2)}/>`,
 kwai:(x,y)=>`<g ${st(3)} fill="none"><path d="M0 ${y}h400"/>${[...Array(9)].map((_,i)=>`<path d="M${i*50} ${y}l25 30l25 -30"/>`).join('')}</g>`,
 belltower:(x,y)=>`<path d="M${x-26} 250V${y}h52V250z" fill="#d8c4a4" ${st(3)}/><path d="M${x-30} ${y}l30 -30l30 30z" fill="#a8574a" ${st(3)}/><rect x="${x-10}" y="${y+14}" width="20" height="24" fill="#4a3a2a"/>`,
 spiral:(x,y)=>`<path d="M${x} ${y}m-4 0a4 4 0 1 1 8 0a8 8 0 1 1 -16 0a12 12 0 1 1 24 0a16 16 0 1 1 -32 0" stroke="${ACC}" stroke-width="2.5" fill="none"/>`,
 gears:(x,y)=>{const g=(cx,cy,r)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#a9a29a" ${st(3)}/><circle cx="${cx}" cy="${cy}" r="${r/4}" fill="#fff" ${st(2)}/>`+[...Array(8)].map((_,i)=>{const a=i*Math.PI/4;return `<rect x="${cx+Math.cos(a)*r-5}" y="${cy+Math.sin(a)*r-5}" width="10" height="10" fill="#a9a29a" ${st(2)}/>`}).join('');return g(x-50,y,46)+g(x+50,y+30,36)},
 monolith:(x,y)=>`<rect x="${x-14}" y="${y-110}" width="28" height="110" fill="#111"/>`,
 moonground:(x,y)=>`<path d="M0 ${y}H400V250H0Z" fill="#9a9a9a"/>`,
 bathhouse:(x,y)=>`<g ${st(3)}><rect x="${x-80}" y="${y-70}" width="160" height="70" fill="#c74a3a"/><path d="M${x-100} ${y-70}l100 -40l100 40z" fill="#3a5a4a"/><rect x="${x-60}" y="${y-110}" width="120" height="16" fill="#c74a3a"/></g><circle cx="${x-60}" cy="${y-40}" r="8" fill="#ffd36b"/><circle cx="${x+60}" cy="${y-40}" r="8" fill="#ffd36b"/>`,
 tray:(x,y)=>`<path d="M${x-14} ${y}h28" ${st(4)}/>`,
 gnome:(x,y)=>`<g ${st(2)}><path d="M${x-8} ${y}v-14h16v14z" fill="#4a7ac2"/><circle cx="${x}" cy="${y-18}" r="6" fill="#f2d0b0"/><path d="M${x-7} ${y-21}l7 -16l7 16z" fill="#c8322a"/><path d="M${x-5} ${y-15}q5 10 10 0" fill="#fff"/></g>`,
 camera:(x,y)=>`<rect x="${x-10}" y="${y-7}" width="20" height="14" rx="2" fill="#59626b" ${st(2)}/><circle cx="${x}" cy="${y}" r="4" fill="#fff" ${st(1.5)}/>`,
 eiffel:(x,y)=>`<path d="M${x-30} ${y}L${x} ${y-120}L${x+30} ${y}M${x-18} ${y-40}h36M${x-10} ${y-80}h20" ${st(3)} fill="none"/>`,
 camel:(x,y)=>`<path d="M${x-40} ${y-30}q6 -20 20 -16q8 -16 18 0q8 -14 16 0q4 -10 4 -20q2 -12 14 -10l2 8q-8 0 -8 10q0 20 -10 28h-50z" fill="#c9a06a" ${st(2.5)}/><path d="M${x-34} ${y-30}v30M${x-22} ${y-30}v30M${x}${y-30}v30M${x+12} ${y-30}v30" ${st(3)}/>`,
 wheel:(x,y)=>{let s=`<circle cx="${x}" cy="${y}" r="70" fill="none" ${st(3)}/>`;for(let i=0;i<12;i++){const a=i*Math.PI/6;s+=`<path d="M${x} ${y}L${x+Math.cos(a)*70} ${y+Math.sin(a)*70}" stroke="${INK}" stroke-width="1.5"/><rect x="${x+Math.cos(a)*70-8}" y="${y+Math.sin(a)*70}" width="16" height="12" fill="#b8322a" ${st(1.5)}/>`}return s+`<path d="M${x-30} 210L${x} ${y}L${x+30} 210" ${st(4)} fill="none"/>`},
 sled:(x,y)=>`<path d="M${x-30} ${y}h60q8 0 8 -8M${x-24} ${y}v-10h48v10" ${st(3)} fill="#a8743a"/>`,
 fire:(x,y)=>`<path d="M${x-30} ${y}q-6 -30 10 -50q0 20 10 22q-4 -30 14 -44q2 28 14 36q4 -14 12 -18q8 22 -2 54z" fill="${ACC}" ${st(2)}/><path d="M${x-14} ${y}q0 -18 10 -24q4 12 10 8q6 10 2 16z" fill="#ffc94a"/>`,
 scooter:(x,y)=>`<g ${st(3)}><circle cx="${x-30}" cy="${y-8}" r="9" fill="${INK}"/><circle cx="${x+30}" cy="${y-8}" r="9" fill="${INK}"/><path d="M${x-36} ${y-14}q0 -20 30 -20h20l10 -24h8M${x-36} ${y-14}h66" fill="#9fd0c4"/></g>`,
 tiger:(x,y)=>`<g ${st(2.5)}><ellipse cx="${x}" cy="${y-14}" rx="30" ry="12" fill="#e8913a"/><circle cx="${x+30}" cy="${y-22}" r="10" fill="#e8913a"/><path d="M${x-10} ${y-26}v14M${x} ${y-26}v14M${x+10} ${y-26}v12M${x-30} ${y-16}q-14 -10 -16 -24" fill="none"/></g>`,
 desk:(x,y)=>`<path d="M${x-40} ${y}v-40h80v40z" fill="#2c4a8a" ${st(3)}/>`,
 tv:(x,y)=>`<rect x="${x-70}" y="${y-60}" width="140" height="50" fill="#1e2c5a" ${st(3)}/><text x="${x}" y="${y-30}" text-anchor="middle" font-family="Inter,sans-serif" font-size="13" font-weight="800" fill="#ffd36b">A · B · C · D</text>`,
 shadow:()=>'',
 shoes:(x,y)=>`<path d="M${x-16} ${y}q0 -6 8 -6h6v6zM${x+2} ${y}q0 -6 8 -6h6v6z" fill="#d6322a" ${st(1.5)}/>`,
 arch:(x,y)=>`<path d="M${x-40} 210V${y}a40 40 0 0 1 80 0V210" stroke="#a9a29a" stroke-width="10" fill="none"/>`
};
const BG=['sea','beach','grass','snow','night','dusk','space','stars','rain','fog','desert','sun','moon','moonface','earth','sky','hills','roofs','yroad','vines','skywall','towers','hallway','river','moonground'];
function scene(items){let bg='',fg='';
  for(const it of items){if(it[0]==='fig'){fg+=fig(it[1],it[2],it[3],it[4]||{});continue}const f=PR[it[0]];if(!f)continue;const out=f(it[1]||0,it[2]||0,it[3]||{});if(BG.includes(it[0]))bg+=out;else fg+=out}
  return `<svg viewBox="0 0 400 250" role="img" aria-label="Stick figures acting out a film scene"><rect width="400" height="250" fill="#fbf7ef"/>${bg}<path d="M0 210H400" stroke="${SOFT}" stroke-width="2" opacity=".35"/>${fg}</svg>`}
window.CHS={scene,fig,PR};
})();
