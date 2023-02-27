import { DocumentListItem } from "@components/document/DocumentListItem";
import MatchesButton from "@components/buttons/MatchesButton";
import { convertDate } from "@utils/timedate";
import { TFamily } from "@types";

interface SearchResultProps {
  family: TFamily;
}

const SearchResult = ({ family }: SearchResultProps) => {
  const { family_slug, family_name, family_description, family_geography } = family;

  // const formatDate = () => {
  //   const eudate = document_date;
  //   const dateArr = eudate.split("/");
  //   return `${dateArr[1]}/${dateArr[0]}/${dateArr[2]}`;
  // };
  // const [year] = convertDate(formatDate());

  // const showMatches = () => {
  //   if (document_passage_matches.length || document_title_match || document_description_match) {
  //     return (
  //       <>
  //         <div className="w-full lg:w-auto flex flex-nowrap mt-2 lg:mt-0 lg:mr-4">
  //           <span className="font-medium lg:ml-10 mr-2">Matches:</span>
  //           <div className="divide-x divide-current flex-grow-0">
  //             {document_title_match && <span className="px-2">Title</span>}
  //             {document_description_match && <span className="px-2">Summary</span>}
  //             {document_passage_matches.length > 0 && <span className="px-2">Document</span>}
  //           </div>
  //         </div>
  //         {document_content_type === "application/pdf" && document_passage_matches.length > 0 && (
  //           <MatchesButton dataAttribute={document_slug} count={document_passage_matches.length} />
  //         )}
  //       </>
  //     );
  //   }
  // };

  return (
    <DocumentListItem
      listItem={{
        slug: family_slug,
        name: family_name,
        country_code: family_geography,
        document_year: "2023_FIXME",
        description: family_description,
      }}
    >
      {/* {showMatches()} */}
    </DocumentListItem>
  );
};
export default SearchResult;
