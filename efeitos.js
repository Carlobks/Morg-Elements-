/* ---------- Circle ---------- */
const NS='http://www.w3.org/2000/svg';
const P = (rad,deg)=>{const a=deg*Math.PI/180;return [rad*Math.sin(a), -rad*Math.cos(a)]};
const R_OUT=206, R_IN=128;
const el = (tag, attrs, parent)=>{const n=document.createElementNS(NS,tag);for(const k in attrs)n.setAttribute(k,attrs[k]);parent&&parent.appendChild(n);return n};
const annulus=(a0,a1,r0,r1)=>{const [x0,y0]=P(r1,a0),[x1,y1]=P(r1,a1),[x2,y2]=P(r0,a1),[x3,y3]=P(r0,a0);
  return `M${x0},${y0}A${r1},${r1} 0 0 1 ${x1},${y1}L${x2},${y2}A${r0},${r0} 0 0 0 ${x3},${y3}Z`};
const wedge=(a0,a1,rr)=>{const [x0,y0]=P(rr,a0),[x1,y1]=P(rr,a1);return `M0,0L${x0},${y0}A${rr},${rr} 0 0 1 ${x1},${y1}Z`};

// Quadrants clockwise from top: colérico 0–90, melancólico 90–180, fleumático 180–270, sanguíneo 270–360
const BREATH = {fogo:2.6, ar:3.8, agua:5.4, terra:7.2};
const Q = [
  {t:T[1], a:0,   order:['Faísca','Fogo','Brasa']},
  {t:T[2], a:90,  order:['Pedra','Terra','Argila']},
  {t:T[3], a:180, order:['Gelo','Água','Vapor']},
  {t:T[0], a:270, order:['Brisa','Ar','Vento']}
];
const gCore=document.getElementById('g-core'), gSec=document.getElementById('g-sectors'),
      gLines=document.getElementById('g-lines'), gLab=document.getElementById('g-labels');

const sectors=[];
Q.forEach((q,qi)=>{
  const c=EL[q.t.el].cor;
  const core = el('path',{d:wedge(q.a,q.a+90,R_IN), class:'grow core',tabindex:'0',role:'button','aria-label':`${q.t.nome}, ${q.t.elNome}`, style:`fill:color-mix(in oklab, ${c} 22%, var(--bg));--d:${2.3+qi*.15}s`},gCore);
  const qg=el('g',{class:'qs',style:`--bt:${BREATH[q.t.el]}s`},gSec);
  el('path',{d:annulus(q.a+1,q.a+89,R_OUT+7,R_OUT+15),class:'halo',style:`fill:${c};--bt:${BREATH[q.t.el]}s`},gCore);
  core.addEventListener('click',()=>enter(qi,null));
  core.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();enter(qi,null)}});
  const [tx,ty]=P(80,q.a+45);
  const lab=el('g',{class:'fade',style:`--d:${4.6+qi*.12}s`},gLab);
  el('text',{x:tx,y:ty-2,'text-anchor':'middle',class:'tname','data-cx':tx,'data-cy':ty+6},lab).textContent=q.t.nome;
  el('text',{x:tx,y:ty+15,'text-anchor':'middle',class:'tel','data-cx':tx,'data-cy':ty+6},lab).textContent=q.t.elNome;

  q.order.forEach((nm,si)=>{
    const s=q.t.subs.find(x=>x.nome===nm);
    const a0=q.a+si*30, a1=a0+30;
    const fill = subCor(s);
    const p=el('path',{d:annulus(a0,a1,R_IN,R_OUT),class:'sector fade',tabindex:'0',role:'button',
      'aria-label':`${s.nome}, ${q.t.nome}${s.viz?' perto do '+s.vizNome:' neutro'}`,
      style:`fill:${fill};--d:${3.0+qi*.25+si*.08}s`},qg);
    sectors.push(p);
    const go=()=>enter(qi,si);
    p.addEventListener('click',go);
    p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}});
    const [lx,ly]=P((R_IN+R_OUT)/2,a0+15);
    el('text',{x:lx,y:ly+4.5,'text-anchor':'middle',class:'sub fade','pointer-events':'none','data-cx':lx,'data-cy':ly,
      style:`fill:var(--on);--d:${4.1+qi*.2+si*.1}s`},gLab).textContent=nm;
  });
});

