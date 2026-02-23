import { TFilterFieldOptions, TGeography, TCorpusTypeDictionary } from "@/types";
import type { ISearchApiLabel } from "@/utils/_experiment/shadowSearchLabelsApi";

const YEAR_MIN = 1900;
const YEAR_MAX = 2100;

/** Normalise for matching: trim, lower case. */
function norm(s: string): string {
  return s.trim().toLowerCase();
}

/** Check if a string looks like a year (4 digits in range). */
function isYearLike(title: string): boolean {
  if (!/^\d{4}$/.test(title.trim())) return false;
  const y = parseInt(title.trim(), 10);
  return y >= YEAR_MIN && y <= YEAR_MAX;
}

export type PartitionLabelsConfig = {
  regions?: TGeography[];
  countries?: TGeography[];
  corpusTypes?: TCorpusTypeDictionary;
  /** Topic preferred_label values from concepts (for matching label titles to topics). */
  topicLabels?: string[];
};

/**
 * Partitions labels from GET /search/labels into filter dimensions by
 * cross-referencing with config. Label titles are matched to config
 * display values so we show the right bucket (Topics, Geographies, Years, Document types).
 * Unmatched labels are placed in topic so they remain selectable; filter payload
 * still uses label title so /search/documents matches correctly.
 *
 * @param labels - Labels from the search labels API
 * @param config - Config and topic labels for matching
 * @returns TFilterFieldOptions with label titles per dimension
 */
export function partitionLabelsByConfig(labels: ISearchApiLabel[], config: PartitionLabelsConfig): TFilterFieldOptions {
  const topicSet = new Set<string>();
  const geoSet = new Set<string>();
  const yearSet = new Set<string>();
  const docTypeSet = new Set<string>();

  const geoValues = [...(config.regions ?? []).map((g) => g.display_value), ...(config.countries ?? []).map((g) => g.display_value)].filter(Boolean);
  const geoNormToDisplay = new Map<string, string>();
  for (const v of geoValues) {
    geoNormToDisplay.set(norm(v), v);
  }

  const topicLabels = config.topicLabels ?? [];
  const topicNormToDisplay = new Map<string, string>();
  for (const v of topicLabels) {
    if (v) topicNormToDisplay.set(norm(v), v);
  }

  const docTypeValues =
    config.corpusTypes && Object.keys(config.corpusTypes).length > 0
      ? Object.values(config.corpusTypes)
          .map((c) => c.corpus_type_name)
          .filter(Boolean)
      : [];
  const docTypeNormToDisplay = new Map<string, string>();
  for (const v of docTypeValues) {
    docTypeNormToDisplay.set(norm(v), v);
  }

  for (const label of labels) {
    const title = label.title?.trim() ?? "";
    if (!title) continue;
    const n = norm(title);
    let placed = false;
    if (geoNormToDisplay.has(n)) {
      geoSet.add(title);
      placed = true;
    }
    if (docTypeNormToDisplay.has(n)) {
      docTypeSet.add(title);
      placed = true;
    }
    if (topicNormToDisplay.has(n)) {
      topicSet.add(title);
      placed = true;
    }
    if (isYearLike(title)) {
      yearSet.add(title);
      placed = true;
    }
    if (!placed) {
      topicSet.add(title);
    }
  }

  const sortStr = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" });
  return {
    topic: [...topicSet].sort(sortStr),
    geography: [...geoSet].sort(sortStr),
    year: [...yearSet].sort(sortStr),
    documentType: [...docTypeSet].sort(sortStr),
  };
}
