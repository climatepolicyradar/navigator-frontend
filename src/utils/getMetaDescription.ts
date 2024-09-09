import { TCategory } from "@types";
import { getCategoryName } from "@helpers/getCategoryName";

export const getMetaDescription = (summary: string, geo: string, category: TCategory) => {
  return `${geo} | ${getCategoryName(category)} | ${summary}`;
};
