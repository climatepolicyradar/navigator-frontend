import { ISideBarItem } from "@/components/organisms/contentsSideBar/ContentsSideBar";
import { IMetadata, TGeographyStats, TMetadata, TTarget } from "@/types";

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

export const getGeographyPageSidebarItems = (geographyMetadata: IMetadata[], targets: TTarget[], legislativeProcess: string): ISideBarItem[] => {
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

  if (geographyMetadata.length === 0) idsToRemove.push("section-statistics");
  if (targets.length === 0) idsToRemove.push("section-targets");
  if (legislativeProcess.length === 0) idsToRemove.push("section-legislative-process");

  return sidebarItems.filter((item) => !idsToRemove.includes(item.id));
};
