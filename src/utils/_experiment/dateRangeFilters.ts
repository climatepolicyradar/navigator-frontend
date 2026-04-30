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

export function convertDateRangeRulesToApiGroup(group: TQueryGroup): TQueryGroup {
  const convertedFilters: Array<TQueryGroup | TQueryRule> = [];

  for (const filter of group.filters) {
    if ("field" in filter) {
      if (filter.field === "attributes.published_date" && filter.op === "between") {
        const parsedRange = parseYearRange(filter.value);
        if (!parsedRange) continue;

        convertedFilters.push({
          op: "and",
          filters: [
            {
              field: "attributes.published_date",
              op: "gte",
              value: toIsoStartOfYear(parsedRange.startYear),
            },
            {
              field: "attributes.published_date",
              op: "lte",
              value: toIsoEndOfYear(parsedRange.endYear),
            },
          ],
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

  for (const filter of group.filters) {
    if (!("field" in filter)) {
      const maybeGte = filter.filters[0];
      const maybeLte = filter.filters[1];
      const isDatePair =
        filter.op === "and" &&
        filter.filters.length === 2 &&
        maybeGte &&
        maybeLte &&
        "field" in maybeGte &&
        "field" in maybeLte &&
        maybeGte.field === "attributes.published_date" &&
        maybeLte.field === "attributes.published_date" &&
        maybeGte.op === "gte" &&
        maybeLte.op === "lte";

      if (isDatePair) {
        const startYear = parseIsoYear(maybeGte.value);
        const endYear = parseIsoYear(maybeLte.value);
        if (startYear !== null && endYear !== null) {
          convertedFilters.push({
            field: "attributes.published_date",
            op: "between",
            value: serialiseYearRange(startYear, endYear),
          });
          continue;
        }
      }

      convertedFilters.push(convertApiDateRulesToUiGroup(filter));
      continue;
    }

    convertedFilters.push(filter);
  }

  return {
    ...group,
    filters: convertedFilters,
  };
}
