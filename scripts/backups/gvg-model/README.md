# GVG model backup (data-ops)

A **model-only** Kontent.ai environment backup for the Granite View Group demo (Phase 2 of
`../../../PHASES.md`). It defines the content model, collections, and governance workflow —
**no content items or assets** (those are authored in Phase 5). Derived from the schema of
`kickstart-completed.zip`, so all reused type/element/taxonomy IDs stay stable.

## What's in the model

**Collections** (`collections.json`) — the "multiple sites on one platform" answer, and the
filter the app's channel switcher uses:
`default`, `public_web`, `intranet`, `knowledge_base`, `regulated_docs`.

**Workflows** (`workflows.json`):
- `default` — unchanged (Draft → Published).
- `regulated_content` — **scoped to the `article` type in the `regulated_docs` collection**;
  steps: Draft → **Legal review** → Published. This is the controlled-publishing story.

**Content types** (`contentTypes.json`) — kickstart types re-purposed for financial services:
- `solution` → GVG service lines (Risk Management / Payments / Asset Trading). Added a
  `content_channel` taxonomy element.
- `article` → Market Insights **and** Regulated Documentation. Added governance elements:
  `content_channel`, `effective_date`, `version`, `approved_by`, `disclosure_id`.
- `landing_page`, `event`, `video` — retained (event's taxonomy elements re-pointed to the
  re-themed groups below).

**Taxonomies** (`taxonomies.json`):
- `event_format` (Briefing / Webinar / Roundtable) — re-uses the old Event Type group ID.
- `market_topic` (Markets & Trading / Risk Management / Regulation & Compliance / Payments)
  — re-uses the old Event Topic group ID.
- `content_channel` (Public Web / Intranet / Knowledge Base / Regulated Docs) — **fallback**
  for the channel switcher if collections are unavailable on your plan tier.

## Import it

```bash
# ⚠️ cleanEnvironment WIPES the target environment first — only run against the demo env.
npm run model:import --filename="./scripts/backups/gvg-model.zip"
npm run model:generate   # regenerate src/model/** to match
npm run typecheck
```

Requires `VITE_ENVIRONMENT_ID` + `VITE_MANAGEMENT_API_KEY` in `.env`.

## Rebuild the zip after editing the JSON

```bash
cd scripts/backups/gvg-model && zip -r -X ../gvg-model.zip . -x ".*" "README.md"
```

## Caveats — read before the demo

- **Roles are NOT included.** Kontent.ai's Management API can't create custom roles, so the
  `Legal` role and its scoping to the `regulated_docs` collection must be configured **by
  hand** in app.kontent.ai (Environment settings → Roles). The workflow steps here leave
  `role_ids` empty so the import doesn't depend on roles that don't exist yet.
- **Plan-tier gating.** Multiple workflows, collections, and custom roles may be limited on a
  free trial. If the import rejects the extra collections/workflow, fall back to the
  `content_channel` taxonomy (already in the model) to drive the switcher.
- **IDs are placeholders** generated offline. `data-ops` restores them as-is into a freshly
  cleaned environment; cross-references (workflow scope → collection/type, taxonomy elements
  → groups, governance channel element → `content_channel`) are internally consistent.
- **Validate before relying on it.** This backup was assembled offline and hasn't been
  round-tripped against a live environment. Do one dry-run import into a throwaway trial env
  and confirm it restores cleanly before the demo.
- `previewUrls.json` is intentionally empty; `scripts/importProject.ts` excludes preview URLs
  on restore anyway.
