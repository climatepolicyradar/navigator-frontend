import { TFilterPathLabel, TSortValue } from "@/types";

export const getSearchSortDefault = (checkedLabelPaths: TFilterPathLabel[][], query: string): TSortValue => {
  const hasTopic = checkedLabelPaths.flat().some((label) => label.type === "concept");
  return hasTopic || !!query ? "relevance" : "recent";
};
