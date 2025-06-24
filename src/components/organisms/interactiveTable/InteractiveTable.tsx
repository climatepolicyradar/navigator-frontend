import orderBy from "lodash/orderBy";
import { LucideArrowUpDown } from "lucide-react";
import { ReactNode, useMemo, useState } from "react";

type TValue = string | number;

interface IInteractiveTableColumn<ColumnKey extends string> {
  id: ColumnKey;
  name: string;
  sortable?: boolean;
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
          {columns.map((column) => (
            <td
              key={`heading-${column.id}`}
              className="px-2.5 py-1.5 border-l border-border-light first:border-l-0 cursor-default group hover:bg-surface-ui"
            >
              <div className="flex items-center">
                <span className="block flex-1">{column.name}</span>
                {/* Sort button */}
                {column.sortable && (
                  <button type="button" className="p-1 rounded-sm text-text-tertiary hover:bg-surface-heavy invisible group-hover:visible">
                    <LucideArrowUpDown size={16} />
                  </button>
                )}
              </div>
            </td>
          ))}
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
