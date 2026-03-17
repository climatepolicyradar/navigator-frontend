import { TDataInLabel } from "@/schemas";
import { TApiGeography, TGeography } from "@/types";

export const transformCountries = (oldCountries: TApiGeography[], newGeographyLabels: TDataInLabel[]): TGeography[] =>
  newGeographyLabels
    .map((label) => {
      // TODO stop using old data when country/subdivision diff + slug are provided by new api
      const oldCountry = oldCountries.find((country) => country.value === label.value.id);
      if (!oldCountry) return null;

      return {
        ...oldCountry,
        display_value: label.value.value,
        value: label.value.id,
      };
    })
    .filter((label) => label);
