import { IMetadata, TFamilyPublic, TGeography, TGeographySubdivision } from "@/types";
import { getLawsPolicyMetadata } from "@/utils/family-metadata/getLawsPolicyMetadata";
import { getLitigationMetadata } from "@/utils/family-metadata/getLitigationMetadata";
import { getMCFMetadata } from "@/utils/family-metadata/getMCFMetadata";

// Format the family metadata into a shape suitable for the MetadataBlock component
export const getFamilyMetadata = (family: TFamilyPublic, countries: TGeography[], subdivisions: TGeographySubdivision[]): IMetadata[] => {
  const familyMetadata = [];

  // TODO: handle more categories and their specific metadata later
  if (family.corpus_type_name.toLowerCase() === "litigation") {
    familyMetadata.push(...getLitigationMetadata(family, countries, subdivisions));
  }

  if (["laws and policies"].includes(family.corpus_type_name.toLowerCase())) {
    familyMetadata.push(...getLawsPolicyMetadata(family, countries, subdivisions));
  }

  if (["af", "cif", "gcf", "gef"].includes(family.corpus_type_name.toLowerCase())) {
    familyMetadata.push(...getMCFMetadata(family, countries, subdivisions));
  }

  return familyMetadata;
};