// Sector dividers (between subtypes)
for(let a=0;a<360;a+=30){ if(a%90===0) continue;
  const [x0,y0]=P(R_IN,a),[x1,y1]=P(R_OUT,a);
  el('line',{x1:x0,y1:y0,x2:x1,y2:y1,class:'div draw',pathLength:1,style:`--d:${3.6+a/360*.6}s;--t:.6s`},gLines);
}
// Rings
el('circle',{r:R_OUT,class:'ring draw',pathLength:1,transform:'rotate(-90)',style:'--d:.1s;--t:1.8s'},gLines);
el('circle',{r:R_IN,class:'ring draw',pathLength:1,transform:'rotate(-90)',style:'--d:1.7s;--t:1.2s;stroke-width:1.1'},gLines);
// Axes
el('line',{x1:0,y1:-238,x2:0,y2:238,class:'axis draw',pathLength:1,style:'--d:1.2s;--t:1.1s'},gLines);
el('line',{x1:-238,y1:0,x2:238,y2:0,class:'axis draw',pathLength:1,style:'--d:1.4s;--t:1.1s'},gLines);
// Axis labels
const ax=[['Expansivos',0,-252,0],['Não expansivos',0,262,0],['Marcados',252,0,90],['Não marcados',-252,0,-90]];
ax.forEach(([t,x,y,rot],i)=>{
  el('text',{x,y,'text-anchor':'middle','dominant-baseline':'middle',class:'axl fade',transform:`rotate(${rot} ${x} ${y})`,'data-cx':x,'data-cy':y,'data-base':rot,style:`--d:${5.2+i*.15}s`},gLab).textContent=t;
});

const svg=document.getElementById('circle');
let aliveT;
const play=()=>{svg.classList.remove('play','alive');void svg.getBoundingClientRect();svg.classList.add('play');
  clearTimeout(aliveT);aliveT=setTimeout(()=>svg.classList.add('alive'),6200)};
play();
document.getElementById('replay').addEventListener('click',()=>{svg.scrollIntoView({behavior:'smooth',block:'center'});play()});

/* ---------- Revelação com o scroll ---------- */
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const rvSel = ['section h2','section .lead','.prose','.tblw','.timeline li','.refs li','.note'];
document.querySelectorAll(rvSel.join(',')).forEach(n=>{
  n.classList.add('rv');
  const sib=[...n.parentElement.children].filter(x=>x.matches(rvSel.join(','))&&x.tagName===n.tagName);
  n.style.setProperty('--rd', Math.min(sib.indexOf(n),6)*0.09+'s');
});
const rvIO = new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rvIO.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.rv').forEach(n=>rvIO.observe(n));

