import { getCategoryName } from "@/helpers/getCategoryName";
import { TCategory } from "@/types";

const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>?/gm, "");
};

export const getFamilyMetaDescription = (summary: string, geo: string, category: TCategory) => {
  return `${geo} | ${getCategoryName(category) ?? category} | ${stripHtml(summary).substring(0, 600)}`;
};
