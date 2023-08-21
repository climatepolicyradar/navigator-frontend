import { TCategory } from "@types";

export const getCategoryName = (category: TCategory) => {
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
  }
  return name;
};
