import { systemGeoCodes, systemGeoNames, SYSTEM_INTERNATIONAL_CODE, SYSTEM_INTERNATIONAL_NAME } from "@constants/systemGeos";

export const isSystemGeo = (geo?: string) => {
  if (!geo) return false;
  return systemGeoCodes.includes(geo.toLowerCase()) || systemGeoNames.includes(geo.replace(" ", "-").toLowerCase());
};

export const isSystemInternational = (geo?: string) => {
  if (!geo) return false;
  return SYSTEM_INTERNATIONAL_CODE.includes(geo.toLowerCase()) || SYSTEM_INTERNATIONAL_NAME.includes(geo.replace(" ", "-").toLowerCase());
};
