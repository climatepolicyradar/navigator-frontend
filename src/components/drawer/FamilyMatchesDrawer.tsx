import { useRouter } from "next/router";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import PassageMatches from "@/components/PassageMatches";
import Button from "@/components/buttons/Button";
import { FamilyMeta } from "@/components/document/FamilyMeta";
import { Heading } from "@/components/typography/Heading";
import { MAX_FAMILY_SUMMARY_LENGTH_BRIEF } from "@/constants/document";
import { TMatchedFamily } from "@/types";
import { CleanRouterQuery } from "@/utils/cleanRouterQuery";
import { truncateString } from "@/utils/truncateString";

type TProps = {
  family?: TMatchedFamily;
};

export const FamilyMatchesDrawer = ({ family }: TProps) => {
  const router = useRouter();

  if (!family) return null;
  const { family_geographies, family_name, family_category, family_date, family_documents, corpus_type_name } = family;

  const onPassageClick = (passageIndex: number, documentIndex: number) => {
    const document = family_documents[documentIndex];
    const queryObj = CleanRouterQuery({ ...router.query });
    queryObj.passage = passageIndex.toString();
    router.push({
      pathname: `/documents/${document.document_slug}`,
      query: queryObj,
    });
  };

  const handleViewOtherDocsClick = (e: React.FormEvent<HTMLButtonElement>, documentSlug: string) => {
    e.preventDefault();
    if (!documentSlug) return;
    router.push({
      pathname: `/documents/${documentSlug}`,
      query: router.query,
    });
  };

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="p-5 pb-0 pr-10 md:pr-12">
          <Heading level={2}>{family_name}</Heading>
          <div className="flex flex-wrap text-sm gap-1 mt-2 items-center middot-between">
            <FamilyMeta category={family_category} corpus_type_name={corpus_type_name} geographies={family_geographies} date={family_date} />
          </div>
          <div className="mt-5">
            <Heading level={3}>Summary</Heading>
            <div
              className="text-content mb-2"
              dangerouslySetInnerHTML={{
                __html: truncateString(family.family_description, MAX_FAMILY_SUMMARY_LENGTH_BRIEF),
              }}
            />
            <LinkWithQuery href={`/document/${family.family_slug}`} className="text-sm alt">
              View full summary and timeline
            </LinkWithQuery>
          </div>
        </div>
        <div className="p-5 pt-0 flex-grow flex flex-col">
          <div className="my-5">
            <div className="flex justify-between items-baseline">
              <Heading level={3} extraClasses="mb-0">
                Documents
              </Heading>
              <LinkWithQuery href={`/document/${family.family_slug}`} className="text-sm alt">
                View document overview
              </LinkWithQuery>
            </div>
          </div>
          <div className="flex-grow pr-1">
            {family_documents.map((document, docIndex) => (
              <div key={document.document_slug} className="mb-5">
                <LinkWithQuery href={`/documents/${document.document_slug}`}>{document.document_title}</LinkWithQuery>
                <PassageMatches passages={document.document_passage_matches.slice(0, 5)} onClick={(index) => onPassageClick(index, docIndex)} />
                <Button
                  color="clear"
                  data-cy="view-document-button"
                  onClick={(e) => handleViewOtherDocsClick(e, document.document_slug)}
                  extraClasses="text-sm text-blue-600"
                >
                  View all matches highlighted in document
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
