import sortBy from "lodash/sortBy";
import { Fragment } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { ARROW_RIGHT, EN_DASH } from "@/constants/chars";
import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import { getSubdivisionName } from "@/helpers/getSubdivision";
import { IMetadata, TFamilyPublic, TGeography, TGeographySubdivision } from "@/types";
import { buildConceptHierarchy, TFamilyConceptTreeNode } from "@/utils/buildConceptHierarchy";

import { formatDateShort } from "./timedate";

const hierarchyArrow = ` ${ARROW_RIGHT} `;

// Recursively display the children of a concept
function displayConceptHierarchy(concept: TFamilyConceptTreeNode): React.ReactNode {
  if (concept.children.length === 0) {
    return <span key={concept.id}>{concept.preferred_label}</span>;
  }
  return (
    <span key={concept.id}>
      {concept.preferred_label}
      {concept.children.length > 0 && hierarchyArrow}
      {concept.children.map((child, index) => (
        <Fragment key={child.id}>
          {index > 0 && hierarchyArrow}
          {displayConceptHierarchy(child)}
        </Fragment>
      ))}
    </span>
  );
}

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

  // ---

  if (isUSA && family.published_date) {
    metadata.push({
      label: "Filing year",
      value: formatDateShort(new Date(family.published_date)),
    });
  } else {
    const filingYearEvent = family.events.find((event) => event.event_type === "Filing Year For Action");
    if (filingYearEvent) {
      metadata.push({
        label: "Filing year",
        value: new Date(filingYearEvent.date).getFullYear(),
      });
    }
  }

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
    value: <div className="grid">{legalEntities.length > 0 ? legalEntities.map((entity) => displayConceptHierarchy(entity)) : "N/A"}</div>,
  });

  /* Case category */

  const caseCategories = hierarchy.filter((concept) => concept.type === "legal_category");
  metadata.push({
    label: "Case category",
    value: <div className="grid">{caseCategories.length > 0 ? caseCategories.map((category) => displayConceptHierarchy(category)) : "N/A"}</div>,
  });

  /* Principal law */

  const principalLaws = hierarchy.filter((concept) => concept.type === "law");
  metadata.push({
    label: "Principal law",
    value: <div className="grid">{principalLaws.length > 0 ? principalLaws.map((law) => displayConceptHierarchy(law)) : "N/A"}</div>,
  });

  return metadata;
}
