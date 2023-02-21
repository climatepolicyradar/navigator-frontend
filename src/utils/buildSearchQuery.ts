import { initialSearchCriteria } from "@constants/searchCriteria";
import { TSearchCriteria, TSearchKeywordFilters } from "@types";

type TRouterQuery = {
  [key: string]: string | string[];
};

export default function buildSearchQuery(routerQuery: TRouterQuery): TSearchCriteria {
  const { category, regions, countries } = routerQuery;
  const keyword_filters: TSearchKeywordFilters = {};

  if (category) {
    const qCategory = routerQuery.category;
    let category: string;
    if (qCategory === "Legislation") {
      category = "Law";
    }
    if (qCategory === "Policies") {
      category = "Policy";
    }
    keyword_filters.categories = [category];
  }
  
  if (regions) {
    keyword_filters.regions = Array.isArray(regions) ? regions : [regions];
  }

  if (countries) {
    keyword_filters.countries = Array.isArray(countries) ? countries : [countries];
  }

  // Don't pass these to the API
  delete routerQuery.category;
  delete routerQuery.regions;
  delete routerQuery.countries;
  const query = { ...initialSearchCriteria, ...routerQuery, keyword_filters };
  return query;
}

const EXAMPLE = {
  query_string: "",
  exact_match: false,
  max_passages_per_doc: 10,
  keyword_filters: { regions: ["europe-central-asia"], countries: ["united-kingdom"] },
  year_range: ["2018", "2023"],
  sort_field: null,
  sort_order: "desc",
  limit: 10,
  offset: 0,
};

const EXAMPLE_2 = {
  query_string: "Adaptation strategy",
  exact_match: false,
  max_passages_per_doc: 10,
  keyword_filters: { regions: ["europe-central-asia"], countries: ["united-kingdom"], categories: ["Policy"] },
  year_range: ["2018", "2023"],
  sort_field: "date",
  sort_order: "desc",
  limit: 10,
  offset: 0,
};
