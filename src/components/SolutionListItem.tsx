import { FC, useEffect, useState } from "react";
import Container from "./Container";
import { useAppContext } from "../context/AppContext";
import { useSite } from "../context/SiteContext";
import { SolutionType as Solution } from "../model";
import { Replace } from "../utils/types";
import { createClient } from "../utils/client";

type SolutionItem = Replace<Solution, { elements: Partial<Solution["elements"]> }>;

/*
 * Service lines as Algolia-style full-bleed sections: each solution is its own full-width band
 * whose background alternates between the site's two-tone pair (alt-a / alt-b). The band spans
 * edge-to-edge; a centered Container holds the zigzag content (text one side, visual the other).
 */
const SolutionList: FC = () => {
  const { environmentId, apiKey } = useAppContext();
  const { site } = useSite();
  const [solutions, setSolutions] = useState<ReadonlyArray<SolutionItem> | null>(null);

  useEffect(() => {
    createClient(environmentId, apiKey)
      .items()
      .type("solution")
      .collection(site.collection)
      .toPromise()
      .then(res => setSolutions(res.data.items as ReadonlyArray<SolutionItem>))
      .catch(() => setSolutions([]));
  }, [environmentId, apiKey, site.collection]);

  if (!solutions || solutions.length === 0) {
    return null;
  }

  return (
    <>
      {site.key !== "knowledge_base" && (
        <div className="bg-white">
          <Container>
            <div className="max-w-2xl pt-20 pb-12 md:pt-28 md:pb-16">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">What we do</p>
              <h2 className="mt-3 font-serif text-4xl md:text-5xl font-bold text-primary leading-tight">
                Solutions built for how you operate
              </h2>
            </div>
          </Container>
        </div>
      )}
      {solutions.map((solution, i) => <SolutionBand key={solution.system.id} solution={solution} index={i} />)}
    </>
  );
};

type SolutionBandProps = Readonly<{ solution: SolutionItem; index: number }>;

const SolutionBand: FC<SolutionBandProps> = ({ solution, index }) => {
  const isA = index % 2 === 0;
  const headline = solution.elements.headline?.value;
  const introduction = solution.elements.introduction?.value;
  const image = solution.elements.image?.value[0];
  const num = String(index + 1).padStart(2, "0");

  // Full-width band background alternates between the site's two-tone pair. Literal class
  // strings so Tailwind's content scanner generates them.
  const bandBg = isA ? "bg-alt-a/15" : "bg-alt-b/15";
  const toneText = isA ? "text-alt-a" : "text-alt-b";
  const panelRing = isA ? "ring-alt-a/25" : "ring-alt-b/25";
  const watermarkTone = isA ? "text-alt-a/15" : "text-alt-b/15";
  const panelLabelTone = isA ? "text-alt-a/70" : "text-alt-b/70";

  return (
    <div className={`w-full ${bandBg}`}>
      <Container>
        <div
          className={`flex flex-col items-center gap-8 py-16 md:py-24 lg:gap-16 ${
            isA ? "lg:flex-row" : "lg:flex-row-reverse"
          }`}
        >
          <div className="lg:w-1/2">
            <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${toneText}`}>{num} · Service line</p>
            <h3 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-primary leading-tight">{headline}</h3>
            <p className="mt-5 text-lg leading-relaxed text-gray-700">{introduction}</p>
            <a href="#" className={`group mt-7 inline-flex items-center gap-2 font-semibold ${toneText}`}>
              Learn more
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>

          <div className="w-full lg:w-1/2">
            <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-white ring-1 ${panelRing}`}>
              {image
                ? (
                  <img
                    src={`${image.url}?auto=format&w=900`}
                    alt={image.description ?? headline ?? "solution"}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )
                : (
                  <>
                    <span
                      className={`pointer-events-none absolute -right-4 -top-10 select-none font-serif text-[11rem] font-bold leading-none ${watermarkTone}`}
                    >
                      {num}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center p-10 text-center">
                      <span className={`font-serif text-2xl font-semibold md:text-3xl ${panelLabelTone}`}>
                        {headline}
                      </span>
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SolutionList;
