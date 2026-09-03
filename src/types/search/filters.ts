import type { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

import { TNestedSearchLabel } from "./labels";

export type TCheckboxState = boolean | "indeterminate";

type TFiltersGroupDrawerConfig = {
  title: string;
  subtitle?: string;
  Icon: LucideIcon;
  afterPartition?: boolean;
  container: "drawer";
  rootLabelTypes: string[];
  prepareRootLabels?: (rootLabels: TNestedSearchLabel[]) => TNestedSearchLabel[];
  filterParentsDefaultOpen?: boolean;
  displayWhenEmpty?: boolean;
  emptyStateRender?: () => ReactNode;
};

type TFiltersGroupPopoverConfig = {
  title: string;
  subtitle?: never;
  Icon?: never;
  afterPartition?: boolean;
  container: "popover" | "datepicker";
  rootLabelTypes: string[];
  prepareRootLabels?: (rootLabels: TNestedSearchLabel[]) => TNestedSearchLabel[];
  filterParentsDefaultOpen?: boolean;
  emptyStateRender?: () => ReactNode;
};

export type TFiltersGroupConfig = TFiltersGroupDrawerConfig | TFiltersGroupPopoverConfig;

export type TFiltersGroup = TFiltersGroupConfig & {
  nestedLabels: TNestedSearchLabel[];
};
