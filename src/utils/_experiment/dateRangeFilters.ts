import { TQueryGroup, TQueryRule } from "@/components/_experiment/advancedFilters/AdvancedFilters";

export const DATE_RANGE_VALUE_SEPARATOR = ":";
export const DATE_RANGE_MIN_YEAR = 1900;

export type TDateRangePreset = "all_time" | "last_year" | "last_5_years" | "custom";

export function serialiseYearRange(startYear: number, endYear: number): string {
  return `${startYear}${DATE_RANGE_VALUE_SEPARATOR}${endYear}`;
}

export function parseYearRange(value: string): { startYear: number; endYear: number } | null {
  const [startRaw, endRaw] = value.split(DATE_RANGE_VALUE_SEPARATOR);
  const startYear = Number(startRaw);
  const endYear = Number(endRaw);
  if (!Number.isInteger(startYear) || !Number.isInteger(endYear)) return null;
  if (startYear > endYear) return null;
  return { startYear, endYear };
}

export function resolveYearRangeForPreset(preset: TDateRangePreset, yearNow: number): { startYear: number; endYear: number } {
  switch (preset) {
    case "all_time":
      return { startYear: DATE_RANGE_MIN_YEAR, endYear: yearNow };
    case "last_year":
      return { startYear: yearNow - 1, endYear: yearNow };
    case "last_5_years":
      return { startYear: yearNow - 5, endYear: yearNow };
    case "custom":
      return { startYear: yearNow - 1, endYear: yearNow };
  }
}

function toIsoStartOfYear(year: number): string {
  return `${year}-01-01T00:00:00.000Z`;
}

function toIsoEndOfYear(year: number): string {
  return `${year}-12-31T23:59:59.999Z`;
}

