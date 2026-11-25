/* ---------- Navegação: o círculo vai para o canto e o card aparece ao lado ---------- */
history.scrollRestoration='manual';
const body=document.body, stage=document.querySelector('.stage'), fcirc=document.getElementById('fcirc'),
      focusEl=document.getElementById('focus'), fpanel=document.getElementById('fpanel'),
      rotG=document.getElementById('rot'), selPath=document.getElementById('selpath'), fsr=document.getElementById('fsr');
const labs=[...gLab.querySelectorAll('text')];
const SEQ=[]; Q.forEach((q,qi)=>q.order.forEach((nm,si)=>SEQ.push([qi,si])));
const touchy=matchMedia('(pointer: coarse)').matches;
document.getElementById('hint').innerHTML = touchy
  ? '<span>↑ ↓ troca</span><span>→ volta</span>'
  : '<span>Role ou ↑ ↓ troca</span><span>Esc volta</span>';

let theta=0, tAnim=0, cur=null, lastFocus=null;
const setTheta=t=>{theta=t; rotG.setAttribute('transform',`rotate(${t})`);
  labs.forEach(n=>n.setAttribute('transform',`rotate(${(+n.dataset.base||0)-t} ${n.dataset.cx} ${n.dataset.cy})`))};
const turnTo=target=>{const d=((target-theta)%360+540)%360-180, from=theta;
  cancelAnimationFrame(tAnim);
  if(reduce.matches||Math.abs(d)<.01){setTheta(from+d);return}
  const t0=performance.now(), dur=Math.min(750,280+Math.abs(d)*3.5);
  const stepA=now=>{const k=Math.min(1,(now-t0)/dur), e=1-Math.pow(1-k,3); setTheta(from+d*e); if(k<1) tAnim=requestAnimationFrame(stepA)};
  tAnim=requestAnimationFrame(stepA)};
const angleOf=(qi,si)=>Q[qi].a+(si==null?45:si*30+15);
const panelTo=(y,smooth)=>fpanel.scrollTo({top:Math.max(0,y),behavior:smooth&&!reduce.matches?'smooth':'auto'});

function show(qi,si){
  const q=Q[qi], changed=!cur||cur.qi!==qi; cur={qi,si};
  turnTo(90-angleOf(qi,si));                          // a seta fica à direita (90°)
  selPath.setAttribute('d', si==null ? wedge(q.a,q.a+90,R_OUT) : annulus(q.a+si*30,q.a+si*30+30,R_IN,R_OUT));
  sectors.forEach((p,i)=>p.classList.toggle('dim', si==null ? SEQ[i][0]!==qi : !(SEQ[i][0]===qi&&SEQ[i][1]===si)));
  document.querySelectorAll('#cols .card').forEach(c=>c.classList.toggle('on',c.id===q.t.id));
  const card=document.getElementById(q.t.id);
  colFx.set(card, si==null?null:q.order[si]);
  if(changed){ card.querySelector('details.more').open=false; panelTo(0,false) } else panelTo(0,true);
  const pick = si==null ? null : subId(q.t, q.t.subs.find(x=>x.nome===q.order[si]));
  card.classList.toggle('one', si!=null);
  card.querySelectorAll('details.sub').forEach(d=>{const me=d.id===pick; d.hidden=si!=null&&!me; d.open=me; d.classList.toggle('sel',me)});
  if(si==null){ fsr.textContent=`${q.t.nome}, ${q.t.elNome}`; return }
  const s=q.t.subs.find(x=>x.nome===q.order[si]);
  fsr.textContent=`${s.nome}, ${q.t.nome}${s.viz?', perto do '+s.vizNome:', neutro'}`;
}
const stepBy=n=>{if(!cur)return; let i=SEQ.findIndex(([a,b])=>a===cur.qi&&b===(cur.si??1)); i=((i+n)%12+12)%12; show(...SEQ[i])};

