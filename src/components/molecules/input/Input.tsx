import { Input as BaseInput } from "@base-ui-components/react";
import { Icon, IconName, iconNames } from "@/components/atoms/icon/Icon";
import { joinTailwindClasses } from "@/utils/tailwind";
import { Dispatch, SetStateAction, useMemo } from "react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  clearable?: boolean;
  containerClasses?: string;
  color?: "brand" | "mono";
  icon?: IconName | React.ReactNode;
  iconOnLeft?: boolean;
  inputClasses?: string;
  size?: "small" | "medium" | "large";
  valueSetter?: Dispatch<SetStateAction<string>>;
}

const isIconName = (icon: unknown): icon is IconName => iconNames.includes(icon as IconName);

export const Input = ({
  className: _className,
  clearable = false,
  color = "brand",
  containerClasses = "",
  icon,
  iconOnLeft = false,
  inputClasses = "",
  size = "medium",
  valueSetter,
  ...props
}: InputProps) => {
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
        textSize = "text-base";
        inputPadding = "px-2 py-3.5";
        iconPadding = "p-2";
        break;
    }

    return {
      button: joinTailwindClasses([iconPadding]),
      container: joinTailwindClasses([
        "w-full px-2 flex flex-row justify-around items-center bg-surface-ui rounded-md focus-within:outline",
        outlineColor,
        containerClasses,
      ]),
      icon: joinTailwindClasses([iconPadding]),
      input: joinTailwindClasses([
        "w-full block bg-transparent border-none focus:shadow-[none] leading-none font-medium text-text-primary placeholder:text-text-tertiary caret-text-brand",
        inputPadding,
        textSize,
        inputClasses,
      ]),
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
    if (valueSetter) valueSetter("");
  };

  return (
    <div className={classes.container}>
      {iconOnLeft && iconNode}
      <BaseInput className={classes.input} {...props} />
      {!iconOnLeft && iconNode}
      {clearable && (
        <button type="button" className={classes.button} onClick={handleClear}>
          <Icon name="close" height="12" width="12" />
        </button>
      )}
    </div>
  );
};
