import { ISideBarItem } from "@/components/organisms/contentsSideBar/ContentsSideBar";

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
  // {
  //   id: "section-debug",
  //   display: "Debug",
  // },
];

type TProps = Record<"isCountry" | "legislativeProcess" | "metadata" | "subdivisions" | "targets", boolean>;

export const getGeographyPageSidebarItems = (settings: TProps): ISideBarItem[] => {
  const sidebarItems = [
    {
      id: "section-recents",
      display: "Recent documents",
    },
    {
      id: "section-subdivisions",
      display: settings.isCountry ? "Geographic sub-divisions" : "Related geographic sub-divisions",
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
    // {
    //   id: "section-debug",
    //   display: "Debug",
    //   badge: "Developer",
    // },
  ];

  const idsToRemove: string[] = [];

  // Remove rather than add so that there is a full ordered list defined above
  if (!settings.subdivisions) idsToRemove.push("section-subdivisions");
  if (!settings.metadata) idsToRemove.push("section-statistics");
  if (!settings.targets) idsToRemove.push("section-targets");
  if (!settings.legislativeProcess) idsToRemove.push("section-legislative-process");

  return sidebarItems.filter((item) => !idsToRemove.includes(item.id));
};
