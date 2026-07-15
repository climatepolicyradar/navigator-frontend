import { Checkbox as BaseCheckbox } from "@base-ui/react";
import { Check, Minus } from "lucide-react";
import { ReactNode, useId } from "react";

import { TCheckboxState } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps extends BaseCheckbox.Root.Props {
  children: ReactNode;
  className?: string;
  noClickLabel?: boolean;
  onCheckedChange: (value: TCheckboxState) => void;
}

export const Checkbox = ({ children: label, className, noClickLabel, ...rootProps }: IProps) => {
  const labelId = useId();

  const wrapperClasses = joinTailwindClasses(
    "flex gap-3 items-center text-sm font-normal leading-5",
    rootProps.disabled ? "text-text-tertiary cursor-not-allowed" : "text-text-primary",
    !noClickLabel && !rootProps.disabled && "cursor-pointer",
    noClickLabel && !rootProps.disabled && "select-none",
    className
  );
  const rootClasses = joinTailwindClasses(
    "box-border flex shrink-0 w-5 h-5 items-center justify-center border border-border-input rounded-xs outline-inky-blue focus-visible:outline-2 outline-offset-2",
    rootProps.disabled
      ? "data-checked:bg-text-tertiary data-indeterminate:bg-text-tertiary"
      : "data-checked:bg-inky-blue data-indeterminate:bg-inky-blue",
    noClickLabel && !rootProps.disabled && "cursor-pointer"
  );

  const handleChange = (value: TCheckboxState) => {
    if (rootProps.disabled) return;
    rootProps.onCheckedChange?.(value);
  };

  const IndicatorIcon = rootProps.indeterminate ? Minus : Check;
  const Wrapper = noClickLabel ? "div" : "label";

  return (
    <Wrapper className={wrapperClasses}>
      <BaseCheckbox.Root className={rootClasses} aria-labelledby={noClickLabel ? labelId : undefined} {...rootProps} onCheckedChange={handleChange}>
        <BaseCheckbox.Indicator className="flex items-center justify-center text-white">
          <IndicatorIcon size={16} aria-hidden={true} />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {noClickLabel ? <span id={labelId}>{label}</span> : label}
    </Wrapper>
  );
};
