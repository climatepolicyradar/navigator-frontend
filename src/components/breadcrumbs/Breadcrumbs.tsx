import Link from "next/link";
import React from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Icon } from "@/components/atoms/icon/Icon";

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
  parentGeography?: TBreadcrumbLink;
  isSubdivision?: boolean;
  label?: string | React.ReactNode;
}

const BreadCrumb = ({ last = false, label = null, href = null, cy = "", isHome = false }: TBreadcrumbLink & { isHome?: boolean }) => {
  // Don't render if label is empty, null, or undefined (unless it's the home icon)
  if (!isHome && (!label || (typeof label === "string" && label.trim() === ""))) {
    return null;
  }

  const LinkComponent = isHome ? Link : LinkWithQuery;

  const labelShort =
    typeof label === "string" && label.toString().length > BREADCRUMB_MAXLENGTH ? `${label.toString().substring(0, BREADCRUMB_MAXLENGTH)}...` : label;

  return (
    <>
      <li data-cy={`breadcrumb ${cy}`} className={`${last && "text-textDark font-medium"}`}>
        {href ? (
          <LinkComponent className="underline hover:text-blue-800 text-textNormal flex items-baseline" href={href}>
            {isHome && (
              <span className="mr-1 translate-y-0.5">
                <Icon name="house" />
              </span>
            )}
            {labelShort}
          </LinkComponent>
        ) : (
          <span className="flex items-baseline">
            {isHome && (
              <span className="mr-1 translate-y-0.5">
                <Icon name="house" />
              </span>
            )}
            {labelShort}
          </span>
        )}
      </li>

      {!last && <li>/</li>}
    </>
  );
};

/**
 * Lists the page hierarchy back to the homepage so that the user can better understand where they are, and to easily go back to a previous page.
 */
export const BreadCrumbs = ({ geography = null, parentGeography = null, isSubdivision = false, category = null, family = null, label }: IProps) => {
  const isSearchPage = label === "Search results";
  const isGeographyPage = !isSearchPage && !category && !family && geography && !label;
  const isCollectionPage = !isSearchPage && !category && !family && !geography;

  if (isGeographyPage) {
    const breadcrumbGeography = isSubdivision && parentGeography ? parentGeography : null;
    const finalGeography = geography;

    return (
      <ul className="flex items-baseline flex-wrap gap-2 text-sm px-3 cols-2:px-6 cols-3:px-8 py-4 border-b border-gray-200" data-cy="breadcrumbs">
        <BreadCrumb label="" href="/" cy="home" isHome />
        <BreadCrumb label="Search" href="/search" cy="search" />
        {breadcrumbGeography && <BreadCrumb label={breadcrumbGeography.label} href={breadcrumbGeography.href} cy="geography" />}
        {finalGeography && <BreadCrumb label={finalGeography.label} last cy="current" />}
      </ul>
    );
  }

  if (isCollectionPage) {
    return (
      <ul className="flex items-baseline flex-wrap gap-2 text-sm px-3 cols-2:px-6 cols-3:px-8 py-4 border-b border-gray-200" data-cy="breadcrumbs">
        <BreadCrumb label="" href="/" cy="home" isHome />
        <BreadCrumb label="Search" href="/search" cy="search" />
        {label && <BreadCrumb label={label} last cy="current" />}
      </ul>
    );
  }

  const breadcrumbGeography = isSubdivision && parentGeography ? parentGeography : geography;
  const breadcrumbSubGeography = isSubdivision ? geography : null;

  return (
    <ul
      className={`flex items-baseline flex-wrap gap-2 text-sm px-3 cols-2:px-6 cols-3:px-8 py-4 ${isSearchPage ? "" : "border-b border-gray-200"}`}
      data-cy="breadcrumbs"
    >
      <BreadCrumb label="" href="/" cy="home" isHome />
      <BreadCrumb label="Search" href="/search" cy="search" />
      {breadcrumbGeography && <BreadCrumb label={breadcrumbGeography.label} href={breadcrumbGeography.href} cy="geography" />}
      {breadcrumbSubGeography && <BreadCrumb label={breadcrumbSubGeography.label} href={breadcrumbSubGeography.href} cy="sub-geography" />}
      {category && <BreadCrumb label={category.label} href={category.href} cy="category" />}
      {family && <BreadCrumb label={family.label} href={family.href} cy="family" />}
      {label && <BreadCrumb label={label} last cy="current" />}
    </ul>
  );
};
