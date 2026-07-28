import { FC } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/Container";

/*
 * Knowledge Base — condensed brand bar. The search field and category filters no longer live here;
 * they render as an overlay on the hero image (see KnowledgeBaseSearch), so the header stays slim.
 */
const KnowledgeBaseHeader: FC = () => {
  return (
    <header className="bg-primary text-white font-sans">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium tracking-wide" aria-label="Granite View home">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-white font-semibold">
              GV
            </span>
            <span className="opacity-90">Granite View</span>
            <span className="opacity-50">/</span>
            <span className="font-semibold">Help Center</span>
          </Link>
        </div>
      </Container>
    </header>
  );
};

export default KnowledgeBaseHeader;
