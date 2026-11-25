// Peças comuns aos testes: modos de tela, semente fixa, estados, texto e contagem de pixels.
const path=require('path');
const {devices}=require('@playwright/test');

const RAIZ=path.resolve(__dirname,'../..');
const REF_COMMIT='a1e33ad';
const REF_DIR=path.join(RAIZ,'tests/.ref');
const URL_TRABALHO='file://'+path.join(RAIZ,'index.html');
const URL_REF='file://'+path.join(REF_DIR,'index.html');

// Movimento reduzido: os efeitos ficam parados e o print sai igual a cada vez.
const MODOS={
  'celular-escuro':{...devices['Pixel 5'],colorScheme:'dark',reducedMotion:'reduce'},
  'celular-claro':{...devices['Pixel 5'],colorScheme:'light',reducedMotion:'reduce'},
  'pc-claro':{viewport:{width:1300,height:850},colorScheme:'light',reducedMotion:'reduce'},
  'pc-escuro':{viewport:{width:1300,height:850},colorScheme:'dark',reducedMotion:'reduce'},
};

// Math.random com semente fixa (mulberry32): referência e trabalho sorteiam a mesma sequência.
const SEMENTE=`(()=>{let s=0x9e3779b9;Math.random=()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);
t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}})()`;

const FONTES=['Marcellus','Instrument Sans','IBM Plex Mono'];

// Junta erros de JavaScript e do console.
function vigiaErros(p){const errs=[];
  p.on('pageerror',e=>errs.push(e.message));
  p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
  return errs}

// As fontes vêm do Google; sem elas o print muda. Devolve as que não carregaram.
async function esperaFontes(p){
  await p.evaluate(f=>Promise.all(f.map(x=>document.fonts.load(`16px "${x}"`))),FONTES).catch(()=>{});
  return p.evaluate(f=>f.filter(x=>!document.fonts.check(`16px "${x}"`)),FONTES)}

// Texto visível e oculto, sem script nem style, mais os atributos lidos por leitor de tela.
const texto=p=>p.evaluate(()=>{const c=document.body.cloneNode(true);
  c.querySelectorAll('script,style').forEach(e=>e.remove());
  const at=[...document.querySelectorAll('[aria-label],[title],[alt]')].map(e=>
    ['aria-label','title','alt'].map(a=>e.getAttribute(a)).filter(Boolean).join('|'));
  return document.title+'\n'+c.textContent.replace(/\s+/g,' ').trim()+'\n'+at.join('\n')});

// Percorre os estados da página e devolve os prints, o texto, os erros e a rolagem lateral.
async function estados(browser,url,opcoes){
  const ctx=await browser.newContext(opcoes);await ctx.addInitScript(SEMENTE);
  const p=await ctx.newPage();const errs=vigiaErros(p);
  await p.goto(url);await p.waitForTimeout(6600);
  const semFonte=await esperaFontes(p);
  if(semFonte.length)errs.push('fonte não carregou: '+semFonte.join(', '));
  const prints={};
  const foto=async n=>{await p.evaluate(()=>document.fonts.ready);prints[n]=await p.screenshot()};
  await foto('inicio');
  const alvos=await p.locator('#g-sectors path[aria-label]').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')));
  for(const a of alvos){
    await p.locator(`#g-sectors path[aria-label="${a}"]`).click();await p.waitForTimeout(500);
    await foto('foco-'+a.split(/[ ,:]/)[0]);
    await p.keyboard.press('Escape');await p.waitForTimeout(400)}
  await p.locator('path.core').first().click();await p.waitForTimeout(500);await foto('foco-centro');
  await p.locator('#cols .card.on details.more summary').click();await p.waitForTimeout(300);await foto('foco-mais');
  await p.keyboard.press('Escape');await p.waitForTimeout(400);
  for(const t of ['eixos','fontes']){
    await p.locator(`.tg[data-p="${t}"]`).click();await p.waitForTimeout(400);await foto('painel-'+t);
    await p.locator(`.tg[data-p="${t}"]`).click();await p.waitForTimeout(300)}
  const txt=await texto(p);
  const rolagem=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  await ctx.close();
  return {prints,txt,errs,rolagem}}

// Conta os pixels diferentes entre dois PNG (-1 se o tamanho muda).
async function difPx(p,a,b){
  if(a.equals(b))return 0;
  return p.evaluate(async([a,b])=>{
    const ld=async s=>{const i=new Image();i.src='data:image/png;base64,'+s;await i.decode();return i};
    const [x,y]=await Promise.all([ld(a),ld(b)]);
    if(x.width!==y.width||x.height!==y.height)return -1;
    const px=i=>{const c=new OffscreenCanvas(i.width,i.height).getContext('2d');c.drawImage(i,0,0);
      return new Uint32Array(c.getImageData(0,0,i.width,i.height).data.buffer)};
    const [d1,d2]=[px(x),px(y)];let n=0;for(let k=0;k<d1.length;k++)if(d1[k]!==d2[k])n++;return n},
    [a.toString('base64'),b.toString('base64')])}

module.exports={MODOS,SEMENTE,REF_COMMIT,REF_DIR,URL_TRABALHO,URL_REF,vigiaErros,esperaFontes,texto,estados,difPx};
