import type { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

import { TNestedSearchLabel } from "./labels";

export type TCheckboxState = boolean | "indeterminate";

type TFiltersGroupGenericConfig = {
  title: string;
  afterPartition?: boolean;
  rootLabelTypes: string[];
  prepareRootLabels?: (rootLabels: TNestedSearchLabel[]) => TNestedSearchLabel[];
  topLevelDefaultOpen?: boolean;
  emptyStateRender?: () => ReactNode;
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
  header?: () => ReactNode;
  Icon?: never;
  subtitle?: never;
};

export type TFiltersGroupConfig = TFiltersGroupDrawerConfig | TFiltersGroupPopoverConfig;

export type TFiltersGroup = TFiltersGroupConfig & {
  nestedLabels: TNestedSearchLabel[];
};
