import { ReactNode } from "react";

import { TFamilyPage, IMetadata } from "@/types";

// Format the family metadata into a shape suitable for the MetadataBlock component
export const getFamilyMetadata = (family: TFamilyPage): IMetadata[] => {
  const familyMetadata = [];

  // TODO: handle more categories and their specific metadata later
  if (family.category === "Litigation") {
    familyMetadata.push(...getLitigationMetaData(family));
  }

  return familyMetadata;
};

function getLitigationMetaData(family: TFamilyPage): IMetadata[] {
  const metadata = [];

  if (family.published_date) {
    metadata.push({
      label: "Filing year",
      value: family.published_date,
    });
  }

  if (family.metadata.case_number?.length > 0) {
    metadata.push({
      label: "Docket number",
      value: <div className="grid">{family.metadata.case_number?.map((label) => <span key={label}>{label}</span>) || "N/A"}</div>,
    });
  }

  if (family.metadata.status) {
    metadata.push({
      label: "Status",
      value: family.metadata.status,
    });
  }

  if (family.metadata.concept_preferred_label) {
    metadata.push({
      label: "Concept preferred label",
      value: <div className="grid">{family.metadata.concept_preferred_label?.map((label) => <span key={label}>{label}</span>) || "N/A"}</div>,
    });
  }

  return metadata;
}
