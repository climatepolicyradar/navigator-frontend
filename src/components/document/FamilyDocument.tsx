import { useRouter } from "next/router";
import MatchesButton from "@components/buttons/MatchesButton";
import { TDocumentContentType, TDocumentPage, TLoadingStatus } from "@types";
import { Loading } from "@components/svg/Icons";

type TProps = {
  document: TDocumentPage;
  matches?: number;
  status?: TLoadingStatus;
};

export const FamilyDocument = ({ document, matches, status }: TProps) => {
  const { title, slug, document_role, language, content_type, variant } = document;
  const router = useRouter();
  const isMain = document_role?.toLowerCase().includes("main");
  const hasMatches = typeof matches !== "undefined" && matches > 0;
  // PDFs need to have a cdn location
  // HTMLs need a source url / website
  const canPreview = document.content_type === "application/pdf" ? !!document.cdn_object : false;
  const canViewSource = !canPreview && !!document.source_url;

  const renderContentType = (t: TDocumentContentType) => {
    if (!t) return null;
    switch (t) {
      case "application/pdf":
        return <span>PDF</span>;
      case "text/html":
        return <span>HTML</span>;
    }
    return null;
  };

  const renderDocumentInfo = (): string => {
    if (canViewSource) return "Document preview is not currently available";
    return "We do not have this document in our database. Contact us if you can help us find it";
  };

  const renderMatchesOverrideText = (): string | JSX.Element => {
    if (status === "loading")
      return (
        <span className="flex gap-2 items-center">
          <Loading />
          Searching...
        </span>
      );
    if (canPreview && !hasMatches) return "View document";
    if (canViewSource) return "View source document";
  };

  const getPreviewBehaviour = () => {
    let cssClass = "family-document mt-4 p-3 border border-transparent hover:bg-offwhite transition duration-300 ";
    cssClass += isMain ? "bg-offwhite " : "";
    cssClass += canPreview || canViewSource ? "cursor-pointer hover:border-primary-600" : "";

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      // Otherwise either preview or open the source url
      if (canPreview) router.push({ pathname: `/documents/${slug}`, query: router.query });
      if (canViewSource) window.open(document.source_url, "_blank");
    };

    return { className: cssClass, onClick: !canPreview && !canViewSource ? null : handleClick };
  };

  return (
    <div {...getPreviewBehaviour()}>
      <div className="text-primary-600 mb-2">{title}</div>
      <div className="flex items-center">
        <div className="flex-1 flex flex-wrap gap-x-8 items-center">
          {!isMain && <span className="capitalize font-bold">{document_role?.toLowerCase()}</span>}
          {renderContentType(content_type)}
          {!!language && (
            <span>
              {language.toUpperCase()}
              {!!variant && ` (${variant})`}
            </span>
          )}
          {!canPreview && <span>{renderDocumentInfo()}</span>}
        </div>
        {(canPreview || canViewSource) && (
          <div className="flex-0">
            <MatchesButton dataAttribute={slug} count={matches} overideText={renderMatchesOverrideText()} />
          </div>
        )}
      </div>
    </div>
  );
};
