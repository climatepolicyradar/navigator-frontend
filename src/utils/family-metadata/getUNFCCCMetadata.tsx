import { Geographies } from "@/components/molecules/geographies/Geographies";
import { EN_DASH } from "@/constants/chars";
import { IFamilyDocumentTopics, IMetadata, TFamilyPublic } from "@/types";
import { getTopicsMetadataItem } from "@/utils/family-metadata/getTopicsMetadataItem";
import { convertDate } from "@/utils/timedate";
import { familyTopicsHasTopics } from "@/utils/topics/processFamilyTopics";

export function getUNFCCCMetadata(family: TFamilyPublic, familyTopics: IFamilyDocumentTopics | null): IMetadata[] {
  const metadata = [];

  const [year] = convertDate(family.published_date);
  const document_type = family.documents && family.documents.length > 0 ? family.documents[0].document_type : null;

  /* Year */
  metadata.push({
    label: "Year",
    value: year || EN_DASH,
  });

  /* Geography */
  if (family.geographies.length > 0) {
    metadata.push({
      label: "Geography",
      value: <Geographies geographyLabels={family.geographies} />,
    });
  }

  /* Document Type */
  metadata.push({
    label: "Type",
    value: document_type || EN_DASH,
  });

  if (family?.metadata?.author_type) {
    metadata.push({
      label: "Author Type",
      value: family.metadata?.author_type.join(", ") || EN_DASH,
    });
  }

  if (family?.metadata?.author) {
    metadata.push({
      label: "Author",
      value: family.metadata?.author.join(", ") || EN_DASH,
    });
  }

  /* Topics */
  if (familyTopicsHasTopics(familyTopics)) {
    const topics = getTopicsMetadataItem(familyTopics);
    if (topics) metadata.push(topics);
  }

  return metadata;
}
