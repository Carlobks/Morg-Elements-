# Handoff: auditoria

## Objetivo

Auditar o projeto, guardar os testes e pôr as barreiras do Morg-laws, sem mudar visual, texto nem organização do texto.
Passo em curso: plano aprovado, nada executado. Plano: `docs/planos/0001-auditoria.md`.

## Estado verificado (2026-11-25, ramo claude/temperamentos-elementos-qtbc9x)

Referência visual: `a1e33ad` (tela inicial, versão 10 do artifact https://claude.ai/artifact/SGPyWPBjHribgfeVFXvZsJ). `git status -s`: limpo antes deste handoff.

| Caminho | Status | O que é |
|---|---|---|
| `index.html` | limpo | 978 linhas: CSS, HTML e JS. Dados `T`, `SUB`, `REFS`; efeitos `FX`, `SUBFX`, `colFx`; navegação `enter`, `show`, `leave`. |
| `docs/planos/0001-auditoria.md` | novo | O plano, fases F0 a F7. |
| `docs/pesquisa.md` | limpo | Pesquisa e 15 referências. |

Sem testes no repositório, sem hooks (`core.hooksPath` vazio), sem CI. O teste de navegação existe só no scratchpad (`nav.js`, não versionado; ver F1). Playwright 1.63.0 e Chromium pré-instalados no ambiente. Morg-laws clonado (só leitura) em `/home/user/carlobks/morg-laws` (modelos em `modelos/`).

## Decisões e porquê

- Todas as do dono estão no plano, seção «Decisões do dono»: dividir o arquivo; Morg-laws proporcional; Playwright com testes pesados no pre-push e no CI (o CI não substitui o navegador, só muda onde roda); achados visuais só listados; ler em partes pequenas; clone de `a1e33ad` como referência.
- Técnica: comparação de pixels exige quadro determinístico: movimento reduzido emulado e `Math.random` com semente fixa (via `addInitScript`) nas duas páginas.
- Regras que continuam: repositório público, nada pessoal; só fontes primárias; nada se altera sem o "sim" do dono.

## Descartado

- Abrir textos clássicos (archive.org etc.): rede bloqueada, dono recusou liberar.
- Print com `fullPage: true`: canvas saem vazios.
- Guardar prints PNG no repositório como referência: desnecessário, o teste renderiza o clone de `a1e33ad` na hora.
- Hooks do Claude e `AGENTS.md`: fora da versão proporcional (dono).

## Próximos passos

1. F0: `git worktree add <scratchpad>/ref a1e33ad`; script Playwright que compara referência e trabalho (prints com movimento reduzido e semente fixa, texto da página e dos cards); provar 0 diferenças e que uma mudança de 1 px é pega. Mostrar ao dono antes do F1.
2. F1 e seguintes conforme o plano, uma fase por vez com o "sim" do dono.
