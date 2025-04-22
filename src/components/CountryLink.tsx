import { systemGeoCodes } from "@/constants/systemGeos";
import { getCountrySlug } from "@/helpers/getCountryFields";
import { TGeography } from "@/types";
import { FC, ReactNode } from "react";
import { LinkWithQuery } from "./LinkWithQuery";

type TCountryLink = {
  children?: ReactNode;
  className?: string;
  countryCode: string;
  emptyContentFallback?: ReactNode;
  geographiesData: TGeography[];
  showFlag?: boolean;
};

export const CountryLink: FC<TCountryLink> = ({ children, className = "", countryCode, emptyContentFallback, geographiesData, showFlag = true }) => {
  const slug = getCountrySlug(countryCode, geographiesData);
  // Force render without any empty content fallback the children without a link
  if (!slug && emptyContentFallback) return <>{emptyContentFallback}</>;
  if (!slug && !emptyContentFallback) return <>{children}</>;
  if (systemGeoCodes.includes(slug)) return <>{children}</>;

  return (
    <LinkWithQuery
      href={`/geographies/${slug}`}
      className={`flex items-center gap-1 hover:underline hover:text-blue-800 ${className}`}
      passHref
      cypress="country-link"
    >
      {showFlag && <span className={`rounded-xs border border-black flag-icon-background flag-icon-${countryCode.toLowerCase()}`} />}
      {children}
    </LinkWithQuery>
  );
};
