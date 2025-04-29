import { orderBy } from "lodash";
import { ReactNode, useMemo, useState } from "react";
import { LuMoveVertical } from "react-icons/lu";

type SortableTableColumn<ColumnKey extends string> = {
  id: ColumnKey;
  name: string;
  sortable?: boolean;
};

type SortableTableCell =
  | number
  | string
  | {
      display: ReactNode;
      value: number | string;
    };

type SortRules<ColumnKey extends string> = {
  key: ColumnKey | null;
  ascending: boolean;
};

type SortableTableProps<ColumnKey extends string> = {
  defaultSort?: SortRules<ColumnKey>;
  columns: SortableTableColumn<ColumnKey>[];
  rows: Record<ColumnKey, SortableTableCell>[];
};

// See Storybook stories for an example of how ColumnKey determines the shape of the row objects
export const SortableTable = <ColumnKey extends string>({ columns, defaultSort, rows }: SortableTableProps<ColumnKey>) => {
  const [sortRules, setSortRules] = useState<SortRules<ColumnKey>>(
    defaultSort || {
      key: null,
      ascending: true,
    }
  );

  const sortedRows = useMemo(() => {
    if (sortRules.key === null) return rows;

    return orderBy(
      rows,
      [
        (row) => {
          const cell = row[sortRules.key];
          const sortValue = typeof cell === "object" ? cell.value : cell;
          return sortValue;
        },
      ],
      [sortRules.ascending ? "asc" : "desc"]
    );
  }, [rows, sortRules]);

  const onSort = (columnKey: ColumnKey) => {
    if (sortRules.key !== columnKey) {
      setSortRules({ key: columnKey, ascending: true });
    } else {
      setSortRules((currentValue) => ({
        ...currentValue,
        ascending: !currentValue.ascending,
      }));
    }
  };

  const cellClasses = "border px-2 py-1";

  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <td key={`heading-${column.id}`} className={cellClasses}>
              <div className="flex flex-nowrap gap-1 items-center">
                {column.name}
                {column.sortable && <LuMoveVertical height="16" width="16" onClick={() => onSort(column.id)} />}
              </div>
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedRows.map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            {columns.map((column) => {
              const cell = row[column.id];
              const cellDisplay = typeof cell === "object" ? cell.display : `${cell}`;

              return (
                <td key={`row-${rowIndex}-${column.id}`} className={cellClasses}>
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
