import kebabCase from "lodash/kebabCase";

import { ID_SEPARATOR } from "@/constants/chars";
import { EXCLUDED_ISO_CODES, GEOGRAPHY_SLUG_CONVERSIONS, SUBDIVISIONS_WITHOUT_PAGES } from "@/constants/geography";
import { TLabel } from "@/types";

export const getGeographySlug = (geographyLabel: TLabel): string | null => {
  const geoCode = geographyLabel.id.split(ID_SEPARATOR)[1];
  if (!geoCode) return null;
  const slug = kebabCase(geographyLabel.value);

  if (EXCLUDED_ISO_CODES.includes(geoCode.toUpperCase())) return null;

  switch (geographyLabel.type) {
    case "subdivision":
      return SUBDIVISIONS_WITHOUT_PAGES.includes(geoCode.toUpperCase()) ? null : geoCode.toLowerCase();
    case "country":
      return GEOGRAPHY_SLUG_CONVERSIONS[slug] ?? slug;
    default:
      return null;
  }
};
