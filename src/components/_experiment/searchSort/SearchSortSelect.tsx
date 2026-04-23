import { Select } from "@base-ui/react/select";
import { LucideCheck, LucideChevronDown } from "lucide-react";

import { SearchDocumentsSortKey } from "@/api/search";

type TProps = {
  sortParam: SearchDocumentsSortKey;
  onChange: (value: SearchDocumentsSortKey) => void;
};

const SORT_ITEMS: { value: SearchDocumentsSortKey; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "recent", label: "Most recent" },
  { value: "oldest", label: "Oldest" },
  { value: "title_asc", label: "A–Z" },
  { value: "title_desc", label: "Z–A" },
];

function triggerLabel(value: SearchDocumentsSortKey): string {
  if (value === "relevance") {
    return "Sort";
  }
  const item = SORT_ITEMS.find((i) => i.value === value);
  return item ? `Sort: ${item.label}` : "Sort";
}

const triggerClassName =
  "inline-flex h-9 max-w-full min-w-0 items-center justify-between gap-2 rounded-full border border-transparent-regular bg-[canvas] px-4 py-1.5 text-left text-sm font-medium text-neutral-600 select-none transition-colors hover:border-inky-black focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 data-popup-open:border-inky-black";

const popupClassName =
  "max-h-(--available-height) min-w-(--anchor-width) origin-(--transform-origin) overflow-y-auto rounded-lg border border-transparent-regular bg-[canvas] py-1 shadow-lg outline-none transition-[transform,scale,opacity] data-ending-style:scale-95 data-ending-style:opacity-0";

export function SearchSortSelect({ sortParam, onChange }: TProps) {
  return (
    <Select.Root value={sortParam} onValueChange={(v) => onChange(v as SearchDocumentsSortKey)}>
      <Select.Trigger className={triggerClassName}>
        <Select.Value className="truncate">{triggerLabel(sortParam)}</Select.Value>
        <Select.Icon className="flex shrink-0">
          <LucideChevronDown width={16} height={16} aria-hidden />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner className="outline-hidden z-50" sideOffset={6} align="start" alignItemWithTrigger={false}>
          <Select.Popup className={popupClassName}>
            {SORT_ITEMS.map((item) => (
              <Select.Item
                key={item.value}
                value={item.value}
                className="flex cursor-pointer items-center gap-2 py-2.5 pr-3 pl-2 text-sm font-medium text-neutral-600 outline-none data-highlighted:bg-neutral-50 data-selected:bg-neutral-100"
              >
                <span className="flex w-5 shrink-0 justify-center" aria-hidden>
                  <Select.ItemIndicator>
                    <LucideCheck className="size-4 text-neutral-600" strokeWidth={2.5} />
                  </Select.ItemIndicator>
                </span>
                <Select.ItemText>{item.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
