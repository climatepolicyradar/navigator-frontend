import { File } from "lucide-react";
import { useRouter } from "next/router";
import { useContext } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import PassageMatches from "@/components/PassageMatches";
import { Button } from "@/components/atoms/button/Button";
import { Heading } from "@/components/typography/Heading";
import { MAX_FAMILY_SUMMARY_LENGTH_BRIEF } from "@/constants/document";
import { FeaturesContext } from "@/context/FeaturesContext";
import { TMatchedFamily } from "@/types";
import { CleanRouterQuery } from "@/utils/cleanRouterQuery";
import { truncateString } from "@/utils/truncateString";

interface IProps {
  family?: TMatchedFamily;
  position: number;
  positionOffset: number;
}

export const FamilyMatchesDrawer = ({ family, position, positionOffset }: IProps) => {
  const router = useRouter();
  const features = useContext(FeaturesContext);

  if (!family) return null;
  const { family_documents } = family;

  const onPassageClick = (pageNumber: number, documentIndex: number) => {
    const document = family_documents[documentIndex];
    const queryObj = CleanRouterQuery({ ...router.query });
    queryObj.page = pageNumber.toString();
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
      <div className="flex flex-col gap-4">
        {features.searchFamilySummary && (
          <div className="flex flex-col gap-2">
            <Heading level={4} extraClasses="!mb-0">
              Summary
            </Heading>
            <div
              className="text-content"
              dangerouslySetInnerHTML={{
                __html: truncateString(family.family_description, MAX_FAMILY_SUMMARY_LENGTH_BRIEF),
              }}
            />
            <LinkWithQuery
              href={`/document/${family.family_slug}`}
              className="text-sm text-text-secondary underline underline-offset-4 hover:decoration-inky-blue"
            >
              View full summary
            </LinkWithQuery>
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-baseline">
            <Heading level={4} extraClasses="!mb-0">
              Documents
            </Heading>
            <LinkWithQuery
              href={`/document/${family.family_slug}`}
              className="text-sm text-text-secondary underline underline-offset-4 hover:decoration-inky-blue"
            >
              View overview
            </LinkWithQuery>
          </div>
          {family_documents.map((document, docIndex) => (
            <div key={document.document_slug}>
              <LinkWithQuery href={`/documents/${document.document_slug}`} className="text-inky-blue underline-offset-4 text-lg hover:underline">
                <span className="mr-1 inline-block">
                  <File width={16} height={16} />
                </span>
                {document.document_title}
              </LinkWithQuery>
              <PassageMatches
                passages={document.document_passage_matches.slice(0, 5)}
                onClick={(index) => onPassageClick(index, docIndex)}
                position={position}
                positionOffset={positionOffset}
              />
              <Button rounded variant="outlined" onClick={(e) => handleViewOtherDocsClick(e, document.document_slug)} data-cy="view-document-button">
                View all matches highlighted in document
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
