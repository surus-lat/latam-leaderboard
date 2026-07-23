#!/usr/bin/env python3
"""
arxiv/eval_submission.py — deterministic eval of the arXiv submission package.

Checks structural completeness without LLM calls. Runs in <1 second, costs $0.
Exit 0 = pass, exit 1 = fail. Prints a report.

Usage:
  python3 arxiv/eval_submission.py [--dir arxiv/submission] [--strict]
"""
import argparse, re, sys, os
from pathlib import Path

def check(label, condition, detail=""):
    status = "PASS" if condition else "FAIL"
    print(f"  {status}  {label}" + (f"  ({detail})" if detail and not condition else ""))
    return condition

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", default="arxiv/submission")
    ap.add_argument("--strict", action="store_true", help="treat warnings as failures")
    args = ap.parse_args()
    
    d = Path(args.dir)
    failures = 0
    warnings = 0
    
    print("=" * 60)
    print("arXiv submission eval")
    print("=" * 60)
    
    # ─── File existence ───────────────────────────────────────────────
    print("\n[1] File existence")
    for f in ["main.tex", "main.bib", "main.pdf"]:
        if not check(f"{f} exists", (d / f).exists()):
            failures += 1
    
    # ─── LaTeX structure ─────────────────────────────────────────────
    print("\n[2] LaTeX structure")
    tex = (d / "main.tex").read_text() if (d / "main.tex").exists() else ""
    
    if not check("documentclass present", r"\documentclass" in tex): failures += 1
    if not check("begin{document}", r"\begin{document}" in tex): failures += 1
    if not check("end{document}", r"\end{document}" in tex): failures += 1
    if not check("title defined", r"\title{" in tex): failures += 1
    if not check("author defined", r"\author{" in tex): failures += 1
    if not check("abstract environment", r"\begin{abstract}" in tex): failures += 1
    if not check("tableofcontents", r"\tableofcontents" in tex): failures += 1
    if not check("bibliography command", r"\bibliography{main}" in tex): failures += 1
    
    # ─── Title check ──────────────────────────────────────────────────
    print("\n[3] Title")
    title_match = re.search(r'\\title\{([^}]+)\}', tex)
    if title_match:
        title = title_match.group(1)
        if not check("title is paper title (no LatamBoard: prefix)", 
                     "LatamBoard:" not in title and "missing benchmarks" in title.lower(),
                     f'"{title}"'):
            failures += 1
    else:
        if not check("title extractable", False): failures += 1
    
    # ─── Section count ────────────────────────────────────────────────
    print("\n[4] Sections")
    sections = re.findall(r'\\section\{([^}]+)\}', tex)
    subsections = re.findall(r'\\subsection\{([^}]+)\}', tex)
    subsubsections = re.findall(r'\\subsubsection\{([^}]+)\}', tex)
    
    expected_sections = ["missing benchmark layer", "benchmark layer does",
                         "EvalsHub", "Access Problem", "Multipolar", "open questions",
                         "invitation to contribute"]
    
    if not check(f">= 7 sections (got {len(sections)})", len(sections) >= 7): failures += 1
    if not check(f">= 10 subsections (got {len(subsections)})", len(subsections) >= 10): failures += 1
    
    # Check key sections present
    for expected in expected_sections:
        found = any(expected.lower() in s.lower() for s in sections)
        if not check(f"section: '{expected}'", found):
            if args.strict:
                failures += 1
            else:
                warnings += 1
    
    # ─── Bibliography ─────────────────────────────────────────────────
    print("\n[5] Bibliography")
    bib = (d / "main.bib").read_text() if (d / "main.bib").exists() else ""
    bib_entries = re.findall(r'@\w+\{(\w+),', bib)
    
    if not check(f">= 12 bib entries (got {len(bib_entries)})", len(bib_entries) >= 12): failures += 1
    
    # Check key citations present
    key_cites = ["khattab2023dspy", "opsahlong2024mipro", "agrawal2025gepa",
                "latamgpt2025", "bommasani2021foundationmodels", "liu2022medicalaudit",
                "metaxa2021auditing", "mokander2023auditing"]
    for key in key_cites:
        if not check(f"bib entry: {key}", key in bib):
            if args.strict:
                failures += 1
            else:
                warnings += 1
    
    # ─── Citation resolution ─────────────────────────────────────────
    print("\n[6] Citation resolution")
    cite_keys_used = set(re.findall(r'\\cite\{([^}]+)\}', tex))
    cite_keys_used = {k.strip() for keys in cite_keys_used for k in keys.split(",")}
    bib_keys = set(bib_entries)
    
    missing = cite_keys_used - bib_keys
    if not check("all \\cite keys in .bib", len(missing) == 0, 
                 f"missing: {missing}" if missing else ""):
        if args.strict:
            failures += 1
        else:
            warnings += 1
    
    unused = bib_keys - cite_keys_used
    if unused:
        print(f"  WARN  {len(unused)} unused bib entries: {unused}")
        warnings += 1
    
    # ─── PDF ─────────────────────────────────────────────────────────
    print("\n[7] PDF")
    pdf_path = d / "main.pdf"
    if pdf_path.exists():
        pdf_size = pdf_path.stat().st_size
        if not check(f"PDF > 50KB ({pdf_size // 1024}KB)", pdf_size > 50000): failures += 1
        # Check PDF starts with %PDF
        with open(pdf_path, "rb") as f:
            header = f.read(4)
        if not check("PDF magic bytes", header == b"%PDF"): failures += 1
    else:
        if not check("PDF exists", False): failures += 1
    
    # ─── Abstract check ──────────────────────────────────────────────
    print("\n[8] Abstract")
    abstract_match = re.search(r'\\begin\{abstract\}(.*?)\\end\{abstract\}', tex, re.S)
    if abstract_match:
        abstract = abstract_match.group(1).strip()
        # Strip LaTeX commands for content checking
        abs_plain = re.sub(r'\\[a-zA-Z]+\{([^}]*)\}', r'\1', abstract)  # \textbf{x} -> x
        abs_plain = re.sub(r'\\[a-zA-Z]+', '', abs_plain)  # remaining commands
        abs_plain = abs_plain.replace('$', '').replace('{', '').replace('}', '')
        
        if not check("abstract non-empty (>200 chars)", len(abstract) > 200,
                     f"got {len(abstract)} chars"):
            failures += 1
        if not check("abstract has 'benchmark layer'", "benchmark layer" in abs_plain.lower()):
            if args.strict: failures += 1
            else: warnings += 1
        if not check("abstract has 'EvalsHub'", "evalshub" in abs_plain.lower()):
            if args.strict: failures += 1
            else: warnings += 1
        if not check("abstract has 'LatamBoard'", "latamboard" in abs_plain.lower()):
            if args.strict: failures += 1
            else: warnings += 1
    else:
        if not check("abstract found", False): failures += 1
    
    # ─── Formatting issues ───────────────────────────────────────────
    print("\n[9] Formatting issues")
    
    # Check for raw markdown that wasn't converted
    # Remove math mode first to avoid false positives on $^*$ etc.
    tex_nomath = re.sub(r'\$[^$]*\$', '', tex)
    raw_bold = re.findall(r'\*\*[^*]+\*\*', tex_nomath)
    if raw_bold:
        print(f"  WARN  {len(raw_bold)} unrendered **bold** markers")
        warnings += 1
    
    raw_italic = re.findall(r'(?<!\*)\*(?!\*)[^*{}\n]+\*(?!\*)', tex_nomath)
    # Filter out false positives: $^*$ remnants, \* patterns, short matches
    raw_italic = [m for m in raw_italic if len(m) > 5 and not m.startswith('\\')]
    if raw_italic:
        print(f"  WARN  {len(raw_italic)} unrendered *italic* markers: {raw_italic[:3]}")
        warnings += 1
    
    # Check for duplicated sentences
    sentences = re.findall(r'[A-Z][^.]{20,}\.', tex)
    seen = set()
    dupes = 0
    for s in sentences:
        s_clean = s.strip().lower()
        if s_clean in seen:
            dupes += 1
            print(f"  WARN  duplicated sentence: {s[:60]}...")
        seen.add(s_clean)
    if dupes > 0:
        warnings += 1
    
    if not check("no unrendered markdown", len(raw_bold) == 0 and len(raw_italic) == 0):
        if args.strict: failures += 1
    
    # ─── arXiv-specific ──────────────────────────────────────────────
    print("\n[10] arXiv-specific")
    if not check("no \\usepackage{fontspec} (pdfLaTeX compat)", "fontspec" not in tex):
        if args.strict: failures += 1
        else: warnings += 1
    if not check("inputenc utf8", "inputenc" in tex):
        if args.strict: failures += 1
        else: warnings += 1
    if not check("hyperref for links", "hyperref" in tex):
        if args.strict: failures += 1
        else: warnings += 1
    
    # ─── Summary ─────────────────────────────────────────────────────
    print("\n" + "=" * 60)
    total = failures + warnings
    if failures == 0 and warnings == 0:
        print(f"RESULT: ALL PASS ({total} checks)")
        sys.exit(0)
    elif failures == 0:
        print(f"RESULT: PASS with {warnings} warning(s)")
        sys.exit(0 if not args.strict else 1)
    else:
        print(f"RESULT: FAIL — {failures} failure(s), {warnings} warning(s)")
        sys.exit(1)

if __name__ == "__main__":
    main()