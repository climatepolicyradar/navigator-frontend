import { TCategory } from "@types";
import { getCategoryName } from "@helpers/getCategoryName";

export const getFamilyMetaDescription = (summary: string, geo: string, category: TCategory) => {
  return `${geo} | ${getCategoryName(category)} | ${summary.substring(0, 600)}`;
};
