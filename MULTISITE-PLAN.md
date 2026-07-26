# Phase 7 — Multi-site: distinct design per channel + per-branch Vercel deploys

## Goal

Turn the four channels into four distinctly-branded "sites" — each with its own theme and
header — while keeping **one codebase and one Kontent.ai content source**. Deploy them from a
single Vercel project using **one branch per site**, and keep the unified channel switcher as a
fifth "all sites" build. This is the headless multi-site payoff: same code, same content API,
four differently-branded sites (Granite View pains #1/#2).

## Confirmed decisions

- **Deploy:** 1 Vercel project, 1 git branch per site (branch-scoped `VITE_SITE` env var).
- **Design depth:** shared page components; per-site **theme (colors/fonts/logo) + header**.
- **Switcher:** kept — the `main`/production build (no `VITE_SITE`) renders the dropdown, which
  now re-skins the whole site (theme + header + content) on selection.

## Core idea: `VITE_SITE` selects everything

- **Locked build** (`VITE_SITE=intranet`): app boots pinned to that site — its theme, header,
  and content collection — switcher hidden.
- **Switcher build** (`VITE_SITE` unset): dropdown chooses the active site at runtime, swapping
  theme + header + content together.

One compiled bundle serves both; the only build difference is an env var. **No code diverges
between branches** — the site branches are code-identical to `main` and exist only to carry the
branch-scoped env var, so there is zero drift to manage.

## Architecture

### 1. Theming via CSS variables (the key enabler)
- Refactor Tailwind colors to **semantic tokens** backed by CSS custom properties:
  `primary`, `accent`, `surface`, `bg`, `muted`, `on-primary` → `var(--color-primary)` etc.;
  fonts → `--font-display`, `--font-body`.
- `src/index.css` defines a theme block per site, keyed by a root attribute:
  `:root[data-site="intranet"] { --color-primary: …; --font-display: …; }` (× 4).
- A tiny `ThemeApplier` sets `document.documentElement.dataset.site = activeSite.key`, so one
  build swaps the entire palette at runtime (works for both locked and switcher builds).
- Migrate existing hardcoded classes (`navy`, `gold`, `steel`, `slate`, `offwhite`) to the
  semantic tokens — mechanical sweep like Phase 1. Public Web keeps today's navy/gold look.

### 2. Site registry
- New `src/sites/` with a `SiteConfig` per site:
  `{ key, collection, label, tagline, logo, Header }` + theme is CSS-driven by `key`.
- `src/sites/index.ts`: `sites` map + `resolveSite()` that reads `import.meta.env.VITE_SITE`
  (locked) or returns the switcher default.

### 3. Per-site headers (distinct "feel")
Four header components under `src/sites/*/Header.tsx`:
- **Public Web** — current polished institutional marketing header (navy/gold, serif).
- **Intranet** — utilitarian portal top bar: compact, employee nav (Home · Desk Tools ·
  Policies · Directory · Help), "signed in as" chip, dense sans-serif.
- **Knowledge Base** — help-center header with a prominent search field + category nav, lighter/friendly.
- **Regulated Docs** — formal/minimal: high-contrast, strict serif + mono for references,
  "Controlled documents" label, minimal nav.

### 4. SiteContext (evolves ChannelContext)
- `SiteContext` holds the active `SiteConfig` + setter (setter only used by the switcher).
- `Layout` renders `activeSite.Header`; content queries use `activeSite.collection` (replaces
  today's `channel.collection`). `ChannelSwitcher` → `SiteSwitcher` (unchanged UX, now swaps theme too).
- `main.tsx`: wrap in `SiteProvider`; if `VITE_SITE` set, provide fixed site + hide switcher.

### 5. Fonts
- Add per-site font families (Google Fonts in `index.html`), mapped via `--font-display` /
  `--font-body` per theme block.

## Files touched
- New: `src/sites/index.ts`, `src/sites/types.ts`, `src/sites/<site>/Header.tsx` (×4),
  `src/context/SiteContext.tsx`, `src/components/ThemeApplier.tsx`, `src/components/SiteSwitcher.tsx`.
- Edit: `tailwind.config.js` (semantic tokens), `src/index.css` (theme blocks), `index.html`
  (fonts), `src/components/Layout.tsx` + `Header.tsx` (render active header), `main.tsx`
  (SiteProvider + VITE_SITE), and a color-token sweep across existing components.
- `.env` / `.env` template: document `VITE_SITE`.

## Vercel setup (1 project, 4 branches)

1. Keep the existing `kickstart` project connected to the repo. **Production branch = `main`**
   (the switcher / "all sites" build, no `VITE_SITE`).
2. Create four code-identical branches off `main`:
   `site/public-web`, `site/intranet`, `site/knowledge-base`, `site/regulated-docs`.
3. Vercel → Project → **Settings → Environment Variables**: add `VITE_SITE` **scoped to each
   branch** (Preview environment → specific branch):
   `site/intranet → intranet`, `site/public-web → public_web`, etc.
   Add the shared Kontent vars (`VITE_ENVIRONMENT_ID`, `VITE_DELIVERY_API_KEY`,
   `VITE_DELIVER_URL`) to **all** environments.
4. Push the branches → Vercel builds each → stable URLs like
   `kickstart-git-site-intranet-<team>.vercel.app`. Optionally attach a custom domain per branch.
5. `main` deploys the switcher build at the production domain.
6. `vercel.json` SPA rewrite is unchanged.

**Keeping branches in sync:** because branches don't differ in code, updating a site is just
`git push` fast-forwarding it to `main` (a one-line script can update all four).

## Caveats

- **Preview key exposure.** The app currently uses the Kontent **preview** Delivery API, and a
  Vite client bundle embeds that key publicly. Fine for a throwaway demo env; for real sites,
  publish content and use the production Delivery API (or a server proxy). Decide before making
  URLs public. May want to switch deployed builds to the **published** Delivery API.
- **Content must exist per collection.** Already seeded (Phase 5) for all four collections.
- **Custom domains per branch** are supported in one project but need manual assignment; the
  default per-branch preview URLs work for the demo without domains.

## Verification

1. Local locked build: `VITE_SITE=intranet npm run dev` → intranet theme + header + content,
   no switcher. Repeat per site.
2. Local switcher build: `npm run dev` (no `VITE_SITE`) → dropdown re-skins theme + header +
   content on each selection.
3. `npm run typecheck` + `npm run build` green.
4. On Vercel: each branch URL renders its own site; production renders the switcher.
