---
name: update-data
description: Use when adding, removing, or changing leaderboard rows, task chips, scores, or any data shown on latamboard.ai. The data is fetched from Hugging Face at runtime; the JSON files in /public are only a fallback. Triggers on phrases like "add a model", "fix this score", "change the leaderboard data", "edit tasks_groups", "the page shows wrong data", "missing benchmark", "update transcription scores".
---

# Update LatamBoard data

## TL;DR

The leaderboard data is fetched at runtime from Hugging Face. Edit and push the JSON files in the HF dataset repo, then reload latamboard.ai — changes appear immediately (`cache: 'no-store'` is set).

Editing the `/public/*.json` files in THIS repo does **not** change what production users see — those are only a local-dev fallback if HF is unreachable.

## Where the data actually lives

- **Repo:** `LatamBoard/leaderboard-results` on Hugging Face
  (the older `mauroibz/leaderboard-results` URL still redirects there)
- **URL:** https://huggingface.co/datasets/LatamBoard/leaderboard-results
- **Resolve base:** `https://huggingface.co/datasets/LatamBoard/leaderboard-results/resolve/main/`

## How `src/pages/Landing.tsx` reads it

```ts
async function fetchLeaderboard() {
  try {
    const res = await fetch('https://huggingface.co/datasets/.../leaderboard_table.json', { cache: 'no-store' })
    if (res.ok) return await res.json()
  } catch {}
  // Local fallback during dev
  const local = await fetch('/leaderboard_table.json')
  return await local.json()
}
```

**This means:** HF is ALWAYS hit first. The `/public/leaderboard_table.json` fallback only fires if HF returns a non-OK status OR throws a network error. In production, HF is the source of truth.

**Common trap:** editing `/public/leaderboard_table.json` locally and reloading the page shows no change, because the page hit HF and got the (old) HF version. The local edit is silently bypassed.

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
| Editing `public/leaderboard_table.json` and reloading the page locally | Page fetches HF first; the local edit is bypassed unless HF is offline |
| Adding a new task category but forgetting `TASK_OPTIONS` in Landing.tsx | The chip won't render even after HF has the column |
| Adding a `TASK_OPTIONS` entry but forgetting the i18n labels | The chip renders with a missing-key placeholder like `landing.task_labels.X` |
| Pushing to a stale clone of the HF repo | Your push fails or overwrites someone else's work; always `git pull` before editing |
| Forgetting that `mauroibz/leaderboard-results` URLs still appear in some code | The dataset was moved to the `LatamBoard` org; `mauroibz` redirects. New code should use `LatamBoard/...` |

## Where the fetch happens (for code-side debugging)

- `src/pages/Landing.tsx` — `fetchLeaderboard` reads the leaderboard table
- `TASK_OPTIONS` in `Landing.tsx` declares which task chips render and which `*_score` aggregate column each maps to
- `src/i18n/index.ts` declares the localized chip labels

`cache: 'no-store'` is already set on every HF fetch, so production picks up HF changes on the next page load — no CDN purge or rebuild needed.

## Future cleanup (optional, follow-up PR)

The HF-first / `/public` fallback pattern silently bypasses any local data edit. A cleaner architecture is "HF only, no fallback" — delete `/public/leaderboard_table.json` and `/public/tasks_*.json` from the repo, remove the fallback branch in `fetchLeaderboard`, and rely on a clear "Failed to load" UI state if HF is unreachable. This was applied successfully on the deprecated repo (`surus-lat/deprecated-latamboard`) and could be ported here as a follow-up.
