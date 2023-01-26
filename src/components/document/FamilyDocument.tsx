import SquareButton from "@components/buttons/SquareButton";
import { formatDate } from "@utils/timedate";
import { TFamilyDocument } from "@types";

type TFamilyDocumentProps = {
  document: TFamilyDocument;
};

export const FamilyDocument = ({ document }: TFamilyDocumentProps) => {
  const [year, _, month] = formatDate(document.date);
  const isMain = document.type.name === "main";

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(e);
  };

  return (
    <div
      className={`mt-4 cursor-pointer p-3 border border-transparent hover:border-primary-600 ${
        !isMain ? "hover:" : ""
      }bg-offwhite transition duration-300`}
      onClick={handleClick}
    >
      <div className="underline text-primary-600 mb-2">{document.title}</div>
      <div className="flex items-center">
        <div className="flex-1 flex flex-wrap gap-x-8">
          <span className="font-bold">{document.type.description}</span>
          <span>{document.format.toUpperCase()}</span>
          <span>{document.variant.label}</span>
          <span>{`${month} ${year}`}</span>
        </div>
        <div className="flex-0">
          <SquareButton>{document.matches} matches in document</SquareButton>
        </div>
      </div>
    </div>
  );
};
