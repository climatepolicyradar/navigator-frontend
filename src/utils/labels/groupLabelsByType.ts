import { LABEL_TYPES, TDataInLabel, TDataInLabelType } from "@/schemas";

export type TLabelsByType = Record<TDataInLabelType, TDataInLabel[]>;

export const groupLabelsByType = (labels: TDataInLabel[]): TLabelsByType => {
  // Always have a key/array pair regardless of which labels are present
  const groupedLabels = {} as TLabelsByType;
  LABEL_TYPES.forEach((type) => (groupedLabels[type] = []));

  labels.forEach((label) => {
    if (label.type in groupedLabels) groupedLabels[label.type].push(label);
  });
  return groupedLabels;
};
