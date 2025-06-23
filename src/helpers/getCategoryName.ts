import { TCategory, TCorpusTypeSubCategory } from "@/types";

const reportSubCategories = {
  AF: "Guidance",
  CIF: "Guidance",
  GCF: "Guidance",
  GEF: "Guidance",
  Reports: "Reports",
  OEP: "Reports",
};

const subCategories: Record<TCorpusTypeSubCategory, string> = {
  AF: "Adaptation Fund",
  CIF: "Climate Investment Funds",
  GCF: "Green Climate Fund",
  GEF: "Global Environment Facility",
  "Intl. agreements": "Intl. agreements",
  "Laws and Policies": "Laws and Policies",
  Reports: "Guidance",
};

const categories: Record<TCategory, string> = {
  Litigation: "Litigation",
  Legislative: "Legislative",
  Law: "Legislative",
  Executive: "Policy",
  Policy: "Policy",
  UNFCCC: "UNFCCC Submissions",
  MCF: "MCF",
  Reports: "Reports",
};

const getReportsCategory = (source: string): string => {
  return reportSubCategories[source] || "Reports";
};

export const getSubCategoryName = (subCategory: TCorpusTypeSubCategory): string => {
  return subCategories[subCategory as TCorpusTypeSubCategory];
};

export const getCategoryName = (category: TCategory, subCategory?: TCorpusTypeSubCategory, source?: string): string => {
  const name = categories[category as TCategory];
  if (category === "Reports" && source) {
    return getReportsCategory(source);
  }
  if (category === "MCF" && subCategory) {
    return getSubCategoryName(subCategory);
  }
  return name;
};
