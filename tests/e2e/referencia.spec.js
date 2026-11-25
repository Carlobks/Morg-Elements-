// A página de trabalho tem de sair igual à de referência: pixel a pixel e texto a texto.
// Só o quadro parado (movimento reduzido) é comparado; a animação rodando não sai igual de uma vez para outra.
const {test,expect}=require('@playwright/test');
const {MODOS,URL_REF,URL_TRABALHO,estados,difPx}=require('./apoio');

test('igual à referência',async({browser,page},info)=>{
  const opcoes=MODOS[info.project.name];
  const [ref,trab]=await Promise.all([estados(browser,URL_REF,opcoes),estados(browser,URL_TRABALHO,opcoes)]);
  expect(ref.errs,'erros na referência').toEqual([]);
  expect(trab.errs,'erros de JavaScript').toEqual([]);
  expect(trab.rolagem,'rolagem lateral').toBe(false);
  expect(Object.keys(trab.prints),'estados percorridos').toEqual(Object.keys(ref.prints));
  const difs=[];
  for(const [nome,png] of Object.entries(ref.prints)){
    const n=await difPx(page,png,trab.prints[nome]);
    if(n){difs.push(`${nome}: ${n<0?'tamanho diferente':n+' px'}`);
      await info.attach(nome+'-referencia.png',{body:png,contentType:'image/png'});
      await info.attach(nome+'-trabalho.png',{body:trab.prints[nome],contentType:'image/png'})}}
  expect(difs,'prints diferentes da referência').toEqual([]);
  expect(trab.txt,'texto diferente da referência').toBe(ref.txt);
});
