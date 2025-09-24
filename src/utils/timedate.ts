import { months } from "../constants/timedate";

export const convertDate = (data: string): [number, string, string] => {
  if (!data || data.length === 0) return [0, "", ""];
  let dateObj = new Date(data);
  if (data.length === 10) {
    const [day, month, year] = data.split("/");
    dateObj = new Date(`${month}-${day}-${year}`);
  }
  const year = dateObj.getUTCFullYear();
  const day = padNumber(dateObj.getUTCDate());
  const month = dateObj.getUTCMonth();
  return [year, day, months[month]?.substring(0, 3)];
};

export const padNumber = (number) => {
  return number >= 10 ? number : number.toString().padStart(2, "0");
};

export const formatDate = (data: string) => {
  if (!data || data.length === 0) return ["", "", ""];
  const dateObj = new Date(data);
  const year = dateObj.getUTCFullYear();
  const day = padNumber(dateObj.getUTCDate());
  const month = dateObj.getUTCMonth();
  return [year, day, months[month]];
};

export const formatDateShort = (date: Date): string => {
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(navigator?.language ?? "en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};
