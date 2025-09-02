import { ISideBarItem } from "@/components/organisms/contentsSideBar/ContentsSideBar";
import { GeographyV2, TTarget } from "@/types";

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

export const getGeographyPageSidebarItems = (geography: GeographyV2, targets: TTarget[]): ISideBarItem[] => {
  const sidebarItems = [
    {
      id: "section-recents",
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

  const idsToRemove: string[] = [];

  if (geography.statistics?.legislative_process) idsToRemove.push("section-legislative-process");
  if (targets.length === 0) idsToRemove.push("section-targets");

  return sidebarItems.filter((item) => !idsToRemove.includes(item.id));
};
