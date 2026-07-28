import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { FileSearch2, ScanSearch, Search } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { memo, useCallback, useContext, useMemo, useState } from "react";

import { fetchSearchPassages, type SearchPassage } from "@/api/passages";
import EmbeddedPDF from "@/components/EmbeddedPDF";
import Loader from "@/components/Loader";
import { Input } from "@/components/atoms/input/Input";
import { EmptyDocument } from "@/components/documents/EmptyDocument";
import { PassageBlock, TPassage as TPassageBlock } from "@/components/molecules/passageBlock/PassageBlock";
import { FullWidth } from "@/components/panels/FullWidth";
import { PASSAGES_PER_DOC } from "@/constants/paging";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { TopicsContext } from "@/context/TopicsContext";
import { TFamilyDocumentPublic, TPassage, TSearchResponse, TTopic } from "@/types";

const TOP_CONCEPTS_LIMIT = 8;

// Passage highlighting in the PDF is deferred until the passage model settles
// (FUS-67 / FUS-48), so the viewer is handed a stable empty list and only ever
// re-renders to change page.
const NO_PASSAGE_HIGHLIGHTS: TPassage[] = [];

type TProps = {
  document: TFamilyDocumentPublic;
  vespaDocumentData: TSearchResponse;
};

// The passages endpoint and the PassageBlock molecule name their fields differently.
const toPassageBlock = (passage: SearchPassage, documentTitle: string): TPassageBlock => ({
  id: passage.id,
  document_id: passage.document_id,
  idx: passage.idx,
  content: passage.text,
  pages: passage.pages?.map((pageNumber) => ({ page_number: pageNumber })),
  headingText: passage.heading_text ?? undefined,
  documentTitle,
});

// concept_counts keys are `<wikibase id>:<label>` and the same concept can appear across
// several hits, so counts are summed before ranking. Concepts we have no topic record for
// are dropped, as we would have no label to show.
const getTopDocumentConcepts = (vespaDocumentData: TSearchResponse, topics: TTopic[], limit: number): TTopic[] => {
  const totals = new Map<string, number>();
  const topicsById = new Map(topics.map((topic) => [topic.wikibase_id, topic]));

  (vespaDocumentData?.families ?? []).forEach((family) =>
    family.hits.forEach((hit) =>
      Object.entries(hit.concept_counts ?? {}).forEach(([conceptKey, count]) => {
        const [conceptId] = conceptKey.split(":");
        if (!topicsById.has(conceptId)) return;
        totals.set(conceptId, (totals.get(conceptId) ?? 0) + count);
      })
    )
  );

  return Array.from(totals.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([conceptId, count]) => ({ ...topicsById.get(conceptId), count }));
};

type TEmptyStateProps = {
  concepts: TTopic[];
  hasQuery: boolean;
  onClearClick: () => void;
  onConceptClick: (label: string) => void;
};

