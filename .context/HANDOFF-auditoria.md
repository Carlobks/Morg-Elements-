# Handoff: auditoria

## Objetivo

Auditar o projeto, guardar os testes e pôr as barreiras do Morg-laws, sem mudar visual, texto nem organização do texto.
Passo em curso: F0 a F3 feitos; próximo, F4 (auditoria do código), que pede o «sim» do dono. Plano: `docs/planos/0001-auditoria.md`.

## Estado verificado (2026-11-25, ramo claude/temperamentos-elementos-qtbc9x)

Referência visual: `a1e33ad` (versão 10 do artifact https://claude.ai/artifact/SGPyWPBjHribgfeVFXvZsJ). Divisão do F2: `55a9635`. Barreiras do F3: `85ffc2d` e `cb48ea8`. CI no GitHub verde em `cb48ea8` e no commit seguinte (jobs `testar`, com os 8 testes do navegador, e `segredos`); vermelho só em `85ffc2d` (Python 3.11.9). O artifact publicado é idêntico ao `index.html` de `a1e33ad` (conferido por `diff`; só uma linha em branco do invólucro); não foi republicado depois da divisão (isso é o F7).

| Caminho | Status | O que é |
|---|---|---|
| `index.html` | limpo | 119 linhas: HTML, `<link>` das fontes e de `estilo.css`, e `<script src>` de `dados.js`, `efeitos.js`, `navegacao.js`, nesta ordem. |
| `estilo.css` | limpo | 247 linhas: o CSS antigo, sem mudança. |
| `dados.js` | limpo | 266 linhas: `EL`, `slug`, `ICO`, `icon`, `r`, `T`, `SUB`, `REFS`, montagem dos cards e da lista de fontes. |
| `efeitos.js` | limpo | 251 linhas: desenho do círculo (`Q`, `play`), revelação (`reduce`, `rvIO`), `FX`, `SUBFX`, `colFx`, `fxList`, `loop`, `kick`. |
| `navegacao.js` | limpo | 95 linhas: `SEQ`, `show`, `enter`, `leave`, `stepBy`, gestos, `openPanel`, `goRef`. |
| `docs/planos/0001-auditoria.md` | limpo | F0 a F3 marcados; F4 com o teste intermitente; seções «Para depois da auditoria» e «Depois do plano: projeto público, com uma release». |
| `package.json`, `playwright.config.js`, `tests/e2e/*` | limpo | Os testes do F1 (ver o plano). |
| `.githooks/` | limpo | F3 (`85ffc2d`): pre-commit (lista negra, `scripts/testar.sh`; identidade comentada), commit-msg (`tipo(área): …`), pre-push (`testar.sh`, `npm test`, gitleaks, npm audit). Ligado com `git config core.hooksPath .githooks` (config local: refazer em cada clone). |
| `scripts/portoes/`, `scripts/testar.sh` | limpo | Portões do Morg-laws sem mudança; `testar.sh` roda `tests/test_*.py` (15 testes, ~0,1 s). |
| `tests/test_*.py`, `tests/carregar_por_caminho.py` | limpo | Dados pessoais, tamanho (≤500 linhas, sem linha de base), fins de linha, planos e handoffs. |
| `.github/workflows/ci.yml` | limpo | Testes estáticos, Playwright e gitleaks; actions por SHA; `fetch-depth: 0`. |
| `.gitattributes`, `.nvmrc` | limpo | `* text=auto eol=lf`; Node 22.23.5. |

Prova do F2: os cinco arquivos juntados de volta (com `<style>`/`<script>` no lugar) = `index.html` antigo, `diff` vazio; `T`, `SUB`, `REFS` idênticos. `npm test` → `8 passed (58.1s)`. Sem `dados.js`, os testes ficam vermelhos (timeout no clique), então eles leem os arquivos novos.

Sondas do F3 (numa cópia descartável): recusados no commit o e-mail pessoal, o caminho `/home/<conta>`, o arquivo de 501 linhas (500 passa), o CRLF, o hash inexistente no handoff e a mensagem fora do formato; recusado no push um token `ghp_` falso (`leaks found: 1`). gitleaks 8.30.1 em todo o histórico: `no leaks found`. Instalado em `~/.local/bin` (sha256 conferido); numa sessão nova, reinstalar.

Teste intermitente: o pre-push do F3 falhou uma vez e o `npm test` seguinte também, só `[pc-claro] igual à referência`:
```
"inicio: 604 px", "foco-Faísca: 335 px", … "painel-fontes: 389 px"
```
Isolado (3×) e em 5 rodadas inteiras depois, passou. Causa não achada; vai para o F4.

## Decisões e porquê

- Do dono, no plano («Decisões do dono»): dividir o arquivo; Morg-laws proporcional; Playwright no pre-push e no CI; achados visuais só listados; ler em partes pequenas; clone de `a1e33ad` como referência.
- Do dono (F2, opção A): o desenho do círculo fica em `efeitos.js` e os cards em `dados.js`, para manter a ordem de execução original (os efeitos usam os cards e o `reduce`). A opção B (círculo em `navegacao.js`) mudaria a ordem.
- Do dono: pedidos visuais anotados para depois da auditoria (plano, seção «Para depois da auditoria»): botão de tema, mudar o lugar do «Rever a animação», o texto abaixo do círculo não explica que ele é tocável, e fechar os painéis faz a página subir de forma abrupta. Nada disso se faz antes do fim da auditoria nem sem o «sim».
- Técnica: comparação de pixels exige quadro determinístico (movimento reduzido emulado e `Math.random` com semente via `addInitScript`); o teste espera `document.fonts` antes de cada print. Limite: só o quadro parado é comparado.
- O CI do F3 vai precisar de `fetch-depth: 0` para o `git archive a1e33ad`.
- Do dono (F3): o portão de identidade e a lista negra ficam para quando o repositório estiver na máquina dele. Até lá o `identidade.py` está comentado no pre-commit e a lista negra só avisa.
- Do dono: no fim do plano, o projeto fica público com uma release (plano, seção «Depois do plano»): ver o que falta criar, um README bonito e cuidado com os dados pessoais.
- Técnica (F3): o tamanho dos arquivos sem linha de base (nenhum arquivo passa de 500 linhas); dos testes de docs, só planos e handoffs (o projeto não tem `docs/README.md`).
- Regras que continuam: repositório público, nada pessoal; só fontes primárias; nada se altera sem o «sim» do dono.

## Descartado

- Abrir textos clássicos (archive.org etc.): rede bloqueada, dono recusou liberar.
- Print com `fullPage: true`: canvas saem vazios.
- Guardar prints PNG no repositório como referência: desnecessário, o teste renderiza o clone de `a1e33ad` na hora.
- Hooks do Claude e `AGENTS.md`: fora da versão proporcional (dono).
- Republicar o artifact com os cinco arquivos antes do F7: fica para o F7.
- Python 3.11.9 no CI (o do modelo): `The version '3.11.9' with architecture 'x64' was not found for Ubuntu 26.04` → trocado por 3.13.18.
- Causa do teste intermitente = fonte latina atrasada: depois da espera, as faces latinas de todos os pesos já estão `loaded` → procurar outra causa.
- Portão de identidade agora: o dono adiou para a máquina dele; não reabrir antes.

## Próximos passos

1. Sessão nova (o container é outro): `git config core.hooksPath .githooks` (sem isto os hooks ficam desligados); `npm ci`; reinstalar o gitleaks 8.30.1 em `~/.local/bin` com o sha256 do `.github/workflows/ci.yml`; reclonar o Morg-laws só para leitura se for preciso. Conferir com `sh scripts/testar.sh` (15 OK) e `npm test` (8 passed).
2. Pedir o «sim» do dono para o F4 (auditoria do código, em partes de ~120 linhas, relatório em `docs/auditoria-2026-11-25.md`), começando pelo teste intermitente do pc-claro: repetir a suíte até falhar e guardar `test-results/` (os prints da falha) antes de rodar de novo.
3. F5 a F7 conforme o plano; depois, o plano da publicação com release.
