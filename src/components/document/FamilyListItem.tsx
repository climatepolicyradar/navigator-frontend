import { FC, ReactNode, useContext } from "react";
import { TFamily } from "@types";
import { truncateString } from "@helpers/index";
import { getCategoryIcon } from "@helpers/getCatgeoryIcon";
import { CountryLink } from "@components/CountryLink";
import { ThemeContext } from "@context/ThemeContext";
import { getCountryName } from "@helpers/getCountryFields";
import useConfig from "@hooks/useConfig";
import { LinkWithQuery } from "@components/LinkWithQuery";
import { convertDate } from "@utils/timedate";
import { isSystemGeo } from "@utils/isSystemGeo";

type TProps = {
  family: TFamily;
  children?: ReactNode;
};

export const FamilyListItem: FC<TProps> = ({ family, children }) => {
  const { family_slug, family_geography, family_description, family_name, family_date, family_category } = family;
  const theme = useContext(ThemeContext);
  const configQuery = useConfig();
  const { data: { countries = [] } = {} } = configQuery;

  const country_name = getCountryName(family_geography, countries);
  const [year] = convertDate(family_date);

  return (
    <div className="relative">
      <div className="flex justify-between items-start">
        <h2 className="leading-none flex items-start" data-cy="result-title">
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
        {!isSystemGeo(family_geography) && (
          <CountryLink countryCode={family_geography} className="text-gray-700">
            <span>{country_name}</span>
          </CountryLink>
        )}
        {!isNaN(year) && (
          <>
            <span>&middot;</span>
            <span data-cy="result-year">{year}</span>
          </>
        )}
        {family_category && (
          <>
            <span>&middot;</span>
            <span className="capitalize">{family_category}</span>
          </>
        )}
        {children}
      </div>
      <p
        className="mt-2 text-content"
        data-cy="result-description"
        dangerouslySetInnerHTML={{ __html: truncateString(family_description.replace(/(<([^>]+)>)/gi, ""), 375) }}
      />
    </div>
  );
};
