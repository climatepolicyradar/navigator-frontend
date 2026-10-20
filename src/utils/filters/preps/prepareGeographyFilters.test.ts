import { TNestedSearchLabel } from "@/types";

import { prepareGeographyFilters } from "./prepareGeographyFilters";

const country = (value: string, children: TNestedSearchLabel[] = []): TNestedSearchLabel => ({
  id: `country::${value}`,
  type: "country",
  value,
  children,
});

const region = (value: string, children: TNestedSearchLabel[]): TNestedSearchLabel => ({
  id: `region::${value}`,
  type: "region",
  value,
  children,
});

const subdivision = (value: string): TNestedSearchLabel => ({
  id: `subdivision::${value}`,
  type: "subdivision",
  value,
  children: [],
});

describe("prepareGeographyFilters", () => {
  it("splits regions and countries into separate top-level groups", () => {
    const rootLabels = [region("Europe", [country("France")])];
    const [regionGroup, geographyGroup] = prepareGeographyFilters(false)(rootLabels);

    expect(regionGroup).toMatchObject({ id: "group::region", type: "group" });
    expect(geographyGroup).toMatchObject({ id: "group::geography", type: "group" });
    expect(regionGroup.children).toEqual([{ ...region("Europe", []), children: [] }]);
  });

  it("attaches the parent region to each flattened country as a parentPath", () => {
    const rootLabels = [region("Europe", [country("France")])];
    const [, geographyGroup] = prepareGeographyFilters(false)(rootLabels);

    expect(geographyGroup.children).toEqual([
      {
        ...country("France"),
        parentPath: [{ id: "region::Europe", type: "region", value: "Europe" }],
      },
    ]);
  });

  it("excludes a subdivision sitting directly under a region from the geography group", () => {
    const nonCountryChild: TNestedSearchLabel = { id: "subdivision::Wales", type: "subdivision", value: "Wales", children: [] };
    const rootLabels = [region("Europe", [nonCountryChild])];
    const [, geographyGroup] = prepareGeographyFilters(false)(rootLabels);

    expect(geographyGroup.children).toEqual([]);
  });

  it("adds the Country/Subdivision type group when the geography type filters feature is on", () => {
    const rootLabels = [region("Europe", [country("France")])];
    const [typeGroup, regionGroup, geographyGroup] = prepareGeographyFilters(true)(rootLabels);

    expect(typeGroup).toMatchObject({ id: "group::type", type: "group" });
    expect(typeGroup.children).toMatchObject([
      { id: "level::Country", type: "level", value: "Country" },
      { id: "level::Subdivision", type: "level", value: "Subdivision" },
    ]);
    expect(regionGroup).toMatchObject({ id: "group::region", type: "group" });
    expect(geographyGroup).toMatchObject({ id: "group::geography", type: "group" });
  });

  /*
   * Whether subdivisions appear in the hierarchy is decided upstream by the `subdivisions` feature,
   * which controls whether subdivision labels are fetched at all (see useFilterLabels). This prep
   * only passes through whatever it is given, so the two features must not interfere: the cases
   * below pin that down in both directions.
   */
  describe("subdivisions in the geography hierarchy", () => {
    const withSubdivisions = [region("Latin America", [country("Brazil", [subdivision("BR-RS"), subdivision("BR-AC")])])];
    const withoutSubdivisions = [region("Latin America", [country("Brazil")])];

    it("keeps subdivisions nested under their country when they have been fetched", () => {
      const [, geographyGroup] = prepareGeographyFilters(false)(withSubdivisions);

      expect(geographyGroup.children).toEqual([
        {
          ...country("Brazil", [subdivision("BR-RS"), subdivision("BR-AC")]),
          parentPath: [{ id: "region::Latin America", type: "region", value: "Latin America" }],
        },
      ]);
    });

    it("lists countries alone when subdivisions have not been fetched", () => {
      const [, geographyGroup] = prepareGeographyFilters(false)(withoutSubdivisions);

      expect(geographyGroup.children).toEqual([
        {
          ...country("Brazil"),
          parentPath: [{ id: "region::Latin America", type: "region", value: "Latin America" }],
        },
      ]);
    });

    it("never promotes a subdivision to a top-level geography", () => {
      const [, geographyGroup] = prepareGeographyFilters(false)(withSubdivisions);

      expect(geographyGroup.children.map((label) => label.type)).toEqual(["country"]);
    });

    it("nests subdivisions the same way regardless of the geography type filters feature", () => {
      const [, , withTypeFilters] = prepareGeographyFilters(true)(withSubdivisions);
      const [, withoutTypeFilters] = prepareGeographyFilters(false)(withSubdivisions);

      expect(withTypeFilters.children).toEqual(withoutTypeFilters.children);
    });
  });
});
