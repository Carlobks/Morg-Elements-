# Plano 0001: auditoria do projeto, testes guardados e barreiras (2026-11-25)

## Contexto

A página (`index.html`, 978 linhas, CSS, HTML e JS num arquivo) está pronta no visual. Nenhum teste está no
repositório (o de navegação existe só no scratchpad da sessão), nenhum hook está ligado e não há CI. O dono quer
guardar os testes, auditar o código, otimizar e procurar leaks, sem mudar o visual, o texto nem a organização do
texto. O jeito de fazer segue o Morg-laws (`modelos/`, skills `testes-e-provas`, `codigo-legivel`,
`auditoria-de-seguranca`, `cuidando-da-acessibilidade`).

## Decisões do dono

- Visual, texto e organização do texto não mudam; só o que está por trás — escolhido.
- Passo 0: um clone da versão atual (`a1e33ad`) como referência, conferindo a cada mudança — escolhido.
- Ler tudo em partes pequenas e juntar depois — escolhido.
- 978 linhas: dividir em arquivos (`index.html`, `estilo.css`, `dados.js`, `efeitos.js`, `navegacao.js`) — escolhido: dividir (recomendada: dividir).
- Morg-laws na versão proporcional (pre-commit, commit-msg, pre-push com gitleaks, CI, testes de dados pessoais, tamanho, fins de linha e handoff) — escolhido: proporcional (recomendada: proporcional).
- CI ou Playwright: o CI não substitui o Playwright. O CI é *onde* os testes rodam (uma máquina do GitHub); o Playwright é *o que* abre a página num navegador. Para testar uma página, o CI também precisa de um navegador. O que é mais leve é *rodar os testes pesados no CI* em vez de em cada commit — escolhido: Playwright, com os testes do navegador no pre-push e no CI, e só os testes estáticos (segundos) no pre-commit.
- Achados que mexeriam no visual (contraste, por exemplo): só listar no relatório — escolhido.

## Fora do escopo

- Qualquer mudança visual, de texto ou de ordem do texto, mesmo pequena (vai para o relatório, como sugestão).
- Hooks do Claude (`.claude/settings.json`, `guarda_do_git` etc.), `AGENTS.md`, mapa de regras e changelog: fora da versão proporcional.
- Catracas de tamanho de função e de nomes Python: não há código Python no produto.
- Os textos de `docs/pesquisa.md` e os dados `T`, `SUB`, `REFS` (só mudam de arquivo, nunca de conteúdo).

## Passos

Uma fase de cada vez, com o "sim" do dono; commit por caminho no fim de cada fase; a caixa marca-se com o hash.
Toda leitura de código é feita em partes de ~120 linhas, com notas por parte, juntadas no fim da fase.

- [ ] **F0 — Referência.** Clone (git worktree) de `a1e33ad` fora do repositório. Script que abre a referência e a versão de trabalho lado a lado: prints da tela inicial, dos 4 cards e dos 12 subtipos, temas claro e escuro, celular (Pixel 5) e computador (1300 px), com movimento reduzido e `Math.random` com semente fixa para o quadro ser igual; e o texto completo da página e de cada card. *Prova:* referência contra ela mesma = 0 pixels e 0 caracteres diferentes; uma mudança de 1 px feita de propósito numa cópia é pega.
- [ ] **F1 — Testes guardados.** `package.json` e `package-lock.json` com `@playwright/test` fixado (1.63.0, o desta máquina), só para testes. `tests/e2e/`: navegação (o `nav.js` do scratchpad: toques, gestos, voltar, toggles, referência, `errs`, `overflow`) e referência (o F0, que monta o clone de `a1e33ad` sozinho). *Prova:* `npx playwright test` verde; cada teste quebrado de propósito uma vez fica vermelho.
- [ ] **F2 — Dividir o arquivo.** `index.html` só com o HTML; `estilo.css`; `dados.js` (`T`, `SUB`, `REFS`, sem mudar um caractere do conteúdo); `efeitos.js` (`FX`, `SUBFX`, `colFx`, laço); `navegacao.js` (círculo, `enter`, `show`, gestos). Cada arquivo abaixo de 500 linhas. *Prova:* teste de referência com 0 diferenças; navegação verde; `diff` do conteúdo dos dados igual.
- [ ] **F3 — Barreiras.** `.githooks/` (pre-commit, commit-msg, pre-push) e `scripts/portoes/` do Morg-laws; `tests/` Python (unittest, só biblioteca padrão): dados pessoais, tamanho dos arquivos, fins de linha, handoff; `.github/workflows/ci.yml` (actions por SHA, token só de leitura, Playwright e gitleaks). Pre-commit: testes estáticos; pre-push e CI: tudo. *Prova:* sonda de cada barreira (um e-mail pessoal num arquivo é recusado; um arquivo de 501 linhas é recusado; o CI verde no GitHub).
- [ ] **F4 — Auditoria do código.** Ler cada arquivo em partes pequenas, anotar cada achado com arquivo e linha (bugs, código morto, CSS sem uso, `innerHTML`, recursos externos, tratamento de erro), gitleaks no histórico inteiro, acessibilidade medida (só listar). Relatório em `docs/auditoria-2026-11-25.md`: achados e cobertura (quantos arquivos e linhas lidos), sem nota única. *Prova:* contagem de linhas lidas = total; cada achado com local.
- [ ] **F5 — Leaks e desempenho.** Abrir e fechar o card 100 vezes, trocar de subtipo 300 vezes: heap (CDP), laços `requestAnimationFrame` ativos com a página parada, listeners e timers. Quadros por segundo e tarefas longas com CPU 4× mais lenta. *Prova:* números antes e depois no relatório; heap estável depois do coletor de lixo.
- [ ] **F6 — Correções aprovadas.** Só o que o dono aprovar da lista do F4/F5, uma por commit. *Prova:* referência com 0 diferenças e navegação verde a cada commit.
- [ ] **F7 — Publicar e fechar.** Republicar o artifact com os arquivos (`files`) no mesmo link; handoff atualizado. *Prova:* página publicada aberta; teste de referência contra a versão publicada.

## Prova

De ponta a ponta: o teste de referência (pixels e texto contra `a1e33ad`) prova que nada visível mudou; o de
navegação prova que tudo continua funcionando; as sondas provam que as barreiras pegam; o relatório conta o que foi
lido. Não verificado por máquina: a sensação das animações (só o dono prova olhando) e o comportamento em
navegadores além do Chromium (WebKit e Firefox ficam como pendência no relatório).
