import { months } from "../constants/timedate";

const ISO_DATE = /^(?<year>\d{4})-\d{2}-\d{2}/;
const UK_DATE = /^\d{2}\/\d{2}\/(?<year>\d{4})$/;

/**
 * This deliberately operates in string space as we're dealing in UTC only.
 * Going through new Date(...) starts converting TZs and throws off filters.
 */
export const getYear = (date: string | null): number | null => {
  if (!date) return null;
  const year = (ISO_DATE.exec(date) ?? UK_DATE.exec(date))?.groups?.year;
  return year ? Number(year) : null;
};

export const padNumber = (number: number) => {
  return number >= 10 ? number.toString() : number.toString().padStart(2, "0");
};

export const formatDate = (data: string): [number | "", string, string] => {
  if (!data || data.length === 0) return ["", "", ""];
  const dateObj = new Date(data);
  const year = dateObj.getUTCFullYear();
  const day = padNumber(dateObj.getUTCDate());
  const month = dateObj.getUTCMonth();
  return [year, day, months[month]];
};

export const formatDateShort = (date: Date, language?: string): string => {
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(language || "en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  }).format(date);
};
