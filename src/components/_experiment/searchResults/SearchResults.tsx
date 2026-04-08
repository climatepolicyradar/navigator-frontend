import { LucideCog, LucideEarth, LucideTag, LucideFileText } from "lucide-react";
import Link from "next/link";
import { Suspense, use, useEffect, useMemo } from "react";

import { documentRelationshipLabel } from "@/utils/_experiment/documentRelationshipLabel";
import { labelTypeLabel } from "@/utils/_experiment/labelTypeLabel";

import styles from "./SearchResults.module.css";
import { EmptySearch } from "../emptySearch/EmptySearch";
import { TQueryGroup } from "../queryBuilder/QueryBuilder";
import { TFilterCategory } from "../searchFilters/SearchFilters";

interface DocumentLabel {
  id: string;
  value: string;
  type: string;
}

interface DocumentLabelRelationship {
  count: number | null;
  type: string;
  value: DocumentLabel;
  timestamp: string | null;
}

interface DocumentRelationship {
  type: string;
  value: SearchDocument;
}

interface DocumentItem {
  url: string | null;
}

interface SearchDocument {
  id: string;
  title: string;
  description: string | null;
  labels: DocumentLabelRelationship[];
  documents: DocumentRelationship[];
  items: DocumentItem[];
  attributes: Record<string, string | number | boolean>;
}

export interface IAggregationLabel {
  count: number;
  value: {
    id: string;
    type: string;
    value: string;
  };
}

export interface SearchDocumentsResponse {
  total_size: number | null;
  page: number;
  page_size: number;
  total_pages: number | null;
  next_page: string | null;
  previous_page: string | null;
  results: SearchDocument[];
  aggregations?: {
    labels: IAggregationLabel[];
  };
}

interface SearchDocumentsParams {
  query?: string;
  filters?: string;
  page_size?: string;
  page_token?: string;
}

const SEARCH_DOCUMENTS_BASE_URL = "https://api.climatepolicyradar.org/search/documents";
const MAX_DESCRIPTION_LENGTH = 275;

