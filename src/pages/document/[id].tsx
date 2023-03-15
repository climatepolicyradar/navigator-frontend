import React, { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ApiClient } from "@api/http-common";
import useGetSearcheResults from "@hooks/useGetSearchResults";
import Layout from "@components/layouts/Main";
import DocumentInfo from "@components/blocks/DocumentInfo";
import { Timeline } from "@components/blocks/Timeline";
import Event from "@components/blocks/Event";
import { ExternalLinkIcon, GlobeIcon, DocumentIcon, PDFIcon } from "@components/svg/Icons";
import { DocumentHead } from "@components/document/DocumentHead";
import { FamilyHead } from "@components/document/FamilyHead";
import { FamilyDocument } from "@components/document/FamilyDocument";
import { ExternalLink } from "@components/ExternalLink";
import { Targets } from "@components/Targets";
import { ShowHide } from "@components/controls/ShowHide";
import { Divider } from "@components/dividers/Divider";
import { initialSummaryLength } from "@constants/document";
import { truncateString } from "@helpers/index";
import { getDocumentTitle } from "@helpers/getDocumentTitle";
import { TEvent, TDocument, TFamilyDocument, TFamily, TFamilyPage, TTarget } from "@types";

type TProps = {
  page: TFamilyPage;
  targets: TTarget[];
};

const FamilyPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ page, targets = [] }: TProps) => {
  const [showTimeline, setShowTimeline] = useState(false);
  const [showCollectionDetail, setShowCollectionDetail] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [summary, setSummary] = useState("");

  const handleCollectionClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowCollectionDetail(true);
    setTimeout(() => {
      document.getElementById("collection").scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    if (page?.summary) {
      const text = page?.summary;
      if (showFullSummary) {
        setSummary(text);
      } else {
        setSummary(truncateString(text, initialSummaryLength));
      }
    }
  }, [page, showFullSummary]);

  // TODO: align with BE on an approach to sources and their logos
  const sourceLogo = page?.organisation === "CCLW" ? "grantham-logo.png" : null;
  const sourceName = page?.organisation === "CCLW" ? "Grantham Research Institute" : page?.organisation;

  const mainDoc = page.documents.find((doc) => doc.variant === "MAIN");
  const otherDocs = page.documents.filter((doc) => doc.variant !== "MAIN");

  return (
    <Layout title={page.title}>
      <section className="mb-8">
        <FamilyHead family={page} onCollectionClick={handleCollectionClick} />
        <div className="container">
          <div className="md:flex">
            <section className="flex-1 md:w-0">
              <section className="mt-6">
                <div className="text-content mt-4" dangerouslySetInnerHTML={{ __html: summary }} />
                {page.summary.length > initialSummaryLength && (
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
                {mainDoc && (
                  <FamilyDocument
                    title={mainDoc.title}
                    date={page.published_date}
                    slug={mainDoc.slugs[0]}
                    variant={mainDoc.variant}
                    contentType={mainDoc.content_type}
                  />
                )}
              </section>

              {otherDocs.length > 0 && (
                <>
                  <div className="mt-12">
                    <Divider color="bg-lineBorder" />
                  </div>

                  <section className="mt-12">
                    <h3>Related documents</h3>
                    <div className="divide-solid divide-blue-100 divide-y">
                      {otherDocs.map((doc, i) => (
                        <div key={`${i}-${doc.title}`} className="mt-4">
                          <FamilyDocument
                            title={doc.title}
                            date={page.published_date}
                            slug={doc.slugs[0]}
                            variant={doc.variant}
                            contentType={doc.content_type}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {targets.length > 0 && (
                <>
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
                      <Targets targets={targets} />
                    </div>
                  </section>
                </>
              )}

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
                        {page.events.map((event, index: number) => (
                          <React.Fragment key={`event-${index}`}>
                            <Event event={event} index={index} last={index === page.events.length - 1 ? true : false} />
                          </React.Fragment>
                        ))}
                      </Timeline>
                    )}
                  </section>
                </>
              )}

              {/* TODO: return collection information
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
                    <h4>Other documents in the Common Agricultural Policy</h4>
                    <div className="divide-solid divide-blue-100 divide-y">
                      {page.collections.map((collection) => {
                        return <></>;
                        // TODO: return collection related families
                        // return collection.families.map((cFamily) => (
                        //   <div key={cFamily.id} className="mt-4">
                        //     <FamilyDocument title={cFamily.title} date={cFamily.date} slug={cFamily.slug} />
                        //   </div>
                        // ));
                      })}
                    </div>
                  </div>
                )}
              </section> */}
            </section>
            <section className="mt-12 md:border-t-0 md:mt-6 md:w-2/5 lg:w-1/4 md:pl-12 flex-shrink-0">
              <div className="md:pl-4 md:border-l md:border-lineBorder">
                <h3>About this document</h3>
                <div className="grid grid-cols-2 gap-x-2">
                  <DocumentInfo id="category-tt" heading="Category" text={page.category} />
                  <DocumentInfo id="type-tt" heading="Type" text={page.metadata.document_type} />
                  {page.metadata.topic.length > 0 && <DocumentInfo id="topics-tt" heading="Topics" list={page.metadata.topic} />}
                  {/* {page.metadata.languages.length > 0 && <DocumentInfo heading="Language" text={page.languages[0].name} />} */}
                </div>

                {page.metadata.keyword.length > 0 && <DocumentInfo id="keywords-tt" heading="Keywords" list={page.metadata.keyword} />}
                {page.metadata.sector.length > 0 && <DocumentInfo id="sectors-tt" heading="Sectors" list={page.metadata.sector} />}
                <div className="mt-8 border-t border-blue-100">
                  <h3 className="mt-4">Note</h3>
                  <div className="flex items-end my-4">
                    {sourceLogo && (
                      <div className="relative flex-shrink w-3/4 xmax-w-[40px] mr-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/images/partners/${sourceLogo}`} alt={page.organisation} />
                      </div>
                    )}
                    {page.organisation !== "CCLW" && <p className="text-sm">{sourceName}</p>}
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
  const id = context.params.id;
  const client = new ApiClient(process.env.API_URL);

  const { data: page } = await client.get(`/documents/${id}`, { group_documents: true });

  return {
    props: {
      page,
    },
  };
};
