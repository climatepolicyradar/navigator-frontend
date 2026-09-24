import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";
import { useContext, useMemo } from "react";

import { TBreadcrumbLink } from "@/components/breadcrumbs/Breadcrumbs";
import { ID_SEPARATOR } from "@/constants/chars";
import { FeaturesContext } from "@/context/FeaturesContext";
import { useText } from "@/hooks/useText";
import { IMetadata, TFamilyPublic } from "@/types";
import { getFamilyHeader } from "@/utils/family-header/getFamilyHeader";
import { getGeographySlug } from "@/utils/geography";
import { isSystemGeo } from "@/utils/isSystemGeo";

type FamilyPageHeaderData = {
  pageHeaderMetadata: IMetadata[];
  breadcrumbGeography: TBreadcrumbLink | null;
  breadcrumbParentGeography: TBreadcrumbLink | null;
};

export const useFamilyPageHeaderData = (family: TFamilyPublic): FamilyPageHeaderData => {
  const features = useContext(FeaturesContext);
  const { getCategoryTextLookup } = useText();
  const getCategoryText = getCategoryTextLookup(family.attribution.category);

  return useMemo(() => {
    /* Geographies breadcrumbs */

    let breadcrumbGeography: TBreadcrumbLink = null;
    let breadcrumbParentGeography: TBreadcrumbLink = null;

    if (family.geographies.length > 0) {
      const groupedGeographies = groupBy(sortBy(family.geographies, "value"), "type");

      if (groupedGeographies.country?.length > 0) {
        // Must have at least a country to have breadcrumbs
        const country = groupedGeographies.country[0];

        if (features.subdivisions && groupedGeographies.subdivision?.length > 0) {
          // Includes a subdivision
          const subdivision = groupedGeographies.subdivision[0];

          breadcrumbGeography = { label: subdivision.value, href: `/geographies/${getGeographySlug(subdivision)}` };
          breadcrumbParentGeography = { label: country.value, href: `/geographies/${getGeographySlug(country)}` };
        } else {
          // Countries only
          if (!isSystemGeo(country.id.split(ID_SEPARATOR)[1]))
            breadcrumbGeography = { label: country.value, href: `/geographies/${getGeographySlug(country)}` };
        }
      }
    }

    return {
      pageHeaderMetadata: getFamilyHeader({ family, getCategoryText }),
      breadcrumbGeography,
      breadcrumbParentGeography,
    };
  }, [family, features.subdivisions, getCategoryText]);
};
