import { LinkWithQuery } from "@components/LinkWithQuery";

type TBreadcrumbLink = {
  label: string | React.ReactNode;
  href?: string;
  last?: boolean;
};

type TProps = {
  category?: TBreadcrumbLink;
  family?: TBreadcrumbLink;
  geography?: TBreadcrumbLink;
  label: string | React.ReactNode;
};

const BreadCrumb = ({ last = false, label, href = null }: TBreadcrumbLink) => {
  const labelShort = typeof label === "string" && label.toString().length > 50 ? `${label.toString().substring(0, 50)}...` : label;
  return (
    <>
      <li>
        {href ? (
          <LinkWithQuery className="underline" href={href}>
            {labelShort}
          </LinkWithQuery>
        ) : (
          labelShort
        )}
      </li>

      {!last && <li>&rsaquo;</li>}
    </>
  );
};

export const BreadCrumbs = ({ geography = null, category = null, family = null, label }: TProps) => {
  return (
    <ul className="flex flex-wrap gap-2 pt-4">
      <BreadCrumb label="Home" href="/" />
      {geography && <BreadCrumb label={geography.label} href={geography.href} />}
      {category && <BreadCrumb label={category.label} href={category.href} />}
      {family && <BreadCrumb label={family.label} href={family.href} />}
      <BreadCrumb label={label} last />
    </ul>
  );
};
