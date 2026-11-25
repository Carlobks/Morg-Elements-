#!/bin/sh
# Testes estáticos do projeto (Python, só a biblioteca padrão): dados pessoais, tamanho dos arquivos,
# fins de linha, plano e handoffs. Rodam no pre-commit, no pre-push e no CI. Os do navegador: npm test.
raiz=$(git rev-parse --show-toplevel) || exit 1
py=${MORG_PY:-$(command -v py || command -v python3)}
cd "$raiz" && "$py" -I -m unittest discover -s tests -t tests -p 'test_*.py'
