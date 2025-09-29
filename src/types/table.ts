import { ReactNode } from "react";

import { IMetadata } from "./display";

export type TTableValue = string | number | null;
export type TTableOrder = "asc" | "desc";

export type TTableSortOption = {
  label: string;
  order: TTableOrder;
};

export type TTableCell = TTableValue | IMetadata;

export type TTableColumn<ColumnKey extends string> = {
  classes?: string; // Styles every cell in the column
  fraction?: number; // CSS grid fractional units - the column's relative width
  id: ColumnKey;
  name?: string; // defaults to first-cased id
  sortable?: boolean; // defaults to false
  sortOptions?: TTableSortOption[]; // defaults to ascending/descending controls
  tooltip?: ReactNode;
};

export type TTableRow<ColumnKey extends string> = {
  id: string;
  cells: Record<ColumnKey, TTableCell>;
  classes?: string; // Styles every cell in the row
};

export type TTableSortRules<ColumnKey extends string> = {
  column: ColumnKey | null;
  order: TTableOrder;
};
