export interface ISideBarItem {
  id: string;
  display: string;
  badge?: string;
}

export const FAMILY_PAGE_SIDE_BAR_ITEMS: ISideBarItem[] = [
  {
    id: "section-documents",
    display: "Documents",
  },
  {
    id: "section-summary",
    display: "Summary",
  },
  {
    id: "section-targets",
    display: "Targets",
  },
  {
    id: "section-collection",
    display: "Collection",
  },
  {
    id: "section-topics",
    display: "Topics",
    badge: "Experimental",
  },
  {
    id: "section-data",
    display: "Get the data",
  },
  {
    id: "section-download",
    display: "Download documents",
  },
  {
    id: "section-notes",
    display: "Citation & Notes",
  },
];
