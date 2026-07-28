# Production Setup — Published vs Preview Delivery

Goal: run each of the four sites as its own **production** deployment on Kontent's **published**
Delivery endpoint (`deliver.kontent.ai`), while branch/PR deployments stay on the **preview**
endpoint (`preview-deliver.kontent.ai`) for draft content.

The Delivery SDK derives the base URL from `usePreviewMode`, so this is a single env-driven flag —
no per-environment code. See:
https://kontent.ai/learn/docs/apis/delivery-api/published-content-vs-preview

---

## Code (done)

- `src/utils/client.ts` reads `VITE_KONTENT_PREVIEW`:
  - `"true"`  -> `usePreviewMode: true`, preview endpoint, sends the **preview** API key.
  - `"false"` -> `usePreviewMode: false`, published endpoint; sends a **secure** key only if one is
    provided (published content is public by default).
- Local `.env` sets `VITE_KONTENT_PREVIEW=true` so local dev keeps showing drafts.
- `vercel.json` already rewrites all routes to `/` (SPA deep links work in production).

> ⚠️ Content is currently all **Draft**. The published endpoint returns nothing until items are
> moved to the **Published** workflow step in Kontent. Production sites will render empty until then.

---

## Topology: one Vercel project per site (4 projects)

| Project (suggested) | `VITE_SITE` | Production domain (example) |
|---|---|---|
| `gvg-public-web`     | `public_web`     | public.graniteview.example      |
| `gvg-intranet`       | `intranet`       | intranet.graniteview.example    |
| `gvg-knowledge-base` | `knowledge_base` | help.graniteview.example        |
| `gvg-regulated-docs` | `regulated_docs` | docs.graniteview.example        |

Each project connects to the **same** GitHub repo. Vite is auto-detected (`npm run build` -> `dist`).

### Per-project steps (repeat 4x)
1. **Add New -> Project** -> import the `kickstart` repo.
2. Name it per the table; framework preset **Vite** (default build/output are correct).
3. **Settings -> Git -> Production Branch = `main`.** Pushing `main` deploys all four production
   (published) sites; any other branch/PR deploys a preview (draft) build.
4. Add environment variables (below).
5. **Settings -> Domains** -> attach the site's production domain.

### Environment variables (per project)
Scope matters — Vercel splits into **Production / Preview / Development**.

| Variable | Value | Scopes |
|---|---|---|
| `VITE_ENVIRONMENT_ID` | `<environment id>` | Production, Preview, Development |
| `VITE_SITE` | the site's codename (e.g. `public_web`) | Production, Preview, Development |
| `VITE_KONTENT_PREVIEW` | `false` | **Production** |
| `VITE_KONTENT_PREVIEW` | `true` | **Preview**, **Development** |
| `VITE_DELIVERY_API_KEY` | `<preview API key>` | **Preview**, **Development** |
| `VITE_DELIVERY_API_KEY` | `<secure API key>` | **Production** — only if you enable secure access; otherwise omit |

Net effect: `main` -> published content; every preview deployment -> draft content. Automatic.

---

## Preview button in Kontent (optional cleanup)

Your space preview URLs currently point at the old single project's branch deploys
(`kickstart-git-site-*-...vercel.app`). Options:

- **Keep them** — they still serve draft content (preview mode) and work as-is for the Preview button.
- **Repoint** them to each new per-site project's *preview* deployment domain
  (`gvg-<site>-git-<branch>-....vercel.app`) so preview + production live in one project per site.
  Update via the backup builder (`preview_urls.space_domains`) or MAPI `preview-configuration`.

The old `kickstart` project can be retired once the four per-site projects are live, or kept as a
combined all-sites preview (switcher build).

---

## Verify

```bash
set -a; source .env; set +a

# Published endpoint (production reads this) — empty until you publish:
curl -s "https://deliver.kontent.ai/${VITE_ENVIRONMENT_ID}/items?system.type=article" | jq '.items | length'

# Preview endpoint (branch deploys read this) — shows drafts:
curl -s "https://preview-deliver.kontent.ai/${VITE_ENVIRONMENT_ID}/items?system.type=article" \
  -H "Authorization: Bearer ${VITE_DELIVERY_API_KEY}" | jq '.items | length'
```

When ready, publish content in Kontent (UI or MAPI) and the production sites populate.
