import { ISideBarItem } from "@/components/organisms/contentsSideBar/ContentsSideBar";
import { TGeographyStats } from "@/types";

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
    id: "section-metadata",
    display: "About",
  },
  {
    id: "section-debug",
    display: "Debug",
    badge: "Developer",
  },
];

export const getGeographyPageSidebarItems = (geography: TGeographyStats): ISideBarItem[] => {
  const sidebarItems = [
    {
      id: "section-recent-documents",
      display: "Recent documents",
    },
    {
      id: "section-subdivisions",
      display: "Geographic sub-divisions",
    },
    {
      id: "section-statistics",
      display: "Statistics",
    },
    {
      id: "section-targets",
      display: "Targets",
    },
    {
      id: "section-legislative-process",
      display: "Legislative process",
    },
    {
      id: "section-debug",
      display: "Debug",
      badge: "Developer",
    },
  ];

  if (geography.legislative_process.length === 0) {
    sidebarItems.splice(4, 1);
  }

  return sidebarItems;
};
