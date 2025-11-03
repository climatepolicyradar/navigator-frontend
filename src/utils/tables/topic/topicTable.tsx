import { TTableColumn } from "@/types";

export type TTopicTableColumnId = "group" | "concepts";

export const TopicTableColumns: TTableColumn<TTopicTableColumnId>[] = [
  { id: "group", name: "Group", fraction: 2 },
  { id: "concepts", name: "Concepts", fraction: 5 },
];
