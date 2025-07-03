import { TGeography } from "@/types";

const findRegionObject = (regionSearch: string, dataSet: TGeography[]) => {
  let region = dataSet.find((c) => c.value.toLowerCase() === regionSearch.toLowerCase());
  if (!region) region = dataSet.find((c) => c.display_value.toLowerCase() === regionSearch.toLowerCase());
  if (!region) region = dataSet.find((c) => c.slug.toLowerCase() === regionSearch.toLowerCase());
  if (!region) return null;
  return region;
};

export const getRegionName = (regionSearch: string, dataSet: TGeography[]) => {
  return findRegionObject(regionSearch, dataSet)?.display_value;
};
