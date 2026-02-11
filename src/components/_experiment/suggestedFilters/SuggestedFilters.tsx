import { Button } from "@base-ui/react/button";

export interface SuggestedFiltersProps {
  searchTerm: string;
  matchedConcepts: string[];
  matchedGeos: string[];
  matchedYears: string[];
  selectedTopics: string[];
  selectedGeos: string[];
  selectedYears: string[];
  onSelectConcept: (concept: string) => void;
  onSelectGeo: (geo: string) => void;
  onSelectYear: (year: string) => void;
  onApplyAll: () => void;
  onSearchOnly: () => void;
}

export const SuggestedFilters = ({
  searchTerm,
  matchedConcepts,
  matchedGeos,
  matchedYears,
  selectedTopics,
  selectedGeos,
  selectedYears,
  onSelectConcept,
  onSelectGeo,
  onSelectYear,
  onApplyAll,
  onSearchOnly,
}: SuggestedFiltersProps) => {
  if (searchTerm.length === 0) return null;

  const hasMatches = matchedConcepts.length > 0 || matchedGeos.length > 0 || matchedYears.length > 0;

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-text-primary">Suggested filters</h2>
      {hasMatches ? (
        <p className="text-xs text-text-secondary">Based on your search &ldquo;{searchTerm}&rdquo;, we have found the following:</p>
      ) : (
        <p className="text-xs text-text-tertiary">
          We will show filter suggestions here once your search includes recognised topics, geographies or years.
        </p>
      )}
      <ul className="space-y-2 text-sm text-text-primary">
        {matchedConcepts.length > 0 && (
          <li>
            <p className="mb-1 text-xs text-text-tertiary">Topics</p>
            <div className="flex flex-wrap gap-2">
              {matchedConcepts
                .filter((concept) => !selectedTopics.includes(concept))
                .map((concept) => (
                  <Button key={concept} onClick={() => onSelectConcept(concept)}>
                    {concept}
                  </Button>
                ))}
            </div>
          </li>
        )}

        {matchedGeos.length > 0 && (
          <li>
            <p className="mb-1 text-xs text-text-tertiary">Geographies</p>
            <div className="flex flex-wrap gap-2">
              {matchedGeos
                .filter((geo) => !selectedGeos.includes(geo))
                .map((geo) => (
                  <Button key={geo} onClick={() => onSelectGeo(geo)}>
                    {geo}
                  </Button>
                ))}
            </div>
          </li>
        )}

        {matchedYears.length > 0 && (
          <li>
            <p className="mb-1 text-xs text-text-tertiary">Years</p>
            <div className="flex flex-wrap gap-2">
              {matchedYears
                .filter((year) => !selectedYears.includes(year))
                .map((year) => (
                  <Button key={year} onClick={() => onSelectYear(year)}>
                    {year}
                  </Button>
                ))}
            </div>
          </li>
        )}
      </ul>

      <div className="flex flex-wrap items-center gap-2">
        {hasMatches && (
          <>
            <Button onClick={onApplyAll}>Apply all filters</Button>
            <p> or</p>
          </>
        )}
        <Button onClick={onSearchOnly}>Search &ldquo;{searchTerm}&rdquo; only</Button>
      </div>
    </div>
  );
};
