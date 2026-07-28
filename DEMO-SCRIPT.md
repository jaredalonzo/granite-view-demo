# Demo Script — "One Edit, Every Channel"

**Runtime:** ~3 minutes · **The point:** single source of truth, many presentations

Built around the shared `art_fee_reduction` article ("GVG Lowers Advisory Fees for 2026"),
featured on the Public Web, Intranet, and Knowledge Base landing pages. All three sites pull
**preview** content, so edits show on refresh with no publish step.

---

## Pre-flight (before you present)

- [ ] Three browser tabs open, one per site (Public Web / Intranet / Knowledge Base), each on its
      landing page. Zoom so the **Featured Content** article is visible without scrolling.
- [ ] A fourth tab: Kontent.ai, already on the `GVG Lowers Advisory Fees for 2026` item, logged in.
- [ ] Confirm all three sites currently show the headline **"GVG Lowers Advisory Fees for 2026."**
- [ ] Decide your edit in advance (below) so you're not composing live.

---

## Beat 1 — Frame the problem (~30s)

> "Granite View runs three separate web properties — the public investor site, the employee
> intranet, and the customer knowledge base. Each has its own look and audience. Now: our advisory
> fee is changing, and that announcement needs to appear on all three. In a traditional stack,
> that's three CMSs, three edits, three chances to get the number wrong. Watch what a headless
> model does instead."

*Action:* Tab through all three sites so they see the same article rendered in three different designs.

> "Same article — but notice it's navy and serif on the investor site, the indigo employee theme on
> the intranet, and the help-center style in the knowledge base. **The content is shared; only the
> presentation differs.**"

---

## Beat 2 — Make one edit (~45s)

*Action:* Switch to the Kontent.ai tab. Open the article. Make a **visible** change:

- **Headline:** `GVG Lowers Advisory Fees for 2026` -> `GVG Lowers Advisory Fees for 2026 — Effective March 1`
- **Intro:** change `0.60%` -> `0.55%`

> "I'm editing this in exactly one place. One author, one item, one workflow. I'll update the
> headline and correct the fee to 0.55%."

*Action:* Click **Save**.

> "That's it. No copy-paste, no re-entering it in three systems."

---

## Beat 3 — The reveal (~45s)

*Action:* Switch to the Public Web tab -> **refresh**. New headline + 0.55% appears.

> "Public Web — updated."

*Action:* Intranet tab -> **refresh**. Same change.

> "The employee intranet — same edit, its own design."

*Action:* Knowledge Base tab -> **refresh**. Same change.

> "And the knowledge base. **One edit in Kontent.ai, three channels updated** — because there's
> exactly one source of truth. It's literally impossible for the fee to be right on one site and
> stale on another."

---

## Beat 4 — Land the value (~30s)

Pick the two or three that fit your audience:

- **No content drift / compliance safety** — "For a financial-services firm, 'the fee is right on
  the website but wrong on the intranet' isn't an inconvenience, it's a compliance incident. This
  model removes that class of error entirely."
- **Governance travels with the content** — "Because it's one governed item, the same review and
  approval workflow applies no matter how many channels consume it."
- **Design is decoupled** — "Each team owns its channel's presentation; the content team owns the
  truth. They move independently."
- **Scales to any channel** — "Add a mobile app or a partner portal tomorrow — it consumes the same
  item through the Delivery API. No re-authoring."

---

## Fallbacks (if something misbehaves)

- **A site doesn't update on refresh:** preview API may briefly cache — hard-refresh
  (Cmd+Shift+R). Have this line ready: *"Preview edges cache for a few seconds; in production you'd
  publish and a webhook purges the CDN instantly."*
- **You want a bulletproof, offline-proof version:** run the same edit against a local
  `npm run dev` for one site and the deployed URL for another — proves the same item, two
  independent frontends.
- **Prove it's really one item:** in a spare tab, hit the API live —

  ```bash
  set -a; source .env; set +a
  curl -s "https://preview-deliver.kontent.ai/${VITE_ENVIRONMENT_ID}/items/art_fee_reduction" \
    -H "Authorization: Bearer ${VITE_DELIVERY_API_KEY}" | jq '.item.elements.title.value'
  ```

  "One codename, `art_fee_reduction`. Every site queries this same item."

---

## Reset (after the demo)

Change the headline and fee back in Kontent.ai + Save, so the next run starts clean:

- **Headline:** back to `GVG Lowers Advisory Fees for 2026`
- **Intro:** `0.55%` -> `0.60%`
