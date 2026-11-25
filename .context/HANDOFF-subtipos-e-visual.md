# Handoff: subtipos e visual

## Objetivo

Polir a página dos quatro temperamentos (`index.html`), publicada como artifact em https://claude.ai/artifact/SGPyWPBjHribgfeVFXvZsJ (republicar sempre pelo mesmo `file_path`).
Passo em curso: polimento feito, publicado (versão 6) e no remoto; aguardando o retorno do dono.

## Estado verificado (2026-11-25, ramo claude/temperamentos-elementos-qtbc9x)

Commits: `4094219` (fase 2, subtipos), `f2566d4` (fase 3, visual), `3592094` (humanizer), `1141ae7` (navegação pelo círculo), `85284bf` (ajustes do celular), `0b716d4` (polimento: título na mesma linha, «Subtipos» escondido com um subtipo, `#colfx` na coluna). Todos no remoto. `git status -s`: limpo.

| Caminho | Status | O que é |
|---|---|---|
| `index.html` | limpo | Página inteira (CSS, HTML e JS num arquivo). Dados em `const T`, `const SUB`, `const REFS`. |
| `docs/pesquisa.md` | limpo | Anotações e 12 referências com estado de verificação. |
| `.claude/skills/humanizer/`, `.claude/skills/passando-o-trabalho/` | limpo | Skills instaladas (MIT e CC BY 4.0). |

Como a página funciona hoje (verificado no código e no teste):
- Página inicial: título, `#circle` (SVG; o grupo `#rot` gira; `#pointer` fixo a 90°), legenda, «Rever a animação», toggles `.tg` «Os eixos» (`#p-eixos`) e «As fontes» (`#p-fontes`), rodapé.
- Toque num setor ou no núcleo chama `enter(qi,si)`: o SVG vai para `#fcirc` (coluna esquerda da camada `#focus`, com `.fback` e `.fhint`), `show()` (linha ~786) gira, marca `#selpath` e mostra o card em `#fpanel`. Gestos: para baixo/cima troca (`stepBy`), para a direita volta (`leave`). Roda, ↑ ↓ e Esc no computador.
- Card (template em `cols.insertAdjacentHTML`, linha ~590): `canvas.fx` (banner), `.top` com `<div class="el">` (linha 595) e `<h3>`, `.chips`, resumo, `details.more` «Mais sobre o …», bloco com `<h4>Subtipos</h4>` (linha 609), `.hint1`, `.subs`. `.card.one` = só um subtipo visível.
- Coluna: `<canvas id="colfx">` em `#fcirc`, objeto `colFx` (antes de `fxList`) reaproveita `FX`; `colFx.set(card)` em `show()`, `colFx.off()` em `leave()`.
- Efeitos: objeto `FX` (fogo, agua, terra, ar com `n`, `make`, `step`, `bg`, `draw`); `fxList` (linha 737) a partir de `canvas.fx`; `loop` (linha 750) só desenha os visíveis; `fxStill()` no movimento reduzido.

Teste: script Playwright no scratchpad (`nav.js`, não versionado) em Pixel 5 escuro e 1300 px claro: toque em subtipo e no centro, gestos, voltar, toggle «Mais sobre», referência. Último resultado: `errs []`, `overflow false`.

## Decisões e porquê

- Círculo: expansivos em cima, marcados à direita. Sanguíneo/Ar em cima à esquerda, Colérico/Fogo em cima à direita, Melancólico/Terra embaixo à direita, Fleumático/Água embaixo à esquerda (dono).
- Subtipos: Fogo (faísca, brasa), Água (vapor, gelo), Terra (argila, pedra), Ar (brisa, vento); neutro no centro; nenhum na direção do oposto; o subtipo deseja algo do vizinho e lembra sempre da base (dono). Esquema sem fonte, marcado como hipótese.
- Só fontes primárias, com estado de verificação. Título: nada aqui deve ser levado como verdade. Repositório público: nada pessoal do dono.
- Texto: não se altera sem pedido explícito do dono. A linha Humor saiu dos cards a pedido dele (o dado `humor` continua em `T`). Humanizer 2.1.1 em todo texto novo.
- Navegação (dono): página inicial só com o círculo; card ao lado; seta fixa à direita; para baixo = Faísca → Fogo → Brasa → Pedra…; celular mostra 36% do círculo na borda; Voltar e dica na coluna do círculo; card sem moldura; toggle «Mais sobre o …»; subtipo tocado aparece sozinho e aberto, centro mostra os três fechados; vale para celular e computador.
- Cores dos subtipos: tokens `--s-*` nos dois temas, contraste ≥ 4,5 com `--on` (medido).
- Polimento (dono): esconder «Subtipos» quando há um subtipo só (com os três, continua); título «Melancólico TERRA» na mesma linha, título primeiro; animação pelo caminho A, para os quatro elementos, mantendo o banner.

## Descartado

- Abrir os textos originais (archive.org, rsarchive.org, wikisource, korpora.org e outros): `getaddrinfo ENOTFOUND`. O dono recusou liberar a rede; não propor de novo.
- Testar sites com curl em loop: negado pelo classificador.
- Cores dos subtipos por `color-mix` entre vizinhos: rosadas e apagadas.
- Texto branco fixo sobre os setores: ilegível no tema escuro (usar `--on`).
- Animação caminho B (um canvas atrás da tela inteira, partículas passando da coluna ao banner): o banner rola e a coluna não, a continuidade quebra. Caminho C (tirar o banner): o dono quer o banner.
- Print com `fullPage: true`: os canvas saem vazios (redimensiona antes do quadro). Usar print normal.
- Teste de celular sem `<meta name="viewport">` abre a 980 px; a meta já está no arquivo.
- Gesto ouvido só em `#fcirc`: o dedo sai da faixa estreita e o gesto se perde. O `pointerup` fica na janela.

## Próximos passos

1. Esperar o retorno do dono sobre a versão 6. **Não tocar** sem pedido: textos, dados (`T`, `SUB`, `REFS`), página inicial, toggles, gestos, cores, círculo, banner, `docs/pesquisa.md`.
2. Se ele pedir ajuste na animação da coluna: densidade em `colFx.count()`, opacidade em `#colfx.on{opacity:.55}`, faixa de terra e água em `colFx.BAND` (90).
