import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useMemo, useReducer, useState } from "react";

import EmbeddedPDF from "@/components/EmbeddedPDF";
import Loader from "@/components/Loader";
import PassageMatches from "@/components/PassageMatches";
import { Button } from "@/components/atoms/button/Button";
import { Icon } from "@/components/atoms/icon/Icon";
import { EmptyDocument } from "@/components/documents/EmptyDocument";
import { EmptyPassages } from "@/components/documents/EmptyPassages";
import { SearchSettings } from "@/components/filters/SearchSettings";
import { Info } from "@/components/molecules/info/Info";
import { ConceptPicker } from "@/components/organisms/ConceptPicker";
import { FullWidth } from "@/components/panels/FullWidth";
import { SideCol } from "@/components/panels/SideCol";
import { MAX_RESULTS } from "@/constants/paging";
import { SEARCH_PASSAGE_ORDER } from "@/constants/searchPassagesOrder";
import { SEARCH_SETTINGS } from "@/constants/searchSettings";
import { TopicsContext } from "@/context/TopicsContext";
import { TTopic, TDocumentPage, TLoadingStatus, TMatchedFamily, TPassage, TSearchResponse } from "@/types";
import { getCurrentSearchChoice } from "@/utils/getCurrentSearchChoice";
import { getPassageResultsContext } from "@/utils/getPassageResultsContext";
import { getCurrentPassagesOrderChoice } from "@/utils/getPassagesSortOrder";

type TState = {
  pageNumber: number;
  passageMatches: TPassage[];
  totalNoOfMatches: number;
};

interface IProps {
  initialQueryTerm?: string | string[];
  initialExactMatch?: boolean;
  initialPageNumber?: number;
  initialConceptFilters?: string[];
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

const SETTINGS_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, transition: { duration: 0.1 } },
  visible: { opacity: 1, transition: { duration: 0 } },
};

