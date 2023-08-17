import { useMemo } from "react";
import { TMatchedFamily } from "@types";
import { FamilyListItem } from "@components/document/FamilyListItem";
import { SearchMatchesButton } from "@components/buttons/SearchMatchesButton";
import { matchesCount } from "@utils/matchesCount";

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
      {numberOfMatches > 0 && <SearchMatchesButton count={numberOfMatches} dataAttribute={family_slug} onClick={onClick} active={active} />}
    </FamilyListItem>
  );
};

export default SearchResult;
