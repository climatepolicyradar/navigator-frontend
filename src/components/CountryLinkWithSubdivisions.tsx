import { FC, Fragment, ReactNode } from "react";

import { systemGeoCodes } from "@/constants/systemGeos";
import { getCountrySlug } from "@/helpers/getCountryFields";
import useConfig from "@/hooks/useConfig";
import { TGeography } from "@/types";

import { LinkWithQuery } from "./LinkWithQuery";

type TCountryLinkWithSubdivisions = {
  geographies: string[];
  countries: TGeography[];
  subdivisions: TGeography[];
  className?: string;
  // emptyContentFallback?: ReactNode;
  // children?: ReactNode;
  showFlag?: boolean;
};

export const CountryLinkWithSubdivisions: FC<TCountryLinkWithSubdivisions> = ({
  geographies,
  countries,
  subdivisions,
  className = "",
  // emptyContentFallback,
  // children,
  showFlag = true,
}) => {
  const slug = "";
  // const slug = getCountrySlug(countryCode, countries);
  // Force render without any empty content fallback the children without a link
  // if (!slug && emptyContentFallback) return <>{emptyContentFallback}</>;
  // if (!slug && !emptyContentFallback) return <>{children}</>;
  // if (systemGeoCodes.includes(slug)) return <>{children}</>;
  const country = geographies.map((geography) => countries.find((country) => country.value === geography)).filter((item) => item)[0];
  const subdivision = geographies.map((geography) => subdivisions.find((subdivision) => subdivision.value === geography)).filter((item) => item)[0];

  // console.log(geographies);
  // console.log(countryCode);
  // console.log(subdivisionCodes);

  return (
    <span className="flex gap-1">
      <LinkWithQuery href={`/geographies/${slug}`} className={`flex items-center gap-1 hover:underline hover:text-blue-800 ${className}`} passHref>
        {showFlag && <span className={`rounded-xs border border-black flag-icon-background flag-icon-${country.value.toLowerCase()}`} />}
        {country.display_value}
      </LinkWithQuery>
      <span> / </span>
      <LinkWithQuery href={`/geographies/${slug}`} className={`flex items-center gap-1 hover:underline hover:text-blue-800 ${className}`} passHref>
        {subdivision.display_value}
      </LinkWithQuery>
    </span>
  );
};
