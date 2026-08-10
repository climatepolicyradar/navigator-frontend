import { Select } from "@base-ui/react/select";
import { LucideCheck, LucideChevronDown } from "lucide-react";

import { joinTailwindClasses } from "@/utils/tailwind";

export type TSortOption<SortId extends string> = {
  id: SortId;
  label: string;
};

interface IProps<SortId extends string> {
  defaultId?: SortId;
  label?: string;
  onValueChange: (value: SortId) => void;
  options: TSortOption<SortId>[];
  triggerClasses?: string;
  value: SortId;
}

export const Sort = <SortId extends string>({ defaultId, label = "Sort", onValueChange, options, triggerClasses, value }: IProps<SortId>) => {
  const selectedOption = options.find((option) => option.id === value);
  // The label alone reads as a prompt to sort; only name the option once the user has moved off the default.
  const triggerLabel = !selectedOption || selectedOption.id === defaultId ? label : `${label}: ${selectedOption.label}`;

  const allTriggerClasses = joinTailwindClasses(
    "inline-flex h-9 max-w-full min-w-0 items-center justify-between gap-2 rounded-full border border-border-normal bg-white px-4 py-1.5 text-left text-sm font-medium text-text-primary select-none transition-colors focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 data-popup-open:bg-bg-flat",
    triggerClasses
  );

  return (
    <Select.Root value={value} onValueChange={(newValue) => onValueChange(newValue as SortId)}>
      <Select.Trigger className={allTriggerClasses}>
        <Select.Value className="truncate">{triggerLabel}</Select.Value>
        <Select.Icon className="flex shrink-0">
          <LucideChevronDown width={16} height={16} aria-hidden />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner className="outline-hidden z-50" sideOffset={6} align="start" alignItemWithTrigger={false}>
          <Select.Popup className="max-h-(--available-height) min-w-(--anchor-width) origin-(--transform-origin) overflow-y-auto rounded-lg border border-border-normal bg-white py-1 shadow-lg outline-none transition-[transform,scale,opacity] data-ending-style:scale-95 data-ending-style:opacity-0">
            {options.map((option) => (
              <Select.Item
                key={option.id}
                value={option.id}
                className="flex cursor-pointer items-center gap-2 py-2.5 pr-3 pl-2 text-sm font-medium text-text-primary outline-none data-highlighted:bg-neutral-50 data-selected:bg-neutral-100"
              >
                <span className="flex w-5 shrink-0 justify-center" aria-hidden>
                  <Select.ItemIndicator>
                    <LucideCheck className="size-4 text-neutral-600" strokeWidth={2.5} />
                  </Select.ItemIndicator>
                </span>
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
};
