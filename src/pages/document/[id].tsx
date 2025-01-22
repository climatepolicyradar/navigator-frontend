import React, { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Script from "next/script";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import axios from "axios";

import { ApiClient } from "@api/http-common";

import useSearch from "@hooks/useSearch";

import { SiteWidth } from "@components/panels/SiteWidth";
import { SingleCol } from "@components/panels/SingleCol";

import Layout from "@components/layouts/Main";
import { Timeline } from "@components/timeline/Timeline";
import { Event } from "@components/timeline/Event";
import { FamilyHead } from "@components/document/FamilyHead";
import { FamilyDocument } from "@components/document/FamilyDocument";
import { ExternalLink } from "@components/ExternalLink";
import { Targets } from "@components/Targets";
import { ShowHide } from "@components/controls/ShowHide";
import { Divider } from "@components/dividers/Divider";
import { DownChevronIcon, AlertCircleIcon } from "@components/svg/Icons";
import Button from "@components/buttons/Button";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { BreadCrumbs } from "@components/breadcrumbs/Breadcrumbs";
import Tooltip from "@components/tooltip";
import DocumentSearchForm from "@components/forms/DocumentSearchForm";
import { Alert } from "@components/Alert";
import { SubNav } from "@components/nav/SubNav";
import { Heading } from "@components/typography/Heading";

import { truncateString } from "@utils/truncateString";
import { getCountryName, getCountrySlug } from "@helpers/getCountryFields";
import { getCorpusInfo } from "@helpers/getCorpusInfo";
import { getMainDocuments } from "@helpers/getMainDocuments";

import { sortFilterTargets } from "@utils/sortFilterTargets";
import { pluralise } from "@utils/pluralise";
import { getFamilyMetaDescription } from "@utils/getFamilyMetaDescription";
import { extractNestedData } from "@utils/extractNestedData";

import { TFamilyPage, TMatchedFamily, TTarget, TGeography, TOrganisationDictionary, TTheme, TCorpusTypeDictionary, TSearchResponse } from "@types";

import { QUERY_PARAMS } from "@constants/queryParams";
import { EXAMPLE_SEARCHES } from "@constants/exampleSearches";
import { MAX_FAMILY_SUMMARY_LENGTH } from "@constants/document";
import { MAX_PASSAGES } from "@constants/paging";
import { PostHog } from "posthog-node";
import { getFeatureFlags } from "@utils/featureFlags";

type TProps = {
  page: TFamilyPage;
  targets: TTarget[];
  countries: TGeography[];
  corpus_types: TCorpusTypeDictionary;
  theme: TTheme;
  featureFlags: Record<string, string | boolean>;
  vespaFamilyData: TSearchResponse;
};

/*
  # DEV NOTES
  - This page displays a single document family and its associated documents, meta data, targets, and events.
  - Families can contain multiple documents, often referred to as 'physical documents'.
  - The 'physical document' view is within the folder: src/pages/documents/[id].tsx.
*/

const FamilyPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({
  page,
  targets = [],
  countries = [],
  corpus_types,
  theme,
  featureFlags,
  vespaFamilyData,
}: TProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const startingNumberOfTargetsToDisplay = 5;
  const [numberOfTargetsToDisplay, setNumberOfTargetsToDisplay] = useState(startingNumberOfTargetsToDisplay);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showCollectionDetail, setShowCollectionDetail] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [summary, setSummary] = useState("");

  const publishedTargets = sortFilterTargets(targets);
  const hasTargets = !!publishedTargets && publishedTargets?.length > 0;

  const geographyNames = page.geographies ? page.geographies.map((geo) => getCountryName(geo, countries)) : null;
  const geographyName = geographyNames ? geographyNames[0] : "";
  const geographySlug = page.geographies ? getCountrySlug(page.geographies[0], countries) : "";
  const breadcrumbCategory = { label: "Search results", href: "/search" };
  const breadcrumbGeography =
    page.geographies && page.geographies.length > 1 ? null : { label: geographyName, href: `/geographies/${geographySlug}` };

  let searchFamily: TMatchedFamily = null;
  const { status, families } = useSearch(router.query, page.import_id, null, !!router.query[QUERY_PARAMS.query_string], MAX_PASSAGES);
  if (!!router.query[QUERY_PARAMS.query_string]) {
    families.forEach((family) => {
      if (page.slug === family.family_slug) {
        searchFamily = family;
      }
    });
  }

  const handleCollectionClick = (e: React.MouseEvent<HTMLAnchorElement>, collectionIndex: number) => {
    e.preventDefault();
    setShowCollectionDetail(true);
    setTimeout(() => {
      const collectionElement = document.getElementById("collection-" + collectionIndex);
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

  const { corpusImage, corpusAltImage, corpusNote } = getCorpusInfo({
    corpus_types,
    corpus_id: page.corpus_id,
  });

  const [mainDocuments, otherDocuments] = getMainDocuments(page.documents);

  const getDocumentCategories = () => {
    // Some types are comma separated, so we need to split them
    let categories = page.documents.map((doc) => {
      if (doc.document_type?.includes(",")) {
        return doc.document_type.split(",");
      } else return doc.document_type || "";
    });
    return [...new Set(categories.flat())];
  };

  useEffect(() => {
    if (page?.summary) {
      const text = page?.summary;
      if (showFullSummary) {
        setSummary(text);
      } else {
        setSummary(truncateString(text, MAX_FAMILY_SUMMARY_LENGTH));
      }
    }
  }, [page, showFullSummary]);

  useEffect(() => {
    setShowCollectionDetail(false);
  }, [pathname]);

  // Search handlers
  const handleSearchInput = (term: string) => {
    const queryObj = {};
    queryObj[QUERY_PARAMS.query_string] = term;
    if (term === "") return false;
    // if the family only has one main document, redirect to that document
    // if there is no main document but only one other document, redirect to the other document
    if (mainDocuments.length === 1) {
      router.push({ pathname: `/documents/${mainDocuments[0].slug}`, query: queryObj });
    } else if (mainDocuments.length === 0 && otherDocuments.length === 1) {
      router.push({ pathname: `/documents/${otherDocuments[0].slug}`, query: queryObj });
    } else {
      router.push({ pathname: `/document/${page.slug}`, query: queryObj });
    }
  };

  return (
    <Layout title={`${page.title}`} description={getFamilyMetaDescription(page.summary, geographyNames?.join(", "), page.category)} theme={theme}>
      <Script id="analytics">
        analytics.category = "{page.category}"; analytics.type = "{getDocumentCategories().join(",")}"; analytics.geography = "
        {page.geographies?.join(",")}";
      </Script>
      <section
        className="mb-8"
        data-analytics-category={page.category}
        data-analytics-type={getDocumentCategories().join(",")}
        data-analytics-geography={page.geographies?.join(",")}
      >
        <SubNav>
          <BreadCrumbs geography={breadcrumbGeography} category={breadcrumbCategory} label={page.title} />
        </SubNav>
        <SiteWidth>
          <SingleCol extraClasses="mt-8">
            <FamilyHead family={page} onCollectionClick={handleCollectionClick} />
            <section className="mt-6">
              {/* SSR summary */}
              <div className={`text-content mt-4 ${summary && "hidden"}`} dangerouslySetInnerHTML={{ __html: page.summary }} />
              <div className="text-content mt-4" dangerouslySetInnerHTML={{ __html: summary }} />
              {page.summary.length > MAX_FAMILY_SUMMARY_LENGTH && (
                <div className="mt-4">
                  <button onClick={() => setShowFullSummary(!showFullSummary)} className="anchor alt text-sm">
                    {showFullSummary ? "Hide full summary" : "View full summary"}
                  </button>
                </div>
              )}
            </section>

            <section className="mt-8" data-cy="top-documents">
              <DocumentSearchForm
                placeholder={`Search the full text of the ${page.title}`}
                handleSearchInput={handleSearchInput}
                input={router.query[QUERY_PARAMS.query_string] as string}
                featuredSearches={EXAMPLE_SEARCHES}
                showSuggestions
              />
            </section>

            {mainDocuments.length > 0 && theme !== "mcf" && (
              <section className="mt-8">
                <Heading level={2}>Main {pluralise(mainDocuments.length, "document", "documents")}</Heading>
                <div data-cy="main-documents">
                  {mainDocuments.map((doc) => (
                    <FamilyDocument
                      matches={getDocumentMatches(doc.slug)}
                      document={doc}
                      key={doc.import_id}
                      status={status}
                      familyMatches={searchFamily?.total_passage_hits}
                    />
                  ))}
                </div>
              </section>
            )}

            {otherDocuments.length > 0 && (
              <>
                <section className="mt-8">
                  <div className="flex items-center gap-2">
                    <Heading level={2} extraClasses="mb-0">
                      {theme === "mcf" ? "Project documents" : "Other documents in this entry"}
                    </Heading>
                    {theme !== "mcf" && (
                      <Tooltip
                        id="related-documents-info"
                        place="right"
                        icon="i"
                        tooltip="Other documents can be previous versions, amendments, annexes, supporting legislation, and more."
                      />
                    )}
                  </div>
                  <div data-cy="related-documents">
                    {otherDocuments.map((doc) => (
                      <div key={doc.import_id} className="mt-4">
                        <FamilyDocument
                          matches={getDocumentMatches(doc.slug)}
                          document={doc}
                          status={status}
                          familyMatches={searchFamily?.total_passage_hits}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {hasTargets && (
              <>
                <section className="mt-8">
                  <div>
                    <div>
                      <Heading level={2}>Targets</Heading>
                      <ExternalLink url="https://form.jotform.com/233542296946365" className="block text-sm my-4 md:my-0" cy="download-target-csv">
                        Request to download all target data (.csv)
                      </ExternalLink>
                    </div>
                    <div className="flex mt-4">
                      <Alert
                        message={
                          <>
                            We are developing the ability to detect targets in documents.{" "}
                            <ExternalLink url="https://form.jotform.com/233294139336358">Get notified when this is ready</ExternalLink>.
                          </>
                        }
                        icon={<AlertCircleIcon height="16" width="16" />}
                      />
                    </div>
                    <Targets targets={publishedTargets.slice(0, numberOfTargetsToDisplay)} />
                  </div>
                </section>
                {publishedTargets.length > numberOfTargetsToDisplay && (
                  <div data-cy="more-targets-button">
                    <Button
                      color="secondary"
                      extraClasses="flex gap-2 items-center my-5"
                      onClick={() => setNumberOfTargetsToDisplay(numberOfTargetsToDisplay + 3)}
                    >
                      <DownChevronIcon /> View more targets
                    </Button>
                  </div>
                )}

                {publishedTargets.length > startingNumberOfTargetsToDisplay && publishedTargets.length <= numberOfTargetsToDisplay && (
                  <div>
                    <Button color="secondary" extraClasses="flex gap-2 items-center my-5" onClick={() => setNumberOfTargetsToDisplay(5)}>
                      <div className="rotate-180">
                        <DownChevronIcon />
                      </div>{" "}
                      Hide targets
                    </Button>
                  </div>
                )}
              </>
            )}

            {page.events.length > 0 && (
              <section className="mt-8">
                <Heading level={3} extraClasses="mb-0">
                  Timeline
                </Heading>
                <ShowHide show={showTimeline} onClick={() => setShowTimeline(!showTimeline)} className="mt-4" />
                {showTimeline && (
                  <Timeline>
                    {page.events.map((event, index: number) => (
                      <Event event={event} index={index} last={index === page.events.length - 1 ? true : false} key={`event-${index}`} />
                    ))}
                  </Timeline>
                )}
              </section>
            )}

            <section className="mt-8">
              <Heading level={4}>Note</Heading>
              <div className="flex text-sm">
                {corpusImage && (
                  <div className="relative max-w-[144px] mt-1 mr-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${corpusImage}`} alt={corpusAltImage} />
                  </div>
                )}
                <span dangerouslySetInnerHTML={{ __html: corpusNote }} className="" />
              </div>
            </section>

            {vespaFamilyData && (
              <section className="mt-8">
                <Heading level={4}>Concepts</Heading>
                <div className="flex text-sm">
                  <ul>
                    {vespaFamilyData.families.hits.map((family) => {
                      return family.concepts.map((concept) => {
                        return <li key={concept.id}>{concept.name}</li>;
                      });
                    })}
                  </ul>
                </div>
              </section>
            )}

            {page.collections.length > 0 && (
              <div className="mt-8">
                <Divider />
              </div>
            )}

            {page.collections.map((collection, i) => (
              <section className="pt-12" id={`collection-${i}`} key={collection.import_id}>
                <div className="mb-5">
                  <Heading level={4} extraClasses="mb-0">
                    About the {collection.title}
                  </Heading>
                  <ShowHide show={showCollectionDetail} onClick={() => setShowCollectionDetail(!showCollectionDetail)} />
                </div>
                {showCollectionDetail && (
                  <div>
                    <div className="mb-8 text-content" dangerouslySetInnerHTML={{ __html: collection.description }} />
                    <Heading level={4}>Other documents in the {collection.title}</Heading>
                    <div className="divide-solid divide-y">
                      {collection.families.map((collFamily, i) => (
                        <div key={collFamily.slug} className="pt-4 pb-4">
                          <LinkWithQuery href={`/document/${collFamily.slug}`}>{collFamily.title}</LinkWithQuery>
                          <div className="text-content" dangerouslySetInnerHTML={{ __html: collFamily.description }}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            ))}
          </SingleCol>
        </SiteWidth>
      </section>
      {/* This is here in the short term for us to test features flags with our cache settings */}
      <script id="feature-flags" type="text/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(featureFlags) }} />
    </Layout>
  );
};
export default FamilyPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");
  const featureFlags = await getFeatureFlags(context.req.cookies);

  const theme = process.env.THEME;
  const id = context.params.id;
  const client = new ApiClient(process.env.API_URL);

  let familyData: TFamilyPage;
  let vespaFamilyData: TSearchResponse;
  let targetsData: TTarget[] = [];
  let countriesData: TGeography[] = [];
  let corpus_types: TCorpusTypeDictionary;

  try {
    const { data: returnedData } = await client.get(`/documents/${id}`);
    familyData = returnedData;

    const conceptsV1 = featureFlags["concepts-v1"];
    if (conceptsV1) {
      // fetch the families
      const { data: vespaFamilyDataRepsonse } = await client.get(`/families/${familyData.import_id}`);
      vespaFamilyData = vespaFamilyDataRepsonse;
    }
  } catch (error) {
    // TODO: handle error more elegantly
  }

  if (familyData) {
    try {
      const targetsRaw = await axios.get<TTarget[]>(`${process.env.S3_PATH}/families/${familyData.import_id}.json`);
      targetsData = targetsRaw.data;
    } catch (error) {}
  }

  if (familyData) {
    try {
      const configRaw = await client.getConfig();
      const response_geo = extractNestedData<TGeography>(configRaw.data.geographies, 2, "");
      countriesData = response_geo.level2;
      corpus_types = configRaw.data.corpus_types;
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
      countries: countriesData,
      corpus_types,
      theme: theme,
      featureFlags,
      vespaFamilyData,
    },
  };
};
