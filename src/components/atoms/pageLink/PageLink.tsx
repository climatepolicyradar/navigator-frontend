import { ParsedUrlQuery } from "querystring";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { MouseEventHandler, ReactNode } from "react";

import { CleanRouterQuery } from "@/utils/cleanRouterQuery";
import { joinTailwindClasses } from "@/utils/tailwind";

const getDebugClasses = (external: boolean, keepQuery: boolean, query?: ParsedUrlQuery) => {
  if (external) return "outline-2! outline-red-500"; // External = red
  if (keepQuery && query && Object.keys(query).length > 0) return "outline-2! outline-purple-500"; // Modified keep query = purple
  if (keepQuery) return "outline-2! outline-blue-500"; // Keep query = blue
  return "outline-2! outline-green-500"; // Internal = green
};

const LINK_UNDERLINE = "underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500";

export interface IProps extends LinkProps {
  children: ReactNode;
  className?: string;
  debug?: boolean;
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
  debug = false, // Switch to true to enable everywhere
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

  // Prevents a DOM parent onClick event from triggering when clicking a link
  const stopPropagation: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  };

  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : undefined;
  const allClasses = joinTailwindClasses(underline && LINK_UNDERLINE, className, debug && getDebugClasses(external, keepQuery, query));

  return (
    <Link
      {...props}
      {...externalProps}
      href={{ pathname: href, query: routerQuery, hash }}
      className={allClasses}
      onClick={stopPropagation}
      data-data-ph-capture-attribute-href={href}
    >
      {children}
    </Link>
  );
};
