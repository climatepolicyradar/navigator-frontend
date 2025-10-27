import { TCategory, TCorpusTypeSubCategory } from "@/types";

const corporaIdCategories = {
  "UN.corpus.UNCBD.n0000": "UNCBD submission",
  "UN.corpus.UNCCD.n0000": "UNCCD submission",
  "UNFCCC.corpus.i00000001.n0000": "UNFCCC submission",
};

const reportSubCategories = {
  AF: "Guidance",
  CIF: "Guidance",
  GCF: "Guidance",
  GEF: "Guidance",
  Reports: "Report",
  OEP: "Offshore Wind Report",
};

const subCategories: Record<TCorpusTypeSubCategory, string> = {
  AF: "Adaptation Fund",
  CIF: "Climate Investment Fund",
  GCF: "Green Climate Fund",
  GEF: "Global Environment Facility",
  "Intl. agreements": "Intl. agreements",
  "Laws and Policies": "Laws and Policies",
  Litigation: "Litigation",
  Reports: "Guidance",
};

const categories: Record<TCategory, string> = {
  Litigation: "Litigation",
  LITIGATION: "Litigation",
  Legislative: "Legislative",
  LEGISLATIVE: "Legislative",
  Law: "Legislative",
  Executive: "Policy",
  EXECUTIVE: "Policy",
  Policy: "Policy",
  UNFCCC: "UN Submission",
  MCF: "MCF",
  Reports: "Report",
  REPORTS: "Report",
};

const getReportsCategory = (source: string): string => {
  return reportSubCategories[source] || "Reports";
};

export const getSubCategoryName = (subCategory: TCorpusTypeSubCategory): string => {
  return subCategories[subCategory as TCorpusTypeSubCategory];
};

export const getCategoryName = (category: TCategory, subCategory?: TCorpusTypeSubCategory, source?: string, corpusId?: string): string => {
  const name = categories[category as TCategory];

  if (category === "Reports" && source) {
    return getReportsCategory(source);
  }
  if (category === "MCF" && subCategory) {
    return getSubCategoryName(subCategory);
  }
  if (corpusId) {
    return corporaIdCategories[corpusId] ?? name;
  }
  return name;
};
