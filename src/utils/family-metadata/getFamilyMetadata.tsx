import { IMetadata, TFamilyPublic, TGeography, TGeographySubdivision } from "@/types";
import { getLawsPolicyMetadata } from "@/utils/family-metadata/getLawsPolicyMetadata";
import { getLitigationMetadata } from "@/utils/family-metadata/getLitigationMetadata";
import { getMCFMetadata } from "@/utils/family-metadata/getMCFMetadata";
import { getReportsMetadata } from "@/utils/family-metadata/getReportsMetadata";
import { getUNFCCCMetadata } from "@/utils/family-metadata/getUNFCCCMetadata";

// Format the family metadata into a shape suitable for the MetadataBlock component
export const getFamilyMetadata = (family: TFamilyPublic, countries: TGeography[], subdivisions: TGeographySubdivision[]): IMetadata[] => {
  const familyMetadata = [];

  switch (family.corpus_type_name) {
    case "Litigation":
      familyMetadata.push(...getLitigationMetadata(family, countries, subdivisions));
      break;
    case "Laws and Policies":
      familyMetadata.push(...getLawsPolicyMetadata(family, countries));
      break;
    case "AF":
    case "CIF":
    case "GCF":
    case "GEF":
      familyMetadata.push(...getMCFMetadata(family, countries));
      break;
    case "Intl. agreements":
      familyMetadata.push(...getUNFCCCMetadata(family, countries));
      break;
    case "Reports":
      familyMetadata.push(...getReportsMetadata(family, countries));
      break;
    default:
      break;
  }

  return familyMetadata;
};
