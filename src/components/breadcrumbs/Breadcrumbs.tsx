import Link from "next/link";
import React, { ReactNode, useContext } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Columns } from "@/components/atoms/columns/Columns";
import { ThemeContext } from "@/context/ThemeContext";
import { useText } from "@/hooks/useText";
import { isSystemGeo } from "@/utils/isSystemGeo";

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
  parentGeography?: TBreadcrumbLink;
  isSubdivision?: boolean;
  label?: string | React.ReactNode;
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

  const LinkComponent = isHome ? Link : LinkWithQuery;

  return (
    <>
      <li className="max-w-85 overflow-hidden whitespace-nowrap overflow-ellipsis" data-cy={`breadcrumb ${cy}`}>
        {href ? (
          <LinkComponent className="hover:underline" href={href}>
            {isHome ? getText("breadcrumbRoot") : label}
          </LinkComponent>
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
export const BreadCrumbs = ({ geography = null, parentGeography = null, isSubdivision = false, category = null, family = null, label }: IProps) => {
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

    if (breadcrumbGeography) breadCrumbs.push(<BreadCrumb label={breadcrumbGeography.label} href={breadcrumbGeography.href} cy="geography" />);
    if (finalGeography) breadCrumbs.push(<BreadCrumb label={finalGeography.label} last cy="current" />);
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

    if (breadcrumbGeography) breadCrumbs.push(<BreadCrumb label={breadcrumbGeography.label} href={breadcrumbGeography.href} cy="geography" />);
    if (breadcrumbSubGeography)
      breadCrumbs.push(<BreadCrumb label={breadcrumbSubGeography.label} href={breadcrumbSubGeography.href} cy="sub-geography" />);
    if (category) breadCrumbs.push(<BreadCrumb label={category.label} href={category.href} cy="category" />);
    if (family) breadCrumbs.push(<BreadCrumb label={family.label} href={family.href} cy="family" />);
    if (label) breadCrumbs.push(<BreadCrumb label={label} last cy="current" />);
  }

  return (
    <Columns>
      <ul
        className="cols-2:col-span-2 cols-3:col-span-3 cols-4:col-span-4 flex flex-wrap items-baseline gap-2 py-3 text-sm text-gray-700 leading-tight select-none"
        data-cy="breadcrumbs"
      >
        {breadCrumbs}
      </ul>
    </Columns>
  );
};
