# Granite View Group — Demo Build Roadmap

Adapting the Kontent.ai React Kickstart into a Solutions Engineer case-study demo for
**Granite View Group Inc. (GVG)** — a global financial-services firm (risk management,
payments, asset trading; institutional, commercial, and individual clients) evaluating a
move off web-first Sitecore to a content-first headless CMS.

## Guiding principle

The case study grades **a prioritized demo, not a feature tour** — story over features.
The app's job is to be the *visible proof* that one content source feeds many channels
under governance. Narrative spine:

> "You're copy-pasting the same disclosure across four sites and praying it doesn't drift.
> Watch me change it **once** and have it update everywhere — and watch Legal gate it
> before it ever goes live."

That one sentence is pains #1, #2, and #3 at once. Every phase serves it.

## Prospect pain points (priority order)

1. Can't manage **multiple sites** on one platform (public web, intranet, knowledge base, regulated docs)
2. **Duplicate content & content drift** from copy-pasting
3. **Governance / controlled publishing** for regulated documentation (flagged "particularly important")
4. **Maintenance costs** trending up year over year

## Confirmed decisions

- **Environment:** Kontent.ai trial with the kickstart already imported (default content present).
- **Demo spine:** build both — channel switcher first, then the governed regulated-docs view (phased).
- **Branding:** invented institutional-finance look — navy `#0B2545`, slate `#13315C`,
  steel `#8DA9C4`, gold `#C9A24B`, off-white `#F4F6F9`; Lora serif headings + Source Sans 3 body.

---

## Phase 1 — Rebrand the shell to Granite View Group ✅ DONE

App-only, zero CMS dependency. Reskins the Kickstart from "Karma Health" to GVG.

- Palette + fonts in `tailwind.config.js` (new semantic keys `navy/slate/steel/gold/offwhite`,
  `fontFamily.serif` → Lora); old keys `burgundy/azure/creme/libre` removed.
- `index.html` — title, meta description, Google Fonts (Lora), favicon → `public/gvg.svg`.
- `src/components/Logo.tsx` — granite-block monogram + "Granite View Group" wordmark.
- `src/components/Navigation.tsx` — Solutions / Insights / Investor Relations / About / Contact.
- `src/components/Footer.tsx` — 2026 GVG copyright + regulated-firm disclaimer.
- Color sweep across all components + `src/utils/richtext.tsx` (Featured*, Video, Loader, etc.).

**Verified:** `npm run typecheck` passes; residual-reference grep clean; dev server serves new head.
**Detailed plan:** `~/.claude/plans/groovy-giggling-teapot.md`

---

## Phase 2 — Re-model content in Kontent.ai for financial services + governance (CMS)

Re-purpose existing kickstart types rather than rebuild. **This is where the SE story lives.**

- **Type re-purposing (semantics, mostly same fields):**
  - `solution` → GVG **service lines**: Risk Management, Payments, Asset Trading.
  - `article` → **Market Insights** and **Regulated Documentation**.
  - `landing_page` → GVG corporate homepage.
  - `event` / `video` → investor briefings / thought leadership (secondary).
- **Collections = channels/sites:** create `public_web`, `intranet`, `knowledge_base`,
  `regulated_docs`. This is the "multiple sites on one platform" answer and the filter the
  Phase-3 switcher uses. (Fallback if trial tier limits collections: a `channel` taxonomy.)
- **Workflow:** add a **Legal / Compliance review** step before Published; optionally scope a
  `Legal` role to the `regulated_docs` collection to demo role-based governance live.
- **Governance fields on `article`** (or a new lightweight `regulated_document` type):
  `effective_date`, `version`, `approved_by`, `disclosure_id`.
- After model edits: `npm run model:generate` → regenerates `src/model/**`; then `npm run typecheck`.

**Addresses:** #1 multi-site, #3 governance.

---

## Phase 3 — App restructure A: channel / collection switcher

The centerpiece — one control that re-queries the same content per channel.

- New `src/constants/channels.ts` — four channels + collection codenames.
- New `src/components/ChannelSwitcher.tsx` — segmented control in the header.
- Channel state — extend `src/context/AppContext.tsx` or a small `ChannelContext`.
- `src/utils/client.ts` — collection-filter helper (`system.collection`).
- `src/pages/LandingPage.tsx` / `SolutionListItem.tsx` — filter queries by active channel.

**Demo beat:** put one reused item (e.g. a market-risk disclosure / fee schedule) in
multiple collections, flip channels to show it identical, then edit once and re-flip → no drift.
**Addresses:** #1 multi-site, #2 content drift.

---

## Phase 4 — App restructure B: governed Regulated Documentation view

- New route `/regulated-docs` in `src/main.tsx`; new `src/pages/RegulatedDocs.tsx`.
- Lists `regulated_docs`-collection articles with a governance badge:
  `Approved by Legal · v{version} · Effective {effective_date} · Ref {disclosure_id}`
  (from Phase-2 fields + `system.lastModified`).
- Talk track: content can't reach this page until it clears the Legal workflow step —
  controlled publishing, audit trail, no rogue edits.

**Addresses:** #3 governance ("particularly important").

---

## Phase 5 — Content seeding for the narrative

Author just enough believable content in Kontent.ai — don't over-build:

- 3 service-line `solution` items.
- 2–3 Market Insight `article`s.
- **1 hero reused disclosure** placed in multiple collections (the drift demo).
- 2–3 `regulated_document` items with governance fields; one deliberately parked in the
  Legal review step to show the gate live.

---

## Phase 6 — Demo runsheet (45 min, time-boxed, with cut points)

1. **(0–5) Intro** — Kontent.ai + content-first framing *(cut first if short on time)*.
2. **(5–15) Multi-site** — channel switcher: one source → four sites → pains #1/#2.
3. **(15–28) Reuse & no drift** — edit the shared disclosure once, re-flip channels → pain #2.
4. **(28–40) Governance** — Regulated Docs view + Legal workflow gate + role scoping in CMS → pain #3.
5. **(40–45) Maintenance/close** — headless = build once, no per-site rebuilds; nod to compliance agent → pain #4.

**Fallbacks:** pre-seeded content + screenshots in case live editing/API hiccups; the intro is the designated cut.
**Total slot:** 75 min booked (45 demo + 30 evaluation/discussion).

---

## Stakeholders (all three attend)

- **Head of Digital** — requested the demo, primary contact *(played by Sales Director)*.
- **Director of Digital** — Head of Digital's supervisor *(played by Sales VP)*.
- **Head of IT Development** — *(played by Solutions/Presales Engineer)*.

## Open gaps to probe during the demo conversation

Sitecore contract end date; go-live target; implementation team size; desired tech stack;
where regulated docs live today (Sitecore, separate DMS, file shares?).
