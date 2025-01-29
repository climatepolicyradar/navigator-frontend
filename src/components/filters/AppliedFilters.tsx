import { useMemo } from "react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

import useConfig from "@hooks/useConfig";
import useGetThemeConfig from "@hooks/useThemeConfig";

import Pill from "@components/Pill";

import { getCountryName } from "@helpers/getCountryFields";

import { QUERY_PARAMS } from "@constants/queryParams";
import { sortOptions } from "@constants/sortOptions";

import { TGeography, TQueryStrings, TThemeConfig } from "@types";

type TFilterChange = (type: string, value: string) => void;

type TProps = {
  filterChange: TFilterChange;
};

const handleCountryRegion = (slug: string, dataSet: TGeography[]) => {
  return getCountryName(slug, dataSet);
};

type TFilterKeys = keyof TQueryStrings;

const MAX_FILTER_CHARACTERS = 32;

const handleFilterDisplay = (
  filterChange: TFilterChange,
  queryParams: ParsedUrlQuery,
  key: TFilterKeys,
  value: string,
  countries: TGeography[],
  regions: TGeography[],
  themeConfig: TThemeConfig
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
    //TODO: write a case for any remainding key that loops through the filters array on the config and then searches within the options where the key === taxonomyKey
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
      filterLabel = value;
      const fund = themeConfig?.filters.find((f) => f.taxonomyKey === "fund").options.find((f) => f.slug === value);
      filterLabel = fund ? fund.label : value;
      break;
    case "framework_laws":
      filterLabel = value;
      const framework = themeConfig?.filters.find((f) => f.taxonomyKey === "framework_laws").options.find((f) => f.slug === value);
      filterLabel = framework ? framework.label : value;
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
  themeConfig: TThemeConfig
) => {
  let pills: JSX.Element[] = [];

  Object.keys(QUERY_PARAMS).map((key: TFilterKeys) => {
    const value = queryParams[QUERY_PARAMS[key]];
    if (value) {
      if (key === "year_range")
        return pills.push(handleFilterDisplay(filterChange, queryParams, key, value.toString(), countries, regions, themeConfig));
      if (Array.isArray(value)) {
        return value.map((v: string) => {
          return pills.push(handleFilterDisplay(filterChange, queryParams, key, v, countries, regions, themeConfig));
        });
      }
      return pills.push(handleFilterDisplay(filterChange, queryParams, key, value, countries, regions, themeConfig));
    } else {
      return;
    }
  });

  return pills;
};

export const AppliedFilters = ({ filterChange }: TProps) => {
  const router = useRouter();
  const configQuery = useConfig();
  const { themeConfig } = useGetThemeConfig();
  const { data: { countries = [], regions = [] } = {} } = configQuery;

  const appliedFilters = useMemo(
    () => generatePills(router.query, filterChange, countries, regions, themeConfig).map((pill) => pill),
    [router.query, filterChange, countries, regions, themeConfig]
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
