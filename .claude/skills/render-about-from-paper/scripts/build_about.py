#!/usr/bin/env python3
"""
Render the LatamBoard About page from the paper markdown, via Quarto.

Pipeline:
  latamboard-paper.md  +  about-metadata.json
        -> assemble a temporary manuscript.qmd (frontmatter + full body)
        -> quarto render (self-contained HTML)
        -> patch author ornaments Quarto can't emit natively
        -> write public/about.html

It does NOT run inject-nav or git -- the SKILL drives those steps so a human
stays in the loop before anything is committed. (The repo's `scripts/render-about.sh`
wrapper runs build + inject-nav + a quick sanity check, for one-shot use.)

Usage:
  python3 build_about.py \
      --paper latamboard-paper.md \
      --metadata .claude/skills/render-about-from-paper/scripts/about-metadata.json \
      --out public/about.html \
      [--keep-workdir]        # leave the temp .qmd + _files for inspection

Requires: quarto on PATH (tested with 1.8.x). No third-party Python deps.

Paper structure expected by this script (see latamboard-paper.md):
  # <Title>
  ## <optional abstract heading — "## 0. abstract" or "## Abstract", case-insensitive>
  <abstract body — typically one or more paragraphs>
  ## 1. <section title>
  ...
  ## N. <section title>
  ## References          (optional; rendered as a normal section, included in TOC)

The extractor is forgiving: it accepts both "## Abstract" / "## 0. abstract"
styles, and does NOT require a trailing `---` after the abstract. If neither
an abstract heading nor any body heading is found, it errors loudly so the
caller knows the structure is unrecognized.
"""
import argparse, json, re, shutil, subprocess, sys, tempfile
from pathlib import Path


def extract(paper: str):
    """Pull title, abstract, and full body out of the paper markdown.

    Returns (h1_title, abstract_block, body_block).
    - abstract_block: the text between the abstract heading and the next `##`
      heading, stripped.
    - body_block: every `##` heading + content from the first non-abstract `##`
      heading onward, with standalone `---` rules removed (matches current page
      styling — one continuous manuscript).
    """
    m = re.search(r'^#\s+(.+)$', paper, re.M)
    if not m:
        sys.exit("ERROR: no top-level '# Title' heading found in the paper.")
    h1 = m.group(1).strip()

    # Find the abstract heading. We accept:
    #   ## Abstract
    #   ## 0. abstract
    #   ## Abstract: ...       (anything after the word "abstract" is ignored)
    # We do NOT require a trailing `---` rule — the new paper format omits it.
    # The abstract body extends until the next `## ...` heading.
    am = re.search(
        r'^##\s+(?:\d+\.\s*)?abstract\b.*?\n(.+?)(?=^##\s+)',
        paper, re.M | re.S | re.I,
    )
    if am:
        abstract = am.group(1).strip()
    else:
        # No explicit abstract heading — treat the text between the title and the
        # first `## ...` as the abstract. This keeps the skill useful even if a
        # future manuscript drops the abstract heading entirely.
        bm_pre = re.search(r'^##\s+', paper, re.M)
        if not bm_pre:
            sys.exit("ERROR: no '## ...' section headings found in the paper.")
        abstract = paper[0:bm_pre.start()].strip()
        # Strip the title heading from the abstract block if it's still in there.
        abstract = re.sub(r'^#\s+.+\n?', '', abstract, count=1).strip()
        if not abstract:
            abstract = "(abstract not provided)"

    # Body: from the first `## ...` heading that is NOT the abstract, to EOF.
    bm = re.search(r'^##\s+(?!\d+\.\s*abstract\b)(?!abstract\b)(.+)$',
                   paper, re.M | re.I)
    if not bm:
        # We allow the case where the abstract IS the only `## ...` heading,
        # but then there's nothing to render as the body — error out.
        sys.exit("ERROR: no body sections (## ...) found after the abstract.")
    body = paper[bm.start():].strip()

    # Drop standalone '---' horizontal-rule separators so the rendered page
    # reads as one continuous manuscript (matches current styling).
    body = "\n".join(ln for ln in body.splitlines() if ln.strip() != "---").strip()

    return h1, abstract, body


def indent(block: str, pad="  "):
    return "\n".join(pad + ln if ln.strip() else "" for ln in block.splitlines())


