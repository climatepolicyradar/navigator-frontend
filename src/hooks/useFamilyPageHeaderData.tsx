import partition from "lodash/partition";
import { useMemo } from "react";

import { TBreadcrumbLink } from "@/components/breadcrumbs/Breadcrumbs";
import { useText } from "@/hooks/useText";
import { IMetadata, TFamilyPublic } from "@/types";
import { getFamilyHeader } from "@/utils/family-header/getFamilyHeader";
import { isSystemGeo } from "@/utils/isSystemGeo";

type FamilyPageHeaderData = {
  pageHeaderMetadata: IMetadata[];
  breadcrumbGeography: TBreadcrumbLink | null;
  breadcrumbParentGeography: TBreadcrumbLink | null;
};

export const useFamilyPageHeaderData = (family: TFamilyPublic): FamilyPageHeaderData => {
  const { getCategoryTextLookup } = useText();
  const getCategoryText = getCategoryTextLookup(family.attribution.category);

  return useMemo(() => {
    const { geographies } = family;
    const codeIsCountry = (code: string) => !code.includes("-");

    /* Geographies breadcrumbs */

    let breadcrumbGeography: TBreadcrumbLink = null;
    let breadcrumbParentGeography: TBreadcrumbLink = null;

    if (geographies.length > 0) {
      const [countries, subdivisions] = partition(geographies, (geo) => codeIsCountry(geo.code));

      if (subdivisions.length > 0) {
        // Includes a subdivision
        const subdivision = subdivisions[0];
        breadcrumbGeography = { label: subdivision.name, href: `/geographies/${subdivision.slug}` };

        // Currently our families only have one country when a subdivision is present
        const country = countries[0];
        if (country) breadcrumbParentGeography = { label: country.name, href: `/geographies/${country.slug}` };
      } else {
        // Countries only
        const country = countries[0];
        if (!isSystemGeo(country.name)) breadcrumbGeography = { label: country.name, href: `/geographies/${country.slug}` };
      }
    }

    return {
      pageHeaderMetadata: getFamilyHeader({ family, getCategoryText }),
      breadcrumbGeography,
      breadcrumbParentGeography,
    };
  }, [family, getCategoryText]);
};
