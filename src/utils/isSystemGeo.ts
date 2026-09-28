import { SYSTEM_GEO_CODES, SYSTEM_GEO_NAMES } from "@/constants/systemGeos";

export const isSystemGeo = (geo?: string) => {
  if (!geo) return false;
  return SYSTEM_GEO_CODES.includes(geo.toLowerCase()) || SYSTEM_GEO_NAMES.includes(geo.replace(" ", "-").toLowerCase());
};
