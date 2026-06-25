---
name: update-data
description: Use when adding, removing, or changing leaderboard rows, task chips, scores, or any data shown on latamboard.ai. The data is fetched directly from Hugging Face at runtime; there are no bundled JSON files in this repo. Triggers on phrases like "add a model", "fix this score", "change the leaderboard data", "edit tasks_groups", "the page shows wrong data", "missing benchmark", "update transcription scores".
---

# Update LatamBoard data

## TL;DR

The leaderboard data is fetched at runtime from Hugging Face. Edit and push the JSON files in the HF dataset repo, then reload latamboard.ai — changes appear immediately (`cache: 'no-store'` is set).

There are no bundled JSON files in this repo. HF is the only source.

## Where the data actually lives

- **Repo:** `LatamBoard/leaderboard-results` on Hugging Face
  (the older `mauroibz/leaderboard-results` URL still redirects via a 307, but new code should use `LatamBoard/...` directly to skip the redirect hop)
- **URL:** https://huggingface.co/datasets/LatamBoard/leaderboard-results
- **Resolve base:** `https://huggingface.co/datasets/LatamBoard/leaderboard-results/resolve/main/`

## How `src/pages/Landing.tsx` reads it

```ts
const HF_BASE = 'https://huggingface.co/datasets/LatamBoard/leaderboard-results/resolve/main'

async function fetchLeaderboard(): Promise<LeaderboardRow[]> {
  const res = await fetch(`${HF_BASE}/leaderboard_table.json`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to load leaderboard data from HuggingFace (${res.status})`)
  return res.json()
}
```

`src/pages/Tests.tsx` uses the same `HF_BASE` to fetch `tasks_groups.json` and `tasks_list.json`. If HF is unreachable, the page shows a "Failed to load" error — there is no bundled fallback.

## How to update — three flows

### Flow A: add or change scores for an existing model

1. Run the eval in benchy and produce a submission (see benchy's `submit-to-latamboard` skill).
2. Open a PR against `surus-lat/benchy`. When merged, benchy's `publish-submission.yml` GitHub Action runs `merge_and_publish` which pushes updated JSON to HF.
3. Reload latamboard.ai. Done.

### Flow B: hand-edit a row on HF (model name fix, publisher rename, etc.)

1. Clone the HF dataset:
   ```bash
   git clone https://huggingface.co/datasets/LatamBoard/leaderboard-results
   ```
   You'll need an HF token with write access to the LatamBoard org.
2. Edit `leaderboard_table.json` (and any matching summary file under `summaries/`).
3. Commit and push to `main`.
4. Reload latamboard.ai.

### Flow C: add a new task category (new column group)

1. Add the new task to `tasks_groups.json` and `tasks_list.json` on HF.
2. Add the matching column(s) to `leaderboard_table.json` rows.
3. Add a new entry to `TASK_OPTIONS` in `src/pages/Landing.tsx`:
   ```ts
   { key: 'my_new_task', column: 'my_new_task_score' },
   ```
4. Add the localized labels in `src/i18n/index.ts` for `task_labels.my_new_task` in all three locales (en/es/pt).
5. Open a PR. The chip will appear once merged + deployed.

## Verifying the change is live

- Open latamboard.ai after pushing to HF.
- Should see the change after a normal reload — no hard-reload needed (`cache: 'no-store'`).
- If it isn't there, open DevTools → Network → confirm the request to `huggingface.co/datasets/LatamBoard/leaderboard-results/resolve/main/leaderboard_table.json` returns your edited data.
- If you see "Failed to load leaderboard data", your JSON is malformed — validate with `jq . leaderboard_table.json` before pushing.

## Common mistakes

| Mistake | Why it doesn't work |
|---|---|
| Recreating `public/leaderboard_table.json` and editing it | Bundled JSON files were deliberately removed; the page only reads HF. A new `public/*.json` would not be fetched. |
| Adding a new task category but forgetting `TASK_OPTIONS` in Landing.tsx | The chip won't render even after HF has the column |
| Adding a `TASK_OPTIONS` entry but forgetting the i18n labels | The chip renders with a missing-key placeholder like `landing.task_labels.X` |
| Pushing to a stale clone of the HF repo | Your push fails or overwrites someone else's work; always `git pull` before editing |
| Using `mauroibz/leaderboard-results` URLs in new code | The dataset moved to `LatamBoard/`; the old URL still 307-redirects, but new code should hit `LatamBoard/...` directly. |

## Where the fetch happens (for code-side debugging)

- `src/pages/Landing.tsx` — `HF_BASE` constant + `fetchLeaderboard` for the leaderboard table
- `src/pages/Tests.tsx` — `HF_BASE` constant + `fetchHFJson` helper for `tasks_groups.json` and `tasks_list.json`
- `TASK_OPTIONS` in `Landing.tsx` declares which task chips render and which `*_score` aggregate column each maps to
- `src/i18n/index.ts` declares the localized chip labels

`cache: 'no-store'` is set on every HF fetch, so production picks up HF changes on the next page load — no CDN purge or rebuild needed.
