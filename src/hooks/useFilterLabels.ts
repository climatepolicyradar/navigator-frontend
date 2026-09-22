import { useEffect, useState } from "react";

import { loadFilteredLabels, loadLabelTaxonomy } from "@/hooks/useLabelSearch";
import { TFeatures, TSearchLabel, TSearchQueryGroup } from "@/types";

interface IProps {
  features: TFeatures;
}

export const useFilterLabels = ({ features }: IProps): TSearchLabel[] => {
  const [availableFilters, setAvailableFilters] = useState<TSearchLabel[]>([]);

  useEffect(() => {
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
          value: "region",
        },
        {
          field: "type",
          op: "contains",
          value: "country",
        },
      ],
    };
    if (features.subdivisions) {
      searchQueryGroup.filters.push({
        field: "type",
        op: "contains",
        value: "subdivision",
      });
    }

    const loadedFilteredLabels = loadFilteredLabels(searchQueryGroup);

    // We have to append this data until the categories taxonomy data source data is fixed
    // @see: https://linear.app/climate-policy-radar/issue/APP-2266/fusion-enrichment-fleshing-out-the-publishedcanonicallabels
    const loadedLabelTaxonomy = loadLabelTaxonomy();
    const allFilterLabels = Promise.all([loadedFilteredLabels, loadedLabelTaxonomy]);

    allFilterLabels.then(([filteredLabels, labelTaxonomy]) => setAvailableFilters([...filteredLabels, ...labelTaxonomy]));
  }, [features.subdivisions]);

  return availableFilters;
};
