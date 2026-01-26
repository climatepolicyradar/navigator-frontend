import { useMemo } from "react";

import { joinTailwindClasses } from "@/utils/tailwind";

export type TButtonColor = "brand" | "mono";
export type TButtonVariant = "solid" | "faded" | "outlined" | "ghost";

interface IButtonClassArgs {
  className?: string;
  color?: TButtonColor;
  content?: "text" | "icon" | "both";
  disabled?: boolean;
  size?: "x-small" | "small" | "medium" | "large";
  rounded?: boolean;
  variant?: TButtonVariant;
}

type TProps = IButtonClassArgs & React.ComponentProps<"button">;

export const getButtonClasses = ({
  className,
  color = "brand",
  content = "text",
  disabled = false,
  rounded = false,
  size = "medium",
  variant = "solid",
}: IButtonClassArgs) => {
  const baseClasses =
    "flex flex-row items-center justify-center leading-3.5 font-medium transition duration-200 focus-visible:outline-2 outline-offset-2";

  /* Colour */

  let bgColor = color === "brand" ? "bg-surface-brand hocus:bg-surface-brand-dark" : "bg-surface-mono hocus:bg-surface-mono-dark";
  let textColor = "text-text-light";

  if (variant)
    switch (variant) {
      case "faded":
        bgColor = color === "brand" ? "bg-surface-brand/16 hocus:bg-surface-brand/32" : "bg-surface-mono/8 hocus:bg-surface-mono/16";
        textColor = color === "brand" ? "text-cpr-blue" : "text-text-primary";
        break;
      case "outlined":
      case "ghost":
        bgColor = "bg-transparent hover:bg-surface-ui";
        textColor = color === "brand" ? "text-cpr-blue" : "text-text-primary";
        break;
    }

  if (disabled) {
    bgColor = "bg-surface-ui";
    textColor = "text-text-tertiary";
  }

  /* Shape */

  const border = variant === "outlined" ? "border border-border-light" : "";
  const outlineColor = color === "brand" ? "outline-surface-brand-dark" : "outline-surface-mono-dark";
  const roundness = rounded ? "rounded-full" : "rounded-md";

  /* Size */

  let textSize = "";

  const isIcon = content === "icon";
  const layout = content === "both" ? "gap-2" : "";
  let sizing = "";

  switch (size) {
    case "x-small":
      sizing = isIcon ? "w-7 h-7" : "px-2 py-1";
      textSize = "text-xs";
      break;
    case "small":
      sizing = isIcon ? "w-7 h-7" : "px-2.5 py-2.25";
      textSize = "text-sm";
      break;
    case "medium":
      sizing = isIcon ? "w-9 h-9" : "px-4 py-3";
      textSize = "text-sm";
      break;
    case "large":
      sizing = isIcon ? "w-12 h-12" : "px-4 py-5";
      textSize = "text-sm";
      break;
  }

  /* Interaction */

  const cursor = disabled ? "pointer-events-none" : "";

  return joinTailwindClasses(baseClasses, layout, sizing, textSize, bgColor, border, outlineColor, roundness, textColor, cursor, className);
};

export const Button = ({
  children,
  className,
  color = "brand",
  content = "text",
  disabled = false,
  size = "medium",
  rounded = false,
  variant = "solid",
  ...props
}: TProps) => {
  const classes = useMemo(
    () =>
      getButtonClasses({
        className,
        color,
        content,
        disabled,
        size,
        rounded,
        variant,
      }),
    [className, color, content, disabled, size, rounded, variant]
  );

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
