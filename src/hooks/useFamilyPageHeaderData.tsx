import orderBy from "lodash/orderBy";
import { useMemo } from "react";

import { TBreadcrumbLink } from "@/components/breadcrumbs/Breadcrumbs";
import { IProps as GeographyLinkProps } from "@/components/molecules/geographyLink/GeographyLink";
import { getCountryName, getCountrySlug } from "@/helpers/getCountryFields";
import { getSubdivisionName } from "@/helpers/getSubdivision";
import { useText } from "@/hooks/useText";
import { IMetadata, TFamilyPublic, TGeography, TGeographySubdivision } from "@/types";
import { getFamilyHeader } from "@/utils/family-header/getFamilyHeader";
import { isSystemGeo } from "@/utils/isSystemGeo";

interface IProps {
  countries: TGeography[];
  family: TFamilyPublic;
  subdivisions: TGeographySubdivision[];
}

type FamilyPageHeaderData = {
  pageHeaderMetadata: IMetadata[];
  breadcrumbGeography: TBreadcrumbLink | null;
  breadcrumbParentGeography: TBreadcrumbLink | null;
};

export const useFamilyPageHeaderData = ({ countries, family, subdivisions }: IProps): FamilyPageHeaderData => {
  const { getCategoryTextLookup } = useText();
  const getCategoryText = getCategoryTextLookup(family.attribution.category);

  return useMemo(() => {
    const codeIsCountry = (code: string) => !code.includes("-");

    // TODO use the new geography endpoint + GeographyV2
    const geographiesDisplayData: GeographyLinkProps[] = orderBy(
      family.geographies
        .map((code) => {
          const isSubdivision = !codeIsCountry(code);
          const name = isSubdivision ? getSubdivisionName(code, subdivisions) : getCountryName(code, countries);
          const slug = isSubdivision ? code.toLowerCase() : getCountrySlug(code, countries);
          return name && slug ? { code, name, slug: isSystemGeo(name) ? undefined : slug } : null;
        })
        .filter((data) => data),
      [(data) => data.code.includes("-"), "name"],
      ["asc", "asc"]
    );

    /* Geographies breadcrumbs */

    let breadcrumbGeography: TBreadcrumbLink = null;
    let breadcrumbParentGeography: TBreadcrumbLink = null;

    if (geographiesDisplayData.length > 0) {
      if (geographiesDisplayData.some((geo) => !codeIsCountry(geo.code))) {
        // Includes a subdivision
        const subdivision = geographiesDisplayData.find((geo) => !codeIsCountry(geo.code));
        breadcrumbGeography = { label: subdivision.name, href: `/geographies/${subdivision.slug}` };

        // Get the subdivision's parent country
        const subdivisionData = subdivisions.find((sub) => sub.code === subdivision.code);
        const parentCountryCode = subdivisionData.country_alpha_3;
        if (subdivisionData) {
          const countryName = getCountryName(parentCountryCode, countries);
          const countrySlug = getCountrySlug(parentCountryCode, countries);
          if (countryName && countrySlug && !isSystemGeo(countryName)) {
            breadcrumbParentGeography = { label: countryName, href: `/geographies/${countrySlug}` };
          }
        }
      } else {
        // Countries only
        const country = geographiesDisplayData[0];
        if (!isSystemGeo(country.name)) breadcrumbGeography = { label: country.name, href: `/geographies/${country.slug}` };
      }
    }

    return {
      pageHeaderMetadata: getFamilyHeader({ countries, family, subdivisions, getCategoryText }),
      breadcrumbGeography,
      breadcrumbParentGeography,
    };
  }, [countries, family, subdivisions, getCategoryText]);
};
