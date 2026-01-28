import { SYSTEM_GEO_CODES, SYSTEM_GEO_NAMES, SYSTEM_INTERNATIONAL_CODE, SYSTEM_INTERNATIONAL_NAME } from "@/constants/systemGeos";

export const isSystemGeo = (geo?: string) => {
  if (!geo) return false;
  return SYSTEM_GEO_CODES.includes(geo.toLowerCase()) || SYSTEM_GEO_NAMES.includes(geo.replace(" ", "-").toLowerCase());
};

export const isSystemInternational = (geo?: string) => {
  if (!geo) return false;
  return SYSTEM_INTERNATIONAL_CODE.includes(geo.toLowerCase()) || SYSTEM_INTERNATIONAL_NAME.includes(geo.replace(" ", "-").toLowerCase());
};
