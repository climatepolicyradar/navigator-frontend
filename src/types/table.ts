import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

import { IProps as PageLinkProps } from "@/components/atoms/pageLink/PageLink";

import { IMetadata } from "./display";

export type TTableValue = string | number | null;
export type TTableOrder = "asc" | "desc";

export type TTableSortOption = {
  label: string;
  order: TTableOrder;
  icon?: LucideIcon;
};

export type TTableCell = TTableValue | IMetadata;

export type TTableColumn<ColumnKey extends string> = {
  classes?: string; // Styles every cell in the column
  fraction?: number; // CSS grid fractional units - the column's relative width
  id: ColumnKey;
  name?: ReactNode; // defaults to first-cased id
  sortable?: boolean; // defaults to false
  sortOptions?: TTableSortOption[]; // defaults to ascending/descending controls
  tooltip?: ReactNode;
};

export type TTableRow<ColumnKey extends string> = {
  id: string;
  cells: Record<ColumnKey, TTableCell>;
  classes?: string; // Styles every cell in the row
  onClick?: (row: TTableRow<ColumnKey>) => void; // Row click as an onClick event
  pageLink?: Omit<PageLinkProps, "children"> & { children?: never }; // Row click as a PageLink component wrap
};

export type TTableSortRules<ColumnKey extends string> = {
  column: ColumnKey | null;
  order: TTableOrder;
};
