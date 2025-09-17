import { TSingularAndPlural } from "@/types";

export const pluralise = (count: number, [singular, plural]: TSingularAndPlural) => {
  return count === 1 ? singular : plural;
};
