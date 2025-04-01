import { Select as BaseSelect } from "@base-ui-components/react";
import { LuChevronsUpDown } from "react-icons/lu";

interface SelectProps {
  defaultValue?: string;
  value?: string;
  options?: string[];
  onValueChange?: (value: string) => void;
}

export function Select({ defaultValue, value, options, onValueChange }: SelectProps) {
  const handleValueChange = (value: string) => {
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <BaseSelect.Root defaultValue={defaultValue} onValueChange={handleValueChange} value={value}>
      <BaseSelect.Trigger className="flex items-center justify-between gap-2 p-2 border border-surface-ui bg-surface-ui b-1 rounded-sm text-sm m-0 outline-0 select-none cursor-default hover:border-inputSelected active:bg-surface-ui data-popup-open:bg-surface-ui">
        <BaseSelect.Value placeholder="" />
        <BaseSelect.Icon className="flex">
          <LuChevronsUpDown height="12" width="12" />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner className="z-50 text-sm min-w-[calc(var(--anchor-width)+4px)]">
          <BaseSelect.ScrollUpArrow className="" />
          <BaseSelect.Popup
            className={`rounded-sm p-1 bg-white outline-1 outline-gray-200 m-h-(--available-height) [data-side="none"]:opacity-1 data-starting-style:opacity-0 data-ending-style:opacity-0`}
          >
            {options &&
              options.length > 0 &&
              options.map((option) => (
                <BaseSelect.Item
                  key={option}
                  value={option}
                  className="text-text-primary bg-white-ui p-2 rounded-sm cursor-default data-highlighted:bg-surface-mono data-highlighted:text-white"
                >
                  <BaseSelect.ItemText className="">{option}</BaseSelect.ItemText>
                </BaseSelect.Item>
              ))}
          </BaseSelect.Popup>
          <BaseSelect.ScrollDownArrow className="" />
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
