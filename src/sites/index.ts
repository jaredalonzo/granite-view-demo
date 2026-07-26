import { SiteConfig, SiteKey } from "./types";
import PublicWebHeader from "./public-web/Header";
import IntranetHeader from "./intranet/Header";
import KnowledgeBaseHeader from "./knowledge-base/Header";
import RegulatedDocsHeader from "./regulated-docs/Header";

export const sites: Record<SiteKey, SiteConfig> = {
  public_web: {
    key: "public_web",
    collection: "public_web",
    label: "Public Web",
    tagline: "Public marketing site for clients and prospects.",
    Header: PublicWebHeader,
  },
  intranet: {
    key: "intranet",
    collection: "intranet",
    label: "Intranet",
    tagline: "Internal portal for Granite View employees.",
    Header: IntranetHeader,
  },
  knowledge_base: {
    key: "knowledge_base",
    collection: "knowledge_base",
    label: "Knowledge Base",
    tagline: "Support articles and how-to guidance.",
    Header: KnowledgeBaseHeader,
  },
  regulated_docs: {
    key: "regulated_docs",
    collection: "regulated_docs",
    label: "Regulated Docs",
    tagline: "Controlled, Legal-approved disclosures.",
    Header: RegulatedDocsHeader,
  },
};

export const siteList: ReadonlyArray<SiteConfig> = Object.values(sites);

export const defaultSite: SiteConfig = sites.public_web;

const isSiteKey = (value: string | undefined): value is SiteKey => !!value && value in sites;

/** Site pinned at build time via VITE_SITE (per Vercel branch), or null for the all-sites build. */
export const resolveLockedSite = (): SiteConfig | null => {
  const key = import.meta.env.VITE_SITE as string | undefined;
  return isSiteKey(key) ? sites[key] : null;
};
