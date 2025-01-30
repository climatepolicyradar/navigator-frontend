import { McfFamilyMeta } from "@components/document/McfFamilyMeta";
import { DocumentMeta } from "../DocumentMeta";
import { getApprovedYearFromEvents } from "@helpers/getApprovedYearFromEvents";
import { TConcept } from "@types";

const MULTILATERALCLIMATEFUNDSCATEGORY = "MCF";

export const DocumentMetaRenderer = ({
  family,
  isMain,
  document,
  concepts,
}: {
  family: any;
  isMain: boolean;
  document: any;
  concepts?: (TConcept & { count: number })[];
}) => {
  const { metadata, organisation, category, geographies } = family || {};

  const mcfFamilyMetadata = {
    geographies,
    approval_date: getApprovedYearFromEvents(family.events),
    ...metadata,
    organisation,
    category,
  };

  if (category !== MULTILATERALCLIMATEFUNDSCATEGORY) {
    return <DocumentMeta family={family} isMain={isMain} document={document} concepts={concepts} />;
  }

  return <McfFamilyMeta metadata={mcfFamilyMetadata} concepts={concepts} />;
};
