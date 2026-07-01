import { Input as BaseInput } from "@base-ui/react";
import { X } from "lucide-react";
import { ReactNode } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  clearable?: boolean;
  containerClasses?: string;
  icon?: ReactNode;
  iconSide?: "left" | "right";
  inputClasses?: string;
  onClear?: () => void;
}

export const Input = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  className: _className,
  clearable = false,
  containerClasses = "",
  icon,
  iconSide = "left",
  inputClasses = "",
  onClear,
  value,
  ...props
}: IProps) => {
  const allContainerClasses = joinTailwindClasses(
    "w-full px-2 flex flex-row justify-around items-center bg-bg-flat rounded-md outline-inky-blue -outline-offset-1 focus-within:outline",
    containerClasses
  );
  const allInputClasses = joinTailwindClasses(
    "flex-1 p-1 bg-transparent border-none text-xs text-text-primary font-medium leading-6 placeholder:text-text-tertiary caret-text-inky-blue focus:shadow-[none]",
    inputClasses
  );
  const iconClasses = "flex items-center shrink-0 text-elem-icon";
  const clearButtonClasses = joinTailwindClasses(iconClasses, !value && "hidden", icon && iconSide === "right" && "mr-1");
  const iconWrapper = icon ? <div className={iconClasses}>{icon}</div> : null;

  const handleClear = () => onClear?.();

  return (
    <div className={allContainerClasses}>
      {iconSide === "left" && iconWrapper}
      <BaseInput className={allInputClasses} value={value} {...props} />
      {clearable && (
        <button type="button" className={clearButtonClasses} onClick={handleClear}>
          <X height="14" width="14" />
        </button>
      )}
      {iconSide === "right" && iconWrapper}
    </div>
  );
};
