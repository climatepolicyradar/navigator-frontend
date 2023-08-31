import useConfig from "@hooks/useConfig";
import { CountryLink } from "@components/CountryLink";
import { getCountryName } from "@helpers/getCountryFields";
import { getCategoryName } from "@helpers/getCategoryName";
import { isSystemGeo } from "@utils/isSystemGeo";
import { convertDate } from "@utils/timedate";
import { TCategory } from "@types";

type TProps = {
  category: TCategory;
  date: string;
  geography: string;
};

export const FamilyMeta = ({ category, date, geography }: TProps) => {
  const configQuery = useConfig();
  const { data: { countries = [] } = {} } = configQuery;

  const [year] = convertDate(date);
  const country_name = getCountryName(geography, countries);

  return (
    <>
      {!isSystemGeo(geography) && (
        <>
          <CountryLink countryCode={geography} className="text-gray-700">
            <span>{country_name}</span>
          </CountryLink>
          <span>&middot;</span>
        </>
      )}
      {!isNaN(year) && (
        <>
          <span data-cy="result-year">{year}</span>
          <span>&middot;</span>
        </>
      )}
      {category && (
        <>
          <span className="capitalize" data-cy="result-category">
            {getCategoryName(category)}
          </span>
        </>
      )}
    </>
  );
};
