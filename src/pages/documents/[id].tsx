import { AnimatePresence, motion } from "framer-motion";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useMemo } from "react";

import { ApiClient } from "@/api/http-common";
import EmbeddedPDF from "@/components/EmbeddedPDF";
import Loader from "@/components/Loader";
import PassageMatches from "@/components/PassageMatches";
import { ConceptsDocumentViewer } from "@/components/documents/ConceptsDocumentViewer";
import { DocumentHead } from "@/components/documents/DocumentHead";
import { EmptyDocument } from "@/components/documents/EmptyDocument";
import { EmptyPassages } from "@/components/documents/EmptyPassages";
import { SearchSettings } from "@/components/filters/SearchSettings";
import Layout from "@/components/layouts/Main";
import { Info } from "@/components/molecules/info/Info";
import { FullWidth } from "@/components/panels/FullWidth";
import { getDocumentDescription } from "@/constants/metaDescriptions";
import { MAX_PASSAGES, MAX_RESULTS } from "@/constants/paging";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { withEnvConfig } from "@/context/EnvConfig";
import useSearch from "@/hooks/useSearch";
import { TDocumentPage, TFamilyPage, TPassage, TTheme, TSearchResponse } from "@/types";
import { getFeatureFlags } from "@/utils/featureFlags";
import { isKnowledgeGraphEnabled } from "@/utils/features";
import { getMatchedPassagesFromSearch } from "@/utils/getMatchedPassagesFromFamily";
import { getPassageResultsContext } from "@/utils/getPassageResultsContext";
import { readConfigFile } from "@/utils/readConfigFile";

interface IProps {
  document: TDocumentPage;
  family: TFamilyPage;
  theme: TTheme;
  vespaFamilyData?: TSearchResponse;
  vespaDocumentData?: TSearchResponse;
}

const passageClasses = (canPreview: boolean) => {
  if (canPreview) {
    return "md:w-1/3";
  }
  return "md:w-2/3";
};

const scrollToPassage = (index: number) => {
  setTimeout(() => {
    const passage = window.document.getElementById(`passage-${index}`);
    if (!passage) return;
    const topPos = passage.offsetTop;
    const container = window.document.getElementById("document-passage-matches");
    if (!container) return;
    container.scrollTo({ top: topPos - 10, behavior: "smooth" });
  }, 100);
};

const renderPassageCount = (count: number): string => {
  return count > MAX_PASSAGES ? `top ${MAX_PASSAGES} matches` : count + ` match${count > 1 ? "es" : ""}`;
};

/*
  # DEV NOTES
  - This page displays a 'physical' document, which is a single document within a document family.
  - The default view will display a preview of the document if it is a PDF.
  - If there are search matches for the document, the page will display a list of passages that match the search query.
  - If the document is an HTML, the passages will be displayed in a list on the left side of the page but the document will not be displayed.
*/

const DocumentPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({
  document,
  family,
  theme,
  vespaFamilyData,
  vespaDocumentData,
}: IProps) => {
  const [canPreview, setCanPreview] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [passageIndex, setPassageIndex] = useState(null);
  const [passageMatches, setPassageMatches] = useState<TPassage[]>([]);
  const [totalNoOfMatches, setTotalNoOfMatches] = useState(0);
  const router = useRouter();
  const qsSearchString = router.query[QUERY_PARAMS.query_string];
  const exactMatchQuery = !!router.query[QUERY_PARAMS.exact_match];
  const passagesByPosition = router.query[QUERY_PARAMS.passages_by_position] === "true";
  const startingPassage = Number(router.query.passage) || 0;

  // Note: only runs a fresh start if either a query string or concept data is provided
  const { status, families, searchQuery } = useSearch(
    router.query,
    null,
    document.import_id,
    !!(router.query[QUERY_PARAMS.query_string] || router.query[QUERY_PARAMS.concept_id] || router.query[QUERY_PARAMS.concept_name]),
    MAX_PASSAGES
  );

  const handlePassageClick = (index: number) => {
    if (!canPreview) return;
    setPassageIndex(index);
    scrollToPassage(index);
  };

  const handleViewSourceClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const url = document.content_type === "application/pdf" ? document.cdn_object : document.source_url;
    if (!url) return;
    window.open(url);
  };

  const handleViewOtherDocsClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push({ pathname: `/document/${family.slug}`, query: router.query });
  };

  // Semantic search / exact match handler
  const handleSemanticSearchChange = (_: string, isExact: string) => {
    setPassageIndex(0);
    const queryObj = { ...router.query };
    if (isExact === "false") {
      delete queryObj[QUERY_PARAMS.exact_match];
    } else if (isExact === "true") {
      queryObj[QUERY_PARAMS.exact_match] = "true";
    }
    queryObj[QUERY_PARAMS.query_string] = router.query[QUERY_PARAMS.query_string] as string;
    queryObj["id"] = document.slug;
    router.push(
      {
        query: queryObj,
      },
      undefined,
      { shallow: true }
    );
  };

  const handlePassagesOrderChange = (orderValue: string) => {
    setPassageIndex(0);
    const queryObj = { ...router.query };
    queryObj[QUERY_PARAMS.passages_by_position] = orderValue;
    router.push({ query: queryObj }, undefined, { shallow: true });
  };

  // Handlers to update router
  const handleExactMatchChange = useCallback(
    (isExact: boolean) => {
      const queryObj = { ...router.query };

      if (isExact) {
        queryObj[QUERY_PARAMS.exact_match] = "true";
      }

      router.push(
        {
          pathname: `/documents/${document.slug}`,
          query: queryObj,
        },
        undefined,
        { shallow: true }
      );
    },
    [router, document.slug]
  );

  // Update passages based on search results
  useEffect(() => {
    const [passageMatches, totalNoOfMatches] = getMatchedPassagesFromSearch(families, document);

    setPassageMatches(passageMatches);
    setTotalNoOfMatches(totalNoOfMatches);
    setCanPreview(!!document.cdn_object && document.cdn_object.toLowerCase().endsWith(".pdf"));
    // comparing families as objects will cause an infinite loop as each collection is a new instance of an object
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(families), document.slug]);

  const passagesResultsContext = getPassageResultsContext({
    isExactSearch: exactMatchQuery,
    passageMatches: totalNoOfMatches,
    queryTerm: qsSearchString,
    selectedTopics: [],
  });

  const conceptFiltersQuery = router.query[QUERY_PARAMS.concept_name];
  const conceptFilters = useMemo(
    () => (conceptFiltersQuery ? (Array.isArray(conceptFiltersQuery) ? conceptFiltersQuery : [conceptFiltersQuery]) : undefined),
    [conceptFiltersQuery]
  );

  return (
    <Layout title={`${document.title}`} description={getDocumentDescription(document.title)} theme={theme}>
      <section
        className="pb-8 flex-1 flex flex-col"
        data-analytics-date={family.published_date}
        data-analytics-geography={family.geographies?.join(",")}
        data-analytics-variant={document.variant}
        data-analytics-type={document.content_type}
      >
        <DocumentHead
          document={document}
          family={family}
          handleViewOtherDocsClick={handleViewOtherDocsClick}
          handleViewSourceClick={handleViewSourceClick}
        />

        {/* TODO: Remove this once we have hard launched concepts in product. */}
        {vespaFamilyData === null && vespaDocumentData === null && (
          <section className="flex-1 flex" id="document-viewer">
            <FullWidth extraClasses="flex-1">
              <div id="document-container" className="flex flex-col md:flex-row md:h-[80vh]">
                <div
                  id="document-preview"
                  className={`flex-1 h-[400px] basis-[400px] md:block md:h-full ${totalNoOfMatches ? "md:border-r md:border-r-gray-200" : ""}`}
                >
                  {canPreview && (
                    <EmbeddedPDF
                      document={document}
                      documentPassageMatches={passageMatches}
                      passageIndex={passageIndex}
                      startingPassageIndex={startingPassage}
                    />
                  )}
                  {!canPreview && <EmptyDocument />}
                </div>
                <div
                  id="document-sidebar"
                  className={`py-4 order-first max-h-[90vh] md:pb-0 md:order-last md:max-h-full md:max-w-[480px] md:min-w-[400px] md:grow-0 md:shrink-0 flex flex-col ${passageClasses(
                    canPreview
                  )}`}
                >
                  {status !== "success" ? (
                    <div className="w-full flex justify-center flex-1 bg-white">
                      <Loader />
                    </div>
                  ) : (
                    <>
                      <div id="document-search" className="flex items-start gap-2 md:pl-4 pb-4 border-b border-gray-200">
                        <div className="flex-1">
                          {totalNoOfMatches > 0 && (
                            <>
                              <div className="mb-2 text-sm" data-cy="document-matches-description">
                                {passagesResultsContext}
                                {totalNoOfMatches >= MAX_RESULTS && (
                                  <Info
                                    className="inline-block ml-2 align-text-bottom"
                                    description={`We limit the number of search results to ${MAX_RESULTS} so that you get the best performance from our tool. We're working on a way to remove this limit.`}
                                  />
                                )}
                              </div>
                              <p className="text-sm">Sorted by {passagesByPosition ? "page number" : "search relevance"}</p>
                            </>
                          )}
                        </div>
                        <div className="relative z-10 flex justify-center">
                          <button
                            className={`px-1 py-0.5 -mt-0.5 rounded-md text-sm text-text-primary font-normal ${showOptions ? "bg-surface-ui" : ""}`}
                            onClick={() => setShowOptions(!showOptions)}
                          >
                            Sort &amp; Display
                          </button>
                          <AnimatePresence initial={false}>
                            {showOptions && (
                              <motion.div
                                key="content"
                                initial="collapsed"
                                animate="open"
                                exit="collapsed"
                                variants={{
                                  collapsed: {
                                    opacity: 0,
                                    transition: { duration: 0.1 },
                                  },
                                  open: {
                                    opacity: 1,
                                    transition: { duration: 0.25 },
                                  },
                                }}
                              >
                                <SearchSettings
                                  queryParams={router.query}
                                  handleSearchChange={handleSemanticSearchChange}
                                  setShowOptions={setShowOptions}
                                  handlePassagesClick={handlePassagesOrderChange}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      {totalNoOfMatches > 0 && (
                        <div
                          id="document-passage-matches"
                          className="relative overflow-y-scroll scrollbar-thumb-gray-200 scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-500 md:pl-4"
                        >
                          <PassageMatches passages={passageMatches} onClick={handlePassageClick} activeIndex={passageIndex ?? startingPassage} />
                        </div>
                      )}
                      {totalNoOfMatches === 0 && <EmptyPassages hasQueryString={!!router.query[QUERY_PARAMS.query_string]} />}
                    </>
                  )}
                </div>
              </div>
            </FullWidth>
          </section>
        )}

        {vespaFamilyData !== null && vespaDocumentData !== null && (
          <ConceptsDocumentViewer
            initialQueryTerm={qsSearchString}
            initialExactMatch={exactMatchQuery}
            initialPassage={startingPassage}
            initialConceptFilters={conceptFilters}
            vespaFamilyData={vespaFamilyData}
            vespaDocumentData={vespaDocumentData}
            familySlug={family.slug}
            document={document}
            searchStatus={status}
            searchResultFamilies={families}
            onExactMatchChange={handleExactMatchChange}
          />
        )}
      </section>
    </Layout>
  );
};

export default DocumentPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");
  const featureFlags = getFeatureFlags(context.req.cookies);

  const theme = process.env.THEME;
  const themeConfig = await readConfigFile(theme);

  const knowledgeGraphEnabled = isKnowledgeGraphEnabled(featureFlags, themeConfig);

  const id = context.params.id;
  const client = new ApiClient(process.env.BACKEND_API_URL);

  let documentData: TDocumentPage;
  let familyData: TFamilyPage;
  let vespaFamilyData: TSearchResponse | null = null;
  let vespaDocumentData: TSearchResponse | null = null;

  try {
    const { data: returnedDocumentData } = await client.get(`/documents/${id}`);
    documentData = returnedDocumentData.document;
    const familySlug = returnedDocumentData.family?.slug;
    const { data: returnedFamilyData } = await client.get(`/documents/${familySlug}`);
    familyData = returnedFamilyData;

    // Fetch Vespa family data for concepts (similar to document/[id].tsx)
    if (knowledgeGraphEnabled) {
      const { data: vespaDocumentDataResponse } = await client.get(`/document/${documentData.import_id}`);
      vespaDocumentData = vespaDocumentDataResponse;
      const { data: vespaFamilyDataResponse } = await client.get(`/families/${familyData.import_id}`);
      vespaFamilyData = vespaFamilyDataResponse;
    }
  } catch {
    // TODO: Handle error more elegantly
  }

  if (!documentData || !familyData) {
    return {
      notFound: true,
    };
  }

  return {
    props: withEnvConfig({
      document: documentData,
      family: familyData,
      theme: theme,
      vespaFamilyData: vespaFamilyData ?? null,
      vespaDocumentData: vespaDocumentData ?? null,
    }),
  };
};
