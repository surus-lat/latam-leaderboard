---
name: render-about-from-paper
description: Use when regenerating the whole About page from the paper manuscript — i.e. turning the full content of latamboard-paper.md into public/about.html via Quarto and committing it. This is the wholesale-rebuild path (new abstract + all sections at once), distinct from the surgical single-field edits in `update-paper-about`. Triggers on phrases like "rebuild the about page from the paper", "render latamboard-paper.md into the about section", "regenerate the manuscript", "turn the paper markdown into about.html", "the paper changed, update the about page".
---

# Render the About page from latamboard-paper.md (via Quarto)

## What this skill does

`latamboard-paper.md` (repo root) is the human-editable manuscript. The public
About page at `public/about.html` is a **Quarto-rendered, self-contained HTML**
document (banner title block, embedded assets, ~1.9 MB). This skill regenerates
that HTML from the markdown, end to end, and stops right before the commit so a
human can eyeball the result.

The full manuscript (`## §1 … ## §7` and their `###` subsections) is rendered
**verbatim** — every section, in order. Editorial condensation is NOT this
skill's job; if you want a shortened About page, that's a manual editorial pass.

**Pick the right skill:**
- Changing one field (fix a typo in the abstract, add one author, bump the date)
  → use `update-paper-about` (surgical edit on the existing HTML). Faster, no render.
- The paper body changed / you want the whole page rebuilt from the `.md`
  → **this skill**.

## Why it's a render, not hand-editing

The paper carries the title, abstract, and body. It does **not** carry authors,
affiliations, date, keywords, or the citation — that stable metadata lives in
`scripts/about-metadata.json` (bundled with this skill). The build script fuses
the two into a temporary `.qmd`, runs `quarto render`, and re-applies two
hand-authored ornaments Quarto won't emit on its own (the co-first-author `*`
and the "Equal contribution" + contact block). The `.qmd` is disposable — the
committed artifact is `public/about.html`, matching the repo's existing
convention that the rendered HTML is the source of truth.

## Prerequisites

- **Quarto** on PATH (`quarto --version`, tested with 1.8.x). If missing, install
  from <https://quarto.org> before proceeding — the render cannot run without it.
- Run everything from the repo root (`/Users/dobleefe/latam-leaderboard`).

## Workflow

1. **Confirm the inputs.**
   - `latamboard-paper.md` holds the new content and still has the shape the
     script expects: one `# Title`, a `## Abstract` block ending at a `---` rule,
     then the `## …` body sections. (The script errors loudly if not.)
   - If authors, affiliations, date, keywords, or contact changed, edit
     `.claude/skills/render-about-from-paper/scripts/about-metadata.json`. Mark
     co-first authors with `"co_first": true`. Nothing in the paper `.md` needs
     that metadata.

2. **Build.** From the repo root:
   ```bash
   python3 .claude/skills/render-about-from-paper/scripts/build_about.py \
     --paper latamboard-paper.md \
     --metadata .claude/skills/render-about-from-paper/scripts/about-metadata.json \
     --out public/about.html
   ```
   Add `--keep-workdir` if a render fails and you want to inspect the generated
   `.qmd` and Quarto's error output.

3. **Inject the site nav.** The React navbar is grafted at runtime by a script
   tag that Quarto doesn't know about. Re-add it (idempotent):
   ```bash
   npm run inject-nav
   ```

4. **Preview and verify** before committing:
   ```bash
   npm run build && npm run preview
   ```
   Open the printed URL at `/about.html` (or `/about`, which redirects). Confirm:
   - Title, authors (co-first `*` on the right people), abstract, keywords, and
     the "Last modified" date all look right.
   - Every paper section is present, in order, with the site navbar overlaid.
   - The BibTeX citation appendix at the bottom is present and correct.

5. **Commit — `public/about.html` only.** Do **not** commit
   `latamboard-paper.md` unless the user explicitly asks; the manuscript source
   and the rendered page are versioned independently here.
   ```bash
   git add public/about.html
   git commit -m "docs(about): render About page from latamboard-paper.md"
   ```
   Include `scripts/about-metadata.json` in the commit **only** if you changed it
   (authors/date/etc.). Leave pushing to the user unless told otherwise.

## What the build script handles for you

- Extracts `# Title` (prepends the `title_prefix` from metadata, e.g. `LatamBoard: `),
  the `## Abstract` block, and the full `## …` body.
- Strips standalone `---` section separators so the page reads as one manuscript.
- Emits Quarto frontmatter (banner title block, left TOC, self-contained
  `embed-resources`, citation) and renders in a temp dir (required — `embed-resources`
  breaks with `--output-dir`, so it renders in place and copies the result out).
- Post-render patch: co-first `<sup>*</sup>`, the "Equal contribution" + contact
  block, relabels "Modified" → "Last modified", drops the redundant "Published" row.
  All patches are idempotent and keyed on Quarto's markup.

## Common pitfalls

| Pitfall | Consequence / fix |
|---|---|
| Skipping `npm run inject-nav` after the render | The page loses the site navbar (Quarto output has no nav). Always run it. |
| Committing `latamboard-paper.md` | The manuscript source isn't meant to ship with the site build. Commit only `public/about.html` unless asked. |
| Editing `src/pages/About.tsx` for content | That route only `window.location.href`s to `/about.html`. Content lives in the HTML. |
| Author/date/keyword changes not showing | Those come from `about-metadata.json`, not the paper `.md`. Edit the JSON, re-run the build. |
| `quarto render failed` | Re-run with `--keep-workdir` and read the printed work-dir path; the `.qmd` + Quarto stderr are there. Usually a malformed abstract block (`## Abstract` … `---`) in the paper. |
| Theme looks off | `theme` is set in `about-metadata.json` (`cosmo`). Change it there, not in the script. |

## If the paper structure changes

The extractor keys on `# Title`, `## Abstract` … `---`, and `## …` body headings.
If a future manuscript drops the `---` after the abstract or nests the title
differently, update the regexes in `scripts/build_about.py` (`extract()`), which
is small and self-documenting. The script prints a specific error naming which
block it couldn't find.
