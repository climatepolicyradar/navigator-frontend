import { LucideInfo, LucideTextSearch } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";

import { TopicDrawer } from "@/components/drawers/topicDrawer/TopicDrawer";
import { ProductSupport } from "@/components/molecules/productSupport/ProductSupport";
import { Section } from "@/components/molecules/section/Section";
import { InteractiveTable } from "@/components/organisms/interactiveTable/InteractiveTable";
import { TCategoryDictionaryKey } from "@/constants/text";
import { IFamilyDocumentTopics, TFamilyPublic } from "@/types";
import { TOPIC_PARAM_KEY } from "@/utils/search/searchLevels";
import { getTopicTableRows, topicTableColumns, TTopicTableColumnId } from "@/utils/tables/topic/topicTable";

type TProps = {
  family: TFamilyPublic;
  familyTopics: IFamilyDocumentTopics;
  getCategoryText: (textKey: TCategoryDictionaryKey) => string;
};

export const TopicsBlock = ({ family, familyTopics, getCategoryText }: TProps) => {
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

  const topicTableRows = getTopicTableRows(familyTopics, onTopicClick);
  if (topicTableRows.length === 0) return null;

  return (
    <Section block="topics" Icon={LucideTextSearch} title={"Topics mentioned most in this " + getCategoryText("familySingular")}>
      <div className="col-start-1 -col-end-1">
        <div className="mb-6 flex gap-2">
          <LucideInfo size={16} className="pt-1 h-full shrink-0 text-text-brand" />
          <p>
            See how often Topics get mentioned in this {getCategoryText("familySingular")} and view specific passages of text highlighted in each
            document.{" "}
            <ProductSupport
              content="topics"
              className="inline-block text-text-brand underline underline-offset-2 decoration-slate-300 hocus:decoration-text-brand"
            >
              Learn more
            </ProductSupport>
          </p>
        </div>
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
