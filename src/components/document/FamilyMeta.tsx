import { CountryLinks } from "@/components/CountryLinks";
import { getCategoryName } from "@/helpers/getCategoryName";
import useConfig from "@/hooks/useConfig";
import { TCategory, TCorpusTypeSubCategory, TFamilyConcept, TFamilyMetadata } from "@/types";
import { getMostSpecificCourts, getMostSpecificCourtsFromMetadata } from "@/utils/getMostSpecificCourts";
import { convertDate } from "@/utils/timedate";

import { CountryLinkWithSubdivisions } from "../CountryLinkWithSubdivisions";

interface IProps {
  category: TCategory;
  corpus_type_name: TCorpusTypeSubCategory;
  source?: string;
  date: string;
  geographies: string[];
  topics?: string[];
  author?: string[];
  document_type?: string;
  concepts?: TFamilyConcept[];
  metadata?: TFamilyMetadata;
}

export const FamilyMeta = ({ category, date, geographies, topics, author, corpus_type_name, document_type, source, concepts, metadata }: IProps) => {
  const configQuery = useConfig();
  const { data: { countries = [], subdivisions = [] } = {} } = configQuery;

  const [year] = convertDate(date);

  const includeSubdivisions = geographies?.some((geography) =>
    subdivisions.some((subdivision) => subdivision.value.toLowerCase() === geography.toLowerCase())
  );

  const CountryLinkComponent = includeSubdivisions ? CountryLinkWithSubdivisions : CountryLinks;

  // Get court name from concepts if available, otherwise try metadata
  const courtName = concepts ? getMostSpecificCourts(concepts) : metadata ? getMostSpecificCourtsFromMetadata(metadata) : null;

  return (
    <>
      <CountryLinkComponent geographies={geographies} countries={countries} subdivisions={subdivisions} />
      {/* TODO: we need to revisit this once we have updated the config, so that we can determine this output based on the corpora */}
      {!isNaN(year) && <span data-cy="family-metadata-year">{`${category === "MCF" ? "Approval FY: " + year : year}`}</span>}
      {courtName && (
        <span className="capitalize" data-cy="family-metadata-court">
          {courtName}
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
