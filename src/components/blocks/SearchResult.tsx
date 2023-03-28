import { FamilyListItem } from "@components/document/FamilyListItem";
import { TFamilyDocument, TMatchedFamily } from "@types";

interface SearchResultProps {
  family: TMatchedFamily;
}

const SearchResult = ({ family }: SearchResultProps) => {
  const { family_documents, family_description_match, family_title_match } = family;

  const hasDocumentMatches = (documents: TFamilyDocument[]) => {
    let hasMatches = false;
    if (documents.length) {
      for (const doc of documents) {
        if (doc.document_passage_matches.length) {
          hasMatches = true;
          break;
        }
      }
    }
    return hasMatches;
  };

  const showMatches = () => {
    let matches = [];
    if (family_title_match) matches.push("Title");
    if (family_description_match) matches.push("Summary");
    if (hasDocumentMatches(family_documents)) matches.push("Document passage");

    if(!matches.length) return null;

    return (
      <>
        <div className="w-full lg:w-auto flex flex-nowrap mt-2 lg:mt-0 lg:mr-4">
          <span className="font-medium lg:ml-10">Matches:&nbsp;</span>
          <div className="flex-grow-0">{matches.join(", ")}</div>
        </div>
      </>
    );
  };

  return <FamilyListItem family={family}>{showMatches()}</FamilyListItem>;
};

export default SearchResult;
