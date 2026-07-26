import { FC } from "react";
import Container from "../../components/Container";

const categories = ["Getting Started", "Trading Platform", "Payments", "Account", "Security"];

/*
 * Knowledge Base — a friendly, search-first help-center header. Bright hero band, centered
 * wordmark, a large search field as the primary action, and category quick-link chips.
 */
const KnowledgeBaseHeader: FC = () => (
  <header className="bg-primary text-white font-sans">
    <Container>
      <div className="flex flex-col items-center text-center py-14 md:py-20 gap-6">
        <div className="flex items-center gap-2 text-sm font-medium tracking-wide">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white font-semibold">
            GV
          </span>
          <span className="opacity-90">Granite View</span>
          <span className="opacity-50">/</span>
          <span className="font-semibold">Help Center</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-semibold">How can we help?</h1>
        <p className="text-white/70 text-base md:text-lg max-w-xl">
          Search our guides and articles, or browse a category to get started.
        </p>

        <form
          className="w-full max-w-2xl flex items-stretch gap-2 rounded-full bg-white p-2 shadow-lg"
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

        <ul className="flex flex-wrap justify-center gap-2 pt-2">
          {categories.map(category => (
            <li key={category}>
              <a
                href="#"
                className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 transition-colors hover:bg-accent hover:text-white"
              >
                {category}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  </header>
);

export default KnowledgeBaseHeader;
