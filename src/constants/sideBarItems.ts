export interface ISideBarItem {
  id: string;
  display: string;
  badge?: string;
  order?: number;
}

export const FAMILY_PAGE_SIDE_BAR_ITEMS: ISideBarItem[] = [
  {
    id: "section-documents",
    display: "Documents",
    order: 1,
  },
  {
    id: "section-summary",
    display: "Summary",
    order: 2,
  },
  {
    id: "section-targets",
    display: "Targets",
    order: 3,
  },
  {
    id: "section-collection",
    display: "Collection",
    order: 4,
  },
  {
    id: "section-topics",
    display: "Topics",
    badge: "Experimental",
  },
  {
    id: "section-data",
    display: "Get the data",
    order: 6,
  },
  {
    id: "section-download",
    display: "Download documents",
    order: 7,
  },
  {
    id: "section-notes",
    display: "Citation & Notes",
    order: 8,
  },
];

export const FAMILY_PAGE_SIDE_BAR_ITEMS_SORTED = FAMILY_PAGE_SIDE_BAR_ITEMS.slice().sort((a, b) => {
  if (a.order === undefined && b.order === undefined) return 0;
  if (a.order === undefined) return 1;
  if (b.order === undefined) return -1;
  return a.order - b.order;
});
