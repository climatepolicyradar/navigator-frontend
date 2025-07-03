import { FC, ReactNode } from "react";

import { systemGeoCodes } from "@/constants/systemGeos";
import { getCountrySlugOld } from "@/helpers/getCountryFields";
import useConfig from "@/hooks/useConfig";

import { LinkWithQuery } from "./LinkWithQuery";

type TCountryLink = {
  countryCode: string;
  className?: string;
  emptyContentFallback?: ReactNode;
  children?: ReactNode;
  showFlag?: boolean;
};

export const CountryLink: FC<TCountryLink> = ({ countryCode, className = "", emptyContentFallback, children, showFlag = true }) => {
  const configQuery = useConfig();
  const { data: { countries = [] } = {} } = configQuery; // TODO: Update as part of APP-841

  const slug = getCountrySlugOld(countryCode, countries);
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
