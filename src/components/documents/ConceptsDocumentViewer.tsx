import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";

import EmbeddedPDF from "@/components/EmbeddedPDF";
import Loader from "@/components/Loader";
import PassageMatches from "@/components/PassageMatches";
import { Button } from "@/components/atoms/button/Button";
import { Icon } from "@/components/atoms/icon/Icon";
import { EmptyDocument } from "@/components/documents/EmptyDocument";
import { EmptyPassages } from "@/components/documents/EmptyPassages";
import { UnavailableConcepts } from "@/components/documents/UnavailableConcepts";
import { SearchSettings } from "@/components/filters/SearchSettings";
import { MAX_RESULTS } from "@/constants/paging";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { useEffectOnce } from "@/hooks/useEffectOnce";
import { TConcept, TDocumentPage, TLoadingStatus, TMatchedFamily, TPassage, TSearchResponse } from "@/types";
import { getPassageResultsContext } from "@/utils/getPassageResultsContext";
import { fetchAndProcessConcepts } from "@/utils/processConcepts";

import { Info } from "../molecules/info/Info";
import { ConceptPicker } from "../organisms/ConceptPicker";
import { SideCol } from "../panels/SideCol";

type TState = {
  passageIndex: number;
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
  familySlug: string;
  searchStatus: TLoadingStatus;
  searchResultFamilies: TMatchedFamily[];
  // Callback props for state changes
  onExactMatchChange?: (isExact: boolean) => void;
}

const passageClasses = (canPreview: boolean) => {
  if (canPreview) {
    return "xl:w-1/3";
  }
  return "xl:w-2/3";
};

export const ConceptsDocumentViewer = ({
  initialQueryTerm = "",
  initialExactMatch = false,
  initialPassage = 0,
  initialConceptFilters,
  document,
  familySlug,
  vespaFamilyData,
  vespaDocumentData,
  searchStatus,
  searchResultFamilies,
  onExactMatchChange,
}: IProps) => {
  const router = useRouter();
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [showConcepts, setShowConcepts] = useState(false);

  const [state, setState] = useReducer((prev: TState, next: Partial<TState>) => ({ ...prev, ...next }), {
    passageIndex: initialPassage,
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

  // Check if any initial concept filters are not in the document concepts
  // (e.g., the concept appears in the family or other documents but not this one)
  const unavailableConcepts = initialConceptFilters
    ? initialConceptFilters.filter((filter) => !documentConcepts?.some((concept) => concept.preferred_label === filter))
    : [];

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

  const handlePassageClick = (index: number) => {
    if (!canPreview) return;
    setState({ passageIndex: index });
  };

  const handleSemanticSearchChange = (_: string, isExact: string) => {
    const exactBool = isExact === "true";
    setState({
      isExactSearch: exactBool,
      passageIndex: 0,
    });
    setShowSearchOptions(false);
    onExactMatchChange?.(exactBool);
  };

  const handleToggleConcepts = () => {
    setShowConcepts((current) => !current);
  };

  const handlePassagesOrderChange = (orderValue: string) => {
    setState({ passageIndex: 0 });
    const queryObj = { ...router.query };
    queryObj[QUERY_PARAMS.passages_by_position] = orderValue;
    router.push({ query: queryObj }, undefined, { shallow: true });
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
  const hasPassages = state.totalNoOfMatches > 0;
  const hasQuery = initialQueryTerm !== "" || hasSelectedConcepts;
  const hasUnavailableConcepts = state.totalNoOfMatches === 0 && unavailableConcepts.length > 0;

  return (
    <section className="flex-1 xl:px-5" id="document-concepts-viewer">
      <div id="document-container" className="flex flex-col xl:flex-row xl:h-[90vh]">
        {/* Concepts */}
        {hasConcepts && (
          <SideCol id="document-concepts" extraClasses="!w-full xl:!w-maxSidebar">
            <div className="p-4 xl:hidden">
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
              containerClasses={`pt-4 pr-4 pl-4 xl:pl-0 ${showConcepts ? "" : "hidden xl:flex"}`}
            />
          </SideCol>
        )}

        {/* Preview */}
        <div
          id="document-preview"
          className={`flex-1 order-last xl:order-none h-[400px] basis-[400px] xl:block xl:h-full xl:border-gray-200 px-4 xl:px-0 ${
            hasConcepts ? "xl:border-x" : "xl:border-r"
          }`}
        >
          {canPreview && (
            <EmbeddedPDF
              document={document}
              documentPassageMatches={state.passageMatches}
              passageIndex={state.passageIndex}
              startingPassageIndex={initialPassage}
            />
          )}
          {!canPreview && <EmptyDocument />}
        </div>

        {/* Sidebar */}
        <div
          id="document-sidebar"
          className={`flex flex-col overflow-y-auto max-h-[90vh] mr-4 xl:mr-0 scrollbar-thumb-gray-200 scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-500 xl:max-h-full xl:max-w-[480px] xl:min-w-[400px] xl:grow-0 xl:shrink-0 ${passageClasses(
            canPreview
          )}`}
        >
          <div className="relative">
            <div className="flex justify-between items-end p-4">
              <h1 className="text-base font-medium">Passage matches</h1>
              <button
                className={`px-1 py-0.5 -mt-0.5 rounded-md text-sm text-text-primary font-normal ${showSearchOptions ? "bg-surface-ui" : ""}`}
                onClick={() => setShowSearchOptions(!showSearchOptions)}
              >
                Sort &amp; Display
              </button>
            </div>
            <AnimatePresence initial={false}>
              {showSearchOptions && (
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
                    handlePassagesClick={handlePassagesOrderChange}
                    setShowOptions={setShowSearchOptions}
                    extraClasses="!mt-0 mr-4"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isLoading && (
            <div className="w-full flex justify-center flex-1">
              <Loader />
            </div>
          )}

          {!isLoading && (
            <>
              {hasQuery &&
                (hasPassages ? (
                  <>
                    <div className="border-gray-200 p-4 text-sm border-b xl:pl-4" data-cy="document-matches-description">
                      <p className="mb-2">
                        {passagesResultsContext}
                        {state.totalNoOfMatches >= MAX_RESULTS && (
                          <Info
                            className="inline-block ml-2 align-text-bottom"
                            description={`We limit the number of search results to ${MAX_RESULTS} so that you get the best performance from our tool. We're working on a way to remove this limit.`}
                          />
                        )}
                      </p>
                    </div>
                    <div
                      id="document-passage-matches"
                      className="relative xl:overflow-y-scroll scrollbar-thumb-gray-200 scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-500 px-4"
                    >
                      <PassageMatches
                        passages={state.passageMatches}
                        onClick={handlePassageClick}
                        activeIndex={state.passageIndex ?? initialPassage}
                      />
                    </div>
                  </>
                ) : (
                  <EmptyPassages hasQueryString />
                ))}

              {!hasQuery && <EmptyPassages hasQueryString={false} />}

              {hasUnavailableConcepts && <UnavailableConcepts unavailableConcepts={unavailableConcepts} familySlug={familySlug} />}
            </>
          )}
        </div>
      </div>
    </section>
  );
};
