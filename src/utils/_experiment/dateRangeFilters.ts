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

function isAttributesPublishedDateRule(rule: TQueryRule): rule is Extract<TQueryRule, { field: "attributes"; key: "published_date" }> {
  return rule.field === "attributes" && rule.key === "published_date";
}

function isLegacyPublishedDateRule(rule: TQueryRule): rule is Extract<TQueryRule, { field: "attributes.published_date" }> {
  return rule.field === "attributes.published_date";
}

export function convertDateRangeRulesToApiGroup(group: TQueryGroup): TQueryGroup {
  const convertedFilters: Array<TQueryGroup | TQueryRule> = [];

  for (const filter of group.filters) {
    if ("field" in filter) {
      if (filter.field === "attributes.published_date" && filter.op === "between") {
        const parsedRange = parseYearRange(filter.value);
        if (!parsedRange) continue;

        convertedFilters.push({
          field: "attributes",
          key: "published_date",
          op: "gte",
          value: toIsoStartOfYear(parsedRange.startYear),
        });
        convertedFilters.push({
          field: "attributes",
          key: "published_date",
          op: "lte",
          value: toIsoEndOfYear(parsedRange.endYear),
        });
        continue;
      }

      if (filter.field === "attributes.published_date" && (filter.op === "gte" || filter.op === "lte")) {
        convertedFilters.push({
          field: "attributes",
          key: "published_date",
          op: filter.op,
          value: filter.value,
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
  const convertedFilters: Array<TQueryGroup | TQueryRule> = [];
  let index = 0;
  while (index < group.filters.length) {
    const currentFilter = group.filters[index];
    const nextFilter = group.filters[index + 1];

    if ("field" in currentFilter && nextFilter && "field" in nextFilter) {
      const isCurrentDateRule = isAttributesPublishedDateRule(currentFilter) || isLegacyPublishedDateRule(currentFilter);
      const isNextDateRule = isAttributesPublishedDateRule(nextFilter) || isLegacyPublishedDateRule(nextFilter);
      const isDateRangePair = isCurrentDateRule && isNextDateRule && currentFilter.op === "gte" && nextFilter.op === "lte";

      if (isDateRangePair) {
        const startYear = parseIsoYear(currentFilter.value);
        const endYear = parseIsoYear(nextFilter.value);
        if (startYear !== null && endYear !== null) {
          convertedFilters.push({
            field: "attributes.published_date",
            op: "between",
            value: serialiseYearRange(startYear, endYear),
          });
          index += 2;
          continue;
        }
      }
    }

    if (!("field" in currentFilter)) {
      convertedFilters.push(convertApiDateRulesToUiGroup(currentFilter));
      index += 1;
      continue;
    }

    convertedFilters.push(currentFilter);
    index += 1;
  }

  return {
    ...group,
    filters: convertedFilters,
  };
}

export function findPublishedDateBetweenValue(group: TQueryGroup): string | null {
  for (const filter of group.filters) {
    if ("field" in filter) {
      if (filter.field === "attributes.published_date" && filter.op === "between") {
        return filter.value;
      }
      if (filter.field === "attributes" && filter.key === "published_date" && filter.op === "gte") {
        const endRule = group.filters.find(
          (candidate): candidate is TQueryRule =>
            "field" in candidate && candidate.field === "attributes" && candidate.key === "published_date" && candidate.op === "lte"
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
