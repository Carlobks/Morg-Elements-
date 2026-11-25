# Handoff: auditoria

## Objetivo

Auditar o projeto, guardar os testes e pôr as barreiras do Morg-laws, sem mudar visual, texto nem organização do texto.
Passo em curso: F0 e F1 feitos; próximo, F2 (dividir o arquivo); o dono já deu o «sim» para o F2. Plano: `docs/planos/0001-auditoria.md`.

## Estado verificado (2026-11-25, ramo claude/temperamentos-elementos-qtbc9x)

Referência visual: `a1e33ad` (tela inicial, versão 10 do artifact https://claude.ai/artifact/SGPyWPBjHribgfeVFXvZsJ). `git status -s`: limpo antes deste handoff.

| Caminho | Status | O que é |
|---|---|---|
| `index.html` | limpo | 978 linhas: CSS, HTML e JS. Dados `T`, `SUB`, `REFS`; efeitos `FX`, `SUBFX`, `colFx`; navegação `enter`, `show`, `leave`. |
| `docs/planos/0001-auditoria.md` | limpo | O plano, fases F0 a F7; F1 marcado. |
| `package.json`, `package-lock.json` | novo | Só para testes: `@playwright/test` 1.63.0 exato. `npm test`. |
| `playwright.config.js` | novo | 4 projetos (celular escuro/claro, pc claro/escuro), 4 workers, `globalSetup`. |
| `tests/e2e/apoio.js` | novo | `MODOS`, `SEMENTE`, `REF_COMMIT='a1e33ad'`, `estados`, `texto`, `difPx`, `esperaFontes`. |
| `tests/e2e/referencia.setup.js` | novo | `git archive a1e33ad` → `tests/.ref/` (ignorado). |
| `tests/e2e/referencia.spec.js` | novo | 17 prints por modo + texto + erros + rolagem, contra a referência. |
| `tests/e2e/navegacao.spec.js` | novo | Porte do `nav.js` com asserções, animação ligada. |
| `.gitignore` | novo | `node_modules/`, `test-results/`, `playwright-report/`, `tests/.ref/`. |
| `docs/pesquisa.md` | limpo | Pesquisa e 15 referências. |

Testes: `npm test` → `8 passed (50.8s)`. Quebras de propósito: gesto invertido → só a navegação falha («para baixo»); título 1 px → só a referência falha (550 a 2203 px). Sem hooks (`core.hooksPath` vazio), sem CI (F3). O CI vai precisar de `fetch-depth: 0` para o `git archive a1e33ad`. Playwright 1.63.0 e Chromium pré-instalados no ambiente. Morg-laws clonado (só leitura) em `/home/user/carlobks/morg-laws` (modelos em `modelos/`).

## Decisões e porquê

- Todas as do dono estão no plano, seção «Decisões do dono»: dividir o arquivo; Morg-laws proporcional; Playwright com testes pesados no pre-push e no CI (o CI não substitui o navegador, só muda onde roda); achados visuais só listados; ler em partes pequenas; clone de `a1e33ad` como referência.
- Técnica: comparação de pixels exige quadro determinístico: movimento reduzido emulado e `Math.random` com semente fixa (via `addInitScript`) nas duas páginas.
- Técnica: as fontes vêm do Google; uma rodada do F0 deu diferença falsa por fonte atrasada. O teste espera `document.fonts` antes de cada print e acusa «fonte não carregou». Limite: só o quadro parado é comparado; mudança só no movimento pode passar.
- Regras que continuam: repositório público, nada pessoal; só fontes primárias; nada se altera sem o "sim" do dono.

## Descartado

- Abrir textos clássicos (archive.org etc.): rede bloqueada, dono recusou liberar.
- Print com `fullPage: true`: canvas saem vazios.
- Guardar prints PNG no repositório como referência: desnecessário, o teste renderiza o clone de `a1e33ad` na hora.
- Hooks do Claude e `AGENTS.md`: fora da versão proporcional (dono).

## Próximos passos

1. F2: dividir `index.html` em `index.html`, `estilo.css`, `dados.js`, `efeitos.js`, `navegacao.js` (<500 linhas cada), lendo em partes pequenas; prova: `npm test` verde e dados idênticos por `diff`. «Sim» do dono já dado.
2. F3 e seguintes conforme o plano.
