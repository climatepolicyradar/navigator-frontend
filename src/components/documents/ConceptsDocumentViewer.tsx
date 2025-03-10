import EmbeddedPDF from "@components/EmbeddedPDF";
import { FullWidth } from "@components/panels/FullWidth";
import { TConcept, TDocumentPage, TSearchResponse } from "@types";
import { EmptyDocument } from "./EmptyDocument";
import { Button } from "@components/atoms/button/Button";
import SearchForm from "@components/forms/SearchForm";
import { MdOutlineTune } from "react-icons/md";
import { AnimatePresence } from "framer-motion";
import PassageMatches from "@components/PassageMatches";
import { SearchLimitTooltip } from "@components/tooltip/SearchLimitTooltip";
import { EmptyPassages } from "./EmptyPassages";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback, useMemo, useReducer } from "react";
import { SearchSettings } from "@components/filters/SearchSettings";
import { QUERY_PARAMS } from "@constants/queryParams";
import { MAX_PASSAGES, MAX_RESULTS } from "@constants/paging";
import useSearch from "@hooks/useSearch";
import { ConceptsPanel } from "@components/concepts/ConceptsPanel";
import { fetchAndProcessConcepts } from "@utils/processConcepts";
import { useEffectOnce } from "@hooks/useEffectOnce";
import Loader from "@components/Loader";

type TProps = {
  initialQueryTerm?: string | string[];
  initialExactMatch?: boolean;
  initialPassage?: number;
  initialConceptFilters?: string[];
  vespaFamilyData: TSearchResponse;
  document: TDocumentPage;

  // Callback props for state changes
  onQueryTermChange?: (queryTerm: string) => void;
  onExactMatchChange?: (isExact: boolean) => void;
  onConceptClick?: (conceptLabel: string) => void;
  onClear?: () => void;
};

const passageClasses = (docType: string) => {
  if (docType === "application/pdf") {
    return "md:w-1/3";
  }
  return "md:w-2/3";
};

const renderPassageCount = (count: number): string => {
  return count > MAX_PASSAGES ? `top ${MAX_PASSAGES} matches` : count + ` match${count > 1 ? "es" : ""}`;
};

