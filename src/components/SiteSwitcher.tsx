import { FC } from "react";
import { sites, siteList } from "../sites";
import { SiteKey } from "../sites/types";
import { useSite } from "../context/SiteContext";

/*
 * Demo control shown only on the all-sites build (VITE_SITE unset). Selecting a site swaps its
 * theme, header, and content collection at once — the "one content source, four sites" reveal.
 */
const SiteSwitcher: FC = () => {
  const { site, setSite } = useSite();

  return (
    <div className="w-full bg-primary text-white">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-2 py-2 text-sm">
        <span className="font-semibold opacity-80">Demo · one Kontent.ai source, four sites</span>
        <label className="flex items-center gap-2">
          <span className="uppercase text-xs tracking-wide opacity-70">Site</span>
          <select
            value={site.key}
            onChange={e => {
              const next = sites[e.target.value as SiteKey];
              if (next) {
                setSite(next);
              }
            }}
            aria-label="Select site"
            className="rounded bg-white/15 border border-white/30 px-3 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {siteList.map(s => <option key={s.key} value={s.key} className="text-black">{s.label}</option>)}
          </select>
        </label>
      </div>
    </div>
  );
};

export default SiteSwitcher;
