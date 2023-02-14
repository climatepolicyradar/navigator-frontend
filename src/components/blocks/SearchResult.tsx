import { convertDate } from "@utils/timedate";
import { DocumentListItem } from "@components/document/DocumentListItem";
import MatchesButton from "@components/buttons/MatchesButton";
import { TDocument } from "@types";

interface SearchResultProps {
  document: TDocument;
}

const SearchResult = ({ document }: SearchResultProps) => {
  const {
    document_geography,
    document_postfix,
    document_slug,
    document_date,
    document_description,
    document_name,
    document_category,
    document_title_match,
    document_description_match,
    document_passage_matches,
    document_content_type,
  } = document;

  const formatDate = () => {
    const eudate = document_date;
    const dateArr = eudate.split("/");
    return `${dateArr[1]}/${dateArr[0]}/${dateArr[2]}`;
  };
  const [year] = convertDate(formatDate());

  const showMatches = () => {
    if (document_passage_matches.length || document_title_match || document_description_match) {
      return (
        <>
          <div className="w-full lg:w-auto flex flex-nowrap mt-2 lg:mt-0 lg:mr-4">
            {/* TODO: translate below text, how to handle plurals? */}
            <span className="font-medium lg:ml-10 mr-2">Matches:</span>
            <div className="divide-x divide-current flex-grow-0">
              {document_title_match && <span className="px-2">Title</span>}
              {document_description_match && <span className="px-2">Summary</span>}
              {document_passage_matches.length > 0 && <span className="px-2">Document</span>}
            </div>
          </div>
          {document_content_type === "application/pdf" && document_passage_matches.length > 0 && (
            <MatchesButton dataAttribute={document_slug} count={document_passage_matches.length} />
          )}
        </>
      );
    }
  };

  return (
    <DocumentListItem
      listItem={{
        slug: document_slug,
        name: document_name,
        postfix: document_postfix,
        country_code: document_geography,
        document_year: year,
        description: document_description,
        category: document_category,
      }}
    >
      {showMatches()}
    </DocumentListItem>
  );
};
export default SearchResult;
