import { useMemo, useState } from "react";

import { Checkbox } from "@/components/atoms/checkbox/Checkbox";
import { Input } from "@/components/atoms/input/Input";
import { TSearchLabel, TSearchQueryGroup, isRule } from "@/types";

function getCheckedIds(group: TSearchQueryGroup | null | undefined): string[] {
  if (!group) return [];
  return group.filters.flatMap((f) => (isRule(f) ? [f.value] : getCheckedIds(f))).filter(Boolean);
}

const buildFilterGroup = (checkedLabelIds: string[]): TSearchQueryGroup => ({
  op: "or",
  filters: checkedLabelIds.map((id) => ({ field: "labels.value.id" as const, op: "contains" as const, value: id })),
});

type TProps = {
  activeFilters?: TSearchQueryGroup | null;
  onFiltersChange: (group: TSearchQueryGroup) => void;
  options?: TSearchLabel[];
};

export const FilterPanel = ({ options, activeFilters, onFiltersChange }: TProps) => {
  const [search, setSearch] = useState("");

  const checkedIds = useMemo(() => new Set(getCheckedIds(activeFilters)), [activeFilters]);

  const filteredOptions = useMemo(
    () => options?.filter((option) => option.value.toLowerCase().includes(search.toLowerCase())) ?? [],
    [options, search]
  );

  const renderCheckboxRow = (option: TSearchLabel) => (
    <li key={option.id}>
      <Checkbox
        checked={checkedIds.has(option.id)}
        onCheckedChange={(nextChecked) => {
          const updatedIds = nextChecked === true ? [...checkedIds, option.id] : [...checkedIds].filter((id) => id !== option.id);
          onFiltersChange(updatedIds.length > 0 ? buildFilterGroup(updatedIds) : null);
        }}
      >
        {option.value}
      </Checkbox>
    </li>
  );

  return (
    <div>
      <Input
        autoComplete="off"
        clearable
        color="mono"
        containerClasses="mb-4"
        onChange={(e) => setSearch(e.currentTarget.value)}
        onClear={() => setSearch("")}
        name="Quick search"
        placeholder="Quick search"
        value={search}
      />
      <div className="max-h-[60dvh] overflow-y-auto">
        <ul className="flex flex-col gap-1 text-inky-black">{filteredOptions.map(renderCheckboxRow)}</ul>
      </div>
    </div>
  );
};
