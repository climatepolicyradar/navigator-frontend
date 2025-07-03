import { TCountry } from "@/types";

const findCountryObject = (countrySearch: string, dataSet: TCountry[]) => {
  if (dataSet.length === 0) return null;
  if (!dataSet[0].alpha_3) return null; // FIXME Remove

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
