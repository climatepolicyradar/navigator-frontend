import type { LucideIcon } from "lucide-react";

import { TNestedSearchLabel } from "./labels";

export type TCheckboxState = boolean | "indeterminate";

export type TFiltersGroupConfig = {
  title: string;
  Icon?: LucideIcon;
  container: "drawer" | "popover";
  rootLabelTypes: string[];
  afterPartition?: boolean;
};

export type TFiltersGroup = TFiltersGroupConfig & {
  nestedLabels: TNestedSearchLabel[];
};
