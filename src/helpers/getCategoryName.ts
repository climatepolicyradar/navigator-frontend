import { TCategory, TCorpusTypeSubCategory } from "@types";

const subCategories: Record<TCorpusTypeSubCategory, string> = {
  AF: "Adaptation Fund",
  CIF: "Climate Investment Funds",
  GCF: "Green Climate Fund",
  GEF: "Global Environment Facility",
  "Intl. agreements": "Intl. agreements",
  "Laws and Policies": "Laws and Policies",
  Reports: "Reports",
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

export const getSubCategoryName = (subCategory: TCorpusTypeSubCategory): string => {
  return subCategories[subCategory as TCorpusTypeSubCategory];
};

export const getCategoryName = (category: TCategory, subCategory?: TCorpusTypeSubCategory): string => {
  const name = categories[category as TCategory];
  return category === "MCF" && subCategory ? getSubCategoryName(subCategory) : name;
};
