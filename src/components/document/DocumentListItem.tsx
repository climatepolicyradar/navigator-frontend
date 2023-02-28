import { FC, useContext } from "react";
import Link from "next/link";
import { getCategoryIcon } from "@helpers/getCatgeoryIcon";
import { ThemeContext } from "@context/ThemeContext";
import { convertDate } from "@utils/timedate";
import { TFamilyDocument } from "@types";

type TProps = {
  document: TFamilyDocument;
};

export const DocumentListItem: FC<TProps> = ({ document }) => {
  const {
    document_content_type,
    document_date,
    document_passage_matches,
    document_slug,
    document_source_url,
    document_title,
    document_type,
    document_url,
  } = document;

  const theme = useContext(ThemeContext);

  const formatDate = () => {
    const eudate = document_date;
    const dateArr = eudate.split("/");
    return `${dateArr[1]}/${dateArr[0]}/${dateArr[2]}`;
  };
  const [year] = convertDate(formatDate());

  return (
    <div className="relative">
      <div className="flex justify-between items-start">
        <h2 className="leading-none flex items-start">
          <Link
            href={`/document/${document_slug}`}
            className={`text-left text-blue-500 font-medium text-lg transition duration-300 leading-tight hover:underline ${
              theme === "cpr" ? "underline" : ""
            }`}
            passHref
          >
            {document_title}
          </Link>
        </h2>
      </div>
      <div className="flex flex-wrap text-sm text-indigo-400 mt-4 items-center font-medium">
        <span>{year}</span>
      </div>
    </div>
  );
};
