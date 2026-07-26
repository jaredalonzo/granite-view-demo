import { createContext, FC, PropsWithChildren, useContext, useMemo, useState } from "react";
import { SiteConfig } from "../sites/types";
import { defaultSite, resolveLockedSite } from "../sites";

type SiteContextValue = {
  site: SiteConfig;
  setSite: (site: SiteConfig) => void;
  /** True when the build is pinned to one site (VITE_SITE set) — the switcher is hidden. */
  locked: boolean;
};

const lockedSite = resolveLockedSite();

const SiteContext = createContext<SiteContextValue>({
  site: lockedSite ?? defaultSite,
  setSite: () => {},
  locked: !!lockedSite,
});

export const useSite = () => useContext(SiteContext);

export const SiteProvider: FC<PropsWithChildren> = ({ children }) => {
  const [site, setSite] = useState<SiteConfig>(lockedSite ?? defaultSite);
  const value = useMemo(() => ({ site, setSite, locked: !!lockedSite }), [site]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};
