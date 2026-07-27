import { FC } from "react";
import { Link } from "react-router-dom";
import { useSiteNavigation } from "../hooks/useSiteNavigation";

const Navigation: FC = () => {
  const items = useSiteNavigation();

  return (
    <nav>
      <menu className="flex flex-col lg:flex-row gap-5 lg:gap-[60px] items-center list-none">
        {items.map(item => (
          <li key={item.title}>
            <Link to={item.url} className="text-xl leading-5 text-gray w-fit block hover:text-accent">
              {item.title}
            </Link>
          </li>
        ))}
      </menu>
    </nav>
  );
};

export default Navigation;
