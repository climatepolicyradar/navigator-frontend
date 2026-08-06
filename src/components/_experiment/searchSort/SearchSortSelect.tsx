import { Select } from "@base-ui/react/select";
import { LucideCheck, LucideChevronDown } from "lucide-react";

import { SearchDocumentsSortKey } from "@/api/search";
import { TSortOptionConfig } from "@/types";

const triggerClassName =
  "col-start-1 cols-5:col-start-2 inline-flex h-9 max-w-full min-w-0 items-center justify-between gap-2 rounded-full border border-transparent-regular bg-[canvas] px-4 py-1.5 text-left text-sm font-medium text-neutral-600 select-none transition-colors hover:border-inky-black focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 data-popup-open:border-inky-black";

const popupClassName =
  "max-h-(--available-height) min-w-(--anchor-width) origin-(--transform-origin) overflow-y-auto rounded-lg border border-transparent-regular bg-[canvas] py-1 shadow-lg outline-none transition-[transform,scale,opacity] data-ending-style:scale-95 data-ending-style:opacity-0";

type TProps = {
  sortOptions: TSortOptionConfig[];
  onChange: (value: string) => void;
  value: string;
};

export function SearchSortSelect({ sortOptions, onChange, value }: TProps) {
  return (
    <Select.Root value={value} onValueChange={(v) => onChange(v as SearchDocumentsSortKey)}>
      <Select.Trigger className={triggerClassName}>
        <Select.Value className="truncate">{value === sortOptions[0]?.paramValue ? "Sort" : `Sort: ${value}`}</Select.Value>
        <Select.Icon className="flex shrink-0">
          <LucideChevronDown width={16} height={16} aria-hidden />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner className="outline-hidden z-50" sideOffset={6} align="start" alignItemWithTrigger={false}>
          <Select.Popup className={popupClassName}>
            {sortOptions.map(({ label, paramValue }) => (
              <Select.Item
                key={paramValue}
                value={paramValue}
                className="flex cursor-pointer items-center gap-2 py-2.5 pr-3 pl-2 text-sm font-medium text-neutral-600 outline-none data-highlighted:bg-neutral-50 data-selected:bg-neutral-100"
              >
                <span className="flex w-5 shrink-0 justify-center" aria-hidden>
                  <Select.ItemIndicator>
                    <LucideCheck className="size-4 text-neutral-600" strokeWidth={2.5} />
                  </Select.ItemIndicator>
                </span>
                <Select.ItemText>{label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
