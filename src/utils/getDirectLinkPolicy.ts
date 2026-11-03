import themeConfig from "@/themes/config";
import { TOnDirectLinkPolicy, TSearchExcludeLabel } from "@/types";

type TLabelRelationship = { value: { id: string } };

export const getDirectLinkPolicy = (
  labels: TLabelRelationship[],
  searchExcludeLabels: TSearchExcludeLabel[] = themeConfig.searchExcludeLabels
): TOnDirectLinkPolicy | null => {
  const labelIds = new Set(labels.map((labelRel) => labelRel.value.id));
  const match = searchExcludeLabels.find(({ id }) => labelIds.has(id));
  return match?.onDirectLink ?? null;
};
