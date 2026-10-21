import { isFilterGroupEmpty } from "@/components/_experiment/advancedFilters/AdvancedFilters";
import { ID_SEPARATOR } from "@/constants/chars";
import { SUBNATIONAL_LABEL_TYPE } from "@/constants/labels";
import { parseAsDeflatedFilters, deflateFilters } from "@/utils/filters/deflate";
import { queryGroupToAPIFilters } from "@/utils/search/queryGroupToAPIFilters";

it("subnational landing page filters survive the URL parser and rewrite for the API", () => {
  const SUBNATIONAL_FILTER = {
    field: "labels.value.id" as const,
    op: "contains" as const,
    value: [SUBNATIONAL_LABEL_TYPE, "Subdivision"].join(ID_SEPARATOR),
    checked: true as const,
  };
  const group = {
    op: "and" as const,
    filters: [
      SUBNATIONAL_FILTER,
      {
        op: "or" as const,
        filters: [{ field: "labels.value.id" as const, op: "contains" as const, value: "concept::Q684", checked: true as const }],
      },
    ],
  };

  // 1. survives the URL round-trip (this is what failed with labels.value.type)
  const parsed = parseAsDeflatedFilters.parse(deflateFilters(group));
  expect(parsed).not.toBeNull();

  // 2. hasSearch would be true -> no zero state
  expect(isFilterGroupEmpty(parsed)).toBe(false);

  // 3. rewritten into the real subdivision type rule for the API
  const apiFilters = queryGroupToAPIFilters(parsed!);
  expect(apiFilters.filters[0]).toEqual({ field: "labels.value.type", op: "contains", value: "subdivision" });
});
