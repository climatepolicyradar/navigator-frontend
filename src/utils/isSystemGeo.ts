import { systemGeoCodes, systemGeoNames } from "@constants/systemGeos";

export const isSystemGeo = (geo?: string) => {
  if (!geo) return false;
  return systemGeoCodes.includes(geo.toLowerCase()) || systemGeoNames.includes(geo.toLowerCase());
};
