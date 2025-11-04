import { Section } from "@/components/molecules/section/Section";
import { InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { IFamilyDocumentTopics, TConcept, TSearchResponse } from "@/types";
import { getTopicTableRows, TopicTableColumns, TTopicTableColumnId } from "@/utils/tables/topic/topicTable";

type TProps = {
  familyTopics: IFamilyDocumentTopics;
};

export const TopicsBlock = ({ familyTopics }: TProps) => {
  return (
    <Section block="topics" title="Topics explorer">
      <InteractiveTable<TTopicTableColumnId>
        columns={TopicTableColumns}
        rows={getTopicTableRows({ rootConcepts: familyTopics.rootConcepts, conceptsGrouped: familyTopics.conceptsGrouped })}
        defaultSort={{ column: "group", order: "desc" }}
      />
    </Section>
  );
};
