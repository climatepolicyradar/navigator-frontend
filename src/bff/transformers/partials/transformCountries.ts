import { ID_SEPARATOR } from "@/constants/chars";
import { TDataInLabel } from "@/schemas";
import { TApiGeography, TGeography } from "@/types";

export const transformCountries = (oldCountries: TApiGeography[], newGeographyLabels: TDataInLabel[]): TGeography[] =>
  newGeographyLabels
    .map((label) => {
      const countryId = label.value.id.split(ID_SEPARATOR)[1];
      // TODO stop using old data when country/subdivision diff + slug are provided by new api
      const oldCountry = oldCountries.find((country) => country.value === countryId);
      if (!oldCountry) return null;

      return {
        ...oldCountry,
        display_value: label.value.value,
        value: countryId,
      };
    })
    .filter((label) => label);
