import { Select } from "@base-ui/react/select";
import { LucideCheck, LucideChevronDown } from "lucide-react";

import type { SearchDocumentsSortKey } from "@/api/search";

type TProps = {
  value: SearchDocumentsSortKey;
  onChange: (value: SearchDocumentsSortKey) => void;
};

const SORT_ITEMS: { value: SearchDocumentsSortKey; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "recent", label: "Most recent" },
  { value: "oldest", label: "Oldest" },
  { value: "title_asc", label: "A–Z" },
  { value: "title_desc", label: "Z–A" },
];

/**
 * Trigger label per APP-1891: plain "Sort" for relevance, else "Sort: …".
 *
 * @param value - Current sort key
 * @returns Text shown on the closed control
 */
function triggerLabel(value: SearchDocumentsSortKey): string {
  if (value === "relevance") {
    return "Sort";
  }
  const item = SORT_ITEMS.find((i) => i.value === value);
  return item ? `Sort: ${item.label}` : "Sort";
}

/** Shadow SERP sort control — pill trigger, list with check on active row (APP-1891). */
export function SearchSortSelect({ value, onChange }: TProps) {
  return (
    <div className="flex items-center text-sm font-medium text-neutral-600">
      <Select.Root value={value} onValueChange={(v) => onChange(v as SearchDocumentsSortKey)}>
        <Select.Trigger className="inline-flex h-9 max-w-full min-w-0 items-center justify-between gap-2 rounded-full border border-transparent-regular bg-[canvas] px-4 py-1.5 text-left text-sm font-medium text-neutral-600 shadow-none select-none transition-colors hover:border-inky-black focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 data-popup-open:border-inky-black">
          <Select.Value className="truncate">{triggerLabel(value)}</Select.Value>
          <Select.Icon className="flex shrink-0 text-neutral-600">
            <LucideChevronDown width={16} height={16} aria-hidden />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner className="outline-hidden z-50" sideOffset={6} align="start" alignItemWithTrigger={false}>
            <Select.Popup className="max-h-(--available-height) min-w-[calc(var(--anchor-width)+0.5rem)] origin-(--transform-origin) overflow-y-auto rounded-lg border border-transparent-regular bg-[canvas] py-1 shadow-lg shadow-gray-200/80 outline-none transition-[transform,scale,opacity] data-ending-style:scale-95 data-ending-style:opacity-0">
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
    </div>
  );
}
