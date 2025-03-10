import { useRouter } from "next/router";

import MatchesButton from "@/components/buttons/MatchesButton";
import { DocumentIcon, GlobeIcon, Loading } from "@/components/svg/Icons";
import { getDocumentType } from "@/helpers/getDocumentType";
import { getLanguage } from "@/helpers/getLanguage";
import useConfig from "@/hooks/useConfig";
import { TDocumentPage, TLoadingStatus } from "@/types";

type TProps = {
  document: TDocumentPage;
  matches?: number;
  status?: TLoadingStatus;
  familyMatches?: number;
};

const loadingIndicator = (
  <span className="flex gap-2 items-center">
    <Loading />
    Searching...
  </span>
);

export const FamilyDocument = ({ document, matches, status, familyMatches }: TProps) => {
  const { title, slug, document_role, language, content_type, variant } = document;
  const configQuery = useConfig();
  const { data: { languages = {} } = {} } = configQuery;
  const router = useRouter();
  const isMain = document_role?.toLowerCase().includes("main");
  const hasMatches = typeof matches !== "undefined" && matches > 0;
  // If we have matches or the document is a pdf - and we have the document, we can preview it
  const canPreview = hasMatches || (document.content_type === "application/pdf" && !!document.cdn_object);
  const canViewSource = !canPreview && !!document.source_url;

  const renderDocumentInfo = (): string | JSX.Element => {
    if (status === "loading") return loadingIndicator;
    if (canViewSource) return "Document preview is not currently available";
    return "We do not have this document in our database. Contact us if you can help us find it";
  };

  const renderMatchesOverrideText = (): string | JSX.Element => {
    if (status === "loading") return loadingIndicator;
  };

  const getPreviewBehaviour = () => {
    let cssClass = "family-document group mt-4 p-4 rounded-lg border bg-white border-gray-50 shadow-xs transition duration-300 flex flex-no-wrap ";
    cssClass += canPreview || canViewSource ? "cursor-pointer hover:border-gray-200 hover:bg-gray-50" : "";

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      // Otherwise either preview or open the source url
      if (canPreview) router.push({ pathname: `/documents/${slug}`, query: router.query });
      if (canViewSource) window.open(document.source_url, "_blank");
    };

    return {
      className: cssClass,
      onClick: !canPreview && !canViewSource ? null : handleClick,
    };
  };

  return (
    <div {...getPreviewBehaviour()}>
      <div className="flex-0 mr-2 hidden md:block">
        {canViewSource && <GlobeIcon width="20" height="20" color="#1F93FF" />}
        {canPreview && !canViewSource && <DocumentIcon width="20" height="20" color="#1F93FF" />}
      </div>
      <div className="flex-1">
        <div className="mb-2 flex justify-between no-wrap">
          {title}{" "}
          {(canPreview || canViewSource) && (
            <MatchesButton dataAttribute={slug} count={matches} overideText={renderMatchesOverrideText()} familyMatches={familyMatches} />
          )}
        </div>
        <div className="md:flex flex-nowrap items-center">
          <div className="flex-1">
            <div className="flex items-center text-sm">
              <div className="flex-1 flex flex-wrap gap-x-2 items-center middot-between">
                {!!language && (
                  <span>
                    {getLanguage(language, languages)}
                    {!!variant && ` (${variant})`}
                  </span>
                )}
                {!isMain && <span className="capitalize">{document_role?.toLowerCase()}</span>}
                {getDocumentType(content_type)}
                {!canPreview && <span className="flex gap-2 items-center">{renderDocumentInfo()}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
