import { useEffect, useState, useCallback, useMemo } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { MdOutlineTune } from "react-icons/md";

import { ApiClient } from "@api/http-common";

import useSearch from "@hooks/useSearch";

import { FullWidth } from "@components/panels/FullWidth";

import Layout from "@components/layouts/Main";
import EmbeddedPDF from "@components/EmbeddedPDF";
import PassageMatches from "@components/PassageMatches";
import Loader from "@components/Loader";
import SearchForm from "@components/forms/SearchForm";
import { SearchLimitTooltip } from "@components/tooltip/SearchLimitTooltip";
import { DocumentHead } from "@components/documents/DocumentHead";
import { EmptyPassages } from "@components/documents/EmptyPassages";
import { EmptyDocument } from "@components/documents/EmptyDocument";
import { SearchSettings } from "@components/filters/SearchSettings";

import { QUERY_PARAMS } from "@constants/queryParams";
import { getDocumentDescription } from "@constants/metaDescriptions";
import { EXAMPLE_SEARCHES } from "@constants/exampleSearches";
import { MAX_PASSAGES, MAX_RESULTS } from "@constants/paging";

import { TDocumentPage, TFamilyPage, TPassage, TTheme, TSearchResponse, TConcept } from "@types";
import { getFeatureFlags } from "@utils/featureFlags";
import { rootLevelConceptsIds } from "@utils/processConcepts";
import { useEffectOnce } from "@hooks/useEffectOnce";
import { ConceptsDocumentViewer } from "@components/documents/ConceptsDocumentViewer";

type TProps = {
  document: TDocumentPage;
  family: TFamilyPage;
  theme: TTheme;
  vespaFamilyData?: TSearchResponse;
};

