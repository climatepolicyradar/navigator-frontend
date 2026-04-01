import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { CheckIcon } from "lucide-react";

type CheckboxProps = {
  label: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
};

export const Checkbox = ({ label, checked, disabled = false, onChange }: CheckboxProps) => {
  // BaseUI checkbox doesn’t call `onCheckedChange` with a plain boolean - it can pass `true`, `false`, or
  // the string `"indeterminate"`.
  // This wrapper allows us to block events when the checkbox is disabled, and convert BaseUI's value to a
  // real boolean before handing it to the rest of your code.
  const handleChange = (next: boolean | "indeterminate") => {
    if (disabled) return;
    onChange?.(next === true);
  };

  return (
    <label
      className={[
        "flex items-center gap-2 rounded-sm px-1 py-0.5",
        disabled
          ? "cursor-not-allowed opacity-50 bg-neutral-100 text-neutral-400"
          : "cursor-pointer bg-transparent text-gray-900 hover:bg-neutral-100",
      ].join(" ")}
    >
      <BaseCheckbox.Root
        className="flex size-4 items-center justify-center rounded-xs shrink-0 self-start mt-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 data-checked:bg-inky-black data-unchecked:border data-unchecked:border-gray-300"
        checked={checked}
        disabled={disabled}
        onCheckedChange={handleChange}
      >
        <BaseCheckbox.Indicator className="flex text-gray-50 data-unchecked:hidden">
          <CheckIcon className="size-3" />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {label}
    </label>
  );
};
