import { Fragment } from "react";

import { Card } from "@components/card/Card";
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

const renderArticleContent = (article: TArticle) => {
  return (
    <>
      {article.meta && (
        <div className="px-4 py-2 pt-0">
          <div className="flex flex-wrap items-center gap-2">
            {article.countryCode && (
              <span className={`rounded-sm border border-black flag-icon-background flag-icon-${article.countryCode} inline-block`} />
            )}
            <div className="">{article.meta}</div>
          </div>
        </div>
      )}
    </>
  );
};

export const Articles = () => {
  const cssClasses = "md:basis-1/3 lg:basis-1/4 hover:no-underline";

  return (
    <div className="md:flex flex-wrap justify-center items-stretch">
      {ARTICLES.map((article) => {
        return (
          <Fragment key={article.title}>
            {article.external ? (
              <ExternalLink url={article.url} className={cssClasses}>
                <Card key={article.title} heading={article.title} img={article.imageUrl} imgAlt={article.imageAlt} type={article.type}>
                  {renderArticleContent(article)}
                </Card>
              </ExternalLink>
            ) : (
              <LinkWithQuery href={article.url} className={cssClasses}>
                <Card key={article.title} heading={article.title} img={article.imageUrl} imgAlt={article.imageAlt} type={article.type}>
                  {renderArticleContent(article)}
                </Card>
              </LinkWithQuery>
            )}
          </Fragment>
        );
      })}
    </div>
  );
};
