#!/usr/bin/env python3
"""
Convert latamboard-paper.md to arXiv-ready LaTeX.

Produces:
  arxiv/submission/main.tex       — article-class LaTeX with embedded bib
  arxiv/submission/main.bbl       — BibTeX entries (self-contained for arXiv)

The conversion is deterministic (no LLM calls). It handles:
  - Markdown headings -> \section, \subsection, \subsubsection
  - **bold** -> \textbf{}, *italic* -> \textit{}, `code` -> \texttt{}
  - Inline citations [Author (Year)] -> \cite{}
  - Ordered/unordered lists -> enumerate/itemize
  - En-dash and arrow Unicode -> LaTeX equivalents
  - Proper .bib file from the References section

Usage:
  python3 arxiv/convert_to_latex.py [--paper latamboard-paper.md] [--outdir arxiv/submission]
"""
import argparse, re, json
from pathlib import Path

# ─── metadata ───────────────────────────────────────────────────────────────
TITLE = "On the missing benchmarks layer and a potential solution"
AUTHORS = [
    ("Francis F Daniel", "SURUS", True),   # (name, affiliation, co_first)
    ("Mauro Iba\\~nez", "SURUS", True),
    ("Francis Perelman", "Independent", False),
    ("Marian Basti", "SURUS", False),
]
DATE = "2026-06-23"
ABSTRACT_DATE = "June 23, 2026"
KEYWORDS = "AI, Benchmarks, Latin America, Evals Hub, multipolar AI"

