import { useEffect, useState } from "react";

import { configureDocumentsFilters } from "@/api/search";
import { ID_SEPARATOR } from "@/constants/chars";
import { useEnvConfig } from "@/context/EnvConfig";
import { loadTaxonomy } from "@/hooks/useLabelSearch";
import { TFeatures, TNestedSearchLabel, TThemeConfig } from "@/types";
import { pruneTaxonomy } from "@/utils/filters/pruneTaxonomy";

interface IProps {
  features: TFeatures;
  themeConfig: TThemeConfig;
}

const SUBDIVISION_LABEL_TYPE = "subdivision";
const TAXONOMY_TYPES = ["domain", "region", "concept"];

const withoutTypes = (labels: TNestedSearchLabel[], excludedTypes: string[]): TNestedSearchLabel[] => {
  if (excludedTypes.length === 0) return labels;
  return labels
    .filter((label) => !excludedTypes.includes(label.type))
    .map((label) => ({ ...label, children: withoutTypes(label.children, excludedTypes) }));
};

export const useFilterLabels = ({ features, themeConfig }: IProps) => {
  const { API_URL } = useEnvConfig();
  const { searchCategories, searchExcludeLabels } = themeConfig;
  const [loaded, setLoaded] = useState(false);
  const [filters, setFilters] = useState<TNestedSearchLabel[]>([]);

  useEffect(() => {
    const excludedTypes = features.subdivisions ? [] : [SUBDIVISION_LABEL_TYPE];
    loadTaxonomy(API_URL, {
      types: TAXONOMY_TYPES,
      ids: searchCategories.map((category) => ["category", category].join(ID_SEPARATOR)),
      filters: configureDocumentsFilters(undefined, searchCategories, searchExcludeLabels),
    })
      .then((labels) => setFilters(pruneTaxonomy(withoutTypes(labels, excludedTypes))))
      .finally(() => setLoaded(true));
  }, [features.subdivisions, searchCategories, searchExcludeLabels, API_URL]);

  return { filters, loaded };
};
