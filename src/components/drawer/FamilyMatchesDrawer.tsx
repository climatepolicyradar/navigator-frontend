import { TMatchedFamily } from "@types";
import { FamilyMeta } from "@components/document/FamilyMeta";
import PassageMatches from "@components/PassageMatches";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { matchesCount } from "@utils/matchesCount";

type TProps = {
  family?: TMatchedFamily;
};

export const FamilyMatchesDrawer = ({ family }: TProps) => {
  if (!family) return null;
  const { family_geography, family_name, family_category, family_date, family_documents } = family;
  const numberOfMatches = matchesCount(family_documents);
  const matchesDescription = `${numberOfMatches} ${numberOfMatches === 1 ? "match" : "matches"} in ${family_documents.length} ${
    family_documents.length === 1 ? "document" : "documents"
  }`;

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="p-4 pt-10 bg-gray-100">
          <h4 className="text-base">{family_name}</h4>
          <div className="flex flex-wrap text-sm gap-1 text-gray-700 mt-2 items-center font-medium">
            <FamilyMeta category={family_category} geography={family_geography} date={family_date} />
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col overflow-hidden">
          <div className="text-sm text-gray-700 mb-4">{matchesDescription}</div>
          <div className="flex-grow pr-1 overflow-y-scroll scrollbar-thumb-gray-200 scrollbar-thin scrollbar-track-white scrollbar-thumb-rounded-full hover:scrollbar-thumb-gray-500">
            {family_documents.map((document) => (
              <div key={document.document_slug} className="mb-4">
                <LinkWithQuery href={`/documents/${document.document_slug}`}>{document.document_title}</LinkWithQuery>
                <PassageMatches passages={document.document_passage_matches} onClick={() => {}} showPageNumbers={true} pageColour="gray-600" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
