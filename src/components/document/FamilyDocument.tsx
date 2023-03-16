import { useRouter } from "next/router";
import MatchesButton from "@components/buttons/MatchesButton";
import { formatDate } from "@utils/timedate";
import { PDFIcon } from "@components/svg/Icons";
import { TDocumentPage } from "@types";

type TProps = {
  document: TDocumentPage;
  date: string;
  matches?: number;
};

export const FamilyDocument = ({ document, date, matches }: TProps) => {
  const { title, slugs, variant, content_type } = document;
  const router = useRouter();
  const [year, _day, _month] = formatDate(date);
  const isMain = variant === "MAIN";
  const hasMatches = typeof matches !== "undefined";
  const canView = !!document.cdn_object;

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    // No cdn_object means the document will not render
    if (!canView) return;
    router.push({ pathname: `/documents/${slugs[0]}`, query: router.query });
  };

  const renderIcon = (t: string) => {
    switch (t) {
      case "application/pdf":
        return <PDFIcon />;
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
          {!!content_type && <span>{renderIcon(content_type)}</span>}
          <span className="capitalize">{variant.toLowerCase()}</span>
          <span>{year}</span>
          {!canView && <span>Document preview is not currently available</span>}
        </div>
        {hasMatches && (
          <div className="flex-0">
            <MatchesButton dataAttribute={slugs[0]} count={matches} overideText={matches === 0 ? "view Document" : null} />
          </div>
        )}
      </div>
    </div>
  );
};
