import { getGeographySlug } from "./geography";

describe("getGeographySlug", () => {
  it("derives a kebab-cased slug from the country name", () => {
    expect(getGeographySlug({ id: "country::AUS", type: "country", value: "Australia" })).toBe("australia");
  });

  it("converts the taxonomy name for North Korea to the slug its page resolves at", () => {
    expect(getGeographySlug({ id: "country::PRK", type: "country", value: "North Korea" })).toBe("korea-north");
  });

  it("still converts the document-label name for North Korea", () => {
    expect(getGeographySlug({ id: "country::PRK", type: "country", value: "Korea, Democratic People's Republic of" })).toBe("korea-north");
  });

  it("uses the lower-cased ISO code for subdivisions", () => {
    expect(getGeographySlug({ id: "subdivision::US-CA", type: "subdivision", value: "California" })).toBe("us-ca");
  });

  it("returns null for excluded system geographies", () => {
    expect(getGeographySlug({ id: "country::XAB", type: "country", value: "International" })).toBeNull();
    expect(getGeographySlug({ id: "country::EUR", type: "country", value: "European Union" })).toBeNull();
  });
});
