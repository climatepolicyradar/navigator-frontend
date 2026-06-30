import { Earth, ListFilter } from "lucide-react";

import { TFiltersGroupConfig } from "@/types";

export const FILTER_GROUPS: TFiltersGroupConfig[] = [
  {
    title: "Filters",
    Icon: ListFilter,
    container: "drawer",
    rootLabelTypes: ["category"],
  },
  {
    title: "Geography",
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
