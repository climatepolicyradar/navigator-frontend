import EmbeddedPDF from "@components/EmbeddedPDF";
import { FullWidth } from "@components/panels/FullWidth";
import { TConcept, TDocumentPage, TPassage } from "@types";
import { EmptyDocument } from "./EmptyDocument";
import Link from "next/link";
import Button from "@components/buttons/Button";
import SearchForm from "@components/forms/SearchForm";
import { MdOutlineTune } from "react-icons/md";
import { AnimatePresence } from "framer-motion";
import { Heading } from "@components/typography/Heading";
import { ExternalLink } from "@components/ExternalLink";
import PassageMatches from "@components/PassageMatches";
import { SearchLimitTooltip } from "@components/tooltip/SearchLimitTooltip";
import { EmptyPassages } from "./EmptyPassages";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback, useMemo } from "react";
import { SearchSettings } from "@components/filters/SearchSettings";
import { QUERY_PARAMS } from "@constants/queryParams";
import { MAX_PASSAGES, MAX_RESULTS } from "@constants/paging";
import { useRouter } from "next/router";
import useSearch from "@hooks/useSearch";

// Define a new type for the state and callback props
type TConceptsDocumentViewerProps = {
  initialQueryTerm?: string | string[];
  initialExactMatch?: boolean;
  concepts: TConcept[];
  selectedConcepts: TConcept[];
  rootConcepts: TConcept[];
  conceptCounts: { conceptKey: string; count: number }[];
  document: TDocumentPage;

  // Callback props for state changes
  onQueryTermChange?: (queryTerm: string) => void;
  onExactMatchChange?: (isExact: boolean) => void;
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

export default function ConceptsDocumentViewer({
  initialQueryTerm = "",
  initialExactMatch = false,
  concepts,
  selectedConcepts,
  rootConcepts,
  conceptCounts,
  document,
  onQueryTermChange,
  onExactMatchChange,
}: TConceptsDocumentViewerProps) {
  // Memoise initial values to prevent unnecessary rerenders
  const initialQueryTermString = useMemo(() => (Array.isArray(initialQueryTerm) ? initialQueryTerm[0] : initialQueryTerm || ""), [initialQueryTerm]);

  const [showOptions, setShowOptions] = useState(false);
  const [passageIndex, setPassageIndex] = useState<number | null>(null);
  const [isExactSearch, setIsExactSearch] = useState(initialExactMatch);
  const [queryTerm, setQueryTerm] = useState(initialQueryTermString);
  const router = useRouter();
  const startingPassage = Number(router.query.passage) || 0;

  const searchQueryParams = useMemo(
    () => ({
      [QUERY_PARAMS.query_string]: queryTerm,
      [QUERY_PARAMS.exact_match]: isExactSearch ? "true" : undefined,
    }),
    [queryTerm, isExactSearch]
  );

  const { status, families, searchQuery } = useSearch(searchQueryParams, null, document.import_id, !!queryTerm, MAX_PASSAGES);
  const [passageMatches, setPassageMatches] = useState<TPassage[]>([]);
  const [totalNoOfMatches, setTotalNoOfMatches] = useState(0);

  // Optimise passage matches calculation
  useEffect(() => {
    const calculatePassageMatches = () => {
      const matches: TPassage[] = [];
      let totalMatches = 0;

      for (const family of families) {
        for (const cacheDoc of family.family_documents) {
          if (document.slug === cacheDoc.document_slug) {
            matches.push(...cacheDoc.document_passage_matches);
            totalMatches = family.total_passage_hits;
            break;
          }
        }
        if (matches.length > 0) break;
      }

      if (matches.length !== passageMatches.length || totalMatches !== totalNoOfMatches) {
        setPassageMatches(matches);
        setTotalNoOfMatches(totalMatches);
      }
    };

    calculatePassageMatches();
  }, [families, document.slug, passageMatches.length, totalNoOfMatches]);

  useEffect(() => {
    // Scroll to starting passage on page load
    if (startingPassage) {
      scrollToPassage(startingPassage);
    }
  }, [startingPassage]);

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

  const handlePassageClick = (index: number) => {
    if (!canPreview) return;
    setPassageIndex(index);
    scrollToPassage(index);
  };

  const handleSearchInput = useCallback(
    (term: string) => {
      setPassageIndex(0);
      setQueryTerm(term);
      onQueryTermChange?.(term);
    },
    [onQueryTermChange]
  );

  const handleSemanticSearchChange = useCallback(
    (_: string, isExact: string) => {
      setPassageIndex(0);
      const exactMatchBool = !!isExact;
      setIsExactSearch(exactMatchBool);
      onExactMatchChange?.(exactMatchBool);
    },
    [onExactMatchChange]
  );

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
                    documentPassageMatches={passageMatches}
                    passageIndex={passageIndex}
                    startingPassageIndex={startingPassage}
                  />
                )}
                {!canPreview && <EmptyDocument />}
              </div>
              <div
                id="document-sidebar"
                className={`py-4 order-first max-h-[90vh] md:order-last md:max-h-full md:max-w-[480px] md:min-w-[400px] md:grow-0 md:shrink-0 flex flex-col ${passageClasses(
                  document.content_type
                )}`}
              >
                <div id="document-search" className="flex flex-col gap-2 md:pl-4">
                  {(selectedConcepts.length > 0 || initialQueryTerm) && (
                    <div className="flex gap-2">
                      <Link className="capitalize hover:no-underline" href={`/documents/${document.slug}`}>
                        <Button
                          color="clear"
                          data-cy="view-family-concept"
                          extraClasses="flex items-center text-[14px] font-normal pt-1 pb-1 bg-black text-white border-none"
                        >
                          Back
                        </Button>
                      </Link>
                    </div>
                  )}

                  {selectedConcepts.length === 0 && (
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <SearchForm
                          placeholder="Search the full text of the document"
                          handleSearchInput={handleSearchInput}
                          input={queryTerm as string}
                          size="default"
                        />
                      </div>
                      <div className="relative z-10 flex justify-center">
                        <button className="px-4 flex justify-center items-center text-textDark text-xl" onClick={() => setShowOptions(!showOptions)}>
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
                  )}

                  {selectedConcepts.length === 0 && !initialQueryTerm && (
                    <div className="pb-4">
                      <div className="mt-4 grow-0 shrink-0">
                        <div className="mb-4">
                          <Heading level={4}>Structured data</Heading>
                          <div className="border-l border-inputSelected border-l-2px pt-1 pb-1 pl-4">
                            <p>
                              Our AI, trained by our in-house climate policy experts and data scientists, has identified these concepts in this
                              document. <ExternalLink url="https://climatepolicyradar.org/concepts">Learn more</ExternalLink>
                            </p>
                          </div>
                        </div>
                      </div>
                      {rootConcepts.map((rootConcept) => {
                        const hasConceptsInRootConcept = concepts.filter((concept) => concept.subconcept_of.includes(rootConcept.wikibase_id));
                        if (hasConceptsInRootConcept.length === 0) return null;
                        return (
                          <div key={rootConcept.wikibase_id} className="pt-6 pb-6">
                            <p className="mb-2 capitalize text-[15px] font-bold">{rootConcept.preferred_label}</p>
                            <p>{rootConcept.description}</p>
                            <ul className="flex flex-wrap gap-2 mt-4">
                              {concepts
                                .filter((concept) => concept.subconcept_of.includes(rootConcept.wikibase_id))
                                .map((concept) => {
                                  return (
                                    <li key={concept.wikibase_id}>
                                      <Link
                                        className="capitalize hover:no-underline"
                                        href={`/documents/${document.slug}?cfn=${concept.preferred_label}`}
                                      >
                                        <Button
                                          color="clear"
                                          data-cy="view-family-concept"
                                          extraClasses="flex items-center text-[14px] font-normal pt-1 pb-1"
                                        >
                                          {concept.preferred_label} ({conceptCountsById[concept.wikibase_id]})
                                        </Button>
                                      </Link>
                                    </li>
                                  );
                                })}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {selectedConcepts.length > 0 && (
                    <div className="pt-6 pb-6">
                      <p className="mb-2 capitalize text-[15px] font-bold text-inputSelected">{selectedConcepts[0].preferred_label}</p>
                      <p>{selectedConcepts[0].description}</p>
                    </div>
                  )}
                </div>

                {totalNoOfMatches > 0 && (
                  <>
                    {selectedConcepts.length > 0 && (
                      <>
                        <div className="my-4 text-sm pb-4 border-b md:pl-4" data-cy="document-matches-description">
                          <div className="mb-2">{totalNoOfMatches} matches in this document</div>
                        </div>
                        <div
                          id="document-passage-matches"
                          className="relative overflow-y-scroll scrollbar-thumb-gray-200 scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-500 md:pl-4"
                        >
                          <PassageMatches passages={passageMatches} onClick={handlePassageClick} activeIndex={passageIndex ?? startingPassage} />
                        </div>
                      </>
                    )}
                    {initialQueryTerm && (
                      <>
                        <div className="my-4 text-sm pb-4 border-b md:pl-4" data-cy="document-matches-description">
                          <div className="mb-2">
                            Displaying {renderPassageCount(totalNoOfMatches)} for "
                            <span className="text-textDark font-medium">{`${initialQueryTerm}`}</span>"
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
                  </>
                )}
                {totalNoOfMatches === 0 && <EmptyPassages hasQueryString={!!router.query[QUERY_PARAMS.query_string]} />}
              </div>
            </div>
          </FullWidth>
        </section>
      )}
    </>
  );
}
