import { Fragment } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import { IMetadata, TGeography, TFamilyNew } from "@/types";
import { buildConceptHierarchy, TFamilyConceptTreeNode } from "@/utils/buildConceptHierarchy";

// Recursively display the children of a concept
function displayConceptHierarchy(concept: TFamilyConceptTreeNode): React.ReactNode {
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
          {displayConceptHierarchy(child)}
        </Fragment>
      ))}
    </span>
  );
}

// Format the family metadata into a shape suitable for the MetadataBlock component
export const getFamilyMetadata = (family: TFamilyNew, countries: TGeography[]): IMetadata[] => {
  const familyMetadata = [];

  // TODO: handle more categories and their specific metadata later
  if (family.corpus_type_name.toLowerCase() === "litigation") {
    familyMetadata.push(...getLitigationMetaData(family, countries));
  }

  return familyMetadata;
};

function getLitigationMetaData(family: TFamilyNew, countries: TGeography[]): IMetadata[] {
  const metadata = [];

  // Structure concepts into a hierarchy we can use
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
    value: (
      <div className="grid">
        {family.metadata.case_number?.length > 0 ? family.metadata.case_number?.map((label) => <span key={label}>{label}</span>) : "N/A"}
      </div>
    ),
  });

  metadata.push({
    label: "At issue",
    value: (
      <div className="grid">
        {family.metadata.core_object.length > 0 ? family.metadata.core_object.map((label) => <span key={label}>{label}</span>) : "N/A"}
      </div>
    ),
  });

  metadata.push({
    label: "Status",
    value: family.metadata.status ?? "N/A",
  });

  const legalEntities = hierarchy.filter((concept) => concept.type === "legal_entity");
  metadata.push({
    label: "Court/Admin entity",
    value: <div className="grid">{legalEntities.length > 0 ? legalEntities.map((entity) => displayConceptHierarchy(entity)) : "N/A"}</div>,
  });

  const caseCategories = hierarchy.filter((concept) => concept.type === "legal_category");
  metadata.push({
    label: "Case category",
    value: <div className="grid">{caseCategories.length > 0 ? caseCategories.map((category) => displayConceptHierarchy(category)) : "N/A"}</div>,
  });

  const principalLaws = hierarchy.filter((concept) => concept.type === "law");
  metadata.push({
    label: "Principal law",
    value: <div className="grid">{principalLaws.length > 0 ? principalLaws.map((law) => displayConceptHierarchy(law)) : "N/A"}</div>,
  });

  return metadata;
}
