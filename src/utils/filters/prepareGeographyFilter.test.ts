import { TNestedSearchLabel } from "@/types";

import { prepareGeographyFilters } from "./prepareGeographyFilter";

const country = (value: string): TNestedSearchLabel => ({
  id: `country::${value}`,
  type: "country",
  value,
  children: [],
});

const region = (value: string, children: TNestedSearchLabel[]): TNestedSearchLabel => ({
  id: `region::${value}`,
  type: "region",
  value,
  children,
});

describe("prepareGeographyFilters", () => {
  it("splits regions and countries into separate top-level groups", () => {
    const rootLabels = [region("Europe", [country("France")])];
    const [regionGroup, geographyGroup] = prepareGeographyFilters(rootLabels);

    expect(regionGroup).toMatchObject({ id: "group::region", type: "group" });
    expect(geographyGroup).toMatchObject({ id: "group::geography", type: "group" });
    expect(regionGroup.children).toEqual([{ ...region("Europe", []), children: [] }]);
  });

  it("attaches the parent region to each flattened country as a parentPath", () => {
    const rootLabels = [region("Europe", [country("France")])];
    const [, geographyGroup] = prepareGeographyFilters(rootLabels);

    expect(geographyGroup.children).toEqual([
      {
        ...country("France"),
        parentPath: [{ id: "region::Europe", type: "region", value: "Europe" }],
      },
    ]);
  });

  it("ignores non-country children when building the geography group", () => {
    const nonCountryChild: TNestedSearchLabel = { id: "subdivision::Wales", type: "subdivision", value: "Wales", children: [] };
    const rootLabels = [region("Europe", [nonCountryChild])];
    const [, geographyGroup] = prepareGeographyFilters(rootLabels);

    expect(geographyGroup.children).toEqual([]);
  });
});
