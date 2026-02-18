import { TFilterFieldOptions } from "@/types";

/**
 * Matches for a search term against each filter dimension (concepts, geos, years, document types).
 * Used by suggested filters UI and shadow search state.
 */
export type TSuggestedFilterMatches = {
  matchedConcepts: string[];
  matchedGeos: string[];
  matchedYears: string[];
  matchedDocumentTypes: string[];
};

const DEFAULT_OPTIONS: TFilterFieldOptions = {
  topic: ["flood defence", "targets"],
  geography: ["spain", "france", "germany"],
  year: ["2020", "2021", "2022", "2023", "2024"],
  documentType: ["laws", "policies", "reports", "litigation"],
};

/**
 * Returns suggested filter matches for a search term. Uses options when
 * provided (real data); otherwise falls back to default hardcoded lists.
 *
 * @param searchTerm - User input to match against filter options
 * @param options - Optional field options (topics, geographies, years, document types)
 * @returns Matched values per dimension
 */
export function getSuggestedFilterMatches(searchTerm: string, options?: TFilterFieldOptions): TSuggestedFilterMatches {
  const opts = options ?? DEFAULT_OPTIONS;
  if (!searchTerm) {
    return {
      matchedConcepts: [],
      matchedGeos: [],
      matchedYears: [],
      matchedDocumentTypes: [],
    };
  }

  const matchedYears: string[] = [];
  const rawSearchTermParts = searchTerm.trim().split(" ");
  for (let i = 0; i < rawSearchTermParts.length; i += 1) {
    const year = parseInt(rawSearchTermParts[i], 10);
    if (!Number.isNaN(year) && year >= 1900 && year <= 2100 && opts.year.includes(year.toString())) {
      matchedYears.push(year.toString());
    }
  }

  const lowerSearch = searchTerm.toLowerCase();
  const matchedConcepts = opts.topic.filter((topic) => lowerSearch.includes(topic.toLowerCase()));
  const matchedGeos = opts.geography.filter((geo) => lowerSearch.includes(geo.toLowerCase()));
  const matchedDocumentTypes = opts.documentType.filter((dt) => lowerSearch.includes(dt.toLowerCase()));
  return { matchedConcepts, matchedGeos, matchedYears, matchedDocumentTypes };
}
