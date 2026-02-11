import { Button } from "@base-ui/react/button";

export interface SuggestedFiltersProps {
  searchTerm: string;
  selectedTopics: string[];
  selectedGeos: string[];
  selectedYears: string[];
  selectedDocumentTypes: string[];
  onSelectConcept: (concept: string) => void;
  onSelectGeo: (geo: string) => void;
  onSelectYear: (year: string) => void;
  onSelectDocumentType: (documentType: string) => void;
  onApplyAll: (matches: { concepts: string[]; geos: string[]; years: string[]; documentTypes: string[] }) => void;
  onSearchOnly: () => void;
}

const TOPICS = ["flood defence", "targets"];
const GEOS = ["spain", "france", "germany"];
const DOCUMENT_TYPES = ["laws", "policies", "reports", "litigation"];
const findMatches = (searchTerm: string) => {
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

  const matchedConcepts = TOPICS.filter((topic) => searchTerm.toLowerCase().includes(topic.toLowerCase()));
  const matchedGeos = GEOS.filter((geo) => searchTerm.toLowerCase().includes(geo.toLowerCase()));
  const matchedDocumentTypes = DOCUMENT_TYPES.filter((documentType) => searchTerm.toLowerCase().includes(documentType.toLowerCase()));
  return { matchedConcepts, matchedGeos, matchedYears, matchedDocumentTypes };
};

export const SuggestedFilters = ({
  searchTerm,
  selectedTopics,
  selectedGeos,
  selectedYears,
  selectedDocumentTypes,
  onSelectConcept,
  onSelectGeo,
  onSelectYear,
  onSelectDocumentType,
  onApplyAll,
  onSearchOnly,
}: SuggestedFiltersProps) => {
  if (searchTerm.length === 0) return null;

  const { matchedConcepts, matchedGeos, matchedYears, matchedDocumentTypes } = findMatches(searchTerm);

  const hasMatches = matchedConcepts.length > 0 || matchedGeos.length > 0 || matchedYears.length > 0 || matchedDocumentTypes.length > 0;

  return (
    <div className="space-y-3">
      <h2 className="mb-1 text-sm font-semibold text-text-primary">Suggested filters</h2>
      {hasMatches ? (
        <p className="mb-1 text-xs text-text-secondary">
          Based on your search <span className="font-semibold">&ldquo;{searchTerm}&rdquo;</span>, we have found the following:
        </p>
      ) : null}
      <ul className="space-y-3 text-sm text-text-primary">
        {!hasMatches && (
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

      {hasMatches && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            onClick={() =>
              onApplyAll({
                concepts: matchedConcepts,
                geos: matchedGeos,
                years: matchedYears,
                documentTypes: matchedDocumentTypes,
              })
            }
            className="inline-flex items-center rounded-full bg-text-brand px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-text-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-text-brand"
          >
            Apply all filters
          </Button>
          <span className="text-xs text-text-tertiary">or</span>
          <Button
            onClick={onSearchOnly}
            className="inline-flex items-center rounded-full border border-border-lighter bg-white px-4 py-2 text-xs font-medium text-text-primary hover:bg-surface-light"
          >
            Search &ldquo;{searchTerm}&rdquo; only
          </Button>
        </div>
      )}
    </div>
  );
};
