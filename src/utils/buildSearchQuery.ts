import { initialSearchCriteria } from "@constants/searchCriteria";
import { QUERY_PARAMS } from "@constants/queryParams";

import { buildSearchQueryMetadata } from "./buildSearchQueryMetadata";

import { TSearchCriteria, TSearchKeywordFilters, TThemeConfig } from "@types";

export type TRouterQuery = {
  [key: string]: string | string[];
};

// We are storing the search object in the query using aliases
// This function converts the query string to the search object
export default function buildSearchQuery(
  routerQuery: TRouterQuery,
  themeConfig: TThemeConfig,
  familyId = "",
  documentId = "",
  includeAllTokens = false,
  noOfPassagesPerDoc: number = undefined
): TSearchCriteria {
  const keyword_filters: TSearchKeywordFilters = {};
  let query = { ...initialSearchCriteria, runSearch: true };

  // don't build a query object if we are not provided with a config
  if (!themeConfig) return { ...query, runSearch: false };

  if (routerQuery[QUERY_PARAMS.query_string]) {
    query.query_string = routerQuery[QUERY_PARAMS.query_string]?.toString();
  }

  if (routerQuery[QUERY_PARAMS.exact_match]) {
    query.exact_match = routerQuery[QUERY_PARAMS.exact_match] === "true";
  }

  if (routerQuery[QUERY_PARAMS.offset]) {
    query.offset = Number(routerQuery[QUERY_PARAMS.offset]);
  }

  if (routerQuery[QUERY_PARAMS.sort_field]) {
    query.sort_field = routerQuery[QUERY_PARAMS.sort_field]?.toString();
  }

  if (routerQuery[QUERY_PARAMS.sort_order]) {
    query.sort_order = routerQuery[QUERY_PARAMS.sort_order]?.toString();
  }

  if (routerQuery[QUERY_PARAMS.year_range]) {
    const yearRange = routerQuery[QUERY_PARAMS.year_range];
    if (Array.isArray(yearRange)) {
      query.year_range = [yearRange[0], yearRange[1]];
    }
  }

  if (routerQuery[QUERY_PARAMS["concept_filters.id"]]) {
    const conceptFilters = routerQuery[QUERY_PARAMS["concept_filters.id"]];
    query.concept_filters = Array.isArray(conceptFilters)
      ? conceptFilters.map((id) => ({
          name: "id",
          value: id,
        }))
      : [{ name: "id", value: conceptFilters }];
  }
  if (routerQuery[QUERY_PARAMS["concept_filters.name"]]) {
    const conceptFilters = routerQuery[QUERY_PARAMS["concept_filters.name"]];
    query.concept_filters = Array.isArray(conceptFilters)
      ? conceptFilters.map((name) => ({
          name: "name",
          value: name,
        }))
      : [{ name: "name", value: conceptFilters }];
  }

  if (routerQuery[QUERY_PARAMS.category]) {
    const qCategory = routerQuery[QUERY_PARAMS.category] as string;
    let category: string[];
    let corpusIds: string[] = [];
    if (themeConfig?.categories) {
      const configCategory = themeConfig.categories.options.find((c) => c.slug.toLowerCase() === qCategory.toLowerCase());
      category = configCategory?.category;
      if (configCategory?.value) corpusIds = configCategory.value;
    }
    // Set the category if we have one (TODO: remove this at some point)
    keyword_filters.categories = category;
    // Set the corpus import ids if we have them
    query.corpus_import_ids = corpusIds;
  }

  if (routerQuery[QUERY_PARAMS.region]) {
    const regions = routerQuery[QUERY_PARAMS.region];
    keyword_filters.regions = Array.isArray(regions) ? regions : [regions];
  }

  if (routerQuery[QUERY_PARAMS.country]) {
    const countries = routerQuery[QUERY_PARAMS.country];
    keyword_filters.countries = Array.isArray(countries) ? countries : [countries];
  }

  if (routerQuery[QUERY_PARAMS.active_continuation_token]) {
    // Array containing only 1 token - the active token
    query.continuation_tokens = [routerQuery[QUERY_PARAMS.active_continuation_token] as string];
  }

  if (includeAllTokens) {
    let allContinuationTokens: string[] = [];
    const routerQueryToken = routerQuery[QUERY_PARAMS.active_continuation_token] as string;
    const routerQueryTokens = routerQuery[QUERY_PARAMS.continuation_tokens] as string;
    if (routerQueryTokens) {
      const continuationTokens: string[] = JSON.parse(routerQueryTokens);
      if (Array.isArray(continuationTokens) && continuationTokens.length > 0) {
        allContinuationTokens.push(...continuationTokens);
      }
    }
    if (routerQueryToken) {
      if (!allContinuationTokens.includes(routerQueryToken)) {
        allContinuationTokens.push(routerQueryToken);
      }
    }
    query.continuation_tokens = allContinuationTokens;
  }

  if (familyId) {
    query.family_ids = [familyId];
    // Some query params are causing issues when we are on a family page
    query.offset = 0;
    // Clear continuation tokens
    query.continuation_tokens = [];
  }

  if (documentId) {
    query.document_ids = [documentId];
    // Some query params are causing issues when we are on a document page
    query.offset = 0;
    // Clear continuation tokens
    query.continuation_tokens = [];
  }

  if (noOfPassagesPerDoc) {
    // ensure that the number of passages per doc is a positive integer
    if (Number.isInteger(noOfPassagesPerDoc) && noOfPassagesPerDoc > 0) {
      query.max_passages_per_doc = noOfPassagesPerDoc;
    }
  }

  // ---- Laws and Policies specific ----
  if (routerQuery[QUERY_PARAMS.framework_laws]) {
    const configFrameworkLaws = themeConfig.filters.find((f) => f.taxonomyKey === "framework_laws");
    query.metadata = query.metadata.filter((m) => m.name !== configFrameworkLaws.apiMetaDataKey);
    if (routerQuery[QUERY_PARAMS.framework_laws] === "true") {
      query.metadata.push({ name: configFrameworkLaws.apiMetaDataKey, value: "Mitigation" });
    }
  }
  if (routerQuery[QUERY_PARAMS.topic]) {
    query.metadata = buildSearchQueryMetadata(query.metadata, routerQuery[QUERY_PARAMS.topic], "topic", themeConfig);
  }
  if (routerQuery[QUERY_PARAMS.sector]) {
    query.metadata = buildSearchQueryMetadata(query.metadata, routerQuery[QUERY_PARAMS.sector], "sector", themeConfig);
  }
  // ---- End of Laws and Policies specific ----

  // ---- MCF specific ----
  // These are the filters that are specific to the MCFs corpus types
  // TODO: handle this more elegantly and scaleably
  if (themeConfig.defaultCorpora) {
    query.corpus_import_ids = themeConfig.defaultCorpora;
  }

  if (routerQuery[QUERY_PARAMS.fund]) {
    let corpusIds: string[] = [];
    const funds = routerQuery[QUERY_PARAMS.fund];
    const configFunds = themeConfig.filters.find((f) => f.taxonomyKey === "fund");
    if (configFunds) {
      const fundOptions = configFunds.options;
      if (Array.isArray(funds)) {
        funds.forEach((fund) => {
          const fundOption = fundOptions.find((o) => o.slug === fund);
          if (fundOption?.value) corpusIds.push(...fundOption.value);
        });
      } else {
        const fundOption = fundOptions.find((o) => o.slug === funds);
        if (fundOption?.value) corpusIds.push(...fundOption.value);
      }
    }
    query.corpus_import_ids = corpusIds; // this will overrite the defaultCorpora - which is fine
  }

  if (routerQuery[QUERY_PARAMS.status]) {
    query.metadata = buildSearchQueryMetadata(query.metadata, routerQuery[QUERY_PARAMS.status], "status", themeConfig);
  }

  if (routerQuery[QUERY_PARAMS.implementing_agency]) {
    query.metadata = buildSearchQueryMetadata(query.metadata, routerQuery[QUERY_PARAMS.implementing_agency], "implementing_agency", themeConfig);
  }
  // ---- End of MCF specific ----

  // ---- Reports specific ----
  // These are the filters that are specific to the Reports corpus type
  if (routerQuery[QUERY_PARAMS.author_type]) {
    query.metadata = buildSearchQueryMetadata(query.metadata, routerQuery[QUERY_PARAMS.author_type], "author_type", themeConfig);
  }

  query = {
    ...query,
    keyword_filters,
  };

  return query;
}
