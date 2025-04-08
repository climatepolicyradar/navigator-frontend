import { McfFamilyMeta } from "@/components/document/McfFamilyMeta";
import { getApprovedYearFromEvents } from "@/helpers/getApprovedYearFromEvents";

import { DocumentMeta } from "../DocumentMeta";

export const MULTILATERALCLIMATEFUNDSCATEGORY = "MCF";

export const DocumentMetaRenderer = ({ family, isMain, document }: { family: any; isMain: boolean; document: any }) => {
  const { metadata, organisation, category, geographies, documents } = family || {};
  const document_type = documents && documents.length > 0 ? documents[0].document_type : undefined;

  const mcfFamilyMetadata = {
    geographies,
    approval_date: getApprovedYearFromEvents(family.events),
    ...metadata,
    organisation,
    category,
    document_type: document_type,
  };

  if (category !== MULTILATERALCLIMATEFUNDSCATEGORY) {
    return <DocumentMeta family={family} isMain={isMain} document={document} document_type={document_type} />;
  }

  return <McfFamilyMeta metadata={mcfFamilyMetadata} />;
};
