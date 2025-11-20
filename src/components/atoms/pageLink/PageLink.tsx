import { ParsedUrlQuery } from "querystring";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

import { CleanRouterQuery } from "@/utils/cleanRouterQuery";
import { joinTailwindClasses } from "@/utils/tailwind";

export const LINK_UNDERLINE = "underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500";

interface IProps extends LinkProps {
  children: ReactNode;
  className?: string;
  external?: boolean;
  hash?: string;
  href: string;
  keepQuery?: boolean;
  query?: ParsedUrlQuery;
  underline?: boolean;
}

export const PageLink = ({
  children,
  className = "",
  external = false,
  hash,
  href,
  keepQuery = false,
  query = {},
  underline = false,
  ...props
}: IProps) => {
  const router = useRouter();

  const routerQuery = CleanRouterQuery({
    ...(keepQuery ? router.query : {}),
    ...query,
  });
  Object.entries(query).forEach(([queryKey, queryValue]) => {
    queryValue ?? delete routerQuery[queryKey]; // Unset null or undefined query values
  });

  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : undefined;
  const allClasses = joinTailwindClasses(underline && LINK_UNDERLINE, className);

  return (
    <Link {...props} {...externalProps} href={{ pathname: href, query: routerQuery, hash }} className={allClasses}>
      {children}
    </Link>
  );
};
