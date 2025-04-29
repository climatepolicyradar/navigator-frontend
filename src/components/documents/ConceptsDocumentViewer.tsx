import { UnavailableConcepts } from "@/components/documents/UnavailableConcepts";
import EmbeddedPDF from "@/components/EmbeddedPDF";
import { SearchSettings } from "@/components/filters/SearchSettings";
import Loader from "@/components/Loader";
import PassageMatches from "@/components/PassageMatches";
import { SearchLimitTooltip } from "@/components/tooltip/SearchLimitTooltip";
import { MAX_PASSAGES, MAX_RESULTS } from "@/constants/paging";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { useEffectOnce } from "@/hooks/useEffectOnce";
import useSearch from "@/hooks/useSearch";
import { TConcept, TDocumentPage, TSearchResponse } from "@/types";
import { fetchAndProcessConcepts } from "@/utils/processConcepts";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { LuSettings2 } from "react-icons/lu";
import { Button } from "../atoms/button/Button";
import { Icon } from "../atoms/icon/Icon";
import { ConceptPicker } from "../organisms/ConceptPicker";
import { SideCol } from "../panels/SideCol";
import { EmptyDocument } from "./EmptyDocument";
import { EmptyPassages } from "./EmptyPassages";

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

const passageClasses = (canPreview: boolean) => {
  if (canPreview) {
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

  const [state, setState] = useReducer((prev: any, next: Partial<any>) => ({ ...prev, ...next }), {
    passageIndex: initialPassage,
    isExactSearch: initialExactMatch,
    passageMatches: [],
    totalNoOfMatches: 0,
  });

  const [familyConcepts, setFamilyConcepts] = useState<TConcept[]>([]);

  const canPreview = !!document.cdn_object && document.cdn_object.toLowerCase().endsWith(".pdf");

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
      [QUERY_PARAMS.query_string]: initialQueryTerm,
      [QUERY_PARAMS.exact_match]: state.isExactSearch ? "true" : "false",
      [QUERY_PARAMS.concept_name]: initialConceptFilters
        ? Array.isArray(initialConceptFilters)
          ? initialConceptFilters
          : [initialConceptFilters]
        : undefined,
    }),
    [initialQueryTerm, state.isExactSearch, initialConceptFilters]
  );

  const { status, families, searchQuery } = useSearch(
    searchQueryParams,
    null,
    document.import_id,
    !!(initialQueryTerm || initialConceptFilters),
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
      if (!canPreview) return;
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
  const hasPassages = state.totalNoOfMatches > 0;
  const hasQuery = initialQueryTerm !== "" || hasConcepts;
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
          className={`flex flex-col overflow-y-auto max-h-[90vh] mr-4 xl:mr-0 scrollbar-thumb-gray-200 scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-500 xl:max-h-full xl:max-w-[480px] xl:min-w-[400px] xl:grow-0 xl:shrink-0 ${passageClasses(canPreview)}`}
        >
          <div className="relative">
            <div className="flex justify-between p-4">
              <h1 className="text-base font-medium">Passage matches</h1>
              <button className="text-xl text-text-tertiary" onClick={() => setShowSearchOptions(!showSearchOptions)}>
                <LuSettings2 />
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
                    queryParams={searchQueryParams}
                    handleSearchChange={handleSemanticSearchChange}
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
              {hasConcepts && (
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

              {hasQuery &&
                (hasPassages ? (
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
