import { Fragment } from "react";

import { CountryLink } from "@/components/CountryLink";
import { getCountryName } from "@/helpers/getCountryFields";
import { TFamilyGeography, TGeography } from "@/types";
import { isSystemGeo, isSystemInternational } from "@/utils/isSystemGeo";

type TCountriesLink = {
  geographies: string[] | TFamilyGeography[];
  countries: TGeography[];
  showFlag?: boolean;
};

const standardiseGeo = (geography: string | TFamilyGeography, countries: TGeography[]) =>
  typeof geography === "string"
    ? {
        name: getCountryName(geography, countries),
        code: geography,
        slug: "",
      }
    : geography;

export const CountryLinks = ({ geographies, countries, showFlag = true }: TCountriesLink) => (
  <>
    {geographies?.map((geography) => {
      const geo = standardiseGeo(geography, countries);
      if (!geo.name) return null;

      return (
        <Fragment key={geo.code}>
          {isSystemInternational(geo.code) && (
            <span className="flex gap-1">
              <>{geo.name}</>
            </span>
          )}
          {!isSystemGeo(geo.code) && (
            <span className="flex gap-1">
              <CountryLink countryCode={geo.code} showFlag={showFlag} className="text-textDark no-underline">
                <span>{geo.name}</span>
              </CountryLink>
            </span>
          )}
        </Fragment>
      );
    })}
  </>
);

export const CountryLinksAsList = ({ geographies, countries, showFlag = true }: TCountriesLink) => (
  <>
    {geographies?.map((geography, index) => {
      const geo = standardiseGeo(geography, countries);
      if (!geo.name) return null;

      return (
        <Fragment key={geo.code}>
          {isSystemInternational(geo.code) && (
            <div className="flex">
              <>{geo.name}</>
              {index !== geographies.length - 1 && <span>,</span>}
            </div>
          )}
          {!isSystemGeo(geo.code) && (
            <div className="flex">
              <CountryLink
                countryCode={geo.code}
                showFlag={showFlag}
                className="text-blue-600 underline truncate text-sm capitalize hover:text-blue-800"
              >
                <span>{geo.name}</span>
              </CountryLink>
              {index !== geographies.length - 1 && <span>,</span>}
            </div>
          )}
        </Fragment>
      );
    })}
  </>
);
