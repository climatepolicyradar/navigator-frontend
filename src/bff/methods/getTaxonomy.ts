import { TApiDataInCategory, TCategory, TCorpusTypeSubCategory } from "@/types";

export const CATEGORY_MAP: Record<TCategory, TApiDataInCategory> = {
  Executive: "Policy",
  EXECUTIVE: "Policy",
  Law: "Law",
  Legislative: "Law",
  LEGISLATIVE: "Law",
  Litigation: "Litigation",
  LITIGATION: "Litigation",
  MCF: "Multilateral Climate Fund project",
  Policy: "Policy",
  Reports: "Report",
  REPORTS: "Report",
  UNFCCC: "UN submission",
};

const getReportTaxonomy = (corpusTypeName: string): string => {
  switch (corpusTypeName) {
    case "OEP":
    case "Ocean Energy Pathways":
      return "Offshore Wind Report";
    case "AF":
    case "Adaptation Fund":
    case "CIF":
    case "The Climate Investment Funds":
    case "GCF":
    case "Green Climate Fund":
    case "GEF":
    case "Global Environment Facility":
      return "Guidance";
    default:
      return "Report";
  }
};

const getFundTaxonomy = (source: string): string => {
  switch (source) {
    case "AF":
    case "Adaptation Fund":
      return "Adaptation Fund";
    case "CIF":
    case "The Climate Investment Funds":
      return "Climate Investment Fund";
    case "GCF":
    case "Green Climate Fund":
      return "Green Climate Fund";
    case "GEF":
    case "Global Environment Facility":
      return "Global Environment Facility";
    default:
      return "multilateral climate fund project";
  }
};

export const getTaxonomyFromV1 = (oldCategory: TCategory, subCategory: TCorpusTypeSubCategory, source: string, corpusId: string): string => {
  const category = CATEGORY_MAP[oldCategory];
  const isUNSubmission = category === "UN submission";

  if (corpusId === "UN.corpus.UNCBD.n0000" || (isUNSubmission && source === "UNCBD")) {
    return "CBD Submission";
  }
  if (corpusId === "UN.corpus.UNCCD.n0000" || (isUNSubmission && source === "UNCCD")) {
    return "UNCCD submission";
  }
  if (corpusId === "UNFCCC.corpus.i00000001.n0000" || (isUNSubmission && source === "UNFCCC")) {
    return "UNFCCC submission";
  }

  switch (category) {
    case "UN submission":
      return "UN Submission";
    case "Report":
      return getReportTaxonomy(subCategory);
    case "Multilateral Climate Fund project":
      return getFundTaxonomy(source);
    case "Law":
      return "Legislative";
    case "Policy":
      return "Policy";
    case "Litigation":
      return "Litigation";
  }
};
