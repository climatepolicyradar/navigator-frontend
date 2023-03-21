import { useRouter } from "next/router";
import MatchesButton from "@components/buttons/MatchesButton";
import { TDocumentContentType, TDocumentPage } from "@types";

type TProps = {
  document: TDocumentPage;
  matches?: number;
};

export const FamilyDocument = ({ document, matches }: TProps) => {
  const { title, slugs, variant, content_type } = document;
  const router = useRouter();
  const isMain = variant.toLowerCase().includes("main");
  const hasMatches = typeof matches !== "undefined" && matches > 0;
  // PDFs need to have a cdn location
  // HTMLs need a source url / website
  const canView =
    document.content_type === "application/pdf" ? !!document.cdn_object : document.content_type === "text/html" ? !!document.source_url : false;

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    // No cdn_object means the document will not render
    if (!canView) return;
    router.push({ pathname: `/documents/${slugs[0]}`, query: router.query });
  };

  const renderContentType = (t: TDocumentContentType) => {
    switch (t) {
      case "application/pdf":
        return "PDF";
      case "text/html":
        return "HTML";
    }
  };

  let cssClass = "family-document mt-4 p-3 border border-transparent hover:border-primary-600 ";
  cssClass += `${!isMain ? "hover:" : ""}bg-offwhite transition duration-300 `;
  cssClass += canView ? "cursor-pointer" : "";

  return (
    <div className={cssClass} onClick={handleClick}>
      <div className="text-primary-600 mb-2">{title}</div>
      <div className="flex items-center">
        <div className="flex-1 flex flex-wrap gap-x-8 items-center">
          {!isMain && <span className="capitalize">{variant.toLowerCase()}</span>}
          {!!content_type && <span>{renderContentType(content_type)}</span>}
          {!canView && <span>Document preview is not currently available</span>}
        </div>
        {canView && (
          <div className="flex-0">
            <MatchesButton dataAttribute={slugs[0]} count={matches} overideText={!hasMatches ? "view document" : null} />
          </div>
        )}
      </div>
    </div>
  );
};
