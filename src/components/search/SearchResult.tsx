import { TextSearch } from "lucide-react";
import { useContext } from "react";

import { FamilyListItem } from "@/components/document/FamilyListItem";
import { MAX_RESULTS } from "@/constants/paging";
import { ThemeContext } from "@/context/ThemeContext";
import { TMatchedFamily, TConcept } from "@/types";
import { isSearchFamilySummaryEnabled } from "@/utils/features";
import { pluralise } from "@/utils/pluralise";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  family: TMatchedFamily;
  active: boolean;
  onClick?: () => void;
}

const SearchResult = ({ family, active, onClick }: IProps) => {
  const { themeConfig } = useContext(ThemeContext);
  const { family_documents, total_passage_hits, family_slug } = family;

  const hasFamilyDocuments = family_documents.length > 0;

  const matchesNumber = total_passage_hits >= MAX_RESULTS ? `${MAX_RESULTS}+` : `${total_passage_hits}`;
  const matchesText = `View ${matchesNumber} text ${pluralise(total_passage_hits, ["passage", "passages"])} matching your search`;

  const titleClasses = joinTailwindClasses(
    hasFamilyDocuments ? "text-text-primary" : "text-[#0041A3]",
    active ? "!underline" : "!no-underline hover:!underline"
  );

  return (
    <FamilyListItem family={family} showSummary={isSearchFamilySummaryEnabled(themeConfig)} titleClasses={titleClasses}>
      {hasFamilyDocuments && (
        <div className="flex">
          <button
            type="button"
            onClick={onClick}
            className="text-text-brand flex items-center"
            aria-label={matchesText}
            data-analytics="search-result-matches-button"
            data-slug={family_slug}
          >
            <TextSearch size={16} className="inline mr-1.5" />
            <span className="text-sm font-semibold underline">{matchesText}</span>
          </button>
        </div>
      )}
    </FamilyListItem>
  );
};

export default SearchResult;
