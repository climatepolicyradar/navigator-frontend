import { Button } from "@base-ui/react/button";
import { Input } from "@base-ui/react/input";

import { SuggestedFilters } from "@/components/_experiment/suggestedFilters/SuggestedFilters";

export interface SearchTypeaheadProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
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
  placeholder?: string;
}

export const SearchTypeahead = ({
  searchTerm,
  onSearchTermChange,
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
  placeholder = "Search",
}: SearchTypeaheadProps) => {
  return (
    <div className="space-y-2 border border-border-lighter p-4">
      <div className="relative">
        <Input placeholder={placeholder} onChange={(e) => onSearchTermChange(e.target.value)} className="h-[40px] w-full pr-10" value={searchTerm} />
        {searchTerm && (
          <Button onClick={() => onSearchTermChange("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-1">
            x
          </Button>
        )}
      </div>

      <SuggestedFilters
        searchTerm={searchTerm}
        selectedTopics={selectedTopics}
        selectedGeos={selectedGeos}
        selectedYears={selectedYears}
        selectedDocumentTypes={selectedDocumentTypes}
        onSelectConcept={onSelectConcept}
        onSelectGeo={onSelectGeo}
        onSelectYear={onSelectYear}
        onSelectDocumentType={onSelectDocumentType}
        onApplyAll={onApplyAll}
        onSearchOnly={onSearchOnly}
      />
    </div>
  );
};
