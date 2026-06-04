import { Input as BaseInput } from "@base-ui/react";
import { X } from "lucide-react";
import { useMemo } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  clearable?: boolean;
  containerClasses?: string;
  color?: "brand" | "mono";
  icon?: React.ReactNode;
  iconOnLeft?: boolean;
  inputClasses?: string;
  onClear?: () => void;
  size?: "small" | "medium" | "large";
}

export const Input = ({
  className: _className,
  clearable = false,
  color = "brand",
  containerClasses = "",
  icon,
  iconOnLeft = false,
  inputClasses = "",
  size = "medium",
  onClear,
  value,
  ...props
}: IProps) => {
  const classes = useMemo(() => {
    /* Colour */

    const outlineColor = color === "brand" ? "focus-within:outline-[#005eeb]" : "focus-within:outline-border-normal";

    /* Size */

    let textSize = "text-sm";
    let inputPadding = "px-1.5 py-2.5";
    let iconPadding = "p-1.5";

    switch (size) {
      case "small":
        textSize = "text-xs";
        break;
      case "large":
        textSize = "text-base";
        inputPadding = "px-2 py-3.5";
        iconPadding = "p-2";
        break;
    }

    return {
      button: joinTailwindClasses("shrink-0 text-elem-icon", iconPadding),
      container: joinTailwindClasses(
        "w-full px-2 flex flex-row justify-around items-center bg-[#f5f5f5] rounded-md focus-within:outline",
        outlineColor,
        containerClasses
      ),
      icon: joinTailwindClasses("shrink-0", iconPadding),
      input: joinTailwindClasses(
        "w-full block bg-transparent border-none focus:shadow-[none] leading-none font-medium text-text-primary placeholder:text-text-tertiary caret-text-[#0038a9]",
        inputPadding,
        textSize,
        inputClasses
      ),
    };
  }, [color, containerClasses, inputClasses, size]);

  const handleClear = () => {
    onClear?.();
  };

  return (
    <div className={classes.container}>
      {iconOnLeft && icon}
      <BaseInput className={classes.input} value={value} {...props} />
      {clearable && (
        <button type="button" className={`${classes.button} ${value ? "" : "hidden"}`} onClick={handleClear}>
          <X height="14" width="14" />
        </button>
      )}
      {!iconOnLeft && icon}
    </div>
  );
};
