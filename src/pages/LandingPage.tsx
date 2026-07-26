import { DeliveryError } from "@kontent-ai/delivery-sdk";

import HeroImage from "../components/HeroImage";
import PageContent from "../components/PageContent";
import PageSection from "../components/PageSection";
import "../index.css";
import { type LandingPageType } from "../model";
import { createClient } from "../utils/client";
import { useSuspenseQueries } from "@tanstack/react-query";
import { FC } from "react";
import { useAppContext } from "../context/AppContext";
import { useSite } from "../context/SiteContext";
import { Replace } from "../utils/types";
import RenderElement from "../components/RenderElement";
import FeaturedContent from "../components/FeaturedContent";
import KontentComponentErrorMessage from "../components/KontentComponentErrorMessage";
import Layout from "../components/Layout";
import { landingPageLink } from "../constants/links";
import SolutionList from "../components/SolutionListItem";
import { Link } from "react-router-dom";

const LandingPage: FC = () => {
  const { environmentId, apiKey } = useAppContext();
  const { site } = useSite();

  const [landingPageType, landingPage] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["landing_page_type"],
        queryFn: () =>
          createClient(environmentId, apiKey)
            .type("landing_page")
            .toPromise()
            .then(res => res.data)
            .catch((err) => {
              if (err instanceof DeliveryError) {
                return null;
              }
              throw err;
            }),
      },
      {
        queryKey: ["landing_page", site.collection],
        queryFn: () =>
          createClient(environmentId, apiKey)
            .items()
            .type("landing_page")
            .collection(site.collection)
            .limitParameter(1)
            .toPromise()
            .then(res =>
              res.data.items[0] as Replace<LandingPageType, { elements: Partial<LandingPageType["elements"]> }> ?? null
            )
            .catch((err) => {
              if (err instanceof DeliveryError) {
                return null;
              }
              throw err;
            }),
      },
    ],
  });

  if (!landingPageType.data) {
    return (
      <Layout>
        <div className="flex-grow">
          <PageSection color="white">
            <KontentComponentErrorMessage>
              Missing a content type with the codename{"  "}
              <b>
                <i>{"landing_page"}</i>
              </b>. Please create the{"  "}
              <a
                href="https://kontent.ai/learn/try-kontent-ai/build-the-foundation/create-a-landing-page-structure#a-create-a-landing-page-content-type"
                className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
              >
                Landing Page content type
              </a>{" "}
              according to the instructions.
            </KontentComponentErrorMessage>
          </PageSection>
        </div>
      </Layout>
    );
  }

  if (!landingPage.data || !Object.entries(landingPage.data.elements).length) {
    return (
      <Layout>
        <div className="flex-grow" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-grow">
        <PageSection color="bg-canvas">
          <HeroImage
            data={{
              headline: landingPage.data.elements.headline,
              subheadline: landingPage.data.elements.subheadline,
              heroImage: landingPage.data.elements.hero_image,
            }}
          />
        </PageSection>
        {site.collection === "regulated_docs" && (
          <PageSection color="bg-primary">
            <div className="py-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-white text-xl">
                Browse all controlled, Legal-approved documentation.
              </p>
              <Link
                to="/regulated-docs"
                className="bg-accent text-primary font-semibold px-6 py-3 rounded-lg hover:bg-white transition-colors whitespace-nowrap"
              >
                Open the regulated documentation portal →
              </Link>
            </div>
          </PageSection>
        )}
        <PageSection color="bg-white">
          <SolutionList />
        </PageSection>
        <RenderElement
          element={landingPage.data.elements.body_copy}
          elementCodename="body_copy"
          requiredElementType="rich_text"
          errorMessageClassName="container"
          typeCodename={"landing_page"}
          link={landingPageLink}
        >
          <PageSection color="bg-white">
            <PageContent body={landingPage.data.elements.body_copy!} />
          </PageSection>
        </RenderElement>
        <RenderElement
          element={landingPage.data.elements.featured_content}
          elementCodename="featured_content"
          requiredElementType="modular_content"
          errorMessageClassName="container"
          typeCodename={"landing_page"}
          link={landingPageLink}
        >
          <FeaturedContent featuredContent={landingPage.data.elements.featured_content!}></FeaturedContent>
        </RenderElement>
      </div>
    </Layout>
  );
};

export default LandingPage;
