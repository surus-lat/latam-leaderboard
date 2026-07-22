---
name: render-about-from-paper
description: Use when regenerating the whole About page from the paper manuscript — i.e. turning the full content of latamboard-paper.md into public/about.html via Quarto and committing it. This is the wholesale-rebuild path (new abstract + all sections at once), distinct from the surgical single-field edits in `update-paper-about`. Triggers on phrases like "rebuild the about page from the paper", "render latamboard-paper.md into the about section", "regenerate the manuscript", "turn the paper markdown into about.html", "the paper changed, update the about page".
---

# Render the About page from latamboard-paper.md (via Quarto)

## What this skill does

`latamboard-paper.md` (repo root) is the human-editable manuscript. The public
About page at `public/about.html` is a **Quarto-rendered, self-contained HTML**
document (banner title block, embedded assets, ~2 MB). This skill regenerates
that HTML from the markdown, end to end, and verifies the result before any
commit happens.

The full manuscript (`## 0. abstract` + numbered `## 1.` … `## 10.` sections +
`## References`) is rendered **verbatim** — every section, in order. Editorial
condensation is NOT this skill's job; if you want a shortened About page,
that's a manual editorial pass.

**Pick the right skill:**
- Changing one field (fix a typo in the abstract, add one author, bump the date)
  → use `update-paper-about` (surgical edit on the existing HTML). Faster, no render.
- The paper body changed / you want the whole page rebuilt from the `.md`
  → **this skill**.

## Why it's a render, not hand-editing

The paper carries the title, abstract, and body. It does **not** carry authors,
affiliations, date, keywords, or the citation — that stable metadata lives in
`scripts/about-metadata.json` (bundled with this skill). The build script fuses
the two into a temporary `.qmd`, runs `quarto render`, and re-applies three
hand-authored ornaments Quarto won't emit on its own (the co-first-author `*`,
the "Equal contribution" + contact block, and the relabel of "Modified" →
"Last modified"). The `.qmd` is disposable — the committed artifact is
`public/about.html`, matching the repo's existing convention that the rendered
HTML is the source of truth.

## Prerequisites

- **Quarto** on PATH (`quarto --version`, tested with 1.8.x). If missing,
  install from <https://quarto.org> before proceeding — the render cannot run
  without it.
