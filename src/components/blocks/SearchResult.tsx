import { DocumentListItem } from "@components/document/DocumentListItem";
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
    if (family_title_match || family_description_match) {
      return (
        <>
          <div className="w-full lg:w-auto flex flex-nowrap mt-2 lg:mt-0 lg:mr-4">
            <span className="font-medium lg:ml-10 mr-2">Matches:</span>
            <div className="divide-x divide-current flex-grow-0">
              {family_title_match && <span className="px-2">Title</span>}
              {family_description_match && <span className="px-2">Summary</span>}
              {hasDocumentMatches(family_documents) && <span className="px-2">Document passage</span>}
            </div>
          </div>
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
