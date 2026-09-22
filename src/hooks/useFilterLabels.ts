import { useContext, useEffect, useState } from "react";

import { FeaturesContext } from "@/context/FeaturesContext";
import { loadFilteredLabels, loadLabelTaxonomy } from "@/hooks/useLabelSearch";
import { TSearchLabel, TSearchQueryGroup } from "@/types";

export const useFilterLabels = (): TSearchLabel[] => {
  const features = useContext(FeaturesContext);
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
