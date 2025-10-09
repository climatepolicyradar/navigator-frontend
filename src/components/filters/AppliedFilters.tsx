import { ParsedUrlQuery } from "querystring";

import { useRouter } from "next/router";
import { useMemo } from "react";

import Pill from "@/components/Pill";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { sortOptions } from "@/constants/sortOptions";
import { getConceptName } from "@/helpers/getConceptFields";
import { getCountryName } from "@/helpers/getCountryFields";
import useConfig from "@/hooks/useConfig";
import useSubdivisions from "@/hooks/useSubdivisions";
import useGetThemeConfig from "@/hooks/useThemeConfig";
import { TConcept, TGeography, TThemeConfig, TGeographyWithDocumentCounts } from "@/types";

type TFilterChange = (type: string, value: string, clearOthersOfType?: boolean, otherValuesToClear?: string[]) => void;

interface IProps {
  filterChange: TFilterChange;
  concepts?: TConcept[];
  familyConcepts?: TConcept[];
}

const handleCountryRegion = (slug: string, dataSet: TGeography[]) => {
  return getCountryName(slug, dataSet);
};

const handleSubdivision = (iso_code: string, subdivisions: TGeographyWithDocumentCounts[]): string => {
  if (!subdivisions) {
    return null;
  }
  const subdivisionMatch = subdivisions.find((s) => s.code === iso_code);
  return subdivisionMatch?.name;
};

const handleConceptName = (label: string, concepts: TConcept[]) => {
  if (!concepts) {
    return label;
  }
  const conceptLabel = getConceptName(label, concepts);
  if (!conceptLabel) {
    return label;
  }
  return conceptLabel.charAt(0).toUpperCase() + conceptLabel.slice(1);
};

type TFilterKeys = keyof typeof QUERY_PARAMS;

const MAX_FILTER_CHARACTERS = 32;

const getFilterDisplayValue = (key: TFilterKeys, value: string, themeConfig: TThemeConfig) => {
  const filterDisplayLabel = themeConfig?.filters.find((f) => f.taxonomyKey === key)?.options.find((f) => f.slug === value);
  return filterDisplayLabel ? filterDisplayLabel.label : value;
};

const handleFilterDisplay = (
  filterChange: TFilterChange,
  queryParams: ParsedUrlQuery,
  key: TFilterKeys,
  value: string,
  countries: TGeography[],
  regions: TGeography[],
  subdivisions: TGeographyWithDocumentCounts[],
  themeConfig: TThemeConfig,
  concepts?: TConcept[],
  familyConcepts?: TConcept[]
) => {
  let filterLabel: string | null | undefined = null;
  let filterValue = value;
  let otherValuesToClear: string[] = [];
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
    case "subdivision":
      filterLabel = handleSubdivision(value, subdivisions);
      break;
    case "concept_name":
      filterLabel = handleConceptName(value, concepts);
      break;
    case "concept_preferred_label":
      filterLabel = handleConceptName(value, familyConcepts);
      // If we are removing a root concept, we should also remove all child concepts
      otherValuesToClear = familyConcepts?.filter((c) => c.recursive_subconcept_of.includes(value)).map((c) => c.wikibase_id) || [];
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
    case "_document.type":
      filterLabel = getFilterDisplayValue(key, value, themeConfig);
      break;
  }

  if (!filterLabel) {
    return null;
  }

  return (
    <Pill key={value} onClick={() => filterChange(QUERY_PARAMS[key], filterValue, false, otherValuesToClear)}>
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
  subdivisions: TGeographyWithDocumentCounts[],
  themeConfig: TThemeConfig,
  concepts?: TConcept[],
  familyConcepts?: TConcept[]
) => {
  const pills: JSX.Element[] = [];

  Object.keys(QUERY_PARAMS).map((key: TFilterKeys) => {
    const value = queryParams[QUERY_PARAMS[key]];

    // Exclude the search query from pills as it displays in NavSearch instead
    if (key === "query_string") return;

    if (value) {
      if (key === "year_range")
        return pills.push(handleFilterDisplay(filterChange, queryParams, key, value.toString(), countries, regions, subdivisions, themeConfig));
      if (Array.isArray(value)) {
        return value.map((v: string) => {
          return pills.push(
            handleFilterDisplay(filterChange, queryParams, key, v, countries, regions, subdivisions, themeConfig, concepts, familyConcepts)
          );
        });
      }
      return pills.push(
        handleFilterDisplay(filterChange, queryParams, key, value, countries, regions, subdivisions, themeConfig, concepts, familyConcepts)
      );
    } else {
      return;
    }
  });

  return pills;
};

export const AppliedFilters = ({ filterChange, concepts, familyConcepts }: IProps) => {
  const router = useRouter();
  const configQuery = useConfig();
  const { themeConfig } = useGetThemeConfig();
  const { data: { countries = [], regions = [] } = {} } = configQuery;
  const subdivisionQuery = useSubdivisions();
  const { data: subdivisions = [] } = subdivisionQuery;

  const appliedFilters = useMemo(
    () => generatePills(router.query, filterChange, countries, regions, subdivisions, themeConfig, concepts, familyConcepts).map((pill) => pill),
    [router.query, filterChange, countries, regions, subdivisions, themeConfig, concepts, familyConcepts]
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