- **python3** (any recent 3.x) and **node/npm** (the repo's existing toolchain).
- Run everything from the repo root (`/Users/dobleefe/latam-leaderboard`).

## Paper structure this script expects

The extractor at `scripts/build_about.py:extract()` is forgiving but has
expectations. As of this writing, `latamboard-paper.md` looks like:

```
# On the missing benchmarks layer and a potential solution
## 0. abstract
<one or more paragraphs of abstract>
## 1. introduction
<paragraphs>
...
## 10. invitation to contribute
## References
- Khattab, O., et al. (2023). ...
- ...
```

What's supported:
- `# Title` is required (one only).
- The abstract heading matches `\d+\.\s*abstract\b` (case-insensitive). `## Abstract`
  and `## 0. abstract` both work; the trailing `---` rule that an older version
  of the paper used is **not** required.
- Body sections start with `## ` followed by anything that isn't the abstract
  heading — numbered (`## 1. …`) and unnumbered (`## …`) both work.
- `## References` is rendered as a Quarto **appendix** ("Citation") — same as
  the previously committed About page did, no special handling needed.

If you change the structure in a way the extractor can't parse, the script
exits with a specific error naming the block it couldn't find — fix the
extractor's regexes (small, self-documenting) or revert the paper.

## Workflow — one shot

The repo ships a wrapper that runs the entire pipeline (build → inject-nav →
lint → sanity checks) and prints exactly what to do next:

```bash
./scripts/render-about.sh
```

That command, in order:

1. Runs `python3 .claude/skills/render-about-from-paper/scripts/build_about.py`
   with the default `--paper`, `--metadata`, `--out` paths.
2. Runs `npm run inject-nav` to graft the `<script src="/nav-injector.js">` tag.
3. Runs `npm run lint`.
4. Greps the rendered HTML for the seven must-have markers and exits non-zero
   on any miss.

Add `--preview` to also run `npm run preview` after a clean build, so you can
eyeball `/about.html` immediately. Add `--keep-workdir` to leave the temp
`.qmd` + Quarto stderr behind for debugging.

### Manual flow (if you don't want the wrapper)

```bash
python3 .claude/skills/render-about-from-paper/scripts/build_about.py \
  --paper latamboard-paper.md \
  --metadata .claude/skills/render-about-from-paper/scripts/about-metadata.json \
  --out public/about.html

npm run inject-nav
npm run lint
npm run build && npm run preview    # eyeball /about.html
```

### After a clean render — commit

The wrapper's last lines print the exact commands, but the short version:

```bash
git add public/about.html
git commit -m "docs(about): render About page from latamboard-paper.md"
```

- Commit **`public/about.html` only**. Do NOT commit `latamboard-paper.md`
  unless the user explicitly asks; the manuscript source and the rendered page
  are versioned independently here.
- Include `scripts/about-metadata.json` in the commit **only** if you changed
  it (authors / date / keywords).
- Leave pushing to the user unless told otherwise.

## Editing authors, affiliations, date, or keywords

Those come from `scripts/about-metadata.json`, not the paper `.md`. Edit the
JSON, re-run the build. Co-first authors get `"co_first": true`. The current
metadata is:

```json
{
  "title_prefix": "LatamBoard: ",
  "date": "2026-06-23",
  "keywords": ["AI", "Benchmarks", "Latin America", "Evals Hub", "multipolar AI"],
  "theme": "cosmo",
  "authors": [
    { "name": "Mauro Ibañez",     "affiliation": "SURUS",       "co_first": true  },
    { "name": "Francis F Daniel", "affiliation": "SURUS",       "co_first": true  },
    { "name": "Marian Basti",     "affiliation": "SURUS" },
    { "name": "Francis Perelman", "affiliation": "Independent" }
  ],
  "co_first_note": "Equal contribution (co-first authors)",
  "contact_email": "francis@surus.lat",
  "citation": { "type": "webpage", "container_title": "LatamBoard", "url": "https://latamboard.ai" }
}
```

Theme lives in the same file (`"theme": "cosmo"`).

## What the build script handles for you

- Extracts `# Title`, the abstract (any heading style), and the full `## …`
  body. Tolerates numbered and unnumbered section headings; tolerates the
  absence of a `---` rule after the abstract.
- Strips standalone `---` section separators so the page reads as one continuous
  manuscript.
- Emits Quarto frontmatter (banner title block, left TOC, self-contained
  `embed-resources`, citation) and renders in a temp dir (required —
  `embed-resources` breaks with `--output-dir`, so it renders in place and
  copies the result out).
- Post-render patch: co-first `<sup>*</sup>`, the "Equal contribution" + contact
  block, relabels "Modified" → "Last modified", drops the redundant "Published"
  row. All patches are idempotent and keyed on Quarto's markup.

## Common pitfalls

| Pitfall | Consequence / fix |
|---|---|
| Skipping `npm run inject-nav` after the render | The page loses the site navbar (Quarto output has no nav). The wrapper runs it automatically — run it manually if you bypass the wrapper. |
| Committing `latamboard-paper.md` | The manuscript source isn't meant to ship with the site build. Commit only `public/about.html` unless asked. |
| Editing `src/pages/About.tsx` for content | That route only `window.location.href`s to `/about.html`. Content lives in the HTML. |
| Author/date/keyword changes not showing | Those come from `about-metadata.json`, not the paper `.md`. Edit the JSON, re-run the build. |
| `quarto render failed` | Re-run with `--keep-workdir` (the wrapper supports it) and read the printed work-dir path; the `.qmd` + Quarto stderr are there. Usually a malformed `##` heading in the paper. |
| Theme looks off | `theme` is set in `about-metadata.json` (`cosmo`). Change it there, not in the script. |
| Sanity check fails (one of the seven greps misses) | The wrapper prints which check failed and exits non-zero. Don't commit — re-render or fix the source. |

## If the paper structure changes substantially

The extractor keys on `# Title`, an optional abstract heading matching
`\d+\.\s*abstract\b` (case-insensitive), and the first non-abstract `## `
heading for the body start. If a future manuscript drops the abstract heading
entirely, the extractor falls back to treating the text between the title and
the first `## …` as the abstract; if there's literally no abstract and no
body, it errors out. If you need a new convention (e.g. frontmatter at the
top), update `extract()` in `scripts/build_about.py` — it's small and
self-documenting, and prints a specific error naming which block it couldn't
find.
