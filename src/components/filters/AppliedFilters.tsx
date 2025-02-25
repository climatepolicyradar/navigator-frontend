import { useMemo } from "react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

import useConfig from "@hooks/useConfig";
import useGetThemeConfig from "@hooks/useThemeConfig";

import Pill from "@components/Pill";

import { getCountryName } from "@helpers/getCountryFields";
import { getConceptName } from "@helpers/getConceptFields";

import { QUERY_PARAMS } from "@constants/queryParams";
import { sortOptions } from "@constants/sortOptions";

import { TConcept, TGeography, TThemeConfig } from "@types";

type TFilterChange = (type: string, value: string) => void;

type TProps = {
  filterChange: TFilterChange;
  concepts?: TConcept[];
};

const handleCountryRegion = (slug: string, dataSet: TGeography[]) => {
  return getCountryName(slug, dataSet);
};

const handleConceptName = (label: string, concepts: TConcept[]) => {
  return getConceptName(label, concepts);
};

type TFilterKeys = keyof typeof QUERY_PARAMS;

const MAX_FILTER_CHARACTERS = 32;

const getFilterDisplayValue = (key: TFilterKeys, value: string, themeConfig: TThemeConfig) => {
  const filterDisplayLabel = themeConfig?.filters.find((f) => f.taxonomyKey === key).options.find((f) => f.slug === value);
  return filterDisplayLabel ? filterDisplayLabel.label : value;
};

const handleFilterDisplay = (
  filterChange: TFilterChange,
  queryParams: ParsedUrlQuery,
  key: TFilterKeys,
  value: string,
  countries: TGeography[],
  regions: TGeography[],
  themeConfig: TThemeConfig,
  concepts?: TConcept[]
) => {
  let filterLabel: string | null | undefined = null;
  let filterValue = value;
  switch (key) {
    case "category":
      const configCategory = themeConfig?.categories?.options.find((c) => c.slug === value);
      filterLabel = configCategory ? configCategory.label : value;
      break;
    case "country":
      filterLabel = handleCountryRegion(value, countries);
      break;
    case "region":
      filterLabel = handleCountryRegion(value, regions);
      break;
    case "concept_filters.name":
      filterLabel = handleConceptName(value, concepts);
      break;
    case "exact_match":
      filterLabel = value === "true" ? "Exact phrases only" : "Related phrases";
      break;
    case "sort_field":
      const field = queryParams[QUERY_PARAMS.sort_field];
      const order = queryParams[QUERY_PARAMS.sort_order];
      const sortOption = sortOptions.find((option) => option.value === `${field}:${order}`);
      filterLabel = sortOption?.label;
      break;
    case "sort_order":
      filterLabel = null;
      break;
    case "year_range":
      filterLabel = `${value.split(",")[0]} - ${value.split(",")[1]}`;
      filterValue = value.split(",")[0];
      break;
    case "query_string":
      filterLabel = `Search: ${value}`;
      break;
    //TODO: write a case for any remaining key that loops through the filters array on the config and then searches within the options where the key === taxonomyKey
    case "status":
      filterLabel = decodeURI(value);
      break;
    case "implementing_agency":
    case "topic":
    case "sector":
    case "author_type":
      filterLabel = value.length > MAX_FILTER_CHARACTERS ? `${decodeURI(value).substring(0, MAX_FILTER_CHARACTERS)}...` : decodeURI(value);
      break;
    case "fund":
    case "fund_doc_type":
    case "framework_laws":
      filterLabel = getFilterDisplayValue(key, value, themeConfig);
      break;
  }

  if (!filterLabel) {
    return null;
  }
  return (
    <Pill key={value} onClick={() => filterChange(QUERY_PARAMS[key], filterValue)}>
      {filterLabel}
    </Pill>
  );
};

// loop over the keys in QUERY_PARAMS and check if they are in the query string, if they are, display them as pills
// if the key is not in the query string, don't display it
const generatePills = (
  queryParams: ParsedUrlQuery,
  filterChange: TFilterChange,
  countries: TGeography[],
  regions: TGeography[],
  themeConfig: TThemeConfig,
  concepts?: TConcept[]
) => {
  let pills: JSX.Element[] = [];

  Object.keys(QUERY_PARAMS).map((key: TFilterKeys) => {
    const value = queryParams[QUERY_PARAMS[key]];
    if (value) {
      if (key === "year_range")
        return pills.push(handleFilterDisplay(filterChange, queryParams, key, value.toString(), countries, regions, themeConfig, concepts));
      if (Array.isArray(value)) {
        return value.map((v: string) => {
          return pills.push(handleFilterDisplay(filterChange, queryParams, key, v, countries, regions, themeConfig, concepts));
        });
      }
      return pills.push(handleFilterDisplay(filterChange, queryParams, key, value, countries, regions, themeConfig, concepts));
    } else {
      return;
    }
  });

  return pills;
};

export const AppliedFilters = ({ filterChange, concepts }: TProps) => {
  const router = useRouter();
  const configQuery = useConfig();
  const { themeConfig } = useGetThemeConfig();
  const { data: { countries = [], regions = [] } = {} } = configQuery;

  const appliedFilters = useMemo(
    () => generatePills(router.query, filterChange, countries, regions, themeConfig, concepts).map((pill) => pill),
    [router.query, filterChange, countries, regions, themeConfig, concepts]
  );

  if (appliedFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2" data-cy="applied-filters">
      {appliedFilters}
    </div>
  );
};