const flip=fn=>{const a=svg.getBoundingClientRect(); fn(); const b=svg.getBoundingClientRect();
  if(reduce.matches||!b.width) return;
  svg.animate([{transformOrigin:'0 0',transform:`translate(${a.left-b.left}px,${a.top-b.top}px) scale(${a.width/b.width})`},
               {transformOrigin:'0 0',transform:'none'}],{duration:650,easing:'cubic-bezier(.2,.8,.2,1)'})};
function enter(qi,si){
  if(!body.classList.contains('focus')){
    lastFocus=document.activeElement;
    svg.classList.remove('play'); clearTimeout(aliveT); svg.classList.add('alive');   // a entrada não se repete
    flip(()=>{focusEl.hidden=false; fcirc.insertBefore(svg,document.getElementById('hint')); body.classList.add('focus')});
    history.pushState({focus:1},'');
    document.getElementById('back').focus({preventScroll:true});
  }
  show(qi,si);
}
function leave(fromPop){
  if(!body.classList.contains('focus')) return;
  flip(()=>{stage.insertBefore(svg,stage.firstChild); body.classList.remove('focus'); focusEl.hidden=true});
  colFx.off(); cur=null; selPath.setAttribute('d',''); sectors.forEach(p=>p.classList.remove('dim')); turnTo(0);
  if(!fromPop && history.state && history.state.focus) history.back();
  if(lastFocus && lastFocus.focus) lastFocus.focus({preventScroll:true});
}
addEventListener('popstate',()=>leave(true));
document.getElementById('back').addEventListener('click',()=>leave());
document.addEventListener('keydown',e=>{
  if(!body.classList.contains('focus')) return;
  if(e.key==='Escape'){e.preventDefault();leave();return}
  if((e.key==='ArrowDown'||e.key==='ArrowUp') && !fpanel.contains(document.activeElement)){e.preventDefault();stepBy(e.key==='ArrowDown'?1:-1)}
});
// Gestos no círculo: para baixo = sentido horário, para cima = anti-horário, para a direita = voltar.
let g0=null, eatClick=false;
fcirc.addEventListener('pointerdown',e=>{g0={x:e.clientX,y:e.clientY}});
addEventListener('pointercancel',()=>{g0=null});
addEventListener('pointerup',e=>{if(!g0)return; const dx=e.clientX-g0.x, dy=e.clientY-g0.y; g0=null;
  if(dx>60 && dx>Math.abs(dy)*1.3){eatClick=true; leave()}
  else if(Math.abs(dy)>30 && Math.abs(dy)>Math.abs(dx)){eatClick=true; stepBy(Math.sign(dy)*Math.max(1,Math.min(5,Math.round(Math.abs(dy)/110))))}
  setTimeout(()=>{eatClick=false},0)});
fcirc.addEventListener('click',e=>{if(eatClick){e.stopPropagation();e.preventDefault()}},true);
let wAcc=0, wT=0;
fcirc.addEventListener('wheel',e=>{e.preventDefault(); wAcc+=e.deltaY; const now=performance.now();
  if(Math.abs(wAcc)>40 && now-wT>300){stepBy(wAcc>0?1:-1); wAcc=0; wT=now}},{passive:false});

/* ---------- Toggles: eixos e fontes ---------- */
const openPanel=(id,on)=>document.querySelectorAll('.tg').forEach(b=>{const me=on&&b.dataset.p===id;
  b.setAttribute('aria-expanded',me); document.getElementById('p-'+b.dataset.p).hidden=!me});
document.querySelectorAll('.tg').forEach(b=>b.addEventListener('click',()=>openPanel(b.dataset.p,b.getAttribute('aria-expanded')!=='true')));
// Um número de referência leva às fontes, de qualquer lugar da página.
const goRef=id=>{const t=document.getElementById(id); if(!t) return;
  openPanel('fontes',true); t.classList.add('in');
  requestAnimationFrame(()=>{t.scrollIntoView({block:'center',behavior:reduce.matches?'auto':'smooth'});
    t.classList.add('hit'); setTimeout(()=>t.classList.remove('hit'),2600)})};
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#ref"]'); if(!a) return;
  e.preventDefault(); leave(); goRef(a.getAttribute('href').slice(1))});
if(/^#ref\d+$/.test(location.hash)) goRef(location.hash.slice(1));
