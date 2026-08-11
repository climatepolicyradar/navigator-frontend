const MAX_PAGES_WIDE = 11;
const MAX_PAGES_NARROW = 5;

export type TPaginationItem = { type: "page"; page: number } | { type: "ellipsis"; page?: never };

const getEllipsis = (): TPaginationItem => ({ type: "ellipsis" });
const getPage = (page: number): TPaginationItem => ({ type: "page", page });
const getPageRange = (start: number, end: number): TPaginationItem[] => Array.from({ length: end - start + 1 }, (_, index) => getPage(start + index));

export const getPaginationPages = (totalPages: number, currentPage: number, wide: boolean = false): TPaginationItem[] => {
  const maxPages = wide ? MAX_PAGES_WIDE : MAX_PAGES_NARROW;

  if (totalPages <= maxPages) return getPageRange(1, totalPages);

  const half = (maxPages - 5) / 2;
  const edgeWindowSize = maxPages - 2;
  const startCutoff = (maxPages + 1) / 2;
  const endCutoff = totalPages - (maxPages - 1) / 2;

  if (currentPage <= startCutoff) {
    return [...getPageRange(1, edgeWindowSize), getEllipsis(), getPage(totalPages)];
  }

  if (currentPage >= endCutoff) {
    return [getPage(1), getEllipsis(), ...getPageRange(totalPages - edgeWindowSize + 1, totalPages)];
  }

  return [getPage(1), getEllipsis(), ...getPageRange(currentPage - half, currentPage + half), getEllipsis(), getPage(totalPages)];
};
