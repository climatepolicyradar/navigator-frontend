import { McfFamilyMeta } from "@components/document/McfFamilyMeta";
import { DocumentMeta } from "../DocumentMeta";
import { getApprovedYearFromEvents } from "@helpers/getApprovedYearFromEvents";

export const MULTILATERALCLIMATEFUNDSCATEGORY = "MCF";

export const DocumentMetaRenderer = ({ family, isMain, document }) => {
  const { metadata, organisation, category, geographies, documents } = family || {};

  const mcfFamilyMetadata = {
    geographies,
    approval_date: getApprovedYearFromEvents(family.events),
    ...metadata,
    organisation,
    category,
    document_type: documents[0].document_type,
  };

  if (category !== MULTILATERALCLIMATEFUNDSCATEGORY) {
    return <DocumentMeta family={family} isMain={isMain} document={document} document_type={documents[0].document_type} />;
  }

  return <McfFamilyMeta metadata={mcfFamilyMetadata} />;
};
