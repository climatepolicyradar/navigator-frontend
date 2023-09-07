import { FC, ReactNode, useContext } from "react";
import { TFamily } from "@types";
import { truncateString } from "@helpers/index";
import { ThemeContext } from "@context/ThemeContext";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { FamilyMeta } from "./FamilyMeta";

type TProps = {
  family: TFamily;
  children?: ReactNode;
};

export const FamilyListItem: FC<TProps> = ({ family, children }) => {
  const { family_slug, family_geography, family_description, family_name, family_date, family_category } = family;
  const theme = useContext(ThemeContext);

  return (
    <div className="relative">
      <div className="flex justify-between items-start">
        <h2 className="leading-none flex items-start" data-cy="family-title">
          <LinkWithQuery
            href={`/document/${family_slug}`}
            className={`text-left text-blue-500 font-medium text-lg transition duration-300 leading-tight hover:underline ${
              theme === "cpr" ? "underline" : ""
            }`}
            passHref
          >
            {family_name}
          </LinkWithQuery>
        </h2>
      </div>
      <div className="flex flex-wrap text-sm gap-1 text-gray-700 mt-2 items-center font-medium">
        <FamilyMeta category={family_category} date={family_date} geography={family_geography} />
        {children}
      </div>
      <p
        className="mt-2 text-content"
        data-cy="family-description"
        dangerouslySetInnerHTML={{ __html: truncateString(family_description.replace(/(<([^>]+)>)/gi, ""), 375) }}
      />
    </div>
  );
};