export async function fetchSearchDocuments(params: SearchDocumentsParams = {}): Promise<SearchDocumentsResponse> {
  const url = new URL(SEARCH_DOCUMENTS_BASE_URL);

  if (params.query) url.searchParams.set("query", params.query);
  if (params.filters) url.searchParams.set("filters", params.filters);
  if (params.page_size !== undefined) url.searchParams.set("page_size", params.page_size);
  if (params.page_token !== undefined) url.searchParams.set("page_token", params.page_token);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search API error: ${res.status}`);
  return res.json() as Promise<SearchDocumentsResponse>;
}

function linkHref(doc: SearchDocument): string | undefined {
  if (doc.attributes.deprecated_slug)
    if (doc.labels.find((label) => label.value.value === "Principal")) {
      return `/document/${doc.attributes.deprecated_slug}`;
    } else {
      return `/documents/${doc.attributes.deprecated_slug}`;
    }
}

function iconForLabelType(type: string) {
  switch (type) {
    case "geography":
      return <LucideEarth width={14} height={14} />;
    case "concept":
      return <LucideTag width={14} height={14} />;
  }
}

const FILTER_AGGREGATIONS: TFilterCategory[] = ["geography", "concept"];
const RELATIONSHIP_AGGREGATIONS = ["member_of", "has_member"];

export function SearchResults({ promise, onSelectLabel }: { promise: Promise<SearchDocumentsResponse>; onSelectLabel?: (label: string) => void }) {
  const data = use(promise);

  return (
    <div>
      {/* <p className="text-sm text-text-secondary mb-4">
        {data.total_size ?? 0} results — page {data.page} of {data.total_pages ?? 1}
      </p> */}
      <ul className="space-y-4">
        {data.results.map((doc) => (
          <li key={doc.id} className={`flex flex-col gap-3 border border-transparent-regular rounded-md p-6 ${styles["highlights"]}`}>
            {/* CORE DOCUMENT DETAILS */}
            <h3 className="font-semibold text-lg">
              {linkHref(doc) ? (
                <Link href={linkHref(doc)!} className="text-inky-blue hover:underline" dangerouslySetInnerHTML={{ __html: doc.title }} />
              ) : (
                <span dangerouslySetInnerHTML={{ __html: doc.title }} />
              )}
            </h3>
            {doc.description && (
              <p
                className="text-base text-inky-black"
                dangerouslySetInnerHTML={{
                  __html: doc.description.slice(0, MAX_DESCRIPTION_LENGTH) + (doc.description.length > MAX_DESCRIPTION_LENGTH ? "..." : ""),
                }}
              />
            )}
            {/* DISPLAYING FILTERS */}
            {FILTER_AGGREGATIONS.map((agg) => {
              const relationshipsOfType = doc.labels.filter((label) => label.type === agg);
              if (relationshipsOfType.length === 0) return null;

              return (
                <div key={agg} className="flex items-start gap-6 text-sm text-inky-black">
                  <div className="basis-25 shrink-0 py-0.5 font-semibold">{labelTypeLabel(agg)}</div>
                  <div className="flex flex-wrap gap-1">
                    {relationshipsOfType
                      .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
                      .slice(0, 3)
                      .map((relationship, i) => (
                        <button
                          key={i}
                          className="flex gap-1 items-center rounded px-2 py-0.5 cursor-pointer hover:bg-neutral-200"
                          onClick={() => onSelectLabel?.(relationship.value.value)}
                        >
                          {iconForLabelType(relationship.value.type)}
                          <span>{relationship.value.value}</span>
                          {/* <span>{relationship.count !== null && `(${relationship.count})`}</span> */}
                        </button>
                      ))}
                    {relationshipsOfType.length > 3 && <span className="py-0.5 text-neutral-600">+{relationshipsOfType.length - 3} more</span>}
                  </div>
                </div>
              );
            })}
            {/* DISPLAYING DOCUMENT RELATIONSHIPS */}
            {RELATIONSHIP_AGGREGATIONS.map((agg) => {
              const relationshipsOfType = doc.documents.filter((relationship) => relationship.type === agg);
              if (relationshipsOfType.length === 0) return null;

              return (
                <div key={agg} className="flex items-start gap-6 text-sm text-inky-black">
                  <div className="basis-25 shrink-0 py-0.5 font-semibold">{documentRelationshipLabel(agg)}</div>
                  <div className="flex flex-wrap gap-1">
                    {relationshipsOfType.slice(0, 3).map((relationship, i) => (
                      <span key={i} className="rounded px-2 py-0.5 flex gap-1 items-start">
                        <LucideFileText width={14} height={14} className="inline mt-0.5 shrink-0" />
                        {linkHref(relationship.value) ? (
                          <Link href={linkHref(relationship.value)!} className="hover:underline">
                            {relationship.value.title}
                          </Link>
                        ) : (
                          <span>{relationship.value.title}</span>
                        )}
                      </span>
                    ))}
                    {relationshipsOfType.length > 3 && <span className="py-0.5 text-neutral-600">+{relationshipsOfType.length - 3} more</span>}
                  </div>
                </div>
              );
            })}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SearchResultsWithAggregations({
  promise,
  onSelectLabel,
  onAggregationsChange,
}: {
  promise: Promise<SearchDocumentsResponse>;
  onSelectLabel?: (label: string) => void;
  onAggregationsChange?: (labels: IAggregationLabel[] | undefined) => void;
}) {
  const data = use(promise);
  const labels = data.aggregations?.labels;

  /**
   * Pushing aggregations during render forced the parent to re-render on every
   * child render and fought cleared aggregation state. Sync after commit only.
   */
  useEffect(() => {
    onAggregationsChange?.(labels);
  }, [labels, onAggregationsChange]);

  return <SearchResults promise={Promise.resolve(data)} onSelectLabel={onSelectLabel} />;
}

// If any of the values are empty strings, the filters are considered invalid and will not be sent to the API
const filtersDoesNotContainEmptyRule = (filters: TQueryGroup): boolean => {
  if (!filters || !filters.filters || filters.filters.length === 0) return false;

  for (const filter of filters.filters) {
    if ("value" in filter && filter.value.trim() === "") {
      return false;
    }
  }
  return true;
};

export function SearchContainer({
  query,
  filters,
  page_token,
  page_size,
  onSelectLabel,
  onAggregationsChange,
}: {
  selectedLabels?: string[];
  query?: string;
  filters?: TQueryGroup;
  page_token?: string;
  page_size?: string;
  onSelectLabel?: (label: string) => void;
  onAggregationsChange?: (labels: IAggregationLabel[] | undefined) => void;
}) {
  const searchPromise = useMemo(() => {
    if (!query && (!filters || !filtersDoesNotContainEmptyRule(filters))) return null;

    return fetchSearchDocuments({
      query,
      page_size,
      page_token,
      filters: filtersDoesNotContainEmptyRule(filters) ? JSON.stringify(filters) : undefined,
    });
  }, [query, filters, page_token, page_size]);

  return (
    <>
      {searchPromise ? (
        <Suspense
          fallback={
            <p className="text-sm text-text-secondary flex gap-2 items-center">
              <LucideCog className="animate-spin" /> Loading results…
            </p>
          }
        >
          <SearchResultsWithAggregations promise={searchPromise} onSelectLabel={onSelectLabel} onAggregationsChange={onAggregationsChange} />
        </Suspense>
      ) : (
        <EmptySearch />
      )}
    </>
  );
}
