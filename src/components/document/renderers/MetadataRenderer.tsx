import { TFamilyMetadata, TMCFFamilyMetadata, TFamilyPage } from "@types";

import { FamilyMeta } from "../FamilyMeta";
import { McfFamilyMeta } from "../McfFamilyMeta";

const MultilateralClimateFunds = "MCF";

interface TProps {
  family: TFamilyPage;
}

type TFamilyMetadataUnion = TFamilyMetadata | TMCFFamilyMetadata;

export const MetadataRenderer = ({ family }: TProps) => {
  const { metadata, organisation, category, geographies, corpus_type_name, published_date } = family || {};

  const mcfFamilyMetadata: TFamilyMetadataUnion = {
    geographies,
    ...metadata,
    organisation,
    category,
  };

  if (category !== MultilateralClimateFunds) {
    return (
      <FamilyMeta
        category={category}
        corpus_type_name={corpus_type_name}
        date={published_date}
        geographies={geographies}
        topics={metadata?.topic}
        author={metadata?.author_type}
      />
    );
  }
  return <McfFamilyMeta metadata={mcfFamilyMetadata} />;
};
