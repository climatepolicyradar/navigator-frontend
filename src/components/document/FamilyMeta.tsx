import useConfig from "@/hooks/useConfig";
import { getCategoryName } from "@/helpers/getCategoryName";
import { convertDate } from "@utils/timedate";
import { TCategory, TCorpusTypeSubCategory } from "@/types";
import { CountryLinks } from "@/components/CountryLinks";

type TProps = {
  category: TCategory;
  corpus_type_name: TCorpusTypeSubCategory;
  source?: string;
  date: string;
  geographies: string[];
  topics?: string[];
  author?: string[];
  document_type?: string;
};

export const FamilyMeta = ({ category, date, geographies, topics, author, corpus_type_name, document_type, source }: TProps) => {
  const configQuery = useConfig();
  const { data: { countries = [] } = {} } = configQuery;

  const [year] = convertDate(date);

  return (
    <>
      <CountryLinks geographies={geographies} countries={countries} />
      {/* TODO: we need to revisit this once we have updated the config, so that we can determine this output based on the corpora */}
      {!isNaN(year) && <span data-cy="family-metadata-year">{`${category === "MCF" ? "Approval FY: " + year : year}`}</span>}
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
      {category && (
        <span className="capitalize" data-cy="family-metadata-category">
          {getCategoryName(category, corpus_type_name, source)}
        </span>
      )}
      {document_type && (
        <span className="capitalize" data-cy="family-metadata-document_type">
          {document_type}
        </span>
      )}
    </>
  );
};
