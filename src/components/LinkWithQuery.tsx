import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

import { QUERY_PARAMS } from "@constants/queryParams";

type TProps = {
  href: string;
  hash?: string;
  query?: ParsedUrlQuery;
  children: React.ReactNode;
  className?: string;
  passHref?: boolean;
  target?: string;
  cypress?: string;
};

export const LinkWithQuery = ({ href, hash, query, children, cypress, ...props }: TProps) => {
  const router = useRouter();

  // remove any keys from router.query that are not values in QUERY_PARAMS
  Object.keys(router.query).forEach((key) => {
    if (!Object.values(QUERY_PARAMS).includes(key)) {
      delete router.query[key];
    }
  });

  return (
    <Link href={{ pathname: href, query: { ...router.query }, hash: hash }} data-cy={cypress} {...props}>
      {children}
    </Link>
  );
};
