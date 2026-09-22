import type { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

import { TNestedSearchLabel } from "./labels";

/* Filters */

export type TCheckboxState = boolean | "indeterminate";

/* Filter groups */

export type TFiltersGroupPrep = (rootLabels: TNestedSearchLabel[]) => TNestedSearchLabel[];

type TFiltersGroupGenericConfig = {
  afterPartition?: boolean;
  emptyStateRender?: ReactNode;
  prepareRootLabels?: TFiltersGroupPrep;
  rootLabelTypes: string[];
  title: string;
  topLevelDefaultOpen?: boolean;
};

type TFiltersGroupDrawerConfig = TFiltersGroupGenericConfig & {
  container: "drawer";
  Icon: LucideIcon;
  subtitle?: string;
  displayWhenEmpty?: boolean;
  header?: never;
};

type TFiltersGroupPopoverConfig = TFiltersGroupGenericConfig & {
  container: "popover" | "datepicker";
  header?: ReactNode;
  Icon?: never;
  subtitle?: never;
};

export type TFiltersGroupConfig = TFiltersGroupDrawerConfig | TFiltersGroupPopoverConfig;

export type TFiltersGroup = TFiltersGroupConfig & {
  nestedLabels: TNestedSearchLabel[];
};
