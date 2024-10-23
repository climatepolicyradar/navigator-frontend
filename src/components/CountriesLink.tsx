import { CountryLink } from "@components/CountryLink";
import { getCountryName } from "@helpers/getCountryFields";
import { isSystemGeo } from "@utils/isSystemGeo";
import { TGeography } from "@types";

type TCountriesLink = {
  geographies: string[];
  countries: TGeography[];
};

export const CountriesLink = ({ geographies, countries }: TCountriesLink) => (
  <>
    {geographies?.map(
      (geography, index) =>
        !isSystemGeo(geography) && (
          <span key={index} className="flex gap-1">
            <CountryLink countryCode={geography} className="text-textDark no-underline">
              <span>{getCountryName(geography, countries)}</span>
            </CountryLink>
          </span>
        )
    )}
  </>
);
