import { useInfiniteQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useRouter } from "next/router";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { memo, useCallback, useMemo, useState } from "react";

import { fetchSearchPassages } from "@/api/passages";
import Loader from "@/components/Loader";
import { Button } from "@/components/atoms/button/Button";
import { Input } from "@/components/atoms/input/Input";
import { DocumentsFilter, TFilterableDocument } from "@/components/molecules/documentsFilter/DocumentsFilter";
import { EmptyPassages } from "@/components/molecules/emptyPassages/EmptyPassages";
import { PassageBlock, TPassage as TPassageBlock } from "@/components/molecules/passageBlock/PassageBlock";
import { RESULTS_PER_PAGE } from "@/constants/paging";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { TCategoryDictionaryKey } from "@/constants/text";
import { IFamilyDocumentTopics, ISearchPassage, TFamilyPublic } from "@/types";
import { firstCase } from "@/utils/text";
import { getTopFamilyTopics } from "@/utils/topics/getTopFamilyTopics";

const TOP_TOPICS_LIMIT = 10;

type TProps = {
  family: TFamilyPublic;
  familyTopics: IFamilyDocumentTopics | null;
  getCategoryText: (textKey: TCategoryDictionaryKey) => string;
};

// The passages endpoint and the PassageBlock molecule name their fields differently. The
// document title is not on the passage, so it is resolved from the family and denormalised
// on here - unlike the document page, results span several documents and need naming.
const toPassageBlock = (passage: ISearchPassage, documentTitle: string): TPassageBlock => ({
  id: passage.id,
  document_id: passage.document_id,
  idx: passage.idx,
  content: passage.text,
  pages: passage.pages?.map((pageNumber) => ({ page_number: pageNumber })),
  headingText: passage.heading_text ?? undefined,
  documentTitle,
});

type TPassageResultsProps = {
  onDocumentLinkClick: (passage: TPassageBlock) => void;
  onPassageClick: (passage: TPassageBlock) => void;
  passages: TPassageBlock[];
};

// Memoised so that typing in the search input does not re-render every result card.
const PassageResults = memo(({ onDocumentLinkClick, onPassageClick, passages }: TPassageResultsProps) => (
  <ul className="flex flex-col gap-4" id="family-passage-matches" aria-label="Passage matches">
    {passages.map((passage) => (
      <li key={passage.id}>
        <PassageBlock passage={passage} onDocumentLinkClick={() => onDocumentLinkClick(passage)} onPassageClick={onPassageClick} />
      </li>
    ))}
  </ul>
));
PassageResults.displayName = "PassageResults";

