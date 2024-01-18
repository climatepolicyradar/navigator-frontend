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
    url: "https://www.lse.ac.uk/granthaminstitute/publication/submission-to-the-special-rapporteur-on-the-promotion-and-protection-of-human-rights-in-the-context-of-climate-change/",
    external: true,
    type: "Policy publication",
    title: "Submission to the Special Rapporteur on the promotion and protection of human rights in the context of climate change",
    imageUrl: "/images/cclw/images/portuguese-supreme-court.jpg",
    imageAlt: "Portuguese Supreme Court",
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
    meta: "Barbados · Framework · 2020",
  },
  {
    url: "/document/national-climate-change-act-2021_aeec",
    type: "Legislation",
    title: "National Climate Change Act 2021",
    countryCode: "uga",
    meta: "Uganda · Act · 2021",
  },
  {
    url: "/document/plan-to-control-illegal-deforestation-and-recovery-of-native-vegetation-ppcdam-and-ppcerrado_212e",
    type: "Policy",
    title: "Plan to Control Illegal Deforestation and Recovery of Native Vegetation (PPCDAm and PPCerrado)",
    countryCode: "bra",
    meta: "Brazil · Plan · 2004",
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
