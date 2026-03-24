import * as v from "valibot";

import { LABEL_TYPES, MandatoryLabelsSchema, TDataInLabel, TDataInLabelType } from "@/schemas";

export type TLabelsByType = Record<TDataInLabelType, TDataInLabel[]>;

export const groupLabelsByType = (labels: TDataInLabel[]): TLabelsByType => {
  // Always have a key/array pair for known label types regardless of which labels are present
  // Not seeing a label type in the return object? Add it to LABEL_TYPES
  const groupedLabels = {} as TLabelsByType;
  LABEL_TYPES.forEach((type) => (groupedLabels[type] = []));

  labels.forEach((label) => {
    if (label.type in groupedLabels) groupedLabels[label.type].push(label);
  });

  // Validate that there is at least one label per mandatory label type
  v.parse(MandatoryLabelsSchema, groupedLabels);
  return groupedLabels;
};