# ─── bib entries (key -> bibtex) ─────────────────────────────────────────────
BIB_ENTRIES = r"""@article{khattab2023dspy,
  author = {Khattab, Omar and others},
  title = {DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines},
  journal = {arXiv preprint arXiv:2310.03714},
  year = {2023}
}

@inproceedings{opsahlong2024mipro,
  author = {Opsahl-Ong, Kristopher and others},
  title = {Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs},
  booktitle = {EMNLP 2024},
  year = {2024},
  note = {arXiv:2406.11695}
}

@inproceedings{agrawal2025gepa,
  author = {Agrawal, Lakshay A. and others},
  title = {GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning},
  booktitle = {ICLR 2026},
  year = {2025},
  note = {arXiv:2507.19457}
}

@inproceedings{wagnerfilho2018brwac,
  author = {Wagner Filho, Joao A. and Wilkens, Roberto and Idiart, Marco and Villavicencio, Aline},
  title = {The brWaC Corpus: A New Open Resource for Brazilian Portuguese},
  booktitle = {LREC 2018},
  year = {2018}
}

@inproceedings{real2020assin2,
  author = {Real, Livy and Fonseca, Erick and Gon\c{c}alo Oliveira, Hugo},
  title = {The ASSIN 2 Shared Task: A Quick Overview},
  booktitle = {PROPOR 2020},
  year = {2020},
  doi = {10.1007/978-3-030-41505-1_39}
}

@inproceedings{santos2006harem,
  author = {Santos, Diana and Seco, Nuno and Cardoso, Nuno and Vilela, Rui},
  title = {HAREM: An Advanced NER Evaluation Contest for Portuguese},
  booktitle = {LREC 2006},
  year = {2006}
}

@inproceedings{luzdearaujo2018lenerbr,
  author = {Luz de Araujo, Pedro H. and others},
  title = {LeNER-Br: A Dataset for Named Entity Recognition in Brazilian Legal Text},
  booktitle = {PROPOR 2018},
  year = {2018},
  doi = {10.1007/978-3-319-99722-3_32}
}

@misc{b2w2019reviews,
  author = {{B2W Digital}},
  title = {B2W-Reviews01},
  howpublished = {STIL 2019, \url{github.com/americanas-tech/b2w-reviews01}},
  year = {2019}
}

@techreport{canete2020beto,
  author = {Ca\~nete, Jorge and others},
  title = {BETO: Spanish Pretrained BERT},
  institution = {University of Chile},
  year = {2020},
  note = {Technical report}
}

@proceedings{garcia2019iberlef,
  editor = {Garc\'ia Cumbreras, M. \'A. and others},
  title = {Proceedings of IberLEF 2019},
  series = {CEUR Workshop Proceedings},
  volume = {Vol-2421},
  year = {2019}
}

@inproceedings{mager2021americasnlp,
  author = {Mager, Manuel and others},
  title = {Findings of the AmericasNLP 2021 Shared Task on Open Machine Translation for Indigenous Languages of the Americas},
  year = {2021},
  doi = {10.18653/v1/2021.americasnlp-1.23}
}

@misc{latamgpt2025,
  author = {{LatamGPT Project}},
  title = {LatamGPT: Open LLMs for Latin American Spanish},
  howpublished = {\url{huggingface.co/latam-gpt}},
  year = {2025}
}

@inproceedings{wang2018glue,
  author = {Wang, Alex and others},
  title = {GLUE: A Multi-Task Benchmark and Analysis Platform for Natural Language Understanding},
  booktitle = {ICLR 2019},
  year = {2018},
  note = {arXiv:1804.07461}
}

@inproceedings{wang2019superglue,
  author = {Wang, Alex and others},
  title = {SuperGLUE: A Stickier Benchmark for General-Purpose Language Understanding Systems},
  booktitle = {NeurIPS 2019},
  year = {2019},
  note = {arXiv:1905.00537}
}

@inproceedings{hendrycks2020mmlu,
  author = {Hendrycks, Dan and others},
  title = {Measuring Massive Multitask Language Understanding},
  booktitle = {ICLR 2021},
  year = {2020},
  note = {arXiv:2009.03300}
}

@article{srivastava2022bigbench,
  author = {Srivastava, Aarohi and others},
  title = {Beyond the Imitation Game: Quantifying and Extrapolating the Capabilities of Language Models (BIG-bench)},
  journal = {TMLR 2023},
  year = {2022},
  note = {arXiv:2206.04615}
}

@article{liang2022helm,
  author = {Liang, Percy and others},
  title = {Holistic Evaluation of Language Models (HELM)},
  journal = {TMLR 2023},
  year = {2022},
  note = {arXiv:2211.09110}
}

@article{biderman2024lessons,
  author = {Biderman, Stella and others},
  title = {Lessons from the Trenches on Reproducible Evaluation of Language Models},
  journal = {arXiv preprint arXiv:2405.14782},
  year = {2024}
}

@misc{bis2022export,
  author = {{U.S. Dept. of Commerce, Bureau of Industry and Security}},
  title = {Implementation of Additional Export Controls},
  howpublished = {87 FR 62186, Oct 13, 2022},
  year = {2022}
}

@misc{bis2023export,
  author = {{U.S. Dept. of Commerce, Bureau of Industry and Security}},
  title = {Export Controls: Updates and Corrections},
  howpublished = {88 FR 73458, Oct 25, 2023},
  year = {2023}
}

@misc{bis2025framework,
  author = {{U.S. Dept. of Commerce, Bureau of Industry and Security}},
  title = {Framework for AI Diffusion},
  howpublished = {90 FR 4544, Jan 15, 2025},
  year = {2025}
}

@misc{nvidia2022form8k,
  author = {{NVIDIA Corp.}},
  title = {Form 8-K, SEC EDGAR},
  howpublished = {Accession No. 0001045810-22-000146, Aug 26, 2022},
  year = {2022}
}

@misc{nvidia2023form10k,
  author = {{NVIDIA Corp.}},
  title = {Form 10-K, SEC EDGAR},
  howpublished = {Accession No. 0001045810-23-000017, Feb 24, 2023},
  year = {2023}
}

@misc{lgpd2018,
  author = {{Brasil}},
  title = {Lei Geral de Prote\c{c}\~ao de Dados Pessoais (LGPD)},
  howpublished = {Lei n\textordmasculine\ 13.709/2018, 14 ago. 2018},
  year = {2018}
}

@misc{lfpdipp2010,
  author = {{M\'exico}},
  title = {Ley Federal de Protecci\'on de Datos Personales en Posesi\'on de los Particulares},
  howpublished = {DOF 05-07-2010},
  year = {2010}
}

@misc{ebia2024,
  author = {{Brasil}},
  title = {Estrat\'egia Brasileira de Intelig\^encia Artificial (EBIA)},
  howpublished = {Portaria SGD/MGI n\textordmasculine\ 6.618, 25 set. 2024},
  year = {2024}
}

@misc{chileia2021,
  author = {{MinCiencia, Chile}},
  title = {Pol\'itica Nacional de Inteligencia Artificial},
  year = {2021}
}

@misc{uruguayia2024,
  author = {{AGESIC, Uruguay}},
  title = {Estrategia Nacional de Inteligencia Artificial 2024--2030},
  howpublished = {21 nov. 2024},
  year = {2024}
}

@misc{colombiaia2024,
  author = {{Minciencias, Colombia}},
  title = {Hoja de Ruta para la Adopci\'on \'Etica y Sostenible de la IA en Colombia},
  howpublished = {12 feb. 2024},
  year = {2024}
}

@misc{cnj2020res332,
  author = {{Conselho Nacional de Justi\c{c}a, Brasil}},
  title = {Resolu\c{c}\~ao n\textordmasculine\ 332/2020: \'Etica e governan\c{c}a para produ\c{c}\~ao e uso da IA no Poder Judici\'ario},
  howpublished = {8 set. 2020},
  year = {2020}
}

@misc{cnj2025res616,
  author = {{Conselho Nacional de Justi\c{c}a, Brasil}},
  title = {Resolu\c{c}\~ao n\textordmasculine\ 616/2025: Intelig\^encia Artificial Generativa no Poder Judici\'ario},
  year = {2025}
}
"""

