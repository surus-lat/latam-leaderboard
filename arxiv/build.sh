#!/usr/bin/env bash
# arxiv/build.sh — build the arXiv submission package from latamboard-paper.md
#
# Pipeline:
#   1. Convert markdown -> LaTeX (arxiv/convert_to_latex.py)
#   2. Compile PDF with tectonic (arXiv requires a compiled PDF)
#   3. Create submission tarball (arxiv/submission/ -> arxiv/latamboard.tar.gz)
#   4. Sanity-check the package
#
# Usage:
#   ./arxiv/build.sh                  # full build
#   ./arxiv/build.sh --keep-intermediates  # keep .aux, .log, etc.
#
# Requires: python3, tectonic (brew install tectonic)

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "$(cd "$(dirname "$0")/.." && pwd)")"
cd "$REPO_ROOT"

KEEP_INTERMEDIATES=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --keep-intermediates) KEEP_INTERMEDIATES="--keep-intermediates"; shift ;;
    -h|--help) sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "unknown arg: $1" >&2; exit 64 ;;
  esac
done

PAPER="latamboard-paper.md"
SUBDIR="arxiv/submission"
OUT_TAR="arxiv/latamboard.tar.gz"

# ---------- 1. Convert ----------
echo "==> 1/4 converting markdown -> LaTeX"
python3 arxiv/convert_to_latex.py --paper "$PAPER" --outdir "$SUBDIR"

# ---------- 2. Compile ----------
echo "==> 2/4 compiling PDF with tectonic"
cd "$SUBDIR"
tectonic $KEEP_INTERMEDIATES main.tex 2>&1 | grep -E "error|Error|Writing|FAIL" || true
if [[ ! -f main.pdf ]]; then
  echo "ERROR: main.pdf not produced" >&2
  exit 1
fi
cd "$REPO_ROOT"

# ---------- 3. Tarball ----------
echo "==> 3/4 creating submission tarball"
# arXiv wants a flat tarball with main.tex, main.bib, main.pdf (and any figures)
# Remove intermediates unless --keep-intermediates
if [[ -z "$KEEP_INTERMEDIATES" ]]; then
  rm -f "$SUBDIR"/main.aux "$SUBDIR"/main.log "$SUBDIR"/main.blg "$SUBDIR"/main.toc "$SUBDIR"/main.out "$SUBDIR"/main.bbl
fi
# arXiv compiles the PDF from source — submit .tex + .bib, NOT the PDF
tar -czf "$OUT_TAR" -C "$SUBDIR" main.tex main.bib
echo "  -> $OUT_TAR ($(du -h "$OUT_TAR" | cut -f1))"

# ---------- 4. Sanity checks ----------
echo "==> 4/4 sanity-checking submission"

fail=0
check() {
  local label="$1"; local pattern="$2"; local expected="${3:-1}"
  local file="$4"
  local count
  count=$(grep -c "$pattern" "$file" 2>/dev/null || echo 0)
  if [[ "$count" -lt "$expected" ]]; then
    echo "  FAIL  $label  (expected >=$expected in $(basename $file), got $count)"
    fail=1
  else
    echo "  ok    $label"
  fi
}

check "title in tex"        'On the missing benchmarks layer' 1 "$SUBDIR/main.tex"
check "abstract in tex"     '\\begin{abstract}' 1 "$SUBDIR/main.tex"
check "sections in tex"     '\\section{' 10 "$SUBDIR/main.tex"
check "bibliography"        '\\bibliography{main}' 1 "$SUBDIR/main.tex"
check "bib entries"         '@article\|@inproceedings\|@misc\|@techreport\|@proceedings' 25 "$SUBDIR/main.bib"
check "PDF compiled locally"      '' 1 "$SUBDIR/main.pdf"

# Check PDF size > 50KB (catches blank/empty PDFs)
pdf_size=$(stat -f%z "$SUBDIR/main.pdf" 2>/dev/null || stat -c%s "$SUBDIR/main.pdf" 2>/dev/null || echo 0)
if [[ "$pdf_size" -lt 50000 ]]; then
  echo "  FAIL  PDF size > 50KB  (got ${pdf_size} bytes)"
  fail=1
else
  echo "  ok    PDF size ($((pdf_size / 1024))KB)"
fi

if [[ "$fail" -ne 0 ]]; then
  echo ""
  echo "Sanity checks failed." >&2
  exit 1
fi

echo ""
echo "All good. Submission package: $OUT_TAR"
echo "Contents: main.tex, main.bib (source only — arXiv compiles the PDF)"
echo ""
echo "Next steps:"
echo "  1. Review the PDF: open $SUBDIR/main.pdf"
echo "  2. Upload to arXiv at https://arxiv.org/submit"
echo "  3. Metadata: cs.AI (primary), cs.CL (secondary)"
echo "  4. Comments field: 'Position paper. 10 sections, 31 references.'"