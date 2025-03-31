import { Select as BaseSelect } from "@base-ui-components/react";

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
      <BaseSelect.Trigger className="flex items-center justify-between gap-2 p-2 border border-gray-200 b-1 rounded-sm text-sm m-0 outline-0 select-none cursor-default hover:bg-gray-50 hover:border-inputSelected active:bg-gray-100 data-popup-open:bg-gray-100">
        <BaseSelect.Value placeholder="" />
        <BaseSelect.Icon className="flex">
          <ChevronUpDownIcon />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner className="z-50 text-sm w-(--anchor-width)">
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
                  className="bg-white p-2 rounded-sm cursor-default data-highlighted:bg-gray-100 data-highlighted:text-textDark"
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

function ChevronUpDownIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentcolor" strokeWidth="1.5" {...props}>
      <path d="M0.5 4.5L4 1.5L7.5 4.5" />
      <path d="M0.5 7.5L4 10.5L7.5 7.5" />
    </svg>
  );
}
