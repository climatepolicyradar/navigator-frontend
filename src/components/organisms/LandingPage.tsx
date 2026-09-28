import { LucidePause, LucidePlay, LucideSearch } from "lucide-react";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";

import { Button } from "@/components/atoms/button/Button";
import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import { PageLink } from "@/components/atoms/pageLink/PageLink";
import Footer from "@/components/footer/Footer";
import Layout from "@/components/layouts/LandingPage";
import { FeaturesContext } from "@/context/FeaturesContext";
import { ThemeContext } from "@/context/ThemeContext";
import { Header } from "@/cpr/components/Header";
import NotFound from "@/pages/404";
import { TLandingPageConfig } from "@/types";
import { getSuggestionParams } from "@/utils/getSuggestionParams";
import { joinTailwindClasses } from "@/utils/tailwind";

type TProps = {
  config: TLandingPageConfig;
};

type TPartnerLogosProps = {
  partners: NonNullable<TLandingPageConfig["partners"]>;
};

// The width the logos need on a single line, measured per item so it holds whether they are currently wrapped or not
const getSingleLineWidth = (list: HTMLUListElement) => {
  const items = Array.from(list.children);
  const gap = parseFloat(window.getComputedStyle(list).columnGap) || 0;

  return items.reduce((total, item) => total + item.getBoundingClientRect().width, 0) + gap * Math.max(items.length - 1, 0);
};

