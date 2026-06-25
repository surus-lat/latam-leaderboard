---
name: cloudflare-routing
description: Use when changing redirects, URL rewrites, response headers, SPA fallback, cache behavior, or any routing on latamboard.ai. The site is on Cloudflare Pages and routing config is NOT in this repo — it lives in the Cloudflare dashboard (or a public/_redirects file we could add). Triggers on phrases like "fix this redirect", "why does /about.html go to /about", "add a redirect", "change the cache rules", "the site routes wrong", "why is this URL returning 308/301/302", "add a header", "SPA fallback isn't working".
---

# Cloudflare routing for latamboard.ai

## TL;DR

**The site is served from Cloudflare Pages.** Routing rules — redirects, rewrites, headers, SPA fallback — live in the **Cloudflare dashboard**, not in this repo. If a redirect or header is wrong and you can't find a config file for it in `src/` or `public/`, the answer is in the dashboard.

## How we know

- DNS NS records: `leif.ns.cloudflare.com`, `kristina.ns.cloudflare.com` (Cloudflare-managed)
- A records: 172.67.x.x and 104.21.x.x (Cloudflare anycast)
- Response `server: cloudflare` on every request
- No `vercel.json`, no `netlify.toml`, no `wrangler.toml`, no GitHub Actions deploy workflow in this repo
- `GET /about.html` → `308 → /about` is configured **somewhere we cannot see from the repo**

Verify any of this yourself:

```bash
dig +short latamboard.ai NS
curl -sI https://latamboard.ai/<path-you-care-about>
```

## Where the routing actually lives

In order of likelihood:

1. **A Cloudflare Pages project under the `surus-lat` org/account.**
   - Dashboard → Workers & Pages → the `latamboard` Pages project → Settings → Custom domains, Functions, Redirects.
   - Pages projects ship redirects via either a `public/_redirects` file (Netlify-style; read at build time) **or** dashboard-configured redirects/Functions.

2. **Zone-level Rules on the `latamboard.ai` Cloudflare zone.**
   - Dashboard → the `latamboard.ai` domain → Rules → Redirect Rules, Transform Rules, Cache Rules.
   - These run before Pages even sees the request — easy to forget they exist.

3. **A Pages Function** (`functions/<path>.ts`) in some other branch or in the Pages project's connected repo.
   - We didn't see one on `main`, but check other branches before assuming.

## Workflow for routing changes

1. **Identify the layer.** Hit the URL with `curl -sI` and read the response: `server: cloudflare` plus a `cf-ray` confirms it touched Cloudflare. A `location:` header means a redirect ran. Note the status code — 308/301 (permanent) vs 302/307 (temporary) tells you the intent of whoever set it.
2. **Check this repo first.**
   - `public/_redirects` — Netlify-style rules, read by CF Pages at build time.
   - `public/_headers` — header overrides per path.
   - `functions/` — Pages Functions.
   - None of these currently exist; if you want repo-controlled routing, add `public/_redirects`. That gives you version control over redirects and CI catches broken syntax.
3. **If not in repo, open the Cloudflare dashboard** at the two locations in the previous section. Ask whoever owns the CF account for access if you don't have it (`francis@surus.lat`).
4. **After changing dashboard config**, verify from CLI:

   ```bash
   curl -sI https://latamboard.ai/<path>
   ```

   The change is usually live within seconds — no deploy required.

## Common mistakes

| Mistake | Why it doesn't work |
|---|---|
| Editing `src/App.tsx` routes to fix a 308 from `/about.html` | The redirect runs at the edge, before any React code loads. SPA routes can't influence it. |
| Adding a route to `vite.config.ts` | Vite doesn't run in production; the built `dist/` is served as static files by CF Pages. |
| Pushing an empty change to trigger a redeploy hoping routing recalculates | Redirects from the dashboard are independent of the deploy. Redeploying does nothing. |
| Adding `public/_redirects` without knowing what's already in the dashboard | Repo redirects can conflict with dashboard rules. Check both before assuming a new rule will win. |
| Assuming the deploy is from this repo's `main` because there's no workflow file | Cloudflare Pages uses its own GitHub integration (no workflow in the repo). Pushes to `main` trigger a Pages build automatically. CI passing here does NOT mean the deploy will succeed. |

## Confirming a deploy happened

There's no in-repo signal (no `.github/workflows/deploy.yml` because CF Pages auto-deploys). To confirm:

- Cloudflare dashboard → Workers & Pages → `latamboard` → Deployments (shows commit SHA + build status).
- Or: `curl -sI https://latamboard.ai` and watch `cf-ray` change after your push (rough proxy).
- Or: introduce a visible change to the page and reload after a minute or two.

## When you should put routing IN the repo

Putting routing in `public/_redirects` is the right move when:

- The routing is **content-shaped** (e.g., old URL → new URL after a content move).
- You want CI to catch syntax mistakes before they hit production.
- You want a paper trail / PR review on routing changes.

Leave routing in the dashboard when:

- It's **infrastructure-shaped** (cache rules, security headers, WAF, edge logic).
- It needs to change without a redeploy.
- It involves secrets or zone-level config that doesn't belong in version control.