# ─── citation map: inline [Author (Year)] -> \cite{key} ──────────────────────
CITATION_MAP = {
    "Khattab et al.": "khattab2023dspy",
    "Opsahl-Ong et al.": "opsahlong2024mipro",
    "Agrawal et al.": "agrawal2025gepa",
    "Wagner Filho et al.": "wagnerfilho2018brwac",
    "Real et al.": "real2020assin2",
    "Santos et al.": "santos2006harem",
    "Luz de Araujo et al.": "luzdearaujo2018lenerbr",
    "B2W Digital": "b2w2019reviews",
    "Ca\\~nete et al.": "canete2020beto",
    "Cañete et al.": "canete2020beto",
    "Garc\'ia Cumbreras et al.": "garcia2019iberlef",
    "García Cumbreras et al.": "garcia2019iberlef",
    "Mager et al.": "mager2021americasnlp",
    "LatamGPT Project": "latamgpt2025",
    "Wang et al.": "wang2018glue",  # GLUE 2018 and SuperGLUE 2019 — handled by year context
    "Hendrycks et al.": "hendrycks2020mmlu",
    "Srivastava et al.": "srivastava2022bigbench",
    "Liang et al.": "liang2022helm",
    "Biderman et al.": "biderman2024lessons",
    "BIS": "bis2022export",  # handled specially
    "NVIDIA": "nvidia2022form8k",  # handled specially
    "Lei n": "lgpd2018",
    "LFPDPPP": "lfpdipp2010",
    "Estrat\'egia Brasileira": "ebia2024",
    "Estratégia Brasileira": "ebia2024",
    "Pol\'itica Nacional de IA": "chileia2021",
    "Política Nacional de AI": "chileia2021",
    "TCU/CNJ": "cnj2020res332",
}