/* ---------- Efeito do elemento no topo de cada card ---------- */
const rnd=(a,b)=>a+Math.random()*(b-a);
const FX = {
  fogo:{
    make:(w,h)=>({x:rnd(0,w),y:rnd(h*.3,h+6),vy:rnd(.35,1.3),r:rnd(.8,2.4),ph:rnd(0,6.3),life:rnd(.3,1)}),
    n:w=>Math.round(w/7),
    step(p,w,h,t){p.y-=p.vy;p.x+=Math.sin(t*.004+p.ph)*.35;p.life-=.007*p.vy;if(p.life<=0||p.y<-4)Object.assign(p,this.make(w,h),{y:h+4,life:1})},
    bg(ctx,w,h,col){const g=ctx.createLinearGradient(0,h,0,h*.2);g.addColorStop(0,col);g.addColorStop(1,'transparent');ctx.globalAlpha=.22;ctx.fillStyle=g;ctx.fillRect(0,0,w,h)},
    draw(ctx,p,col){ctx.globalAlpha=Math.max(0,p.life)*.9;ctx.fillStyle=col;ctx.beginPath();ctx.arc(p.x,p.y,p.r*(.5+p.life*.6),0,6.3);ctx.fill()}
  },
  agua:{
    n:()=>0,
    bg(ctx,w,h,col,t){for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(0,h);
      for(let x=0;x<=w+4;x+=4)ctx.lineTo(x,h*.42+i*9+Math.sin(x*(.018-i*.004)+t*(.0011+i*.0004)+i*1.7)*(5-i));
      ctx.lineTo(w,h);ctx.closePath();ctx.globalAlpha=.13+i*.05;ctx.fillStyle=col;ctx.fill()}}
  },
  terra:{
    make:(w,h)=>({x:rnd(0,w),y:rnd(-h,h*.7),vy:rnd(.08,.3),s:rnd(1,2.2)}),
    n:w=>Math.round(w/14),
    step(p,w,h){p.y+=p.vy;if(p.y>h*.62)Object.assign(p,this.make(w,h),{y:-4})},
    bg(ctx,w,h,col,t){for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(0,h);
      for(let x=0;x<=w+8;x+=8)ctx.lineTo(x,h*.62+i*8+Math.sin(x*.012+i*2+t*.00012)*3);
      ctx.lineTo(w,h);ctx.closePath();ctx.globalAlpha=.16+i*.09;ctx.fillStyle=col;ctx.fill()}},
    draw(ctx,p,col){ctx.globalAlpha=.65;ctx.fillStyle=col;ctx.fillRect(p.x,p.y,p.s,p.s)}
  },
  ar:{
    make:(w,h)=>({x:rnd(-w*.5,w),y:rnd(8,h-8),len:rnd(30,90),v:rnd(.6,1.8),ph:rnd(0,6.3)}),
    n:w=>Math.round(w/28),
    step(p,w,h){p.x+=p.v;if(p.x-p.len>w)Object.assign(p,this.make(w,h),{x:-rnd(0,40)})},
    draw(ctx,p,col,t){ctx.globalAlpha=.55;ctx.strokeStyle=col;ctx.lineWidth=1.4;ctx.lineCap='round';ctx.beginPath();
      for(let i=0;i<=10;i++){const x=p.x-p.len+p.len*i/10,y=p.y+Math.sin(x*.025+p.ph+t*.001)*4;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}
      const g=ctx.createLinearGradient(p.x-p.len,0,p.x,0);g.addColorStop(0,'transparent');g.addColorStop(1,col);ctx.strokeStyle=g;ctx.stroke()}
  }
};
/* Mesmo efeito, mais fraco, na coluna do círculo (só com um card aberto) */
/* Mesmo efeito, mais fraco, na coluna do círculo (só com um card aberto).
   Cada subtipo muda alguns parâmetros da base, puxados pelo vizinho; a troca é suave. */
