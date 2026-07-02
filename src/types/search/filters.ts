import type { LucideIcon } from "lucide-react";

import { TNestedSearchLabel } from "./labels";

export type TCheckboxState = boolean | "indeterminate";

type TFiltersGroupDrawerConfig = {
  title: string;
  subtitle?: string;
  Icon: LucideIcon;
  container: "drawer";
  rootLabelTypes: string[];
  afterPartition?: boolean;
};

type TFiltersGroupPopoverConfig = {
  title: string;
  subtitle?: never;
  Icon?: never;
  container: "popover";
  rootLabelTypes: string[];
  afterPartition?: boolean;
};

export type TFiltersGroupConfig = TFiltersGroupDrawerConfig | TFiltersGroupPopoverConfig;

export type TFiltersGroup = TFiltersGroupConfig & {
  nestedLabels: TNestedSearchLabel[];
};
