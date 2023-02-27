import { DocumentListItem } from "@components/document/DocumentListItem";
import { FamilyListItem } from "@components/document/FamilyListItem";
import { TFamilyDocument, TFamily } from "@types";

interface SearchResultProps {
  family: TFamily;
}

const SearchResult = ({ family }: SearchResultProps) => {
  const { family_slug, family_name, family_description, family_geography, family_description_match, family_title_match } = family;

  const showMatches = () => {
    if (family_title_match || family_description_match) {
      return (
        <>
          <div className="w-full lg:w-auto flex flex-nowrap mt-2 lg:mt-0 lg:mr-4">
            <span className="font-medium lg:ml-10 mr-2">Matches:</span>
            <div className="divide-x divide-current flex-grow-0">
              {family_title_match && <span className="px-2">Title</span>}
              {family_description_match && <span className="px-2">Summary</span>}
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

  return (
    <FamilyListItem
      listItem={{
        slug: family_slug,
        name: family_name,
        country_code: family_geography,
        document_year: "2023_FIXME",
        description: family_description,
      }}
    >
      {showMatches()}
    </FamilyListItem>
  );
};
export default SearchResult;
