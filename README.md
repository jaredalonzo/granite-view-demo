# Granite View Group — Kontent.ai headless multi-site demo

A Solutions Engineer case-study demo: one React codebase and **one Kontent.ai content
source** rendered as four distinctly-branded "sites" — Public Web, Intranet, Knowledge Base,
and Regulated Documentation — plus a unified switcher build. Adapted from the Kontent.ai React
Kickstart. See [`PHASES.md`](./PHASES.md) and [`MULTISITE-PLAN.md`](./MULTISITE-PLAN.md).

## Sites

Each site is one Kontent.ai **collection** rendered with its own theme + header. The active
site is chosen by the `VITE_SITE` build env var:

| `VITE_SITE` | Site | Collection |
|---|---|---|
| _(unset)_ | All-sites switcher build | — (dropdown filters live) |
| `public_web` | Public Web | `public_web` |
| `intranet` | Intranet | `intranet` |
| `knowledge_base` | Knowledge Base | `knowledge_base` |
| `regulated_docs` | Regulated Documentation | `regulated_docs` |

Theming is CSS-variable driven (`src/index.css` per-site blocks, semantic Tailwind tokens);
per-site headers live in `src/sites/<site>/Header.tsx`.

## Local development

```bash
npm ci
# .env needs VITE_ENVIRONMENT_ID + VITE_DELIVERY_API_KEY (preview key)
npm run dev                     # all-sites switcher build
VITE_SITE=intranet npm run dev  # locked to one site
```

## Deployment (Vercel — one project, one branch per site)

Production branch `main` = the switcher build. Each `site/*` branch is code-identical and
carries a **branch-scoped** `VITE_SITE` in Vercel, so the only difference is one env var.

| Branch | `VITE_SITE` (Preview, branch-scoped) |
|---|---|
| `main` | _(none)_ → switcher / production |
| `site/public-web` | `public_web` |
| `site/intranet` | `intranet` |
| `site/knowledge-base` | `knowledge_base` |
| `site/regulated-docs` | `regulated_docs` |

Shared env vars (`VITE_ENVIRONMENT_ID`, `VITE_DELIVERY_API_KEY`) are set for Production +
Preview. Keeping a site branch current is a fast-forward from `main` (no drift).

> ⚠️ The app uses the Kontent.ai **preview** Delivery API; that key is embedded in the client
> bundle. Fine for a throwaway trial environment — for real public sites, publish content and
> use the **published** Delivery API (or a server proxy).

## Content model

The Kontent.ai environment (collections, the Legal-review workflow, article governance fields,
and seed content) is captured as a data-ops backup in
[`scripts/backups/gvg-model/`](./scripts/backups/gvg-model/). Rebuild the demo environment with:

```bash
npm run model:import --filename="./scripts/backups/gvg-model.zip"  # ⚠️ wipes the target env
npm run model:generate
```
