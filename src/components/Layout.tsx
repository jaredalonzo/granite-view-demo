import { FC, PropsWithChildren, useEffect } from "react";
import Footer from "./Footer";
import SiteSwitcher from "./SiteSwitcher";
import { useSite } from "../context/SiteContext";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { site, locked } = useSite();
  const Header = site.Header;

  // Keep <html data-site="..."> in sync when the switcher changes the active site.
  useEffect(() => {
    document.documentElement.dataset.site = site.key;
  }, [site.key]);

  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      {!locked && <SiteSwitcher />}
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
