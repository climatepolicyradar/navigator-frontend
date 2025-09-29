import { Menu } from "@base-ui-components/react";
import orderBy from "lodash/orderBy";
import { LucideArrowUpDown, LucideInfo } from "lucide-react";
import { ReactNode, useMemo, useState } from "react";

import { MenuItem } from "@/components/atoms/menu/MenuItem";
import { MenuPopup } from "@/components/atoms/menu/MenuPopup";
import { Tooltip } from "@/components/atoms/tooltip/Tooltip";
import { EN_DASH } from "@/constants/chars";
import { TTableCell, TTableColumn, TTableOrder, TTableRow, TTableSortOption, TTableSortRules } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";
import { firstCase } from "@/utils/text";

const DEFAULT_SORT_OPTIONS: TTableSortOption[] = [
  { order: "asc", label: "Ascending" },
  { order: "desc", label: "Descending" },
];

const renderCellDisplay = (cell: TTableCell, showValues: boolean) => {
  if (cell === null) return EN_DASH;

  let content: ReactNode = `${cell}`;
  if (typeof cell === "object") content = showValues ? cell.value : cell.label;
  return showValues ? <div className="inline-block bg-surface-ui text-sm text-text-tertiary font-mono">{content}</div> : content;
};

export interface IProps<ColumnKey extends string> {
  columns: TTableColumn<ColumnKey>[];
  defaultSort?: TTableSortRules<ColumnKey>;
  maxRows?: number;
  rows: TTableRow<ColumnKey>[];
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
  const [sortRules, setSortRules] = useState<TTableSortRules<ColumnKey>>(
    defaultSort || {
      column: null,
      order: "asc",
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
      ["asc", sortRules.order]
    );
  }, [rows, sortRules]);
  const displayedRows = sortedRows.slice(0, maxRows || undefined);

  // Track which sort menu is open so header cell styling can stay applied
  const onToggleMenu = (column: ColumnKey) => (open: boolean) => {
    setOpenSortMenu(open ? column : null);
  };

  // Button and menu for controlling column sorting
  const renderSortControls = (column: TTableColumn<ColumnKey>) => {
    const columnIsSorted = sortRules.column === column.id;
    const sortOptions = column.sortOptions || DEFAULT_SORT_OPTIONS;
    const menuIsOpen = openSortMenu === column.id;

    const sortButtonClasses = joinTailwindClasses(
      "p-1 rounded-sm focus-visible:outline-none hover:bg-surface-heavy hover:text-text-tertiary",
      columnIsSorted ? "text-text-brand" : "text-text-tertiary",
      menuIsOpen && "bg-surface-heavy text-text-tertiary", // Hover styling persists
      !columnIsSorted && !menuIsOpen && "invisible group-hover:visible"
    );

    const onSort = (order: TTableOrder) => () => setSortRules({ column: column.id, order });
    const onClearSort = () => setSortRules({ column: null, order: "asc" });

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
                {sortOptions.map(({ label, order }) => (
                  <MenuItem key={label} onClick={onSort(order)}>
                    {label}
                  </MenuItem>
                ))}
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
