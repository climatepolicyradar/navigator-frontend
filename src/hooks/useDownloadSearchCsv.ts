import { useState } from "react";

import { SEARCH_DOCUMENT_SORT_PARAMS, SearchDocumentsSortKey } from "@/api/search";
import { isFilterGroupEmpty } from "@/components/_experiment/advancedFilters/AdvancedFilters";
import { TApiLoadingStatus, TSearchQueryGroup } from "@/types";
import { sanitiseSearchQueryGroup } from "@/utils/filters/advancedFilters";

const DOWNLOAD_MAX_RESULTS = 500;

// Mirrors fetchSearchPrincipalDocuments's principal-only filter in src/api/search.ts,
// so the download matches what the user sees on the results list.
const PRINCIPAL_DOCUMENTS_FILTER: TSearchQueryGroup = {
  op: "and",
  filters: [{ field: "labels.value.id", op: "contains", value: "status::Principal" }],
};

function downloadSearchCsvUrl(): string {
  const origin = (process.env.NEXT_PUBLIC_API_URL || "https://api.climatepolicyradar.org").replace(/\/$/, "");
  return `${origin}/search/documents:download`;
}

export function buildDownloadSearchCsvUrl(params: { query?: string; filters?: TSearchQueryGroup; sort: SearchDocumentsSortKey }): URL {
  const url = new URL(downloadSearchCsvUrl());

  if (params.query) url.searchParams.set("query", params.query);

  const filtersToApply: TSearchQueryGroup[] = [PRINCIPAL_DOCUMENTS_FILTER];
  const sanitisedFilters = params.filters ? sanitiseSearchQueryGroup(params.filters) : null;
  if (sanitisedFilters && !isFilterGroupEmpty(sanitisedFilters)) {
    filtersToApply.push(sanitisedFilters);
  }

  const combinedFilters: TSearchQueryGroup = { op: "and", filters: filtersToApply };
  url.searchParams.set("filters", JSON.stringify(combinedFilters));

  url.searchParams.set("order_by", SEARCH_DOCUMENT_SORT_PARAMS[params.sort]);
  url.searchParams.set("max_results", DOWNLOAD_MAX_RESULTS.toString());

  return url;
}

function triggerBlobDownload(blob: Blob, fileName: string) {
  const a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  a.click();
  a.remove();
}

export function useDownloadSearchCsv() {
  const [status, setStatus] = useState<TApiLoadingStatus>("idle");

  const download = async (params: { query?: string; filters?: TSearchQueryGroup; sort: SearchDocumentsSortKey }) => {
    setStatus("loading");

    try {
      const url = buildDownloadSearchCsvUrl(params);
      const response = await fetch(url);
      if (!response.ok) {
        setStatus("error");
        return;
      }
      const blob = await response.blob();
      triggerBlobDownload(blob, "search-results.csv");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const resetStatus = () => setStatus("idle");

  return { status, download, resetStatus };
}
