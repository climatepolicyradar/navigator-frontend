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

function parseIsoYear(value: string): number | null {
  const match = /^(\d{4})-/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  return Number.isInteger(year) ? year : null;
}

export function hasPublishedDateRule(group: TQueryGroup | null | undefined): boolean {
  if (!group) return false;
  return group.filters.some((filter) => {
    if ("field" in filter) return filter.field === "attributes.published_date";
    return hasPublishedDateRule(filter);
  });
}

export function buildPublishedDateRangeRules(startYear: number, endYear: number): TQueryRule[] {
  return [
    {
      field: "attributes.published_date",
      key: "published_date",
      op: "gte",
      value: toIsoStartOfYear(startYear),
    },
    {
      field: "attributes.published_date",
      key: "published_date",
      op: "lte",
      value: toIsoEndOfYear(endYear),
    },
  ];
}

export function findPublishedDateRangeValue(group: TQueryGroup): string | null {
  for (const filter of group.filters) {
    if ("field" in filter) {
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
    const nested = findPublishedDateRangeValue(filter);
    if (nested) return nested;
  }
  return null;
}

export function upsertPublishedDateRangeRules(group: TQueryGroup, value: string): TQueryGroup {
  const parsedRange = parseYearRange(value);
  if (!parsedRange) return group;

  const groupWithoutDateRules = removePublishedDateRules(group);
  return {
    ...groupWithoutDateRules,
    filters: [...groupWithoutDateRules.filters, ...buildPublishedDateRangeRules(parsedRange.startYear, parsedRange.endYear)],
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
