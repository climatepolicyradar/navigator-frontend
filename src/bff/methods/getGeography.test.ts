import { describe, expect, it } from "vitest";

import { TNestedSearchLabel } from "@/types";

import { findGeographyBySlug, getGeographyStatistics, toGeographySearchLabel } from "./getGeography";
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
const EUROPEAN_UNION = label("country::EUR", "country", "European Union");
const EUROPE = label("region::ECS", "region", "Europe & Central Asia", [UNITED_KINGDOM, EUROPEAN_UNION]);
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

  it("finds the European Union, which has a page even though other pages do not link to it", () => {
    expect(findGeographyBySlug(TAXONOMY, "european-union")).toEqual({ label: EUROPEAN_UNION, parent: EUROPE });
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

describe("getGeographyStatistics", () => {
  it("returns a country's static statistics", () => {
    expect(getGeographyStatistics(UNITED_KINGDOM)).toMatchObject({ name: "United Kingdom", federal: true, visibility_status: "published" });
  });

  it("returns the European Union's static statistics", () => {
    expect(getGeographyStatistics(EUROPEAN_UNION)).toMatchObject({ name: "European Union", visibility_status: "published" });
  });

  it("returns null for a country that has none", () => {
    expect(getGeographyStatistics(label("country::GRL", "country", "Greenland"))).toBeNull();
  });

  it("returns null for a subdivision", () => {
    expect(getGeographyStatistics(ENGLAND)).toBeNull();
  });
});

describe("toGeographySearchLabel", () => {
  it("relates a country to its region", () => {
    expect(toGeographySearchLabel({ label: AFGHANISTAN, parent: SOUTH_ASIA })).toEqual({
      id: "country::AFG",
      type: "country",
      value: "Afghanistan",
      alternative_labels: [],
      labels: [
        {
          type: "subconcept_of",
          value: { id: "region::SAS", type: "region", value: "South Asia", alternative_labels: [], labels: [] },
          timestamp: null,
          passages_id: null,
          count: null,
        },
      ],
    });
  });

  it("relates a subdivision to its country", () => {
    expect(toGeographySearchLabel({ label: ENGLAND, parent: UNITED_KINGDOM }).labels[0].value).toMatchObject({ id: "country::GBR", type: "country" });
  });

  it("has no relations without a parent", () => {
    expect(toGeographySearchLabel({ label: AFGHANISTAN, parent: null }).labels).toEqual([]);
  });
});
