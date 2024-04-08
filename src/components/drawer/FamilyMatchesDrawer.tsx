import { useRouter } from "next/router";
import { TMatchedFamily } from "@types";
import { FamilyMeta } from "@components/document/FamilyMeta";
import PassageMatches from "@components/PassageMatches";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { matchesCount } from "@utils/matchesCount";
import { CleanRouterQuery } from "@utils/cleanRouterQuery";
import { truncateString } from "@helpers/index";
import { MAX_FAMILY_SUMMARY_LENGTH_BRIEF } from "@constants/document";
import Button from "@components/buttons/Button";
import { pluralise } from "@utils/pluralise";

type TProps = {
  family?: TMatchedFamily;
};

export const FamilyMatchesDrawer = ({ family }: TProps) => {
  const router = useRouter();

  if (!family) return null;
  const { family_geography, family_name, family_category, family_date, family_documents } = family;
  const numberOfMatches = matchesCount(family_documents);
  const numberOfDocsWithMatches = family_documents.filter((document) => document.document_passage_matches.length > 0).length;
  const matchesDescription = `${numberOfMatches} ${pluralise(numberOfMatches, "match", "matches")} in ${numberOfDocsWithMatches} ${pluralise(
    numberOfDocsWithMatches,
    "document",
    "documents"
  )}`;

  const onPassageClick = (passageIndex: number, documentIndex: number) => {
    const document = family_documents[documentIndex];
    const queryObj = CleanRouterQuery({ ...router.query });
    queryObj.passage = passageIndex.toString();
    router.push({ pathname: `/documents/${document.document_slug}`, query: queryObj });
  };

  const handleViewOtherDocsClick = (e: React.FormEvent<HTMLButtonElement>, documentSlug: string) => {
    e.preventDefault();
    if (!documentSlug) return;
    router.push({ pathname: `/documents/${documentSlug}`, query: router.query });
  };

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="p-4 pb-0 pr-10 md:p-8 md:pr-12 md:pb-0">
          <h4 className="text-xl font-bold">{family_name}</h4>
          <div className="flex flex-wrap text-sm gap-1 text-gray-700 mt-2 items-center font-medium middot-between">
            <FamilyMeta category={family_category} geography={family_geography} date={family_date} />
          </div>
          <div className="mt-6">
            <h5 className="text-base mb-2">Summary</h5>
            <div
              className="text-content mb-2"
              dangerouslySetInnerHTML={{ __html: truncateString(family.family_description, MAX_FAMILY_SUMMARY_LENGTH_BRIEF) }}
            />
            <LinkWithQuery href={`/document/${family.family_slug}`} className="text-sm alt">
              View full summary and timeline
            </LinkWithQuery>
          </div>
        </div>
        <div className="p-4 pt-0 flex-grow flex flex-col overflow-hidden md:p-8 md:pt-0">
          <div className="my-6">
            <div className="flex justify-between items-baseline">
              <h5 className="text-base mb-2">Documents</h5>
              <LinkWithQuery href={`/document/${family.family_slug}`} className="text-sm alt">
                View document overview
              </LinkWithQuery>
            </div>
            <div className="text-sm">{matchesDescription}</div>
          </div>
          <div className="flex-grow pr-1 overflow-y-scroll scrollbar-narrow">
            {family_documents.map((document, docIndex) => (
              <div key={document.document_slug} className="mb-6">
                <LinkWithQuery href={`/documents/${document.document_slug}`}>{document.document_title}</LinkWithQuery>
                <PassageMatches passages={document.document_passage_matches.slice(0, 5)} onClick={(index) => onPassageClick(index, docIndex)} />
                <Button
                  color="clear"
                  data-cy="view-document-button"
                  onClick={(e) => handleViewOtherDocsClick(e, document.document_slug)}
                  extraClasses="text-sm text-blue-600"
                >
                  View {document.document_passage_matches.length} {pluralise(document.document_passage_matches.length, "match", "matches")}{" "}
                  highlighted in document
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
