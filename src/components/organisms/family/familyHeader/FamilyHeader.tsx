import { FamilyMeta } from "@/components/document/FamilyMeta";
import { TFamilyPage } from "@/types";

type TProps = { family: TFamilyPage };

export const FamilyHeader = ({ family }: TProps) => {
  return (
    <>
      <div className="flex flex-wrap text-sm gap-2 mb-2 items-center">
        <FamilyMeta
          category={family.category}
          corpus_type_name={family.corpus_type_name}
          geographies={family.geographies}
          source={family.category}
          date={family.published_date}
          {...(family.corpus_type_name === "Reports" ? { author: (family.metadata as { author: string[] }).author } : {})}
        />
      </div>
      <h1 className="text-4xl leading-tight font-[640] text-text-primary">{family.title}</h1>
    </>
  );
};
