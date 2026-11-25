import { LABEL_SEARCH_REPLACEMENTS } from "@/constants/labels";
import { TSearchQueryRule } from "@/types";

import { FILTER_TEST_CASES } from "./filterPathsToQueryGroup.test";
import { queryGroupToAPIFilters } from "./queryGroupToAPIFilters";

const getOriginalFilter = (value: string): TSearchQueryRule => ({
  field: "labels.value.id",
  op: "contains",
  value,
});

describe("queryGroupToAPIFilters", () => {
  describe("without replacements", () => {
    it.each(FILTER_TEST_CASES.map(({ name, searchQueryGroup }) => [name, searchQueryGroup]))(
      "makes no changes to a query group for %s",
      (_name, searchQueryGroup) => {
        expect(queryGroupToAPIFilters(searchQueryGroup)).toEqual(searchQueryGroup);
      }
    );
  });

  describe("with replacements", () => {
    it("replaces a filter with its replacement filter", () => {
      expect(
        queryGroupToAPIFilters({
          op: "and",
          filters: [getOriginalFilter(LABEL_SEARCH_REPLACEMENTS[0].idMatch)],
        })
      ).toEqual({
        op: "and",
        filters: [LABEL_SEARCH_REPLACEMENTS[0].filter],
      });
    });

    it("replaces multiple filters with their replacement filters", () => {
      expect(
        queryGroupToAPIFilters({
          op: "or",
          filters: [getOriginalFilter(LABEL_SEARCH_REPLACEMENTS[0].idMatch), getOriginalFilter(LABEL_SEARCH_REPLACEMENTS[1].idMatch)],
        })
      ).toEqual({
        op: "or",
        filters: [LABEL_SEARCH_REPLACEMENTS[0].filter, LABEL_SEARCH_REPLACEMENTS[1].filter],
      });
    });

    it("replaces a filter with its replacement filter at any depth", () => {
      expect(
        queryGroupToAPIFilters({
          op: "and",
          filters: [
            {
              op: "or",
              filters: [
                {
                  op: "and",
                  filters: [getOriginalFilter(LABEL_SEARCH_REPLACEMENTS[0].idMatch)],
                },
              ],
            },
          ],
        })
      ).toEqual({
        op: "and",
        filters: [
          {
            op: "or",
            filters: [
              {
                op: "and",
                filters: [LABEL_SEARCH_REPLACEMENTS[0].filter],
              },
            ],
          },
        ],
      });
    });

    it("replaces a filter and leaves other filters unchanged", () => {
      const otherFilter: TSearchQueryRule = {
        field: "labels.value.id",
        op: "contains",
        value: "concept::Q100",
      };

      expect(
        queryGroupToAPIFilters({
          op: "and",
          filters: [otherFilter, getOriginalFilter(LABEL_SEARCH_REPLACEMENTS[0].idMatch)],
        })
      ).toEqual({
        op: "and",
        filters: [otherFilter, LABEL_SEARCH_REPLACEMENTS[0].filter],
      });
    });

    it("narrows UNFCCC to the approved Party document types", () => {
      // @see: https://linear.app/climate-policy-radar/issue/FUS-611
      expect(queryGroupToAPIFilters({ op: "and", filters: [getOriginalFilter("un_convention::UNFCCC")] })).toEqual({
        op: "and",
        filters: [
          {
            op: "and",
            filters: [
              getOriginalFilter("un_convention::UNFCCC"),
              {
                op: "or",
                filters: [
                  "Nationally Determined Contribution (NDC)",
                  "National Adaptation Plan (NAP)",
                  "Biennial Transparency Report (BTR)",
                  "Long-term Low-emission Development Strategy (LT-LEDS)",
                  "Biennial Update Report (BUR)",
                  "Biennial Report (BR)",
                  "National Communication (NC)",
                  "National Inventory Report (NIR)",
                  "Adaptation Communication (AC)",
                ].map((entityType) => getOriginalFilter(`entity_type::${entityType}`)),
              },
            ],
          },
        ],
      });
    });
  });
});
