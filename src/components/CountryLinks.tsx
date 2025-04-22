import { CountryLink } from "@/components/CountryLink";
import { getCountryName } from "@/helpers/getCountryFields";
import { TGeography } from "@/types";
import { isSystemGeo, isSystemInternational } from "@/utils/isSystemGeo";
import { Fragment } from "react";

type TCountriesLink = {
  geographies: string[];
  geographiesData: TGeography[];
  showFlag?: boolean;
};

export const CountryLinks = ({ geographies, geographiesData, showFlag = true }: TCountriesLink) => (
  <>
    {geographies?.map((geography) => {
      const countryName = getCountryName(geography, geographiesData);
      if (!countryName || countryName === "No Geography") return null;

      if (isSystemInternational(geography)) {
        return (
          <Fragment key={geography}>
            <span className="flex gap-1">
              <>{countryName}</>
            </span>
          </Fragment>
        );
      }

      if (!isSystemGeo(geography)) {
        const isLevel2Code = /[A-Z]{2}-[A-Z]{1,3}/.test(geography);

        return (
          <Fragment key={geography}>
            <span className="flex gap-1">
              <CountryLink
                className="text-textDark no-underline"
                countryCode={geography}
                geographiesData={geographiesData}
                showFlag={isLevel2Code ? false : showFlag}
              >
                <span>{countryName}</span>
              </CountryLink>
            </span>
          </Fragment>
        );
      }
      return null;
    })}
  </>
);

export const CountryLinksAsList = ({ geographies, geographiesData, showFlag = true }: TCountriesLink) => (
  <>
    {geographies?.map((geography, index) => (
      <Fragment key={geography}>
        {isSystemInternational(geography) && (
          <div className="flex">
            <>{getCountryName(geography, geographiesData)}</>
            {index !== geographies.length - 1 && <span>,</span>}
          </div>
        )}
        {!isSystemGeo(geography) && (
          <div className="flex">
            <CountryLink
              className="text-blue-600 underline truncate text-sm capitalize hover:text-blue-800"
              countryCode={geography}
              geographiesData={geographiesData}
              showFlag={showFlag}
            >
              <span>{getCountryName(geography, geographiesData)}</span>
            </CountryLink>
            {index !== geographies.length - 1 && <span>,</span>}
          </div>
        )}
      </Fragment>
    ))}
  </>
);
