import { TGeography } from "@/types";

const findCountryObject = (search: string, dataSet: TGeography[]) => {
  const searchLowerCase = search.toLowerCase();
  for (const dataItem of dataSet) {
    if (
      dataItem.value.toLowerCase() === searchLowerCase ||
      dataItem.display_value.toLowerCase() === searchLowerCase ||
      dataItem.slug.toLowerCase() === searchLowerCase
    ) {
      return dataItem;
    }
  }
  return null;
};

export const getCountrySlug = (search: string, dataSet: TGeography[]) => {
  return findCountryObject(search, dataSet)?.slug;
};

export const getCountryName = (search: string, dataSet: TGeography[]) => {
  return findCountryObject(search, dataSet)?.display_value;
};

export const getCountryCode = (search: string, dataSet: TGeography[]) => {
  return findCountryObject(search, dataSet)?.value;
};
