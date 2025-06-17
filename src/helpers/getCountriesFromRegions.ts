import { ApiClient } from "@/api/http-common";
import { TGeography } from "@/types";

interface IProps {
  selectedRegions: string[];
  regions: TGeography[];
  countries: TGeography[];
}

export const getCountriesFromRegions = async ({ regions, countries, selectedRegions }: IProps) => {
  const selectedRegionsGeo = regions.filter((item) => selectedRegions.includes(item.slug));

  let newList = [];

  if (selectedRegionsGeo.length > 0) {
    // for each selected region, filter the countries
    for (let i = 0; i < selectedRegionsGeo.length; i++) {
      const region = selectedRegionsGeo[i];
      newList = newList.concat(countries.filter((item: any) => item.parent_id === region.id));
    }
  } else {
    const client = new ApiClient(process.env.BACKEND_API_URL);
    const { data } = await client.get("/geographies");
    newList = data;
  }

  return newList;
};
