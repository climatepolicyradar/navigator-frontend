import EmbeddedPDF from "@components/EmbeddedPDF";
import { FullWidth } from "@components/panels/FullWidth";
import { TConcept, TDocumentPage, TPassage } from "@types";
import { EmptyDocument } from "./EmptyDocument";
import Link from "next/link";
import Button from "@components/buttons/Button";
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
import { HiOutlineFilter } from "react-icons/hi";
import { ConceptsPanel } from "@components/concepts/ConceptsPanel";
import { Popover } from "@components/popover/Popover";

type TProps = {
  initialQueryTerm?: string | string[];
  initialExactMatch?: boolean;
  initialPassage?: number;
  initialConceptFilters?: string[];
  concepts: TConcept[];
  rootConcepts: TConcept[];
  conceptCounts: { conceptKey: string; count: number }[];
  document: TDocumentPage;

  // Callback props for state changes
  onQueryTermChange?: (queryTerm: string) => void;
  onExactMatchChange?: (isExact: boolean) => void;
  onConceptClick?: (conceptLabel: string) => void;
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
  concepts,
  rootConcepts,
  conceptCounts,
  document,
  onQueryTermChange,
  onExactMatchChange,
  onConceptClick,
}: TProps) => {
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [showConceptFilter, setShowConceptFilter] = useState(false);

  const [state, setState] = useReducer((prev: any, next: Partial<any>) => ({ ...prev, ...next }), {
    passageIndex: initialPassage,
    isExactSearch: initialExactMatch,
    queryTerm: Array.isArray(initialQueryTerm) ? initialQueryTerm[0] : initialQueryTerm || "",
    passageMatches: [],
    totalNoOfMatches: 0,
  });

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
      [QUERY_PARAMS.exact_match]: state.isExactSearch ? "true" : undefined,
      [QUERY_PARAMS.concept_name]: initialConceptFilters
        ? Array.isArray(initialConceptFilters)
          ? initialConceptFilters
          : [initialConceptFilters]
        : undefined,
    }),
    [state.queryTerm, state.isExactSearch, initialConceptFilters]
  );

  const { families, searchQuery } = useSearch(
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
      onExactMatchChange?.(exactBool);
    },
    [onExactMatchChange]
  );

  const handleClearSearch = useCallback(() => {
    setState({
      queryTerm: "",
      isExactSearch: false,
    });
    onQueryTermChange?.("");
    onExactMatchChange?.(false);
  }, [onQueryTermChange, onExactMatchChange]);

  return (
    <>
      {concepts.length > 0 && (
        <section className="flex-1 flex" id="document-concepts-viewer">
          <FullWidth extraClasses="flex-1">
            <div id="document-container" className="flex flex-col md:flex-row md:h-[80vh]">
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
                className={`overflow-y-scroll py-4 order-first max-h-[90vh] md:order-last md:max-h-full md:max-w-[480px] md:min-w-[400px] md:grow-0 md:shrink-0 flex flex-col ${passageClasses(
                  document.content_type
                )}`}
              >
                <div id="document-search" className="flex flex-col gap-2 md:pl-4">
                  {(selectedConcepts.length > 0 || initialQueryTerm) && (
                    <div className="flex gap-2">
                      <Link className="capitalize hover:no-underline" href={`/documents/${document.slug}`} onClick={handleClearSearch}>
                        <Button
                          color="dark-dark"
                          data-cy="view-document-viewer-concept"
                          extraClasses="flex items-center text-[14px] font-normal pt-1 pb-1 bg-black text-white border-none"
                        >
                          ← Back
                        </Button>
                      </Link>
                    </div>
                  )}

                  {
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
                  }

                  {selectedConcepts.length === 0 && !initialQueryTerm && (
                    <ConceptsPanel
                      rootConcepts={rootConcepts}
                      concepts={concepts}
                      conceptCountsById={conceptCountsById}
                      onConceptClick={onConceptClick}
                    ></ConceptsPanel>
                  )}

                  {selectedConcepts.length > 0 && (
                    <div className="pt-6 pb-6">
                      <p className="mb-2 capitalize text-[15px] font-bold text-inputSelected text-neutral-800 text-base font-medium leading-normal flex-grow">
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
              </div>
            </div>
          </FullWidth>
        </section>
      )}
    </>
  );
};