const SUBFX={
  fogo:{faisca:{spd:1.8,life:4.5,jit:3,size:.6,dens:1,glow:0},  base:{spd:1,life:1,jit:1,size:1,dens:1,glow:0},  brasa:{spd:.3,life:2.5,jit:.3,size:1.3,dens:.35,glow:1}},
  agua:{vapor:{spd:2,grow:1,freeze:0},                           base:{spd:1,grow:0,freeze:0},                    gelo:{spd:.05,grow:0,freeze:1}},
  terra:{argila:{grav:.55,soft:1,hard:0},                        base:{grav:1,soft:0,hard:0},                     pedra:{grav:1.3,soft:0,hard:1}},
  ar:{brisa:{spd:.5,dens:.4,len:1.6,amp:1.8,frq:.55,rise:0},     base:{spd:1,dens:.62,len:1,amp:1,frq:1,rise:0},  vento:{spd:2.3,dens:1,len:1.3,amp:.2,frq:1,rise:.3}}
};
const subKey=n=>n?n.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase():'base';
const colFx={cv:document.getElementById('colfx'),ps:[],w:0,h:0,el:null,card:null,col:'#888',raf:0,sw:0,clk:0,v:{},vt:{},
  BAND:90,
  kind(){return FX[this.el]},
  count(){const {w,h}=this;return this.el==='fogo'?Math.min(160,Math.round(w*h/480)):this.el==='ar'?Math.min(64,Math.round(w*h/1200)):
    this.el==='agua'?Math.min(70,Math.round(w*h/3200)):Math.min(40,Math.round(w*h/9000))},
  // água: bolhas que sobem devagar; terra: grãos pesados que caem, param e viram camadas que racham ao secar
  bolha(y){const {w,h}=this;return {x:rnd(0,w),y:y??rnd(0,h),vy:rnd(.18,.55),r:rnd(1.4,4.2),ph:rnd(0,6.3)}},
  grao(y){const {w,h}=this;return {x:rnd(0,w),y:y??rnd(-h*.6,h*.6),vy:rnd(.4,1.4),s:rnd(1.8,3.4)}},
  racha(){const {w}=this,n=Math.max(3,Math.round(w/34)),V=[];        // rede de rachaduras, como barro secando
    for(let i=0;i<n;i++){const x=(i+rnd(.25,.75))*w/n;let y=0,o=0;const pts=[[x,0,0]];while(y<1){y=Math.min(1,y+rnd(.18,.32));o+=rnd(-6,6);pts.push([x,y,o])}V.push({pts,k:rnd(.7,1)})}
    const H=[];for(let i=0;i<n-1;i++)for(let m=0,M=Math.random()<.5?1:2;m<M;m++){const y=rnd(.15,.9);
      H.push({i,y,y2:y+rnd(-.12,.12),mx:rnd(-4,4),my:rnd(-.06,.06),th:rnd(.35,.9)})}
    return {V,H}},
  cx(pt,j){return pt[0]+pt[2]*j},                                     // j: quanto do zigue-zague fica (a pedra é mais reta)
  xAt(c,y,j){const P=c.pts;for(let k=1;k<P.length;k++)if(P[k][1]>=y){const a=P[k-1],b=P[k],f=(y-a[1])/((b[1]-a[1])||1);return this.cx(a,j)+(this.cx(b,j)-this.cx(a,j))*f}return this.cx(P[P.length-1],j)},
  terraIni(){const B=this.BAND,base=B*.45,hb=document.getElementById('hint').getBoundingClientRect(),cb=this.cv.getBoundingClientRect(),
    livre=cb.bottom-hb.bottom-10;   // as camadas param abaixo da dica
    this.ter={base,max:Math.max(base+24,Math.min(this.h*.32,B*2,livre)),sed:base,fase:0,t0:0,cr:this.racha(),fade:1}},
  make(){return this.el==='agua'?this.bolha():this.el==='terra'?this.grao():this.kind().make(this.w,this.h)},
  size(){const d=Math.min(devicePixelRatio||1,2),c=this.cv;this.w=c.clientWidth;this.h=c.clientHeight;
    c.width=Math.round(this.w*d);c.height=Math.round(this.h*d);this.ctx=c.getContext('2d');this.ctx.setTransform(d,0,0,d,0,0);
    this.ps=this.el&&this.w?Array.from({length:this.count()},()=>this.make()):[];if(this.el==='terra')this.terraIni()},
  recol(){if(this.card)this.col=getComputedStyle(this.card.querySelector('.el')).color;this.bgc=getComputedStyle(document.body).backgroundColor},
  ease(){for(const k in this.vt)this.v[k]+=(this.vt[k]-this.v[k])*.05},
  active(i){return i<this.ps.length*(this.v.dens??1)},
  step(p,i){const k=this.kind(),{w,h}=this,v=this.v,t=this.clk;
    if(this.el==='fogo'){p.y-=p.vy*v.spd;p.x+=Math.sin(t*.004+p.ph)*.35*v.jit;p.life-=.007*p.vy*v.life*Math.min(1,90/h);
      if(p.life<=0||p.y<-4)Object.assign(p,k.make(w,h),{y:h+4,life:1})}
    else if(this.el==='agua'){p.y-=p.vy*v.spd;p.x+=Math.sin(t*.0016+p.ph)*.25*v.spd;if(p.y<-p.r*3-2)Object.assign(p,this.bolha(h-this.BAND*.4))}
    else if(this.el==='terra'){const T=this.ter;p.vy=Math.min(p.vy+.07*v.grav,5*v.grav);p.y+=p.vy;
      if(p.y>=h-T.sed){if(T.fase===0)T.sed=Math.min(T.max,T.sed+(T.max-T.base)/(this.ps.length*9));Object.assign(p,this.grao(-4-rnd(0,h*.5)))}}
    else if(this.el==='ar'){p.x+=p.v*v.spd;p.y-=v.rise;
      if(p.x-p.len*v.len>w||p.y<-10)Object.assign(p,k.make(w,h),{x:-rnd(0,40)})}},
  sedimento(t){const {ctx,w,h,col}=this,T=this.ter,N=6,v=this.v;
    if(T.fase===0&&T.sed>=T.max){T.fase=1;T.t0=t}
    if(T.fase===1){const k=(t-T.t0-2500)/3000;            // repousa, depois compacta e recomeça
      if(k>0){const e=Math.min(1,k);T.sed=T.max-(T.max-T.base)*e*e*(3-2*e);T.fade=1-e;
        if(k>=1){T.fase=0;T.fade=1;T.cr=this.racha()}}}
    for(let i=0;i<N;i++){const y0=h-T.sed+T.sed*i/N,am=(i?1:1.8)*(1+v.soft*2.5);ctx.beginPath();ctx.moveTo(0,h);   // a argila ondula, mole
      for(let x=0;x<=w+6;x+=6)ctx.lineTo(x,y0+Math.sin(x*.035+i*1.7+t*.0005*v.soft)*am);
      ctx.lineTo(w,h);ctx.closePath();ctx.globalAlpha=(i?.11:.2)+.08*v.hard;ctx.fillStyle=col;ctx.fill()}
    const prog=Math.min(1,Math.max(0,((T.sed-T.base)/(T.max-T.base)-.2)/.65)),top=h-T.sed*.6,zh=h-top;   // camadas antigas racham ao secar
    const rgb=(this.bgc.match(/\d+/g)||[0,0,0]).map(Number),claro=rgb[0]*.3+rgb[1]*.59+rgb[2]*.11>140;
    const A=(claro?.75:.9)*(T.fase===1?T.fade:1)*(1-v.soft),P=T.fase===1?1:prog,Y=y=>top+Math.min(1,y)*zh,j=1-.85*v.hard;  // úmida não racha
    if(A<=.01)return;
    ctx.strokeStyle=claro?col:this.bgc;ctx.lineWidth=(claro?1:1.3)+.6*v.hard;ctx.lineJoin=v.hard>.5?'miter':'round';ctx.lineCap='round';
    ctx.globalAlpha=A;ctx.beginPath();
    T.cr.V.forEach(c=>{const L=P*c.k*(c.pts.length-1);
      c.pts.forEach((pt,k)=>{if(k>L+1)return;if(!k){ctx.moveTo(this.cx(pt,j),Y(pt[1]));return}const f=Math.min(1,L-k+1),q=c.pts[k-1],qx=this.cx(q,j);
        ctx.lineTo(qx+(this.cx(pt,j)-qx)*f,Y(q[1]+(pt[1]-q[1])*f))})});
    ctx.stroke();
    T.cr.H.forEach(c=>{const f=Math.min(1,(P-c.th)/.15);if(f<=0)return;ctx.globalAlpha=A*f;ctx.beginPath();
      const ax=this.xAt(T.cr.V[c.i],c.y,j),bx=this.xAt(T.cr.V[c.i+1],c.y2,j),mx=(ax+bx)/2+c.mx*j,my=(c.y+c.y2)/2+c.my*j,g=f*2;
      ctx.moveTo(ax,Y(c.y));
      if(g<=1)ctx.lineTo(ax+(mx-ax)*g,Y(c.y+(my-c.y)*g));
      else{ctx.lineTo(mx,Y(my));ctx.lineTo(mx+(bx-mx)*(g-1),Y(my+(c.y2-my)*(g-1)))}
      ctx.stroke()})},
  dot(p,col){const {ctx,h}=this,v=this.v;
    if(this.el==='agua'){const g=1+v.grow*1.6*Math.max(0,1-p.y/h),f=Math.min(1,p.y/(h*(.25+.35*v.grow)));   // o vapor cresce e se desfaz antes do topo
      ctx.globalAlpha=.75*Math.max(0,f);ctx.strokeStyle=col;ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(p.x,p.y,p.r*g,0,6.3);ctx.stroke()}
    else{const s=p.s*(1+.7*v.hard);ctx.globalAlpha=Math.max(0,Math.min(1,(p.y+4)/40))*.95;ctx.fillStyle=col;ctx.fillRect(p.x,p.y,s,s)}},
  ondas(){const {ctx,w,col}=this,B=this.BAND,t=this.clk,a=1-.85*this.v.freeze;   // o gelo deixa as ondas quase retas e paradas
    ctx.save();ctx.translate(0,this.h-B);
    for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(0,B);
      for(let x=0;x<=w+4;x+=4)ctx.lineTo(x,B*.42+i*9+Math.sin(x*(.018-i*.004)+t*(.0011+i*.0004)+i*1.7)*(5-i)*a);
      ctx.lineTo(w,B);ctx.closePath();ctx.globalAlpha=.13+i*.05+.08*this.v.freeze;ctx.fillStyle=col;ctx.fill()}
    ctx.restore()},
  brasa(){const {ctx,w,h,col}=this,g=this.v.glow;if(g<.01)return;          // brilho no pé que pulsa devagar, como carvão
    const gr=ctx.createLinearGradient(0,h,0,h-150);gr.addColorStop(0,col);gr.addColorStop(1,'transparent');
    ctx.globalAlpha=g*(.32+.16*Math.sin(this.clk*.0018));ctx.fillStyle=gr;ctx.fillRect(0,h-150,w,150)},
  fogo(p,col){const {ctx}=this;ctx.globalAlpha=Math.max(0,p.life)*.9;ctx.fillStyle=col;ctx.beginPath();ctx.arc(p.x,p.y,p.r*(.5+p.life*.6)*this.v.size,0,6.3);ctx.fill()},
  ar(p,col){const {ctx}=this,v=this.v,t=this.clk,L=p.len*v.len;ctx.globalAlpha=.55;ctx.lineWidth=1.4;ctx.lineCap='round';ctx.beginPath();
    for(let i=0;i<=10;i++){const x=p.x-L+L*i/10,y=p.y+Math.sin(x*.025*v.frq+p.ph+t*.001)*4*v.amp;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}
    const g=ctx.createLinearGradient(p.x-L,0,p.x,0);g.addColorStop(0,'transparent');g.addColorStop(1,col);ctx.strokeStyle=g;ctx.stroke()},
  frame(t){const {ctx,w,h,col}=this,k=this.kind();if(!ctx||!k)return;ctx.clearRect(0,0,w,h);
    this.ease();this.clk+=16.7*(this.v.spd??1);
    const each=fn=>this.ps.forEach((p,i)=>{if(!this.active(i))return;this.step(p,i);fn(p)});
    if(this.el==='terra'){each(p=>this.dot(p,col));this.sedimento(t)}
    else if(this.el==='agua'){each(p=>this.dot(p,col));this.ondas()}
    else if(this.el==='fogo'){k.bg(ctx,w,h,col);this.brasa();each(p=>this.fogo(p,col))}
    else each(p=>this.ar(p,col));
    ctx.globalAlpha=1},
  loop(t){this.raf=0;if(reduce.matches||!document.body.classList.contains('focus'))return;
    if(this.n++%45===0)this.recol();this.frame(t);this.raf=requestAnimationFrame(x=>this.loop(x))},
  n:0,
  run(){if(!this.raf&&!reduce.matches&&this.el)this.raf=requestAnimationFrame(t=>this.loop(t))},
  still(){if(!this.el)return;this.recol();Object.assign(this.v,this.vt);
    for(let i=0;i<240;i++){this.clk+=16.7*(this.v.spd??1);this.ps.forEach((p,j)=>this.step(p,j))}this.frame(4000)},
  target(el,sub){const T=SUBFX[el];return {...(T[subKey(sub)]||T.base)}},
  set(card,sub){const el=card.querySelector('canvas.fx').dataset.el;
    if(el===this.el&&this.cv.classList.contains('on')){this.card=card;this.vt=this.target(el,sub);if(reduce.matches)this.still();return}
    clearTimeout(this.sw);const go=()=>{this.el=el;this.card=card;this.vt=this.target(el,sub);this.v={...this.vt};this.recol();this.size();
      this.cv.classList.toggle('terra',el==='terra');this.cv.classList.add('on');reduce.matches?this.still():this.run()};
    if(this.el&&this.cv.classList.contains('on')){this.cv.classList.remove('on');this.sw=setTimeout(go,200)}else go()},
  off(){clearTimeout(this.sw);this.cv.classList.remove('on');this.el=null;cancelAnimationFrame(this.raf);this.raf=0}
};
const fxList=[...document.querySelectorAll('canvas.fx')].map(cv=>{
  const card=cv.closest('.card'), kind=FX[cv.dataset.el];
  return {cv,ctx:cv.getContext('2d'),kind,card,ps:[],w:0,h:0,col:'#888',vis:false};
});
const fxSize=f=>{const d=Math.min(devicePixelRatio||1,2),r={width:f.cv.clientWidth,height:f.cv.clientHeight};f.w=r.width;f.h=r.height;
  f.cv.width=Math.round(r.width*d);f.cv.height=Math.round(r.height*d);f.ctx.setTransform(d,0,0,d,0,0);
  f.ps=Array.from({length:f.kind.n(f.w)},()=>f.kind.make(f.w,f.h))};
