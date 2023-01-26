import React, { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Layout from "@components/layouts/Main";
import DocumentInfo from "@components/blocks/DocumentInfo";
import { Timeline } from "@components/blocks/Timeline";
import Event from "@components/blocks/Event";
import { ExternalLinkIcon, GlobeIcon, DocumentIcon, PDFIcon } from "@components/svg/Icons";
import { CountryLink } from "@components/CountryLink";
import { Targets } from "@components/Targets";
import { FamilyDocument } from "@components/document/FamilyDocument";
import { ShowHide } from "@components/controls/ShowHide";
import { convertDate } from "@utils/timedate";
import { initialSummaryLength } from "@constants/document";
import { truncateString } from "@helpers/index";

import { TEvent, TFamilyDocument } from "@types";
import { ExternalLink } from "@components/ExternalLink";
import { ApiClient } from "@api/http-common";
import { getDocumentTitle } from "@helpers/getDocumentTitle";
import { Divider } from "@components/dividers/Divider";

const FamilyPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ page }) => {
  const [showTimeline, setShowTimeline] = useState(false);
  const [showCollectionDetail, setShowCollectionDetail] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [summary, setSummary] = useState("");

  const [year] = convertDate(page?.publication_ts);

  const handleCollectionClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowCollectionDetail(true);
    setTimeout(() => {
      document.getElementById("collection").scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

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
              <div className="flex-1 my-4">
                <h1 className="text-3xl lg:smaller">{page.title}</h1>
                {page?.collection && (
                  <div className="flex text-base text-indigo-400 mt-4 items-center w-full mb-2 font-medium">
                    <span>Part of &nbsp;</span>
                    <a onClick={handleCollectionClick} href="#collection" className="underline text-primary-400 hover:text-indigo-600 duration-300">
                      {page?.collection}
                    </a>
                  </div>
                )}
                <div className="flex text-base text-indigo-400 mt-2 items-center w-full font-medium">
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
                {page.description.length > initialSummaryLength && (
                  <div className="mt-6 flex justify-end">
                    {showFullSummary ? (
                      <button onClick={() => setShowFullSummary(false)} className="text-blue-500 font-medium">
                        Collapse summary
                      </button>
                    ) : (
                      <button onClick={() => setShowFullSummary(true)} className="text-blue-500 font-medium">
                        Show full summary
                      </button>
                    )}
                  </div>
                )}
                <FamilyDocument document={page.documents.find((doc: TFamilyDocument) => doc.type.name === "main")} />
              </section>

              <div className="mt-12">
                <Divider color="bg-lineBorder" />
              </div>

              <section className="mt-12">
                <h3>Related documents</h3>
                <div className="divide-solid divide-blue-100 divide-y">
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

              <div className="mt-12">
                <Divider color="bg-lineBorder" />
              </div>

              <section className="mt-12">
                <div>
                  <h3 className="flex flex-col mb-4 md:flex-row md:items-center justify-between">
                    <span className="flex-1">Targets (3)</span>
                    <span className="text-sm text-grey-700 flex-0">
                      Download targets data (.csv){" "}
                      <a href="#" onClick={(e) => e.preventDefault()} className="underline text-primary-600">
                        this list
                      </a>{" "}
                      |{" "}
                      <a href="#" onClick={(e) => e.preventDefault()} className="underline text-primary-600">
                        whole database
                      </a>
                    </span>
                  </h3>
                  <Targets targets={page.targets} />
                </div>
              </section>

              {page.events.length > 0 && (
                <>
                  <div className="mt-12">
                    <Divider color="bg-lineBorder" />
                  </div>

                  <section className="mt-12">
                    <h3>Timeline</h3>
                    <ShowHide show={showTimeline} onClick={() => setShowTimeline(!showTimeline)} className="mt-4" />
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
                </>
              )}

              <div className="mt-12">
                <Divider color="bg-lineBorder" />
              </div>

              <section className="mt-12" id="collection">
                <h3>About the Common Agricultural Policy</h3>
                <ShowHide show={showCollectionDetail} onClick={() => setShowCollectionDetail(!showCollectionDetail)} className="mt-4" />
                {showCollectionDetail && (
                  <div className="text-content">
                    <div className="mb-8">
                      <p>
                        The common agricultural policy (CAP) was created in 1962 by the six founding countries of the European Communities and is the
                        longest-serving EU policy. Its aim is to:
                      </p>
                      <ul>
                        <li>provide affordable, safe and high-quality food for EU citizens</li>
                        <li>ensure a fair standard of living for farmers</li>
                        <li>preserve natural resources and respect the environment</li>
                        <li>providing food security for all European citizens</li>
                        <li>addressing global market fluctuations and price volatility</li>
                        <li>maintaining thriving rural areas across the EU</li>
                        <li>using natural resources in a more sustainable manner</li>
                      </ul>
                      <p>
                        The CAP is a common policy for all EU countries. It is managed and funded at European level from the resources of the EU’s
                        budget.
                      </p>
                    </div>
                    <div className="mb-8">
                      <h6 className="text-primary-600">
                        The CAP towards 2020: Meeting the food, natural resources and territorial challenges of the future
                      </h6>
                      <p>
                        This EU Comission Communication provides an overview of the rationale for reforming the Common Agricultural Policy to align
                        with the EU’s climate change objectives.
                      </p>
                    </div>
                    <div className="mb-8">
                      <h6 className="text-primary-600">Overview of CAP Reform 2014 - 2020</h6>
                      <p>
                        The CAP 2014-2020 has been reformed by strengthing its greening aspects. Climate mitigation and adaption are explically among
                        the key objectives of the CAP, which accounts for about 30% of the overall EU budget / MFF 2014-2020.
                      </p>
                    </div>
                  </div>
                )}
              </section>
            </section>
            <section className="mt-12 md:border-t-0 md:mt-6 md:w-2/5 lg:w-1/4 md:pl-12 flex-shrink-0">
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
        title: "Regulation 2020/2220 of the European Parliament and of the Council",
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
            matches: 3,
          },
          {
            id: 3,
            type: { name: "Amendment", description: "Amendment" },
            title: "Document Title",
            date: "2020-01-31",
            variant: { id: 1, label: "(FR) official translation", description: "" },
            format: "PDF",
            matches: 2,
          },
        ],
        targets: [
          {
            target: "Deploy 10 MW of Wind Power in by 2011, then 50 MW in 5-10 years by 2016",
            group: "Energy: Renewable Energy",
            base_year: 2013,
            target_year: 2016,
          },
          {
            target: "Rehabilitate 94 MW of hydropower capacity by 2008 against a 2006 baseline",
            group: "Energy: Renewable Energy",
            base_year: 2006,
            target_year: 2008,
          },
          {
            target:
              "Effective protection rate of natural wetlands will reach more than 60%, and the area of desertified land will be over 50% of the controllable area. More than 95% of the state's key protected wild animals and over 90% of the minimum wild plant species will be effectively protected against desertification by 2020.",
            group: "LULUCF: Preservation",
            base_year: 2013,
            target_year: 2020,
          },
        ],
      },
    },
  };
};
