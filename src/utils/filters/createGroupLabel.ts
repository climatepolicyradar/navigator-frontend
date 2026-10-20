import { ID_SEPARATOR } from "@/constants/chars";
import { TNestedSearchLabel } from "@/types";

export const createLabel = (type: string, value: string, children: TNestedSearchLabel[] = []): TNestedSearchLabel => ({
  id: [type, value].join(ID_SEPARATOR),
  type,
  value,
  alternative_labels: [],
  children,
});

export const createGroupLabel = (value: string, children: TNestedSearchLabel[]) => createLabel("group", value, children);
