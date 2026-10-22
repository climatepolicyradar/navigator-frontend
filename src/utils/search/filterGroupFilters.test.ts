import { TFiltersGroupConfig, TSearchQueryGroup } from "@/types";

import { filterGroupFilters } from "./filterGroupFilters";

const topicOnly = [{ container: "popover", rootLabelTypes: ["concept"], title: "Topic" }] as TFiltersGroupConfig[];

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
});
