import { QUERY_PARAMS } from "@/constants/queryParams";
import { initialSearchCriteria } from "@/constants/searchCriteria";
import { TSearchCriteria, TSearchKeywordFilters, TThemeConfig } from "@/types";

import { buildSearchQueryMetadata } from "./buildSearchQueryMetadata";

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

  if (routerQuery[QUERY_PARAMS.sort_order]) {
    query.sort_order = routerQuery[QUERY_PARAMS.sort_order]?.toString();
  }

  if (routerQuery[QUERY_PARAMS.sort_field]) {
    query.sort_field = routerQuery[QUERY_PARAMS.sort_field]?.toString();
  }

  // If no sort order is provided, and we are in "browse" mode (i.e. no search term), we want to set the sort order to latest date "date:desc"
  if (!routerQuery[QUERY_PARAMS.sort_field] && !routerQuery[QUERY_PARAMS.sort_order] && !routerQuery[QUERY_PARAMS.query_string]) {
    query.sort_order = "desc";
    query.sort_field = "date";
  }

  // Default to search using exact match - only look for when exact_match is specifically set to false
  // TODO: when we change back from exact_match being default, we need to reistate the routerQuery check:
  // such as: if (routerQuery[QUERY_PARAMS.exact_match]) {}
  query.exact_match = routerQuery[QUERY_PARAMS.exact_match] !== "false";

  if (routerQuery[QUERY_PARAMS.passages_by_position]) {
    query.sort_within_page = routerQuery[QUERY_PARAMS.passages_by_position] === "true";
  }

  // TODO: remove this
  // Setting the default sort order to "sort_within_page" for a specific search with conditions:
  // - no search query
  // - within a document view
  // - with concepts/classifiers
  if (
    !routerQuery[QUERY_PARAMS.passages_by_position] &&
    !routerQuery[QUERY_PARAMS.query_string] &&
    documentId &&
    (routerQuery[QUERY_PARAMS.concept_id] || routerQuery[QUERY_PARAMS.concept_name])
  ) {
    query.sort_within_page = true;
  }

  if (routerQuery[QUERY_PARAMS.offset]) {
    query.offset = Number(routerQuery[QUERY_PARAMS.offset]);
  }

  if (routerQuery[QUERY_PARAMS.year_range]) {
    const yearRange = routerQuery[QUERY_PARAMS.year_range];
    if (Array.isArray(yearRange)) {
      query.year_range = [yearRange[0], yearRange[1]];
    }
  }

  if (routerQuery[QUERY_PARAMS.concept_id]) {
    const conceptFilters = routerQuery[QUERY_PARAMS.concept_id];
    query.concept_filters = Array.isArray(conceptFilters)
      ? conceptFilters.map((id) => ({
          name: "id",
          value: id,
        }))
      : [{ name: "id", value: conceptFilters }];
  }
  if (routerQuery[QUERY_PARAMS.concept_name]) {
    const conceptFilters = routerQuery[QUERY_PARAMS.concept_name];
    query.concept_filters = Array.isArray(conceptFilters)
      ? conceptFilters.map((name) => ({
          name: "name",
          value: name,
        }))
      : [{ name: "name", value: conceptFilters }];
  }

  if (routerQuery[QUERY_PARAMS.concept_preferred_label]) {
    const conceptPreferredLabel = routerQuery[QUERY_PARAMS.concept_preferred_label];
    const conceptPreferredLabelFilters = Array.isArray(conceptPreferredLabel)
      ? conceptPreferredLabel.map((name) => ({
          name: "family.concept_preferred_label",
          value: name,
        }))
      : [{ name: "family.concept_preferred_label", value: conceptPreferredLabel }];
    query.metadata = [...query.metadata, ...conceptPreferredLabelFilters];
  }

  const qCategory = (routerQuery[QUERY_PARAMS.category] as string) ?? "All";
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

  if (routerQuery[QUERY_PARAMS.region]) {
    const regions = routerQuery[QUERY_PARAMS.region];
    keyword_filters.regions = Array.isArray(regions) ? regions : [regions];
  }

  if (routerQuery[QUERY_PARAMS.country]) {
    const countries = routerQuery[QUERY_PARAMS.country];
    keyword_filters.countries = Array.isArray(countries) ? countries : [countries];
  }

  if (routerQuery[QUERY_PARAMS.subdivision]) {
    const subdivisions = routerQuery[QUERY_PARAMS.subdivision];
    keyword_filters.subdivisions = Array.isArray(subdivisions) ? subdivisions : [subdivisions];
  }

  if (routerQuery[QUERY_PARAMS.active_continuation_token]) {
    // Array containing only 1 token - the active token
    query.continuation_tokens = [routerQuery[QUERY_PARAMS.active_continuation_token] as string];
  }

  if (includeAllTokens) {
    const allContinuationTokens: string[] = [];
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
      query.metadata.push({
        name: configFrameworkLaws.apiMetaDataKey,
        value: "Mitigation",
      });
    }
  }
  if (routerQuery[QUERY_PARAMS.topic]) {
    query.metadata = buildSearchQueryMetadata(query.metadata, routerQuery[QUERY_PARAMS.topic], "topic", themeConfig);
  }
  if (routerQuery[QUERY_PARAMS.sector]) {
    query.metadata = buildSearchQueryMetadata(query.metadata, routerQuery[QUERY_PARAMS.sector], "sector", themeConfig);
  }
  // ---- End of Laws and Policies specific ----

  // defaultCorpora is defined in apps without any category filters
  if (themeConfig.defaultCorpora) {
    query.corpus_import_ids = themeConfig.defaultCorpora;
  }

  if (routerQuery[QUERY_PARAMS.fund]) {
    const corpusIds: string[] = [];
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
    query.corpus_import_ids = corpusIds; // this will overwrite the defaultCorpora - which is fine
  }

  if (routerQuery[QUERY_PARAMS.fund_doc_type]) {
    const corpusIds: string[] = [];
    const funds = routerQuery[QUERY_PARAMS.fund_doc_type];
    const configFundsFromTypes = themeConfig.filters.find((f) => f.taxonomyKey === "fund_doc_type");
    if (configFundsFromTypes) {
      const fundOptions = configFundsFromTypes.options;
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
    if (routerQuery[QUERY_PARAMS.fund]) {
      // If the user has also selected a fund, we only want to display the selected type of document for that fund
      query.corpus_import_ids = query.corpus_import_ids.filter((id) => corpusIds.includes(id));
    } else {
      query.corpus_import_ids = corpusIds; // this will overwrite the defaultCorpora - which is fine
    }
  }

  if (routerQuery[QUERY_PARAMS.status]) {
    query.metadata = buildSearchQueryMetadata(query.metadata, routerQuery[QUERY_PARAMS.status], "status", themeConfig);
  }

  if (routerQuery[QUERY_PARAMS.implementing_agency]) {
    query.metadata = buildSearchQueryMetadata(query.metadata, routerQuery[QUERY_PARAMS.implementing_agency], "implementing_agency", themeConfig);
  }

  // ---- Reports & UNFCCC specific ----
  // These are the filters that are specific to the Reports and UNFCCC corpus types - note: we pass in the corpusIds to check as there are multiple instances of the same filter
  if (routerQuery[QUERY_PARAMS.author_type]) {
    query.metadata = buildSearchQueryMetadata(query.metadata, routerQuery[QUERY_PARAMS.author_type], "author_type", themeConfig, corpusIds);
  }
  // ---- End of Reports & UNFCCC specific ----

  // ---- UNFCCC specific ----
  // These are the filters that are specific to the UNFCCC corpus type
  if (routerQuery[QUERY_PARAMS["_document.type"]]) {
    query.metadata = buildSearchQueryMetadata(query.metadata, routerQuery[QUERY_PARAMS["_document.type"]], "_document.type", themeConfig);
  }

  if (routerQuery[QUERY_PARAMS.convention]) {
    const corpusIds: string[] = [];
    const conventions = routerQuery[QUERY_PARAMS.convention];
    const configConventions = themeConfig.filters.find((f) => f.taxonomyKey === "convention");
    if (configConventions) {
      const conventionOptions = configConventions.options;
      if (Array.isArray(conventions)) {
        conventions.forEach((convention) => {
          const conventionOption = conventionOptions.find((o) => o.slug === convention);
          if (conventionOption?.value) corpusIds.push(...conventionOption.value);
        });
      } else {
        const conventionOption = conventionOptions.find((o) => o.slug === conventions);
        if (conventionOption?.value) corpusIds.push(...conventionOption.value);
      }
    }
    query.corpus_import_ids = corpusIds; // this will overwrite the defaultCorpora - which is fine
  }
  // ---- End of UNFCCC specific ----

  // ---- page_size ----
  const maybePageSize = Number.isInteger(Number(routerQuery[QUERY_PARAMS["page_size"]])) ? Number(routerQuery[QUERY_PARAMS["page_size"]]) : undefined;
  if (maybePageSize !== undefined) {
    query.page_size = maybePageSize;
  }

  query = {
    ...query,
    keyword_filters,
  };

  return query;
}
