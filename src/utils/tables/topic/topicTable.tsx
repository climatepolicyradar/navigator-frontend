import orderBy from "lodash/orderBy";

import { LabelButton } from "@/components/atoms/labelButton/LabelButton";
import { ID_SEPARATOR } from "@/constants/chars";
import { ORDERED_ROOT_TOPIC_IDS } from "@/constants/topics";
import { IFamilyDocumentTopics, TNestedSearchLabel, TTableColumn, TTableRow } from "@/types";
import { flattenCountedLabels } from "@/utils/labels/flattenCountedLabels";
import { firstCase } from "@/utils/text/firstCase";

export type TTopicTableColumnId = "group" | "topics";

export const topicTableColumns: TTableColumn<TTopicTableColumnId>[] = [
  { id: "group", name: "Group", fraction: 2, classes: "font-medium" },
  { id: "topics", name: "Topics", fraction: 5 },
];

type TTopicTableRow = TTableRow<TTopicTableColumnId>;

const findLabel = (labels: TNestedSearchLabel[], id: string): TNestedSearchLabel | undefined => {
  for (const label of labels) {
    if (label.id === id) return label;
    const nested = findLabel(label.children, id);
    if (nested) return nested;
  }
};

export const getTopicTableRows = (familyTopics: IFamilyDocumentTopics, onClickTopic: (wikibaseId: string) => void): TTopicTableRow[] => {
  const rows: TTopicTableRow[] = [];
  const shownTopicIds = new Set<string>();

  ORDERED_ROOT_TOPIC_IDS.forEach((rootTopicId) => {
    const rootTopic = findLabel(familyTopics.topics, `concept${ID_SEPARATOR}${rootTopicId}`);
    if (!rootTopic) return;

    const groupTopics = flattenCountedLabels([rootTopic]).filter((topic) => !shownTopicIds.has(topic.id));
    if (groupTopics.length === 0) return;
    groupTopics.forEach((topic) => shownTopicIds.add(topic.id));

    const sortedTopics = orderBy(groupTopics, [(topic) => familyTopics.conceptCounts[topic.id.split(ID_SEPARATOR)[1]] || 0], ["desc"]);

    rows.push({
      id: rootTopic.id,
      cells: {
        group: {
          label: firstCase(rootTopic.value),
          value: rootTopic.value,
        },
        topics: {
          label: (
            <div className="flex flex-col gap-1 items-start">
              {sortedTopics.map((topic) => (
                <LabelButton key={topic.id} onClick={() => onClickTopic(topic.id.split(ID_SEPARATOR)[1])}>
                  {firstCase(topic.value)}
                </LabelButton>
              ))}
            </div>
          ),
          value: "",
        },
      },
    });
  });
  return rows;
};
