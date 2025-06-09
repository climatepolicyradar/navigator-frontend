import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useReducer, useState } from "react";

import EmbeddedPDF from "@/components/EmbeddedPDF";
import Loader from "@/components/Loader";
import PassageMatches from "@/components/PassageMatches";
import { Button } from "@/components/atoms/button/Button";
import { Icon } from "@/components/atoms/icon/Icon";
import { EmptyDocument } from "@/components/documents/EmptyDocument";
import { EmptyPassages } from "@/components/documents/EmptyPassages";
import { SearchSettings } from "@/components/filters/SearchSettings";
import { MAX_RESULTS } from "@/constants/paging";
import { useEffectOnce } from "@/hooks/useEffectOnce";
import { TConcept, TDocumentPage, TLoadingStatus, TMatchedFamily, TPassage, TSearchResponse } from "@/types";
import { getPassageResultsContext } from "@/utils/getPassageResultsContext";
import { getCurrentPassagesOrderChoice } from "@/utils/getPassagesSortOrder";
import { fetchAndProcessConcepts } from "@/utils/processConcepts";

import { Info } from "../molecules/info/Info";
import { ConceptPicker } from "../organisms/ConceptPicker";
import { FullWidth } from "../panels/FullWidth";
import { SideCol } from "../panels/SideCol";

type TState = {
  pageNumber: number;
  isExactSearch: boolean;
  passageMatches: TPassage[];
  totalNoOfMatches: number;
};

interface IProps {
  initialQueryTerm?: string | string[];
  initialExactMatch?: boolean;
  initialPassage?: number;
  initialConceptFilters?: string[];
  vespaFamilyData: TSearchResponse;
  vespaDocumentData: TSearchResponse;
  document: TDocumentPage;
  searchStatus: TLoadingStatus;
  searchResultFamilies: TMatchedFamily[];
  // Callback props for state changes
  handleSemanticSearchChange?: (_: string, isExact: string) => void;
  handlePassagesOrderChange?: (orderValue: string) => void;
}

const passageClasses = (canPreview: boolean) => {
  if (canPreview) {
    return "lg:w-1/3";
  }
  return "md:w-2/3";
};