export const ConceptsDocumentViewer = ({
  initialQueryTerm = "",
  initialExactMatch = false,
  initialPassage = 0,
  initialConceptFilters,
  document,
  vespaFamilyData,
  onQueryTermChange,
  onExactMatchChange,
  onConceptClick,
  onClear,
}: TProps) => {
  const [showSearchOptions, setShowSearchOptions] = useState(false);

  const [state, setState] = useReducer((prev: any, next: Partial<any>) => ({ ...prev, ...next }), {
    passageIndex: initialPassage,
    isExactSearch: initialExactMatch,
    queryTerm: Array.isArray(initialQueryTerm) ? initialQueryTerm[0] : initialQueryTerm || "",
    passageMatches: [],
    totalNoOfMatches: 0,
  });

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

  const canPreview = document.content_type === "application/pdf";
  const conceptCountsById = useMemo(
    () =>
      conceptCounts.reduce(
        (acc, { conceptKey, count }) => {
          const conceptId = conceptKey.split(":")[0];
          acc[conceptId] = count;
          return acc;
        },
        {} as Record<string, number>
      ),
    [conceptCounts]
  );

  useEffectOnce(() => {
    const conceptIds = conceptCounts.map(({ conceptKey }) => conceptKey.split(":")[0]);

    fetchAndProcessConcepts(conceptIds).then(({ rootConcepts, concepts }) => {
      setRootConcepts(rootConcepts);
      setConcepts(concepts);
    });
  });

  // Dynamically filter concepts based on router concept params.
  const selectedConcepts = useMemo(
    () =>
      initialConceptFilters
        ? concepts.filter((concept) =>
            (Array.isArray(initialConceptFilters) ? initialConceptFilters : [initialConceptFilters]).includes(concept.preferred_label)
          )
        : [],
    [initialConceptFilters, concepts]
  );

  // Prepare search.
  const searchQueryParams = useMemo(
    () => ({
      [QUERY_PARAMS.query_string]: state.queryTerm,
      [QUERY_PARAMS.exact_match]: state.isExactSearch ? "true" : "false",
      [QUERY_PARAMS.concept_name]: initialConceptFilters
        ? Array.isArray(initialConceptFilters)
          ? initialConceptFilters
          : [initialConceptFilters]
        : undefined,
    }),
    [state.queryTerm, state.isExactSearch, initialConceptFilters]
  );

  const { status, families, searchQuery } = useSearch(
    searchQueryParams,
    null,
    document.import_id,
    !!(state.queryTerm || initialConceptFilters),
    MAX_PASSAGES
  );

  // Calculate passage matches.
  useEffect(() => {
    const matches = families.flatMap((family) =>
      family.family_documents.filter((cacheDoc) => cacheDoc.document_slug === document.slug).flatMap((cacheDoc) => cacheDoc.document_passage_matches)
    );

    const totalMatches =
      families.find((family) => family.family_documents.some((cacheDoc) => cacheDoc.document_slug === document.slug))?.total_passage_hits || 0;

    setState({
      passageMatches: matches,
      totalNoOfMatches: totalMatches,
    });
  }, [families, document.slug]);

  const handlePassageClick = useCallback(
    (index: number) => {
      if (document.content_type !== "application/pdf") return;
      setState({ passageIndex: index });
    },
    [document.content_type]
  );

  const handleSearchInput = useCallback(
    (term: string) => {
      setState({ queryTerm: term });
      onQueryTermChange?.(term);
    },
    [onQueryTermChange]
  );

  const handleSemanticSearchChange = useCallback(
    (_: string, isExact: string) => {
      const exactBool = isExact === "true";
      setState({
        isExactSearch: exactBool,
        passageIndex: 0,
      });
      setShowSearchOptions(false);
      onExactMatchChange?.(exactBool);
    },
    [onExactMatchChange]
  );

  const handleClearSearch = useCallback(() => {
    setState({
      passageMatches: [],
      totalNoOfMatches: 0,
      passageIndex: 0,
      queryTerm: "",
      isExactSearch: false,
    });
    onClear();
  }, [onClear]);

  return (
    <>
      {concepts.length > 0 && (
        <section className="flex-1 flex" id="document-concepts-viewer">
          <FullWidth extraClasses="flex-1">
            <div id="document-container" className="flex flex-col md:flex-row md:h-[90vh]">
              <div id="document-preview" className={`pt-4 flex-1 h-[400px] basis-[400px] md:block md:h-full md:border-r md:border-r-gray-200`}>
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
              <div
                id="document-sidebar"
                className={`flex flex-col overflow-y-auto py-4 order-first max-h-[90vh] scrollbar-thumb-gray-200 scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-500 md:order-last md:max-h-full md:max-w-[480px] md:min-w-[400px] md:grow-0 md:shrink-0 ${passageClasses(
                  document.content_type
                )}`}
              >
                <div id="document-search" className="flex flex-col gap-2 md:pl-4">
                  {(selectedConcepts.length > 0 || initialQueryTerm) && (
                    <div className="flex gap-2">
                      <Button rounded color="mono" size="small" data-cy="view-document-viewer-concept" onClick={handleClearSearch}>
                        ← Back
                      </Button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <SearchForm
                        placeholder="Search document text"
                        handleSearchInput={handleSearchInput}
                        input={state.queryTerm as string}
                        size="default"
                      />
                    </div>
                    <div className="relative z-10 flex justify-center">
                      <button
                        className="px-4 flex justify-center items-center text-textDark text-xl"
                        onClick={() => setShowSearchOptions(!showSearchOptions)}
                      >
                        <MdOutlineTune />
                      </button>
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
                              queryParams={searchQueryParams}
                              handleSearchChange={handleSemanticSearchChange}
                              setShowOptions={setShowSearchOptions}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {selectedConcepts.length === 0 && !initialQueryTerm && (
                    <ConceptsPanel
                      rootConcepts={rootConcepts}
                      concepts={concepts}
                      conceptCountsById={conceptCountsById}
                      onConceptClick={onConceptClick}
                      showCounts={false}
                    ></ConceptsPanel>
                  )}

                  {selectedConcepts.length > 0 && (
                    <div className="pt-6 pb-6">
                      <p className="mb-2 capitalize text-[15px] font-medium text-neutral-800 text-base leading-normal flex-grow">
                        {selectedConcepts.map((concept) => concept.preferred_label).join(", ")}
                      </p>
                      {selectedConcepts.map((concept) => (
                        <p key={concept.wikibase_id} className="pt-1 pb-1">
                          {concept.description}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {status !== "success" ? (
                  <div className="w-full flex justify-center flex-1 bg-white">
                    <Loader />
                  </div>
                ) : (
                  <>
                    {state.totalNoOfMatches > 0 && (
                      <>
                        <div className="border-gray-200 my-4 text-sm pb-4 border-b md:pl-4" data-cy="document-matches-description">
                          <div className="mb-2">
                            Displaying {renderPassageCount(state.totalNoOfMatches)}{" "}
                            {initialQueryTerm && (
                              <>
                                for "<span className="text-textDark font-medium">{`${initialQueryTerm}`}</span>"
                              </>
                            )}
                            {initialQueryTerm && !searchQuery.exact_match && ` and related phrases`}
                            {selectedConcepts.length > 0 && (
                              <>
                                {" in "}
                                <b>{selectedConcepts.map((concept) => concept.preferred_label).join(", ")}</b>
                              </>
                            )}
                            {state.totalNoOfMatches >= MAX_RESULTS && (
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
                          <PassageMatches
                            passages={state.passageMatches}
                            onClick={handlePassageClick}
                            activeIndex={state.passageIndex ?? initialPassage}
                          />
                        </div>
                      </>
                    )}

                    {state.totalNoOfMatches === 0 && (
                      <EmptyPassages
                        hasQueryString={
                          !!searchQueryParams[QUERY_PARAMS.query_string] &&
                          !!searchQueryParams[QUERY_PARAMS.concept_id] &&
                          !!searchQueryParams[QUERY_PARAMS.concept_name]
                        }
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </FullWidth>
        </section>
      )}
    </>
  );
};
