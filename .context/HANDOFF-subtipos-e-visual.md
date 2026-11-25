# Handoff: subtipos e visual

## Objetivo

Polir a página dos quatro temperamentos (`index.html`), publicada como artifact em https://claude.ai/artifact/SGPyWPBjHribgfeVFXvZsJ (republicar sempre pelo mesmo `file_path`).
Passo em curso: tela inicial refeita (versão 10); próximo, auditoria curta.

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
- Coluna (dono): fogo e ar aprovados; água = bolhas subindo devagar (`colFx.bolha`). Terra = ideia A + rachaduras de B (dono), apoiada em Aristóteles [13][14] em `docs/pesquisa.md` 2.4: poucos grãos caem pesados (`colFx.grao`), viram camadas no pé (`colFx.sedimento`, limite abaixo de `#hint`), as antigas racham em rede (`colFx.racha`), repousam 2,5 s, compactam e recomeçam; `#colfx.on.terra{opacity:.8}`. Banner intocado.
- Subtipos na coluna (dono aprovou a tabela): `SUBFX[el][sub]` com parâmetros que `colFx.ease()` aproxima a cada quadro; `colFx.set(card, nomeDoSubtipo)` em `show()`; centro = base. Pesquisa em `docs/pesquisa.md` 2.5, refs [13][14][15].
- Tela inicial (dono): «Morg Elements» pequeno no topo (`h1.brand`, sem ponto); abaixo, os temperamentos na ordem do círculo (Sanguíneo, Colérico, Melancólico, Fleumático) em `.temps`, cor do texto com só um sublinhado fino na cor do elemento («para não virar um carnaval»); celular em 2 × 2 na posição do círculo. Aviso intocado.
- Auditoria (dono): depois dos subtipos, curta e proporcional: versionar o teste (`nav.js` só existe no scratchpad), um hook (sintaxe JS e dados pessoais), sem catracas; ler o Morg-laws antes.
- Polimento (dono): esconder «Subtipos» quando há um subtipo só (com os três, continua); título «Melancólico TERRA» na mesma linha, título primeiro; animação pelo caminho A, para os quatro elementos, mantendo o banner.

## Descartado

- Abrir os textos originais (archive.org, rsarchive.org, wikisource, korpora.org e outros): `getaddrinfo ENOTFOUND`. O dono recusou liberar a rede; não propor de novo.
- Testar sites com curl em loop: negado pelo classificador.
- Cores dos subtipos por `color-mix` entre vizinhos: rosadas e apagadas.
- Texto branco fixo sobre os setores: ilegível no tema escuro (usar `--on`).
- Coluna v6: terra e água só numa faixa de 90 px no pé, coluna vazia acima → destoava do fogo e do ar (dono). Substituído por bolhas e grãos.
- Terra v7 (grãos finos caindo devagar pela altura inteira): «neve marrom» (dono). Raízes: «raiz não é terra» (dono). Rachaduras só verticais e claras: pareciam riscos; viraram rede, escura no tema claro.
- Animação caminho B (um canvas atrás da tela inteira, partículas passando da coluna ao banner): o banner rola e a coluna não, a continuidade quebra. Caminho C (tirar o banner): o dono quer o banner.
- Print com `fullPage: true`: os canvas saem vazios (redimensiona antes do quadro). Usar print normal.
- Teste de celular sem `<meta name="viewport">` abre a 980 px; a meta já está no arquivo.
- Gesto ouvido só em `#fcirc`: o dedo sai da faixa estreita e o gesto se perde. O `pointerup` fica na janela.

## Próximos passos

1. Esperar o retorno do dono sobre a versão 10 (tela inicial). Animação por subtipo: ajustes em `SUBFX`.
2. Auditoria curta: ler o Morg-laws (`modelos/`), versionar o teste de navegação do scratchpad no repositório, propor um hook (sintaxe JS e dados pessoais) e conferir desempenho e acessibilidade. Perguntar antes de criar.
