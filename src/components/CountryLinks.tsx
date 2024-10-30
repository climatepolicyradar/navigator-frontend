import { CountryLink } from "@components/CountryLink";
import { getCountryName } from "@helpers/getCountryFields";
import { isSystemGeo } from "@utils/isSystemGeo";
import { TGeography } from "@types";

type TCountriesLink = {
  geographies: string[];
  countries: TGeography[];
  showFlag?: boolean;
};

export const CountryLinks = ({ geographies, countries, showFlag = true }: TCountriesLink) => (
  <>
    {geographies?.map(
      (geography) =>
        !isSystemGeo(geography) && (
          <span key={geography} className="flex gap-1">
            <CountryLink countryCode={geography} showFlag={showFlag} className="text-textDark no-underline">
              <span>{getCountryName(geography, countries)}</span>
            </CountryLink>
          </span>
        )
    )}
  </>
);

export const CountryLinksAsList = ({ geographies, countries, showFlag = true }: TCountriesLink) => (
  <>
    {geographies?.map(
      (geography, index) =>
        !isSystemGeo(geography) && (
          <div key={geography} className="flex">
            <CountryLink countryCode={geography} showFlag={showFlag} className="text-blue-600 underline truncate text-sm text-transform: capitalize">
              <span>{getCountryName(geography, countries)}</span>
            </CountryLink>
            {index !== geographies.length - 1 && <span>,</span>}
          </div>
        )
    )}
  </>
);
