import sortBy from "lodash/sortBy";
import { Fragment, ReactNode } from "react";

import { ConceptHierarchy } from "@/components/molecules/conceptHierarchy/ConceptHierarchy";
import { GeographyLink } from "@/components/molecules/geographyLink/GeographyLink";
import { ARROW_RIGHT, EN_DASH } from "@/constants/chars";
import { FILING_DATE_EVENT_TYPES } from "@/constants/events";
import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import { getSubdivisionName } from "@/helpers/getSubdivision";
import { IFamilyDocumentTopics, IMetadata, TFamilyPublic, TGeography, TGeographySubdivision } from "@/types";
import { buildConceptHierarchy } from "@/utils/buildConceptHierarchy";
import { getTopicsMetadataItem } from "@/utils/family-metadata/getTopicsMetadataItem";
import { isSystemGeo } from "@/utils/isSystemGeo";
import { familyTopicsHasTopics } from "@/utils/topics/processFamilyTopics";

const hierarchyArrow = ` ${ARROW_RIGHT} `;

export function getLitigationMetadata(
  family: TFamilyPublic,
  familyTopics: IFamilyDocumentTopics | null,
  countries: TGeography[],
  subdivisions: TGeographySubdivision[]
): IMetadata[] {
  const metadata = [];

  // Structure concepts into a hierarchy we can use
  const hierarchy = buildConceptHierarchy(family.concepts);

  const isUSA = family.geographies.some((geo) => geo.code === "USA");

  /* Filing year */
  let filingTimestamp = family.events.find((event) => FILING_DATE_EVENT_TYPES.includes(event.event_type))?.date;
  if (isUSA && family.published_date) filingTimestamp = family.published_date;

  metadata.push({
    label: "Filing year",
    value: filingTimestamp ? new Date(filingTimestamp).getUTCFullYear() : EN_DASH,
  });

  /* Status */
  metadata.push({
    label: "Status",
    value: family.metadata.status ?? EN_DASH,
  });

  /* Geography */
  if (family.geographies.length > 0) {
    metadata.push({
      label: "Geography",
      value: family.geographies.map((geo, index) => (
        <Fragment key={geo.slug}>
          {!isSystemGeo(geo.name) ? <GeographyLink {...geo} /> : <span>{geo.name}</span>}
          {index + 1 < family.geographies.length && hierarchyArrow}
        </Fragment>
      )),
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
        {legalEntities.length > 0 ? legalEntities.map((entity) => <ConceptHierarchy key={entity.id} concept={entity} />) : EN_DASH}
      </div>
    ),
  });

  /* Case category */
  const caseCategories = hierarchy.filter((concept) => concept.type === "legal_category");
  metadata.push({
    label: "Case category",
    value: (
      <div className="grid">
        {caseCategories.length > 0 ? caseCategories.map((category) => <ConceptHierarchy key={category.id} concept={category} />) : EN_DASH}
      </div>
    ),
  });

  /* Principal law */
  const principalLaws = hierarchy.filter((concept) => concept.type === "law");
  metadata.push({
    label: "Principal law",
    value: (
      <div className="grid">{principalLaws.length > 0 ? principalLaws.map((law) => <ConceptHierarchy key={law.id} concept={law} />) : EN_DASH}</div>
    ),
  });

  /* At issue */
  let atIssueValue: ReactNode = null;

  if (isUSA && family.collections[0]) {
    atIssueValue = <span>{family.collections[0].description}</span>;
  } else if (!isUSA && family.metadata.core_object?.length > 0) {
    atIssueValue = family.metadata.core_object.map((label) => <span key={label}>{label}</span>);
  }

  if (atIssueValue) {
    metadata.push({
      label: "At issue",
      value: <div className="grid">{atIssueValue}</div>,
    });
  }

  /* Topics */
  if (familyTopicsHasTopics(familyTopics)) {
    const topics = getTopicsMetadataItem(familyTopics);
    if (topics) metadata.push(topics);
  }

  return metadata;
}
