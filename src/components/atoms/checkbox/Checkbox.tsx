import { Checkbox as BaseCheckbox } from "@base-ui/react";
import { Check, Minus } from "lucide-react";

import { joinTailwindClasses } from "@/utils/tailwind";

export type TCheckboxState = boolean | "indeterminate";

interface IProps extends BaseCheckbox.Root.Props {
  className?: string;
  label: string;
  onCheckedChange: (value: TCheckboxState) => void;
}

export const Checkbox = ({ className, label, ...rootProps }: IProps) => {
  const labelClasses = joinTailwindClasses(
    "flex gap-3 items-center text-table leading-5",
    rootProps.disabled ? "text-text-tertiary cursor-not-allowed" : "text-text-primary cursor-pointer",
    className
  );
  const rootClasses = joinTailwindClasses(
    "box-border flex shrink-0 w-5 h-5 items-center justify-center  border border-border-input rounded-xs outline-inky-blue focus-visible:outline-2 outline-offset-2",
    rootProps.disabled
      ? "data-checked:bg-text-tertiary data-indeterminate:bg-text-tertiary"
      : "data-checked:bg-inky-blue data-indeterminate:bg-inky-blue"
  );

  const handleChange = (value: TCheckboxState) => {
    if (rootProps.disabled) return;
    rootProps.onCheckedChange?.(value);
  };

  const IndicatorIcon = rootProps.indeterminate ? Minus : Check;

  return (
    <label className={labelClasses}>
      <BaseCheckbox.Root className={rootClasses} {...rootProps} aria-label={label} onCheckedChange={handleChange}>
        <BaseCheckbox.Indicator className="flex items-center justify-center text-white">
          <IndicatorIcon size={16} aria-hidden={true} />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {label}
    </label>
  );
};
