import { useContext } from "react";

import { CountryLinks } from "@/components/CountryLinks";
import { WikiBaseConceptsContext } from "@/context/WikiBaseConceptsContext";
import { getCategoryName } from "@/helpers/getCategoryName";
import useConfig from "@/hooks/useConfig";
import { TCategory, TCorpusTypeSubCategory, TFamilyConcept, TFamilyMetadata, TConcept } from "@/types";
import { getMostSpecificCourtsFromWikiConcepts } from "@/utils/getMostSpecificCourts";
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
  metadata: TFamilyMetadata;
}

function getJurisdictionsFromMetadata(metadata) {
  const labels = metadata.concept_preferred_label || [];
  return labels.filter((label) => label.startsWith("jurisdiction/"));
}

export const FamilyMeta = ({ category, date, geographies, topics, author, corpus_type_name, document_type, source, metadata }: IProps) => {
  const configQuery = useConfig();
  const { data: { countries = [], subdivisions = [] } = {} } = configQuery;
  const allConcepts = useContext(WikiBaseConceptsContext);
  const wikiJurisdictionConcepts = allConcepts.filter((concept) => concept.wikibase_id.startsWith("jurisdiction/"));

  const [year] = convertDate(date);

  const includeSubdivisions = geographies?.some((geography) =>
    subdivisions.some((subdivision) => subdivision.value.toLowerCase() === geography.toLowerCase())
  );

  const vespaJurisdictions = getJurisdictionsFromMetadata(metadata);

  const familyJurisdictionConcepts = wikiJurisdictionConcepts.filter((concept) => vespaJurisdictions.includes(concept.wikibase_id));

  const CountryLinkComponent = includeSubdivisions ? CountryLinkWithSubdivisions : CountryLinks;
  const mostSpecificCourtName = getMostSpecificCourtsFromWikiConcepts(familyJurisdictionConcepts);

  return (
    <>
      <CountryLinkComponent geographies={geographies} countries={countries} subdivisions={subdivisions} />
      {/* TODO: we need to revisit this once we have updated the config, so that we can determine this output based on the corpora */}
      {!isNaN(year) && <span data-cy="family-metadata-year">{`${category === "MCF" ? "Approval FY: " + year : year}`}</span>}
      {mostSpecificCourtName && (
        <span className="capitalize" data-cy="family-metadata-court">
          {mostSpecificCourtName}
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
