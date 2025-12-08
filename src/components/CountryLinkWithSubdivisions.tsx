import { FC, Fragment, ReactNode } from "react";

import { SYSTEM_GEO_CODES } from "@/constants/systemGeos";
import { TGeography } from "@/types";

import { LinkWithQuery } from "./LinkWithQuery";

type TCountryLinkWithSubdivisions = {
  geographies: string[];
  countries: TGeography[];
  subdivisions: TGeography[];
  className?: string;
  emptyContentFallback?: ReactNode;
  children?: ReactNode;
  showFlag?: boolean;
};

export const CountryLinkWithSubdivisions: FC<TCountryLinkWithSubdivisions> = ({
  geographies,
  countries,
  subdivisions,
  className = "",
  emptyContentFallback,
  children,
  showFlag = true,
}) => {
  const selectedCountry = countries.find((country) => geographies.includes(country.value));
  const selectedSubdivisions = subdivisions.filter((subdivision) => geographies.includes(subdivision.value));

  const slug = selectedCountry?.slug;
  // Force render without any empty content fallback the children without a link
  if (!slug && emptyContentFallback) return <>{emptyContentFallback}</>;
  if (!slug && !emptyContentFallback) return <>{children}</>;
  if (SYSTEM_GEO_CODES.includes(slug)) return <>{children}</>;

  return (
    <span className="flex gap-1">
      <LinkWithQuery
        href={`/geographies/${slug}`}
        className={`flex items-center gap-1 hover:underline hover:text-blue-800 ${className}`}
        cypress="country-link"
      >
        {showFlag && <span className={`rounded-xs border border-black flag-icon-background flag-icon-${selectedCountry?.value.toLowerCase()}`} />}
        {selectedCountry?.display_value}
      </LinkWithQuery>
      <span> / </span>
      <div className="flex">
        {selectedSubdivisions.map((subdivision, index) => (
          <Fragment key={subdivision.slug}>
            <LinkWithQuery href={`/geographies/${subdivision.slug}`} className={`flex items-center hover:underline hover:text-blue-800 ${className}`}>
              {subdivision.display_value}
            </LinkWithQuery>
            {index !== selectedSubdivisions.length - 1 && <span>,&nbsp;</span>}
          </Fragment>
        ))}
      </div>
    </span>
  );
};
