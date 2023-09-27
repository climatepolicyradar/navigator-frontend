import { useMemo } from "react";
import { TMatchedFamily } from "@types";
import { FamilyListItem } from "@components/document/FamilyListItem";
import { SearchMatchesButton } from "@components/buttons/SearchMatchesButton";
import { matchesCount } from "@utils/matchesCount";
import { ToolTipSSR } from "@components/tooltip/TooltipSSR";

interface ISearchResultProps {
  family: TMatchedFamily;
  active: boolean;
  onClick?: () => void;
}

const SearchResult = ({ family, active, onClick }: ISearchResultProps) => {
  const { family_documents, family_slug } = family;
  const numberOfMatches = useMemo(() => matchesCount(family_documents), [family_documents]);

  return (
    <FamilyListItem family={family}>
      {numberOfMatches > 0 && (
        <div data-tip="View passages in this document that match your search" data-for={family_slug} className="z-10">
          <SearchMatchesButton count={numberOfMatches} dataAttribute={family_slug} onClick={onClick} active={active} />
          <ToolTipSSR id={family_slug} place={"top"} />
        </div>
      )}
    </FamilyListItem>
  );
};

export default SearchResult;
