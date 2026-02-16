import { TFilterFieldOptions, TGeography, TCorpusTypeDictionary } from "@/types";
import type { TTopic } from "@/types";

const YEAR_START = 1990;

/**
 * Builds filter field options from real data. Returns empty arrays when a
 * source is missing or empty; no default/placeholder values.
 */
export function buildFilterFieldOptions(params: {
  topics?: TTopic[];
  regions?: TGeography[];
  countries?: TGeography[];
  corpusTypes?: TCorpusTypeDictionary;
}): TFilterFieldOptions {
  const topicLabels =
    params.topics?.length > 0
      ? [...params.topics.map((t) => t.preferred_label).filter(Boolean)].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
      : [];

  const geographyLabels =
    params.regions?.length || params.countries?.length
      ? [...(params.regions ?? []).map((g) => g.display_value), ...(params.countries ?? []).map((g) => g.display_value)]
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
      : [];

  const documentTypeLabels =
    params.corpusTypes && Object.keys(params.corpusTypes).length > 0
      ? Object.values(params.corpusTypes)
          .map((c) => c.corpus_type_name)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
      : [];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - YEAR_START + 3 }, (_, i) => (YEAR_START + i).toString()).reverse();

  return {
    topic: topicLabels,
    geography: geographyLabels,
    year: years,
    documentType: documentTypeLabels,
  };
}
