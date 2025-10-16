import { Input as BaseInput } from "@base-ui-components/react";
import { useMemo } from "react";

import { Icon, TIconName, iconNames } from "@/components/atoms/icon/Icon";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  clearable?: boolean;
  containerClasses?: string;
  color?: "brand" | "mono";
  icon?: TIconName | React.ReactNode;
  iconOnLeft?: boolean;
  inputClasses?: string;
  onClear?: () => void;
  size?: "small" | "medium" | "large";
}

const isIconName = (icon: unknown): icon is TIconName => iconNames.includes(icon as TIconName);

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

    const outlineColor = color === "brand" ? "focus-within:outline-border-brand" : "focus-within:outline-border-mono";

    /* Size */

    let textSize = "text-sm";
    let inputPadding = "px-1.5 py-2.5";
    let iconPadding = "p-1.5";

    switch (size) {
      case "small":
        textSize = "text-xs";
        break;
      case "large":
        textSize = "text-lg";
        inputPadding = "px-2 py-3.5";
        iconPadding = "p-2";
        break;
    }

    return {
      button: joinTailwindClasses("shrink-0 text-icon-standard", iconPadding),
      container: joinTailwindClasses(
        "w-full px-2 flex flex-row justify-around items-center bg-surface-ui rounded-md focus-within:outline",
        outlineColor,
        containerClasses
      ),
      icon: joinTailwindClasses("shrink-0", iconPadding),
      input: joinTailwindClasses(
        "w-full block bg-transparent border-none focus:shadow-[none] leading-none font-medium text-text-primary placeholder:text-text-tertiary caret-text-brand",
        inputPadding,
        textSize,
        inputClasses
      ),
    };
  }, [color, containerClasses, inputClasses, size]);

  let iconNode: React.ReactNode = null;
  if (icon) {
    iconNode = isIconName(icon) ? (
      <div className={classes.icon}>
        <Icon name={icon} height="16" width="16" />
      </div>
    ) : (
      icon
    );
  }

  const handleClear = () => {
    onClear?.();
  };

  return (
    <div className={classes.container}>
      {iconOnLeft && iconNode}
      <BaseInput className={classes.input} value={value} {...props} />
      {clearable && (
        <button type="button" className={`${classes.button} ${value ? "" : "hidden"}`} onClick={handleClear}>
          <Icon name="close" height="12" width="12" />
        </button>
      )}
      {!iconOnLeft && iconNode}
    </div>
  );
};
