import { ParsedUrlQuery } from "querystring";

import { LucideSearch } from "lucide-react";
import Image from "next/image";
import { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/atoms/button/Button";
import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import { PageLink } from "@/components/atoms/pageLink/PageLink";
import Footer from "@/components/footer/Footer";
import Layout from "@/components/layouts/LandingPage";
import { Header } from "@/cpr/components/Header";
import { joinTailwindClasses } from "@/utils/tailwind";

type TImageProps = ComponentProps<typeof Image> & {
  // Prevents no width/height runtime error
  width: number;
  height: number;
};

type TSearchSuggestion = {
  label: string;
  query: ParsedUrlQuery;
};

export type TLandingPageConfig = {
  background: {
    classes?: string;
    image?: TImageProps;
  };
  hero: {
    description: string;
    taxonomy: string;
    title: string;
  };
  organisation: {
    logoImage: TImageProps;
    links: {
      label: string;
      externalHref: string;
    }[];
  };
  search: {
    button: TSearchSuggestion;
    suggestions: TSearchSuggestion[];
  };
  textContent: {
    title: string;
    content: ReactNode;
  }[];
};

type TProps = {
  config: TLandingPageConfig;
};

export const LandingPage = ({ config }: TProps) => {
  // Note: designed for use on CPR app only
  return (
    <Layout title={config.hero.title} description={config.hero.description} theme="cpr">
      <Header landingPage />
      <div className="py-4 cols-4:py-12 cols-5:py-24 border-t border-t-border-light">
        <FiveColumns>
          <div className="col-start-1 -col-end-1 cols-3:col-start-2 cols-3:-col-end-2 cols-4:col-start-1 cols-4:-col-end-3">
            <span className="text-text-secondary leading-6">{config.hero.taxonomy}</span>
            <h1 className="mt-0.5 mb-4 text-5xl text-text-primary font-heavy tracking-[-0.4px]">{config.hero.title}</h1>
            <p className="text-xl text-text-primary leading-6">{config.hero.description}</p>
          </div>
        </FiveColumns>
        <FiveColumns className="pt-8 cols-4:pt-12 cols-5:pt-24">
          <div className={config.background.classes}>
            <Image {...config.background.image} alt={config.background.image.alt} />
          </div>
          <main className="col-start-1 -col-end-1 cols-3:col-start-2 cols-3:-col-end-2 cols-4:col-start-1 cols-4:-col-end-3 flex flex-col gap-8 cols-4:gap-10 cols-5:gap-12">
            <div>
              <PageLink href="/search" query={config.search.button.query}>
                <Button className="w-full mb-6 p-4! bg-[#005296]!">
                  <LucideSearch size={16} />
                  <span className="ml-1 text-white font-medium leading-5">{config.search.button.label}</span>
                </Button>
              </PageLink>
              <h3 className="mb-1.5 text-sm text-text-primary font-medium leading-6">Suggestions</h3>
              <ul>
                {config.search.suggestions.map(({ label, query }, suggestionIndex) => (
                  <li key={suggestionIndex}>
                    <PageLink href="/search" query={query} className="inline-flex flex-row items-center justify-start p-1.5 pl-0">
                      <LucideSearch size={16} />
                      <span className="ml-1">{label}</span>
                    </PageLink>
                  </li>
                ))}
              </ul>
            </div>
            {config.textContent.map(({ title, content }, contentIndex) => (
              <div key={contentIndex} className="text-text-primary leading-6">
                <h2 className="text-lg font-heavy mb-3">{title}</h2>
                {content}
              </div>
            ))}
          </main>
          <aside className="col-start-1 -col-end-1 cols-2:col-end-3 cols-3:col-start-2 cols-3:col-end-5 cols-4:-col-start-3 cols-4:-col-end-1">
            <div className="cols-5:min-w-50 px-5 py-4 mt-8 cols-4:mt-0 bg-white border border-border-light rounded-xl">
              <Image {...config.organisation.logoImage} alt={config.organisation.logoImage.alt} className="w-full max-w-85 mb-1" />
              <ul>
                {config.organisation.links.map(({ externalHref, label }, linkIndex) => {
                  const [pathname, hash] = externalHref.split("#");

                  return (
                    <li key={linkIndex}>
                      <PageLink
                        external
                        href={pathname}
                        hash={hash}
                        className={joinTailwindClasses("block py-3 leading-5", linkIndex && "border-t border-t-border-light")}
                      >
                        {label}
                      </PageLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </FiveColumns>
      </div>
      <Footer />
    </Layout>
  );
};
