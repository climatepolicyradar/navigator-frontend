import { Fragment } from "react";

import { Card } from "@/cclw/components/Card";
import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";

type TArticle = {
  url: string;
  type: string;
  title: string;
  imageUrl?: string;
  imageAlt?: string;
  countryCode?: string;
  meta?: string;
  external?: boolean;
  customMetaKey?: string;
};

// We must define a function to handle the custom meta data
const getCustomMeta = (key: string) => {
  switch (key) {
    case "customAfrica":
      return (
        <div className="flex flex-wrap items-center gap-2 text-sm text-textNormal">
          <div className="flex flex-wrap items-center gap-1">
            <span className="rounded-sm border border-black flag-icon-background flag-icon-ken inline-block" /> Kenya
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <span className="rounded-sm border border-black flag-icon-background flag-icon-uga inline-block" /> Uganda
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <span className="rounded-sm border border-black flag-icon-background flag-icon-nga inline-block" /> Nigeria
          </div>
        </div>
      );
    default:
      return null;
  }
};

const ARTICLES: TArticle[] = [
  {
    url: "https://www.lse.ac.uk/granthaminstitute/news/how-climate-laws-create-impact/",
    external: true,
    type: "Commentary",
    title: "How climate laws create impact",
    imageUrl: "/images/cclw/images/articles/article_courthouse.jpg",
    imageAlt: "Courthouse",
  },
  {
    url: "https://www.lse.ac.uk/granthaminstitute/publication/strengthening-mexicos-climate-law-policy-lessons-from-subnational-and-international-experience/",
    external: true,
    type: "Policy publication",
    title: "Strengthening Mexico’s Climate Law: policy lessons from subnational and international experience",
    countryCode: "mex",
    meta: "Mexico",
    imageUrl: "/images/cclw/images/articles/article_mexico.jpg",
    imageAlt: "NASA/Planet Volumes for Unsplash+",
  },
  {
    url: "https://www.lse.ac.uk/granthaminstitute/news/evolving-regulation-of-companies-in-climate-change-framework-laws/",
    external: true,
    type: "Commentary",
    title: "Evolving regulation of companies in climate change framework laws",
    imageUrl: "/images/cclw/images/articles/article_paris.jpg",
    imageAlt: "A green park in Paris where people are sitting. The Eiffel Tower can be seen.",
  },
  {
    url: "https://www.lse.ac.uk/granthaminstitute/news/innovations-in-climate-change-legislation-kenya-uganda-and-nigeria-in-focus/",
    external: true,
    type: "Article",
    title: "Innovations in climate change legislation: Kenya, Uganda and Nigeria in focus",
    customMetaKey: "customAfrica",
    imageUrl: "/images/cclw/images/articles/article_bunyonyi.jpg",
    imageAlt: "Lake Bunyonyi, Uganda",
  },
  {
    url: "https://www.lse.ac.uk/granthaminstitute/news/philippines-climate-accountability-bill-loss-and-damage-in-domestic-legislation/",
    external: true,
    type: "Commentary",
    title: "Philippines Climate Accountability Bill: loss and damage in domestic legislation",
    countryCode: "phl",
    meta: "Philippines",
    imageUrl: "/images/cclw/images/articles/article_philippines.jpg",
    imageAlt: "Aftermath of Typhoon Yolanda in the Philippines, 2013",
  },
  {
    url: "/framework-laws",
    type: "Framework laws",
    title: "Climate change framework laws",
    meta: "View the list here",
    imageUrl: "/images/cclw/images/articles/article_courthouse.jpg",
    imageAlt: "Courthouse",
  },
];

const renderArticleContent = (article: TArticle) => {
  const customMeta = getCustomMeta(article.customMetaKey);
  return (
    <>
      {customMeta && customMeta}
      {article.meta && (
        <div className="py-2 pt-0">
          <div className="flex flex-wrap items-center gap-1 text-sm text-textNormal">
            {article.countryCode && (
              <span className={`rounded-sm border border-black flag-icon-background flag-icon-${article.countryCode} inline-block`} />
            )}
            <div className="">{article.meta || customMeta}</div>
          </div>
        </div>
      )}
    </>
  );
};

export const Articles = () => {
  const cssClasses = "group sm:basis-1/2-gap-4 md:basis-1/3-gap-4 xl:basis-1/6-gap-4 hover:no-underline text-textNormal";

  return (
    <div className="sm:flex flex-wrap justify-center items-stretch gap-4">
      {ARTICLES.map((article) => {
        return (
          <Fragment key={article.title}>
            {article.external ? (
              <ExternalLink url={article.url} className={cssClasses}>
                <Card
                  key={article.title}
                  heading={article.title}
                  img={article.imageUrl}
                  imgAlt={article.imageAlt}
                  type={article.type}
                  extraClasses="mb-8 sm:mb-0"
                >
                  {renderArticleContent(article)}
                </Card>
              </ExternalLink>
            ) : (
              <LinkWithQuery href={article.url} className={cssClasses}>
                <Card
                  key={article.title}
                  heading={article.title}
                  img={article.imageUrl}
                  imgAlt={article.imageAlt}
                  type={article.type}
                  extraClasses="mb-8 sm:mb-0"
                >
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
