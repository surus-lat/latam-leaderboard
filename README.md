# LatamBoard

Simple, stylized leaderboard for evaluating LLMs on Spanish, Portuguese, translation, structured extraction, and transcription tasks for Latin America. Built with React, Vite, and TailwindCSS.

## For contributors and AI agents — read this first

Three pieces of LatamBoard's data/content/routing live **outside this repo**. Editing `src/` cannot fix them. Each has a project skill under `.claude/skills/` with the exact workflow + common-mistakes table.

- **Leaderboard data** (rows, scores, task chips, models) lives on Hugging Face: `LatamBoard/leaderboard-results`. The page fetches it at runtime with `cache: 'no-store'`; there is no bundled JSON in this repo and no `fetch:data` step. See `.claude/skills/update-data/SKILL.md`.
- **About page** is a Quarto-rendered standalone HTML at `public/about.html` (~2.9k lines, seven edit zones). The `.qmd` source is not in this repo. See `.claude/skills/update-paper-about/SKILL.md`.
- **URL routing** (redirects, headers, SPA fallback, cache) is configured in the Cloudflare Pages dashboard, not this repo. See `.claude/skills/cloudflare-routing/SKILL.md`.

Adding a new task category? See `update-data` skill, Flow C — you need to update HF data + `TASK_OPTIONS` in `src/pages/Landing.tsx` + the three locale entries in `src/i18n/index.ts`.

## Features

- Landing page with hero and a sortable, filterable results table
  - Chip-style task selector: Spanish, Portuguese, Translation, Structured Extraction, Image Extraction, Transcription
  - `overall_score` is computed client-side as the average over selected-task scores per row
- Tasks page with expandable group cards and per-task cards
- About page (Quarto-rendered manuscript at `/about.html`)
- Submit page to suggest models (client-only)
- Footer links to dataset, Discord, and website

## Stack

- React + Vite + TypeScript
- TailwindCSS (brand tokens in `src/index.css`)
- No backend. All data is fetched from Hugging Face at page load.

## Getting Started

Requirements:
- Node.js 18+

```bash
npm i
npm run dev
```

Open the printed Local URL. Both pages fetch `leaderboard_table.json`, `tasks_groups.json`, and `tasks_list.json` directly from `https://huggingface.co/datasets/LatamBoard/leaderboard-results/` — no data step is required at build or run time.

## Data Source

All leaderboard data is fetched at runtime from:

```
https://huggingface.co/datasets/LatamBoard/leaderboard-results/resolve/main/
```

To change what users see, edit and push the JSON files in that HF repo. Reload latamboard.ai — changes appear immediately. See the `update-data` skill for the full workflow.

If HF is unreachable, the page shows a "Failed to load" error. There is no bundled fallback. (This is deliberate: the previous HF-first / `/public` fallback silently bypassed local edits and was the root cause of multiple "edits don't take effect" debugging sessions.)

## Configuration

- Branding colors and fonts: `src/index.css` (CSS variables)
- Task chips + score calc: `src/pages/Landing.tsx`
- Tests page grouping: `src/pages/Tests.tsx`
- Locales: `src/i18n/index.ts`

## Project Structure

```
latam-leaderboard/
  public/
    about.html              # Quarto-rendered manuscript (see update-paper-about skill)
    nav-injector.js         # SPA navbar graft for /about.html
    contributors/           # contributor avatars
    latam.png               # favicon
    latamboard_cover.png    # OG image
    README.md               # HF dataset card (mirrored to the HF repo)
  scripts/
    inject-nav.js           # prebuild hook — injects nav-injector tag into about.html
  src/
    pages/
      Landing.tsx           # hero + leaderboard table (fetches from HF)
      Tests.tsx             # task groups + task cards (fetches from HF)
      About.tsx             # redirect to /about.html
      Submit.tsx            # suggestion form (client-only)
    components/ui/          # reusable components
    i18n/                   # EN/ES/PT translations
    index.css               # Tailwind + brand tokens
    App.tsx                 # routes + layout + footer
```

## Deployment

Build:

```bash
npm run build       # also runs `prebuild` → inject-nav.js
```

Preview locally:

```bash
npm run preview
```

Deployment is handled by **Cloudflare Pages**, auto-deploying from `main` on push. The CF Pages project is connected to this repo. Routing (redirects, SPA fallback, cache rules) is configured in the CF dashboard, not this repo — see `.claude/skills/cloudflare-routing/SKILL.md`.

Any static host (Netlify, Vercel, GitHub Pages, S3) can serve `dist/` if you need to move off Cloudflare. No build-time data step is required.

## Data Source & Community

- Dataset: https://huggingface.co/datasets/LatamBoard/leaderboard-results
- Discord: https://discord.com/invite/yGCCUhqtpS
- Website: https://surus.dev

## Notes

- The Submit page is client-only (no backend); submissions are logged in the console as a placeholder.

## Security & Secrets

- No secrets are committed. `.env`, `.env.*` are gitignored (`.env.example` for reference).
- The site is a static SPA; no runtime API keys in the browser.
- The HF dataset is public; no `HF_TOKEN` needed for the runtime fetch.
- Do not embed tokens in client-side code or expose them via `VITE_` env vars.
