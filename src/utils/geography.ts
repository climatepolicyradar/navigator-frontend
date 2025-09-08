export const getCountryNameFromCode = (code: string, geos): string => {
  const match = geos.filter((geo) => code === geo.code);
  return match[0].name;
};

export const getCountryFromId = (id: number, geos): string => {
  const match = geos.find((geo) => id === geo.geography_id);
  return match.english_shortname;
};

export const v1GeoSlugToV2 = (slug: string): string => (slug === "united-states-of-america" ? "united-states" : slug);
export const v2GeoSlugToV1 = (slug: string): string => (slug === "united-states" ? "united-states-of-america" : slug);
