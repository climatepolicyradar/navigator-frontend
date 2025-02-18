import { TCategory, TCorpusTypeSubCategory } from "@types";

const reportSubCategories: Record<TCorpusTypeSubCategory | "OEP", string> = {
  AF: "Guidance",
  CIF: "Guidance",
  GCF: "Guidance",
  GEF: "Guidance",
  Reports: "Reports",
  OEP: "Reports",
  "Intl. agreements": "Intl. agreements",
  "Laws and Policies": "Laws and Policies",
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
  UNFCCC: "UNFCCC",
  MCF: "MCF",
  Reports: "Reports",
};

const getReportsCategory = (source: TCorpusTypeSubCategory): string => {
  return reportSubCategories[source];
};

export const getSubCategoryName = (subCategory: TCorpusTypeSubCategory): string => {
  return subCategories[subCategory as TCorpusTypeSubCategory];
};

export const getCategoryName = (category: TCategory, subCategory?: TCorpusTypeSubCategory, source?: string): string => {
  const name = categories[category as TCategory];
  if (category === "Reports" && source) {
    return getReportsCategory(source as TCorpusTypeSubCategory);
  }
  return category === "MCF" && subCategory ? getSubCategoryName(subCategory) : name;
};
