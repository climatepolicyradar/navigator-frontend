import { TGeographySubdivision } from "@/types";

const findSubdivision = (search: string, dataSet: TGeographySubdivision[]) => {
  let subdivision = dataSet.find((c) => c.code.toLowerCase() === search.toLowerCase());
  if (!subdivision) subdivision = dataSet.find((c) => c.name.toLowerCase() === search.toLowerCase());
  if (!subdivision) return null;
  return subdivision;
};

export const getSubdivisionName = (search: string, dataSet: TGeographySubdivision[]) => {
  return findSubdivision(search, dataSet)?.name;
};

export const getSubdivisionCode = (search: string, dataSet: TGeographySubdivision[]) => {
  return findSubdivision(search, dataSet)?.code;
};

export const getSubdivisionType = (search: string, dataSet: TGeographySubdivision[]) => {
  return findSubdivision(search, dataSet)?.type;
};
