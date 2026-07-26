import { FC } from "react";
import Logo from "./Logo";
import Navigation from "./Navigation";
import Divider from "./Divider";

const Footer: FC = () => (
  <footer className="w-full">
    <div className="flex flex-col items-center gap-10 py-20">
      <Logo />
      <Navigation />
    </div>
    <Divider />
    <div className="max-w-4xl mx-auto text-center py-[60px] px-6 flex flex-col gap-3">
      <p className="text-[16px] text-gray-light">©2026 Granite View Group Inc. All Rights Reserved.</p>
      <p className="text-[13px] leading-5 text-gray-light">
        Granite View Group Inc. provides risk management, payments, and asset trading services to institutional,
        commercial, and individual clients across global markets. This material is for informational purposes only
        and does not constitute investment, legal, or tax advice. Products and services are subject to applicable
        regulatory approval and may not be available in all jurisdictions.
      </p>
    </div>
  </footer>
);

export default Footer;
