import { TSearchQueryGroup } from "@/types";

import { filterQueryGroupRules, isLabelRuleOfTypes } from "./filterQueryGroupRules";

const isConceptRule = isLabelRuleOfTypes(["concept"]);
const isNotConceptRule = (rule: Parameters<typeof isConceptRule>[0]) => !isConceptRule(rule);

describe("isLabelRuleOfTypes", () => {
  it("matches a label rule by its value prefix", () => {
    expect(isConceptRule({ field: "labels.value.id", op: "contains", value: "concept::Q786" })).toBe(true);
    expect(isConceptRule({ field: "labels.value.id", op: "contains", value: "country::LVA" })).toBe(false);
  });

  it("does not match non-label rules", () => {
    expect(isConceptRule({ field: "attributes.published_date", key: "published_date", op: "gte", value: "2020-01-01" })).toBe(false);
    expect(isLabelRuleOfTypes(["concept"])({ field: "type", op: "contains", value: "concept" })).toBe(false);
  });
});

describe("filterQueryGroupRules", () => {
  it("returns null for an absent group", () => {
    expect(filterQueryGroupRules(null, isConceptRule)).toBeNull();
  });

  it("keeps concept rules and drops the rest", () => {
    const group: TSearchQueryGroup = {
      op: "and",
      filters: [
        { field: "labels.value.id", op: "contains", value: "concept::Q786", checked: true },
        { field: "labels.value.id", op: "contains", value: "country::LVA", checked: true },
      ],
    };

    expect(filterQueryGroupRules(group, isConceptRule)).toEqual({
      op: "and",
      filters: [{ field: "labels.value.id", op: "contains", value: "concept::Q786", checked: true }],
    });
  });

  it("drops a group left empty by the prune, along with its ancestors", () => {
    const group: TSearchQueryGroup = {
      op: "and",
      filters: [
        { field: "labels.value.id", op: "contains", value: "region::europe" },
        { op: "or", filters: [{ field: "labels.value.id", op: "contains", value: "country::LVA", checked: true }] },
      ],
    };

    expect(filterQueryGroupRules(group, isConceptRule)).toBeNull();
  });

  it("keeps a nested geography branch under the complementary predicate", () => {
    const group: TSearchQueryGroup = {
      op: "and",
      filters: [
        { field: "labels.value.id", op: "contains", value: "concept::Q786", checked: true },
        {
          op: "and",
          filters: [
            { field: "labels.value.id", op: "contains", value: "region::europe" },
            { op: "or", filters: [{ field: "labels.value.id", op: "contains", value: "country::LVA", checked: true }] },
          ],
        },
      ],
    };

    expect(filterQueryGroupRules(group, isNotConceptRule)).toEqual({
      op: "and",
      filters: [
        {
          op: "and",
          filters: [
            { field: "labels.value.id", op: "contains", value: "region::europe" },
            { op: "or", filters: [{ field: "labels.value.id", op: "contains", value: "country::LVA", checked: true }] },
          ],
        },
      ],
    });
  });

  it("drops published date rules from a concept prune but keeps them in its complement", () => {
    const group: TSearchQueryGroup = {
      op: "and",
      filters: [
        { field: "labels.value.id", op: "contains", value: "concept::Q786", checked: true },
        { field: "attributes.published_date", key: "published_date", op: "gte", value: "2020-01-01" },
      ],
    };

    expect(filterQueryGroupRules(group, isConceptRule)).toEqual({
      op: "and",
      filters: [{ field: "labels.value.id", op: "contains", value: "concept::Q786", checked: true }],
    });
    expect(filterQueryGroupRules(group, isNotConceptRule)).toEqual({
      op: "and",
      filters: [{ field: "attributes.published_date", key: "published_date", op: "gte", value: "2020-01-01" }],
    });
  });

  it("always drops empty-value rules, whatever the predicate", () => {
    const group: TSearchQueryGroup = { op: "and", filters: [{ field: "labels.value.id", op: "contains", value: "" }] };

    expect(filterQueryGroupRules(group, isConceptRule)).toBeNull();
    expect(filterQueryGroupRules(group, isNotConceptRule)).toBeNull();
  });

  it("preserves nesting, operators and checked markers of the rules it keeps", () => {
    const group: TSearchQueryGroup = {
      op: "and",
      filters: [
        { field: "labels.value.id", op: "contains", value: "concept::Q1" },
        {
          op: "or",
          filters: [
            { field: "labels.value.id", op: "contains", value: "concept::Q2", checked: true },
            { field: "labels.value.id", op: "not_contains", value: "concept::Q3", checked: true },
          ],
        },
      ],
    };

    expect(filterQueryGroupRules(group, isConceptRule)).toEqual(group);
  });
});
