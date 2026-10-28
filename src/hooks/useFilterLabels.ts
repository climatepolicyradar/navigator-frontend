import { useEffect, useState } from "react";

import { useEnvConfig } from "@/context/EnvConfig";
import { loadFilteredLabels, loadLabelTaxonomy, loadGeographyTaxonomy } from "@/hooks/useLabelSearch";
import { GeographyTypeV2, TFeatures, TSearchLabel, TSearchQueryGroup, TThemeConfig } from "@/types";

interface IProps {
  features: TFeatures;
  themeConfig: TThemeConfig;
}

export const useFilterLabels = ({ features, themeConfig }: IProps) => {
  const { API_URL } = useEnvConfig();
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
    if (themeConfig.searchCategories.includes("Litigation")) {
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

    const loadedFilteredLabels = loadFilteredLabels(API_URL, searchQueryGroup);

    // We have to append this data until the label -> label relationship data is available from data-lake
    // @see: https://linear.app/climate-policy-radar/issue/FUS-823/write-up-the-current-state-of-play-of-label-label-relationships
    const loadedLabelTaxonomy = loadLabelTaxonomy(API_URL);
    const loadedGeographiesTaxonomy = loadGeographyTaxonomy(API_URL, geographyTypes);
    const allFilterLabels = Promise.all([loadedFilteredLabels, loadedLabelTaxonomy, loadedGeographiesTaxonomy]);

    allFilterLabels
      .then(([filteredLabels, labelsTaxonomy, geographiesTaxonomy]) => {
        setFilters([...filteredLabels, ...labelsTaxonomy, ...geographiesTaxonomy]);
      })
      .finally(() => {
        setLoaded(true);
      });
  }, [features.subdivisions, themeConfig.searchCategories, API_URL]);

  return {
    filters,
    loaded,
  };
};
