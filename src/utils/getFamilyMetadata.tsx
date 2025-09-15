import sortBy from "lodash/sortBy";
import { Fragment, ReactNode } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { ConceptHierarchy } from "@/components/molecules/conceptHierarchy/ConceptHierarchy";
import { ARROW_RIGHT, EN_DASH } from "@/constants/chars";
import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import { getSubdivisionName } from "@/helpers/getSubdivision";
import { IMetadata, TFamilyPublic, TGeography, TGeographySubdivision } from "@/types";
import { buildConceptHierarchy } from "@/utils/buildConceptHierarchy";

const hierarchyArrow = ` ${ARROW_RIGHT} `;

// Format the family metadata into a shape suitable for the MetadataBlock component
export const getFamilyMetadata = (family: TFamilyPublic, countries: TGeography[], subdivisions: TGeographySubdivision[]): IMetadata[] => {
  const familyMetadata = [];

  // TODO: handle more categories and their specific metadata later
  if (family.corpus_type_name.toLowerCase() === "litigation") {
    familyMetadata.push(...getLitigationMetaData(family, countries, subdivisions));
  }

  return familyMetadata;
};

function getLitigationMetaData(family: TFamilyPublic, countries: TGeography[], subdivisions: TGeographySubdivision[]): IMetadata[] {
  const metadata = [];

  // Structure concepts into a hierarchy we can use
  const hierarchy = buildConceptHierarchy(family.concepts);
  const geosOrdered = sortBy(family.geographies, [(geo) => geo.length !== 3, (geo) => geo.toLowerCase()]);

  const isUSA = geosOrdered.includes("USA");

  /* Filing year */

  let filingTimestamp = family.events.find((event) => event.event_type === "Filing Year For Action")?.date;
  if (isUSA && family.published_date) filingTimestamp = family.published_date;

  metadata.push({
    label: "Filing year",
    value: filingTimestamp ? new Date(filingTimestamp).getFullYear() : EN_DASH,
  });

  /* Status */

  metadata.push({
    label: "Status",
    value: family.metadata.status ?? EN_DASH,
  });

  /* Geography */

  if (geosOrdered.length > 0) {
    metadata.push({
      label: "Geography",
      value: geosOrdered.map((geo, index) => {
        const geoSlug = getCountrySlug(geo, countries);
        return (
          <Fragment key={geo}>
            {geoSlug ? (
              <LinkWithQuery key={geo} href={`/geographies/${geoSlug}`} className="underline">
                {getCountryName(geo, countries)}
              </LinkWithQuery>
            ) : (
              <>{getSubdivisionName(geo, subdivisions)}</>
            )}
            {index + 1 < geosOrdered.length && hierarchyArrow}
          </Fragment>
        );
      }),
    });
  }

  /* Docket number */

  if (isUSA) {
    metadata.push({
      label: "Docket number",
      value: (
        <div className="grid">
          {family.metadata.case_number?.length > 0 ? family.metadata.case_number?.map((label) => <span key={label}>{label}</span>) : EN_DASH}
        </div>
      ),
    });
  }

  /* Court/admin entity */

  const legalEntities = hierarchy.filter((concept) => concept.type === "legal_entity");
  metadata.push({
    label: "Court/admin entity",
    value: (
      <div className="grid">
        {legalEntities.length > 0 ? legalEntities.map((entity) => <ConceptHierarchy key={entity.id} concept={entity} />) : "N/A"}
      </div>
    ),
  });

  /* Case category */

  const caseCategories = hierarchy.filter((concept) => concept.type === "legal_category");
  metadata.push({
    label: "Case category",
    value: (
      <div className="grid">
        {caseCategories.length > 0 ? caseCategories.map((category) => <ConceptHierarchy key={category.id} concept={category} />) : "N/A"}
      </div>
    ),
  });

  /* Principal law */

  const principalLaws = hierarchy.filter((concept) => concept.type === "law");
  metadata.push({
    label: "Principal law",
    value: (
      <div className="grid">{principalLaws.length > 0 ? principalLaws.map((law) => <ConceptHierarchy key={law.id} concept={law} />) : "N/A"}</div>
    ),
  });

  /* At issue */

  let atIssueValue: ReactNode = null;

  if (isUSA && family.collections[0]) {
    atIssueValue = <span>{family.collections[0].description}</span>;
  } else if (!isUSA && family.metadata.core_object.length > 0) {
    atIssueValue = family.metadata.core_object.map((label) => <span key={label}>{label}</span>);
  }

  if (atIssueValue) {
    metadata.push({
      label: "At issue",
      value: <div className="grid">{atIssueValue}</div>,
    });
  }

  return metadata;
}
