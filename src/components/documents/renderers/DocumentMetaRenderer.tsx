import { McfFamilyMeta } from "@/components/document/McfFamilyMeta";
import { getApprovedYearFromEvents } from "@/helpers/getApprovedYearFromEvents";
import { TDocumentPage, TFamilyPublic } from "@/types";

import { DocumentMeta } from "../DocumentMeta";

export const DocumentMetaRenderer = ({ family, isMain, document }: { family: TFamilyPublic; isMain: boolean; document: TDocumentPage }) => {
  const {
    attribution: { category, taxonomy: fund },
    documents,
    geographies,
    metadata,
  } = family || {};
  const document_type = documents && documents.length > 0 ? documents[0].document_type : undefined;

  const mcfFamilyMetadata = {
    geographies,
    approval_date: getApprovedYearFromEvents(family.events),
    ...metadata,
    category,
    document_type: document_type,
    fund,
  };

  if (category !== "Multilateral Climate Fund project") {
    return <DocumentMeta family={family} isMain={isMain} document={document} document_type={document_type} />;
  }

  return <McfFamilyMeta metadata={mcfFamilyMetadata} />;
};
