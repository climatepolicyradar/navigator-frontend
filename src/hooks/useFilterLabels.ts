import { useEffect, useState } from "react";

import { fetchGeographiesAggregate } from "@/api/search";
import { useEnvConfig } from "@/context/EnvConfig";
import { loadFilteredLabels, loadLabelTaxonomy, loadGeographyTaxonomy } from "@/hooks/useLabelSearch";
import { GeographyTypeV2, TApiGeographyLabelCount, TFeatures, TSearchLabel, TSearchQueryGroup, TThemeConfig } from "@/types";

interface IProps {
  features: TFeatures;
  themeConfig: TThemeConfig;
}

const SUBDIVISION_LABEL_TYPE = "subdivision";

/**
 * Drop subdivisions this app holds no documents for, so the filter cannot offer a value that returns nothing.
 * @see: https://linear.app/climate-policy-radar/issue/FUS-842
 *
 * Regions and countries are left alone - they are the hierarchy subdivisions hang off, and hiding a country
 * would orphan its subdivisions. An empty aggregate (request failed, or endpoint not deployed) keeps every
 * subdivision, so the filter falls back to its previous behaviour rather than emptying.
 */
export const filterSubdivisionsWithData = (geographyLabels: TSearchLabel[], subdivisionIdsWithData: Set<string>): TSearchLabel[] => {
  if (subdivisionIdsWithData.size === 0) return geographyLabels;
  return geographyLabels.filter((label) => label.type !== SUBDIVISION_LABEL_TYPE || subdivisionIdsWithData.has(label.id));
};

export const useFilterLabels = ({ features, themeConfig }: IProps) => {
  const { API_URL } = useEnvConfig();
  const { searchCategories, searchExcludeLabels } = themeConfig;
  const [loaded, setLoaded] = useState(false);
  const [filters, setFilters] = useState<TSearchLabel[]>([]);

  useEffect(() => {
    const geographyTypes: GeographyTypeV2[] = ["region", "country"];
    const searchQueryGroup: TSearchQueryGroup = {
      op: "or",
      filters: [
        {
          field: "type",
          op: "contains",
          value: "concept",
        },
        {
          field: "type",
          op: "contains",
          value: "author",
        },
      ],
    };
    if (features.subdivisions) {
      geographyTypes.push("subdivision");
    }
    if (searchCategories.includes("Litigation")) {
      searchQueryGroup.filters.push(
        {
          field: "type",
          op: "contains",
          value: "jurisdiction",
        },
        {
          field: "type",
          op: "contains",
          value: "case_category",
        },
        {
          field: "type",
          op: "contains",
          value: "principal_law",
        }
      );
    }

    const excludeLabelRules: TSearchQueryGroup["filters"] = searchExcludeLabels.map((id) => ({
      field: "id",
      op: "not_contains",
      value: id,
    }));

    const filterGroup: TSearchQueryGroup = excludeLabelRules.length
      ? { op: "and", filters: [searchQueryGroup, ...excludeLabelRules] }
      : searchQueryGroup;

    const loadedFilteredLabels = loadFilteredLabels(API_URL, filterGroup);

    // We have to append this data until the label -> label relationship data is available from data-lake
    // @see: https://linear.app/climate-policy-radar/issue/FUS-823/write-up-the-current-state-of-play-of-label-label-relationships
    const loadedLabelTaxonomy = loadLabelTaxonomy(API_URL);
    const loadedGeographiesTaxonomy = loadGeographyTaxonomy(API_URL, geographyTypes);

    // The taxonomy is a hardcoded list, so it cannot say which subdivisions this app holds documents for.
    // Only the aggregate can. A failure is not fatal: we keep the unfiltered list rather than emptying the filter.
    const loadedSubdivisionsWithData: Promise<TApiGeographyLabelCount[]> = features.subdivisions
      ? fetchGeographiesAggregate({
          apiUrl: API_URL,
          themeConfig: { searchCategories, searchExcludeLabels } as TThemeConfig,
          geographyTypes: [SUBDIVISION_LABEL_TYPE],
        }).catch((): TApiGeographyLabelCount[] => [])
      : Promise.resolve([]);

    const allFilterLabels = Promise.all([loadedFilteredLabels, loadedLabelTaxonomy, loadedGeographiesTaxonomy, loadedSubdivisionsWithData]);

    allFilterLabels
      .then(([filteredLabels, labelsTaxonomy, geographiesTaxonomy, subdivisionsWithData]) => {
        const subdivisionIdsWithData = new Set(subdivisionsWithData.map((geography) => geography.id));
        setFilters([...filteredLabels, ...labelsTaxonomy, ...filterSubdivisionsWithData(geographiesTaxonomy, subdivisionIdsWithData)]);
      })
      .finally(() => {
        setLoaded(true);
      });
  }, [features.subdivisions, searchCategories, searchExcludeLabels, API_URL]);

  return {
    filters,
    loaded,
  };
};
