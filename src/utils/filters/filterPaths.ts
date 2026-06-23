import { TFilterPathLabel, TNestedSearchLabel } from "@/types";

export const getFilterPathLabel = (nestedSearchLabel: TNestedSearchLabel): TFilterPathLabel => ({
  id: nestedSearchLabel.id,
  type: nestedSearchLabel.type,
  value: nestedSearchLabel.value,
});

export const getLabelPathSignature = (labelPath: TFilterPathLabel[]) => labelPath.map((label) => label.id).join("/");
