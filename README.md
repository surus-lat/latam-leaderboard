# LatamBoard

Simple, stylized leaderboard for evaluating LLMs on Spanish, Portuguese, translation, structured extraction, and transcription tasks for Latin America. Built with React, Vite, and TailwindCSS.

## For contributors and AI agents — read this first

Three pieces of LatamBoard's data/content/routing live **outside this repo**. Editing `src/` cannot fix them. Each has a project skill under `.claude/skills/` with the exact workflow + common-mistakes table.

- **Leaderboard data** (rows, scores, task chips, models) lives on Hugging Face: `LatamBoard/leaderboard-results`. The `/public/*.json` files in this repo are only a local-dev fallback — editing them does NOT change what production users see. See `.claude/skills/update-data/SKILL.md`.
- **About page** is a Quarto-rendered standalone HTML at `public/about.html` (~2.9k lines, seven edit zones). The `.qmd` source is not in this repo. See `.claude/skills/update-paper-about/SKILL.md`.
- **URL routing** (redirects, headers, SPA fallback, cache) is configured in the Cloudflare Pages dashboard, not this repo. See `.claude/skills/cloudflare-routing/SKILL.md`.

Adding a new task category? See `update-data` skill, Flow C — you need to update HF data + `TASK_OPTIONS` in `src/pages/Landing.tsx` + the three locale entries in `src/i18n/index.ts`.

## Features

- Landing page with hero and a sortable, filterable results table
  - Default visible aggregates: `overall_latam_score`, `spanish_score`, `portuguese_score`
  - Column toggles grouped by task categories. Aggregates and per-language tasks are visually distinguished
  - Columns order is derived from `public/tasks_groups.json`
- Tasks page with expandable group cards and per-task cards
  - Group cards: click to expand the long description (supports inline Markdown-style links)
  - Task cards: click to expand long description and dataset link
- About page with context on who/why/how
- Submit page to suggest models (model name, precision, revision, email)
- Footer links to website, Discord, and email

## Stack

- React + Vite
- TailwindCSS (brand tokens in `src/index.css`)
- No backend required; data fetched from `public/`

## Getting Started

Requirements:
- Node.js 18+

Install and run:

```bash
npm i

# Fetch latest public data into /public (table + task configs)
npm run fetch:data

npm run dev
```

Open the printed Local URL.

## Data Fetching

This project ships with a small script to download dataset files into `public/`.

Script: `scripts/fetch-data.mjs`

NPM script: `npm run fetch:data`

Defaults:
- Downloads `leaderboard_table.json`, `tasks_groups.json`, `tasks_list.json` from the Hugging Face dataset resolve URL

Environment variables (optional):
- `LEADERBOARD_DATA_URL` — Base resolve URL. Default: `https://huggingface.co/datasets/mauroibz/leaderboard-results/resolve/main`
- `LEADERBOARD_DATA_FILES` — Comma-separated files to fetch. Default: `leaderboard_table.json,tasks_groups.json,tasks_list.json`
- `LEADERBOARD_FETCH_ALL` — If `true`, fetch the entire dataset repository (uses HF tree API)
- `LEADERBOARD_REPO` — Repo id like `mauroibz/leaderboard-results` (auto-parsed from URL)
- `LEADERBOARD_FETCH_PATTERN` — Filter when fetching all (default `.json`, use `*` for all)
- `HF_TOKEN` — Optional token for private or rate-limited access

Examples:

```bash
# Default (table + tasks config)
npm run fetch:data

# Fetch specific files
LEADERBOARD_DATA_FILES='leaderboard_table.json,tasks_groups.json,tasks_list.json' npm run fetch:data

# Fetch entire repo JSONs (including summaries/*)
LEADERBOARD_FETCH_ALL=true npm run fetch:data

# Fetch entire repo (all files)
LEADERBOARD_FETCH_ALL=true LEADERBOARD_FETCH_PATTERN='*' npm run fetch:data
```

## Configuration

- Branding colors and fonts: `src/index.css` (CSS variables)
- Table behavior (defaults/groups/order): `src/pages/Landing.tsx`
- Tasks page grouping logic: `src/pages/Tests.tsx`

## Project Structure

```
latam-leaderboard/
  public/
    leaderboard_table.json
    tasks_groups.json
    tasks_list.json
    summaries/...
  scripts/
    fetch-data.mjs           # data downloader (configurable)
  src/
    pages/
      Landing.tsx           # hero + leaderboard table
      Tests.tsx             # task groups + task cards (expandable)
      About.tsx             # who/why/how
      Submit.tsx            # suggestion form (client-only)
    index.css               # Tailwind + brand tokens
    App.tsx                 # routes + layout + footer
```

## Deployment

Build:

```bash
npm run build
```

Preview locally:

```bash
npm run preview
```

Any static host (e.g., Netlify, Vercel, GitHub Pages, S3) can serve the `dist/` folder. Ensure `public/` contains the JSON files (run `npm run fetch:data` in your CI/CD before build, if needed).

Recommended CI build command:

```bash
npm ci
npm run fetch:data
npm run build
```

If you need higher rate limits or access to private HF datasets during the fetch step, set `HF_TOKEN` as a CI secret (never in the repo). See Security & Secrets below.

## Data Source & Community

- Dataset: https://huggingface.co/datasets/mauroibz/leaderboard-results
- Discord: https://discord.com/invite/yGCCUhqtpS
- Website: https://surus.dev

## Notes

- The table groups columns by category using the keys/subtasks in `tasks_groups.json`. Aggregates are highlighted and component task columns are styled to match their group.
- The Submit page is client-only (no backend); submissions are logged in the console as a placeholder.

## Security & Secrets

- No secrets are committed to this repository. `.env`, `.env.*` are ignored in `.gitignore` (see `.env.example` for reference).
- The site is a static SPA; it does not require runtime API keys in the browser.
- Data fetching in CI can optionally use `HF_TOKEN` to avoid rate limits. Set this as a CI/host secret and run `npm run fetch:data` before `npm run build`.
- Do not embed tokens in client-side code or expose them via `VITE_` env vars. Keep them only in your CI environment for the data fetch step.
- To rotate or remove a leaked token, revoke it in your Hugging Face account settings and update the CI secret.