const PartnerLogos = ({ partners }: TPartnerLogosProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const list = listRef.current;
    if (!container || !list) return;

    // Only scroll when the logos would not fit on one line, and only for those who have not asked for less motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setShouldScroll(!motionQuery.matches && getSingleLineWidth(list) > container.clientWidth);
    const observer = new ResizeObserver(update);

    observer.observe(container);
    observer.observe(list);
    motionQuery.addEventListener("change", update);

    return () => {
      observer.disconnect();
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  const logoItems = partners.logos.map((logo, logoIndex) => (
    <li key={logoIndex}>
      <Image {...logo} alt={logo.alt} className="h-12 w-auto" />
    </li>
  ));

  return (
    <div className="col-start-1 -col-end-1 grid grid-cols-subgrid mt-10 mb-8 cols-4:mb-10 cols-5:mb-12">
      <div className="col-start-1 -col-end-1 cols-5:col-start-2 cols-5:-col-end-2 flex flex-row items-center gap-3 mb-6">
        <h2 className="text-lg text-text-primary font-heavy">{partners.title}</h2>
        {shouldScroll && (
          <button
            type="button"
            onClick={() => setIsPaused((paused) => !paused)}
            className="p-1.5 text-text-secondary hocus:text-text-primary border border-border-light rounded-full"
          >
            {isPaused ? <LucidePlay size={16} /> : <LucidePause size={16} />}
            <span className="sr-only">{isPaused ? "Play" : "Pause"} scrolling logos</span>
          </button>
        )}
      </div>
      <div ref={containerRef} className="col-start-1 -col-end-1 overflow-hidden">
        <div
          className={joinTailwindClasses(
            shouldScroll && "flex w-max animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]",
            isPaused && "[animation-play-state:paused]"
          )}
        >
          <ul ref={listRef} className={joinTailwindClasses("flex items-center gap-10", shouldScroll ? "shrink-0 pr-10" : "flex-wrap justify-center")}>
            {logoItems}
          </ul>
          {shouldScroll && (
            <ul aria-hidden className="flex shrink-0 items-center gap-10 pr-10">
              {logoItems}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export const LandingPage = ({ config }: TProps) => {
  const { themeConfig } = useContext(ThemeContext);

  // Technically this page will still 200 on `!isAvailable`, but render the 404 page.
  // This is because if we were to render 404 at the server level, we would need access
  // to `request.cookies`, which we don't have as these are rendered at build time.
  // This is to allow us to build the pages and release incrementally to production for feedback.
  const features = useContext(FeaturesContext);
  const isAvailable = config.requiredFeature === undefined || features[config.requiredFeature];

  // We alternate a few parts of the layout dependent on whether a heroImage is present
  const heroImage = config.heroImage;
  // The hero is a background image, so its text flips to the inverse palette.
  // There is no inverse equivalent of `text-secondary`, so the muted tone comes from alpha on the inverse colour.
  const heroImageClass = heroImage ? "bg-cover bg-center bg-no-repeat pt-28 md:pt-36 cols-5:pt-44" : "";
  const textClass = heroImage ? "text-text-inverse" : "text-text-primary";
  const descriptionTextClass = heroImage ? "text-text-inverse/80" : "text-text-secondary";
  const suggestionPillClass = heroImage ? "bg-bg-inverse/50 hocus:bg-bg-inverse/64" : "bg-bg-flat hocus:bg-elem-focus";
  // When we have a `heroImage` we make the seawrch bar as wide as the `textContent`
  const contentColumnsClass = "col-start-1 -col-end-1 cols-3:col-end-5 cols-4:col-end-7 cols-5:col-start-2";
  const searchColumnsClass = heroImage
    ? contentColumnsClass
    : "col-start-1 -col-end-1 cols-2:-col-end-2 cols-3:col-end-5 cols-4:col-end-6 cols-5:col-start-2";
  // Over a hero image the search sits 32px below the description, double the 16px the title sits above it
  const searchSectionClass = heroImage ? "relative pt-8" : "pt-8 cols-4:pt-12 cols-5:pt-24";

  // Note: designed for use on CPR app only
  return isAvailable ? (
    <Layout title={config.hero.title} description={config.hero.description} theme="cpr">
      <div className={joinTailwindClasses(heroImage && "relative")}>
        <Header landingPage />
        <main
          id="main"
          className={joinTailwindClasses(
            "pb-4 cols-4:pb-12 cols-5:pb-24",
            !heroImage && "pt-4 cols-4:pt-12 cols-5:pt-24 border-t border-t-border-light"
          )}
        >
          {/* The hero image, when set, sits behind the header, hero text and search. Everything in here inherits its text colour. */}
          <div className={joinTailwindClasses(textClass, heroImageClass)} style={heroImage && { backgroundImage: `url(${heroImage.src})` }}>
            <FiveColumns>
              <div className="col-start-1 -col-end-1 cols-2:-col-end-2 cols-3:col-end-5 cols-4:col-end-6 cols-5:col-start-2">
                <span className={joinTailwindClasses("text-base leading-6 font-normal", descriptionTextClass)}>{config.hero.taxonomy}</span>
                <h1 className="mt-0.5 mb-4 text-5xl text-balance font-heavy leading-none tracking-[-0.4px]">{config.hero.title}</h1>
              </div>
              <div className="col-start-1 -col-end-1 cols-5:col-start-2 cols-5:-col-end-2">
                <p className="text-xl text-balance leading-6">{config.hero.description}</p>
              </div>
            </FiveColumns>
            <FiveColumns className={searchSectionClass}>
              <div className={joinTailwindClasses(searchColumnsClass, "mb-8 cols-4:mb-10 cols-5:mb-12")}>
                <PageLink href="/search" query={getSuggestionParams(config.search.button, themeConfig)}>
                  <Button className="w-full mb-6 p-4! bg-[#005296]!">
                    <LucideSearch size={16} />
                    <span className="ml-1 text-base text-white font-medium leading-5">{config.search.button.label}</span>
                  </Button>
                </PageLink>
                <h3 className="mb-1.5 text-sm font-medium leading-6">Suggestions:</h3>
                <ul className="flex flex-row flex-wrap items-center gap-2">
                  {config.search.suggestions.map((suggestion, suggestionIndex) => (
                    <li key={suggestionIndex}>
                      <PageLink
                        href="/search"
                        query={getSuggestionParams(suggestion, themeConfig)}
                        className={joinTailwindClasses(
                          // The 24px line box plus 8px of padding top and bottom makes the pill 40px tall, so the type drives the height
                          "inline-flex flex-row items-center gap-1 px-3 py-2 rounded-full text-base font-normal leading-6",
                          suggestionPillClass
                        )}
                      >
                        <LucideSearch size={16} />
                        <span>{suggestion.label}</span>
                      </PageLink>
                    </li>
                  ))}
                </ul>
              </div>
            </FiveColumns>
          </div>
          <FiveColumns>
            {config.background && (
              <div className={config.background.classes}>
                <Image {...config.background.image} alt={config.background.image.alt} />
              </div>
            )}
            {config.partners && <PartnerLogos partners={config.partners} />}
            <div className={joinTailwindClasses(contentColumnsClass, "grid grid-cols-subgrid gap-y-8 cols-4:gap-y-10 cols-5:gap-y-12")}>
              {config.textContent.map(({ title, content }, contentIndex) => (
                <div key={contentIndex} className="col-start-1 -col-end-1 text-base text-text-primary font-normal leading-6">
                  <h2 className="mb-3 text-lg font-heavy">{title}</h2>
                  {content}
                </div>
              ))}
            </div>
            {config.organisation && (
              <aside aria-label={`About ${config.organisation.name}`} className="col-span-2 cols-3:-col-end-1 cols-5:-col-end-2">
                <div className="cols-5:min-w-50 px-5 py-4 mt-8 cols-3:mt-0 bg-white border border-border-light rounded-xl">
                  <Image {...config.organisation.logoImage} alt={config.organisation.logoImage.alt} className="w-full max-w-85 mb-1" />

                  <ul className="text-base font-normal leading-5">
                    {config.organisation.links.map(({ externalHref, label }, linkIndex) => {
                      const [pathname, hash] = externalHref.split("#");

                      return (
                        <li key={linkIndex}>
                          <PageLink
                            external
                            href={pathname}
                            hash={hash}
                            className={joinTailwindClasses("block py-3", linkIndex && "border-t border-t-border-light")}
                          >
                            {label}
                          </PageLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </aside>
            )}
          </FiveColumns>
        </main>
      </div>
      <Footer />
    </Layout>
  ) : (
    <NotFound />
  );
};
