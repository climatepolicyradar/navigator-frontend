import { ID_SEPARATOR } from "@/constants/chars";
import { TNestedSearchLabel } from "@/types";

export const createGroupLabel = (value: string, children: TNestedSearchLabel[]): TNestedSearchLabel => ({
  id: ["group", value].join(ID_SEPARATOR),
  type: "group",
  value,
  alternative_labels: [],
  children,
});
