import { useState } from "react";

import { configureDocumentsFilters, SEARCH_DOCUMENTS_MIN_SHOULD_MATCH } from "@/api/search";
import { isFilterGroupEmpty } from "@/components/_experiment/advancedFilters/AdvancedFilters";
import { SORT_PARAMS_LOOKUP } from "@/constants/sort";
import { useEnvConfig } from "@/context/EnvConfig";
import { TApiLoadingStatus, TSearchQueryGroup, TSearchQueryRule, TSortValue, TThemeConfig } from "@/types";
import { sanitiseSearchQueryGroup } from "@/utils/filters/advancedFilters";
import { deflateFilters } from "@/utils/filters/deflate";

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
  sort: TSortValue;
}

function downloadSearchCsvUrl(apiUrl: string): string {
  return `${apiUrl.replace(/\/$/, "")}/search/documents:download`;
}

export function buildDownloadSearchCsvUrl(params: IDownloadSearchCsvParams & { apiUrl: string }): URL {
  const url = new URL(downloadSearchCsvUrl(params.apiUrl));

  if (params.query) {
    url.searchParams.set("query", params.query);
    url.searchParams.set("msm", String(SEARCH_DOCUMENTS_MIN_SHOULD_MATCH));
  }

  // Build the same filter tree the results list requests, so the CSV contains exactly
  // the rows on screen. configureDocumentsFilters adds the theme's search categories
  // (e.g. category::Litigation on CCC) and the published-date bounds.
  const filtersToApply: (TSearchQueryGroup | TSearchQueryRule)[] = [PRINCIPAL_DOCUMENTS_FILTER];
  const sanitisedFilters = params.filters ? sanitiseSearchQueryGroup(params.filters) : null;
  if (sanitisedFilters && !isFilterGroupEmpty(sanitisedFilters)) {
    filtersToApply.push(sanitisedFilters);
  }

  const combinedFilters = configureDocumentsFilters(
    { op: "and", filters: filtersToApply },
    params.themeConfig.searchCategories,
    params.themeConfig.searchExcludeLabels
  );
  url.searchParams.set("filters", deflateFilters(combinedFilters));
  url.searchParams.set("encoding", "deflate");
  url.searchParams.set("order_by", SORT_PARAMS_LOOKUP[params.sort]);
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
  const { API_URL } = useEnvConfig();
  const [status, setStatus] = useState<TApiLoadingStatus>("idle");

  const download = async (params: IDownloadSearchCsvParams) => {
    setStatus("loading");

    try {
      const url = buildDownloadSearchCsvUrl({ ...params, apiUrl: API_URL });
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
