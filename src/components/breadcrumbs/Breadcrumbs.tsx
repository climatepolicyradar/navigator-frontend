import React, { ReactNode, useContext } from "react";

import { FiveColumns } from "@/components/atoms/columns/FiveColumns";
import { PageLink } from "@/components/atoms/pageLink/PageLink";
import { ThemeContext } from "@/context/ThemeContext";
import { useText } from "@/hooks/useText";
import { isSystemGeo } from "@/utils/isSystemGeo";
import { joinTailwindClasses } from "@/utils/tailwind";

export type TBreadcrumbLink = {
  label: string | React.ReactNode;
  href?: string;
  last?: boolean;
  cy?: string;
};

interface IProps {
  category?: TBreadcrumbLink;
  dark?: boolean;
  family?: TBreadcrumbLink;
  geography?: TBreadcrumbLink;
  isSubdivision?: boolean;
  label?: string | React.ReactNode;
  parentGeography?: TBreadcrumbLink;
}

interface IBreadCrumb extends TBreadcrumbLink {
  isHome?: boolean;
}

const BreadCrumb = ({ last = false, label = null, href = null, cy = "", isHome = false }: IBreadCrumb) => {
  const { getText } = useText();

  // Don't render if label is empty, null, or undefined (unless it's the home item)
  if (!isHome && (!label || (typeof label === "string" && label.trim() === ""))) {
    return null;
  }

  return (
    <>
      <li className="max-w-85 overflow-hidden whitespace-nowrap overflow-ellipsis" data-cy={`breadcrumb ${cy}`}>
        {href ? (
          <PageLink href={href} keepQuery={!isHome} className="hover:underline">
            {isHome ? getText("breadcrumbRoot") : label}
          </PageLink>
        ) : (
          <>{label}</>
        )}
      </li>

      {!last && <li className="text-gray-400">/</li>}
    </>
  );
};

/**
 * Lists the page hierarchy back to the homepage so that the user can better understand where they are, and to easily go back to a previous page.
 */
export const BreadCrumbs = ({
  category = null,
  dark = false,
  family = null,
  geography = null,
  isSubdivision = false,
  label,
  parentGeography = null,
}: IProps) => {
  const { theme } = useContext(ThemeContext);
  const isSearchPage = label === "Search results";
  const isGeographyPage = !isSearchPage && !category && !family && geography && !label;
  const isCollectionPage = !isSearchPage && !category && !family && !geography;

  const breadCrumbs: ReactNode[] = [
    <BreadCrumb key="home" label="" href="/" cy="home" isHome />,
    <BreadCrumb key="search" label="Search" href="/search" cy="search" />,
  ];

  if (isGeographyPage) {
    const breadcrumbGeography = isSubdivision && parentGeography && !isSystemGeo(String(parentGeography.label)) ? parentGeography : null;
    const finalGeography = geography && !isSystemGeo(String(geography.label)) ? geography : null;

    if (breadcrumbGeography)
      breadCrumbs.push(<BreadCrumb key="geography" label={breadcrumbGeography.label} href={breadcrumbGeography.href} cy="geography" />);
    if (finalGeography) breadCrumbs.push(<BreadCrumb key="final-geography" label={finalGeography.label} last cy="current" />);
  } else if (isCollectionPage) {
    if (label) breadCrumbs.push(<BreadCrumb key="collection" label={label} last cy="current" />);
  } else {
    const breadcrumbGeography =
      isSubdivision && parentGeography && !isSystemGeo(String(parentGeography.label))
        ? parentGeography
        : geography && !isSystemGeo(String(geography.label))
          ? geography
          : null;
    const breadcrumbSubGeography = isSubdivision && geography && !isSystemGeo(String(geography.label)) ? geography : null;

    if (breadcrumbGeography)
      breadCrumbs.push(<BreadCrumb key="geography" label={breadcrumbGeography.label} href={breadcrumbGeography.href} cy="geography" />);
    if (breadcrumbSubGeography)
      breadCrumbs.push(<BreadCrumb key="sub-geography" label={breadcrumbSubGeography.label} href={breadcrumbSubGeography.href} cy="sub-geography" />);
    if (category) breadCrumbs.push(<BreadCrumb key="category" label={category.label} href={category.href} cy="category" />);
    if (family) breadCrumbs.push(<BreadCrumb key="family" label={family.label} href={family.href} cy="family" />);
    if (label) breadCrumbs.push(<BreadCrumb key="current" label={label} last cy="current" />);
  }

  const containerClasses = joinTailwindClasses(dark && "bg-gray-100");

  return (
    <div className={containerClasses}>
      <FiveColumns>
        <ul
          className="col-start-1 -col-end-1 flex flex-wrap items-baseline gap-2 py-3 text-sm text-gray-700 leading-tight select-none"
          data-cy="breadcrumbs"
        >
          {breadCrumbs}
        </ul>
      </FiveColumns>
    </div>
  );
};
