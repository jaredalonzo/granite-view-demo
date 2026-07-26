import { FC } from "react";
import { isArticleType, isEventType, LandingPageType } from "../model";
import Container from "./Container";
import PageSection from "./PageSection";
import FeaturedArticle from "./FeaturedArticle";
import FeaturedEvent from "./FeaturedEvent";
import Divider from "./Divider";

type FeaturedContentProps = {
  featuredContent: LandingPageType["elements"]["featured_content"];
};

const FeaturedContent: FC<FeaturedContentProps> = ({ featuredContent }) => {
  const featuredArticle = featuredContent.linkedItems.find(isArticleType);
  const featuredEvent = featuredContent.linkedItems.find(isEventType);

  if (!featuredArticle && !featuredEvent) {
    return null;
  }

  return (
    <>
      <Container>
        <h2 className="pt-20 md:pt-28 mb-4 text-4xl md:text-5xl font-serif font-bold text-primary text-center">
          Featured Content
        </h2>
      </Container>
      {featuredArticle && (
        <PageSection color="bg-canvas">
          <FeaturedArticle article={featuredArticle} />
        </PageSection>
      )}

      {featuredArticle && featuredEvent && <Divider />}

      {featuredEvent && (
        <PageSection color="bg-white">
          <FeaturedEvent event={featuredEvent} />
        </PageSection>
      )}
    </>
  );
};

export default FeaturedContent;
