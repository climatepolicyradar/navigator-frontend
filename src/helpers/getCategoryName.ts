import { TCategory, TCorpusTypeSubCategory } from "@types";

export const getCategoryName = (category: TCategory, subCategory?: TCorpusTypeSubCategory) => {
  let name = "";
  switch (category) {
    case "Litigation":
      name = "Litigation";
      break;
    case "Legislative":
    case "Law":
      name = "Legislative";
      break;
    case "Executive":
    case "Policy":
      name = "Policy";
      break;
    case "UNFCCC":
      name = "UNFCCC";
      break;
    case "MCF":
      name = subCategory ? subCategory.toUpperCase() : "MCF";
      break;
  }
  return name;
};
