import { useRouter } from "next/router";
import { TMatchedFamily } from "@types";
import { FamilyMeta } from "@components/document/FamilyMeta";
import PassageMatches from "@components/PassageMatches";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { matchesCount } from "@utils/matchesCount";
import { CleanRouterQuery } from "@utils/cleanRouterQuery";
import { TDocumentContentType } from "@types";

type TProps = {
  family?: TMatchedFamily;
};

export const FamilyMatchesDrawer = ({ family }: TProps) => {
  const router = useRouter();
  if (!family) return null;
  const { family_geography, family_name, family_category, family_date, family_documents } = family;
  const numberOfMatches = matchesCount(family_documents);
  const numberOfDocsWithMatches = family_documents.filter((document) => document.document_passage_matches.length > 0).length;
  const matchesDescription = `${numberOfMatches} ${numberOfMatches === 1 ? "match" : "matches"} in ${numberOfDocsWithMatches} ${
    numberOfDocsWithMatches === 1 ? "document" : "documents"
  }`;

  const onPassageClick = (passageIndex: number, documentIndex: number) => {
    const document = family_documents[documentIndex];
    const queryObj = CleanRouterQuery({ ...router.query });
    queryObj.passage = passageIndex.toString();
    router.push({ pathname: `/documents/${document.document_slug}`, query: queryObj });
  };

  const showPageNumbers = (documentContentType: TDocumentContentType) => {
    if (!documentContentType) return false;
    if (documentContentType === "text/html") return false;
    return true;
  };

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
            {family_documents.map((document, docIndex) => (
              <div key={document.document_slug} className="mb-4">
                <LinkWithQuery href={`/documents/${document.document_slug}`}>{document.document_title}</LinkWithQuery>
                <PassageMatches
                  passages={document.document_passage_matches}
                  onClick={(index) => onPassageClick(index, docIndex)}
                  showPageNumbers={showPageNumbers(document.document_content_type)}
                  pageColour="gray-600"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
