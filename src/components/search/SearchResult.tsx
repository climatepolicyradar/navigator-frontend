import { TextSearch } from "lucide-react";

import { FamilyListItem } from "@/components/document/FamilyListItem";
import { MAX_RESULTS } from "@/constants/paging";
import { TMatchedFamily } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  family: TMatchedFamily;
  active: boolean;
  onClick?: () => void;
}

const SearchResult = ({ family, active, onClick }: IProps) => {
  const { family_documents, total_passage_hits, family_slug } = family;

  const hasFamilyDocuments = family_documents.length > 0;

  const matchesNumber = total_passage_hits >= MAX_RESULTS ? `${MAX_RESULTS}+` : `${total_passage_hits}`;
  const matchesText = `View ${matchesNumber} text ${total_passage_hits === 1 ? "passage" : "passages"} matching your search`;

  const titleClasses = joinTailwindClasses(
    hasFamilyDocuments ? "text-text-primary" : "text-text-brand",
    active ? "!underline" : "!no-underline hover:!underline"
  );

  return (
    <FamilyListItem family={family} showSummary={false} titleClasses={titleClasses}>
      {hasFamilyDocuments && (
        <>
          <div>
            <div className="inline-block">
              <button
                type="button"
                onClick={onClick}
                className="mt-1 text-text-brand"
                aria-label={matchesText}
                data-analytics="search-result-matches-button"
                data-slug={family_slug}
              >
                <TextSearch size={16} className="inline mr-1.5" />
                <span className="text-sm font-semibold underline">{matchesText}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </FamilyListItem>
  );
};

export default SearchResult;
