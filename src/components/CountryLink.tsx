import { FC, ReactNode } from "react";
import useConfig from "@hooks/useConfig";
import { getCountrySlug } from "@helpers/getCountryFields";
import { LinkWithQuery } from "./LinkWithQuery";

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
  return (
    <LinkWithQuery href={`/geographies/${slug}`} className={`flex items-center underline ${className}`} passHref cypress="country-link">
      {children}
    </LinkWithQuery>
  );
};
