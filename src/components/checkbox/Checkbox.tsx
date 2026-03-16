import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { CheckIcon } from "lucide-react";

export const Checkbox = ({ label, checked, onChange }: { label: string; checked?: boolean; onChange?: (checked: boolean) => void }) => {
  return (
    <label className="flex items-center gap-2 text-base text-gray-900">
      <BaseCheckbox.Root
        className="flex size-4 items-center justify-center rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 data-checked:bg-brand data-unchecked:border data-unchecked:border-gray-300"
        checked={checked}
        onCheckedChange={onChange}
      >
        <BaseCheckbox.Indicator className="flex text-gray-50 data-unchecked:hidden">
          <CheckIcon className="size-3" />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {label}
    </label>
  );
};
