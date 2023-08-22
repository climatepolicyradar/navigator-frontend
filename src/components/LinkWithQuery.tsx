import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { CleanRouterQuery } from "@utils/cleanRouterQuery";

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
  const queryObj = CleanRouterQuery({ ...router.query });

  return (
    <Link href={{ pathname: href }} data-cy={cypress} {...props}>
      {children}
    </Link>
  );
};
