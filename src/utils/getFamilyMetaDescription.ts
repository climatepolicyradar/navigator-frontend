import { TCategory } from "@types";
import { getCategoryName } from "@/helpers/getCategoryName";

const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>?/gm, "");
};

export const getFamilyMetaDescription = (summary: string, geo: string, category: TCategory) => {
  return `${geo} | ${getCategoryName(category)} | ${stripHtml(summary).substring(0, 600)}`;
};
