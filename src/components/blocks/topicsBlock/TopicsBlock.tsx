import { LucideTextSearch } from "lucide-react";

import { Section } from "@/components/molecules/section/Section";
import { TutorialCard } from "@/components/molecules/tutorials/TutorialCard";
import { InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { TUTORIALS } from "@/constants/tutorials";
import { IFamilyDocumentTopics } from "@/types";
import { getTopicTableRows, TopicTableColumns, TTopicTableColumnId } from "@/utils/tables/topic/topicTable";

type TProps = {
  familyTopics: IFamilyDocumentTopics;
  showKnowledgeGraphTutorial: boolean;
};

export const TopicsBlock = ({ familyTopics, showKnowledgeGraphTutorial }: TProps) => {
  return (
    <Section block="topics" Icon={LucideTextSearch} title="Topics mentioned most in this case" badge="Beta">
      {showKnowledgeGraphTutorial && (
        <TutorialCard name="knowledgeGraph" card={TUTORIALS.knowledgeGraph.card} className="col-span-2 cols5-2:col-span-3" />
      )}

      <div className="col-start-1 -col-end-1">
        <p className="my-3">
          This table shows the topics that are most frequently mentioned within this case. Explore further by clicking on a topic, and view specific
          passages of text within the documents.
        </p>
        <InteractiveTable<TTopicTableColumnId>
          columns={TopicTableColumns}
          rows={getTopicTableRows(familyTopics)}
          defaultSort={{ column: "group", order: "desc" }}
        />
      </div>
    </Section>
  );
};
