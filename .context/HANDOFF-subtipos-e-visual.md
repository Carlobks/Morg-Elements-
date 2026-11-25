# Handoff: subtipos e visual

## Objetivo

Terminar a página dos quatro temperamentos (`index.html`), publicada como artifact em https://claude.ai/artifact/SGPyWPBjHribgfeVFXvZsJ. O projeto termina quando a fase 3 (visual) estiver pronta.
Estado: fases 2 e 3 e revisão com a humanizer concluídas e publicadas (2026-11-25). O projeto está encerrado; só voltar aqui se o dono pedir ajustes.

## Estado verificado (2026-11-25, ramo claude/temperamentos-elementos-qtbc9x)

Commits: `92ab8c9` (pesquisa inicial e página), `810cc85` (skill humanizer 2.1.1), `3adadc5` (skill passando-o-trabalho). Os dois primeiros já estão no remoto; o push funcionou depois que o dono instalou o app do Claude no GitHub.

| Caminho | Status | O que é |
|---|---|---|
| `index.html` | limpo | Página: círculo SVG animado (JS monta setores), 4 cards, tabela dos eixos, linha do tempo, referências. Dados em `const T` e `const REFS` no script. `R_OUT=206`, `R_IN=128`, token `--on` para o texto sobre os setores. |
| `docs/pesquisa.md` | limpo | Anotações e 12 referências com estado de verificação. |
| `README.md` | limpo | Descrição curta. |
| `.claude/skills/humanizer/` | limpo | Versão 2.1.1 (commit `d8085c7^` de blader/humanizer), com LICENSE MIT. |
| `.claude/skills/passando-o-trabalho/` | limpo | Cópia de Carlobks/Morg-laws (`2325c49`), com LICENSE CC BY 4.0. |

Testes: não há suíte. Na sessão, uma checagem com Playwright em 1300 px (claro) e 400 px (escuro) não mostrou overflow nem erros de console.

## Decisões e porquê

- Círculo: expansivos em cima, marcados à direita. Sanguíneo/Ar em cima à esquerda, Colérico/Fogo em cima à direita, Melancólico/Terra embaixo à direita, Fleumático/Água embaixo à esquerda (dono).
- Subtipos (dono): Fogo, faísca (perto do sanguíneo), brasa (perto do melancólico). Água, vapor (perto do sanguíneo), gelo (perto do melancólico). Terra, argila (perto do fleumático), pedra (perto do colérico). Ar, brisa (perto do fleumático), vento (perto do colérico). O neutro fica no centro e não existe subtipo na direção do oposto.
- Regra dos subtipos (dono): o subtipo deseja algo do vizinho, mas sempre lembra da base.
- Só fontes primárias, cada uma com estado de verificação. O esquema dos subtipos não tem fonte e aparece como hipótese do projeto (dono).
- Título: basta dizer que nada aqui deve ser levado como verdade (dono).
- Repositório público: nada pessoal do dono.
- Humanizer: usar a versão 2.1.1. Sem fontes ou exemplos inventados. Voz e opinião só nos textos dos subtipos; eixos, linha do tempo e referências ficam neutros (plano aprovado).
- Fase 2 aprovada: cada um dos 12 subtipos com imagem do elemento, traços, trabalho, relacionamentos, conflito, busca (só os não neutros), quando exagera, lembrar da base e equilíbrio. Uma tabela por temperamento compara os 3 subtipos (conflito, quando exagera). Cada subtipo abre como `<details>` ao toque, e o toque no círculo abre e destaca o subtipo.
- Fase 3 aprovada: blocos aparecendo com o scroll (IntersectionObserver, nada escondido sem JS), efeito do elemento num canvas no topo de cada card (faíscas, ondas, grãos, linhas de vento), ícone SVG animado por subtipo, círculo "respirando" por quadrante (fogo rápido, terra lento), cores próprias e mais vivas por subtipo, nomes do centro maiores (viewBox menor, cerca de -270..270), prefers-reduced-motion deixa tudo parado.
- Cores dos subtipos (rascunho, não verificado): Faísca #ef8b25, Fogo #d9481c, Brasa #9e2f1c, Vento #a35fc4, Ar #7f73d6, Brisa #8c95e0, Vapor #5b9fd1, Água #2479a8, Gelo #3d97a8, Argila #a8744f, Terra #8d6a35, Pedra #6e6a64.

## Descartado

- Abrir os textos originais (archive.org, rsarchive.org, wikisource, korpora.org, ellopos.net, pure.mpg.de, classics.mit.edu, psychclassics.yorku.ca): `getaddrinfo ENOTFOUND`. O dono recusou criar um ambiente com esses sites liberados, então não se propõe de novo.
- Testar sites com curl em loop: o classificador do modo automático negou.
- Cores dos subtipos por `color-mix` entre vizinhos: vento e faísca ficaram rosados e apagados. Usar cores próprias.
- Texto branco fixo sobre os setores: ilegível no tema escuro. Usar o token `--on` ou um contorno.

## Feito depois deste handoff

- Fase 2 (`4094219`): 12 subtipos em `const SUB`, cada um num `<details>`, tabela comparativa por temperamento, toque no círculo abre o subtipo.
- Fase 3 (`f2566d4`): cores próprias `--s-*` nos dois temas (contraste ≥ 4,5 com `--on`), canvas por elemento no topo dos cards, ícones SVG animados, halo e brilho "respirando" por quadrante, revelação com o scroll, nomes do centro maiores (viewBox -276..276). Movimento reduzido deixa tudo parado.
- Humanizer: negrito no meio das frases retirado de `docs/pesquisa.md`; textos novos já escritos seguindo a skill.

- Navegação pelo círculo (pedido do dono depois da fase 3): a página inicial mostra só o título, o círculo e dois toggles ("Os eixos" = tabela dos eixos e texto dos vizinhos; "As fontes" = linha do tempo e referências). Tocar num subtipo ou no nome do temperamento abre a camada `#focus`: o círculo vai para a esquerda (no celular só 36% dele aparece, encostado na borda), uma seta fixa à direita marca a seleção e o card do temperamento aparece ao lado, com o subtipo aberto. Deslizar para baixo = próximo no sentido horário (Faísca → Fogo → Brasa → Pedra…), para cima = anterior, para a direita = voltar. No computador: roda do mouse, ↑ ↓, Esc e o botão voltar do navegador. Um número de referência leva às fontes. Nenhum texto foi alterado.

- Ajustes depois do teste no celular: sem destaque azul ao tocar (contorno só no teclado); botão redondo "Voltar" e dica curta na coluna do círculo; card sem moldura, com banner, elemento, título, tags e resumo, e o resto num toggle "Mais sobre o …" (a linha Humor saiu, Qualidades e Estação ficam no toggle); tocar num subtipo mostra só ele, aberto; tocar no centro mostra os três fechados. Vale para celular e computador.

## Próximos passos (originais, todos feitos)

1. Fase 2: escrever os 12 subtipos aprofundados no `const T` de `index.html` (campos: imagem, traços, trabalho, relações, conflito, busca, exagero, base, equilíbrio), com o `<details>` e a tabela comparativa. Escrever já seguindo `.claude/skills/humanizer/SKILL.md`.
2. Fase 3: o visual descrito nas Decisões. Depois, um único print com Playwright (400 px escuro e 1300 px claro).
3. Passar a humanizer em todo o texto de `index.html` e `docs/pesquisa.md`, publicar no mesmo artifact (mesmo `file_path`), commitar e dar push.
