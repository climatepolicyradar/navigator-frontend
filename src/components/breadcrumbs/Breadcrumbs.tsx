import { LinkWithQuery } from "@/components/LinkWithQuery";
import { isSystemGeo } from "@/utils/isSystemGeo";

const BREADCRUMB_MAXLENGTH = 50;

type TBreadcrumbLink = {
  label: string | React.ReactNode;
  href?: string;
  last?: boolean;
  cy?: string;
};

interface IProps {
  category?: TBreadcrumbLink;
  family?: TBreadcrumbLink;
  geography?: TBreadcrumbLink;
  label: string | React.ReactNode;
}

const BreadCrumb = ({ last = false, label, href = null, cy = "" }: TBreadcrumbLink) => {
  const labelShort =
    typeof label === "string" && label.toString().length > BREADCRUMB_MAXLENGTH ? `${label.toString().substring(0, BREADCRUMB_MAXLENGTH)}...` : label;

  return (
    <>
      <li data-cy={`breadcrumb ${cy}`} className={`${last && "text-textDark font-medium"}`}>
        {href ? (
          <LinkWithQuery className="underline hover:text-blue-800 text-textNormal" href={href}>
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

/**
 * Lists the page hierarchy back to the homepage so that the user can better understand where they are, and to easily go back to a previous page.
 */
export const BreadCrumbs = ({ geography = null, category = null, family = null, label }: IProps) => {
  return (
    <ul className="flex items-baseline flex-wrap gap-2 text-sm" data-cy="breadcrumbs">
      <BreadCrumb label="Home" href="/" cy="home" />
      {geography && <BreadCrumb label={geography.label} href={isSystemGeo(String(geography.label)) ? null : geography.href} cy="geography" />}
      {category && <BreadCrumb label={category.label} href={category.href} cy="category" />}
      {family && <BreadCrumb label={family.label} href={family.href} cy="family" />}
      <BreadCrumb label={label} last cy="current" />
    </ul>
  );
};
