import { Button } from "@base-ui/react/button";

export type SuggestedFilterMatches = {
  matchedConcepts: string[];
  matchedGeos: string[];
  matchedYears: string[];
  matchedDocumentTypes: string[];
};

export interface SuggestedFiltersProps {
  searchTerm: string;
  matches: SuggestedFilterMatches;
  selectedTopics: string[];
  selectedGeos: string[];
  selectedYears: string[];
  selectedDocumentTypes: string[];
  onSelectConcept: (concept: string) => void;
  onSelectGeo: (geo: string) => void;
  onSelectYear: (year: string) => void;
  onSelectDocumentType: (documentType: string) => void;
  showHeader?: boolean;
  showEmptyCopy?: boolean;
}

const TOPICS = ["flood defence", "targets"];
const GEOS = ["spain", "france", "germany"];
const DOCUMENT_TYPES = ["laws", "policies", "reports", "litigation"];

export const getSuggestedFilterMatches = (searchTerm: string): SuggestedFilterMatches => {
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
    if (!Number.isNaN(year) && year >= 1900 && year <= 2100) {
      matchedYears.push(year.toString());
    }
  }

  const lowerSearch = searchTerm.toLowerCase();
  const matchedConcepts = TOPICS.filter((topic) => lowerSearch.includes(topic.toLowerCase()));
  const matchedGeos = GEOS.filter((geo) => lowerSearch.includes(geo.toLowerCase()));
  const matchedDocumentTypes = DOCUMENT_TYPES.filter((documentType) => lowerSearch.includes(documentType.toLowerCase()));
  return { matchedConcepts, matchedGeos, matchedYears, matchedDocumentTypes };
};

export const SuggestedFilters = ({
  searchTerm,
  matches,
  selectedTopics,
  selectedGeos,
  selectedYears,
  selectedDocumentTypes,
  onSelectConcept,
  onSelectGeo,
  onSelectYear,
  onSelectDocumentType,
  showHeader = true,
  showEmptyCopy = true,
}: SuggestedFiltersProps) => {
  const { matchedConcepts, matchedGeos, matchedYears, matchedDocumentTypes } = matches;

  const remainingConcepts = matchedConcepts.filter((concept) => !selectedTopics.includes(concept));
  const remainingGeos = matchedGeos.filter((geo) => !selectedGeos.includes(geo));
  const remainingYears = matchedYears.filter((year) => !selectedYears.includes(year));
  const remainingDocumentTypes = matchedDocumentTypes.filter((documentType) => !selectedDocumentTypes.includes(documentType));

  const hasAnyOriginalMatches = matchedConcepts.length > 0 || matchedGeos.length > 0 || matchedYears.length > 0 || matchedDocumentTypes.length > 0;

  const hasRemainingSuggestions =
    remainingConcepts.length > 0 || remainingGeos.length > 0 || remainingYears.length > 0 || remainingDocumentTypes.length > 0;

  // If there were matches but the user has already added all of them as filters,
  // do not show an empty "suggested filters" block.
  if (!hasRemainingSuggestions && hasAnyOriginalMatches) {
    return null;
  }

  return (
    <div className="space-y-3">
      {showHeader && (
        <>
          <h2 className="mb-1 text-sm font-semibold text-text-primary">Suggested filters</h2>
          {hasRemainingSuggestions && (
            <p className="mb-1 text-xs text-text-secondary">
              Based on your search <span className="font-semibold">&ldquo;{searchTerm}&rdquo;</span>, we have found the following:
            </p>
          )}
        </>
      )}
      <ul className="space-y-3 text-sm text-text-primary">
        {!hasAnyOriginalMatches && searchTerm.length > 0 && showEmptyCopy && (
          <li className="text-xs text-text-tertiary">
            We will show filter suggestions here once your search includes recognised topics, geographies, years or document types.
          </li>
        )}

        {remainingConcepts.length > 0 && (
          <li>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-text-tertiary">Topics</p>
            <div className="flex flex-wrap gap-2">
              {remainingConcepts.map((concept) => (
                <Button
                  key={concept}
                  onClick={() => onSelectConcept(concept)}
                  className="inline-flex items-center rounded-full bg-surface-light px-3 py-1.5 text-[11px] font-medium text-text-primary hover:bg-surface-ui"
                >
                  {concept}
                </Button>
              ))}
            </div>
          </li>
        )}

        {remainingGeos.length > 0 && (
          <li>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-text-tertiary">Geographies</p>
            <div className="flex flex-wrap gap-2">
              {remainingGeos.map((geo) => (
                <Button
                  key={geo}
                  onClick={() => onSelectGeo(geo)}
                  className="inline-flex items-center rounded-full bg-surface-light px-3 py-1.5 text-[11px] font-medium text-text-primary hover:bg-surface-ui"
                >
                  {geo}
                </Button>
              ))}
            </div>
          </li>
        )}

        {remainingYears.length > 0 && (
          <li>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-text-tertiary">Years</p>
            <div className="flex flex-wrap gap-2">
              {remainingYears.map((year) => (
                <Button
                  key={year}
                  onClick={() => onSelectYear(year)}
                  className="inline-flex items-center rounded-full bg-surface-light px-3 py-1.5 text-[11px] font-medium text-text-primary hover:bg-surface-ui"
                >
                  {year}
                </Button>
              ))}
            </div>
          </li>
        )}

        {remainingDocumentTypes.length > 0 && (
          <li>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-text-tertiary">Document types</p>
            <div className="flex flex-wrap gap-2">
              {remainingDocumentTypes.map((documentType) => (
                <Button
                  key={documentType}
                  onClick={() => onSelectDocumentType(documentType)}
                  className="inline-flex items-center rounded-full bg-surface-light px-3 py-1.5 text-[11px] font-medium text-text-primary hover:bg-surface-ui"
                >
                  {documentType}
                </Button>
              ))}
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};
