import { FC, ReactNode } from "react";
import Link from "next/link";
import useConfig from "@hooks/useConfig";
import { getCountrySlug } from "@helpers/getCountryFields";

type TCountryLink = {
  countryCode: string;
  className?: string;
  emptyContentFallback?: ReactNode;
  children?: ReactNode;
};

export const CountryLink: FC<TCountryLink> = ({ countryCode, className = "", emptyContentFallback, children }) => {
  const configQuery: any = useConfig("config");
  const { data: { countries = [] } = {} } = configQuery;

  const slug = getCountrySlug(countryCode, countries);
  // Force render without any empty content fallback the children without a link
  if (!slug && emptyContentFallback) return <>{emptyContentFallback}</>;
  if (!slug && !emptyContentFallback) return <>{children}</>;
  return (
    <Link href={`/geographies/${slug}`} className={`flex items-center underline ${className}`} passHref>
      {children}
    </Link>
  );
};
