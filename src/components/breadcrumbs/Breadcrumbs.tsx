import Link from "next/link";
import React, { useContext } from "react";

import { LinkWithQuery } from "@/components/LinkWithQuery";
import { Icon } from "@/components/atoms/icon/Icon";
import { ThemeContext } from "@/context/ThemeContext";
import { TTheme } from "@/types";
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
  parentGeography?: TBreadcrumbLink;
  isSubdivision?: boolean;
  label?: string | React.ReactNode;
}

interface IBreadCrumb extends TBreadcrumbLink {
  isHome?: boolean;
  theme?: TTheme;
}

const BreadCrumb = ({ last = false, label = null, href = null, cy = "", isHome = false, theme }: IBreadCrumb) => {
  // Don't render if label is empty, null, or undefined (unless it's the home icon)
  if (!isHome && (!label || (typeof label === "string" && label.trim() === ""))) {
    return null;
  }

  const LinkComponent = isHome ? Link : LinkWithQuery;

  const labelShort =
    typeof label === "string" && label.toString().length > BREADCRUMB_MAXLENGTH ? `${label.toString().substring(0, BREADCRUMB_MAXLENGTH)}...` : label;

  return (
    <>
      <li data-cy={`breadcrumb ${cy}`}>
        {href ? (
          <LinkComponent
            className={`${isHome && theme === "ccc" ? "font-semibold text-text-primary hover:underline" : "underline hover:text-blue-800 text-textNormal flex items-baseline"}`}
            href={href}
          >
            {isHome && (
              <>
                {theme === "ccc" ? ( // TODO: get this from config dictionary (coming soon)
                  <>Climate Litigation Database</>
                ) : (
                  <span className="mr-1 translate-y-0.5">
                    <Icon name="house" />
                  </span>
                )}
              </>
            )}
            {labelShort}
          </LinkComponent>
        ) : (
          <span className="flex items-baseline">{labelShort}</span>
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
  const { theme } = useContext(ThemeContext);
  const isSearchPage = label === "Search results";
  const isGeographyPage = !isSearchPage && !category && !family && geography && !label;
  const isCollectionPage = !isSearchPage && !category && !family && !geography;

  if (isGeographyPage) {
    const breadcrumbGeography = isSubdivision && parentGeography && !isSystemGeo(String(parentGeography.label)) ? parentGeography : null;
    const finalGeography = geography && !isSystemGeo(String(geography.label)) ? geography : null;

    return (
      <ul className="flex items-baseline flex-wrap gap-2 text-sm px-3 cols-2:px-6 cols-3:px-8 py-4 border-b border-gray-200" data-cy="breadcrumbs">
        <BreadCrumb label="" href="/" cy="home" isHome theme={theme} />
        <BreadCrumb label="Search" href="/search" cy="search" />
        {breadcrumbGeography && <BreadCrumb label={breadcrumbGeography.label} href={breadcrumbGeography.href} cy="geography" />}
        {finalGeography && <BreadCrumb label={finalGeography.label} last cy="current" />}
      </ul>
    );
  }

  if (isCollectionPage) {
    return (
      <ul className="flex items-baseline flex-wrap gap-2 text-sm px-3 cols-2:px-6 cols-3:px-8 py-4 border-b border-gray-200" data-cy="breadcrumbs">
        <BreadCrumb label="" href="/" cy="home" isHome theme={theme} />
        <BreadCrumb label="Search" href="/search" cy="search" />
        {label && <BreadCrumb label={label} last cy="current" />}
      </ul>
    );
  }

  const breadcrumbGeography =
    isSubdivision && parentGeography && !isSystemGeo(String(parentGeography.label))
      ? parentGeography
      : geography && !isSystemGeo(String(geography.label))
        ? geography
        : null;
  const breadcrumbSubGeography = isSubdivision && geography && !isSystemGeo(String(geography.label)) ? geography : null;

  return (
    <ul
      className={`flex items-baseline flex-wrap gap-2 text-sm px-3 cols-2:px-6 cols-3:px-8 py-4 ${isSearchPage ? "" : "border-b border-gray-200"}`}
      data-cy="breadcrumbs"
    >
      <BreadCrumb label="" href="/" cy="home" isHome theme={theme} />
      <BreadCrumb label="Search" href="/search" cy="search" />
      {breadcrumbGeography && <BreadCrumb label={breadcrumbGeography.label} href={breadcrumbGeography.href} cy="geography" />}
      {breadcrumbSubGeography && <BreadCrumb label={breadcrumbSubGeography.label} href={breadcrumbSubGeography.href} cy="sub-geography" />}
      {category && <BreadCrumb label={category.label} href={category.href} cy="category" />}
      {family && <BreadCrumb label={family.label} href={family.href} cy="family" />}
      {label && <BreadCrumb label={label} last cy="current" />}
    </ul>
  );
};