export const ConceptsDocumentViewer = ({
  initialQueryTerm = "",
  initialExactMatch = false,
  initialPassage = 0,
  initialConceptFilters,
  document,
  vespaFamilyData,
  vespaDocumentData,
  searchStatus,
  searchResultFamilies,
  handleSemanticSearchChange,
  handlePassagesOrderChange,
}: IProps) => {
  const router = useRouter();
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [showConcepts, setShowConcepts] = useState(false);

  const [state, setState] = useReducer((prev: TState, next: Partial<TState>) => ({ ...prev, ...next }), {
    pageNumber: initialPassage,
    isExactSearch: initialExactMatch,
    passageMatches: [],
    totalNoOfMatches: 0,
  });

  const [familyConcepts, setFamilyConcepts] = useState<TConcept[]>([]);

  const canPreview = !!document.cdn_object && document.cdn_object.toLowerCase().endsWith(".pdf");

  // Load concept data
  useEffectOnce(() => {
    // Extract unique concept IDs directly from vespaFamilyData
    const conceptIds = new Set<string>();
    (vespaFamilyData?.families ?? []).forEach((family) => {
      family.hits.forEach((hit) => {
        Object.keys(hit.concept_counts ?? {}).forEach((conceptKey) => {
          const [conceptId] = conceptKey.split(":");
          conceptIds.add(conceptId);
        });
      });
    });

    fetchAndProcessConcepts(Array.from(conceptIds)).then(({ concepts }) => {
      setFamilyConcepts(concepts);
    });
  });

  const documentConcepts: TConcept[] = useMemo(() => {
    const uniqueConceptMap = new Map<string, { concept: TConcept; count: number }>();

    (vespaDocumentData?.families ?? []).forEach((family) => {
      family.hits.forEach((hit) => {
        Object.entries(hit.concept_counts ?? {}).forEach(([conceptKey, count]) => {
          const [conceptId] = conceptKey.split(":");
          const matchingConcept = familyConcepts.find((concept) => concept.wikibase_id === conceptId);

          if (matchingConcept) {
            const existingEntry = uniqueConceptMap.get(conceptId);
            const updatedCount = existingEntry ? existingEntry.count + count : count;

            uniqueConceptMap.set(conceptId, {
              concept: matchingConcept,
              count: updatedCount,
            });
          }
        });
      });
    });

    return Array.from(uniqueConceptMap.values())
      .map(({ concept, count }) => ({
        ...concept,
        count,
      }))
      .sort((a, b) => (b.count || 0) - (a.count || 0));
  }, [vespaDocumentData, familyConcepts]);

  const selectedConcepts = useMemo(
    () =>
      initialConceptFilters
        ? familyConcepts.filter((concept) =>
            (Array.isArray(initialConceptFilters) ? initialConceptFilters : [initialConceptFilters]).includes(concept.preferred_label)
          )
        : [],
    [initialConceptFilters, familyConcepts]
  );

  // Calculate passage matches.
  useEffect(() => {
    const matches = searchResultFamilies.flatMap((family) =>
      family.family_documents.filter((cacheDoc) => cacheDoc.document_slug === document.slug).flatMap((cacheDoc) => cacheDoc.document_passage_matches)
    );

    const totalMatches =
      searchResultFamilies.find((family) => family.family_documents.some((cacheDoc) => cacheDoc.document_slug === document.slug))
        ?.total_passage_hits || 0;

    setState({
      passageMatches: matches,
      totalNoOfMatches: totalMatches,
    });
  }, [searchResultFamilies, document.slug]);

  const handlePassageClick = (pageNumber: number) => {
    if (!canPreview) return;
    setState({ pageNumber: pageNumber });
  };

  const handleToggleConcepts = () => {
    setShowConcepts((current) => !current);
  };

  const passagesResultsContext = getPassageResultsContext({
    isExactSearch: state.isExactSearch,
    passageMatches: state.totalNoOfMatches,
    queryTerm: initialQueryTerm,
    selectedTopics: selectedConcepts,
  });

  const isLoading = searchStatus !== "success";
  const hasConcepts = documentConcepts.length > 0;
  const hasSelectedConcepts = selectedConcepts.length > 0;
  const hasQuery = initialQueryTerm !== "" || hasSelectedConcepts;

  return (
    <section className="flex-1 flex" id="document-concepts-viewer">
      <FullWidth extraClasses="flex-1">
        <div id="document-container" className="flex flex-row flex-wrap lg:flex-nowrap lg:h-[80vh]">
          {/* Concepts */}
          {hasConcepts && (
            <SideCol id="document-concepts" extraClasses="w-full max-h-[80vh] md:!w-1/2 lg:!w-maxSidebar lg:max-h-full">
              <div className="py-4 md:hidden">
                <Button content="both" onClick={handleToggleConcepts}>
                  <span>{showConcepts ? "Hide" : "Show"} topics</span>
                  <div className={showConcepts ? "rotate-180" : ""}>
                    <Icon name="downChevron" />
                  </div>
                </Button>
              </div>
              <ConceptPicker
                concepts={documentConcepts}
                showSearch={false}
                title="In this document"
                containerClasses={`pt-4 pr-4 pl-4 md:pl-0 ${showConcepts ? "" : "hidden md:flex"}`}
              />
            </SideCol>
          )}

          {/* Preview */}
          <div
            id="document-preview"
            className={`flex-1 relative order-last border-t border-t-gray-200 h-[600px] basis-full lg:basis-auto lg:border-t-0 lg:order-none lg:h-full md:border-gray-200 ${hasConcepts ? "lg:border-x" : "lg:border-r"}`}
          >
            {canPreview && (
              <EmbeddedPDF
                document={document}
                documentPassageMatches={state.passageMatches}
                pageNumber={state.pageNumber}
                startingPassageIndex={initialPassage}
                searchStatus={searchStatus}
              />
            )}
            {!canPreview && <EmptyDocument />}
          </div>

          {/* Sidebar */}
          <div
            id="document-sidebar"
            className={`py-4 max-h-[80vh] md:w-1/2 lg:max-w-[480px] lg:min-w-[400px] lg:max-h-full lg:grow-0 lg:shrink-0 lg:pb-0 flex flex-col ${hasConcepts ? "lg:!max-w-[400px]" : ""} ${passageClasses(
              canPreview
            )}`}
          >
            {isLoading ? (
              <div className="w-full flex justify-center flex-1 bg-white">
                <Loader />
              </div>
            ) : (
              <>
                <div id="document-search" className="flex items-start gap-2 md:pl-4 pb-4 border-b border-gray-200">
                  <div className="flex-1">
                    {hasQuery && state.totalNoOfMatches > 0 && (
                      <>
                        <div className="mb-2 text-sm" data-cy="document-matches-description">
                          {passagesResultsContext}
                          {state.totalNoOfMatches >= MAX_RESULTS && (
                            <Info
                              className="inline-block ml-2 align-text-bottom"
                              description={`We limit the number of search results to ${MAX_RESULTS} so that you get the best performance from our tool. We're working on a way to remove this limit.`}
                            />
                          )}
                        </div>
                        <p className="text-sm">
                          Sorted by {getCurrentPassagesOrderChoice(router.query) === true ? "page number" : "search relevance"}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="relative z-10 flex justify-center">
                    <button
                      className={`px-1 py-0.5 -mt-0.5 rounded-md text-sm text-text-primary font-normal ${showSearchOptions ? "bg-surface-ui" : ""}`}
                      onClick={() => setShowSearchOptions(!showSearchOptions)}
                    >
                      Sort &amp; Display
                    </button>
                    <AnimatePresence initial={false}>
                      {showSearchOptions && (
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
                            setShowOptions={setShowSearchOptions}
                            handlePassagesOrderChange={handlePassagesOrderChange}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                {hasQuery && state.totalNoOfMatches > 0 && (
                  <div
                    id="document-passage-matches"
                    className="relative overflow-y-scroll scrollbar-thumb-gray-200 scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-500 md:pl-4"
                  >
                    {/* Removing active passage index for now as we don't use indexes any more //activeIndex={pageNumber ?? startingPassage} */}
                    <PassageMatches passages={state.passageMatches} onClick={handlePassageClick} />
                  </div>
                )}
                {hasQuery && state.totalNoOfMatches === 0 && <EmptyPassages hasQueryString />}
                {!hasQuery && <EmptyPassages hasQueryString={false} />}
              </>
            )}
          </div>
        </div>
      </FullWidth>
    </section>
  );
};
