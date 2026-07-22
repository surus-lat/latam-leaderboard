#!/usr/bin/env bash
# scripts/render-about.sh — one-shot rebuild of public/about.html from latamboard-paper.md.
#
# Pipeline (each step is fast and idempotent; bails on the first failure):
#   1. Run the Quarto build script (latamboard-paper.md + about-metadata.json -> public/about.html)
#   2. Inject the React-app navbar script tag (npm run inject-nav)
#   3. Lint the repo (npm run lint) — catches anything else that broke
#   4. Sanity-check the rendered HTML:
#        - title contains the expected prefix ("LatamBoard: ")
#        - "Last modified" badge is present
#        - "Equal contribution" co-first note is present
#        - "Contact authors at:" line is present
#        - <script src="/nav-injector.js"></script> is present (was injected in step 2)
#        - 10 body <h2 class="anchored"> sections + the Citation appendix
#   5. Print what to do next: `npm run preview` to eyeball, then commit public/about.html.
#
# Usage:
#   ./scripts/render-about.sh                       # default paths (run from repo root)
#   ./scripts/render-about.sh --preview             # also start `npm run preview` after a clean build
#   ./scripts/render-about.sh --keep-workdir        # pass --keep-workdir through to the Quarto build
#
# Requires: quarto on PATH (>=1.4), python3, node/npm. Tested with Quarto 1.8.x.
#
# Run this from the repo root. The skill at
# .claude/skills/render-about-from-paper/SKILL.md is the long-form docs.

set -euo pipefail

# ---------- args ----------
PREVIEW=0
KEEP_WORKDIR=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --preview)       PREVIEW=1; shift ;;
    --keep-workdir)  KEEP_WORKDIR="--keep-workdir"; shift ;;
    -h|--help)
      sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *) echo "unknown arg: $1" >&2; exit 64 ;;
  esac
done

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

PAPER="latamboard-paper.md"
META=".claude/skills/render-about-from-paper/scripts/about-metadata.json"
OUT="public/about.html"
BUILD=".claude/skills/render-about-from-paper/scripts/build_about.py"

# ---------- preflight ----------
for f in "$PAPER" "$META" "$BUILD"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: required input missing: $f" >&2
    exit 1
  fi
done

if ! command -v quarto >/dev/null 2>&1; then
  echo "ERROR: quarto not found on PATH. Install from https://quarto.org" >&2
  exit 1
fi

# ---------- 1. Quarto build ----------
echo "==> 1/4 rendering $PAPER -> $OUT via Quarto"
python3 "$BUILD" \
  --paper "$PAPER" \
  --metadata "$META" \
  --out "$OUT" \
  $KEEP_WORKDIR

# ---------- 2. Inject navbar ----------
echo "==> 2/4 injecting React navbar script tag"
npm run --silent inject-nav

# ---------- 3. Lint ----------
echo "==> 3/4 linting repo"
npm run --silent lint

# ---------- 4. Sanity-check the rendered HTML ----------
echo "==> 4/4 sanity-checking $OUT"

fail=0

check() {
  local label="$1"; local pattern="$2"; local expected="${3:-1}"
  local count
  count=$(grep -c "$pattern" "$OUT" 2>/dev/null || echo 0)
  if [[ "$count" -ne "$expected" ]]; then
    echo "  FAIL  $label  (expected $expected match(es) for /$pattern/, got $count)"
    fail=1
  else
    echo "  ok    $label"
  fi
}

check "title has LatamBoard: prefix" 'class="title">LatamBoard: ' 1
check "Last modified badge"          'Last modified'               1
check "Equal contribution note"      'Equal contribution'          1
check "Contact authors line"         'Contact authors at:'         1
check "navbar script injected"       '<script src="/nav-injector.js"></script>' 1
check "10 body sections"             '<h2 class="anchored"'       10
check "Citation appendix heading"    'quarto-appendix-heading">Citation' 1

if [[ "$fail" -ne 0 ]]; then
  echo
  echo "Sanity checks failed. Re-run with --keep-workdir and inspect the temp .qmd + Quarto stderr." >&2
  exit 1
fi

# ---------- next steps ----------
echo
echo "All good. Next:"
echo "  1. (recommended) npm run build && npm run preview  — eyeball /about.html"
echo "  2. git add public/about.html"
echo "  3. git commit -m 'docs(about): render About page from latamboard-paper.md'"
echo
echo "Do NOT commit latamboard-paper.md unless explicitly asked — the manuscript"
echo "source and the rendered page are versioned independently here."

if [[ "$PREVIEW" -eq 1 ]]; then
  echo
  echo "Starting npm run preview (Ctrl+C to stop)…"
  npm run preview
fi
