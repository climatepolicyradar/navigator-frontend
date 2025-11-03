import { Menu } from "@base-ui-components/react";
import orderBy from "lodash/orderBy";
import { LucideArrowDown, LucideArrowUp, LucideArrowUpDown, LucideIcon, LucideInfo } from "lucide-react";
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

const DEFAULT_SORT_ICONS: Record<TTableOrder, LucideIcon> = {
  asc: LucideArrowDown,
  desc: LucideArrowUp,
};

const renderCellDisplay = (cell: TTableCell, showValues: boolean) => {
  if (cell === null) return <span className="text-gray-500">{EN_DASH}</span>;

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
  showValues?: boolean; // Debug mode for understanding sorting
}

export const InteractiveTable = <ColumnKey extends string>({
  columns,
  defaultSort,
  maxRows = 0,
  rows,
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
      "p-1 rounded-sm focus-visible:outline-none text-gray-500",
      !columnIsSorted && !menuIsOpen && "invisible group-hover:visible"
    );

    let Icon: LucideIcon = LucideArrowUpDown;
    if (columnIsSorted) Icon = sortOptions.find((option) => option.order === sortRules.order)?.icon || DEFAULT_SORT_ICONS[sortRules.order];

    const onSort = (order: TTableOrder) => () => setSortRules({ column: column.id, order });
    const onClearSort = () => setSortRules({ column: null, order: "asc" });

    return (
      <div className="flex-1 text-right">
        <Menu.Root onOpenChange={onToggleMenu(column.id)}>
          <Menu.Trigger className={sortButtonClasses}>
            <Icon size={16} />
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

  const allTableClasses = joinTailwindClasses(
    "grid bg-white border border-gray-300 rounded-md text-table text-gray-700 leading-5 cursor-default",
    tableClasses
  );
  const gridTemplateColumns = columns.map((column) => `${column.fraction || 1}fr`).join(" ");
  const commonCellClasses = "px-4 py-3 not-first:border-l border-gray-300";

  return (
    <div className="-mx-5 px-5 overflow-x-auto">
      <div className={allTableClasses} style={{ gridTemplateColumns }}>
        {/* Heading */}
        <div className="contents">
          {columns.map((column) => {
            const cellClasses = joinTailwindClasses("bg-gray-100 text-gray-900 font-medium group", commonCellClasses, column.classes);

            return (
              <div key={`heading-${column.id}`} className={cellClasses}>
                <div className="flex items-center gap-1 min-h-6">
                  <span className="block">{column.name || firstCase(column.id)}</span>
                  {column.tooltip && (
                    <Tooltip content={column.tooltip} popupClasses="text-wrap max-w-62">
                      <LucideInfo size={16} className="text-gray-500 leading-5" />
                    </Tooltip>
                  )}
                  {column.sortable === true && renderSortControls(column)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rows */}
        {displayedRows.map((row) => (
          <div key={`row-${row.id}`} className="contents group">
            {columns.map((column) => {
              const cell = row.cells[column.id];
              const cellClasses = joinTailwindClasses("border-t group-hover:bg-gray-100", commonCellClasses, column.classes, row.classes);

              return (
                <div key={`row-${row.id}-${column.id}`} className={cellClasses}>
                  {renderCellDisplay(cell, showValues)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
