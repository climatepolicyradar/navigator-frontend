import { TConcept, TDocumentPage, TSearchResponse } from "@/types";
import EmbeddedPDF from "@/components/EmbeddedPDF";
import { FullWidth } from "@/components/panels/FullWidth";
import { EmptyDocument } from "./EmptyDocument";
import { LuSettings2 } from "react-icons/lu";
import { AnimatePresence } from "framer-motion";
import { UnavailableConcepts } from "@/components/documents/UnavailableConcepts";
import PassageMatches from "@/components/PassageMatches";
import { SearchLimitTooltip } from "@/components/tooltip/SearchLimitTooltip";
import { EmptyPassages } from "./EmptyPassages";
import { motion } from "framer-motion";
import React, { useEffect, useState, useCallback, useMemo, useReducer } from "react";
import useSearch from "@/hooks/useSearch";
import { fetchAndProcessConcepts } from "@/utils/processConcepts";
import { useEffectOnce } from "@/hooks/useEffectOnce";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { MAX_PASSAGES, MAX_RESULTS } from "@/constants/paging";
import { SearchSettings } from "@/components/filters/SearchSettings";
import Loader from "@/components/Loader";
import { SideCol } from "../panels/SideCol";
import { ConceptPicker } from "../organisms/ConceptPicker";
import { Button } from "../atoms/button/Button";
import { Icon } from "../atoms/icon/Icon";

type TProps = {
  initialQueryTerm?: string | string[];
  initialExactMatch?: boolean;
  initialPassage?: number;
  initialConceptFilters?: string[];
  vespaFamilyData: TSearchResponse;
  vespaDocumentData: TSearchResponse;
  document: TDocumentPage;
  familySlug: string;
  // Callback props for state changes
  onExactMatchChange?: (isExact: boolean) => void;
};

const passageClasses = (docType: string) => {
  if (docType === "application/pdf") {
    return "xl:w-1/3";
  }
  return "xl:w-2/3";
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
  familySlug,
  vespaFamilyData,
  vespaDocumentData,
  onExactMatchChange,
}: TProps) => {
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [showConcepts, setShowConcepts] = useState(false);

  const getQueryTerm = (term: string | string[]) => (Array.isArray(term) ? term[0] : term || "");

  const [state, setState] = useReducer((prev: any, next: Partial<any>) => ({ ...prev, ...next }), {
    passageIndex: initialPassage,
    isExactSearch: initialExactMatch,
    queryTerm: getQueryTerm(initialQueryTerm),
    passageMatches: [],
    totalNoOfMatches: 0,
  });

  // Run a new query if the initial query changes (likely a query param change)
  useEffect(() => {
    const newQueryTerm = getQueryTerm(initialQueryTerm);
    setState({ queryTerm: newQueryTerm });
  }, [initialQueryTerm]);

  const [familyConcepts, setFamilyConcepts] = useState<TConcept[]>([]);

  const canPreview = document.content_type === "application/pdf";

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

  // Check if any initial concept filters are not in the document concepts (e.g., the concept appears in the family or other documents
  // but not this one)
  const unavailableConcepts = initialConceptFilters
    ? initialConceptFilters.filter((filter) => !documentConcepts?.some((concept) => concept.preferred_label === filter))
    : [];

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

  const handleToggleConcepts = () => {
    setShowConcepts((current) => !current);
  };

  if (!documentConcepts.length) return;

  const isLoading = status !== "success";
  const hasConcepts = selectedConcepts.length > 0;
  const showPassages = initialQueryTerm !== "" && state.totalNoOfMatches > 0;
  const hasNoPassages = !showPassages || (state.totalNoOfMatches === 0 && unavailableConcepts.length === 0);
  const hasUnavailableConcepts = state.totalNoOfMatches === 0 && unavailableConcepts.length > 0;

  return (
    <section className="flex-1 xl:px-5" id="document-concepts-viewer">
      <div id="document-container" className="flex flex-col xl:flex-row xl:h-[90vh]">
        {/* Concepts */}
        <SideCol id="document-concepts" extraClasses="!w-full xl:!w-maxSidebar">
          <div className="p-4 xl:hidden">
            <Button content="both" onClick={handleToggleConcepts}>
              <span>{showConcepts ? "Hide" : "Show"} concepts</span>
              <div className={showConcepts ? "rotate-180" : ""}>
                <Icon name="downChevron" />
              </div>
            </Button>
          </div>
          <ConceptPicker
            concepts={documentConcepts}
            showSearch={false}
            title={<p className="text-base font-medium">In this document</p>}
            containerClasses={`pt-4 pr-4 pl-4 xl:pl-0 ${showConcepts ? "" : "hidden xl:flex"}`}
          />
        </SideCol>

        {/* Preview */}
        <div
          id="document-preview"
          className={`flex-1 order-last xl:order-none h-[400px] basis-[400px] xl:block xl:h-full xl:border-x xl:border-x-gray-200 px-4 xl:px-0`}
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
            document.content_type
          )}`}
        >
          <div className="flex justify-between p-4">
            <h1 className="text-base font-medium">Passage matches</h1>
            <button className="text-xl text-text-tertiary" onClick={() => setShowSearchOptions(!showSearchOptions)}>
              <LuSettings2 />
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

          {isLoading ? (
            <div className="w-full flex justify-center flex-1">
              <Loader />
            </div>
          ) : (
            <>
              {hasConcepts && !hasNoPassages && (
                <div className="px-4">
                  {selectedConcepts.map((concept) => (
                    <React.Fragment key={concept.wikibase_id}>
                      <p className="mt-4 my-2 capitalize text-[15px] font-medium text-neutral-800 text-base leading-normal flex-grow">
                        {concept.preferred_label}
                      </p>
                      <p className="mt-2 my-4">{concept.description}</p>
                    </React.Fragment>
                  ))}
                </div>
              )}

              {showPassages && (
                <>
                  <div className="border-gray-200 p-4 text-sm border-b xl:pl-4" data-cy="document-matches-description">
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
                    className="relative xl:overflow-y-scroll scrollbar-thumb-gray-200 scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-500 px-4"
                  >
                    <PassageMatches passages={state.passageMatches} onClick={handlePassageClick} activeIndex={state.passageIndex ?? initialPassage} />
                  </div>
                </>
              )}

              {hasNoPassages && (
                <EmptyPassages
                  hasQueryString={
                    !!searchQueryParams[QUERY_PARAMS.query_string] &&
                    !!searchQueryParams[QUERY_PARAMS.concept_id] &&
                    !!searchQueryParams[QUERY_PARAMS.concept_name]
                  }
                />
              )}

              {hasUnavailableConcepts && <UnavailableConcepts unavailableConcepts={unavailableConcepts} familySlug={familySlug} />}
            </>
          )}
        </div>
      </div>
    </section>
  );
};
