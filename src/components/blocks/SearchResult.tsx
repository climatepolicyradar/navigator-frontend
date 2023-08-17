import { FamilyListItem } from "@components/document/FamilyListItem";
import { SearchMatchesButton } from "@components/buttons/SearchMatchesButton";
import { TFamilyDocument, TMatchedFamily } from "@types";
import { useMemo } from "react";

interface ISearchResultProps {
  family: TMatchedFamily;
}

const calculateNumberOfMatches = (documents: TFamilyDocument[]) => {
  let numberOfMatches = 0;
  if (documents.length) {
    for (const doc of documents) {
      if (doc.document_passage_matches.length) {
        numberOfMatches += doc.document_passage_matches.length;
      }
    }
  }
  return numberOfMatches;
};

const SearchResult = ({ family }: ISearchResultProps) => {
  const { family_documents, family_slug } = family;
  const numberOfMatches = useMemo(() => calculateNumberOfMatches(family_documents), [family_documents]);

  return (
    <FamilyListItem family={family}>{numberOfMatches && <SearchMatchesButton count={numberOfMatches} dataAttribute={family_slug} />}</FamilyListItem>
  );
};

export default SearchResult;
