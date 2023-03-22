import { months } from "../constants/timedate";

export const convertDate = (data: string): [number, string, string] => {
  if (data.length === 0) return [0, "", ""];
  let dateObj = new Date(data);
  if (data.length === 10) {
    const [day, month, year] = data.split("/");
    dateObj = new Date(`${month}-${day}-${year}`);
  }
  const year = dateObj.getFullYear();
  const day = padNumber(dateObj.getDate());
  const month = dateObj.getMonth();
  return [year, day, months[month]?.substring(0, 3)];
};

export const padNumber = (number) => {
  return number >= 10 ? number : number.toString().padStart(2, "0");
};

export const formatDate = (data: string) => {
  const dateObj = new Date(data);
  const year = dateObj.getFullYear();
  const day = padNumber(dateObj.getDate());
  const month = dateObj.getMonth();
  return [year, day, months[month]];
};
