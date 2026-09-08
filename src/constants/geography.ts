export const EXCLUDED_ISO_CODES = ["EUR", "XAA", "XAB"];
export const INCLUDED_GEO_TYPES = ["ISO-3166", "ISO-3166-2"];

// Maps the kebab-cased slug computed from a geography's display name to the slug its page actually resolves at
export const GEOGRAPHY_SLUG_CONVERSIONS: Record<string, string> = {
  bahamas: "bahamas-the",
  "bolivia-plurinational-state-of": "bolivia",
  "congo-the-democratic-republic-of-the": "democratic-republic-of-congo",
  "heard-island-and-mc-donald-islands": "heard-island-and-mcdonald-islands",
  "iran-islamic-republic-of": "iran",
  "korea-democratic-peoples-republic-of": "korea-north",
  "korea-republic-of": "south-korea",
  "lao-peoples-democratic-republic": "lao-people-s-democratic-republic",
  "micronesia-federated-states-of": "micronesia",
  "moldova-republic-of": "moldova",
  "north-macedonia": "north-macedonia-republic-of-north-macedonia",
  "palestine-state-of": "palestine",
  "russian-federation": "russia",
  "syrian-arab-republic": "syria",
  "taiwan-province-of-china": "taiwan",
  "tanzania-united-republic-of": "tanzania",
  turkiye: "turkey",
  "united-states": "united-states-of-america",
  "venezuela-bolivarian-republic-of": "venezuela",
  "viet-name": "vietnam",
  "western-sahara": "sahrawi-republic",
};
