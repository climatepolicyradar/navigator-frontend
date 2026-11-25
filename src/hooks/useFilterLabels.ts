import { useMemo } from "react";

import { configureDocumentsFilters, PRINCIPAL_DOCUMENTS_FILTER } from "@/api/search";
import { SUBDIVISION_LABEL_PATTERN } from "@/constants/labels";
import { useTaxonomy } from "@/hooks/useTaxonomy";
import { TFeatures, TThemeConfig } from "@/types";
import { pruneTaxonomy } from "@/utils/filters/pruneTaxonomy";

interface IProps {
  features: TFeatures;
  themeConfig: TThemeConfig;
}

export const useFilterLabels = ({ features, themeConfig }: IProps) => {
  const { searchLabelPatterns } = themeConfig;

  const { labels, labelNames, loaded } = useTaxonomy({
    patterns: features.subdivisions ? [...searchLabelPatterns, SUBDIVISION_LABEL_PATTERN] : searchLabelPatterns,
    filters: configureDocumentsFilters({ op: "and", filters: [PRINCIPAL_DOCUMENTS_FILTER] }, themeConfig, features),
  });

  const filters = useMemo(() => pruneTaxonomy(labels), [labels]);
  return { filters, labelNames, loaded };
};
