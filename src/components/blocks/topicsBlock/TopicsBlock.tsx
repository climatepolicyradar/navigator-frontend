import { LucideTextSearch } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";

import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { TopicDrawer } from "@/components/drawers/topicDrawer/TopicDrawer";
import { Section } from "@/components/molecules/section/Section";
import { InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { TCategoryDictionaryKey } from "@/constants/text";
import { IFamilyDocumentTopics, TFamilyPublic, TFeatures } from "@/types";
import { TOPIC_PARAM_KEY } from "@/utils/search/searchLevels";
import { getTopicTableRows, topicTableColumns, TTopicTableColumnId } from "@/utils/tables/topic/topicTable";

type TProps = {
  family: TFamilyPublic;
  familyTopics: IFamilyDocumentTopics;
  features: TFeatures;
  getCategoryText: (textKey: TCategoryDictionaryKey) => string;
};

export const TopicsBlock = ({ family, familyTopics, features, getCategoryText }: TProps) => {
  const [topicDrawerId, setTopicDrawerId] = useQueryState(TOPIC_PARAM_KEY, parseAsString);
  // Keeps the topic in the drawer while it closes. Derived in render as an effect would cascade renders
  const [lastTopicDrawerId, setLastTopicDrawerId] = useState<string | null>(topicDrawerId);
  if (topicDrawerId && topicDrawerId !== lastTopicDrawerId) setLastTopicDrawerId(topicDrawerId);

  const onTopicClick = (wikibaseId: string) => {
    setTopicDrawerId(wikibaseId, { history: "push" });
  };

  const onTopicDrawerOpenChange = (open: boolean) => {
    if (!open) setTopicDrawerId(null);
  };

  const topicTableRows = getTopicTableRows(familyTopics, features, onTopicClick);
  if (topicTableRows.length === 0) return null;

  return (
    <Section block="topics" Icon={LucideTextSearch} title={"Topics mentioned most in this " + getCategoryText("familySingular")} badge="Beta">
      <div className="col-start-1 -col-end-1">
        <p className="mb-3">
          See how often topics get mentioned in this {getCategoryText("familySingular")} and view specific passages of text highlighted in each
          document. Accuracy is not 100%.{" "}
          <PageLink href="/faq" hash="topics-faqs" className="inline-block underline decoration-[#d1d5db] hover:decoration-[#6b7280]">
            Learn more
          </PageLink>
        </p>
        <InteractiveTable<TTopicTableColumnId> columns={topicTableColumns} rows={topicTableRows} />
      </div>

      <TopicDrawer
        family={family}
        familyTopics={familyTopics}
        topicWikibaseId={lastTopicDrawerId}
        onOpenChange={onTopicDrawerOpenChange}
        open={!!topicDrawerId}
      />
    </Section>
  );
};
