// Navegação pelo círculo, com a animação ligada: toque, gestos, voltar, referência, centro e painéis.
const {test,expect}=require('@playwright/test');
const {URL_TRABALHO,vigiaErros}=require('./apoio');

test.use({reducedMotion:'no-preference'});

// O que está na tela: subtipos visíveis (* = aberto), modo foco, texto do leitor de tela e card ativo.
const estado=p=>p.evaluate(()=>({
  subs:[...document.querySelectorAll('#cols .card.on details.sub')].filter(d=>!d.hidden).map(d=>d.id+(d.open?'*':'')).join(','),
  foco:document.body.classList.contains('focus'),
  sr:document.getElementById('fsr').textContent,
  card:document.querySelector('#cols .card.on')?.id}));

// Arrasta na coluna do círculo, de (x,y0) a (x2,y1).
async function arrasta(p,[x,y0],[x2,y1]){
  await p.mouse.move(x,y0);await p.mouse.down();await p.mouse.move(x2,y1,{steps:5});await p.mouse.up();
  await p.waitForTimeout(900)}

test('navegação pelo círculo',async({page:p})=>{
  const errs=vigiaErros(p);
  await p.goto(URL_TRABALHO);await p.waitForTimeout(6800);

  await p.locator('#g-sectors path[aria-label^="Argila"]').click();await p.waitForTimeout(1200);
  expect(await estado(p)).toEqual({subs:'melancolico-argila*',foco:true,sr:'Argila, Melancólico, perto do Fleumático',card:'melancolico'});

  const b=await p.locator('#fcirc').boundingBox();
  const cx=b.x+b.width*.6, cy=b.y+b.height/2;
  await arrasta(p,[cx,cy-40],[cx,cy+30]);
  expect(await estado(p),'para baixo').toMatchObject({subs:'fleumatico-gelo*',card:'fleumatico',sr:'Gelo, Fleumático, perto do Melancólico'});
  await arrasta(p,[cx,cy+40],[cx,cy-60]);
  expect(await estado(p),'para cima').toMatchObject({subs:'melancolico-argila*',card:'melancolico'});
  await arrasta(p,[cx,cy+40],[cx,cy-60]);
  expect(await estado(p),'para cima de novo').toMatchObject({subs:'melancolico-terra*',sr:'Terra, Melancólico, neutro'});

  await p.locator('#cols .card.on details.more summary').click();await p.waitForTimeout(300);
  await p.locator('#cols .card.on sup.r a').first().click();await p.waitForTimeout(1200);
  expect((await estado(p)).foco,'referência sai do foco').toBe(false);
  expect(await p.locator('#p-fontes').isHidden(),'referência abre «As fontes»').toBe(false);

  await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(300);
  await p.locator('path.core').first().click();await p.waitForTimeout(900);
  expect(await estado(p),'centro').toEqual({subs:'colerico-faisca,colerico-fogo,colerico-brasa',foco:true,sr:'Colérico, Fogo',card:'colerico'});

  const b2=await p.locator('#fcirc').boundingBox();
  await arrasta(p,[b2.x+10,b2.y+b2.height/2],[b2.x+110,b2.y+b2.height/2+5]);
  expect((await estado(p)).foco,'para a direita volta').toBe(false);

  await p.locator('.tg[data-p="eixos"]').click();await p.waitForTimeout(600);
  expect(await p.locator('#p-eixos').isHidden(),'«Os eixos» abre').toBe(false);

  expect(errs,'erros de JavaScript').toEqual([]);
  expect(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'rolagem lateral').toBe(false);
});
