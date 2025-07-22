import { TGeography } from "@/types";

const findGeographyObject = (geographySearch: string, dataSet: TGeography[]) => {
  let geography = dataSet.find((c) => c.value.toLowerCase() === geographySearch.toLowerCase());
  if (!geography) geography = dataSet.find((c) => c.display_value.toLowerCase() === geographySearch.toLowerCase());
  if (!geography) geography = dataSet.find((c) => c.slug.toLowerCase() === geographySearch.toLowerCase());
  if (!geography) return null;
  return geography;
};

export const getCountrySlug = (countrySearch: string, dataSet: TGeography[]) => {
  return findGeographyObject(countrySearch, dataSet)?.slug;
};

export const getGeographyName = (geographySearch: string, dataSet: TGeography[]) => {
  return findGeographyObject(geographySearch, dataSet)?.display_value;
};

export const getCountryCode = (countrySearch: string, dataSet: TGeography[]) => {
  return findGeographyObject(countrySearch, dataSet)?.value;
};
