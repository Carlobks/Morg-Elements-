// Testes da página no navegador. Rodar com: npm test
const {defineConfig}=require('@playwright/test');
const {MODOS}=require('./tests/e2e/apoio');

module.exports=defineConfig({
  testDir:'tests/e2e',
  globalSetup:require.resolve('./tests/e2e/referencia.setup'),
  timeout:120000,
  fullyParallel:true,
  workers:4,
  reporter:[['list']],
  use:{trace:'off'},
  projects:Object.entries(MODOS).map(([name,use])=>({name,use})),
});