const fxCol=f=>{f.col=getComputedStyle(f.card.querySelector('.el')).color};
const fxFrame=(f,t)=>{const {ctx,kind,w,h,col}=f;ctx.clearRect(0,0,w,h);
  kind.bg&&kind.bg(ctx,w,h,col,t);
  f.ps.forEach(p=>{kind.step&&kind.step(p,w,h,t);kind.draw&&kind.draw(ctx,p,col,t)});ctx.globalAlpha=1};
const fxStill=()=>fxList.forEach(f=>{fxCol(f);for(let i=0;i<240;i++)f.ps.forEach(p=>f.kind.step&&f.kind.step(p,f.w,f.h,i*16));fxFrame(f,4000)});
let raf=0,frame=0;
const loop=t=>{raf=0;if(reduce.matches)return;
  if(frame++%45===0)fxList.forEach(fxCol);
  let any=false;fxList.forEach(f=>{if(f.vis){any=true;fxFrame(f,t)}});
  if(any)raf=requestAnimationFrame(loop)};
const kick=()=>{if(!raf&&!reduce.matches)raf=requestAnimationFrame(loop)};
const fxIO=new IntersectionObserver(es=>{es.forEach(e=>{const f=fxList.find(x=>x.cv===e.target);f.vis=e.isIntersecting});kick()});
const ro=new ResizeObserver(()=>{fxList.forEach(fxSize);colFx.size();reduce.matches?(fxStill(),colFx.still()):kick()});
fxList.forEach(f=>{fxSize(f);fxCol(f);fxIO.observe(f.cv);ro.observe(f.cv)});
ro.observe(colFx.cv);
if(reduce.matches)fxStill();
reduce.addEventListener('change',()=>{if(reduce.matches){fxStill();colFx.still()}else{kick();colFx.run()}});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{fxList.forEach(fxCol);colFx.recol();if(reduce.matches){fxStill();colFx.still()}});

