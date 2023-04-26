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
      <div className="flex flex-wrap text-sm text-indigo-400 mt-4 items-center font-medium">
        {family_category && (
          <div className="mr-3" title={family_category} data-cy="result-category">
            {getCategoryIcon(family_category, "20")}
          </div>
        )}
        <CountryLink countryCode={family_geography}>
          <div className={`rounded-sm border border-black flag-icon-background flag-icon-${family_geography.toLowerCase()}`} />
          <span className="ml-2">{country_name}</span>
        </CountryLink>
        {!isNaN(year) && <span data-cy="result-year">, {year}</span>}
        {children}
      </div>
      <LinkWithQuery href={`/document/${family_slug}`} passHref>
        <p
          className="text-indigo-400 mt-3 text-content"
          data-cy="result-description"
          dangerouslySetInnerHTML={{ __html: truncateString(family_description.replace(/(<([^>]+)>)/gi, ""), 375) }}
        />
      </LinkWithQuery>
    </div>
  );
};
