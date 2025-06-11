import { File } from "lucide-react";
import { useRouter } from "next/router";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import PassageMatches from "@/components/PassageMatches";
import { Button } from "@/components/atoms/button/Button";
import { FamilyMeta } from "@/components/document/FamilyMeta";
import { Heading } from "@/components/typography/Heading";
import { TMatchedFamily } from "@/types";
import { CleanRouterQuery } from "@/utils/cleanRouterQuery";

interface IProps {
  family?: TMatchedFamily;
}

export const FamilyMatchesDrawer = ({ family }: IProps) => {
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
        <div className="p-5 pb-0 pr-12">
          <div className="flex flex-wrap text-sm gap-1 mb-2 items-center middot-between">
            <FamilyMeta category={family_category} corpus_type_name={corpus_type_name} geographies={family_geographies} date={family_date} />
          </div>
          <Heading level={3} extraClasses="!mb-10">
            {family_name}
          </Heading>
        </div>
        <div className="p-5 pt-0 flex-grow flex flex-col">
          <div className="mb-4">
            <div className="flex justify-between items-baseline">
              <Heading level={4} extraClasses="!mb-0">
                Documents
              </Heading>
              <LinkWithQuery href={`/document/${family.family_slug}`} className="text-sm text-text-primary underline hover:text-blue-800">
                View overview
              </LinkWithQuery>
            </div>
          </div>
          <div className="flex-grow pr-1">
            {family_documents.map((document, docIndex) => (
              <div key={document.document_slug} className="mb-5">
                <LinkWithQuery
                  href={`/documents/${document.document_slug}`}
                  className="text-[#005EEB] hover:text-blue-800 hover:underline text-lg inline-block"
                >
                  <span className="mr-1 -mb-[2px] inline-block">
                    <File width={20} height={20} />
                  </span>
                  {document.document_title}
                </LinkWithQuery>
                <PassageMatches passages={document.document_passage_matches.slice(0, 5)} onClick={(index) => onPassageClick(index, docIndex)} />
                <Button
                  rounded
                  variant="outlined"
                  onClick={(e) => handleViewOtherDocsClick(e, document.document_slug)}
                  data-cy="view-document-button"
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
