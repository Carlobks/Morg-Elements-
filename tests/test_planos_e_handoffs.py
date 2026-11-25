"""Planos e handoffs continuam coerentes (Morg-laws).

Adaptado do molde do Morg-laws (modelos/testes/test_docs_indices.py), só as partes que este projeto usa:
- cada plano em docs/planos/ diz o que fica "Fora do escopo" e a "Prova";
- cada handoff é um arquivo por assunto, com as seções e só hashes de commits que existem.
"""

import re
import subprocess
import unittest

from carregar_por_caminho import RAIZ

# Ajuste ao projeto.
PLANOS = ("docs/planos/*.md",)
HANDOFFS = RAIZ / ".context"

SECOES_DO_HANDOFF = ("Objetivo", "Estado verificado", "Decisões", "Descartado", "Próximos passos")
HASH = re.compile(r"`([0-9a-f]{7,40})`")


def texto_do_doc(caminho):
    return caminho.read_text(encoding="utf-8-sig")


def titulos(caminho):
    """Títulos (# …) de um arquivo Markdown."""
    return [linha.lstrip("#").strip() for linha in texto_do_doc(caminho).splitlines() if linha.startswith("#")]


class Planos(unittest.TestCase):

    def test_planos_dizem_o_fora_do_escopo_e_a_prova(self):
        planos = [plano for padrao in PLANOS for plano in RAIZ.glob(padrao)]
        self.assertTrue(planos, "nenhum plano em docs/planos/")
        for plano in planos:
            secoes = " | ".join(titulos(plano))
            with self.subTest(plano=plano.name):
                self.assertIn("Fora do escopo", secoes)
                self.assertRegex(secoes, r"Prova|Verificação")


class Handoffs(unittest.TestCase):

    def test_um_arquivo_por_assunto_com_as_secoes_e_hashes_que_existem(self):
        self.assertFalse((HANDOFFS / "HANDOFF.md").exists(), "um arquivo por assunto: HANDOFF-<assunto>.md")
        handoffs = sorted(HANDOFFS.glob("HANDOFF-*.md"))
        self.assertTrue(handoffs, "nenhum handoff em .context/")
        for handoff in handoffs:
            with self.subTest(handoff=handoff.name):
                secoes = titulos(handoff)
                for secao in SECOES_DO_HANDOFF:
                    self.assertTrue(any(s.startswith(secao) for s in secoes), f"falta a seção {secao}")
                for sha in HASH.findall(texto_do_doc(handoff)):
                    existe = subprocess.run(["git", "cat-file", "-e", f"{sha}^{{commit}}"], cwd=RAIZ,
                                            capture_output=True, check=False).returncode == 0
                    self.assertTrue(existe, f"o commit {sha} não existe: o estado não foi verificado")


if __name__ == "__main__":
    unittest.main()