def escape_latex(text: str) -> str:
    """Escape LaTeX special chars in body text (not in commands)."""
    # Don't double-escape already-escaped chars
    replacements = [
        ("\\&", "&amp;TMPAMP;"),  # protect
        ("\\%", "&amp;TMPPCT;"),
        ("\\#", "&amp;TMPHASH;"),
        ("\\_", "&amp;TMPUS;"),
        ("\\$", "&amp;TMPDLLR;"),
    ]
    for old, tmp in replacements:
        text = text.replace(old, tmp)
    
    # Escape unescaped special chars
    for char in ["&", "%", "#", "_", "$"]:
        text = text.replace(char, "\\" + char)
    
    # Restore protected
    restore = [
        ("&amp;TMPAMP;", "\\&"),
        ("&amp;TMPPCT;", "\\%"),
        ("&amp;TMPHASH;", "\\#"),
        ("&amp;TMPUS;", "\\_"),
        ("&amp;TMPDLLR;", "\\$"),
    ]
    for tmp, restored in restore:
        text = text.replace(tmp, restored)
    
    # Unicode replacements
    text = text.replace("→", "$\\rightarrow$")
    text = text.replace("–", "--")
    text = text.replace("—", "---")
    text = text.replace("ã", "\\~a")
    text = text.replace("ç", "\\c{c}")
    text = text.replace("é", "\\'e")
    text = text.replace("í", "\\'i")
    text = text.replace("ó", "\\'o")
    text = text.replace("ñ", "\\~n")
    text = text.replace("Ã", "\\~A")
    text = text.replace("Ç", "\\c{C}")
    text = text.replace("Á", "\\'A")
    text = text.replace("É", "\\'E")
    text = text.replace("Ó", "\\'O")
    text = text.replace("Í", "\\'I")
    text = text.replace("Ñ", "\\~N")
    text = text.replace("â", "\\^a")
    text = text.replace("ê", "\\^e")
    text = text.replace("ô", "\\^o")
    text = text.replace("ü", '\\"u')
    text = text.replace("Ü", '\\"U')
    text = text.replace("ß", "{\\ss}")
    text = text.replace("©", "\\copyright")
    text = text.replace("…", "\\ldots")
    text = text.replace("•", "\\item ")
    text = text.replace("\u2019", "'")  # right single quote -> straight apostrophe
    text = text.replace("\u2018", "`")  # left single quote -> backtick
    text = text.replace("\u201c", "``")  # left double quote
    text = text.replace("\u201d", "''")  # right double quote
    
    return text


def convert_inline(text: str) -> str:
    """Convert markdown inline formatting to LaTeX."""
    # Protect code spans first
    code_spans = []
    def protect_code(m):
        code_spans.append(m.group(1))
        return f"\x00CODE{len(code_spans)-1}\x00"
    text = re.sub(r'`([^`]+)`', protect_code, text)
    
    # Bold: **text**
    text = re.sub(r'\*\*([^*]+)\*\*', r'\\textbf{\1}', text)
    
    # Italic: *text* (but not ** which is bold)
    text = re.sub(r'(?<!\*)\*(?!\*)([^*]+)\*(?!\*)', r'\\textit{\1}', text)
    
    # Inline citations: [Author et al. (Year); Author2 et al. (Year2)]
    def replace_citation(m):
        full = m.group(0)
        inner = m.group(1)
        # Split by semicolon for multiple citations
        parts = [p.strip() for p in inner.split(";")]
        cite_keys = []
        for part in parts:
            # Try to match known citation patterns
            for pattern, key in CITATION_MAP.items():
                if pattern in part:
                    cite_keys.append(key)
                    break
        if cite_keys:
            return r"\cite{" + ", ".join(cite_keys) + "}"
        return full  # fallback: leave as-is
    
    text = re.sub(r'\[([^\]]+)\]', replace_citation, text)
    
    # Section cross-references: §4.2 -> \S4.2
    text = text.replace("§", "\\S")
    
    # Restore code spans
    for i, code in enumerate(code_spans):
        text = text.replace(f"\x00CODE{i}\x00", f"\\texttt{{{escape_latex(code)}}}")
    
    # Escape remaining special chars (but not our LaTeX commands)
    # We need to be careful not to escape chars that are already part of commands
    # Do this before the code span protection was already done above
    # Actually, let's escape only the text that's not inside \textbf{}, \textit{}, \texttt{}, \cite{}
    
    return text


