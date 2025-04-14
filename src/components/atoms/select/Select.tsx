import { RefObject } from "react";
import { Select as BaseSelect } from "@base-ui-components/react";
import { LuChevronsUpDown } from "react-icons/lu";

type TSelectOption = {
  label: string;
  value: string;
};

interface SelectProps {
  defaultValue?: string;
  value?: string;
  options?: TSelectOption[];
  onValueChange?: (value: string) => void;
  container?: HTMLElement | RefObject<HTMLElement> | null;
}

export function Select({ defaultValue, value, options, onValueChange, container = null }: SelectProps) {
  const handleValueChange = (value: string) => {
    onValueChange?.(value);
  };

  return (
    <BaseSelect.Root defaultValue={defaultValue} onValueChange={handleValueChange} value={value} alignItemToTrigger={false}>
      <BaseSelect.Trigger className="flex items-center justify-between gap-2 p-2 border border-border-light bg-surface-ui b-1 rounded-sm text-sm m-0 outline-0 select-none cursor-default hover:border-inputSelected active:bg-surface-ui data-popup-open:bg-surface-ui focus:border-inputSelected">
        <BaseSelect.Value placeholder="" />
        <BaseSelect.Icon className="flex">
          <LuChevronsUpDown height="12" width="12" />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal container={container}>
        <BaseSelect.Positioner className="z-50 text-sm min-w-[calc(var(--anchor-width)+4px)]">
          <BaseSelect.ScrollUpArrow className="" />
          <BaseSelect.Popup
            className={`rounded-sm p-1 bg-white outline-1 outline-gray-200 m-h-(--available-height) [data-side="none"]:opacity-1 data-starting-style:opacity-0 data-ending-style:opacity-0`}
          >
            {options?.length > 0 &&
              options.map((option) => (
                <BaseSelect.Item
                  key={option.value}
                  value={option.value}
                  className="text-text-primary bg-white-ui p-2 rounded-sm cursor-default data-highlighted:bg-surface-mono data-highlighted:text-white data-highlighted:outline-inputSelected"
                >
                  <BaseSelect.ItemText className="">{option.label}</BaseSelect.ItemText>
                </BaseSelect.Item>
              ))}
          </BaseSelect.Popup>
          <BaseSelect.ScrollDownArrow className="" />
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
