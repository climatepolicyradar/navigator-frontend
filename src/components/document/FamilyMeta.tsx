import useConfig from "@hooks/useConfig";
import { CountryLink } from "@components/CountryLink";
import { getCountryName } from "@helpers/getCountryFields";
import { getCategoryName } from "@helpers/getCategoryName";
import { isSystemGeo } from "@utils/isSystemGeo";
import { convertDate } from "@utils/timedate";
import { TCategory, TCorpusTypeSubCategory } from "@types";

type TProps = {
  category: TCategory;
  corpus_type_name: TCorpusTypeSubCategory;
  date: string;
  geographies: string[] | null;
  topics?: string[];
  author?: string[];
};

export const FamilyMeta = ({ category, date, geographies, topics, author, corpus_type_name }: TProps) => {
  const configQuery = useConfig();
  const { data: { countries = [] } = {} } = configQuery;

  const [year] = convertDate(date);

  return (
    <>
      {geographies?.map(
        (geography, index) =>
          !isSystemGeo(geography) && (
            <span key={index} className="flex gap-1">
              <CountryLink countryCode={geography} className="text-textDark no-underline">
                <span>{getCountryName(geography, countries)}</span>
              </CountryLink>
            </span>
          )
      )}
      {!isNaN(year) && <span data-cy="family-metadata-year">Approval FY: {year}</span>}
      {category && (
        <span className="capitalize" data-cy="family-metadata-category">
          {getCategoryName(category, corpus_type_name)}
        </span>
      )}
      {topics && topics.length > 0 && (
        <span className="capitalize" data-cy="family-metadata-topics">
          {topics.join(", ")}
        </span>
      )}
      {author && author.length > 0 && (
        <span className="capitalize" data-cy="family-metadata-author">
          {author.join(", ")}
        </span>
      )}
    </>
  );
};
