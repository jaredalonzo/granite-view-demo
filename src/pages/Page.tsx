import { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DeliveryError } from "@kontent-ai/delivery-sdk";
import { transformToPortableText } from "@kontent-ai/rich-text-resolver";
import { PortableText } from "@kontent-ai/rich-text-resolver/utils/react";
import { PageType } from "../model";
import { createClient } from "../utils/client";
import { useAppContext } from "../context/AppContext";
import { useSite } from "../context/SiteContext";
import { defaultPortableRichTextResolvers } from "../utils/richtext";
import Layout from "../components/Layout";
import PageSection from "../components/PageSection";

/*
 * Generic content page reached from a nav slug (/:slug). Resolves the `page` item with the
 * matching slug in the active site's collection and renders its rich-text body in the site theme.
 */
const Page: FC = () => {
  const { slug } = useParams();
  const { environmentId, apiKey } = useAppContext();
  const { site } = useSite();

  const { data: page } = useSuspenseQuery({
    queryKey: ["page", site.collection, slug],
    queryFn: () =>
      createClient(environmentId, apiKey)
        .items()
        .type("page")
        .collection(site.collection)
        .equalsFilter("elements.slug", slug ?? "")
        .limitParameter(1)
        .toPromise()
        .then(res => (res.data.items[0] as PageType | undefined) ?? null)
        .catch((err) => {
          if (err instanceof DeliveryError) {
            return null;
          }
          throw err;
        }),
  });

  const title = page?.elements.title?.value
    ?? (slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Page");
  const body = page?.elements.body?.value;

  return (
    <Layout>
      <div className="flex-grow">
        <PageSection color="bg-canvas">
          <div className="py-16 md:py-24">
            <nav className="text-sm">
              <Link to="/" className="font-semibold text-secondary hover:text-primary">Home</Link>
              <span className="mx-2 text-muted">/</span>
              <span className="font-semibold text-primary">{title}</span>
            </nav>
            <h1 className="mt-4 font-serif text-4xl md:text-6xl font-bold text-primary leading-tight">{title}</h1>
            {body
              ? (
                <div className="mt-8 flex max-w-3xl flex-col gap-6">
                  <PortableText value={transformToPortableText(body)} components={defaultPortableRichTextResolvers} />
                </div>
              )
              : <p className="mt-6 max-w-2xl text-lg text-gray-700">This page is being prepared.</p>}
            <Link to="/" className="mt-10 inline-flex items-center gap-2 font-semibold text-accent">← Back home</Link>
          </div>
        </PageSection>
      </div>
    </Layout>
  );
};

export default Page;
