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
    url: "https://www.lse.ac.uk/granthaminstitute/publication/climate-change-law-in-europe-what-do-new-eu-climate-laws-mean-for-the-courts/",
    external: true,
    type: "Policy brief",
    title: "Climate change law in Europe: what do new EU climate laws mean for the courts?",
    imageUrl: "/images/cclw/images/eu2-min.jpg",
    imageAlt: "European Commission",
  },
  {
    url: "https://www.lse.ac.uk/granthaminstitute/news/evolving-regulation-of-companies-in-climate-change-framework-laws/",
    external: true,
    type: "Commentary",
    title: "Evolving regulation of companies in climate change framework laws",
    imageUrl: "/images/cclw/images/tower-min.jpg",
    imageAlt: "Eiffel Tower",
  },
  {
    url: "/document/national-policy-framework-for-msmes_6870",
    type: "Policy",
    title: "National Policy Framework for MSMEs",
    countryCode: "brb",
    meta: "Barbados | Framework | 2020",
  },
  {
    url: "/document/national-climate-change-act-2021_aeec",
    type: "Legislation",
    title: "National Climate Change Act 2021",
    countryCode: "uga",
    meta: "Uganda | Act | 2021",
  },
  {
    url: "/document/greenhouse-gas-reduction-and-management-act_1357",
    type: "Legislation",
    title: "Greenhouse Gas Reduction and Management Act",
    countryCode: "twn",
    meta: "Taiwan | Law, Act | 2021",
  },
];

export const Articles = () => {
  const renderArticleContent = (article) => {
    return (
      <>
        <div className="absolute top-0 left-0 p-2 px-4 bg-secondary-500 rounded text-sm font-bold text-white z-10">{article.type}</div>
        <div className="text-center flex flex-col justify-center items-center min-h-[180px]">
          {article.imageUrl && (
            <div className="w-full h-[120px] overflow-hidden relative">
              <img src={article.imageUrl} alt={article.imageAlt} />
            </div>
          )}
          <div className={`p-4 text-primary-400 flex-1 flex items-center text-lg font-bold ${article.imageUrl ? "" : "pt-8"}`}>{article.title}</div>
          {article.meta && (
            <div className="flex items-center gap-2 mb-2 text-grey-700">
              {article.countryCode && (
                <span className={`rounded-sm border border-black flag-icon-background flag-icon-${article.countryCode} inline-block`} />
              )}
              <div className="">{article.meta}</div>
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
          <div className="p-4 text-primary-400 md:basis-1/2 lg:basis-1/3" key={article.title}>
            {article.external ? (
              <ExternalLink url={article.url} className="block relative border border-grey-400 rounded h-full">
                {renderArticleContent(article)}
              </ExternalLink>
            ) : (
              <LinkWithQuery href={article.url} className="block relative border border-grey-400 rounded h-full">
                {renderArticleContent(article)}
              </LinkWithQuery>
            )}
          </div>
        );
      })}
    </div>
  );
};
