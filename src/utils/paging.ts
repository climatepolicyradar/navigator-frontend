import { PER_PAGE } from "../constants/paging";

export const calculatePageCount = (pageSets: number, maxPages: number) => {
  // Ensure we do not display more pages than we have results for
  return Math.min(Math.ceil((pageSets * PER_PAGE) / PER_PAGE), maxPages);
};
