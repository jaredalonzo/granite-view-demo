import { Elements } from "@kontent-ai/delivery-sdk";
import { FC, ReactNode } from "react";
import RenderElement from "./RenderElement";
import Container from "./Container";
import { landingPageLink } from "../constants/links";

type HeroImageProps = Readonly<{
  data: {
    headline?: Elements.TextElement;
    subheadline?: Elements.TextElement;
    heroImage?: Elements.AssetsElement;
  };
  /** Optional content rendered on top of the hero image, below the copy (e.g. the KB search). */
  overlay?: ReactNode;
}>;

const HeroImage: FC<HeroImageProps> = ({ data, overlay }) => {
  const asset = data.heroImage?.value[0];

  // When the landing page has a hero image, render a full-bleed hero banner: the image fills the
  // section and the headline/subheadline sit on top of a left-to-right themed scrim (dark on the
  // text side, transparent on the image side) so the copy stays legible. Public Web uses this.
  if (asset) {
    return (
      <section className="relative w-full overflow-hidden bg-primary">
        <img
          src={`${asset.url}?auto=format&w=2000`}
          alt={asset.description ?? ""}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/20" />
        <Container>
          <div className="relative max-w-2xl py-24 md:py-36 xl:py-48">
            <h1 className="font-serif text-5xl md:text-7xl xl:text-[80px] font-bold leading-[1.05] text-white">
              {data.headline?.value}
            </h1>
            {data.subheadline?.value && (
              <p className="mt-6 font-sans text-xl text-white/80">{data.subheadline.value}</p>
            )}
            {overlay && <div className="mt-8">{overlay}</div>}
          </div>
        </Container>
      </section>
    );
  }

  // No hero image: keep the headline/subheadline text layout (other sites).
  return (
    <div className="bg-canvas">
      <Container>
        <div className="flex flex-col xl:flex-row pt-10 xl:pt-[104px] pb-10 xl:pb-[160px] gap-5">
          <div className="xl:basis-1/2">
            <RenderElement
              element={data.headline}
              elementCodename="headline"
              requiredElementType="text"
              typeCodename={"landing_page"}
              link={landingPageLink}
            >
              <h1 className="text-center xl:text-left font-serif text-[64px] md:text-[94px] text-primary font-bold leading-[64px] md:leading-[78px]">
                {data.headline?.value}
              </h1>
            </RenderElement>
            <RenderElement
              element={data.subheadline}
              elementCodename="subheadline"
              requiredElementType="text"
              typeCodename={"landing_page"}
              link={landingPageLink}
            >
              <p className="text-center xl:text-left font-sans text-xl text-gray mt-6">{data.subheadline?.value}</p>
            </RenderElement>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HeroImage;