function isDateOnly(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function normaliseDateValueForOp(op: "eq" | "not_eq" | "lt" | "lte" | "gt" | "gte", value: string): string {
  if (!isDateOnly(value)) return value;
  if (op === "lte" || op === "gt") {
    return `${value}T23:59:59.999Z`;
  }
  return `${value}T00:00:00.000Z`;
}

function parseIsoYear(value: string): number | null {
  const match = /^(\d{4})-/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  return Number.isInteger(year) ? year : null;
}

function isApiPublishedDateRule(rule: TQueryRule): rule is Extract<TQueryRule, { field: "attributes.published_date" }> {
  return rule.field === "attributes.published_date" && rule.op !== "between";
}

export function convertDateRangeRulesToApiGroup(group: TQueryGroup): TQueryGroup {
  const convertedFilters: Array<TQueryGroup | TQueryRule> = [];

  for (const filter of group.filters) {
    if ("field" in filter) {
      if (filter.field === "attributes.published_date" && filter.op === "between") {
        const parsedRange = parseYearRange(filter.value);
        if (!parsedRange) continue;

        convertedFilters.push({
          field: "attributes.published_date",
          key: "published_date",
          op: "gte",
          value: toIsoStartOfYear(parsedRange.startYear),
        });
        convertedFilters.push({
          field: "attributes.published_date",
          key: "published_date",
          op: "lte",
          value: toIsoEndOfYear(parsedRange.endYear),
        });
        continue;
      }

      if (filter.field === "attributes.published_date" && (filter.op === "gte" || filter.op === "lte")) {
        convertedFilters.push({
          field: "attributes.published_date",
          key: "published_date",
          op: filter.op,
          value: filter.value,
        });
        continue;
      }

      if (
        filter.field === "attributes.published_date" &&
        (filter.op === "eq" || filter.op === "not_eq" || filter.op === "lt" || filter.op === "lte" || filter.op === "gt" || filter.op === "gte")
      ) {
        convertedFilters.push({
          field: "attributes.published_date",
          key: "published_date",
          op: filter.op,
          value: normaliseDateValueForOp(filter.op, filter.value),
        });
        continue;
      }

      convertedFilters.push(filter);
      continue;
    }

    convertedFilters.push(convertDateRangeRulesToApiGroup(filter));
  }

  return {
    ...group,
    filters: convertedFilters,
  };
}

export function convertApiDateRulesToUiGroup(group: TQueryGroup): TQueryGroup {
  const normalisedFilters: Array<TQueryGroup | TQueryRule> = group.filters.map((item) => {
    if (!("field" in item)) return convertApiDateRulesToUiGroup(item);
    return item;
  });

  let gteIndex = -1;
  let lteIndex = -1;
  let gteValue = "";
  let lteValue = "";

  normalisedFilters.forEach((item, index) => {
    if (!("field" in item)) return;
    if (!isApiPublishedDateRule(item)) return;
    if (item.op === "gte" && gteIndex === -1) {
      gteIndex = index;
      gteValue = item.value;
      return;
    }
    if (item.op === "lte" && lteIndex === -1) {
      lteIndex = index;
      lteValue = item.value;
    }
  });

  if (gteIndex !== -1 && lteIndex !== -1) {
    const startYear = parseIsoYear(gteValue);
    const endYear = parseIsoYear(lteValue);
    if (startYear !== null && endYear !== null) {
      const insertIndex = Math.min(gteIndex, lteIndex);
      const withBetweenRule: Array<TQueryGroup | TQueryRule> = [];
      for (let index = 0; index < normalisedFilters.length; index += 1) {
        if (index === insertIndex) {
          withBetweenRule.push({
            field: "attributes.published_date",
            op: "between",
            value: serialiseYearRange(startYear, endYear),
          });
        }
        if (index === gteIndex || index === lteIndex) continue;
        withBetweenRule.push(normalisedFilters[index]);
      }
      return {
        ...group,
        filters: withBetweenRule,
      };
    }
  }

  return {
    ...group,
    filters: normalisedFilters,
  };
}

export function findPublishedDateBetweenValue(group: TQueryGroup): string | null {
  for (const filter of group.filters) {
    if ("field" in filter) {
      if (filter.field === "attributes.published_date" && filter.op === "between") {
        return filter.value;
      }
      if (filter.field === "attributes.published_date" && filter.op === "gte") {
        const endRule = group.filters.find(
          (candidate): candidate is TQueryRule => "field" in candidate && candidate.field === "attributes.published_date" && candidate.op === "lte"
        );
        if (endRule) {
          const startYear = parseIsoYear(filter.value);
          const endYear = parseIsoYear(endRule.value);
          if (startYear !== null && endYear !== null) {
            return serialiseYearRange(startYear, endYear);
          }
        }
      }
      continue;
    }
    const nested = findPublishedDateBetweenValue(filter);
    if (nested) return nested;
  }
  return null;
}

export function upsertPublishedDateBetweenRule(group: TQueryGroup, value: string): TQueryGroup {
  let updated = false;
  const filters: Array<TQueryGroup | TQueryRule> = group.filters.map((filter) => {
    if ("field" in filter) {
      if (filter.field === "attributes.published_date" && filter.op === "between") {
        updated = true;
        return { ...filter, value };
      }
      return filter;
    }
    const nested = upsertPublishedDateBetweenRule(filter, value);
    if (nested !== filter) updated = true;
    return nested;
  });

  if (updated) {
    return { ...group, filters };
  }

  return {
    ...group,
    filters: [
      ...group.filters,
      {
        field: "attributes.published_date",
        op: "between",
        value,
      },
    ],
  };
}

export function removePublishedDateRules(group: TQueryGroup): TQueryGroup {
  const filters: Array<TQueryGroup | TQueryRule> = [];
  for (const filter of group.filters) {
    if ("field" in filter) {
      if (filter.field === "attributes.published_date") {
        continue;
      }
      filters.push(filter);
      continue;
    }
    const nested = removePublishedDateRules(filter);
    if (nested.filters.length > 0) {
      filters.push(nested);
    }
  }

  return {
    ...group,
    filters,
  };
}
