import { Input as BaseInput } from "@base-ui-components/react";
import { LucideIcon, LucideX } from "lucide-react";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  className?: never;
  clearable?: boolean;
  containerClasses?: string;
  Icon?: LucideIcon;
  iconButtonType?: "button" | "submit";
  inputClasses?: string;
  onClear?: () => void;
  onIconClick?: (value: string) => void;
  value?: string;
}

export const Input = ({
  clearable = false,
  containerClasses = "",
  Icon,
  iconButtonType = "button",
  inputClasses = "",
  onClear,
  onIconClick,
  value,
  ...props
}: IProps) => {
  // TODO final focus-within border colour
  const allContainerClasses = joinTailwindClasses(
    "h-8 px-1 border border-border-light rounded-md flex items-center focus-within:border-text-quaternary",
    containerClasses
  );
  const allInputClasses = joinTailwindClasses(
    "block flex-1 px-1 py-1.5 text-sm text-text-primary leading-none placeholder:text-text-tertiary bg-transparent border-none focus:shadow-[none]",
    inputClasses
  );

  const iconClasses = "p-1 text-text-tertiary shrink-0";
  const iconHasButton = iconButtonType === "submit" || Boolean(onIconClick);
  const handleIconClick = () => {
    onIconClick?.(value);
  };

  return (
    <div className={allContainerClasses}>
      {Icon &&
        (iconHasButton ? (
          <button type={iconButtonType} onClick={handleIconClick} className={iconClasses}>
            <Icon size={16} />
          </button>
        ) : (
          <div className={iconClasses}>
            <Icon size={16} />
          </div>
        ))}
      <BaseInput className={allInputClasses} value={value} {...props} />
      {clearable && (
        <button type="button" onClick={onClear} className={iconClasses}>
          <LucideX size={16} />
        </button>
      )}
    </div>
  );
};
