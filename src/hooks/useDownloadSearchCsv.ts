import { useState } from "react";

import { configureDocumentsFilters, SEARCH_DOCUMENT_SORT_PARAMS, SearchDocumentsSortKey } from "@/api/search";
import { isFilterGroupEmpty } from "@/components/_experiment/advancedFilters/AdvancedFilters";
import { TApiLoadingStatus, TSearchQueryGroup, TSearchQueryRule, TThemeConfig } from "@/types";
import { sanitiseSearchQueryGroup } from "@/utils/filters/advancedFilters";

const DOWNLOAD_MAX_RESULTS = 500;

// Mirrors fetchSearchPrincipalDocuments's principal-only filter in src/api/search.ts,
// so the download matches what the user sees on the results list.
const PRINCIPAL_DOCUMENTS_FILTER: TSearchQueryRule = {
  field: "labels.value.id",
  op: "contains",
  value: "status::Principal",
};

interface IDownloadSearchCsvParams {
  query?: string;
  themeConfig: TThemeConfig;
  filters?: TSearchQueryGroup;
  sort: SearchDocumentsSortKey;
}

function downloadSearchCsvUrl(): string {
  const origin = (process.env.NEXT_PUBLIC_API_URL || "https://api.climatepolicyradar.org").replace(/\/$/, "");
  return `${origin}/search/documents:download`;
}

export function buildDownloadSearchCsvUrl(params: IDownloadSearchCsvParams): URL {
  const url = new URL(downloadSearchCsvUrl());

  if (params.query) url.searchParams.set("query", params.query);

  // Build the same filter tree the results list requests, so the CSV contains exactly
  // the rows on screen. configureDocumentsFilters adds the theme's search categories
  // (e.g. category::Litigation on CCC) and the published-date bounds.
  const filtersToApply: (TSearchQueryGroup | TSearchQueryRule)[] = [PRINCIPAL_DOCUMENTS_FILTER];
  const sanitisedFilters = params.filters ? sanitiseSearchQueryGroup(params.filters) : null;
  if (sanitisedFilters && !isFilterGroupEmpty(sanitisedFilters)) {
    filtersToApply.push(sanitisedFilters);
  }

  const combinedFilters = configureDocumentsFilters({ op: "and", filters: filtersToApply }, params.themeConfig.searchCategories);
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

  const download = async (params: IDownloadSearchCsvParams) => {
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
