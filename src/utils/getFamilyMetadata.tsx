import { IMetadata, TFamilyPublic, TGeography, TGeographySubdivision } from "@/types";
import { getLawsPolicyMetadata } from "@/utils/family-metadata/getLawsPolicyMetadata";
import { getLitigationMetadata } from "@/utils/family-metadata/getLitigationMetadata";
import { getMCFMetadata } from "@/utils/family-metadata/getMCFMetadata";
import { getReportsMetadata } from "@/utils/family-metadata/getReportsMetadata";
import { getUNFCCCMetadata } from "@/utils/family-metadata/getUNFCCCMetadata";

// Format the family metadata into a shape suitable for the MetadataBlock component
export const getFamilyMetadata = (family: TFamilyPublic, countries: TGeography[], subdivisions: TGeographySubdivision[]): IMetadata[] => {
  const familyMetadata = [];

  // TODO: handle more categories and their specific metadata later
  if (["litigation"].includes(family.corpus_type_name.toLowerCase())) {
    familyMetadata.push(...getLitigationMetadata(family, countries, subdivisions));
  }

  if (["laws and policies"].includes(family.corpus_type_name.toLowerCase())) {
    familyMetadata.push(...getLawsPolicyMetadata(family, countries));
  }

  if (["af", "cif", "gcf", "gef"].includes(family.corpus_type_name.toLowerCase())) {
    familyMetadata.push(...getMCFMetadata(family, countries));
  }

  if (["intl. agreements"].includes(family.corpus_type_name.toLowerCase())) {
    familyMetadata.push(...getUNFCCCMetadata(family, countries));
  }

  if (["reports"].includes(family.corpus_type_name.toLowerCase())) {
    familyMetadata.push(...getReportsMetadata(family, countries));
  }

  return familyMetadata;
};