def build_qmd(h1, abstract, body, meta) -> str:
    prefix = meta.get("title_prefix", "")
    title = h1 if h1.lower().startswith(prefix.strip().lower().rstrip(":")) else prefix + h1
    title = title.replace('"', '\\"')

    author_lines = []
    for a in meta["authors"]:
        author_lines.append(f'  - name: {a["name"]}')
        author_lines.append(f'    affiliation: {a["affiliation"]}')
        if a.get("co_first"):
            author_lines.append('    attributes:')
            author_lines.append('      equal-contributor: true')
    authors_yaml = "\n".join(author_lines)

    kw = ", ".join(meta["keywords"])
    cit = meta.get("citation", {})
    citation_yaml = ""
    if cit:
        citation_yaml = (
            "citation:\n"
            f'  type: {cit.get("type", "webpage")}\n'
            f'  container-title: {cit.get("container_title", "LatamBoard")}\n'
            f'  url: {cit.get("url", "")}\n'
        )

    return f'''---
title: "{title}"
date: {meta["date"]}
date-modified: {meta["date"]}
author:
{authors_yaml}
abstract: |
{indent(abstract)}
keywords: [{kw}]
lang: en
title-block-banner: true
format:
  html:
    theme: {meta.get("theme", "cosmo")}
    toc: true
    toc-location: left
    anchor-sections: true
    embed-resources: true
{citation_yaml}---

{body}
'''


def patch_ornaments(html: str, meta) -> str:
    """Re-apply the hand-authored author ornaments so they survive re-renders."""
    # 1. Mark co-first authors' names with a superscript asterisk.
    for a in meta["authors"]:
        if a.get("co_first"):
            name = re.escape(a["name"])
            html = re.sub(
                rf'(<p class="author">){name}\s*(</p>)',
                rf'\g<1>{a["name"]}<sup>*</sup>\g<2>',
                html,
            )

    # 2. Relabel Quarto's "Modified" heading to "Last modified" and drop the
    #    redundant "Published" row (the current page shows only one date).
    html = html.replace(
        '<div class="quarto-title-meta-heading">Modified</div>',
        '<div class="quarto-title-meta-heading">Last modified</div>',
    )
    html = re.sub(
        r'\s*<div>\s*<div class="quarto-title-meta-heading">Published</div>.*?</div>\s*</div>',
        '', html, count=1, flags=re.S,
    )

    # 3. Insert the co-first note + contact block at the end of the author meta
    #    block (idempotent — skip if already present).
    if meta.get("co_first_note") or meta.get("contact_email"):
        parts = []
        if meta.get("co_first_note"):
            parts.append(
                '          <p style="font-size: 0.85em; color: #666; font-style: italic; '
                f'margin-bottom: 0.25em;"><sup>*</sup> {meta["co_first_note"]}</p>'
            )
        if meta.get("contact_email"):
            email = meta["contact_email"]
            parts.append(
                '          <p style="font-size: 0.9em; color: #666;">Contact authors at: '
                f'<a href="mailto:{email}">{email}</a></p>'
            )
        block = (
            '        <div class="quarto-title-meta-author-contact" style="margin-top: 0.5em;">\n'
            + "\n".join(parts)
            + '\n        </div>\n'
        )
        if 'quarto-title-meta-author-contact' not in html:
            # The author meta block <div class="quarto-title-meta-author"> is
            # closed by the last </div> that appears just before the dates block
            # <div class="quarto-title-meta">. Insert our note before that close
            # so it sits at the end of the author column, matching the original.
            marker = '<div class="quarto-title-meta">'
            idx = html.find(marker)
            j = html.rfind('</div>', 0, idx) if idx != -1 else -1
            if j != -1:
                html = html[:j] + block + html[j:]
            else:
                print("WARN: could not locate author meta block to insert contact note.",
                      file=sys.stderr)
    return html


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--paper", required=True)
    ap.add_argument("--metadata", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--keep-workdir", action="store_true")
    args = ap.parse_args()

    if not shutil.which("quarto"):
        sys.exit("ERROR: quarto not found on PATH. Install Quarto (>=1.4) first.")

    paper = Path(args.paper).read_text()
    meta = json.loads(Path(args.metadata).read_text())
    h1, abstract, body = extract(paper)
    qmd = build_qmd(h1, abstract, body, meta)

    workdir = Path(tempfile.mkdtemp(prefix="about-build-"))
    qmd_path = workdir / "manuscript.qmd"
    qmd_path.write_text(qmd)

    # Render in the work dir so embed-resources finds its _files alongside.
    r = subprocess.run(["quarto", "render", "manuscript.qmd", "--to", "html"],
                       cwd=workdir, capture_output=True, text=True)
    if r.returncode != 0:
        sys.stderr.write(r.stdout + r.stderr)
        sys.exit(f"ERROR: quarto render failed (see above). Work dir: {workdir}")

    html = (workdir / "manuscript.html").read_text()
    html = patch_ornaments(html, meta)

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html)

    if not args.keep_workdir:
        shutil.rmtree(workdir, ignore_errors=True)
    else:
        print(f"work dir kept: {workdir}")

    print(f"OK: wrote {out} ({len(html):,} bytes)")
    print("Next: `npm run inject-nav`, then `npm run preview` and visit /about.html, then commit public/about.html.")


if __name__ == "__main__":
    main()
