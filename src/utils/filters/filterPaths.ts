import { TFilterPathLabel, TNestedSearchLabel } from "@/types";

export const getFilterPathLabel = (nestedSearchLabel: TNestedSearchLabel): TFilterPathLabel => ({
  id: nestedSearchLabel.id,
  type: nestedSearchLabel.type,
  value: nestedSearchLabel.value,
});
