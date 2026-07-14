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

type TFilterDisplay = {
  label?: string;
  description?: string;
};

export const FILTER_DISPLAY: Record<string, TFilterDisplay> = {
  "category::Corporate Disclosure": {
    description: "Incl. type and author",
  },
  "category::Law": {
    description: "Incl. response area and framework",
  },
  "category::Litigation": {
    description: "Incl. case category, jurisdiction, and principal law",
  },
  "category::Multilateral Climate Fund project": {
    description: "",
  },
  "category::Policy": {
    description: "Incl. response area",
  },
  "category::Report": {
    description: "Incl. climate council and industry reports",
  },
  "category::UN submission": {
    description: "Incl. convention and type",
  },
};
