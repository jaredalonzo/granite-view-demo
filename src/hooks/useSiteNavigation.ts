import { useQuery } from "@tanstack/react-query";
import { NavigationItemType } from "../model";
import { useAppContext } from "../context/AppContext";
import { useSite } from "../context/SiteContext";
import { createClient } from "../utils/client";

/*
 * Content-managed navigation. Each site (collection) has a single root `navigation_item`
 * (codename `nav_<collection>_root`) whose `subpages` are the top-level menu items. Fetched with
 * depth so nested subpages resolve in one call. See Kontent.ai "choose a navigation approach".
 */
export type NavNode = Readonly<{ title: string; url: string; children: ReadonlyArray<NavNode> }>;

const toNode = (item: NavigationItemType): NavNode => ({
  title: item.elements.title?.value ?? "",
  url: item.elements.slug?.value || "#",
  children: (item.elements.subpages?.linkedItems ?? []).map(toNode),
});

export const useSiteNavigation = (): ReadonlyArray<NavNode> => {
  const { environmentId, apiKey } = useAppContext();
  const { site } = useSite();

  const { data } = useQuery({
    queryKey: ["navigation", site.collection],
    queryFn: () =>
      createClient(environmentId, apiKey)
        .items()
        .type("navigation_item")
        .equalsFilter("system.codename", `nav_${site.collection}_root`)
        .depthParameter(3)
        .toPromise()
        .then(res => (res.data.items[0] as NavigationItemType | undefined) ?? null)
        .catch(() => null),
  });

  if (!data) {
    return [];
  }
  return (data.elements.subpages?.linkedItems ?? []).map(toNode);
};
