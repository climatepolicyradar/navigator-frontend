import { FamilyMeta } from "../FamilyMeta";
import { McfFamilyMeta } from "../McfFamilyMeta";

const MultilateralClimateFunds = "MCF";

export const MetadataRenderer = ({ family }) => {
  const family_metadata = { ...family?.metadata, organisation: family.organisation, category: family.category, geographies: family.geographies };

  if (family?.category !== MultilateralClimateFunds) {
    return (
      <FamilyMeta
        category={family.category}
        corpus_type_name={family.corpus_type_name}
        date={family.published_date}
        geography={family.geography}
        topics={family.metadata?.topic}
        author={family.metadata?.author_type}
      />
    );
  }
  return <McfFamilyMeta metadata={family_metadata} />;
};
