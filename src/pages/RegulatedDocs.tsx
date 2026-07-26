import { FC } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DeliveryError } from "@kontent-ai/delivery-sdk";
import { Link } from "react-router-dom";
import { ArticleType } from "../model";
import { createClient } from "../utils/client";
import { useAppContext } from "../context/AppContext";
import { Replace } from "../utils/types";
import { formatDate } from "../utils/date";
import Layout from "../components/Layout";
import PageSection from "../components/PageSection";

type Article = Replace<ArticleType, { elements: Partial<ArticleType["elements"]> }>;

const stepStyles: Record<string, { label: string; className: string }> = {
  legal_review: { label: "In Legal review", className: "bg-accent/20 text-primary border-accent" },
  regulated_draft: { label: "Draft", className: "bg-muted/20 text-secondary border-muted" },
  published: { label: "Published", className: "bg-green-100 text-green-800 border-green-300" },
};

const WorkflowPill: FC<{ step: string | null }> = ({ step }) => {
  const fallback = { label: step ?? "Unknown", className: "bg-gray-100 text-gray border-gray-300" };
  const s = step ? stepStyles[step] ?? fallback : fallback;
  return <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border ${s.className}`}>{s.label}</span>;
};

const GovItem: FC<{ label: string; value?: string }> = ({ label, value }) =>
  value
    ? (
      <div>
        <dt className="text-gray-light uppercase tracking-wide text-[11px] font-semibold">{label}</dt>
        <dd className="text-primary font-medium">{value}</dd>
      </div>
    )
    : null;

const RegulatedDocs: FC = () => {
  const { environmentId, apiKey } = useAppContext();

  const { data: articles } = useSuspenseQuery({
    queryKey: ["regulated_docs_articles"],
    queryFn: () =>
      createClient(environmentId, apiKey)
        .items()
        .type("article")
        .collection("regulated_docs")
        .toPromise()
        .then(res => res.data.items as ReadonlyArray<Article>)
        .catch((err) => {
          if (err instanceof DeliveryError) {
            return [];
          }
          throw err;
        }),
  });

  return (
    <Layout>
      <div className="flex-grow">
        <PageSection color="bg-canvas">
          <div className="py-12">
            <Link to="/" className="text-secondary hover:text-primary text-sm font-semibold">← Back to site</Link>
            <h1 className="font-serif text-5xl md:text-6xl text-primary font-bold mt-4">Regulated Documentation</h1>
            <p className="text-xl text-gray mt-4 max-w-3xl">
              Controlled disclosures governed by the Legal review workflow. Each document is versioned, dated, and
              cannot be published until it clears Legal.
            </p>
          </div>
        </PageSection>
        <PageSection color="bg-white">
          <ul className="flex flex-col gap-6 py-12">
            {articles.length === 0 && <p className="text-gray">No regulated documents found.</p>}
            {articles.map(article => (
              <li key={article.system.id} className="border border-muted/40 rounded-xl p-6 bg-white shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-2xl font-semibold text-primary">{article.elements.title?.value}</h2>
                  <WorkflowPill step={article.system.workflowStep} />
                </div>
                <p className="text-gray-700 mt-2">{article.elements.introduction?.value}</p>
                <dl className="flex flex-wrap gap-x-8 gap-y-3 mt-5 text-sm">
                  <GovItem label="Version" value={article.elements.version?.value} />
                  <GovItem label="Approved by" value={article.elements.approved_by?.value} />
                  <GovItem
                    label="Effective"
                    value={article.elements.effective_date?.value
                      ? formatDate(article.elements.effective_date.value)
                      : undefined}
                  />
                  <GovItem label="Reference" value={article.elements.disclosure_id?.value} />
                  <GovItem label="Last modified" value={formatDate(article.system.lastModified)} />
                </dl>
              </li>
            ))}
          </ul>
        </PageSection>
      </div>
    </Layout>
  );
};

export default RegulatedDocs;
