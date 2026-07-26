import type { FC } from "react";
import type { CollectionCodenames } from "../model";

/*
 * A "site" is one channel rendered with its own theme + header. All sites read from the same
 * Kontent.ai environment, filtered by their collection. The active site is selected either by
 * the VITE_SITE env var (locked, per-Vercel-branch build) or the SiteSwitcher (all-sites build).
 */
export type SiteKey = Exclude<CollectionCodenames, "default">;

export type SiteConfig = Readonly<{
  key: SiteKey;
  /** Kontent.ai collection this site's content comes from (same as key). */
  collection: SiteKey;
  label: string;
  tagline: string;
  /** Per-site header component — the main visual differentiator. */
  Header: FC;
}>;
