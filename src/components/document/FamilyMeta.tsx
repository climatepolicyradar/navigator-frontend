import { useContext } from "react";

import { getTaxonomyFromV1 } from "@/bff/methods/getTaxonomy";
import { Geographies } from "@/components/molecules/geographies/Geographies";
import { ID_SEPARATOR } from "@/constants/chars";
import { WikiBaseConceptsContext } from "@/context/WikiBaseConceptsContext";
import useConfig from "@/hooks/useConfig";
import { TCategory, TCorpusTypeSubCategory, TFamilyConcept, TFamilyMetadata, TGeography, TLabel } from "@/types";
import { getMostSpecificCourtsFromWikiConcepts } from "@/utils/getMostSpecificCourts";
import { convertDate } from "@/utils/timedate";

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
  corpus_id?: string;
}

function extractJurisdictionsFromMetadata(metadata: TFamilyMetadata): string[] {
  return metadata.concept_preferred_label?.filter((label) => label.startsWith("jurisdiction/")) ?? [];
}

function useFamilyJurisdictionConcepts(metadata: TFamilyMetadata) {
  const allConcepts = useContext(WikiBaseConceptsContext);
  const wikiJurisdictionConcepts = allConcepts.filter((concept) => concept.wikibase_id.startsWith("jurisdiction/"));

  const vespaJurisdictions = extractJurisdictionsFromMetadata(metadata);

  const vespaJurisdictionsSet = new Set(vespaJurisdictions);
  const familyJurisdictionConcepts = wikiJurisdictionConcepts.filter((concept) => vespaJurisdictionsSet.has(concept.wikibase_id));

  return familyJurisdictionConcepts;
}

const upgradeGeographies = (geographies: string[], countries: TGeography[], subdivisions: TGeography[]) =>
  geographies.reduce<TLabel[]>((labels, geoString) => {
    const isCountry = geoString.length === 3;
    const geography = (isCountry ? countries : subdivisions).find((geo) => geo.value === geoString);
    if (!geography) return labels;

    const type = isCountry ? "country" : "subdivision";

    return [
      ...labels,
      {
        id: [type, geography.value].join(ID_SEPARATOR),
        type,
        value: geography.display_value,
      },
    ];
  }, []);

export const FamilyMeta = ({ category, corpus_id, date, geographies, topics, author, corpus_type_name, document_type, source, metadata }: IProps) => {
  const configQuery = useConfig();
  const { data: { countries = [], subdivisions = [] } = {} } = configQuery;

  const [year] = convertDate(date);

  const familyJurisdictionConcepts = useFamilyJurisdictionConcepts(metadata);
  const mostSpecificCourtName = getMostSpecificCourtsFromWikiConcepts(familyJurisdictionConcepts);

  return (
    <>
      <Geographies geographyLabels={upgradeGeographies(geographies, countries, subdivisions)} limit={2} />
      {!isNaN(year) && <span>{`${category === "MCF" ? "Approval FY: " + year : year}`}</span>}
      {mostSpecificCourtName && <span className="capitalize">{mostSpecificCourtName}</span>}
      {topics && topics.length > 0 && <span className="capitalize">{topics.join(", ")}</span>}
      {author && author.length > 0 && <span className="capitalize">{author.join(", ")}</span>}
      {category && <span className="capitalize">{getTaxonomyFromV1(category, corpus_type_name, source, corpus_id)}</span>}
      {document_type && <span className="capitalize">{document_type}</span>}
    </>
  );
};
