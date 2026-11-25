import { describe, expect, it } from "vitest";

import { TLabel } from "@/types";

import { getGeographySlug } from "./geography";

const label = (id: string, type: string, value: string): TLabel => ({ id, type, value });

describe("getGeographySlug", () => {
  it("kebab-cases a country's name", () => {
    expect(getGeographySlug(label("country::FRA", "country", "France"))).toBe("france");
  });

  it.each([
    ["Korea, Democratic People's Republic of", "korea-north"],
    ["North Korea", "korea-north"],
  ])("resolves %s to the slug its page is served at", (value: string, expected: string) => {
    expect(getGeographySlug(label("country::PRK", "country", value))).toBe(expected);
  });

  it("lowercases a subdivision's code", () => {
    expect(getGeographySlug(label("subdivision::US-CA", "subdivision", "California"))).toBe("us-ca");
  });

  it("gives the European Union a slug, as it has a geography page", () => {
    expect(getGeographySlug(label("country::EUR", "country", "European Union"))).toBe("european-union");
  });

  it("gives no slug to a system geography with no page", () => {
    expect(getGeographySlug(label("country::XAB", "country", "International"))).toBeNull();
  });

  it("gives no slug to a region, which has no page of its own", () => {
    expect(getGeographySlug(label("region::ECS", "region", "Europe & Central Asia"))).toBeNull();
  });
});
