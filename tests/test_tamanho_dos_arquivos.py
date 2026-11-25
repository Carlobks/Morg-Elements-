"""Arquivos de código até LIMITE_DE_LINHAS linhas (Morg-laws: arquivos pequenos).

Adaptado do molde do Morg-laws (modelos/testes/test_tamanho_dos_arquivos.py) na versão proporcional: o projeto
não tem nenhum arquivo acima do limite, então não há linha de base; qualquer arquivo acima do limite falha.
As linhas contam-se como o editor as mostra: a quebra no fim não é uma linha a mais.
"""

import subprocess
import unittest

from carregar_por_caminho import RAIZ

# Ajuste ao projeto.
LIMITE_DE_LINHAS = 500
EXTENSOES_COM_LIMITE = (".py", ".sh", ".js", ".mjs", ".cjs", ".html", ".css", ".yaml", ".yml", ".md")
FORA_DO_LIMITE = ("node_modules/", "tests/.ref/")


def linhas_no_editor(texto):
    """Linhas como o editor as mostra: cada quebra fecha uma linha, e o resto sem quebra no fim também conta."""
    return texto.count("\n") + (1 if texto and not texto.endswith("\n") else 0)


def tem_limite(caminho):
    return (caminho.lower().endswith(EXTENSOES_COM_LIMITE)
            and not any(caminho.startswith(fora) or f"/{fora}" in caminho for fora in FORA_DO_LIMITE))


def excesso_de_linhas(textos):
    """{caminho: linhas acima do limite} dos arquivos que passam do limite."""
    return {caminho: linhas_no_editor(texto) - LIMITE_DE_LINHAS for caminho, texto in textos.items()
            if tem_limite(caminho) and linhas_no_editor(texto) > LIMITE_DE_LINHAS}


def arquivos_do_projeto():
    """{caminho: texto} dos arquivos guardados e dos novos que o .gitignore não esconde."""
    saida = subprocess.run(["git", "ls-files", "--cached", "--others", "--exclude-standard"], cwd=RAIZ,
                           capture_output=True, text=True, encoding="utf-8", check=True).stdout
    return {c: (RAIZ / c).read_text(encoding="utf-8", errors="replace")
            for c in dict.fromkeys(saida.splitlines()) if tem_limite(c) and (RAIZ / c).is_file()}


class MedidorDeLinhas(unittest.TestCase):

    def test_conta_como_o_editor(self):
        self.assertEqual([linhas_no_editor(t) for t in ("", "a", "a\n", "a\r\nb", "a\n\n")], [0, 1, 1, 2, 2])

    def test_pega_o_que_passa_do_limite_e_deixa_o_resto(self):
        no_limite, acima = "x\n" * LIMITE_DE_LINHAS, "x\n" * (LIMITE_DE_LINHAS + 3)
        textos = {"a.js": no_limite, "b.css": acima, "notas.txt": acima, "node_modules/c.js": acima}
        self.assertEqual(excesso_de_linhas(textos), {"b.css": 3})


class TamanhoDosArquivos(unittest.TestCase):

    def test_ha_arquivos_para_medir(self):
        self.assertIn("index.html", arquivos_do_projeto())

    def test_nenhum_arquivo_acima_do_limite(self):
        self.assertEqual(excesso_de_linhas(arquivos_do_projeto()), {}, "divida o arquivo por responsabilidade")


if __name__ == "__main__":
    unittest.main()
