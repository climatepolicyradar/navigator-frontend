import { TDataInLabel, validateCategoryLabel } from "@/schemas";
import { TApiDataInCategory, TCategory } from "@/types";

const CATEGORY_MAP: Record<TApiDataInCategory, TCategory> = {
  Law: "Legislative",
  Litigation: "Litigation",
  "Multilateral Climate Fund project": "MCF",
  Policy: "Policy",
  Report: "Reports",
  "UN submission": "UNFCCC",
};

export const transformCategory = (label: TDataInLabel): TCategory => {
  const categoryLabel = validateCategoryLabel(label);
  const dataInCategory = categoryLabel.value.value as TApiDataInCategory;
  return CATEGORY_MAP[dataInCategory];
};
