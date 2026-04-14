import { IFamilyDocumentTopics, IMetadata, TFamilyPublic, TGeography, TGeographySubdivision } from "@/types";
import { getLawsPolicyMetadata } from "@/utils/family-metadata/getLawsPolicyMetadata";
import { getLitigationMetadata } from "@/utils/family-metadata/getLitigationMetadata";
import { getMCFMetadata } from "@/utils/family-metadata/getMCFMetadata";
import { getReportsMetadata } from "@/utils/family-metadata/getReportsMetadata";
import { getUNFCCCMetadata } from "@/utils/family-metadata/getUNFCCCMetadata";

// Format the family metadata into a shape suitable for the MetadataBlock component
export const getFamilyMetadata = (
  family: TFamilyPublic,
  familyTopics: IFamilyDocumentTopics | null,
  countries: TGeography[],
  subdivisions: TGeographySubdivision[]
): IMetadata[] => {
  const familyMetadata = [];

  switch (family.attribution.category) {
    case "Litigation":
      familyMetadata.push(...getLitigationMetadata(family, familyTopics, countries, subdivisions));
      break;
    case "Law":
      familyMetadata.push(...getLawsPolicyMetadata(family, familyTopics, countries));
      break;
    case "Multilateral Climate Fund project":
      familyMetadata.push(...getMCFMetadata(family, familyTopics, countries));
      break;
    case "UN submission":
      familyMetadata.push(...getUNFCCCMetadata(family, familyTopics, countries));
      break;
    case "Report":
      familyMetadata.push(...getReportsMetadata(family, familyTopics, countries));
      break;
    default:
      break;
  }

  return familyMetadata;
};
