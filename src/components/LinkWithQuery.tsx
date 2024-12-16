import Link from "next/link";
import { useRouter } from "next/router";

import { CleanRouterQuery } from "@utils/cleanRouterQuery";

type TProps = {
  href: string;
  hash?: string;
  children: React.ReactNode;
  className?: string;
  passHref?: boolean;
  target?: string;
  cypress?: string;
};

export const LinkWithQuery = ({ href, hash, children, cypress, ...props }: TProps) => {
  const router = useRouter();
  const queryObj = CleanRouterQuery({ ...router.query });

  return (
    <Link href={{ pathname: href, query: queryObj, hash: hash }} data-cy={cypress} {...props}>
      {children}
    </Link>
  );
};
