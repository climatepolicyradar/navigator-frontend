import { TGeographySubdivision } from "@/types";

const findSubdivision = (search: string, dataSet: TGeographySubdivision[]) => {
  const searchLowerCase = search.toLowerCase();
  for (const dataItem of dataSet) {
    if (dataItem.code.toLowerCase() === searchLowerCase || dataItem.name.toLowerCase() === searchLowerCase) {
      return dataItem;
    }
  }
  return null;
};

export const getSubdivisionName = (search: string, dataSet: TGeographySubdivision[]) => {
  return findSubdivision(search, dataSet)?.name;
};
