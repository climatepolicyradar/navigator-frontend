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
  topics?: string[];
  author?: string[];
};

export const FamilyMeta = ({ category, date, geography, topics, author }: TProps) => {
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
        </>
      )}
      {!isNaN(year) && (
        <>
          <span>&middot;</span>
          <span data-cy="family-metadata-year">{year}</span>
        </>
      )}
      {category && (
        <>
          <span>&middot;</span>
          <span className="capitalize" data-cy="family-metadata-category">
            {getCategoryName(category)}
          </span>
        </>
      )}
      {topics && topics.length > 0 && (
        <>
          <span>&middot;</span>
          <span className="capitalize" data-cy="family-metadata-topics">
            {topics.join(", ")}
          </span>
        </>
      )}
      {author && author.length > 0 && (
        <>
          <span>&middot;</span>
          <span className="capitalize" data-cy="family-metadata-author">
            {author.join(", ")}
          </span>
        </>
      )}
    </>
  );
};
