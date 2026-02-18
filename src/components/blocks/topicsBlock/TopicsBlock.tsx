import { LucideTextSearch } from "lucide-react";
import { useState } from "react";

import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { TopicDrawer } from "@/components/drawers/topicDrawer/TopicDrawer";
import { Section } from "@/components/molecules/section/Section";
import { Warning } from "@/components/molecules/warning/Warning";
import { InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { TCategoryDictionaryKey } from "@/constants/text";
import { IFamilyDocumentTopics, TFamilyPublic } from "@/types";
import { getTopicTableRows, topicTableColumns, TTopicTableColumnId } from "@/utils/tables/topic/topicTable";

type TProps = {
  family: TFamilyPublic;
  familyTopics: IFamilyDocumentTopics;
  getCategoryText: (textKey: TCategoryDictionaryKey) => string;
};

export const TopicsBlock = ({ family, familyTopics, getCategoryText }: TProps) => {
  const [topicDrawerId, setTopicDrawerId] = useState<string | null>(null);
  const [showTopicDrawer, setShowTopicDrawer] = useState(false); // Separate state so that topic in drawer persists while closing

  const onTopicClick = (wikibaseId: string) => {
    setTopicDrawerId(wikibaseId);
    setShowTopicDrawer(true);
  };

  const onTopicDrawerOpenChange = (open: boolean) => {
    if (!open) setShowTopicDrawer(false);
  };

  const topicTableRows = getTopicTableRows(familyTopics, onTopicClick);
  if (topicTableRows.length === 0) return null;

  return (
    <Section block="topics" Icon={LucideTextSearch} title={"Topics mentioned most in this " + getCategoryText("familySingular")} badge="Beta">
      <div className="col-start-1 -col-end-1">
        {process.env.THEME === "ccc" && (
          <Warning variant="error">
            We are currently experiencing technical difficulties with topics. We are working hard to fix this issue, please check back a little later.
          </Warning>
        )}
        <p className="mb-3">
          See how often topics get mentioned in this {getCategoryText("familySingular")} and view specific passages of text highlighted in each
          document. Accuracy is not 100%.{" "}
          <PageLink href="/faq" hash="topics-faqs" className="inline-block underline decoration-gray-300 hover:decoration-gray-500">
            Learn more
          </PageLink>
        </p>
        <InteractiveTable<TTopicTableColumnId> columns={topicTableColumns} rows={topicTableRows} />
      </div>

      <TopicDrawer
        family={family}
        familyTopics={familyTopics}
        topicWikibaseId={topicDrawerId}
        onOpenChange={onTopicDrawerOpenChange}
        open={showTopicDrawer}
      />
    </Section>
  );
};
