import { FC } from "react";
import { Link } from "react-router-dom";
import { useSiteNavigation } from "../hooks/useSiteNavigation";

/*
 * Knowledge Base search + category filters, designed to sit on top of the hero image (rendered as
 * the hero overlay). The search field is a solid white pill for contrast; the category chips are
 * translucent over the photo with a subtle ring so they stay legible.
 */
const KnowledgeBaseSearch: FC = () => {
  const items = useSiteNavigation();

  return (
    <div className="flex flex-col gap-4">
      <form
        className="w-full max-w-2xl flex items-stretch gap-2 rounded-full bg-white p-2 shadow-xl"
        onSubmit={e => e.preventDefault()}
      >
        <input
          type="search"
          placeholder="Search articles and guides…"
          aria-label="Search articles and guides"
          className="flex-1 min-w-0 rounded-full px-5 py-3 text-primary placeholder:text-gray-light focus:outline-none font-sans"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-accent px-5 md:px-7 py-3 font-semibold text-white transition-colors hover:brightness-110"
        >
          Search
        </button>
      </form>

      <ul className="flex flex-wrap gap-2">
        {items.map(item => (
          <li key={item.title}>
            <Link
              to={item.url}
              className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-accent hover:ring-accent"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KnowledgeBaseSearch;
