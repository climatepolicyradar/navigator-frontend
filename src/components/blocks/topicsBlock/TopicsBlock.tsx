import { LucideTextSearch } from "lucide-react";

import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { Section } from "@/components/molecules/section/Section";
import { InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { TCategoryDictionaryKey } from "@/constants/text";
import { IFamilyDocumentTopics } from "@/types";
import { getTopicTableRows, topicTableColumns, TTopicTableColumnId } from "@/utils/tables/topic/topicTable";

type TProps = {
  familyTopics: IFamilyDocumentTopics;
  getCategoryText: (textKey: TCategoryDictionaryKey) => string;
};

export const TopicsBlock = ({ familyTopics, getCategoryText }: TProps) => (
  <Section block="topics" Icon={LucideTextSearch} title={"Topics mentioned most in this " + getCategoryText("familySingular")} badge="Beta">
    <div className="col-start-1 -col-end-1">
      <p className="mb-3">
        See how often topics get mentioned in this {getCategoryText("familySingular")} and view specific passages of text highlighted in each
        document. Accuracy is not 100%.{" "}
        <PageLink external href="/faq" hash="topics-faqs" className="inline-block underline decoration-gray-300 hover:decoration-gray-500">
          Learn more
        </PageLink>
      </p>
      <InteractiveTable<TTopicTableColumnId> columns={topicTableColumns} rows={getTopicTableRows(familyTopics)} />
    </div>
  </Section>
);
