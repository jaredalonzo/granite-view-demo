/**
 * Vercel serverless function — auto-assign the Legal reviewer when a regulated
 * document enters the "Legal review" workflow step.
 *
 *   Kontent.ai webhook ("Transition to specific workflow step" → legal_review)
 *     → POST /api/legal-review-assign
 *     → verify the x-kontent-ai-signature
 *     → Management API `change-workflow`: keep the item in legal_review, but add
 *       the Legal reviewer as a contributor (assignee).
 *
 * Why `change-workflow`: its request body accepts `contributors` (see
 * @kontent-ai/management-sdk → WorkflowModels.IChangeWorkflowOfLanguageVariantData),
 * so a single call sets the assignee without ever touching content elements.
 * Re-affirming the *same* step is not a transition, so it does not re-fire the
 * "transition to legal_review" trigger — and the id-based guard below stops any
 * loop even if your environment behaves differently.
 *
 * ── Setup ────────────────────────────────────────────────────────────────────
 * 1. Vercel → Project → Settings → Environment Variables (Production + Preview).
 *    NEVER prefix these with VITE_ — that would bundle the secret into the client.
 *
 *      KONTENT_MANAGEMENT_API_KEY   Management API key with content-edit + workflow
 *                                   rights. SECRET. (Not the Delivery preview key,
 *                                   and not the VITE_-prefixed one.)
 *      KONTENT_WEBHOOK_SECRET       The secret shown when you create the webhook.
 *      LEGAL_REVIEWER_IDS           Comma-separated list of reviewers to assign (the
 *                                   whole Legal team). Each entry may be a Kontent.ai
 *                                   user id (GUID) or an email. Ids enable the loop
 *                                   guard; emails are easier to fill in — see note.
 *      KONTENT_ENVIRONMENT_ID       Optional; falls back to VITE_ENVIRONMENT_ID.
 *      LEGAL_WORKFLOW_CODENAME      Optional; default "regulated_content".
 *      LEGAL_STEP_CODENAME          Optional; default "legal_review".
 *
 * 2. Kontent.ai → Environment settings → Webhooks → Create:
 *      - Secret: the same value as KONTENT_WEBHOOK_SECRET.
 *      - URL: https://<your-vercel-domain>/api/legal-review-assign
 *      - Trigger (Management API): "Transition to specific workflow step"
 *        → workflow "Regulated content", step "Legal review".
 *
 * Finding user ids: GET https://manage.kontent.ai/v2/projects/{ENV_ID}/users with the
 * Management API key returns each user's `user_id` — but no email or name, so mapping a
 * GUID to a person is awkward. Putting emails in LEGAL_REVIEWER_IDS is usually easier.
 * Trade-off: emails can't be matched against the variant's contributors, so the loop
 * guard is weaker for email entries (fine for a demo; prefer ids for production).
 *
 * Note: the SPA rewrite in vercel.json does not shadow this — Vercel matches
 * Serverless Functions before applying user rewrites.
 */

import type { IncomingMessage, ServerResponse } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";
import process from "node:process";

// Belt-and-suspenders: ask Vercel not to pre-parse the body so we can read the
// raw bytes for signature verification. We also read the stream directly below,
// which works whether or not this hint is honored — as long as we never touch
// req.body (accessing it would consume/parse the stream).
export const config = { api: { bodyParser: false } };

const MANAGE_BASE = "https://manage.kontent.ai/v2/projects";
const SIGNATURE_HEADER = "x-kontent-ai-signature";

const WORKFLOW_CODENAME = process.env.LEGAL_WORKFLOW_CODENAME ?? "regulated_content";
const STEP_CODENAME = process.env.LEGAL_STEP_CODENAME ?? "legal_review";

type UserRef = { id: string } | { email: string };

interface Notification {
  object_type?: string;
  message?: { action?: string };
  data?: {
    system?: {
      id?: string;
      language?: string;
      workflow?: string;
      workflow_step?: string;
    };
  };
}

function readRawBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function isValidSignature(rawBody: string, secret: string, signature: string): boolean {
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

function json(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(body));
}

function mapiHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.KONTENT_MANAGEMENT_API_KEY}`,
    "content-type": "application/json",
  };
}

/** Read the variant to inspect its current contributors (for the loop guard). */
async function getContributorIds(envId: string, itemId: string, language: string): Promise<string[]> {
  const url = `${MANAGE_BASE}/${envId}/items/${itemId}/variants/codename/${language}`;
  const res = await fetch(url, { headers: mapiHeaders() });
  if (!res.ok) {
    throw new Error(`GET variant failed (${res.status}): ${await res.text()}`);
  }
  const variant = (await res.json()) as { contributors?: Array<{ id?: string }> };
  return (variant.contributors ?? []).map((c) => c.id).filter((id): id is string => Boolean(id));
}

/** Keep the item in legal_review, but set the merged contributor list. */
async function assignReviewer(
  envId: string,
  itemId: string,
  language: string,
  contributors: UserRef[],
): Promise<void> {
  const url = `${MANAGE_BASE}/${envId}/items/${itemId}/variants/codename/${language}/change-workflow`;
  const res = await fetch(url, {
    method: "PUT",
    headers: mapiHeaders(),
    body: JSON.stringify({
      workflow_identifier: { codename: WORKFLOW_CODENAME },
      step_identifier: { codename: STEP_CODENAME },
      contributors,
    }),
  });
  if (!res.ok) {
    throw new Error(`change-workflow failed (${res.status}): ${await res.text()}`);
  }
}

export default async function handler(req: IncomingMessage & { method?: string }, res: ServerResponse): Promise<void> {
  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }

  const envId = process.env.KONTENT_ENVIRONMENT_ID ?? process.env.VITE_ENVIRONMENT_ID;
  const webhookSecret = process.env.KONTENT_WEBHOOK_SECRET;
  // LEGAL_REVIEWER_IDS is a comma-separated list; each entry is a user id (GUID) or an
  // email. (LEGAL_REVIEWER_ID is still honored as a single-value fallback.)
  const reviewerEntries = (process.env.LEGAL_REVIEWER_IDS ?? process.env.LEGAL_REVIEWER_ID ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const reviewerIds = reviewerEntries.filter((e) => !e.includes("@"));
  const reviewerEmails = reviewerEntries.filter((e) => e.includes("@"));

  if (!envId || !webhookSecret || !process.env.KONTENT_MANAGEMENT_API_KEY) {
    return json(res, 500, { error: "Missing server configuration (env id, webhook secret, or management key)" });
  }
  if (reviewerEntries.length === 0) {
    return json(res, 500, { error: "Set LEGAL_REVIEWER_IDS (comma-separated user ids or emails)" });
  }

  const rawBody = await readRawBody(req);
  const signature = String(req.headers[SIGNATURE_HEADER] ?? "");
  if (!signature || !isValidSignature(rawBody, webhookSecret, signature)) {
    return json(res, 401, { error: "Invalid signature" });
  }

  let payload: { notifications?: Notification[] };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return json(res, 400, { error: "Invalid JSON body" });
  }

  const notifications = payload.notifications ?? [];
  const results: Array<Record<string, unknown>> = [];

  for (const n of notifications) {
    const sys = n.data?.system ?? {};

    // Only react to a variant transitioning into *our* legal-review step.
    if (n.message?.action !== "workflow_step_changed") continue;
    if (sys.workflow_step !== STEP_CODENAME) continue;
    if (sys.workflow && sys.workflow !== WORKFLOW_CODENAME) continue;

    const itemId = sys.id;
    const language = sys.language;
    if (!itemId || !language) {
      results.push({ itemId, skipped: "missing item id or language codename" });
      continue;
    }

    try {
      const existingIds = await getContributorIds(envId, itemId, language);

      // Idempotency + loop guard: if every configured reviewer *id* is already a
      // contributor — and we're not also assigning by email (emails can't be matched
      // against the variant's contributors) — there's nothing to do. This also stops
      // any re-fire loop caused by re-affirming the same step.
      const allIdsPresent =
        reviewerIds.length > 0 && reviewerIds.every((id) => existingIds.includes(id));
      if (allIdsPresent && reviewerEmails.length === 0) {
        results.push({ itemId, skipped: "reviewers already assigned" });
        continue;
      }

      // Preserve existing assignees, then add the Legal team (dedupe ids).
      const mergedIds = Array.from(new Set([...existingIds, ...reviewerIds]));
      const contributors: UserRef[] = [
        ...mergedIds.map((id) => ({ id })),
        ...reviewerEmails.map((email) => ({ email })),
      ];

      await assignReviewer(envId, itemId, language, contributors);
      results.push({ itemId, assigned: reviewerEntries });
    } catch (err) {
      results.push({ itemId, error: err instanceof Error ? err.message : String(err) });
    }
  }

  return json(res, 200, { processed: results.length, results });
}
