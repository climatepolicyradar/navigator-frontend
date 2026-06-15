import { FamilyMeta } from "@/components/document/FamilyMeta";
import { Heading } from "@/components/typography/Heading";
import { TMatchedFamily } from "@/types";

export const FamilyMatchesTitle = ({ family }: { family?: TMatchedFamily }) => {
  if (!family) return null;
  const { family_name, family_category, family_date, corpus_import_id, corpus_type_name, family_geographies } = family;

  return (
    <>
      <div className="flex flex-wrap text-sm gap-1 mb-2 items-center middot-between">
        <FamilyMeta
          category={family_category}
          corpus_id={corpus_import_id}
          corpus_type_name={corpus_type_name}
          geographies={family_geographies}
          date={family_date}
          metadata={{}}
        />
      </div>
      <Heading level={3} extraClasses="!mb-0">
        {family_name}
      </Heading>
    </>
  );
};
