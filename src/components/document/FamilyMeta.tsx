import useConfig from "@hooks/useConfig";
import { getCategoryName } from "@helpers/getCategoryName";
import { convertDate } from "@utils/timedate";
import { TCategory, TCorpusTypeSubCategory } from "@types";
import { CountriesLink } from "@components/CountriesLink";

type TProps = {
  category: TCategory;
  corpus_type_name: TCorpusTypeSubCategory;
  date: string;
  geographies: string[];
  topics?: string[];
  author?: string[];
};

export const FamilyMeta = ({ category, date, geographies, topics, author, corpus_type_name }: TProps) => {
  const configQuery = useConfig();
  const { data: { countries = [] } = {} } = configQuery;

  const [year] = convertDate(date);

  return (
    <>
      <CountriesLink geographies={geographies} countries={countries} />
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
