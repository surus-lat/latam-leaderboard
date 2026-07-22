---
name: arxiv-publish
description: Use when preparing the LatamBoard paper for arXiv submission — converting markdown to LaTeX, compiling PDF, running evals, and packaging the submission tarball. Triggers on "submit to arxiv", "prepare arxiv package", "publish paper on arxiv", "arxiv submission".
---

# Publish the LatamBoard paper to arXiv

## What this skill does

Converts `latamboard-paper.md` into an arXiv-ready LaTeX submission package:
`main.tex` + `main.bib` (source files for arXiv), plus a locally compiled `main.pdf` for preview.

## Prerequisites

- **tectonic** on PATH (`brew install tectonic`, ~20MB). Lightweight LaTeX engine
  that downloads packages on demand. No MacTeX/GH anymore.
- **python3** (any 3.x). No third-party Python deps.

## Workflow — one shot

```bash
./arxiv/build.sh
```

This runs, in order:
1. `python3 arxiv/convert_to_latex.py` — markdown → LaTeX conversion
2. `tectonic main.tex` — compile PDF (downloads packages on first run)
3. `tar -czf arxiv/latamboard.tar.gz` — flat submission tarball
4. Sanity checks: title, abstract, sections, bib entries, PDF size

Flags:
- `--keep-intermediates` — keep `.aux`, `.log`, `.blg` for debugging.

## Manual flow (debugging only)

```bash
# 1. Convert
python3 arxiv/convert_to_latex.py --paper latamboard-paper.md --outdir arxiv/submission

# 2. Compile (run inside submission dir)
cd arxiv/submission && tectonic main.tex

# 3. Eval
python3 arxiv/eval_submission.py --dir arxiv/submission --strict

# 4. Package
tar -czf arxiv/latamboard.tar.gz -C arxiv/submission main.tex main.bib
# NOTE: arXiv compiles the PDF from your source — do NOT include main.pdf in the tarball.
```

## Eval (deterministic, $0)

```bash
python3 arxiv/eval_submission.py --strict
```

10 check groups, ~40 individual checks: file existence, LaTeX structure,
title correctness, section count, bibliography entries, citation resolution,
PDF validity, abstract content, formatting issues (unrendered markdown,
duplicated sentences), and arXiv-specific constraints (no fontspec, inputenc
utf8, hyperref). Exit 0 = pass, 1 = fail.

## Submission metadata

`arxiv/arxiv-metadata.json` carries the arXiv submission metadata:
- **Primary category**: `cs.AI`
- **Secondary categories**: `cs.CL`, `cs.CY`
- **License**: `arXiv` (default non-exclusive)
- **Comments**: "Position paper. 10 sections, 31 references."

When submitting at https://arxiv.org/submit, copy fields from this JSON.

## What the conversion handles

- Markdown headings → `\section`, `\subsection`, `\subsubsection`
- `**bold**` → `\textbf{}`, `*italic*` → `\textit{}`, `` `code` `` → `\texttt{}`
- Inline citations `[Author et al. (Year)]` → `\cite{key}`
- Ordered/unordered lists → `enumerate`/`itemize`
- Unicode (arrows, en/em-dashes, accented chars) → LaTeX equivalents
- References section → `.bib` file with proper BibTeX entries
- Section numbering stripped (LaTeX handles numbering)

## What the conversion does NOT handle (yet)

- Figures/images (paper has none currently)
- Tables (paper has none currently)
- Footnotes
- `§` cross-references are converted to `\S` but not linked

## Common pitfalls

| Pitfall | Fix |
|---|---|
| tectonic fails to download packages | Check network. First run downloads ~100MB of TeX packages. |
| `Overfull \hbox` warnings | Cosmetic, not blocking. The paper has long URLs. |
| BibTeX "empty booktitle" warning | Some entries (AmericasNLP findings) have no formal booktitle. Not blocking. |
| Citation key mismatch | The conversion script maps `[Author et al. (Year)]` patterns to bib keys. If a citation isn't resolved, check `CITATION_MAP` in `convert_to_latex.py`. |
| PDF is too small | Check that tectonic actually compiled (not just ran BibTeX). The PDF should be >90KB for this paper. |

## Committing

Commit only the source files, not the compiled output:
```bash
git add arxiv/convert_to_latex.py arxiv/build.sh arxiv/eval_submission.py arxiv/arxiv-metadata.json
git commit -m "[ADD] arxiv: submission pipeline for LatamBoard paper"
```

Do NOT commit `arxiv/submission/main.pdf` or `arxiv/latamboard.tar.gz` — they are
build artifacts. Add them to `.gitignore` if needed.

## After submission

Once the paper is accepted on arXiv, update:
1. `about-metadata.json` — add the arXiv ID to the citation URL
2. Re-render `public/about.html` via `./scripts/render-about.sh`
3. Commit the updated about page