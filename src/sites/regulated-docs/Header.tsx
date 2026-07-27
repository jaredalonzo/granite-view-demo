import { FC } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/Container";
import { useSiteNavigation } from "../../hooks/useSiteNavigation";

/*
 * Regulated Documentation — formal, high-contrast, minimal header for a controlled document
 * library. Austere by design: classification strip, serif wordmark, sparse nav. Themes via
 * semantic tokens (primary → near-black, accent → oxblood).
 */
const RegulatedDocsHeader: FC = () => {
  const items = useSiteNavigation();

  return (
    <header className="w-full border-b border-muted/50">
      {/* Classification accent rule */}
      <div className="h-1 w-full bg-accent" />

      {/* Classification strip */}
      <div className="bg-primary text-white">
        <Container>
          <div className="flex flex-col gap-1 py-2 font-mono text-[10px] uppercase tracking-[0.2em] sm:flex-row sm:items-center sm:justify-between sm:text-[11px]">
            <span className="text-white/80">
              Controlled Document Library
              <span className="text-accent"> · </span>
              Confidential — Internal Use
            </span>
            <span className="text-white/55">Governed by Legal review workflow</span>
          </div>
        </Container>
      </div>

      {/* Masthead */}
      <div className="bg-canvas">
        <Container>
          <div className="flex flex-col gap-6 py-8 lg:flex-row lg:items-end lg:justify-between">
            <Link to="/" className="flex flex-col gap-1" aria-label="Granite View Group home">
              <span className="font-serif text-3xl font-bold leading-none text-primary md:text-4xl">
                Granite View Group
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-secondary">
                Regulated Documentation
              </span>
            </Link>

            <nav aria-label="Regulated documentation">
              <ul className="flex flex-wrap gap-x-8 gap-y-2 font-sans text-sm uppercase tracking-[0.15em] text-secondary">
                {items.map(item => (
                  <li key={item.title}>
                    <a
                      href="#"
                      className="border-b border-transparent pb-1 transition-colors hover:border-accent/60 hover:text-primary"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default RegulatedDocsHeader;
