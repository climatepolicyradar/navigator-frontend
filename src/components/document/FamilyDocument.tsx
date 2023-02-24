import MatchesButton from "@components/buttons/MatchesButton";
import { formatDate } from "@utils/timedate";
import { TFamilyDocument } from "@types";

type TFamilyDocumentProps = {
  document: TFamilyDocument;
};

type TProps = {
  title: string;
  date: string;
  slug: string;
  matches?: number;
  meta?: {
    typeName: string;
    typeDescription: string;
    format: string;
    variant: string;
  };
};

export const FamilyDocument = ({ title, date, slug, matches, meta }: TProps) => {
  const [year, _, month] = formatDate(date);
  const isMain = meta?.typeName === "main";
  const hasMeta = typeof meta !== "undefined";
  const hasMatches = typeof matches !== "undefined";

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
  };

  return (
    <div
      className={`family-document mt-4 cursor-pointer p-3 border border-transparent hover:border-primary-600 ${
        !isMain ? "hover:" : ""
      }bg-offwhite transition duration-300`}
      onClick={handleClick}
    >
      <div className="text-primary-600 mb-2">{title}</div>
      <div className="flex items-center">
        <div className="flex-1 flex flex-wrap gap-x-8">
          {hasMeta && (
            <>
              {!isMain && <span className="font-bold">{meta.typeDescription}</span>}
              <span>{meta.format.toUpperCase()}</span>
              <span>{meta.variant}</span>
            </>
          )}
          <span>{`${month} ${year}`}</span>
        </div>
        {hasMatches && (
          <div className="flex-0">
            <MatchesButton dataAttribute={slug} count={matches} overideText={matches === 0 ? "view Document" : null} />
          </div>
        )}
      </div>
    </div>
  );
};
