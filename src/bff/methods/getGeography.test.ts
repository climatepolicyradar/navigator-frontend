import { describe, expect, it } from "vitest";

import { TNestedSearchLabel } from "@/types";

import { findGeographyBySlug, labelToGeographyV2 } from "./getGeography";
import geographySlugs from "../../../tests/fixtures/geographySlugs.json";

const label = (id: string, type: string, value: string, children: TNestedSearchLabel[] = []): TNestedSearchLabel => ({
  id,
  type,
  value,
  alternative_labels: [],
  children,
});

const ENGLAND = label("subdivision::GB-ENG", "subdivision", "England");
const UNITED_KINGDOM = label("country::GBR", "country", "United Kingdom", [ENGLAND]);
const AFGHANISTAN = label("country::AFG", "country", "Afghanistan");
const SOUTH_ASIA = label("region::SAS", "region", "South Asia", [AFGHANISTAN]);
const EUROPE = label("region::ECS", "region", "Europe & Central Asia", [UNITED_KINGDOM]);
const TAXONOMY = [SOUTH_ASIA, EUROPE];

describe("findGeographyBySlug", () => {
  it("finds a country and returns its region as the parent", () => {
    expect(findGeographyBySlug(TAXONOMY, "afghanistan")).toEqual({ label: AFGHANISTAN, parent: SOUTH_ASIA });
  });

  it("finds a subdivision by its lower-cased ISO code and returns its country as the parent", () => {
    expect(findGeographyBySlug(TAXONOMY, "gb-eng")).toEqual({ label: ENGLAND, parent: UNITED_KINGDOM });
  });

  it("returns null for an unknown slug", () => {
    expect(findGeographyBySlug(TAXONOMY, "atlantis")).toBeNull();
  });

  it("never matches a region, which has no page", () => {
    expect(findGeographyBySlug(TAXONOMY, "south-asia")).toBeNull();
  });

  it("never matches an excluded system geography", () => {
    const international = label("country::XAB", "country", "International");
    expect(findGeographyBySlug([label("region::OTH", "region", "Other", [international])], "international")).toBeNull();
  });

  describe("slug regression against the backend", () => {
    const taxonomy = [
      label(
        "region::ALL",
        "region",
        "All",
        geographySlugs.map(({ id, value }) => label(id, "country", value))
      ),
    ];

    it.each(geographySlugs)("resolves $slug to $id", ({ id, slug }) => {
      expect(findGeographyBySlug(taxonomy, slug)?.label.id).toBe(id);
    });
  });
});

describe("labelToGeographyV2", () => {
  it("builds a country with its static statistics", () => {
    const geography = labelToGeographyV2(UNITED_KINGDOM);

    expect(geography).toMatchObject({
      id: "GBR",
      type: "country",
      slug: "united-kingdom",
      name: "United Kingdom",
      subconcept_of: [],
      has_subconcept: [],
    });
    expect(geography?.statistics).toMatchObject({ name: "United Kingdom", federal: true, visibility_status: "published" });
  });

  it("omits statistics for a country that has none", () => {
    const geography = labelToGeographyV2(label("country::GRL", "country", "Greenland"));

    expect(geography).not.toBeNull();
    expect(geography).not.toHaveProperty("statistics");
  });

  it("builds a subdivision with its ISO code as the id and no statistics", () => {
    const geography = labelToGeographyV2(ENGLAND);

    expect(geography).toMatchObject({ id: "GB-ENG", type: "subdivision", slug: "gb-eng", name: "England" });
    expect(geography).not.toHaveProperty("statistics");
  });

  it("returns null when the label has no page", () => {
    expect(labelToGeographyV2(label("country::XAB", "country", "International"))).toBeNull();
  });

  it("produces JSON-serialisable output, as getServerSideProps requires", () => {
    const geography = labelToGeographyV2(label("country::GRL", "country", "Greenland"));

    expect(JSON.parse(JSON.stringify(geography))).toEqual(geography);
  });
});
