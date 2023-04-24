import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

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

  // Remove specific slug parameters from the query string
  delete router.query["docId"];
  delete router.query["id"];
  delete router.query["geographyId"];

  return (
    <Link href={{ pathname: href, query: { ...router.query }, hash: hash }} data-cy={cypress} {...props}>
      {children}
    </Link>
  );
};