export const ConceptsDocumentViewer = ({
  initialQueryTerm = "",
  initialExactMatch,
  initialPageNumber,
  initialConceptFilters,
  document,
  vespaDocumentData,
  searchStatus,
  searchResultFamilies,
  handleSemanticSearchChange,
  handlePassagesOrderChange,
}: IProps) => {
  const router = useRouter();
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showConcepts, setShowConcepts] = useState(false);
  const { topics: familyTopics } = useContext(TopicsContext);

  const [state, setState] = useReducer((prev: TState, next: Partial<TState>) => ({ ...prev, ...next }), {
    pageNumber: initialPageNumber,
    passageMatches: [],
    totalNoOfMatches: 0,
  });

  const canPreview = !!document.cdn_object && document.cdn_object.toLowerCase().endsWith(".pdf");

  const documentConcepts: TTopic[] = useMemo(() => {
    const uniqueConceptMap = new Map<string, { concept: TTopic; count: number }>();

    (vespaDocumentData?.families ?? []).forEach((family) => {
      family.hits.forEach((hit) => {
        Object.entries(hit.concept_counts ?? {}).forEach(([conceptKey, count]) => {
          const [conceptId] = conceptKey.split(":");
          const matchingConcept = familyTopics.find((concept) => concept.wikibase_id === conceptId);

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
  }, [vespaDocumentData, familyTopics]);

  const selectedConcepts = useMemo(
    () =>
      initialConceptFilters
        ? familyTopics.filter((concept) =>
            (Array.isArray(initialConceptFilters) ? initialConceptFilters : [initialConceptFilters]).includes(concept.preferred_label)
          )
        : [],
    [initialConceptFilters, familyTopics]
  );

  // Calculate passage matches.
  useEffect(() => {
    let matches = searchResultFamilies.flatMap((family) =>
      family.family_documents.filter((cacheDoc) => cacheDoc.document_slug === document.slug).flatMap((cacheDoc) => cacheDoc.document_passage_matches)
    );

    let totalMatches =
      searchResultFamilies.find((family) => family.family_documents.some((cacheDoc) => cacheDoc.document_slug === document.slug))
        ?.total_passage_hits || 0;
    //  ___   ___   ______   _________  ______   ________  __     __
    // /__/\ /__/\ /_____/\ /________/\/_____/\ /_______/\/__/\ /__/\
    // \::\ \\  \ \\:::_ \ \\__.::.__\/\::::_\/_\__.::._\/\ \::\\:.\ \
    //  \::\/_\ .\ \\:\ \ \ \  \::\ \   \:\/___/\  \::\ \  \_\::_\:_\/
    //   \:: ___::\ \\:\ \ \ \  \::\ \   \:::._\/  _\::\ \__ _\/__\_\_/\
    //    \: \ \\::\ \\:\_\ \ \  \::\ \   \:\ \   /__\::\__/\\ \ \ \::\ \
    //     \__\/ \::\/ \_____\/   \__\/    \_\/   \________\/ \_\/  \__\/
    // HOTFIX - slug mismatch can happen between RDS and Vespa when document titles are updated
    // TODO: delete / figure this out later but for now a temporary solution is to check against the source url as that is relatively unchanging
    if (!matches.length) {
      matches = searchResultFamilies.flatMap((family) =>
        family.family_documents
          .filter((cacheDoc) => cacheDoc.document_source_url === document.source_url)
          .flatMap((cacheDoc) => cacheDoc.document_passage_matches)
      );

      totalMatches =
        searchResultFamilies.find((family) => family.family_documents.some((cacheDoc) => cacheDoc.document_source_url === document.source_url))
          ?.total_passage_hits || 0;
    }

    setState({
      passageMatches: matches,
      totalNoOfMatches: totalMatches,
    });
  }, [searchResultFamilies, document.slug, document.source_url]);

  const handlePassageClick = (pageNumber: number) => {
    if (!canPreview) return;
    setState({ pageNumber: pageNumber });
  };

  const handleToggleConcepts = () => {
    setShowConcepts((current) => !current);
  };

  const passagesResultsContext = getPassageResultsContext({
    isExactSearch: initialExactMatch,
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
                showBadge
                showSearch={false}
                title="In this document"
                containerClasses={`pt-4 pr-4 pl-4 md:pl-0 ${showConcepts ? "" : "hidden md:flex"}`}
              />
            </SideCol>
          )}

          {/* Preview */}
          <div
            id="document-preview"
            className={`flex-1 relative order-last border-t border-t-gray-200 h-[600px] basis-full lg:basis-auto lg:border-t-0 lg:order-none lg:h-full md:border-gray-300 ${hasConcepts ? "lg:border-x" : "lg:border-r"}`}
          >
            {canPreview && (
              <EmbeddedPDF
                document={document}
                documentPassageMatches={state.passageMatches}
                pageNumber={state.pageNumber}
                startingPageNumber={initialPageNumber}
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
                <div id="document-search" className="flex flex-col gap-2 md:pl-4 pb-4 border-b border-gray-300">
                  <p className="text-text-primary">Passage matches</p>
                  <div className="relative z-10 flex gap-4">
                    <div className="relative">
                      <button
                        className={`flex items-center gap-1 px-2 py-1 -mt-1 -ml-2 rounded-md text-sm text-text-primary font-normal ${showSearchOptions ? "bg-surface-ui" : ""}`}
                        onClick={() => setShowSearchOptions(!showSearchOptions)}
                      >
                        <span className="font-bold">Search:</span>{" "}
                        <span>{getCurrentSearchChoice(router.query) === "true" ? SEARCH_SETTINGS.exact : SEARCH_SETTINGS.semantic}</span>
                        <ChevronDown />
                      </button>
                      <AnimatePresence initial={false}>
                        {showSearchOptions && (
                          <motion.div key="content" initial="collapsed" animate="open" exit="collapsed" variants={SETTINGS_ANIMATION_VARIANTS}>
                            <SearchSettings
                              queryParams={router.query}
                              handleSearchChange={handleSemanticSearchChange}
                              setShowOptions={setShowSearchOptions}
                              extraClasses="w-[280px]"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="relative">
                      <button
                        className={`flex items-center gap-1 px-2 py-1 -mt-1 -ml-2 rounded-md text-sm text-text-primary font-normal ${showSortOptions ? "bg-surface-ui" : ""}`}
                        onClick={() => setShowSortOptions(!showSortOptions)}
                      >
                        <span className="font-bold">Order:</span>{" "}
                        <span>
                          {getCurrentPassagesOrderChoice(router.query) === true ? SEARCH_PASSAGE_ORDER.page : SEARCH_PASSAGE_ORDER.relevance}
                        </span>
                        <ChevronDown />
                      </button>
                      <AnimatePresence initial={false}>
                        {showSortOptions && (
                          <motion.div key="content" initial="collapsed" animate="open" exit="collapsed" variants={SETTINGS_ANIMATION_VARIANTS}>
                            <SearchSettings
                              queryParams={router.query}
                              setShowOptions={setShowSortOptions}
                              handlePassagesOrderChange={handlePassagesOrderChange}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="">
                    {hasQuery && (
                      <>
                        <div className="flex flex-wrap mb-2 text-sm" data-cy="document-matches-description">
                          {passagesResultsContext}
                          {state.totalNoOfMatches >= MAX_RESULTS && (
                            <Info
                              className="inline-block ml-2 align-text-bottom"
                              description={`We limit the number of search results to ${MAX_RESULTS} so that you get the best performance from our tool. We're working on a way to remove this limit.`}
                            />
                          )}
                        </div>
                        {state.totalNoOfMatches > 0 && (
                          <>
                            <p className="text-sm">
                              Sorted by {getCurrentPassagesOrderChoice(router.query) === true ? "page number" : "search relevance"}
                            </p>
                          </>
                        )}
                      </>
                    )}
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
