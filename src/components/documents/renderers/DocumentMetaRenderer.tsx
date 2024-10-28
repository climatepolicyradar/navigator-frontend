import { McfFamilyMeta } from "@components/document/McfFamilyMeta";
import { DocumentMeta } from "../DocumentMeta";
import { getApprovedYearFromEvents } from "@helpers/getApprovedYearFromEvents";

const MULTILATERALCLIMATEFUNDSCATEGORY = "MCF";

export const DocumentMetaRenderer = ({ family, isMain, document }) => {
  const { metadata, organisation, category, geographies } = family || {};

  const mcfFamilyMetadata = {
    geographies,
    approval_date: getApprovedYearFromEvents(family.events),
    ...metadata,
    organisation,
    category,
  };

  if (category !== MULTILATERALCLIMATEFUNDSCATEGORY) {
    return <DocumentMeta family={family} isMain={isMain} document={document} />;
  }

  return <McfFamilyMeta metadata={mcfFamilyMetadata} />;
};
