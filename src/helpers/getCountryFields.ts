import { TCountry, TGeography } from "@/types";

// Old
const findCountryObjectOld = (countrySearch: string, dataSet: TGeography[]) => {
  let country = dataSet.find((c) => c.value.toLowerCase() === countrySearch.toLowerCase());
  if (!country) country = dataSet.find((c) => c.slug.toLowerCase() === countrySearch.toLowerCase());
  if (!country) country = dataSet.find((c) => c.display_value.toLowerCase() === countrySearch.toLowerCase());
  if (!country) return null;
  return country;
};

export const getCountrySlugOld = (countrySearch: string, dataSet: TGeography[]) => {
  return findCountryObjectOld(countrySearch, dataSet)?.slug;
};

export const getCountryNameOld = (countrySearch: string, dataSet: TGeography[]) => {
  return findCountryObjectOld(countrySearch, dataSet)?.display_value;
};

export const getCountryCodeOld = (countrySearch: string, dataSet: TGeography[]) => {
  return findCountryObjectOld(countrySearch, dataSet)?.value;
};

// New geographies-api
const findCountryObject = (countrySearch: string, dataSet: TCountry[]) => {
  let country = dataSet.find((c) => c.alpha_3.toLowerCase() === countrySearch.toLowerCase());
  if (!country) country = dataSet.find((c) => c.alpha_2.toLowerCase() === countrySearch.toLowerCase());
  if (!country) country = dataSet.find((c) => c.name.toLowerCase() === countrySearch.toLowerCase());
  if (!country) country = dataSet.find((c) => c.official_name.toLowerCase() === countrySearch.toLowerCase());
  if (!country) return null;
  return country;
};

export const getCountrySlug = (countrySearch: string, dataSet: TCountry[]) => {
  // FIXME: Remove references.
  return findCountryObject(countrySearch, dataSet)?.alpha_3;
};

export const getCountryName = (countrySearch: string, dataSet: TCountry[]) => {
  // Official name is sometimes null.
  return findCountryObject(countrySearch, dataSet)?.name;
};

export const getCountryCode = (countrySearch: string, dataSet: TCountry[]) => {
  return findCountryObject(countrySearch, dataSet)?.alpha_3;
};
