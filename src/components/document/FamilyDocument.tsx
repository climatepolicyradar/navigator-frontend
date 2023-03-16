import { useRouter } from "next/router";
import MatchesButton from "@components/buttons/MatchesButton";
import { formatDate } from "@utils/timedate";
import { PDFIcon } from "@components/svg/Icons";

type TProps = {
  title: string;
  date: string;
  slug: string;
  variant: string;
  contentType: string;
  matches?: number;
};

export const FamilyDocument = ({ title, date, slug, variant, matches, contentType }: TProps) => {
  const router = useRouter();
  const [year, _day, _month] = formatDate(date);
  const isMain = variant === "MAIN";
  const hasMatches = typeof matches !== "undefined";

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    router.push({ pathname: `/documents/${slug}`, query: router.query });
  };

  const renderIcon = (t: string) => {
    switch (t) {
      case "application/pdf":
        return <PDFIcon />;
    }
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
        <div className="flex-1 flex flex-wrap gap-x-8 items-center">
          {!!contentType && <span>{renderIcon(contentType)}</span>}
          <span className="capitalize">{variant.toLowerCase()}</span>
          <span>{year}</span>
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
