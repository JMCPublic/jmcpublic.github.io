/* Film Charades stage (26 Nov 2026): plain stick people miming a film scene with simple props, like real charades.
   Never the film's own characters, costumes or logos: only stick people and everyday objects.
   A scene is a list of items: ['fig', x, y, pose, {flip, s, hat, hold}] or [prop, x, y, {s, flip}]. Stage is 400 × 250, ground at y = 210. */
(()=>{
const INK='#16130f',ACC='#e2552d',SOFT='#b9ad99',SKY='#9cc4d8';
/* stick person: hip at (x,y). Poses are arm/leg angles in degrees (0 = straight down, 90 = sideways out) */
const P={
 stand:{a:[20,20],l:[10,10]},
 wide:{a:[95,95],l:[14,14]},          /* arms straight out (the Titanic pose) */
 up:{a:[160,160],l:[12,12]},          /* both arms up */
 point:{a:[25,95],l:[10,10]},         /* right arm points */
 wave:{a:[20,150],l:[10,10]},
 fist:{a:[20,170],l:[12,12]},         /* one fist to the sky */
 hold:{a:[60,60],l:[10,10]},          /* holding something in front */
 walk:{a:[35,-30],l:[28,-22]},
 run:{a:[70,-60],l:[45,-40]},
 kick:{a:[40,120],l:[5,85]},          /* dancing kick */
 sit:{a:[40,40],l:[90,90],sit:1},
 kneel:{a:[30,80],l:[85,10],kneel:1},
 lie:{lie:1},
 swing:{a:[150,30],l:[30,70]}          /* one arm up on a pole, leg out */
};
const rad=d=>d*Math.PI/180;
function limb(x,y,ang,len,side){const a=rad(ang)*side;return [x+Math.sin(a)*len,y+Math.cos(a)*len]}
function fig(x,y,pose,o={}){const s=o.s||1,f=o.flip?-1:1,p=P[pose]||P.stand,c=o.c||INK,w=4.2*s;
  const L=(x1,y1,x2,y2)=>`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
  let g='';
  if(p.lie){const hx=x-30*s*f;g+=L(hx+10*s*f,y,x+20*s*f,y)+L(x+20*s*f,y,x+42*s*f,y+2*s)+L(x,y,x+8*s*f,y-14*s)+`<circle cx="${hx}" cy="${y-2*s}" r="${9*s}" fill="#fff"/>`;return `<g stroke="${c}" stroke-width="${w}" stroke-linecap="round" fill="none">${g}</g>`}
  const hip=[x,y],neck=[x,y-34*s],head=[x,y-46*s];
  g+=L(hip[0],hip[1],neck[0],neck[1]);
  const sh=[x,y-30*s];
  const a1=limb(sh[0],sh[1],-p.a[0]*f,24*s,1),a2=limb(sh[0],sh[1],p.a[1]*f,24*s,1);
  g+=L(sh[0],sh[1],a1[0],a1[1])+L(sh[0],sh[1],a2[0],a2[1]);
  if(p.sit){g+=L(x,y,x+22*s*f,y)+L(x+22*s*f,y,x+22*s*f,y+20*s)}
  else if(p.kneel){g+=L(x,y,x+4*s*f,y+20*s)+L(x+4*s*f,y+20*s,x+26*s*f,y+20*s)}
  else{const l1=limb(x,y,-p.l[0]*f,30*s,1),l2=limb(x,y,p.l[1]*f,30*s,1);g+=L(x,y,l1[0],l1[1])+L(x,y,l2[0],l2[1])}
  g+=`<circle cx="${head[0]}" cy="${head[1]}" r="${9*s}" fill="#fff"/>`;
  if(o.hat==='top')g+=`<path d="M${head[0]-11*s} ${head[1]-8*s}h${22*s}M${head[0]-7*s} ${head[1]-8*s}v${-13*s}h${14*s}v${13*s}" stroke-width="${w*.9}"/>`;
  if(o.hat==='crown')g+=`<path d="M${head[0]-9*s} ${head[1]-8*s}l${3*s} ${-10*s}l${3*s} ${6*s}l${3*s} ${-8*s}l${3*s} ${8*s}l${3*s} ${-6*s}l${3*s} ${10*s}z" fill="${ACC}" stroke="${ACC}" stroke-width="${1.5*s}"/>`;
  if(o.hat==='hood')g+=`<path d="M${head[0]-13*s} ${head[1]+12*s}Q${head[0]-14*s} ${head[1]-18*s} ${head[0]} ${head[1]-16*s}Q${head[0]+14*s} ${head[1]-18*s} ${head[0]+13*s} ${head[1]+12*s}" fill="${INK}"/><path d="M${x-16*s} ${y+28*s}L${x} ${neck[1]}L${x+16*s} ${y+28*s}z" fill="${INK}"/>`;
  if(o.hat==='helmet')g+=`<path d="M${head[0]-10*s} ${head[1]+2*s}Q${head[0]} ${head[1]-20*s} ${head[0]+10*s} ${head[1]+2*s}" fill="#9aa3ab" stroke="#6b737a"/>`;
  return `<g stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none">${g}</g>`}
/* props: plain everyday things, drawn simply */
const PR={
 sea:(x,y,o)=>`<path d="M0 ${y} Q25 ${y-8} 50 ${y} T100 ${y} T150 ${y} T200 ${y} T250 ${y} T300 ${y} T350 ${y} T400 ${y} V250 H0Z" fill="${SKY}" opacity=".7"/>`,
 bow:(x,y,o)=>`<path d="M${x} ${y} L${x+170} ${y} L${x+230} ${y-60} L${x+150} ${y-60}Z" fill="#6b4f2a" stroke="${INK}" stroke-width="3"/><path d="M${x+150} ${y-60}L${x+230} ${y-60}" stroke="#fff" stroke-width="3"/>`,
 rail:(x,y,o)=>`<path d="M${x} ${y}h${o.w||120}" stroke="${INK}" stroke-width="3"/>`,
 lamppost:(x,y,o)=>`<g stroke="${INK}" stroke-width="5" stroke-linecap="round" fill="none"><path d="M${x} 210V${y}"/><path d="M${x} ${y}q0 -12 16 -12"/></g><path d="M${x+10} ${y-12}h16l-4 12h-8z" fill="#ffd36b" stroke="${INK}" stroke-width="2"/>`,
 rain:(x,y,o)=>{let s='';for(let i=0;i<46;i++){const rx=(i*37)%400,ry=(i*53)%180;s+=`<path d="M${rx} ${ry}l-4 12" stroke="#7aa6c2" stroke-width="2" stroke-linecap="round"/>`}return s},
 umbrella:(x,y,o)=>`<path d="M${x-22} ${y}Q${x} ${y-26} ${x+22} ${y}Z" fill="${ACC}" stroke="${INK}" stroke-width="2.5"/><path d="M${x} ${y}v26" stroke="${INK}" stroke-width="3" fill="none"/>`,
 puddle:(x,y,o)=>`<ellipse cx="${x}" cy="${y}" rx="${o.w||40}" ry="6" fill="${SKY}"/>`,
 chess:(x,y,o)=>{let s=`<rect x="${x-26}" y="${y-8}" width="52" height="8" fill="${INK}"/>`;for(let i=0;i<6;i++)s+=`<rect x="${x-24+i*8}" y="${y-16}" width="8" height="8" fill="${i%2?INK:'#f4efe6'}" stroke="${INK}"/>`;return s+`<path d="M${x-20} ${y}v18M${x+20} ${y}v18" stroke="${INK}" stroke-width="3"/>`},
 piece:(x,y,o)=>`<path d="M${x-4} ${y}h8l-2 -8h-4z" fill="${o.c||INK}"/><circle cx="${x}" cy="${y-10}" r="3" fill="${o.c||INK}"/>`,
 beach:(x,y,o)=>`<path d="M0 ${y}H400V250H0Z" fill="#efe1bf"/>`,
 moon:(x,y,o)=>`<circle cx="${x}" cy="${y}" r="${o.r||60}" fill="#f6efd6" stroke="#e2d6ad" stroke-width="2"/>`,
 bicycle:(x,y,o)=>`<g stroke="${INK}" stroke-width="3" fill="none"><circle cx="${x-18}" cy="${y}" r="13"/><circle cx="${x+18}" cy="${y}" r="13"/><path d="M${x-18} ${y}L${x-4} ${y-18}L${x+10} ${y-18}L${x+18} ${y}M${x-4} ${y-18}L${x+2} ${y}L${x-18} ${y}M${x+10} ${y-18}l3 -8"/></g><rect x="${x+8}" y="${y-36}" width="16" height="10" fill="${ACC}" stroke="${INK}" stroke-width="2"/>`,
 stars:(x,y,o)=>{let s='';for(let i=0;i<14;i++)s+=`<circle cx="${(i*71)%400}" cy="${(i*29)%120+8}" r="1.6" fill="#fff"/>`;return s},
 night:(x,y,o)=>`<rect width="400" height="250" fill="#2a3448"/>`
};
function scene(items){let s='',bg='',fg='';
  for(const it of items){if(it[0]==='fig')fg+=fig(it[1],it[2],it[3],it[4]||{});else{const f=PR[it[0]];if(f){const out=f(it[1],it[2],it[3]||{});if(['sea','beach','night','stars','rain','moon'].includes(it[0]))bg+=out;else fg+=out}}}
  return `<svg viewBox="0 0 400 250" role="img" aria-label="Stick figures acting out a film scene"><rect width="400" height="250" fill="#fbf7ef"/>${bg}<path d="M0 210H400" stroke="${SOFT}" stroke-width="2" opacity=".5"/>${fg}</svg>`}
/* the two hosts: original soft toys */
const HOST={
 bramble:`<svg viewBox="0 0 60 60" aria-hidden="true"><g><path d="M8 40 Q6 14 30 12 Q54 14 52 40 Q50 54 30 54 Q10 54 8 40Z" fill="#8a6a4a"/>${[...Array(9)].map((_,i)=>`<path d="M${12+i*4.5} ${20-Math.sin(i/8*Math.PI)*8} l2 -7 l2 7" fill="#6d5236"/>`).join('')}<ellipse cx="30" cy="40" rx="15" ry="11" fill="#e8d3b4"/><circle cx="24" cy="34" r="3" fill="#16130f"/><circle cx="36" cy="34" r="3" fill="#16130f"/><circle cx="25" cy="33" r="1" fill="#fff"/><circle cx="37" cy="33" r="1" fill="#fff"/><circle cx="30" cy="41" r="2.6" fill="#3a2a1a"/><path d="M26 46 q4 3 8 0" stroke="#3a2a1a" stroke-width="1.5" fill="none" stroke-dasharray="2 1.5"/></g></svg>`,
 lumpkin:`<svg viewBox="0 0 60 60" aria-hidden="true"><ellipse cx="30" cy="36" rx="22" ry="18" fill="#9b8fb8"/><ellipse cx="18" cy="17" rx="5" ry="4" fill="#9b8fb8"/><ellipse cx="42" cy="17" rx="5" ry="4" fill="#9b8fb8"/><ellipse cx="30" cy="43" rx="15" ry="9" fill="#b5aacf"/><circle cx="22" cy="30" r="3" fill="#16130f"/><circle cx="38" cy="30" r="4.5" fill="none" stroke="#c9a227" stroke-width="1.6"/><circle cx="38" cy="30" r="3" fill="#16130f"/><path d="M42 33 q4 6 1 12" stroke="#c9a227" stroke-width="1" fill="none"/><circle cx="25" cy="43" r="1.6" fill="#5c5276"/><circle cx="35" cy="43" r="1.6" fill="#5c5276"/><path d="M20 50 h20" stroke="#5c5276" stroke-width="1.4" stroke-dasharray="2 2"/></svg>`
};
window.CHS={scene,fig,HOST};
})();
