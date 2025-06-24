import orderBy from "lodash/orderBy";
import { LucideArrowUpDown, LucideInfo } from "lucide-react";
import { ReactNode, useMemo, useState } from "react";

import { Tooltip } from "@/components/atoms/tooltip/Tooltip";
import { joinTailwindClasses } from "@/utils/tailwind";

type TValue = string | number;

interface IInteractiveTableColumn<ColumnKey extends string> {
  id: ColumnKey;
  name: string;
  sortable?: boolean;
  tooltip?: ReactNode;
}

export type TInteractiveTableCell =
  | TValue
  | {
      display: ReactNode;
      value: TValue;
    };

interface IInteractiveTableRow<ColumnKey extends string> {
  id: string;
  cells: Record<ColumnKey, TInteractiveTableCell>;
}

interface ISortRules<ColumnKey extends string> {
  column: ColumnKey | null;
  ascending: boolean;
}

interface IProps<ColumnKey extends string> {
  columns: IInteractiveTableColumn<ColumnKey>[];
  defaultSort?: ISortRules<ColumnKey>;
  rows: IInteractiveTableRow<ColumnKey>[];
}

export const InteractiveTable = <ColumnKey extends string>({ columns, defaultSort, rows }: IProps<ColumnKey>) => {
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
        (row) => {
          const cell = row.cells[sortRules.column];
          return typeof cell === "object" ? cell.value : cell;
        },
      ],
      [sortRules.ascending ? "asc" : "desc"]
    );
  }, [rows, sortRules]);

  return (
    <table className="w-full text-sm text-text-secondary leading-tight">
      {/* Heading */}
      <thead className="text-text-primary font-semibold">
        <tr className="border-b border-border-light">
          {columns.map((column) => {
            const columnIsSorted = sortRules.column === column.id;
            const buttonClasses = joinTailwindClasses(
              "p-1 rounded-sm text-text-tertiary hover:bg-surface-heavy",
              columnIsSorted ? "[&:not(:hover)]:text-text-brand" : "invisible group-hover:visible"
            );

            return (
              <td
                key={`heading-${column.id}`}
                className="px-2.5 py-1.5 border-l border-border-light first:border-l-0 cursor-default group hover:bg-surface-ui"
              >
                <div className="flex items-center gap-1">
                  <span className="block">{column.name}</span>
                  {column.tooltip && (
                    <Tooltip content={column.tooltip} popupClasses="text-wrap max-w-[250px]">
                      <LucideInfo size={16} className="text-text-tertiary opacity-50 group-hover:opacity-100" />
                    </Tooltip>
                  )}
                  {/* Sort button */}
                  {column.sortable && (
                    <div className="flex-1 text-right">
                      <Tooltip content="Sort">
                        <button type="button" className={buttonClasses}>
                          <LucideArrowUpDown size={16} />
                        </button>
                      </Tooltip>
                    </div>
                  )}
                </div>
              </td>
            );
          })}
        </tr>
      </thead>
      {/* Rows */}
      <tbody>
        {sortedRows.map((row) => (
          <tr key={`row-${row.id}`} className="border-b border-border-light">
            {columns.map((column) => {
              const cell = row.cells[column.id];
              const cellDisplay = typeof cell === "object" ? cell.display : `${cell}`;

              return (
                <td key={`row-${row.id}-${column.id}`} className="px-2.5 py-3 border-l border-border-light first:border-l-0">
                  {cellDisplay}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
