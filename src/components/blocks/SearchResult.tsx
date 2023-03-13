import { DocumentListItem } from "@components/document/DocumentListItem";
import { FamilyListItem } from "@components/document/FamilyListItem";
import { TFamilyDocument, TMatchedFamily } from "@types";

interface SearchResultProps {
  family: TMatchedFamily;
}

const SearchResult = ({ family }: SearchResultProps) => {
  const { family_documents, family_description_match, family_title_match } = family;

  const showMatches = () => {
    if (family_title_match || family_description_match) {
      return (
        <>
          <div className="w-full lg:w-auto flex flex-nowrap mt-2 lg:mt-0 lg:mr-4">
            <span className="font-medium lg:ml-10 mr-2">Matches:</span>
            <div className="divide-x divide-current flex-grow-0">
              {family_title_match && <span className="px-2">Title</span>}
              {family_description_match && <span className="px-2">Summary</span>}
              {family_documents.length && <span className="px-2">Document passage</span>}
            </div>
          </div>
          {/* {document_content_type === "application/pdf" && document_passage_matches.length > 0 && (
            <MatchesButton dataAttribute={document_slug} count={document_passage_matches.length} />
          )} */}
        </>
      );
    }
  };

  const renderFamilyDocuments = (documents: TFamilyDocument[]) => {
    return documents.map((document) => {
      return <DocumentListItem document={document} key={document.document_slug} />;
    });
  };

  return <FamilyListItem family={family}>{showMatches()}</FamilyListItem>;
};
export default SearchResult;
