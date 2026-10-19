import { TNestedSearchLabel } from "@/types";

import { sortLabelsByValue } from "./sortLabelsByValue";

const createLabel = (value: string): TNestedSearchLabel => ({
  id: `principal_law::${value}`,
  type: "principal_law",
  value,
  children: [],
});

describe("sortLabelsByValue", () => {
  it("places an all-caps acronym in its alphabetical position rather than ahead of mixed-case peers", () => {
    const labels = [
      "National Climate Change Action Plan 2017-2022",
      "NDC 2020",
      "National Strategy on Forests and Climate Change 2017-2025",
      "National Climate Change Adaptation Plan",
    ].map(createLabel);

    expect(sortLabelsByValue(labels).map((label) => label.value)).toEqual([
      "National Climate Change Action Plan 2017-2022",
      "National Climate Change Adaptation Plan",
      "National Strategy on Forests and Climate Change 2017-2025",
      "NDC 2020",
    ]);
  });

  it("sorts case-insensitively so capitalisation does not partition the list", () => {
    const labels = ["banana", "Apple", "cherry", "BLUEBERRY"].map(createLabel);

    expect(sortLabelsByValue(labels).map((label) => label.value)).toEqual(["Apple", "banana", "BLUEBERRY", "cherry"]);
  });

  it("sorts accented characters alongside their unaccented equivalents", () => {
    const labels = ["Zambia", "Égypte", "Angola"].map(createLabel);

    expect(sortLabelsByValue(labels).map((label) => label.value)).toEqual(["Angola", "Égypte", "Zambia"]);
  });

  it("orders embedded numbers numerically rather than lexicographically", () => {
    const labels = ["Decree 10", "Decree 2", "Decree 1"].map(createLabel);

    expect(sortLabelsByValue(labels).map((label) => label.value)).toEqual(["Decree 1", "Decree 2", "Decree 10"]);
  });

  it("does not mutate the labels it is given", () => {
    const labels = ["Beta", "Alpha"].map(createLabel);

    sortLabelsByValue(labels);

    expect(labels.map((label) => label.value)).toEqual(["Beta", "Alpha"]);
  });
});
