import { TDocumentCategory } from "@types";

export const getCategoryTooltip = (category: TDocumentCategory): string => {
  switch (category) {
    case "All":
      return "";
    case "Laws":
      return "For example: Laws, Acts, Constitutions (legislative branch)";
    case "Policies":
      return "For example: Policies, strategies, decrees, action plans (from executive branch)";
    case "Litigation":
      return "For example: Court cases and tribunal proceedings";
    case "UNFCCC":
      return "Documents submitted to the UNFCCC (including NDCs)";
    case "MCF":
      return "Multilateral climate fund projects and policies";
    default:
      return "";
  }
};
