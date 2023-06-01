import { FC, ReactNode } from "react";
import useConfig from "@hooks/useConfig";
import { getCountrySlug } from "@helpers/getCountryFields";
import { LinkWithQuery } from "./LinkWithQuery";
import { systemCountryCodes } from "@constants/systemCountryCodes";

type TCountryLink = {
  countryCode: string;
  className?: string;
  emptyContentFallback?: ReactNode;
  children?: ReactNode;
};

export const CountryLink: FC<TCountryLink> = ({ countryCode, className = "", emptyContentFallback, children }) => {
  const configQuery = useConfig();
  const { data: { countries = [] } = {} } = configQuery;

  const slug = getCountrySlug(countryCode, countries);
  // Force render without any empty content fallback the children without a link
  if (!slug && emptyContentFallback) return <>{emptyContentFallback}</>;
  if (!slug && !emptyContentFallback) return <>{children}</>;
  if (systemCountryCodes.includes(slug)) return <>{children}</>;

  return (
    <LinkWithQuery href={`/geographies/${slug}`} className={`flex items-center underline gap-2 ${className}`} passHref cypress="country-link">
      <span className={`rounded-sm border border-black flag-icon-background flag-icon-${countryCode.toLowerCase()}`} />
      {children}
    </LinkWithQuery>
  );
};
