const WINDOW_SIZE = 5;

type PageItem = { type: "page"; page: number } | { type: "ellipsis"; key: string };

export function getPaginationPages(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= WINDOW_SIZE + 2) {
    return Array.from({ length: totalPages }, (_, i) => ({ type: "page" as const, page: i + 1 }));
  }

  let windowStart = Math.max(1, currentPage - Math.floor(WINDOW_SIZE / 2));
  let windowEnd = windowStart + WINDOW_SIZE - 1;

  if (windowEnd > totalPages) {
    windowEnd = totalPages;
    windowStart = totalPages - WINDOW_SIZE + 1;
  }

  const items: PageItem[] = [];

  if (windowStart > 1) {
    items.push({ type: "page", page: 1 });
    if (windowStart > 2) {
      items.push({ type: "ellipsis", key: "start" });
    }
  }

  for (let i = windowStart; i <= windowEnd; i++) {
    items.push({ type: "page", page: i });
  }

  if (windowEnd < totalPages) {
    if (windowEnd < totalPages - 1) {
      items.push({ type: "ellipsis", key: "end" });
    }
    items.push({ type: "page", page: totalPages });
  }

  return items;
}
