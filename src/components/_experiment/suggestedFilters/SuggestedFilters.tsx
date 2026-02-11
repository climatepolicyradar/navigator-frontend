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
  const hasMatches = matchedConcepts.length > 0 || matchedGeos.length > 0 || matchedYears.length > 0 || matchedDocumentTypes.length > 0;

  return (
    <div className="space-y-3">
      {showHeader && (
        <>
          <h2 className="mb-1 text-sm font-semibold text-text-primary">Suggested filters</h2>
          {hasMatches && (
            <p className="mb-1 text-xs text-text-secondary">
              Based on your search <span className="font-semibold">&ldquo;{searchTerm}&rdquo;</span>, we have found the following:
            </p>
          )}
        </>
      )}
      <ul className="space-y-3 text-sm text-text-primary">
        {!hasMatches && searchTerm.length > 0 && showEmptyCopy && (
          <li className="text-xs text-text-tertiary">
            We will show filter suggestions here once your search includes recognised topics, geographies, years or document types.
          </li>
        )}

        {matchedConcepts.length > 0 && (
          <li>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-text-tertiary">Topics</p>
            <div className="flex flex-wrap gap-2">
              {matchedConcepts
                .filter((concept) => !selectedTopics.includes(concept))
                .map((concept) => (
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

        {matchedGeos.length > 0 && (
          <li>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-text-tertiary">Geographies</p>
            <div className="flex flex-wrap gap-2">
              {matchedGeos
                .filter((geo) => !selectedGeos.includes(geo))
                .map((geo) => (
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

        {matchedYears.length > 0 && (
          <li>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-text-tertiary">Years</p>
            <div className="flex flex-wrap gap-2">
              {matchedYears
                .filter((year) => !selectedYears.includes(year))
                .map((year) => (
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

        {matchedDocumentTypes.length > 0 && (
          <li>
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-text-tertiary">Document types</p>
            <div className="flex flex-wrap gap-2">
              {matchedDocumentTypes
                .filter((documentType) => !selectedDocumentTypes.includes(documentType))
                .map((documentType) => (
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
