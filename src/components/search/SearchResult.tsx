import { SearchMatchesButton } from "@/components/buttons/SearchMatchesButton";
import { FamilyListItem } from "@/components/document/FamilyListItem";
import { ToolTipSSR } from "@/components/tooltip/TooltipSSR";
import { TMatchedFamily } from "@/types";

interface ISearchResultProps {
  family: TMatchedFamily;
  active: boolean;
  onClick?: () => void;
}

const SearchResult = ({ family, active, onClick }: ISearchResultProps) => {
  const { family_documents, total_passage_hits, family_slug } = family;

  return (
    <FamilyListItem family={family}>
      {family_documents.length > 0 && (
        <div>
          <div className="inline-block" data-tooltip-content="View passages in this document that match your search" data-tooltip-id={family_slug}>
            <SearchMatchesButton count={total_passage_hits} dataAttribute={family_slug} onClick={onClick} active={active} />
            <ToolTipSSR id={family_slug} place={"top"} />
          </div>
        </div>
      )}
    </FamilyListItem>
  );
};

export default SearchResult;
