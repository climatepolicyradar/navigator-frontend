import { Fragment } from "react";

import { CountryLink } from "@/components/CountryLink";
import { getCountryName } from "@/helpers/getCountryFields";
import { TGeography } from "@/types";
import { isSystemGeo, isSystemInternational } from "@/utils/isSystemGeo";

type TCountriesLink = {
  geographies: string[];
  countries: TGeography[];
  showFlag?: boolean;
};

export const CountryLinks = ({ geographies, countries, showFlag = true }: TCountriesLink) => (
  <>
    {geographies?.map((geography) => {
      const countryName = getCountryName(geography, countries);
      if (!countryName) return null;

      return (
        <Fragment key={geography}>
          {isSystemInternational(geography) && (
            <span className="flex gap-1">
              <>{countryName}</>
            </span>
          )}
          {!isSystemGeo(geography) && (
            <span className="flex gap-1">
              <CountryLink countryCode={geography} showFlag={showFlag} className="text-textDark no-underline">
                <span>{countryName}</span>
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
    {geographies?.map((geography, index) => (
      <Fragment key={geography}>
        {isSystemInternational(geography) && (
          <div className="flex">
            <>{getCountryName(geography, countries)}</>
            {index !== geographies.length - 1 && <span>,</span>}
          </div>
        )}
        {!isSystemGeo(geography) && (
          <div className="flex">
            <CountryLink
              countryCode={geography}
              showFlag={showFlag}
              className="text-blue-600 underline truncate text-sm capitalize hover:text-blue-800"
            >
              <span>{getCountryName(geography, countries)}</span>
            </CountryLink>
            {index !== geographies.length - 1 && <span>,</span>}
          </div>
        )}
      </Fragment>
    ))}
  </>
);
