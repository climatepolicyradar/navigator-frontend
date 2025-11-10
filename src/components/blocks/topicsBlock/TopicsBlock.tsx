import { LucideTextSearch } from "lucide-react";

import { ExternalLink } from "@/components/ExternalLink";
import { Section } from "@/components/molecules/section/Section";
import { TutorialCard } from "@/components/molecules/tutorials/TutorialCard";
import { InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { TUTORIALS } from "@/constants/tutorials";
import { IFamilyDocumentTopics } from "@/types";
import { getTopicTableRows, topicTableColumns, TTopicTableColumnId } from "@/utils/tables/topic/topicTable";

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
          See how often topics get mentioned in this case and view specific passages of text highlighted in each document. Accuracy is not 100%.{" "}
          <ExternalLink url="/faq#topics-faqs" className="inline-block underline decoration-gray-300 hover:decoration-gray-500">
            Learn more
          </ExternalLink>
        </p>
        <InteractiveTable<TTopicTableColumnId>
          columns={topicTableColumns}
          rows={getTopicTableRows(familyTopics)}
          defaultSort={{ column: "group", order: "desc" }}
        />
      </div>
    </Section>
  );
};
