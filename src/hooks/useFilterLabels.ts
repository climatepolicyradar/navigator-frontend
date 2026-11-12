import { useEffect, useState } from "react";

import { configureDocumentsFilters } from "@/api/search";
import { SUBDIVISION_LABEL_PATTERN } from "@/constants/labels";
import { useEnvConfig } from "@/context/EnvConfig";
import { loadTaxonomy } from "@/hooks/useLabelSearch";
import { TFeatures, TNestedSearchLabel, TThemeConfig } from "@/types";
import { pruneTaxonomy } from "@/utils/filters/pruneTaxonomy";

interface IProps {
  features: TFeatures;
  themeConfig: TThemeConfig;
}

export const useFilterLabels = ({ features, themeConfig }: IProps) => {
  const { API_URL } = useEnvConfig();
  const { searchCategories, searchExcludeLabels, searchLabelPatterns } = themeConfig;
  const [loaded, setLoaded] = useState(false);
  const [filters, setFilters] = useState<TNestedSearchLabel[]>([]);

  useEffect(() => {
    const patterns = features.subdivisions ? [...searchLabelPatterns, SUBDIVISION_LABEL_PATTERN] : searchLabelPatterns;
    loadTaxonomy(API_URL, {
      patterns,
      filters: configureDocumentsFilters(undefined, searchCategories, searchExcludeLabels),
    })
      .then((labels) => setFilters(pruneTaxonomy(labels)))
      .finally(() => setLoaded(true));
  }, [features.subdivisions, searchCategories, searchExcludeLabels, searchLabelPatterns, API_URL]);

  return { filters, loaded };
};
