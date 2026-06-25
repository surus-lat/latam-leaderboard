---
name: update-paper-about
description: Use when changing the About page content — title, authors, abstract, body, keywords, date, or citation. The About page is NOT a React component. It is a Quarto-rendered standalone HTML file at public/about.html (~2.9k lines), and the .qmd source is not checked in. Triggers on phrases like "update the abstract", "add an author to the paper", "change the about page", "edit the manuscript", "update the paper".
---

# Update the LatamBoard About page (the paper)

## TL;DR

The About page is a Quarto-rendered standalone HTML file at `public/about.html`. The **`.qmd` source is not committed to this repo**, and there is no `manuscript.md` either — the rendered HTML is the only source you can edit here. Every edit is a surgical text edit on `public/about.html`.

The React route `/about` (in `src/pages/About.tsx`) just `window.location.href`s to `/about.html`.

## Why it works this way

- Original setup: Quarto + AGU paper template → `public/about.html` + `public/nav-injector.js` (client-side React-nav graft) + `scripts/inject-nav.js` (prebuild hook that injects the nav-injector script tag into about.html).
- Whoever produced the Quarto build kept the `.qmd` source elsewhere — it never landed in this repo.
- **Result:** the rendered HTML is the source of truth here. Edit it directly.

Reconstructing the `.qmd` and re-rendering would technically be cleaner, but requires the Quarto CLI + AGU template + matching the existing visual exactly. Not worth doing on a per-edit basis — only if the layout itself needs to change.

## The architecture in 30 seconds

```
public/about.html        (2.9k-line Quarto-rendered AGU paper, source of truth)
    │
    │  (prebuild: scripts/inject-nav.js inserts <script src="/nav-injector.js"></script>)
    ▼
public/about.html        (with nav-injector script tag appended)
    │
    │  (served as static asset by Cloudflare Pages)
    ▼
https://latamboard.ai/about.html
    │
    │  (nav-injector.js graft adds the React app's navbar overlay at runtime)
    ▼
Final rendered page
```

The React route `/about` is just a redirect:
```ts
// src/pages/About.tsx
useEffect(() => { window.location.href = '/about.html' }, [])
```

## Edit zones (all need to stay in sync)

When you change ANY content, check these zones inside `public/about.html`:

| Zone | Approx line range | What to update |
|---|---|---|
| 1. Head meta | ~5–60 | `<title>`, `<meta name="description">`, `<meta name="dcterms.date">`, `<meta name="keywords">`, `<meta name="author">` (one per author) |
| 2. Citation meta | ~2150–2200 | `<meta name="citation_title">`, `<meta name="citation_abstract">`, `<meta name="citation_keywords">`, `<meta name="citation_author">` (one per author) |
| 3. Open Graph + Twitter Card | ~30–60 | `og:title`, `og:description`, `twitter:title`, `twitter:description` |
| 4. Visible H1 title | inside `<body>`, near top | The display title of the paper |
| 5. Author cards | inside `<body>`, just under H1 | One block per author with name + affiliation + ORCID link |
| 6. Abstract | inside `<body>`, after author cards | The displayed abstract paragraph(s) |
| 7. TOC | inside `<body>` | Update only if section titles change |
| 8. Body sections | inside `<body>` | The paper itself |
| 9. BibTeX appendix | bottom of `<body>` | If citations change |

**Skipping any of these creates an inconsistency** — the most painful are #1 vs #4 (the browser tab title says one thing, the page heading says another) and #2 vs #6 (Google Scholar / academic indexers see a different abstract than human readers).

## Recommended editing workflow

1. **Open `public/about.html`** in your editor and search for the exact string you want to change. Edit all occurrences (head + visible + citation meta + OG/Twitter — usually 3–4 matches).
2. **Add or remove an author:** edit all `<meta name="author">` tags, all `<meta name="citation_author">` tags, and the visible author card block. Five edits for one author change.
3. **Rebuild and preview:**
   ```bash
   npm run build       # also runs prebuild → inject-nav.js
   npm run preview
   ```
   Open the printed URL and visit `/about.html` (or `/about` which redirects).
4. **Commit:** include only `public/about.html` (and the i18n/About.tsx only if the redirect logic changes).

## Common mistakes

| Mistake | Why it doesn't work |
|---|---|
| Editing `src/pages/About.tsx` to change the paper content | About.tsx only redirects to `/about.html`. The content lives in the static HTML. |
| Editing only the visible H1 and not the head `<title>` | Browser tab + social shares + Google Scholar all show the stale title. |
| Editing only `<meta name="dcterms.date">` and not `<meta name="citation_date">` | Academic indexers parse the citation_date; the dcterms one is for the human-facing Quarto template. |
| Forgetting to add a new author to `<meta name="citation_author">` | Google Scholar will show an incomplete author list and may de-rank the paper. |
| Running `quarto render` against some local .qmd and overwriting `public/about.html` | If there are unmerged HTML edits from other people, your render clobbers them. The .qmd is not authoritative for this repo. |

## When to bring back the `.qmd` source

If the paper changes often, putting the `.qmd` source in this repo (e.g., as `manuscript.qmd` at the root) + adding `quarto render manuscript.qmd --output-dir public --output about.html` to the build pipeline would make edits much cleaner. Until then, the rendered HTML is the canonical source.