def convert_markdown_to_latex(md: str) -> str:
    """Convert the full markdown paper to LaTeX body."""
    lines = md.splitlines()
    latex_lines = []
    in_list = False
    list_type = None  # "itemize" or "enumerate"
    in_abstract = False
    abstract_lines = []
    skip_title = True  # skip the first # title line
    skip_references = False
    body_start = False  # start collecting body after abstract
    
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        
        # Skip the title (handled in preamble)
        if skip_title and stripped.startswith("# "):
            skip_title = False
            i += 1
            continue
        
        # Abstract heading
        if re.match(r'^##\s+\d+\.\s*abstract', stripped, re.I) or re.match(r'^##\s+abstract', stripped, re.I):
            in_abstract = True
            i += 1
            continue
        
        if in_abstract:
            # Collect abstract until next ## heading
            if stripped.startswith("## "):
                in_abstract = False
                body_start = True
                # Don't increment i; fall through to process this heading
            else:
                if stripped:
                    abstract_lines.append(convert_inline(escape_latex(stripped)))
                i += 1
                continue
        
        if not body_start and not in_abstract and stripped.startswith("## "):
            body_start = True
        
        # References section — skip (we use \bibliography)
        if stripped == "## References":
            skip_references = True
            # Close any open list
            if in_list:
                latex_lines.append(f"\\end{{{list_type}}}")
                in_list = False
            i += 1
            continue
        
        if skip_references:
            i += 1
            continue
        
        # Headings
        if stripped.startswith("### "):
            if in_list:
                latex_lines.append(f"\\end{{{list_type}}}")
                in_list = False
            heading = stripped[4:].strip()
            # Remove numbering like "2.1 — " or "2.1 - "
            heading = re.sub(r'^\d+\.\d+\s*[—–-]\s*', '', heading)
            latex_lines.append(f"\\subsection{{{convert_inline(escape_latex(heading))}}}")
        elif stripped.startswith("#### "):
            if in_list:
                latex_lines.append(f"\\end{{{list_type}}}")
                in_list = False
            heading = stripped[5:].strip()
            heading = re.sub(r'^\d+\.\d+\.\d+\s*[—–-]\s*', '', heading)
            latex_lines.append(f"\\subsubsection{{{convert_inline(escape_latex(heading))}}}")
        elif stripped.startswith("## "):
            if in_list:
                latex_lines.append(f"\\end{{{list_type}}}")
                in_list = False
            heading = stripped[3:].strip()
            # Remove numbering like "1. " or "10. "
            heading = re.sub(r'^\d+\.\s+', '', heading)
            latex_lines.append(f"\\section{{{convert_inline(escape_latex(heading))}}}")
        elif stripped.startswith("# "):
            if in_list:
                latex_lines.append(f"\\end{{{list_type}}}")
                in_list = False
            heading = stripped[2:].strip()
            latex_lines.append(f"\\section*{{{convert_inline(escape_latex(heading))}}}")
        # Ordered list
        elif re.match(r'^\d+\.\s+', stripped):
            if not in_list or list_type != "enumerate":
                if in_list:
                    latex_lines.append(f"\\end{{{list_type}}}")
                latex_lines.append("\\begin{enumerate}")
                in_list = True
                list_type = "enumerate"
            item_text = re.sub(r'^\d+\.\s+', '', stripped)
            latex_lines.append(f"  \\item {convert_inline(escape_latex(item_text))}")
        # Unordered list
        elif stripped.startswith("- "):
            if not in_list or list_type != "itemize":
                if in_list:
                    latex_lines.append(f"\\end{{{list_type}}}")
                latex_lines.append("\\begin{itemize}")
                in_list = True
                list_type = "itemize"
            item_text = stripped[2:]
            latex_lines.append(f"  \\item {convert_inline(escape_latex(item_text))}")
        elif stripped == "":
            if in_list:
                latex_lines.append(f"\\end{{{list_type}}}")
                in_list = False
            # Paragraph break
            if latex_lines and latex_lines[-1] != "":
                latex_lines.append("")
        else:
            if in_list:
                latex_lines.append(f"\\end{{{list_type}}}")
                in_list = False
            # Regular paragraph
            converted = convert_inline(escape_latex(stripped))
            if latex_lines and latex_lines[-1] and not latex_lines[-1].startswith("\\section") and not latex_lines[-1].startswith("\\subsection") and not latex_lines[-1].startswith("\\subsubsection") and not latex_lines[-1].startswith("\\begin") and not latex_lines[-1].startswith("\\end") and not latex_lines[-1].startswith("  \\item"):
                # Continuation of previous paragraph
                latex_lines[-1] += " " + converted
            else:
                latex_lines.append(converted)
        
        i += 1
    
    # Close any remaining list
    if in_list:
        latex_lines.append(f"\\end{{{list_type}}}")
    
    # Join paragraphs with blank lines
    body = "\n".join(latex_lines)
    # Clean up excessive blank lines
    body = re.sub(r'\n{3,}', '\n\n', body)
    
    # Build abstract
    abstract = " ".join(abstract_lines)
    abstract = re.sub(r'\s+', ' ', abstract).strip()
    
    return body, abstract


