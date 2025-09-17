import { Menu } from "@base-ui-components/react";
import orderBy from "lodash/orderBy";
import { LucideArrowUpDown, LucideInfo } from "lucide-react";
import { ReactNode, useMemo, useState } from "react";

import { MenuItem } from "@/components/atoms/menu/MenuItem";
import { MenuPopup } from "@/components/atoms/menu/MenuPopup";
import { Tooltip } from "@/components/atoms/tooltip/Tooltip";
import { EN_DASH } from "@/constants/chars";
import { joinTailwindClasses } from "@/utils/tailwind";
import { firstCase } from "@/utils/text";

type TValue = string | number | null;

export interface IInteractiveTableColumn<ColumnKey extends string> {
  classes?: string; // Styles every cell in the column
  fraction?: number; // CSS grid fractional units - the column's relative width
  id: ColumnKey;
  name?: string; // defaults to first-cased id
  sortable?: boolean; // defaults to false
  tooltip?: ReactNode;
}

export type TValueWithDisplay = {
  display: ReactNode;
  value: TValue;
};

export type TInteractiveTableCell = TValue | TValueWithDisplay;

export interface IInteractiveTableRow<ColumnKey extends string> {
  id: string;
  cells: Record<ColumnKey, TInteractiveTableCell>;
  classes?: string; // Styles every cell in the row
}

interface ISortRules<ColumnKey extends string> {
  column: ColumnKey | null;
  ascending: boolean;
}

const renderCellDisplay = (cell: TInteractiveTableCell, showValues: boolean) => {
  if (cell === null) return EN_DASH;

  let content: ReactNode = `${cell}`;
  if (typeof cell === "object") content = showValues ? cell.value : cell.display;
  return showValues ? <div className="inline-block bg-surface-ui text-sm text-text-tertiary font-mono">{content}</div> : content;
};

export interface IProps<ColumnKey extends string> {
  columns: IInteractiveTableColumn<ColumnKey>[];
  defaultSort?: ISortRules<ColumnKey>;
  maxRows?: number;
  rows: IInteractiveTableRow<ColumnKey>[];
  tableClasses?: string;
  scrollable?: boolean; // Adds horizontal padding and overflow scroll
  showValues?: boolean; // Debug mode for understanding sorting
}

export const InteractiveTable = <ColumnKey extends string>({
  columns,
  defaultSort,
  maxRows = 0,
  rows,
  scrollable = true,
  showValues = false,
  tableClasses,
}: IProps<ColumnKey>) => {
  const [openSortMenu, setOpenSortMenu] = useState<string | null>(null);
  const [sortRules, setSortRules] = useState<ISortRules<ColumnKey>>(
    defaultSort || {
      column: null,
      ascending: true,
    }
  );

  const sortedRows = useMemo(() => {
    if (sortRules.column === null) return rows;

    return orderBy(
      rows,
      [
        // null values are always sorted last
        (row) => {
          const cell = row.cells[sortRules.column];
          return cell === null || (typeof cell === "object" && cell.value === null);
        },
        // Sort by value
        (row) => {
          const cell = row.cells[sortRules.column];
          if (cell === null) return "";
          return typeof cell === "object" ? cell.value : cell;
        },
      ],
      ["asc", sortRules.ascending ? "asc" : "desc"]
    );
  }, [rows, sortRules]);
  const displayedRows = sortedRows.slice(0, maxRows || undefined);

  // Track which sort menu is open so header cell styling can stay applied
  const onToggleMenu = (column: ColumnKey) => (open: boolean) => {
    setOpenSortMenu(open ? column : null);
  };

  // Button and menu for controlling column sorting
  const renderSortControls = (column: IInteractiveTableColumn<ColumnKey>) => {
    const columnIsSorted = sortRules.column === column.id;
    const menuIsOpen = openSortMenu === column.id;

    const sortButtonClasses = joinTailwindClasses(
      "p-1 rounded-sm focus-visible:outline-none hover:bg-surface-heavy hover:text-text-tertiary",
      columnIsSorted ? "text-text-brand" : "text-text-tertiary",
      menuIsOpen && "bg-surface-heavy text-text-tertiary", // Hover styling persists
      !columnIsSorted && !menuIsOpen && "invisible group-hover:visible"
    );

    const onSort = (ascending: boolean) => () => setSortRules({ column: column.id, ascending });
    const onClearSort = () => setSortRules({ column: null, ascending: true });

    return (
      <div className="flex-1 text-right">
        <Menu.Root onOpenChange={onToggleMenu(column.id)}>
          <Menu.Trigger className={sortButtonClasses}>
            <LucideArrowUpDown size={16} />
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Backdrop />
            <Menu.Positioner align="start" sideOffset={2}>
              <MenuPopup>
                <MenuItem disabled heading>
                  Sort
                </MenuItem>
                <MenuItem onClick={onSort(true)}>Ascending</MenuItem>
                <MenuItem onClick={onSort(false)}>Descending</MenuItem>
                {columnIsSorted && (
                  <MenuItem color="brand" onClick={onClearSort}>
                    Clear sort
                  </MenuItem>
                )}
              </MenuPopup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </div>
    );
  };

  const scrollableClasses = joinTailwindClasses(scrollable && "-mx-5 px-5 overflow-x-auto");
  const allTableClasses = joinTailwindClasses("grid text-sm text-text-secondary leading-tight", tableClasses);
  const gridTemplateColumns = columns.map((column) => `${column.fraction || 1}fr`).join(" ");

  return (
    <div className={scrollableClasses}>
      <div className={allTableClasses} style={{ gridTemplateColumns }}>
        {/* Heading */}
        <div className="contents">
          {columns.map((column) => {
            const cellClasses = joinTailwindClasses(
              "px-2.5 py-1.5 border-b border-l border-border-light first:border-l-0 text-text-primary font-semibold cursor-default group",
              openSortMenu === column.id ? "bg-surface-ui" : "hover:bg-surface-ui",
              column.classes
            );

            return (
              <div key={`heading-${column.id}`} className={cellClasses}>
                <div className="flex items-center gap-1 min-h-6">
                  <span className="block">{column.name || firstCase(column.id)}</span>
                  {column.tooltip && (
                    <Tooltip content={column.tooltip} popupClasses="text-wrap max-w-[250px]">
                      <LucideInfo size={16} className="text-text-tertiary opacity-50 group-hover:opacity-100" />
                    </Tooltip>
                  )}
                  {column.sortable === true && renderSortControls(column)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rows */}
        {displayedRows.map((row, rowIndex) => {
          const lastRow = rowIndex + 1 === displayedRows.length;

          return (
            <div key={`row-${row.id}`} className="contents">
              {columns.map((column) => {
                const cell = row.cells[column.id];
                const cellClasses = joinTailwindClasses(
                  "px-2.5 py-3 border-l border-border-light first:border-l-0",
                  !lastRow && "border-b",
                  column.classes,
                  row.classes
                );

                return (
                  <div key={`row-${row.id}-${column.id}`} className={cellClasses}>
                    {renderCellDisplay(cell, showValues)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
