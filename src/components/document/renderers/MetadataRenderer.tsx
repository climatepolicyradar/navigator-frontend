import { getApprovedYearFromEvents } from "@/helpers/getApprovedYearFromEvents";
import { TFamilyMetadata, TMCFFamilyMetadata, TFamilyPublic } from "@/types";

import { FamilyMeta } from "../FamilyMeta";
import { McfFamilyMeta } from "../McfFamilyMeta";

const MultilateralClimateFunds = "MCF";

interface IProps {
  family: TFamilyPublic;
}

type TFamilyMetadataUnion = TFamilyMetadata | TMCFFamilyMetadata;

export const MetadataRenderer = ({ family }: IProps) => {
  const { metadata, organisation, category, geographies, corpus_id, corpus_type_name, published_date, documents } = family || {};
  const document_type = documents && documents.length > 0 ? documents[0].document_type : undefined;

  const mcfFamilyMetadata: TFamilyMetadataUnion = {
    geographies,
    approval_date: getApprovedYearFromEvents(family.events),
    ...metadata,
    organisation,
    category,
    document_type: [document_type],
  };

  if (category !== MultilateralClimateFunds) {
    return (
      <FamilyMeta
        category={category}
        corpus_id={corpus_id}
        corpus_type_name={corpus_type_name}
        date={published_date}
        geographies={geographies}
        topics={metadata?.topic}
        author={category === "Reports" ? metadata?.author : metadata?.author_type}
        document_type={document_type}
        metadata={metadata}
      />
    );
  }
  return <McfFamilyMeta metadata={mcfFamilyMetadata} />;
};