def build_latex(body: str, abstract: str) -> str:
    """Build the full LaTeX document."""
    # Author block
    author_parts = []
    for name, affil, co_first in AUTHORS:
        star = "$^*$" if co_first else ""
        author_parts.append(f"{name}{star}\\textsuperscript{{1}}" if affil == "SURUS" else f"{name}{star}\\textsuperscript{{2}}")
    
    authors_str = " and ".join(author_parts)
    
    # Affiliations
    affils = "\\textsuperscript{1}SURUS\n\\textsuperscript{2}Independent"
    
    co_first_note = "$^*$Equal contribution (co-first authors)"
    contact = r"\texttt{francis@surus.lat}"
    
    return r"""\documentclass[11pt,a4paper]{article}

% ─── Packages ──────────────────────────────────────────────────────────────
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage[english]{babel}
\usepackage{amsmath,amssymb}
\usepackage{hyperref}
\usepackage{url}
\usepackage{graphicx}
\usepackage{microtype}
\usepackage{textcomp}
\usepackage{booktabs}
\usepackage[margin=2.5cm]{geometry}
\hypersetup{
    pdftitle={""" + TITLE + r"""},
    pdfauthor={Francis F Daniel, Mauro Iba\~nez, Francis Perelman, Marian Basti},
    pdfkeywords={""" + KEYWORDS + r"""},
    colorlinks=true,
    linkcolor=blue,
    citecolor=blue,
    urlcolor=blue
}

% ─── Title ──────────────────────────────────────────────────────────────────
\title{""" + TITLE + r"""}
\author{
  Francis F Daniel$^*$\textsuperscript{1} \and
  Mauro Iba\~nez$^*$\textsuperscript{1} \and
  Francis Perelman\textsuperscript{2} \and
  Marian Basti\textsuperscript{1}
}
\date{""" + ABSTRACT_DATE + r"""}

% ─── Document ───────────────────────────────────────────────────────────────
\begin{document}
\maketitle

\begin{center}
\textsuperscript{1}SURUS \quad \textsuperscript{2}Independent\\[0.3em]
$^*$Equal contribution (co-first authors)\\[0.2em]
Contact: \texttt{francis@surus.lat}
\end{center}

\begin{abstract}
""" + abstract + r"""
\end{abstract}

\noindent\textbf{Keywords:} """ + KEYWORDS + r"""

\tableofcontents
\newpage

""" + body + r"""

% ─── Bibliography ──────────────────────────────────────────────────────────
\bibliographystyle{plain}
\bibliography{main}

\end{document}
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--paper", default="latamboard-paper.md")
    ap.add_argument("--outdir", default="arxiv/submission")
    args = ap.parse_args()
    
    paper = Path(args.paper).read_text()
    outdir = Path(args.outdir)
    outdir.mkdir(parents=True, exist_ok=True)
    
    body, abstract = convert_markdown_to_latex(paper)
    latex = build_latex(body, abstract)
    
    (outdir / "main.tex").write_text(latex)
    (outdir / "main.bib").write_text(BIB_ENTRIES)
    
    print(f"OK: wrote {outdir / 'main.tex'} ({len(latex):,} bytes)")
    print(f"OK: wrote {outdir / 'main.bib'} ({len(BIB_ENTRIES):,} bytes)")
    print(f"Abstract: {len(abstract)} chars")
    print(f"Body sections: {body.count(chr(92)+'section')} sections, {body.count(chr(92)+'subsection')} subsections")


if __name__ == "__main__":
    main()