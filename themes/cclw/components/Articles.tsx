/* eslint-disable @next/next/no-img-element */
import { ExternalLink } from "@components/ExternalLink";
import { LinkWithQuery } from "@components/LinkWithQuery";

type TArticle = {
  url: string;
  type: string;
  title: string;
  imageUrl?: string;
  imageAlt?: string;
  countryCode?: string;
  meta?: string;
  external?: boolean;
};

const ARTICLES: TArticle[] = [
  {
    url: "https://www.lse.ac.uk/granthaminstitute/publication/governance-pathways-to-credible-implementation-of-net-zero-targets/",
    external: true,
    type: "Policy publication",
    title: "Governance pathways to credible implementation of net zero targets",
    imageUrl: "/images/cclw/images/storm_damage_fiji.jpg",
    imageAlt: "Storm damage in Fiji",
  },
  {
    url: "https://www.lse.ac.uk/granthaminstitute/publication/comparative-analysis-of-legal-mechanisms-to-net-zero-lessons-from-germany-the-united-states-brazil-and-china/",
    external: true,
    type: "Research publication",
    title: "Comparative analysis of legal mechanisms to net-zero: lessons from Germany, the United States, Brazil, and China",
  },
  {
    url: "https://www.lse.ac.uk/granthaminstitute/news/innovations-in-climate-change-legislation-kenya-uganda-and-nigeria-in-focus/",
    external: true,
    type: "External site",
    title: "Innovations in climate change legislation: Kenya, Uganda and Nigeria in focus",
    meta: "Kenya · Uganda · Nigeria",
  },
  {
    url: "https://www.lse.ac.uk/granthaminstitute/news/philippines-climate-accountability-bill-loss-and-damage-in-domestic-legislation/",
    external: true,
    type: "Commentary",
    title: "Philippines Climate Accountability Bill: loss and damage in domestic legislation",
    countryCode: "phl",
    meta: "Philippines · 2023",
    imageUrl: "/images/cclw/images/typhoon_yolanda_philippines.jpg",
    imageAlt: "Aftermath of Typhoon Yolanda in the Philippines, 2013",
  },
  {
    url: "https://www.lse.ac.uk/granthaminstitute/news/what-the-un-climate-regime-can-learn-from-the-open-government-partnership/",
    external: true,
    type: "Commentary",
    title: "What the UN climate regime can learn from the Open Government Partnership",
    imageUrl: "/images/cclw/images/cop_28.jpg",
    imageAlt: "COP 28",
  },
  {
    url: "/framework-laws",
    type: "Framework laws",
    title: "Climate change framework laws",
    meta: "View the list here",
  },
];

export const Articles = () => {
  const renderArticleContent = (article: TArticle) => {
    return (
      <>
        <div className="absolute top-0 left-0 p-2 px-4 bg-cclw-dark rounded text-sm font-bold text-white z-10">{article.type}</div>
        <div className={`text-center flex flex-wrap min-h-[180px] h-full ${article.imageUrl ? "content-start" : "content-center"}`}>
          {article.imageUrl && (
            <div className="w-full h-[120px] overflow-hidden relative self-start">
              <img src={article.imageUrl} alt={article.imageAlt} />
            </div>
          )}
          <div className={`article-title p-4 basis-full text-center text-lg font-bold ${article.imageUrl ? "" : "pt-10"}`}>{article.title}</div>
          {article.meta && (
            <div className="mb-2 px-2 basis-full text-center">
              <div className="flex flex-wrap items-center content-center justify-center gap-2">
                {article.countryCode && (
                  <span className={`rounded-sm border border-black flag-icon-background flag-icon-${article.countryCode} inline-block`} />
                )}
                <div className="">{article.meta}</div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="md:flex flex-wrap justify-center">
      {ARTICLES.map((article) => {
        return (
          <div className="p-4 md:basis-1/2 lg:basis-1/3" key={article.title}>
            {article.external ? (
              <ExternalLink url={article.url} className="block relative border border-grey-400 rounded h-full shadow-md">
                {renderArticleContent(article)}
              </ExternalLink>
            ) : (
              <LinkWithQuery href={article.url} className="block relative border border-grey-400 rounded h-full shadow-md">
                {renderArticleContent(article)}
              </LinkWithQuery>
            )}
          </div>
        );
      })}
    </div>
  );
};