const passageClasses = (docType: string) => {
  if (docType === "application/pdf") {
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

const DocumentPage: InferGetServerSidePropsType<typeof getServerSideProps> = ({ document, family, theme, vespaFamilyData }: TProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [passageIndex, setPassageIndex] = useState(null);
  const [passageMatches, setPassageMatches] = useState<TPassage[]>([]);
  const [totalNoOfMatches, setTotalNoOfMatches] = useState(0);
  const router = useRouter();
  const qsSearchString = router.query[QUERY_PARAMS.query_string];
  const exactMatchQuery = !!router.query[QUERY_PARAMS.exact_match];
  const startingPassage = Number(router.query.passage) || 0;

  const { status, families, searchQuery } = useSearch(
    router.query,
    null,
    document.import_id,
    !!(
      router.query[QUERY_PARAMS.query_string] ||
      router.query[QUERY_PARAMS["concept_filters.id"]] ||
      router.query[QUERY_PARAMS["concept_filters.name"]]
    ),
    MAX_PASSAGES
  );

  const canPreview = document.content_type === "application/pdf";

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

  // Search input handler
  const handleSearchInput = (term: string) => {
    setPassageIndex(0);
    const queryObj = {};
    queryObj[QUERY_PARAMS.query_string] = term;
    if (term === "") return false;
    router.push({ pathname: `/documents/${document.slug}`, query: queryObj });
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
    router.push({
      pathname: `/documents/${document.slug}`,
      query: queryObj,
    });
  };

  // Handlers to update router
  const handleQueryTermChange = useCallback(
    (queryTerm: string) => {
      const queryObj = {};
      queryObj[QUERY_PARAMS.query_string] = queryTerm;
      router.push({
        pathname: `/documents/${document.slug}`,
        query: queryObj,
      });
    },
    [router, document.slug]
  );

  const handleExactMatchChange = useCallback(
    (isExact: boolean) => {
      const queryObj = {
        [QUERY_PARAMS.query_string]: router.query[QUERY_PARAMS.query_string],
      };

      if (isExact) {
        queryObj[QUERY_PARAMS.exact_match] = "true";
      }

      router.push({
        pathname: `/documents/${document.slug}`,
        query: queryObj,
      });
    },
    [router, document.slug]
  );

  useEffect(() => {
    let passageMatches: TPassage[] = [];
    let totalNoOfMatches = 0;
    families.forEach((family) => {
      family.family_documents.forEach((cacheDoc) => {
        if (document.slug === cacheDoc.document_slug) {
          passageMatches.push(...cacheDoc.document_passage_matches);
          totalNoOfMatches = family.total_passage_hits;
        }
      });
    });
    setPassageMatches(passageMatches);
    setTotalNoOfMatches(totalNoOfMatches);
    // comparing families as objects will cause an infinite loop as each collection is a new instance of an object
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(families), document.slug]);

  useEffect(() => {
    // Scroll to starting passage on page load
    if (startingPassage) {
      scrollToPassage(startingPassage);
    }
  }, [startingPassage]);

  /** Concepts: WIP */
  const [concepts, setConcepts] = useState<TConcept[]>([]);
  const [rootConcepts, setRootConcepts] = useState<TConcept[]>([]);

  // Extract unique concept keys and their counts
  const conceptCounts: { conceptKey: string; count: number }[] = useMemo(() => {
    const uniqueConceptMap = new Map<string, number>();

    (vespaFamilyData?.families ?? []).forEach((family) => {
      family.hits.forEach((hit) => {
        Object.entries(hit.concept_counts ?? {}).forEach(([conceptKey, count]) => {
          const existingCount = uniqueConceptMap.get(conceptKey) || 0;
          uniqueConceptMap.set(conceptKey, existingCount + count);
        });
      });
    });

    return Array.from(uniqueConceptMap.entries())
      .map(([conceptKey, count]) => ({ conceptKey, count }))
      .sort((a, b) => b.count - a.count);
  }, [vespaFamilyData]);

  const conceptFiltersQuery = router.query[QUERY_PARAMS["concept_filters.name"]];
  const conceptFilters = useMemo(
    () => (conceptFiltersQuery ? (Array.isArray(conceptFiltersQuery) ? conceptFiltersQuery : [conceptFiltersQuery]) : undefined),
    [conceptFiltersQuery]
  );

  const handleConceptClick = useCallback(
    (conceptLabel: string) => {
      setPassageIndex(0);
      if (conceptLabel === "") return false;

      const currentConceptFilters = conceptFilters || [];

      // If the concept is already in filters, remove it
      if (currentConceptFilters.includes(conceptLabel)) {
        const updatedConceptFilters = currentConceptFilters.filter((concept) => concept !== conceptLabel);

        const queryObj = { ...router.query };

        // If no concept filters remain, remove the concept_filters.name query param entirely
        if (updatedConceptFilters.length === 0) {
          delete queryObj[QUERY_PARAMS["concept_filters.name"]];
        } else {
          // Otherwise, update the concept filters
          queryObj[QUERY_PARAMS["concept_filters.name"]] = updatedConceptFilters;
        }

        router.push({
          pathname: `/documents/${document.slug}`,
          query: queryObj,
        });
        return;
      }

      // If the concept is not in filters, add it
      const updatedConceptFilters = [...currentConceptFilters, conceptLabel];

      const queryObj = { ...router.query };
      queryObj[QUERY_PARAMS["concept_filters.name"]] = updatedConceptFilters;
      router.push({
        pathname: `/documents/${document.slug}`,
        query: queryObj,
      });
    },
    [router, document.slug, conceptFilters]
  );

  useEffectOnce(() => {
    /** Get `rootConcepts` */
    const rootConceptsS3Promises = rootLevelConceptsIds.map((conceptId) => {
      const url = `https://cdn.climatepolicyradar.org/concepts/${conceptId}.json`;
      return fetch(url).then((response) => response.json());
    });

    /** Get concepts associated with the family */
    const conceptsS3Promises = conceptCounts.map(({ conceptKey }) => {
      // the concept ID is in the shape of `Q100:concept name`
      const conceptId = conceptKey.split(":")[0];
      const url = `https://cdn.climatepolicyradar.org/concepts/${conceptId}.json`;
      return fetch(url).then((response) => response.json());
    });

    /** Get `rootConcepts` and `concepts` from S3 */
    Promise.all([...rootConceptsS3Promises, ...conceptsS3Promises]).then((allConcepts) => {
      const rootConceptsResults = allConcepts.slice(0, rootConceptsS3Promises.length);
      const conceptsResults = allConcepts.slice(rootConceptsS3Promises.length);

      setRootConcepts(rootConceptsResults);
      setConcepts(conceptsResults);
    });
  });

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
        {status !== "success" ? (
          <div className="w-full flex justify-center flex-1 bg-white">
            <Loader />
          </div>
        ) : (
          <section className="flex-1 flex" id="document-viewer">
            <FullWidth extraClasses="flex-1">
              {concepts.length === 0 && (
                <div id="document-container" className="flex flex-col md:flex-row md:h-[80vh]">
                  <div
                    id="document-preview"
                    className={`pt-4 flex-1 h-[400px] basis-[400px] md:block md:h-full ${totalNoOfMatches ? "md:border-r md:border-r-gray-200" : ""}`}
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
                      document.content_type
                    )}`}
                  >
                    <div id="document-search" className="flex flex-col gap-2 md:pl-4">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <SearchForm
                            placeholder="Search the full text of the document"
                            handleSearchInput={handleSearchInput}
                            input={qsSearchString as string}
                            size="default"
                          />
                        </div>
                        <div className="relative z-10 flex justify-center">
                          <button
                            className="px-4 flex justify-center items-center text-textDark text-xl"
                            onClick={() => setShowOptions(!showOptions)}
                          >
                            <MdOutlineTune />
                          </button>
                          <AnimatePresence initial={false}>
                            {showOptions && (
                              <motion.div
                                key="content"
                                initial="collapsed"
                                animate="open"
                                exit="collapsed"
                                variants={{
                                  collapsed: { opacity: 0, transition: { duration: 0.1 } },
                                  open: { opacity: 1, transition: { duration: 0.25 } },
                                }}
                              >
                                <SearchSettings
                                  queryParams={router.query}
                                  handleSearchChange={handleSemanticSearchChange}
                                  setShowOptions={setShowOptions}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {!router.query[QUERY_PARAMS.query_string] && (
                        <div className="flex text-sm text-gray-600">
                          <div className="mr-2 flex-shrink-0 font-medium">Examples:</div>
                          <div className="">{EXAMPLE_SEARCHES.join(", ")}</div>
                        </div>
                      )}
                    </div>
                    {totalNoOfMatches > 0 && (
                      <>
                        <div className="my-4 text-sm pb-4 border-b border-gray-200 md:pl-4" data-cy="document-matches-description">
                          <div className="mb-2">
                            Displaying {renderPassageCount(totalNoOfMatches)} for "
                            <span className="text-textDark font-medium">{`${qsSearchString}`}</span>"
                            {!searchQuery.exact_match && ` and related phrases`}
                            {totalNoOfMatches >= MAX_RESULTS && (
                              <span className="ml-1 inline-block">
                                <SearchLimitTooltip colour="grey" />
                              </span>
                            )}
                          </div>

                          <p>Sorted by search relevance</p>
                        </div>
                        <div
                          id="document-passage-matches"
                          className="relative overflow-y-scroll scrollbar-thumb-gray-200 scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-500 md:pl-4"
                        >
                          <PassageMatches passages={passageMatches} onClick={handlePassageClick} activeIndex={passageIndex ?? startingPassage} />
                        </div>
                      </>
                    )}
                    {totalNoOfMatches === 0 && <EmptyPassages hasQueryString={!!router.query[QUERY_PARAMS.query_string]} />}
                  </div>
                </div>
              )}
            </FullWidth>
          </section>
        )}

        {concepts.length > 0 && (
          <ConceptsDocumentViewer
            initialQueryTerm={qsSearchString}
            initialExactMatch={exactMatchQuery}
            initialPassage={startingPassage}
            concepts={concepts}
            initialConceptFilters={conceptFilters}
            rootConcepts={rootConcepts}
            conceptCounts={conceptCounts}
            document={document}
            onQueryTermChange={handleQueryTermChange}
            onExactMatchChange={handleExactMatchChange}
            onConceptClick={handleConceptClick}
          />
        )}
      </section>
    </Layout>
  );
};

export default DocumentPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader("Cache-Control", "public, max-age=3600, immutable");
  const featureFlags = await getFeatureFlags(context.req.cookies);

  const theme = process.env.THEME;
  const id = context.params.id;
  const client = new ApiClient(process.env.API_URL);

  let documentData: TDocumentPage;
  let familyData: TFamilyPage;
  let vespaFamilyData: TSearchResponse | null = null;

  try {
    const { data: returnedDocumentData } = await client.get(`/documents/${id}`);
    documentData = returnedDocumentData.document;
    const familySlug = returnedDocumentData.family?.slug;
    const { data: returnedFamilyData } = await client.get(`/documents/${familySlug}`);
    familyData = returnedFamilyData;

    // Fetch Vespa family data for concepts (similar to document/[id].tsx)
    const conceptsV1 = featureFlags["concepts-v1"];
    if (conceptsV1) {
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
    props: {
      document: documentData,
      family: familyData,
      theme: theme,
      vespaFamilyData: vespaFamilyData ?? null,
    },
  };
};
