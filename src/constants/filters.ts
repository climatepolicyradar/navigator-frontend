import { Earth, ListFilter } from "lucide-react";

import { TFiltersGroupConfig } from "@/types";

export const FILTER_GROUPS: TFiltersGroupConfig[] = [
  {
    title: "Filters",
    subtitle: "Choose themes and specific filters to refine your search",
    Icon: ListFilter,
    container: "drawer",
    rootLabelTypes: ["category"],
  },
  {
    title: "Geography",
    subtitle: "Publish location of main document",
    Icon: Earth,
    container: "drawer",
    rootLabelTypes: ["region"],
  },
  {
    title: "Topic",
    container: "popover",
    rootLabelTypes: ["concept"],
    afterPartition: true,
  },
];
