import { FC } from "react";

const Logo: FC = () => (
  <div className="flex gap-4 items-center">
    <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="44" height="44" rx="5" fill="#0B2545" />
      <rect x="9" y="23" width="10" height="12" rx="1" fill="#8DA9C4" />
      <rect x="20" y="17" width="10" height="18" rx="1" fill="#C9A24B" />
      <rect x="14" y="10" width="10" height="10" rx="1" fill="#F4F6F9" />
    </svg>
    <p className="text-4xl md:text-5xl pt-1 text-primary font-serif font-bold text-nowrap leading-none">
      Granite View <span className="text-accent">Group</span>
    </p>
  </div>
);

export default Logo;
