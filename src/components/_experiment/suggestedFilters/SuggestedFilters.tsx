import { Button } from "@base-ui/react/button";

export interface SuggestedFiltersProps {
  searchTerm: string;
  selectedTopics: string[];
  selectedGeos: string[];
  selectedYears: string[];
  onSelectConcept: (concept: string) => void;
  onSelectGeo: (geo: string) => void;
  onSelectYear: (year: string) => void;
  onApplyAll: (matches: { concepts: string[]; geos: string[]; years: string[] }) => void;
  onSearchOnly: () => void;
}

const TOPICS = ["flood defence", "targets"];
const GEOS = ["spain"];

const findMatches = (searchTerm: string) => {
  if (!searchTerm) {
    return {
      matchedConcepts: [],
      matchedGeos: [],
      matchedYears: [],
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

  return { matchedConcepts, matchedGeos, matchedYears };
};

export const SuggestedFilters = ({
  searchTerm,
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

  const { matchedConcepts, matchedGeos, matchedYears } = findMatches(searchTerm);

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
            <Button
              onClick={() =>
                onApplyAll({
                  concepts: matchedConcepts,
                  geos: matchedGeos,
                  years: matchedYears,
                })
              }
            >
              Apply all filters
            </Button>
            <p> or</p>
          </>
        )}
        <Button onClick={onSearchOnly}>Search &ldquo;{searchTerm}&rdquo; only</Button>
      </div>
    </div>
  );
};
