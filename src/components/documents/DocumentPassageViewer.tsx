import { useInfiniteQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { memo, useCallback, useContext, useMemo, useState } from "react";

import { fetchSearchPassages } from "@/api/passages";
import EmbeddedPDF from "@/components/EmbeddedPDF";
import Loader from "@/components/Loader";
import { Button } from "@/components/atoms/button/Button";
import { Input } from "@/components/atoms/input/Input";
import { EmptyDocument } from "@/components/documents/EmptyDocument";
import { EmptyPassages } from "@/components/molecules/emptyPassages/EmptyPassages";
import { PassageBlock, TPassage as TPassageBlock } from "@/components/molecules/passageBlock/PassageBlock";
import { Sort } from "@/components/molecules/sort/Sort";
import { FullWidth } from "@/components/panels/FullWidth";
import { RESULTS_PER_PAGE } from "@/constants/paging";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { PASSAGE_SORT_OPTIONS } from "@/constants/sort";
import { TopicsContext } from "@/context/TopicsContext";
import { ISearchPassage, TFamilyDocumentPublic, TSearchResponse } from "@/types";
import { getTopDocumentConcepts } from "@/utils/topics/getTopDocumentTopics";

const TOP_CONCEPTS_LIMIT = 10;

type TProps = {
  document: TFamilyDocumentPublic;
  vespaDocumentData: TSearchResponse;
};

// The passages endpoint and the PassageBlock molecule name their fields differently.
const toPassageBlock = (passage: ISearchPassage, documentTitle: string): TPassageBlock => ({
  id: passage.id,
  document_id: passage.document_id,
  idx: passage.idx,
  content: passage.text,
  pages: passage.pages?.map((pageNumber) => ({ page_number: pageNumber })),
  headingText: passage.heading_text ?? null,
  documentTitle,
  labels: passage.labels,
});

type TPassageResultsProps = {
  onPassageClick: (passage: TPassageBlock) => void;
  passages: TPassageBlock[];
};

// Memoised so that typing in the search input does not re-render every result card.
const PassageResults = memo(({ onPassageClick, passages }: TPassageResultsProps) => (
  <ul className="flex flex-col gap-4" id="document-passage-matches" aria-label="Passage matches">
    {passages.map((passage) => (
      <li key={passage.id}>
        <PassageBlock passage={passage} showDocument={false} onPassageClick={onPassageClick} />
      </li>
    ))}
  </ul>
));
PassageResults.displayName = "PassageResults";

type TDocumentPreviewProps = {
  document: TFamilyDocumentPublic;
  pageNumber: number | null;
  passages: ISearchPassage[];
};

// Memoised so the Adobe viewer is not torn down and rebuilt on every search interaction.
// `startingPageNumber` is deliberately not passed: it sits in EmbeddedPDF's effect
// dependencies, so feeding the current page back in would re-register the passages on
// every passage click. The hook already leaves the reader where it is on a refresh.
const DocumentPreview = memo(({ document, pageNumber, passages }: TDocumentPreviewProps) => (
  <EmbeddedPDF document={document} documentPassageMatches={passages} pageNumber={pageNumber} />
));
DocumentPreview.displayName = "DocumentPreview";

export const DocumentPassageViewer = ({ document, vespaDocumentData }: TProps) => {
  const { topics } = useContext(TopicsContext);
  const [query, setQuery] = useQueryState(QUERY_PARAMS.query_string, parseAsString.withDefault(""));
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("relevance desc"));
  const [searchTerm, setSearchTerm] = useState(query);
  const [pageNumber, setPageNumber] = useState<number | null>(null);

  // Keep the input in step with the URL when the query changes elsewhere, e.g. the
  // browser back button or a concept being picked from the empty state. Adjusting during
  // render rather than in an effect avoids a second render pass with a stale input.
  const [previousQuery, setPreviousQuery] = useState(query);
  const [hasNavigatedForQuery, setHasNavigatedForQuery] = useState(false);
  if (query !== previousQuery) {
    setPreviousQuery(query);
    setSearchTerm(query);
    setHasNavigatedForQuery(false);
  }

  const { data, isError, isFetching, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["document-passages", document.import_id, query, sort],
    queryFn: ({ pageParam, signal }) =>
      fetchSearchPassages({ query, documents: [document.import_id], pageSize: RESULTS_PER_PAGE, sort, pageToken: pageParam, signal }),
    initialPageParam: 1,
    // The API leaves `next_page` and `total_pages` unpopulated, so there is no cursor to
    // follow. Paging is driven by the running result count against the reported total.
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((count, page) => count + page.results.length, 0);
      const total = lastPage.total_size ?? 0;
      // A page that comes back empty also ends paging, otherwise an over-reported total
      // would leave the button fetching nothing forever.
      if (loaded >= total || lastPage.results.length === 0) return undefined;
      return allPages.length + 1;
    },
    enabled: query.length > 0,
    // A term's results do not change within a session, so don't refetch one the user returns to.
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const canPreview = !!document.cdn_object && document.cdn_object.toLowerCase().endsWith(".pdf");

  const hasQuery = query.length > 0;

  const totalMatches = hasQuery ? (data?.pages[0]?.total_size ?? 0) : 0;

  const searchPassages = useMemo(() => (hasQuery ? (data?.pages ?? []).flatMap((page) => page.results) : []), [data, hasQuery]);

  const passages = useMemo(() => searchPassages.map((passage) => toPassageBlock(passage, document.title)), [searchPassages, document.title]);

  // Avoid cases where the result state flashes before the request has resolved
  const isLoading = hasQuery && !isFetchingNextPage && passages.length === 0 && (isPending || isFetching);

  // Take the reader to the first match once a search returns. Guarded so it happens once
  // per search: paging in more results and clicking a passage both change the state above,
  // and neither should pull the view back to the top of the results.
  const firstResultPage = passages[0]?.pages?.[0]?.page_number;
  if (hasQuery && !hasNavigatedForQuery && firstResultPage !== undefined) {
    setHasNavigatedForQuery(true);
    // `page_number` is 0-indexed in the passage model; the PDF viewer is 1-indexed.
    setPageNumber(firstResultPage + 1);
  }

  const topConcepts = useMemo(() => getTopDocumentConcepts(vespaDocumentData, topics, TOP_CONCEPTS_LIMIT), [vespaDocumentData, topics]);

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery(searchTerm.trim());
  };

  const handleClear = () => {
    setSearchTerm("");
    setQuery("");
  };

  const handleConceptClick = useCallback(
    (label: string) => {
      setSearchTerm(label);
      setQuery(label);
    },
    [setQuery]
  );

  const handlePassageClick = useCallback(
    (passage: TPassageBlock) => {
      const page = passage.pages?.[0]?.page_number;
      if (!canPreview || page === undefined) return;
      // `page_number` is 0-indexed in the passage model; the PDF viewer is 1-indexed.
      setPageNumber(page + 1);
    },
    [canPreview]
  );

  return (
    <section className="flex-1 flex flex-col" id="document-passage-viewer">
      <FullWidth extraClasses="flex flex-col gap-4 py-4">
        <form onSubmit={handleSubmit} role="search">
          <Input
            aria-label="Search passages in this document"
            clearable
            containerClasses="px-4 py-2"
            icon={<Search size={16} />}
            inputClasses="!text-sm"
            name="Search"
            onChange={(event) => setSearchTerm(event.target.value)}
            onClear={handleClear}
            placeholder="Enter search term"
            type="text"
            value={searchTerm}
          />
        </form>
        <div className="flex flex-wrap items-center justify-between">
          <div>{/* topic selector here */}</div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-4">
              <p className="text-sm text-text-secondary text-right" aria-live="polite">
                {isLoading ? "Searching…" : `${totalMatches} matching ${totalMatches === 1 ? "passage" : "passages"}`}
              </p>
              {/* sort here */}
              <Sort sortOptions={PASSAGE_SORT_OPTIONS} value={sort} onChange={(next) => setSort(next)} />
            </div>
          </div>
        </div>
      </FullWidth>

      <div className="flex flex-col border-t border-border-light lg:flex-row lg:h-[80vh]">
        <div
          id="document-passages"
          className="w-full max-h-[80vh] overflow-y-auto px-5 py-4 lg:w-1/2 lg:h-full scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-white scrollbar-thumb-rounded-full"
        >
          {isLoading && (
            <div className="flex justify-center">
              <Loader />
            </div>
          )}
          {!isLoading && isError && (
            <p className="py-10 text-center text-sm text-text-secondary">Something went wrong with your search. Please try again.</p>
          )}
          {!isLoading && !isError && passages.length > 0 && (
            <>
              <PassageResults passages={passages} onPassageClick={handlePassageClick} />
              {hasNextPage && (
                <div className="flex flex-col items-center gap-2 pt-4">
                  <Button variant="outlined" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                    {isFetchingNextPage ? "Loading…" : "Load more"}
                  </Button>
                  <p className="text-sm text-text-secondary" aria-live="polite">
                    Showing {passages.length} of {totalMatches}
                  </p>
                </div>
              )}
            </>
          )}
          {!isLoading && !isError && passages.length === 0 && (
            <EmptyPassages concepts={topConcepts} hasQuery={hasQuery} onClearClick={handleClear} onConceptClick={handleConceptClick} />
          )}
        </div>

        <div id="document-preview" className="w-full h-[600px] border-t border-border-light lg:w-1/2 lg:h-full lg:border-t-0 lg:border-l">
          {canPreview ? <DocumentPreview document={document} pageNumber={pageNumber} passages={searchPassages} /> : <EmptyDocument />}
        </div>
      </div>
    </section>
  );
};
