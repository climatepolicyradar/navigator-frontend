import { Fragment } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import { TFamilyPage, IMetadata, TGeography } from "@/types";
import { buildConceptHierarchy, TFamilyConceptTreeNode } from "@/utils/buildConceptHierarchy";

// Recursively display the children of a concept
function displayConceptChildren(concept: TFamilyConceptTreeNode): React.ReactNode {
  if (concept.children.length === 0) {
    return <span key={concept.id}>{concept.preferred_label}</span>;
  }
  return (
    <span key={concept.id}>
      {concept.preferred_label}
      {concept.children.length > 0 && " → "}
      {concept.children.map((child, index) => (
        <Fragment key={child.id}>
          {index > 0 && " → "}
          {displayConceptChildren(child)}
        </Fragment>
      ))}
    </span>
  );
}

// Format the family metadata into a shape suitable for the MetadataBlock component
export const getFamilyMetadata = (family: TFamilyPage, countries: TGeography[]): IMetadata[] => {
  const familyMetadata = [];

  // TODO: handle more categories and their specific metadata later
  if (family.category.toLowerCase() === "litigation") {
    familyMetadata.push(...getLitigationMetaData(family, countries));
  }

  return familyMetadata;
};

function getLitigationMetaData(family: TFamilyPage, countries: TGeography[]): IMetadata[] {
  const metadata = [];

  // Structure concepts into a hierarchy for use later
  const hierarchy = buildConceptHierarchy(family.concepts);

  const filingYearEvent = family.events.find((event) => event.event_type === "Filing Year For Action");
  if (filingYearEvent) {
    const year = new Date(filingYearEvent.date).getFullYear();
    metadata.push({
      label: "Filing year",
      value: year,
    });
  }

  if (family.geographies.length > 0) {
    metadata.push({
      label: "Geography",
      value: family.geographies.map((geo, index) => (
        <Fragment key={geo}>
          {index > 0 && getCountrySlug(geo, countries) && " → "}
          <LinkWithQuery key={geo} href={`/geographies/${getCountrySlug(geo, countries)}`} className="underline">
            {getCountryName(geo, countries)}
          </LinkWithQuery>
        </Fragment>
      )),
    });
  }

  metadata.push({
    label: "Docket number",
    value: <div className="grid">{family.metadata.case_number?.map((label) => <span key={label}>{label}</span>) || "N/A"}</div>,
  });

  metadata.push({
    label: "Status",
    value: family.metadata.status ?? "N/A",
  });

  // Court/Admin entity
  const legalEntities = hierarchy.filter((concept) => concept.type === "legal_entity");
  if (legalEntities.length > 0) {
    metadata.push({
      label: "Court/Admin entity",
      value: <div className="grid">{legalEntities.map((entity) => displayConceptChildren(entity))}</div>,
    });
  } else {
    metadata.push({
      label: "Court/Admin entity",
      value: "N/A",
    });
  }

  if (family.metadata.concept_preferred_label) {
    metadata.push({
      label: "Concept preferred label",
      value: <div className="grid">{family.metadata.concept_preferred_label?.map((label) => <span key={label}>{label}</span>) || "N/A"}</div>,
    });
  }

  if (family.metadata.original_case_name.length > 0) {
    metadata.push({
      label: "Original case name",
      value: <div className="grid">{family.metadata.original_case_name?.map((label) => <span key={label}>{label}</span>) || "N/A"}</div>,
    });
  }

  return metadata;
}
