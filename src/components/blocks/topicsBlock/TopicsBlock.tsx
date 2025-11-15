import { LucideTextSearch } from "lucide-react";

import { ExternalLink } from "@/components/ExternalLink";
import { Section } from "@/components/molecules/section/Section";
import { InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { useText } from "@/hooks/useText";
import { IFamilyDocumentTopics } from "@/types";
import { getTopicTableRows, topicTableColumns, TTopicTableColumnId } from "@/utils/tables/topic/topicTable";

type TProps = {
  familyTopics: IFamilyDocumentTopics;
};

export const TopicsBlock = ({ familyTopics }: TProps) => {
  const { getText } = useText();

  return (
    <Section block="topics" Icon={LucideTextSearch} title={"Topics mentioned most in this " + getText("familySingular")} badge="Beta">
      <div className="col-start-1 -col-end-1">
        <p className="mb-3">
          See how often topics get mentioned in this case and view specific passages of text highlighted in each document. Accuracy is not 100%.{" "}
          <ExternalLink url="/faq#topics-faqs" className="inline-block underline decoration-gray-300 hover:decoration-gray-500">
            Learn more
          </ExternalLink>
        </p>
        <InteractiveTable<TTopicTableColumnId> columns={topicTableColumns} rows={getTopicTableRows(familyTopics)} />
      </div>
    </Section>
  );
};
