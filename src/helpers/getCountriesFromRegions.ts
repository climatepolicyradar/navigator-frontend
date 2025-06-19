import { TGeography, TCountry } from "@/types";

interface IProps {
  selectedRegions: string[];
  regions: TGeography[];
  countries: TGeography[] | TCountry[];
}

const isTCountryArray = (countries: TGeography[] | TCountry[]): countries is TCountry[] => {
  return countries.length > 0 && !("id" in countries[0]);
};

export const getCountriesFromRegions = ({ regions, countries, selectedRegions }: IProps) => {
  if (isTCountryArray(countries)) {
    return countries;
  }

  const selectedRegionsGeo = regions.filter((item) => selectedRegions.includes(item.slug));

  let newList = countries;

  if (selectedRegionsGeo.length > 0) {
    newList = [];
    // for each selected region, filter the countries
    for (let i = 0; i < selectedRegionsGeo.length; i++) {
      const region = selectedRegionsGeo[i];
      newList = newList.concat(countries.filter((item: any) => item.parent_id === region.id));
    }
  }

  return newList;
};
