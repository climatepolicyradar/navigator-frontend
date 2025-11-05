import { Section } from "@/components/molecules/section/Section";
import { InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { IFamilyDocumentTopics } from "@/types";
import { getTopicTableRows, TopicTableColumns, TTopicTableColumnId } from "@/utils/tables/topic/topicTable";

type TProps = {
  familyTopics: IFamilyDocumentTopics;
};

export const TopicsBlock = ({ familyTopics }: TProps) => {
  return (
    <Section block="topics" title="Topics mentioned most in this case">
      <p className="mb-2">
        This table shows the topics that are most frequently mentioned within this case. Explore further by clicking on a topic, and view specific
        passages of text within the documents.
      </p>
      <InteractiveTable<TTopicTableColumnId>
        columns={TopicTableColumns}
        rows={getTopicTableRows(familyTopics)}
        defaultSort={{ column: "group", order: "desc" }}
      />
    </Section>
  );
};
