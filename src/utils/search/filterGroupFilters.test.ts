import { TFiltersGroup, TSearchQueryGroup } from "@/types";

import { filterGroupFilters } from "./filterGroupFilters";

const topicOnly = [
  {
    container: "popover",
    rootLabelTypes: ["concept"],
    title: "Topic",
    nestedLabels: [{ id: "concept::Q1651", type: "concept", value: "Q1651", children: [] }],
  },
] as unknown as TFiltersGroup[];

// The search page's Geography group: rooted on regions, with countries nested beneath them
const geography = [
  {
    container: "drawer",
    rootLabelTypes: ["region"],
    title: "Geography",
    nestedLabels: [
      { id: "region::ECS", type: "region", value: "ECS", children: [{ id: "country::DEU", type: "country", value: "DEU", children: [] }] },
    ],
  },
] as unknown as TFiltersGroup[];

describe("filterGroupFilters", () => {
  /*
    The filters param is shared between searches, so it can hold rules a given set of controls
    does not offer. Only what the groups on show can apply should survive.
  */
  it("keeps only the rules the groups on show can apply", () => {
    const filters: TSearchQueryGroup = {
      op: "and",
      filters: [
        { field: "labels.value.id", op: "contains", value: "concept::Q1651", checked: true },
        { field: "labels.value.id", op: "contains", value: "country::DEU", checked: true },
      ],
    };

    expect(filterGroupFilters(filters, topicOnly)).toEqual({
      op: "and",
      filters: [{ field: "labels.value.id", op: "contains", value: "concept::Q1651", checked: true }],
    });
  });

  /*
    A group's rootLabelTypes name only what sits at the top of its tree - the Geography group is
    rooted on regions, with countries nested beneath. Dropping a nested type would erase it from
    the url the next time any filter is toggled.
  */
  it("keeps a type nested under a group's root, not just the root type", () => {
    const filters: TSearchQueryGroup = {
      op: "and",
      filters: [
        { field: "labels.value.id", op: "contains", value: "region::ECS" },
        { field: "labels.value.id", op: "contains", value: "country::DEU", checked: true },
      ],
    };

    expect(filterGroupFilters(filters, geography)).toEqual(filters);
  });
});
