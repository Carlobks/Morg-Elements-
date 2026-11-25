# Handoff: auditoria

## Objetivo

Auditar o projeto, guardar os testes e pôr as barreiras do Morg-laws, sem mudar visual, texto nem organização do texto.
Passo em curso: F0, F1 e F2 feitos; próximo, F3 (barreiras), que ainda pede o «sim» do dono. Plano: `docs/planos/0001-auditoria.md`.

## Estado verificado (2026-11-25, ramo claude/temperamentos-elementos-qtbc9x)

Referência visual: `a1e33ad` (versão 10 do artifact https://claude.ai/artifact/SGPyWPBjHribgfeVFXvZsJ). Divisão do F2: `55a9635`. O artifact publicado é idêntico ao `index.html` de `a1e33ad` (conferido por `diff`; só uma linha em branco do invólucro); não foi republicado depois da divisão (isso é o F7).

| Caminho | Status | O que é |
|---|---|---|
| `index.html` | limpo | 119 linhas: HTML, `<link>` das fontes e de `estilo.css`, e `<script src>` de `dados.js`, `efeitos.js`, `navegacao.js`, nesta ordem. |
| `estilo.css` | limpo | 247 linhas: o CSS antigo, sem mudança. |
| `dados.js` | limpo | 266 linhas: `EL`, `slug`, `ICO`, `icon`, `r`, `T`, `SUB`, `REFS`, montagem dos cards e da lista de fontes. |
| `efeitos.js` | limpo | 251 linhas: desenho do círculo (`Q`, `play`), revelação (`reduce`, `rvIO`), `FX`, `SUBFX`, `colFx`, `fxList`, `loop`, `kick`. |
| `navegacao.js` | limpo | 95 linhas: `SEQ`, `show`, `enter`, `leave`, `stepBy`, gestos, `openPanel`, `goRef`. |
| `docs/planos/0001-auditoria.md` | alterado (vai neste commit) | F0, F1, F2 marcados; nova seção «Para depois da auditoria». |
| `package.json`, `playwright.config.js`, `tests/e2e/*` | limpo | Os testes do F1 (ver o plano). |

Prova do F2: os cinco arquivos juntados de volta (com `<style>`/`<script>` no lugar) = `index.html` antigo, `diff` vazio; `T`, `SUB`, `REFS` idênticos. `npm test` → `8 passed (58.1s)`. Sem `dados.js`, os testes ficam vermelhos (timeout no clique), então eles leem os arquivos novos.

## Decisões e porquê

- Do dono, no plano («Decisões do dono»): dividir o arquivo; Morg-laws proporcional; Playwright no pre-push e no CI; achados visuais só listados; ler em partes pequenas; clone de `a1e33ad` como referência.
- Do dono (F2, opção A): o desenho do círculo fica em `efeitos.js` e os cards em `dados.js`, para manter a ordem de execução original (os efeitos usam os cards e o `reduce`). A opção B (círculo em `navegacao.js`) mudaria a ordem.
- Do dono: pedidos visuais anotados para depois da auditoria (plano, seção «Para depois da auditoria»): botão de tema, mudar o lugar do «Rever a animação», o texto abaixo do círculo não explica que ele é tocável, e fechar os painéis faz a página subir de forma abrupta. Nada disso se faz antes do fim da auditoria nem sem o «sim».
- Técnica: comparação de pixels exige quadro determinístico (movimento reduzido emulado e `Math.random` com semente via `addInitScript`); o teste espera `document.fonts` antes de cada print. Limite: só o quadro parado é comparado.
- O CI do F3 vai precisar de `fetch-depth: 0` para o `git archive a1e33ad`.
- Regras que continuam: repositório público, nada pessoal; só fontes primárias; nada se altera sem o «sim» do dono.

## Descartado

- Abrir textos clássicos (archive.org etc.): rede bloqueada, dono recusou liberar.
- Print com `fullPage: true`: canvas saem vazios.
- Guardar prints PNG no repositório como referência: desnecessário, o teste renderiza o clone de `a1e33ad` na hora.
- Hooks do Claude e `AGENTS.md`: fora da versão proporcional (dono).
- Republicar o artifact com os cinco arquivos antes do F7: fica para o F7.

## Próximos passos

1. Pedir o «sim» do dono para o F3 (barreiras: `.githooks/`, `scripts/portoes/`, testes Python, `.github/workflows/ci.yml` com `fetch-depth: 0`), modelos em `../carlobks/morg-laws/modelos/` (clone só leitura; reclonar se a sessão for nova).
2. F4 a F7 conforme o plano.