export const FamilyPassageViewer = ({ family, familyTopics, getCategoryText }: TProps) => {
  const router = useRouter();
  const [query, setQuery] = useQueryState(QUERY_PARAMS.query_string, parseAsString.withDefault(""));
  const [documentsParam, setDocumentsParam] = useQueryState(QUERY_PARAMS.documents, parseAsArrayOf(parseAsString).withDefault([]));
  const [searchTerm, setSearchTerm] = useState(query);

  // Keep the input in step with the URL when the query changes elsewhere, e.g. the browser
  // back button or a topic being picked from the empty state. Adjusting during render
  // rather than in an effect avoids a second render pass with a stale input.
  const [previousQuery, setPreviousQuery] = useState(query);
  if (query !== previousQuery) {
    setPreviousQuery(query);
    setSearchTerm(query);
  }

  const documentsById = useMemo(() => new Map(family.documents.map((document) => [document.import_id, document])), [family.documents]);
  const allDocumentIds = useMemo(() => family.documents.map((document) => document.import_id), [family.documents]);

  // An absent or stale parameter means every document, which is also the starting state.
  const selectedDocumentIds = useMemo(() => {
    const known = documentsParam.filter((importId) => documentsById.has(importId));
    return known.length > 0 ? known : allDocumentIds;
  }, [documentsParam, documentsById, allDocumentIds]);

  const filterableDocuments: TFilterableDocument[] = useMemo(
    () => family.documents.map((document) => ({ importId: document.import_id, title: document.title })),
    [family.documents]
  );

  const { data, isError, isFetching, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["family-passages", family.import_id, query, selectedDocumentIds],
    queryFn: ({ pageParam, signal }) =>
      fetchSearchPassages({ query, documents: selectedDocumentIds, pageSize: RESULTS_PER_PAGE, pageToken: pageParam, signal }),
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

  const hasQuery = query.length > 0;

  const totalMatches = hasQuery ? (data?.pages[0]?.total_size ?? 0) : 0;

  const passages = useMemo(() => {
    if (!hasQuery) return [];

    return (data?.pages ?? [])
      .flatMap((page) => page.results)
      .map((passage) => toPassageBlock(passage, documentsById.get(passage.document_id)?.title ?? family.title));
  }, [data, hasQuery, documentsById, family.title]);

  // Avoid cases where the result state flashes before the request has resolved
  const isLoading = hasQuery && !isFetchingNextPage && passages.length === 0 && (isPending || isFetching);

  const topTopics = useMemo(() => getTopFamilyTopics(familyTopics, TOP_TOPICS_LIMIT), [familyTopics]);

  const familySingular = getCategoryText("familySingular");

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuery(searchTerm.trim());
  };

  const handleClear = () => {
    setSearchTerm("");
    setQuery("");
  };

  const handleTopicClick = useCallback(
    (label: string) => {
      setSearchTerm(label);
      setQuery(label);
    },
    [setQuery]
  );

  const handleSelectionChange = (nextSelectedIds: string[]) => {
    // Every document selected is the default, so it is left out of the URL.
    setDocumentsParam(nextSelectedIds.length === allDocumentIds.length ? null : nextSelectedIds);
  };

  // There is no preview to drive here, so a passage takes the reader to its own document.
  // The document page runs the same search on arrival and opens at its first match, so the
  // term travels with them. Passages only exist once a search has run, so there is always one.
  const documentHref = useCallback(
    (passage: TPassageBlock) => {
      const slug = documentsById.get(passage.document_id)?.slug;
      return slug ? { pathname: `/documents/${slug}`, query: { [QUERY_PARAMS.query_string]: query } } : null;
    },
    [documentsById, query]
  );

  const handlePassageClick = useCallback(
    (passage: TPassageBlock) => {
      const href = documentHref(passage);
      if (href) router.push(href);
    },
    [documentHref, router]
  );

  const handleDocumentLinkClick = useCallback(
    (passage: TPassageBlock) => {
      const href = documentHref(passage);
      if (href) window.open(`${href.pathname}?${new URLSearchParams(href.query).toString()}`, "_blank");
    },
    [documentHref]
  );

  return (
    <section className="flex flex-col gap-4" id="family-passage-viewer">
      <form onSubmit={handleSubmit} role="search">
        <Input
          aria-label={`Search passages in this ${familySingular}`}
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

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <DocumentsFilter
          documents={filterableDocuments}
          label={`Documents in this ${firstCase(familySingular)}`}
          onSelectionChange={handleSelectionChange}
          selectedImportIds={selectedDocumentIds}
        />
        <p className="text-sm text-text-secondary" aria-live="polite">
          {isLoading ? "Searching…" : `${totalMatches} matching ${totalMatches === 1 ? "passage" : "passages"}`}
        </p>
      </div>

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
          <PassageResults passages={passages} onDocumentLinkClick={handleDocumentLinkClick} onPassageClick={handlePassageClick} />
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
        <EmptyPassages
          cssClass="!p-8 border border-border-normal rounded-lg"
          concepts={topTopics}
          hasQuery={hasQuery}
          onClearClick={handleClear}
          onConceptClick={handleTopicClick}
          subject="these documents"
        />
      )}
    </section>
  );
};