const PassagesEmptyState = ({ concepts, hasQuery, onClearClick, onConceptClick }: TEmptyStateProps) => (
  <div className="flex flex-col gap-8 py-10">
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="rounded-full bg-bg-flat p-4 text-elem-icon">{hasQuery ? <ScanSearch size={24} /> : <FileSearch2 size={24} />}</div>
      <p className="font-medium text-text-primary">{hasQuery ? "No matching passages" : "Search passages"}</p>
      <p className="max-w-xs text-sm text-text-secondary">
        {hasQuery ? (
          <>
            <button type="button" onClick={onClearClick} className="underline hocus:text-text-primary">
              Clear your search
            </button>{" "}
            to continue, or try a commonly mentioned topic below.
          </>
        ) : (
          "Type a search or select from topics that appear in this document."
        )}
      </p>
    </div>
    {concepts.length > 0 && (
      <div className="flex flex-col gap-3 border-t border-border-light pt-6">
        <p className="text-sm text-text-secondary">Commonly mentioned in this document</p>
        <ul className="flex flex-wrap gap-2">
          {concepts.map((concept) => (
            <li key={concept.wikibase_id}>
              <button
                type="button"
                onClick={() => onConceptClick(concept.preferred_label)}
                className="rounded-full border border-border-normal px-3 py-1 text-sm text-text-brand hocus:border-inky-blue hocus:bg-bg-flat"
              >
                {concept.preferred_label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

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
};

// Memoised so the Adobe viewer is not torn down and rebuilt on every search interaction.
const DocumentPreview = memo(({ document, pageNumber }: TDocumentPreviewProps) => (
  <EmbeddedPDF document={document} documentPassageMatches={NO_PASSAGE_HIGHLIGHTS} pageNumber={pageNumber} />
));
DocumentPreview.displayName = "DocumentPreview";

export const DocumentPassageViewer = ({ document, vespaDocumentData }: TProps) => {
  const { topics } = useContext(TopicsContext);
  const [query, setQuery] = useQueryState(QUERY_PARAMS.query_string, parseAsString.withDefault(""));
  const [searchTerm, setSearchTerm] = useState(query);
  const [pageNumber, setPageNumber] = useState<number | null>(null);

  // Keep the input in step with the URL when the query changes elsewhere, e.g. the
  // browser back button or a concept being picked from the empty state. Adjusting during
  // render rather than in an effect avoids a second render pass with a stale input.
  const [previousQuery, setPreviousQuery] = useState(query);
  if (query !== previousQuery) {
    setPreviousQuery(query);
    setSearchTerm(query);
  }

  const canPreview = !!document.cdn_object && document.cdn_object.toLowerCase().endsWith(".pdf");

  const { data, isError, isFetching } = useQuery({
    queryKey: ["document-passages", document.import_id, query],
    queryFn: ({ signal }) => fetchSearchPassages({ query, documentId: document.import_id, pageSize: PASSAGES_PER_DOC, signal }),
    enabled: query.length > 0,
    // A term's results do not change within a session, so don't refetch one the user returns to.
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // Hold the previous results in place while the next term loads, to avoid the list collapsing.
    placeholderData: keepPreviousData,
  });

  const hasQuery = query.length > 0;

  // `keepPreviousData` holds the last results against the new query key, so they have to
  // be dropped explicitly once the search is cleared.
  const passages = useMemo(
    () => (hasQuery ? (data?.results ?? []).map((passage) => toPassageBlock(passage, document.title)) : []),
    [data, document.title, hasQuery]
  );

  const topConcepts = useMemo(() => getTopDocumentConcepts(vespaDocumentData, topics, TOP_CONCEPTS_LIMIT), [vespaDocumentData, topics]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // nuqs removes the param when given null, keeping an empty search out of the URL.
    setQuery(searchTerm.trim() || null);
  };

  const handleClear = () => {
    setSearchTerm("");
    setQuery(null);
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
      setPageNumber(page);
    },
    [canPreview]
  );

  const totalMatches = hasQuery ? (data?.total_size ?? 0) : 0;
  const isLoading = isFetching && passages.length === 0;

  return (
    <section className="flex-1 flex flex-col" id="document-passage-viewer">
      <FullWidth extraClasses="flex flex-col gap-4 py-4">
        <form onSubmit={handleSubmit} role="search">
          <Input
            aria-label="Search passages in this document"
            clearable
            containerClasses="px-4 py-2"
            icon={<Search size={16} />}
            inputClasses="text-base"
            name="passage-search"
            onChange={(event) => setSearchTerm(event.target.value)}
            onClear={handleClear}
            placeholder="Enter search term"
            type="search"
            value={searchTerm}
          />
        </form>
        <p className="text-sm text-text-secondary text-right" aria-live="polite">
          {isLoading ? "Searching…" : `${totalMatches} matching ${totalMatches === 1 ? "passage" : "passages"}`}
        </p>
      </FullWidth>

      <div className="flex-1 flex flex-col border-t border-border-light lg:flex-row lg:h-[80vh]">
        <div
          id="document-passages"
          className="w-full px-5 py-4 lg:w-1/2 lg:h-full lg:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-white scrollbar-thumb-rounded-full"
        >
          {isLoading && (
            <div className="flex justify-center">
              <Loader />
            </div>
          )}
          {!isLoading && isError && (
            <p className="py-10 text-center text-sm text-text-secondary">Something went wrong with your search. Please try again.</p>
          )}
          {!isLoading && !isError && passages.length > 0 && <PassageResults passages={passages} onPassageClick={handlePassageClick} />}
          {!isLoading && !isError && passages.length === 0 && (
            <PassagesEmptyState concepts={topConcepts} hasQuery={hasQuery} onClearClick={handleClear} onConceptClick={handleConceptClick} />
          )}
        </div>

        <div id="document-preview" className="w-full h-[600px] border-t border-border-light lg:w-1/2 lg:h-full lg:border-t-0 lg:border-l">
          {canPreview ? <DocumentPreview document={document} pageNumber={pageNumber} /> : <EmptyDocument />}
        </div>
      </div>
    </section>
  );
};
