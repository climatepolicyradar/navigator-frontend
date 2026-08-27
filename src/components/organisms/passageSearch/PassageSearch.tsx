import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { parseAsArrayOf, parseAsJson, parseAsString, useQueryState } from "nuqs";
import { memo, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { fetchSearchPassages } from "@/api/passages";
import EmbeddedPDF from "@/components/EmbeddedPDF";
import Loader from "@/components/Loader";
import { Button } from "@/components/atoms/button/Button";
import { EmptyDocument } from "@/components/documents/EmptyDocument";
import { DocumentsFilter, TFilterableDocument } from "@/components/molecules/documentsFilter/DocumentsFilter";
import { EmptyPassages } from "@/components/molecules/emptyPassages/EmptyPassages";
import { PassageBlock, TPassage as TPassageBlock } from "@/components/molecules/passageBlock/PassageBlock";
import { SearchControls } from "@/components/organisms/searchControls/SearchControls";
import { FullWidth } from "@/components/panels/FullWidth";
import { ID_SEPARATOR } from "@/constants/chars";
import { PASSAGE_FILTER_GROUPS } from "@/constants/filters";
import { RESULTS_PER_PAGE } from "@/constants/paging";
import { PASSAGE_SORT_OPTIONS } from "@/constants/sort";
import { SearchLevelContext } from "@/context/SearchLevelContext";
import { loadFilteredLabels } from "@/hooks/useLabelSearch";
import { FilterGroupSchema } from "@/schemas";
import { ISearchPassage, TFamilyDocumentPublic, TSearchLabel, TSearchQueryGroup, TTopic } from "@/types";
import { conceptFiltersOnly, flattenLevelToBaseQuery, levelParamKeys } from "@/utils/search/searchLevels";

type TProps = {
  concepts: TTopic[];
  documents: TFamilyDocumentPublic[];
  documentsLabel?: string;
  enablePreview?: boolean;
  subject?: string;
};

// The passages endpoint and the PassageBlock molecule name their fields differently. The
// document title is not on the passage, so it is resolved from the scope and denormalised
// on here - results can span several documents and need naming.
const toPassageBlock = (passage: ISearchPassage, documentTitle: string): TPassageBlock => ({
  id: passage.id,
  document_id: passage.document_id,
  idx: passage.idx,
  content: passage.text,
  pages: passage.pages?.map((pageNumber) => ({ page_number: pageNumber })),
  headingText: passage.heading_text ?? undefined,
  documentTitle,
  labels: passage.labels ?? undefined,
});

type TPassageResultsProps = {
  onDocumentLinkClick?: (passage: TPassageBlock) => void;
  onPassageClick: (passage: TPassageBlock) => void;
  passages: TPassageBlock[];
  showDocument: boolean;
};

// Memoised so that typing in the search input does not re-render every result card.
const PassageResults = memo(({ onDocumentLinkClick, onPassageClick, passages, showDocument }: TPassageResultsProps) => (
  <ul className="flex flex-col gap-4" id="passage-matches" aria-label="Passage matches">
    {passages.map((passage) => (
      <li key={passage.id}>
        <PassageBlock
          passage={passage}
          showDocument={showDocument}
          onDocumentLinkClick={onDocumentLinkClick && (() => onDocumentLinkClick(passage))}
          onPassageClick={onPassageClick}
        />
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

export const PassageSearch = ({ concepts, documents, documentsLabel, enablePreview = false, subject }: TProps) => {
  const router = useRouter();
  const searchLevel = useContext(SearchLevelContext);
  const paramKeys = useMemo(() => levelParamKeys(searchLevel), [searchLevel]);
  const [queryParam, setQueryParam] = useQueryState(paramKeys.query, parseAsString.withDefault(""));
  const [filterParam, setFilterParams] = useQueryState(paramKeys.filters, parseAsJson<TSearchQueryGroup>(FilterGroupSchema));
  const [sort] = useQueryState(paramKeys.sort, parseAsString.withDefault(PASSAGE_SORT_OPTIONS[0].paramValue));
  const [documentsParam, setDocumentsParam] = useQueryState(paramKeys.documents, parseAsArrayOf(parseAsString).withDefault([]));
  const [pageNumber, setPageNumber] = useState<number | null>(null);
  const [availableConcepts, setAvailableConcepts] = useState<TSearchLabel[]>([]);

  // Only concept filters are offered here, and a level is seeded with only those, so anything else
  // in the parameter came from a hand-edited or shared URL and is not this search's to apply.
  const conceptFilterParam = useMemo(() => conceptFiltersOnly(filterParam), [filterParam]);

  // Arm the jump to the first result when changed:
  // - the search query
  // - different topics
  // - re-ordering
  // Adjusting during render rather than in an effect avoids a second render pass with a stale value.
  // The filter group is compared serialised, so the check does not rest on the parser returning a stable object.
  const filterKey = JSON.stringify(conceptFilterParam);
  const [previousSearch, setPreviousSearch] = useState({ queryParam, filterKey, sort });
  const [hasNavigatedForSearch, setHasNavigatedForSearch] = useState(false);
  if (queryParam !== previousSearch.queryParam || filterKey !== previousSearch.filterKey || sort !== previousSearch.sort) {
    setPreviousSearch({ queryParam, filterKey, sort });
    setHasNavigatedForSearch(false);
  }

  useEffect(() => {
    loadFilteredLabels({
      op: "or",
      filters: [
        {
          field: "type",
          op: "contains",
          value: "concept",
        },
      ],
    }).then(setAvailableConcepts);
  }, []);

  const documentsById = useMemo(() => new Map(documents.map((document) => [document.import_id, document])), [documents]);
  const allDocumentIds = useMemo(() => documents.map((document) => document.import_id), [documents]);

  // An absent or stale parameter means every document, which is also the starting state.
  const selectedDocumentIds = useMemo(() => {
    const known = documentsParam.filter((importId) => documentsById.has(importId));
    return known.length > 0 ? known : allDocumentIds;
  }, [documentsParam, documentsById, allDocumentIds]);

  const hasSearch = queryParam.length > 0 || !!conceptFilterParam;

  const { data, isError, isFetching, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["passages", selectedDocumentIds, queryParam, conceptFilterParam, sort],
    queryFn: ({ pageParam, signal }) =>
      fetchSearchPassages({
        query: queryParam,
        documents: selectedDocumentIds,
        filters: conceptFilterParam,
        pageSize: RESULTS_PER_PAGE,
        sort,
        pageToken: pageParam,
        signal,
      }),
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
    enabled: hasSearch,
    // A term's results do not change within a session, so don't refetch one the user returns to.
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Enabling the preview for a multi-document scope would need this resolved from the
  // clicked passage instead of taken from the scope.
  const previewDocument = documents[0];
  const canPreview = enablePreview && !!previewDocument?.cdn_object && previewDocument.cdn_object.toLowerCase().endsWith(".pdf");

  const filterableDocuments: TFilterableDocument[] = useMemo(
    () => documents.map((document) => ({ importId: document.import_id, title: document.title })),
    [documents]
  );

  const totalMatches = hasSearch ? (data?.pages[0]?.total_size ?? 0) : 0;

  const searchPassages = useMemo(() => (hasSearch ? (data?.pages ?? []).flatMap((page) => page.results) : []), [data, hasSearch]);

  const passages = useMemo(
    () => searchPassages.map((passage) => toPassageBlock(passage, documentsById.get(passage.document_id)?.title ?? documents[0]?.title ?? "")),
    [searchPassages, documentsById, documents]
  );

  // Avoid cases where the result state flashes before the request has resolved
  const isLoading = hasSearch && !isFetchingNextPage && passages.length === 0 && (isPending || isFetching);

  // Navigate to the first match once a search returns
  const firstResultPage = passages[0]?.pages?.[0]?.page_number;
  if (enablePreview && hasSearch && !hasNavigatedForSearch && firstResultPage !== undefined) {
    setHasNavigatedForSearch(true);
    // `page_number` is 0-indexed in the passage model; the PDF viewer is 1-indexed.
    setPageNumber(firstResultPage + 1);
  }

  // Only offer concept filters the scope actually has passages for
  const conceptFilters = useMemo(() => {
    const rankedIds = new Set(concepts.map((concept) => concept.wikibase_id));
    return availableConcepts.filter((label) => label.type === "concept" && rankedIds.has(label.id.split(ID_SEPARATOR)[1]));
  }, [availableConcepts, concepts]);

  const handleClear = () => {
    setQueryParam("");
    setFilterParams(null);
  };

  const handleSelectionChange = (nextSelectedIds: string[]) => {
    // Every document selected is the default, so it is left out of the URL.
    setDocumentsParam(nextSelectedIds.length === allDocumentIds.length ? null : nextSelectedIds);
  };

  // We have to run some logic because passages don't contain the document slug.
  // The document page searches at its own base level, so this search is flattened onto those params.
  const documentHref = useCallback(
    (passage: TPassageBlock) => {
      const slug = documentsById.get(passage.document_id)?.slug;
      if (!slug) return null;

      const baseQuery = flattenLevelToBaseQuery({ documents: null, filters: conceptFilterParam, query: queryParam });
      const query = Object.fromEntries(Object.entries(baseQuery).filter(([, value]) => value !== null)) as Record<string, string>;

      return { pathname: `/documents/${slug}`, query };
    },
    [conceptFilterParam, documentsById, queryParam]
  );

  const handleDocumentLinkClick = useCallback(
    (passage: TPassageBlock) => {
      const href = documentHref(passage);
      if (!href) return;

      const search = new URLSearchParams(href.query).toString();
      window.open(search ? `${href.pathname}?${search}` : href.pathname, "_blank");
    },
    [documentHref]
  );

  const handlePassageClick = useCallback(
    (passage: TPassageBlock) => {
      if (enablePreview) {
        const page = passage.pages?.[0]?.page_number;
        if (!canPreview || page === undefined) return;
        // `page_number` is 0-indexed in the passage model; the PDF viewer is 1-indexed.
        setPageNumber(page + 1);
        return;
      }

      const href = documentHref(passage);
      if (href) router.push(href);
    },
    [canPreview, documentHref, enablePreview, router]
  );

  const controls = (
    <SearchControls
      filterGroups={PASSAGE_FILTER_GROUPS}
      filterParamKey={paramKeys.filters}
      filtersSlot={
        documents.length > 1 && (
          <DocumentsFilter
            documents={filterableDocuments}
            label={documentsLabel ?? "Documents"}
            onSelectionChange={handleSelectionChange}
            selectedImportIds={selectedDocumentIds}
          />
        )
      }
      labels={conceptFilters}
      pageParamKey={paramKeys.pageToken}
      queryParamKey={paramKeys.query}
      sortOptions={PASSAGE_SORT_OPTIONS}
      sortParamKey={paramKeys.sort}
      resultsNode={
        <p className="text-sm text-text-secondary text-right" aria-live="polite">
          {isLoading ? "Searching…" : `${totalMatches} matching ${totalMatches === 1 ? "passage" : "passages"}`}
        </p>
      }
    />
  );

  const results = (
    <>
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
          <PassageResults
            passages={passages}
            showDocument={!enablePreview}
            onDocumentLinkClick={enablePreview ? undefined : handleDocumentLinkClick}
            onPassageClick={handlePassageClick}
          />
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
          cssClass={enablePreview ? undefined : "!p-8 border border-border-normal rounded-lg"}
          hasQuery={hasSearch}
          onClearClick={handleClear}
          subject={subject}
        />
      )}
    </>
  );

  if (!enablePreview)
    return (
      <section className="flex flex-col gap-4" id="passage-search">
        {controls}
        {results}
      </section>
    );

  return (
    <section className="flex-1 flex flex-col" id="passage-search">
      <FullWidth extraClasses="flex flex-col gap-4 py-4">{controls}</FullWidth>

      <div className="flex flex-col border-t border-border-light lg:flex-row lg:h-[80vh]">
        <div
          id="passage-results"
          className="w-full max-h-[80vh] overflow-y-auto px-5 py-4 lg:w-1/2 lg:h-full scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-white scrollbar-thumb-rounded-full"
        >
          {results}
        </div>

        <div id="document-preview" className="w-full h-[600px] border-t border-border-light lg:w-1/2 lg:h-full lg:border-t-0 lg:border-l">
          {canPreview ? <DocumentPreview document={previewDocument} pageNumber={pageNumber} passages={searchPassages} /> : <EmptyDocument />}
        </div>
      </div>
    </section>
  );
};
