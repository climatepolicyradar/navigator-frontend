import kebabCase from "lodash/kebabCase";

import { ID_SEPARATOR } from "@/constants/chars";
import { GEOGRAPHY_SLUG_CONVERSIONS, NO_PAGE_ISO_CODES } from "@/constants/geography";
import { TLabel } from "@/types";

export const getGeographySlug = (geographyLabel: TLabel): string | null => {
  const geoCode = geographyLabel.id.split(ID_SEPARATOR)[1];
  if (!geoCode) return null;
  const slug = kebabCase(geographyLabel.value);

  if (NO_PAGE_ISO_CODES.includes(geoCode.toUpperCase())) return null;

  switch (geographyLabel.type) {
    case "subdivision":
      return geoCode.toLowerCase();
    case "country":
      return GEOGRAPHY_SLUG_CONVERSIONS[slug] ?? slug;
    default:
      return null;
  }
};
