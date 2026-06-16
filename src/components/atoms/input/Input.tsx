import { Input as BaseInput } from "@base-ui/react";
import { X } from "lucide-react";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  containerClasses?: string;
  inputClasses?: string;
  onClear?: () => void;
}

export const Input = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  className: _className,
  containerClasses = "",
  inputClasses = "",
  onClear,
  value,
  ...props
}: IProps) => {
  const allContainerClasses = joinTailwindClasses(
    "w-full px-2 flex flex-row justify-around items-center bg-bg-flat rounded-md outline-inky-blue focus-within:outline",
    containerClasses
  );
  const allInputClasses = joinTailwindClasses(
    "flex-1 p-1 bg-transparent border-none text-xs text-text-primary font-medium leading-6 placeholder:text-text-tertiary caret-text-inky-blue focus:shadow-[none]",
    inputClasses
  );
  const buttonClasses = joinTailwindClasses("shrink-0 text-elem-icon", !value && "hidden");

  const handleClear = () => onClear?.();

  return (
    <div className={allContainerClasses}>
      <BaseInput className={allInputClasses} value={value} {...props} />
      <button type="button" className={buttonClasses} onClick={handleClear}>
        <X height="14" width="14" />
      </button>
    </div>
  );
};
