import React, { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Script from "next/script";
import { ApiClient } from "@api/http-common";
import Layout from "@components/layouts/Main";
import DocumentInfo from "@components/blocks/DocumentInfo";
import { Timeline } from "@components/blocks/Timeline";
import Event from "@components/blocks/Event";
import { FamilyHead } from "@components/document/FamilyHead";
import { FamilyDocument } from "@components/document/FamilyDocument";
import { ExternalLink } from "@components/ExternalLink";
import { Targets } from "@components/Targets";
import { ShowHide } from "@components/controls/ShowHide";
import { Divider } from "@components/dividers/Divider";
import { initialSummaryLength } from "@constants/document";
import { truncateString } from "@helpers/index";
import { TFamilyPage, TMatchedFamily, TTarget } from "@types";
import useSearch from "@hooks/useSearch";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { QUERY_PARAMS } from "@constants/queryParams";
import axios from "axios";
import { TargetIcon } from "@components/svg/Icons";
import Button from "@components/buttons/Button";
import { LinkWithQuery } from "@components/LinkWithQuery";
import useConfig from "@hooks/useConfig";
import { getCountryName } from "@helpers/getCountryFields";

type TProps = {
  page: TFamilyPage;
  targets: TTarget[];
};

const FamilyPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ page, targets = [] }: TProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const startingNumberOfTargetsToDisplay = 5;
  const [numberOfTargetsToDisplay, setNumberOfTargetsToDisplay] = useState(startingNumberOfTargetsToDisplay);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showCollectionDetail, setShowCollectionDetail] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [summary, setSummary] = useState("");

  const publishedTargets = targets.filter((target) => target["Visibility status"] === "published");
  const hasTargets = !!publishedTargets && publishedTargets?.length > 0;

  const configQuery = useConfig();
  const { data: { countries = [] } = {} } = configQuery;
  const geographyName = getCountryName(page.geography, countries);

  let searchFamily: TMatchedFamily = null;
  const { status, families } = useSearch(router.query, !!router.query[QUERY_PARAMS.query_string]);
  if (!!router.query[QUERY_PARAMS.query_string]) {
    families.forEach((family) => {
      if (page.slug === family.family_slug) {
        searchFamily = family;
      }
    });
  }

  const handleCollectionClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowCollectionDetail(true);
    setTimeout(() => {
      const collectionElement = document.getElementById("collection");
      if (collectionElement) collectionElement.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const getDocumentMatches = (docSlug: string) => {
    if (searchFamily) {
      const searchDocument = searchFamily.family_documents.find((doc) => docSlug === doc.document_slug);
      if (searchDocument) {
        return searchDocument.document_passage_matches.length;
      }
    }
  };

  // TODO: align with BE on an approach to sources and their logos
  const sourceLogo = page?.organisation === "CCLW" ? "grantham-logo.png" : null;
  const sourceName = page?.organisation === "CCLW" ? "Grantham Research Institute" : page?.organisation;

  const mainDocs = page.documents.filter((doc) => doc.document_role && doc.document_role.toLowerCase().includes("main"));
  const otherDocs = page.documents.filter((doc) => !doc.document_role || !doc.document_role.toLowerCase().includes("main"));

  const getDocumentCategories = () => {
    const categories = page.documents.map((doc) => doc.document_type);
    return [...new Set(categories)];
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

  useEffect(() => {
    setShowCollectionDetail(false);
  }, [pathname]);

  return (
    <Layout title={`${page.title} - ${geographyName}`} description={page.summary.substring(0, 164)}>
      <Script id="analytics">
        analytics.category = "{page.category}"; analytics.type = "{getDocumentCategories().join(",")}"; analytics.geography = "{page.geography}";
      </Script>
      <section
        className="mb-8"
        data-analytics-category={page.category}
        data-analytics-type={getDocumentCategories().join(",")}
        data-analytics-geography={page.geography}
      >
        <FamilyHead family={page} geographyName={geographyName} onCollectionClick={handleCollectionClick} />
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
                <div data-cy="main-documents">
                  {mainDocs.map((doc) => (
                    <FamilyDocument matches={getDocumentMatches(doc.slug)} document={doc} key={doc.import_id} status={status} />
                  ))}
                </div>
              </section>

              {otherDocs.length > 0 && (
                <>
                  <div className="mt-12">
                    <Divider color="bg-lineBorder" />
                  </div>

                  <section className="mt-12">
                    <h3>Related documents</h3>
                    <div className="divide-solid divide-blue-100 divide-y" data-cy="related-documents">
                      {otherDocs.map((doc) => (
                        <div key={doc.import_id} className="mt-4">
                          <FamilyDocument matches={getDocumentMatches(doc.slug)} document={doc} status={status} />
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {hasTargets && (
                <>
                  <div className="mt-12">
                    <Divider color="bg-lineBorder" />
                  </div>

                  <section className="mt-12">
                    <div>
                      <div className="lg:flex justify-between items-end">
                        <h3 className="flex mb-4">
                          <span className="mr-2">
                            <TargetIcon />
                          </span>
                          Targets ({publishedTargets.length})
                        </h3>
                        <ExternalLink
                          url="https://docs.google.com/forms/d/e/1FAIpQLSfP2ECC6W92xF5HHvy5KAPVTim0Agrbr4dD2LhiWkDjcY2f6g/viewform"
                          className="block text-sm text-blue-600 my-4 md:mt-0 hover:underline"
                          cy="download-target-csv"
                        >
                          Request to download all target data (.csv)
                        </ExternalLink>
                      </div>
                      <Targets targets={publishedTargets.slice(0, numberOfTargetsToDisplay)} />
                    </div>
                  </section>
                  {publishedTargets.length > numberOfTargetsToDisplay && (
                    <div className="mt-12">
                      <Divider>
                        <Button color="secondary" wider onClick={() => setNumberOfTargetsToDisplay(numberOfTargetsToDisplay + 3)}>
                          See more
                        </Button>
                      </Divider>
                    </div>
                  )}

                  {publishedTargets.length > startingNumberOfTargetsToDisplay && publishedTargets.length <= numberOfTargetsToDisplay && (
                    <div className="mt-12">
                      <Divider>
                        <Button color="secondary" wider onClick={() => setNumberOfTargetsToDisplay(5)}>
                          Hide &#8679;
                        </Button>
                      </Divider>
                    </div>
                  )}
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

              {page.collections.length > 0 && (
                <div className="mt-12">
                  <Divider color="bg-lineBorder" />
                </div>
              )}

              {page.collections.map((collection, i) => (
                <section className="pt-12" id={`collection`} key={collection.import_id}>
                  <h3>About the {collection.title}</h3>
                  <ShowHide show={showCollectionDetail} onClick={() => setShowCollectionDetail(!showCollectionDetail)} className="mt-4" />
                  {showCollectionDetail && (
                    <div>
                      <div className="mb-8 text-content" dangerouslySetInnerHTML={{ __html: collection.description }} />
                      <h4>Other documents in the {collection.title}</h4>
                      <div className="divide-solid divide-blue-100 divide-y">
                        {collection.families.map((collFamily, i) => (
                          <div key={collFamily.slug} className="pt-4 pb-4">
                            <LinkWithQuery
                              href={`/document/${collFamily.slug}`}
                              className="hover:underline text-primary-400 hover:text-indigo-600 duration-300"
                            >
                              {collFamily.title}
                            </LinkWithQuery>
                            <p className="mt-2">{collFamily.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              ))}
            </section>
            <section className="mt-12 md:border-t-0 md:mt-6 md:w-2/5 lg:w-1/4 md:pl-12 flex-shrink-0">
              <div className="md:pl-4 md:border-l md:border-lineBorder">
                <h3>About this document</h3>
                <div className="grid grid-cols-2 gap-x-2">
                  <DocumentInfo id="category-tt" heading="Category" text={page.category} />
                  <DocumentInfo id="type-tt" heading="Type" text={getDocumentCategories().join(", ")} />
                </div>

                {page.metadata.topic.length > 0 && <DocumentInfo id="topics-tt" heading="Topics" list={page.metadata.topic} />}
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

  let familyData: TFamilyPage;
  let targetsData: TTarget[] = [];

  try {
    const { data: returnedData } = await client.get(`/documents/${id}`, { group_documents: true });
    familyData = returnedData;
  } catch (error) {
    // TODO: handle error more elegantly
  }

  if (familyData) {
    try {
      const targetsRaw = await axios.get<TTarget[]>(`${process.env.S3_PATH}/families/${familyData.import_id}.json`);
      targetsData = targetsRaw.data;
    } catch (error) {}
  }

  if (!familyData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      page: familyData,
      targets: targetsData,
    },
  };
};
