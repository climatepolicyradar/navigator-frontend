import React, { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Layout from "@components/layouts/Main";
import DocumentInfo from "@components/blocks/DocumentInfo";
import { Timeline } from "@components/blocks/Timeline";
import Event from "@components/blocks/Event";
import SquareButton from "@components/buttons/SquareButton";
import { RelatedDocument } from "@components/blocks/RelatedDocument";
import TabbedNav from "@components/nav/TabbedNav";
import { ExternalLinkIcon, GlobeIcon, DocumentIcon, PDFIcon } from "@components/svg/Icons";
import { CountryLink } from "@components/CountryLink";
import { convertDate, formatDate } from "@utils/timedate";
import { initialSummaryLength } from "@constants/document";
import { truncateString } from "@helpers/index";

import { TEvent } from "@types";
import { ExternalLink } from "@components/ExternalLink";
import { ApiClient } from "@api/http-common";
import { getDocumentTitle } from "@helpers/getDocumentTitle";

// TODO: move into separate file
type TFamilyDocument = {
  id: number;
  type: { name: string; description: string };
  title: string;
  date: string;
  variant: { id: number; label: string; description: string };
  format: string;
  matches: number;
};

type TFamilyDocumentProps = {
  document: TFamilyDocument;
};

const FamilyDocument = ({ document }: TFamilyDocumentProps) => {
  const [year, _, month] = formatDate(document.date);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(e);
  };

  return (
    <div className="mt-4 cursor-pointer p-3 border border-transparent hover:border-primary-600 hover:bg-offwhite transition duration-300" onClick={handleClick}>
      <div className="underline text-primary-600 mb-2">{document.title}</div>
      <div className="flex items-center">
        <div className="flex-1 flex flex-wrap gap-8">
          <span className="font-bold">{document.type.description}</span>
          <span>{document.format.toUpperCase()}</span>
          <span>{document.variant.label}</span>
          <span>{`${month} ${year}`}</span>
        </div>
        <div className="flex-0">
          <SquareButton>{document.matches} matches in document</SquareButton>
        </div>
      </div>
    </div>
  );
};

type TShowHideControlProps = {
  show: boolean;
  label?: string;
  onClick: () => void;
  className?: string;
};

const ShowHideControl = ({ show, label, onClick, className }: TShowHideControlProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    onClick();
  };

  return (
    <a href="#" onClick={handleClick} className={`text-primary-600 hover:text-primary-700 hover:underline transition duration-300 ${className}`}>
      {label ?? show ? "Hide" : "Show"}
    </a>
  );
};

const FamilyPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ page }) => {
  const [showTimeline, setShowTimeline] = useState(false);
  const [showCollectionDetail, setShowCollectionDetail] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [summary, setSummary] = useState("");

  const [year] = convertDate(page?.publication_ts);

  useEffect(() => {
    console.log(page);
    if (page?.description) {
      const text = page?.description;
      if (showFullSummary) {
        setSummary(text);
      } else {
        setSummary(truncateString(text, initialSummaryLength));
      }
    }
  }, [page, showFullSummary]);

  const renderSourceLink = () => {
    let link: string;
    if (page.url?.length) {
      link = page.url;
    } else if (page.source_url?.length) {
      link = page.source_url;
    }

    if (!link) return null;

    return (
      <section className="mt-12">
        <h3>Source</h3>
        <div className="mt-4 flex align-bottom gap-2">
          {page?.content_type.includes("pdf") && <PDFIcon height="24" width="24" />}
          {page?.content_type.includes("x-ole-storage") && <DocumentIcon height="24" width="24" />}
          {page?.content_type.includes("html") && <GlobeIcon height="24" width="24" />}
          <ExternalLink url={link} className="text-blue-500 underline font-medium hover:text-indigo-600 transition duration-300 flex">
            <span className="mr-1">{page?.content_type.includes("html") ? "Visit source website" : "See full text (opens in new tab)"}</span>
            <ExternalLinkIcon height="16" width="16" />
          </ExternalLink>
        </div>
      </section>
    );
  };

  // TODO: align with BE on an approach to sources and their logos
  const sourceLogo = page?.source?.name === "CCLW" ? "grantham-logo.png" : null;
  const sourceName = page?.source?.name === "CCLW" ? "Grantham Research Institute" : page?.source?.name;

  return (
    <Layout title={page.title}>
      <section className="mb-8">
        <div className="bg-offwhite border-solid border-lineBorder border-b">
          <div className="container">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 mt-6">
                <h1 className="text-3xl lg:smaller">{page.title}</h1>
                {page?.collection && (
                  <div className="flex text-base text-indigo-400 mt-3 items-center w-full mb-2 font-medium">
                    Part of &nbsp;
                    <a href="#collection" className="underline text-primary-400 hover:text-indigo-600 duration-300">
                      {page?.collection}
                    </a>
                  </div>
                )}
                <div className="flex text-base text-indigo-400 mt-3 items-center w-full mb-6 font-medium">
                  <CountryLink countryCode={page.geography.value}>
                    <span className={`rounded-sm border border-black flag-icon-background flag-icon-${page.geography.value.toLowerCase()}`} />
                    <span className="ml-2">{page.geography.display_value}</span>
                  </CountryLink>
                  <span>&nbsp;&#124;&nbsp;{year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="md:flex">
            <section className="flex-1 md:w-0">
              <section className="mt-6">
                <h3>Summary</h3>
                <div className="text-content mt-4" dangerouslySetInnerHTML={{ __html: summary }} />
                <FamilyDocument document={page.documents.find((doc: TFamilyDocument) => doc.type.name === "main")} />
              </section>
              {page.description.length > initialSummaryLength && (
                <section className="mt-6 flex justify-end">
                  {showFullSummary ? (
                    <button onClick={() => setShowFullSummary(false)} className="text-blue-500 font-medium">
                      Collapse
                    </button>
                  ) : (
                    <button onClick={() => setShowFullSummary(true)} className="text-blue-500 font-medium">
                      Show full summary
                    </button>
                  )}
                </section>
              )}

              <section className="mt-12">
                <h3>Related documents</h3>
                <div className="divide-solid divide-y">
                  {page.documents.map((doc: TFamilyDocument) => {
                    if (doc.type.name !== "main") {
                      return (
                        <div key={doc.id} className="mt-4">
                          <FamilyDocument document={doc} />
                        </div>
                      );
                    }
                  })}
                </div>
              </section>

              {/* {renderSourceLink()} */}

              {page.events.length > 0 && (
                <section className="mt-12">
                  <h3>Timeline</h3>
                  <ShowHideControl show={showTimeline} onClick={() => setShowTimeline(!showTimeline)} className="mt-4" />
                  {showTimeline && (
                    <Timeline>
                      {page.events.map((event: TEvent, index: number) => (
                        <React.Fragment key={`event-${index}`}>
                          <Event event={event} index={index} last={index === page.events.length - 1 ? true : false} />
                        </React.Fragment>
                      ))}
                    </Timeline>
                  )}
                </section>
              )}

              {page.related_documents.length ? (
                <section className="mt-12">
                  <h3>Associated documents</h3>
                  {page.related_documents.map((doc, i) => (
                    <div key={i + "-" + doc.slug} className="my-4">
                      <RelatedDocument document={doc} />
                    </div>
                  ))}
                </section>
              ) : null}
            </section>
            <section className="mt-6 md:w-2/5 lg:w-1/4 md:pl-12 flex-shrink-0">
              <div className="md:pl-4 md:border-l md:border-lineBorder">
                <h3>About this document</h3>
                <div className="grid grid-cols-2 gap-x-2">
                  <DocumentInfo id="category-tt" heading="Category" text={page.category.name} />
                  <DocumentInfo id="type-tt" heading="Type" text={page.type.name} />
                  {/* Topics maps to responses */}
                  {page.topics.length > 0 && <DocumentInfo id="topics-tt" heading="Topics" list={page.topics} />}
                  {page.languages.length > 0 && <DocumentInfo heading="Language" text={page.languages[0].name} />}
                </div>

                {page.keywords.length > 0 && <DocumentInfo id="keywords-tt" heading="Keywords" list={page.keywords} />}
                {page.sectors.length > 0 && <DocumentInfo id="sectors-tt" heading="Sectors" list={page.sectors} />}
                <div className="mt-8 border-t border-blue-100">
                  <h3 className="mt-4">Note</h3>
                  <div className="flex items-end my-4">
                    {sourceLogo && (
                      <div className="relative flex-shrink w-3/4 xmax-w-[40px] mr-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/images/partners/${sourceLogo}`} alt={page.source.name} />
                      </div>
                    )}
                    {page.source.name !== "CCLW" && <p className="text-sm">{sourceName}</p>}
                  </div>
                  <p>
                    The summary of this document was written by researchers at the{" "}
                    <ExternalLink
                      url="http://lse.ac.uk/grantham"
                      className="text-blue-500 hover:text-indigo-600 hover:underline transition duration-300"
                    >
                      Grantham Research Institute
                    </ExternalLink>
                    . If you want to use this summary, please check{" "}
                    <ExternalLink
                      url="https://www.lse.ac.uk/granthaminstitute/cclw-terms-and-conditions"
                      className="text-blue-500 hover:text-indigo-600 hover:underline transition duration-300"
                    >
                      terms of use
                    </ExternalLink>{" "}
                    for citation and licensing of third party data.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </Layout>
  );
};
export default FamilyPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  // const id = context.params.id;
  const id = "netherlands_2016_national-climate-adaptation-strategy_8708_1447";
  const client = new ApiClient(process.env.API_URL);

  const { data: page } = await client.get(`/documents/${id}`, null);
  const title = getDocumentTitle(page.name, page.postfix);

  return {
    props: {
      page: {
        ...page,
        title,
        collection: "Common Argicultural Policy",
        description: "A regulation was approved in December 2020 to lay down transitional provisions that will apply until the end of 2022.",
        documents: [
          {
            id: 1,
            type: { name: "main", description: "Main document" },
            title: "Decree n ° 2020-955 of July 31, 2020 relating to aid for the acquisition or rental of little polluting vehicles",
            date: "2020-01-31",
            variant: { id: 1, label: "(EN) official translation", description: "" },
            format: "PDF",
            matches: 7,
          },
          {
            id: 2,
            type: { name: "summary", description: "Summary" },
            title: "Document Title",
            date: "2020-01-31",
            variant: { id: 1, label: "(EN) unofficial translation", description: "" },
            format: "PDF",
            matches: 7,
          },
          {
            id: 3,
            type: { name: "Amendment", description: "Amendment" },
            title: "Document Title",
            date: "2020-01-31",
            variant: { id: 1, label: "(FR) official translation", description: "" },
            format: "PDF",
            matches: 7,
          },
        ],
      },
    },
  };
};
